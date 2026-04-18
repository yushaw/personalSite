import Link from "next/link";
import { getAllArticles } from "@/lib/content";
import { PlaySection } from "@/components/play-section";

function formatMonth(dateStr: string): string {
  const d = new Date(dateStr);
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${month} ${year}`;
}

export default function Home() {
  const articles = getAllArticles().slice(0, 8);

  return (
    <div className="py-12">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="font-heading text-[40px] font-normal mb-1">
          Yu Xiao
        </h1>
        <p className="font-heading text-lg italic text-muted mb-4">
          Words to Actions.
        </p>
        <p className="text-[15px] text-muted leading-relaxed">
          Building AI products. Writing about product design, engineering decisions, and the craft of shipping.
        </p>
      </section>

      {/* Writing */}
      <section className="mb-12">
        <Link
          href="/writing"
          className="text-xs font-medium uppercase tracking-[0.05em] text-muted hover:text-text transition-colors duration-150 mb-3 inline-block"
        >
          Writing
        </Link>
        {articles.length > 0 ? (
          <ul>
            {articles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/writing/${article.slug}`}
                  className="group flex items-baseline justify-between gap-4 -mx-3 px-3 py-1.5 rounded-md hover:bg-hover transition-colors duration-150"
                >
                  <span className="text-[15px] text-muted group-hover:text-text transition-colors duration-150">
                    {article.title}
                  </span>
                  <span className="text-[13px] font-mono text-muted shrink-0">
                    {formatMonth(article.date)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Coming soon.</p>
        )}
      </section>

      {/* Projects */}
      <section className="mb-12">
        <Link
          href="/projects"
          className="text-xs font-medium uppercase tracking-[0.05em] text-muted hover:text-text transition-colors duration-150 mb-3 inline-block"
        >
          Projects
        </Link>
        <ul>
          {[
            { name: "Sanqian", desc: "Your desktop Agent orchestration hub.", url: "https://sanqian.ai" },
            { name: "Note", desc: "A note-taking app for deep thinking.", url: "https://sanqian.ai/note" },
            { name: "Todo", desc: "Minimal todo with outline thinking.", url: "https://sanqian.ai/todo" },
            { name: "Sati", desc: "AI agent for browser and Office.", url: "https://sanqian.ai/sati" },
          ].map((p) => (
            <li key={p.name}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block -mx-3 px-3 py-1.5 rounded-md hover:bg-hover transition-colors duration-150"
              >
                <span className="text-[15px] text-muted group-hover:text-text transition-colors duration-150">
                  {p.name}
                </span>
                <span className="text-[13px] text-muted/60 ml-2">
                  {p.desc}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Play */}
      <section>
        <Link
          href="/play"
          className="text-xs font-medium uppercase tracking-[0.05em] text-muted hover:text-text transition-colors duration-150 mb-3 inline-block"
        >
          Play
        </Link>
        <PlaySection />
      </section>
    </div>
  );
}
