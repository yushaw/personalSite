import type { Metadata } from "next";

export function createMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `https://xiaoyu.io${path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}
