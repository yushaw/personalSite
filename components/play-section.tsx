"use client";

import { LightboxImage } from "./lightbox";

const items = [
  {
    name: "Photography",
    gear: "Sony A7C2 + FE 40mm f/2.5",
    image: "/play/photography.webp",
  },
  {
    name: "HiFi",
    gear: "Shanling Regal + iBasso DC04U",
    image: "/play/hifi.webp",
  },
];

export function PlaySection() {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.name}>
          <div className="py-1.5">
            <span className="text-[15px] text-muted">
              {item.name}
            </span>
            <span className="text-[13px] text-muted/60 ml-2">
              {item.gear}
            </span>
          </div>
          {item.image && (
            <LightboxImage
              src={item.image}
              alt={item.name}
              className="w-full max-h-[240px] object-cover rounded-lg mt-2"
            />
          )}
        </div>
      ))}
    </div>
  );
}
