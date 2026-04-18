# xiaoyu.io

Personal website. Built with Next.js, Tailwind CSS, deployed to Cloudflare Pages.

## Development

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Static export to ./out
```

## Writing

Articles live in `content/writing/` as plain `.md` files with frontmatter:

```markdown
---
title: "Article Title"
date: "2026-04-18"
description: "Brief description."
tags: ["ai-product-design"]
draft: false
---

Article content in standard markdown.
```

- Copy `content/writing/_template.md` to start a new article
- Set `draft: true` to hide from production
- Push to main branch to deploy

## Project structure

```
app/                    Next.js app router pages
  writing/              Writing list + [slug] detail
  projects/             Projects page
  about/                About page
  feed.xml/             RSS feed
components/             Shared components (nav, footer, theme toggle)
content/writing/        Markdown articles
lib/                    Content pipeline + utilities
```

## Tech stack

- Next.js 16 (static export)
- Tailwind CSS v4
- Geist font family
- gray-matter + unified/remark/rehype for markdown
- next-themes for dark mode
- Cloudflare Pages for hosting

## Design

- Paco Coursey (paco.me) inspired aesthetic: minimal, typographic, restrained
- Brian Lovin (brianlovin.com) inspired content structure: Writing + Projects + About
- 640px max-width, generous whitespace, Geist Sans + Mono

## Log

- 2026-04-18: Initial setup. Next.js project with full page structure (home, writing, projects, about), markdown content pipeline, dark mode, RSS feed, SEO meta tags. Design system based on Paco Coursey's aesthetic. Ready for Cloudflare Pages deployment.
