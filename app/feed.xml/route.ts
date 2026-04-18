import { Feed } from "feed";
import { getAllArticles } from "@/lib/content";

export const dynamic = "force-static";

export async function GET() {
  const articles = getAllArticles();

  const feed = new Feed({
    title: "Charlie Yu Xiao",
    description: "Words to Actions. Writing about AI product design, engineering decisions, and shipping.",
    id: "https://xiaoyu.io/",
    link: "https://xiaoyu.io/",
    language: "en",
    copyright: `All rights reserved ${new Date().getFullYear()}, Charlie Yu Xiao`,
    author: {
      name: "Charlie Yu Xiao",
      email: "shawonline@gmail.com",
      link: "https://xiaoyu.io",
    },
  });

  for (const article of articles) {
    feed.addItem({
      title: article.title,
      id: `https://xiaoyu.io/writing/${article.slug}`,
      link: `https://xiaoyu.io/writing/${article.slug}`,
      description: article.description,
      date: new Date(article.date),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
