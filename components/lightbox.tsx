"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface LightboxImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function LightboxImage({ src, alt, className }: LightboxImageProps) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [closing, setClosing] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className} cursor-zoom-in transition-opacity duration-150 hover:opacity-90`}
        loading="lazy"
        onClick={() => {
          setOpen(true);
          setLoaded(false);
        }}
      />

      {open && (
        <div
          ref={backdropRef}
          className={`fixed inset-0 z-50 flex items-center justify-center cursor-zoom-out transition-all duration-200 ${
            closing ? "bg-black/0" : "bg-black/85"
          }`}
          onClick={close}
        >
          {/* Close hint */}
          <button
            onClick={close}
            className={`absolute top-6 right-6 text-white/60 hover:text-white transition-opacity duration-200 ${
              closing ? "opacity-0" : "opacity-100"
            }`}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Image */}
          <img
            src={src}
            alt={alt}
            className={`max-w-[92vw] max-h-[92vh] object-contain rounded-lg shadow-2xl transition-all duration-200 ${
              closing
                ? "opacity-0 scale-95"
                : loaded
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            onLoad={() => setLoaded(true)}
          />
        </div>
      )}
    </>
  );
}
