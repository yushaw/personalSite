"use client";

import { LightboxImage } from "@/components/lightbox";

const items = [
  {
    name: "Photography",
    gear: "Sony A7C2 + FE 40mm f/2.5",
    note: "The kind of setup you'd actually bring downstairs after dinner.",
    image: "/play/photography.webp",
  },
  {
    name: "HiFi",
    gear: "Shanling Regal + iBasso DC04U + iPhone 15 Pro Max",
    note: "Portable setup. Good enough to hear things you didn't know were in the song.",
    image: "/play/hifi.webp",
  },
];

export function PlayContent() {
  return (
    <div className="py-12">
      <h1 className="font-heading text-[36px] font-normal mb-10">
        Play
      </h1>

      <div className="space-y-10">
        {items.map((item) => (
          <div key={item.name}>
            <h2 className="text-[15px] text-text mb-1">
              {item.name}
            </h2>
            <p className="text-[13px] text-muted/60 mb-1">
              {item.gear}
            </p>
            <p className="text-[14px] text-muted leading-relaxed">
              {item.note}
            </p>
            {item.image && (
              <LightboxImage
                src={item.image}
                alt={item.name}
                className="w-full max-h-[360px] object-cover rounded-lg mt-4"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
