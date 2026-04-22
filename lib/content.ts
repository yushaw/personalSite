import fs from "fs";
import path from "path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const contentDir = path.join(process.cwd(), "content/writing");

export interface TocItem {
  id: string;
  level: number;
  text: string;
}

export interface Article {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
  content: string;
  headings: TocItem[];
}

export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  pinned: boolean;
}

function getMarkdownFiles(): string[] {
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
}

export function getAllArticles(): ArticleMeta[] {
  const files = getMarkdownFiles();

  const articles = files
    .map((filename) => {
      const filePath = path.join(contentDir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      if (data.draft) return null;

      return {
        slug: filename.replace(/\.md$/, ""),
        title: data.title || "Untitled",
        date: data.date || "",
        description: data.description || "",
        tags: data.tags || [],
        pinned: data.pinned || false,
      };
    })
    .filter(Boolean) as ArticleMeta[];

  return articles.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getArticle(slug: string): Promise<Article | null> {
  const filePath = path.join(contentDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content: rawContent } = matter(fileContent);

  if (data.draft) return null;

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(rawContent);

  // Extract headings (h2, h3) with IDs matching rehype-slug
  const slugger = new GithubSlugger();
  const headings: TocItem[] = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(rawContent)) !== null) {
    const text = match[2].replace(/\*\*(.+?)\*\*/g, "$1").replace(/`(.+?)`/g, "$1").trim();
    headings.push({
      id: slugger.slug(text),
      level: match[1].length,
      text,
    });
  }

  return {
    slug,
    title: data.title || "Untitled",
    date: data.date || "",
    description: data.description || "",
    tags: data.tags || [],
    draft: data.draft || false,
    content: String(result),
    headings,
  };
}

export function getArticleSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}

export function groupArticlesByYear(
  articles: ArticleMeta[]
): Record<string, ArticleMeta[]> {
  const groups: Record<string, ArticleMeta[]> = {};
  for (const article of articles) {
    const year = new Date(article.date).getFullYear().toString();
    if (!groups[year]) groups[year] = [];
    groups[year].push(article);
  }
  return groups;
}
