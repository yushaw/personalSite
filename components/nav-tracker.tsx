"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function NavTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const current = sessionStorage.getItem("nav:current");
    if (current && current !== pathname) {
      sessionStorage.setItem("nav:prev", current);
    }
    sessionStorage.setItem("nav:current", pathname);
  }, [pathname]);

  return null;
}
