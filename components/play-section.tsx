"use client";

import Link from "next/link";
import { LightboxImage } from "./lightbox";
import { playItems } from "@/lib/play-data";

export function PlaySection() {
  return (
    <div className="space-y-4">
      {playItems.map((item) => (
        <div key={item.name}>
          <div className="py-1.5 flex items-baseline justify-between">
            <div>
              <span className="text-[15px] text-muted">
                {item.name}
              </span>
              <span className="text-[13px] text-muted/60 ml-2">
                {item.gearShort}
              </span>
            </div>
            {item.name === "Photography" && (
              <Link
                href="/play#gallery"
                className="text-[13px] text-muted/60 hover:text-muted transition-colors duration-150"
              >
                gallery
              </Link>
            )}
          </div>
          <LightboxImage
            src={item.image}
            alt={item.name}
            className="w-full max-h-[240px] object-cover rounded-lg mt-2"
          />
        </div>
      ))}
    </div>
  );
}
