"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface LightboxOverlayProps {
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  counter?: string;
  children: React.ReactNode;
}

export function LightboxOverlay({
  onClose,
  onPrev,
  onNext,
  counter,
  children,
}: LightboxOverlayProps) {
  const [closing, setClosing] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => onClose(), 200);
  }, [onClose]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [close, onPrev, onNext]);

  // Touch swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    touchStart.current = null;

    if (absDx < 40 && absDy < 40) return; // tap, not swipe

    if (absDx > absDy) {
      // Horizontal swipe
      if (dx < -40 && onNext) onNext();
      else if (dx > 40 && onPrev) onPrev();
    } else {
      // Vertical swipe down to close
      if (dy > 60) close();
    }
  }, [onPrev, onNext, close]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center select-none cursor-zoom-out transition-all duration-200 ${
        closing ? "bg-black/0" : "bg-black/85"
      }`}
      onClick={close}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close */}
      <button
        onClick={close}
        className={`absolute top-4 right-4 p-3 z-10 text-white/60 hover:text-white transition-colors duration-200 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        aria-label="Close"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Prev */}
      {onPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className={`absolute left-0 top-0 h-full w-16 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors duration-200 cursor-pointer ${
            closing ? "opacity-0" : "opacity-100"
          }`}
          aria-label="Previous"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Next */}
      {onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className={`absolute right-0 top-0 h-full w-16 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors duration-200 cursor-pointer ${
            closing ? "opacity-0" : "opacity-100"
          }`}
          aria-label="Next"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Counter */}
      {counter && (
        <span
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-mono transition-opacity duration-200 ${
            closing ? "opacity-0" : "opacity-100"
          }`}
        >
          {counter}
        </span>
      )}

      {/* Content */}
      <div
        className={`transition-all duration-200 ${
          closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
