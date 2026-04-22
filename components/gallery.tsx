"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { LightboxOverlay } from "./lightbox-overlay";

interface GalleryImage {
  src: string;
  width: number;
  height: number;
}

interface GalleryProps {
  images: GalleryImage[];
}

export function Gallery({ images }: GalleryProps) {
  const [current, setCurrent] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Set<number>>(new Set());
  const [thumbLoaded, setThumbLoaded] = useState<Set<number>>(new Set());
  const thumbRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    thumbRefs.current.forEach((img, i) => {
      if (img?.complete) {
        setThumbLoaded((prev) => new Set(prev).add(i));
      }
    });
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c === null ? null : c === 0 ? images.length - 1 : c - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c === null ? null : c === images.length - 1 ? 0 : c + 1));
  }, [images.length]);

  const close = useCallback(() => {
    setCurrent(null);
    setLoaded(new Set());
  }, []);

  return (
    <>
      <div className="columns-2 gap-2 space-y-2">
        {images.map((img, i) => (
          <div
            key={img.src}
            className={`break-inside-avoid rounded-lg overflow-hidden ${
              thumbLoaded.has(i) ? "" : "img-loading"
            }`}
          >
            <img
              ref={(el) => { thumbRefs.current[i] = el; }}
              src={img.src}
              alt=""
              width={img.width}
              height={img.height}
              className={`w-full cursor-zoom-in transition-all duration-200 ease-out ${
                thumbLoaded.has(i) ? "opacity-100 hover:brightness-[1.03]" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => setThumbLoaded((prev) => new Set(prev).add(i))}
              onClick={() => setCurrent(i)}
            />
          </div>
        ))}
      </div>

      {current !== null && (
        <LightboxOverlay
          onClose={close}
          onPrev={prev}
          onNext={next}
          counter={`${current + 1} / ${images.length}`}
        >
          <img
            src={images[current].src}
            alt=""
            className={`max-w-[92vw] max-h-[92vh] object-contain rounded-lg shadow-2xl transition-opacity duration-200 ${
              loaded.has(current) ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded((prev) => new Set(prev).add(current))}
          />
        </LightboxOverlay>
      )}
    </>
  );
}
