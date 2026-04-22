"use client";

import { LightboxImage } from "@/components/lightbox";
import { Gallery } from "@/components/gallery";
import { playItems, galleryPhotos } from "@/lib/play-data";

export function PlayContent() {
  return (
    <div className="py-12">
      <h1 className="font-heading text-[36px] font-normal mb-10">
        Play
      </h1>

      <div className="space-y-10">
        {playItems.map((item) => (
          <div key={item.name}>
            <h2 className="text-[15px] text-text mb-1">{item.name}</h2>
            <p className="text-[13px] text-muted/60 mb-1">{item.gear}</p>
            <p className="text-[14px] text-muted leading-relaxed">
              {item.note}
            </p>
            <div className="mt-4">
              <LightboxImage
                src={item.image}
                alt={item.name}
                width={item.width}
                height={item.height}
                className="w-full max-h-[360px] object-cover rounded-lg"
              />
            </div>
          </div>
        ))}

        {/* Gallery */}
        <div id="gallery">
          <h2 className="text-[15px] text-text mb-4">Gallery</h2>
          <Gallery images={galleryPhotos} />
        </div>
      </div>
    </div>
  );
}
