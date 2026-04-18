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

function getLabelFromReferrer(): string | null {
  try {
    const ref = document.referrer;
    if (!ref) return null;
    const url = new URL(ref);
    if (url.origin !== window.location.origin) return null;
    const path = url.pathname;
    for (const [prefix, label] of Object.entries(labelMap)) {
      if (path === prefix || (prefix !== "/" && path.startsWith(prefix))) {
        return label;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function BackLink({ fallback = "/writing" }: { fallback?: string }) {
  const router = useRouter();
  const [label, setLabel] = useState(labelMap[fallback] || "Back");

  useEffect(() => {
    const fromLabel = getLabelFromReferrer();
    if (fromLabel) setLabel(fromLabel);
  }, []);

  return (
    <button
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallback);
        }
      }}
      className="text-sm text-muted hover:text-text transition-colors duration-150"
    >
      &larr; {label}
    </button>
  );
}
