"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const labelMap: Record<string, string> = {
  "/": "Home",
  "/writing": "Writing",
  "/projects": "Projects",
  "/play": "Play",
  "/about": "About",
};

export function BackLink({ fallback = "/writing" }: { fallback?: string }) {
  const router = useRouter();
  const [label, setLabel] = useState(labelMap[fallback] || "Back");
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    const prev = sessionStorage.getItem("nav:prev");
    if (prev) {
      for (const [prefix, name] of Object.entries(labelMap)) {
        if (prev === prefix || (prefix !== "/" && prev.startsWith(prefix + "/"))) {
          setLabel(name);
          break;
        }
      }
      setHasPrev(true);
    }
  }, []);

  return (
    <button
      onClick={() => {
        if (hasPrev) {
          router.back();
        } else {
          router.push(fallback);
        }
      }}
      className="text-sm text-muted hover:text-text transition-colors duration-150 cursor-pointer"
    >
      &larr; {label}
    </button>
  );
}
