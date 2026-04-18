# xiaoyu.io

Yu Xiao (Charlie) 的个人网站。

## Design principles

- 禅意、简约、干净、呼吸感
- 每加一个元素先问：去掉会不会更好？
- 不加多余的装饰：无分割线、无 badge、无图标堆砌、无渐变阴影
- 视觉层级通过字号、透明度、字重区分，不靠颜色和边框
- 间距克制统一，靠留白而非线条分隔内容
- 动效只在 hover 和页面进入时使用，时长不超过 200ms
- 参考：Paco Coursey (paco.me) 的设计语言，Brian Lovin (brianlovin.com) 的内容结构

## Typography

- Heading: DM Serif Display (--font-serif) -- 用于页面标题和首页名字
- Body: Instrument Sans (--font-sans) -- 正文、导航、列表
- Mono: Geist Mono (--font-geist-mono) -- 日期、代码
- 字号层级: 40px (名字) > 36px (页面标题) > 15px (正文) > 14px (描述) > 13px (辅助信息)

## Colors

- Light: bg #fafafa, text #171717, muted #737373
- Dark: bg #111111, text #ededed, muted #888888
- 用 muted/60 做更低层级的辅助信息

## Content

- 文章是 .md 文件，放在 content/writing/，frontmatter 支持 title, date, description, tags, pinned, draft
- 不用 MDX

## Tech

- Next.js 16, static export (output: "export")
- Tailwind CSS v4
- Cloudflare Pages 部署
- next-themes 做暗色模式 (attribute: data-theme)
