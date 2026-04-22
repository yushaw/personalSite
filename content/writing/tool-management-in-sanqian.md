---
title: "How sanqian Manages Tools"
date: "2026-04-21"
description: "How we went from static tool binding to dynamic discovery in sanqian, and what broke along the way."
tags: ["ai", "agent", "tool-management", "sanqian", "architecture"]
pinned: false
---

When [sanqian](https://sanqian.ai) had 10 tools, we did what everyone does — passed the full list to the model via `llm.bind_tools()`. It worked fine.

At 30 tools, the model started making wrong choices. `notification-send-user` vs. `notification-send-channel` — similar names, similar descriptions, and the model would pick the wrong one often enough to be a real problem. At 50+ tools, after MCP support landed and third-party SDK integrations started growing, it became clear that static binding couldn't scale.

This post is about the system we built to replace it.

## The shape of the problem

The fundamental tension is simple: you want the agent to have access to a large library of tools, but you can't put every tool definition in front of the model at once. When you do, three things go wrong — the model confuses similar tools, you pay for definitions it doesn't need, and intermediate results crowd out reasoning space.

Most frameworks don't address this directly. OpenAI's Assistants API and LangGraph's `bind_tools()` both bind statically — every definition travels in every request. Anthropic's Tool Search Tool (late 2025) does support on-demand discovery, but it's tied to the Claude platform. We needed something that works in our own runtime, so we built one.

## How tools are configured

Every tool starts as a declaration in `tools.yaml`. This is the single source of truth:

```yaml
web_search:
  available: true
  searchable: true
  category: information
  tags: [web, search, internet]
  display:
    en: Web Search
    zh-CN: 网页搜索
  desc:
    en: Search the web and return results
    zh-CN: 搜索网页并返回结果
  platforms: all
  required: false
```

Two things worth noting. Tools declare supported platforms, and unavailable ones won't be exposed to the model. And tools have a `searchable` flag — internal plumbing tools are marked non-searchable so they don't appear in search results.

## How tools from different sources come together

sanqian's tools come from three independent sources, each with its own lifecycle:

| Source | Prefix | Origin |
| --- | --- | --- |
| **Builtin** | (none) | Python modules in `backend/tools/builtin/` |
| **MCP** | `mcp_{server_id}_` | External MCP servers via JSON-RPC |
| **SDK** | `sdk_{app_name}_` | Third-party app integrations |

MCP servers connect and disconnect. SDK apps register and unregister. To make this manageable, all tools — regardless of source — are normalized into a unified `ToolInfo` schema:

```python
@dataclass
class ToolInfo:
    name: str
    description: str
    parameters: dict       # JSON Schema format
    source: str            # "builtin" | "mcp" | "sdk"
    source_id: str | None  # MCP server_id or SDK app_name
    permission_kind: str   # "read" | "write" | "execute" | "network" | "dangerous"
    category: str
    tags: list[str]
    searchable: bool
    platforms: tuple[str, ...]
    enabled: bool
    platform_available: bool
```

The `ToolPool` aggregates these from all sources and listens to an event bus (`TOOLS_UPDATED`) for incremental refreshes — adding one tool to an MCP server doesn't require rebuilding the entire pool.

One practical problem we solved here: MCP and SDK tools don't require their servers or apps to stay connected. The pool reads from `MCPToolsCache` and `SDKToolsCache` — local JSON files that persist tool metadata along with a `config_hash` for invalidation. When an MCP server connects, its tools are cached. When it disconnects, the cached metadata remains in the search index — the agent can still discover the tool. If it tries to call it, sanqian spins up the MCP server (or launches the SDK app) on demand. There's a latency cost, but it works well in practice. Users don't need to keep every server running to benefit from its tools.

## How search works

We went through a few iterations here.

Our first attempt was pure keyword search. It missed semantic matches — "edit photo" doesn't find `generate_image`. So we tried pure vector search. That fixed semantic matching but broke exact name lookups — when the agent already knows it wants `write_file`, vector search returns `create_document` instead.

We needed both precision and recall. We landed on three independent search strategies fused via **Reciprocal Rank Fusion (RRF)**.

1. **LIKE fuzzy matching** — grep-style pattern matching, handles Chinese and English.
2. **BM25 keyword search** — SQLite FTS5 full-text search.
3. **Vector semantic search** — `sqlite-vec` stores tool description embeddings. This is optional — when no embedding API is configured, the index falls back to two-source RRF, which still works for most queries.

The fusion itself has two levels. Queries first go through **query rewriting** — stripping question words and stopwords (a Chinese query like "能不能帮我读文件" becomes "读文件"). Multiple query variants are generated, each with a weight. For each variant, the three sources produce ranked lists fused via RRF (`k=60`), plus bonuses for exact name matches and intent-derived boosts. Then results across variants are fused again in a second RRF pass:

```
# Per-variant fusion (source-level)
RRF_score(d) = Σ 1/(60 + rank_source(d)) + exact_match_bonus + intent_boost

# Cross-variant fusion (query-level)
final_score(d) = Σ variant_weight / (k + rank_variant(d))
```

After fusion, results are truncated via **AutoCut** — a score-jump detection algorithm inspired by [Weaviate's AutoCut](https://weaviate.io/learn/knowledgecards/autocut). When the ratio between adjacent scores exceeds 2.0 (a >50% drop), everything below the jump is cut. This keeps low-confidence results out of the agent's context.

The index doesn't just search tools — it indexes tools, skills (knowledge packages), and agents in a unified schema. A single `search_capability` call can return any of these.

A few infrastructure details: the index uses a shadow table pattern for zero-downtime rebuilds (build in a temp table, atomically swap). Embedding results are cached by text hash to avoid redundant API calls. And before results reach the agent, they pass through four filter layers — internal tool blacklist, per-tool searchable flag, agent-level exclusions, and already-bound tool deduplication.

## How discovered tools get executed

The search index can find any tool, but finding it isn't enough — the agent needs to be able to call it. The execution layer (`ApprovalToolNode`, extending LangGraph's `ToolNode`) handles this with a fallback chain:

```
Tool call: "mcp_github_create_pull_request"
  ↓
Check per-request tool dict (ContextVar)
  ↓ (miss)
Check ToolRegistry (builtin tools)
  ↓ (miss)
Check SDK cache (third-party app tools)
  ↓ (miss)
Check MCP session pool (external server tools)
```

This means any tool the agent discovers via search is immediately callable — the fallback chain routes it to the right source. A search result for `mcp_github_create_pull_request` doesn't require pre-configuration; the chain will find the right MCP session and execute it.

## What a typical flow looks like

```
1. Agent receives: "Search for recent papers on tool-augmented LLMs and save a summary"

2. Agent calls search_capability("web search")
   -> returns: web_search (score: 0.95)
   -> tool definition loaded into context

3. Agent calls web_search("tool-augmented LLMs 2025")
   -> executes, results returned

4. Agent calls search_capability("save file")
   -> returns: write_file (0.92), save_memory (0.87)
   -> agent picks write_file

5. Agent calls write_file("outputs/summary.md", content)
   -> executes
```

At no point were all tool definitions loaded into context at once.

## What's next

- **Tool composition hints** — search results that suggest tool combinations ("users who use `web_search` also use `fetch_web`").
- **Cross-language search** — our bilingual metadata works, but semantic search across Chinese and English still has room to improve.

---

Tool management is one of those problems that doesn't feel urgent until it is. We hit the wall at around 50 tools. The system described here is what came out of that.
