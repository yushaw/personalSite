"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import type { TocItem } from "@/lib/content";

const LINE_HEIGHT = 2;
const MAX_GAP = 12;
const MIN_GAP = 1;
const HOVER_DELAY = 200;
const COLLAPSED_MAX_HEIGHT = 360;

interface FloatingTocProps {
  headings: TocItem[];
}

export function FloatingToc({ headings }: FloatingTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const minLevel = useMemo(() => {
    if (headings.length === 0) return 2;
    return Math.min(...headings.map((h) => h.level));
  }, [headings]);

  const getRelativeLevel = useCallback(
    (level: number) => level - minLevel + 1,
    [minLevel]
  );

  const collapsedStyle = useMemo(() => {
    const count = headings.length;
    if (count <= 1) return { gap: MAX_GAP };

    const gapCount = count - 1;
    const totalLineHeight = count * LINE_HEIGHT;
    const heightWithMaxGap = totalLineHeight + MAX_GAP * gapCount;

    if (heightWithMaxGap <= COLLAPSED_MAX_HEIGHT) {
      return { gap: MAX_GAP };
    }

    const availableForGaps = COLLAPSED_MAX_HEIGHT - totalLineHeight;
    const gap = Math.max(MIN_GAP, Math.floor(availableForGaps / gapCount));
    return { gap };
  }, [headings.length]);

  // Track active heading based on scroll position
  useEffect(() => {
    if (headings.length === 0) return;

    const updateActive = () => {
      const targetY = window.innerHeight * 0.4;
      let closestId = headings[0].id;
      let minDistance = Infinity;

      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (!el) continue;
        const distance = Math.abs(el.getBoundingClientRect().top - targetY);
        if (distance < minDistance) {
          minDistance = distance;
          closestId = heading.id;
        }
      }

      setActiveId(closestId);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [headings]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleClick = (item: TocItem) => {
    const el = document.getElementById(item.id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.25;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveId(item.id);
    }
  };

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsExpanded(true);
      requestAnimationFrame(() => {
        if (itemsRef.current && activeId) {
          const activeItem = itemsRef.current.querySelector(
            `[data-id="${activeId}"]`
          );
          activeItem?.scrollIntoView({ block: "center", behavior: "instant" });
        }
      });
    }, HOVER_DELAY);
  }, [activeId]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsExpanded(false);
  }, []);

  if (headings.length <= 1) return null;

  return (
    <div
      ref={containerRef}
      className={`floating-toc ${isExpanded ? "expanded" : "collapsed"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Collapsed: horizontal lines */}
      <div className="floating-toc-lines" style={{ gap: collapsedStyle.gap }}>
        {headings.map((h) => (
          <div
            key={h.id}
            className={`floating-toc-line floating-toc-line-${getRelativeLevel(h.level)} ${activeId === h.id ? "active" : ""}`}
          />
        ))}
      </div>

      {/* Expanded: heading list */}
      <div className="floating-toc-panel">
        <div className="floating-toc-items" ref={itemsRef}>
          {headings.map((h) => (
            <button
              key={h.id}
              data-id={h.id}
              className={`floating-toc-item floating-toc-level-${getRelativeLevel(h.level)} ${activeId === h.id ? "active" : ""}`}
              onClick={() => handleClick(h)}
            >
              {h.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
