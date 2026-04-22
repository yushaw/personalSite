"use client";

import { useState, useEffect, useRef } from "react";
import { LightboxOverlay } from "./lightbox-overlay";

interface LightboxImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function LightboxImage({ src, alt, width, height, className }: LightboxImageProps) {
  const [open, setOpen] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [fullLoaded, setFullLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setThumbLoaded(true);
    }
  }, []);

  return (
    <>
      <div className={`overflow-hidden rounded-lg ${thumbLoaded ? "" : "img-loading"}`}>
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`${className} cursor-zoom-in transition-all duration-200 ease-out ${
            thumbLoaded ? "opacity-100 hover:brightness-[1.03]" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setThumbLoaded(true)}
          onClick={() => setOpen(true)}
        />
      </div>

      {open && (
        <LightboxOverlay onClose={() => { setOpen(false); setFullLoaded(false); }}>
          <img
            src={src}
            alt={alt}
            className={`max-w-[92vw] max-h-[92vh] object-contain rounded-lg shadow-2xl transition-opacity duration-200 ${
              fullLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setFullLoaded(true)}
          />
        </LightboxOverlay>
      )}
    </>
  );
}
