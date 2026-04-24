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
  play/                 Play page (HiFi, Photography, Gallery)
  about/                About page
  feed.xml/             RSS feed
components/             Shared components
  lightbox-overlay.tsx  Shared lightbox overlay (keyboard, touch swipe, close animation)
  lightbox.tsx          Single image lightbox (uses overlay)
  gallery.tsx           Photo gallery with masonry layout (uses overlay)
  floating-toc.tsx      Floating table of contents for articles
content/writing/        Markdown articles
lib/                    Content pipeline + shared data
  content.ts            Markdown processing + heading extraction
  projects-data.ts      Projects list (shared by home + /projects)
  social-links.ts       Social links (shared by footer + /about)
  play-data.ts          Play items + gallery photos (shared by home + /play)
public/play/photos/     Gallery photo assets
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
- 2026-04-22: Add tool-management-in-sanqian article. Add FloatingToc component (minimap sidebar for articles, hover to expand). Add photo gallery with masonry layout and lightbox (prev/next, keyboard, touch swipe). Extract shared data (projects, social links, play items) to lib/. Favicon with circular white background. Remove unused font files and npm dependencies. Sitemap add /play. Title template "Yu Xiao". All transition durations capped at 200ms.
- 2026-04-24: Add codex-background-computer-use article -- how Codex does background computer use on macOS, and building ghostpoke.
