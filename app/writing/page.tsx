import Link from "next/link";
import { getAllArticles, groupArticlesByYear } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Writing",
  description: "Thoughts on AI product design, engineering decisions, and building.",
  path: "/writing",
});

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate();
  return `${month} ${day}`;
}

export default function WritingPage() {
  const articles = getAllArticles();
  const grouped = groupArticlesByYear(articles);
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="py-12">
      <h1 className="font-heading text-[36px] font-normal mb-10">
        Writing
      </h1>

      {years.length === 0 && (
        <p className="text-muted">Coming soon.</p>
      )}

      {years.map((year) => (
        <section key={year} className="mb-10">
          <h2 className="text-xs font-medium uppercase tracking-[0.05em] text-muted mb-3">
            {year}
          </h2>
          <ul>
            {grouped[year].map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/writing/${article.slug}`}
                  className="group flex items-baseline justify-between gap-4 -mx-3 px-3 py-1.5 rounded-md hover:bg-hover transition-colors duration-150"
                >
                  <span className="text-[15px] text-muted group-hover:text-text transition-colors duration-150">
                    {article.title}
                  </span>
                  <span className="text-[13px] font-mono text-muted/60 shrink-0 hidden sm:inline">
                    {formatDate(article.date)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
