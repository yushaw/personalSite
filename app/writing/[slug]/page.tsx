import { notFound } from "next/navigation";
import { getArticle, getArticleSlugs } from "@/lib/content";
import { BackLink } from "@/components/back-link";
import { FloatingToc } from "@/components/floating-toc";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://xiaoyu.io/writing/${slug}`,
      type: "article",
      publishedTime: article.date,
    },
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="py-12">
      <BackLink fallback="/writing" />

      <header className="mt-8 mb-10">
        <h1 className="font-heading text-[28px] font-normal mb-2">
          {article.title}
        </h1>
        <time className="text-sm font-mono text-muted">
          {formatDate(article.date)}
        </time>
      </header>

      <article
        className="prose text-base"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <FloatingToc headings={article.headings} />
    </div>
  );
}
