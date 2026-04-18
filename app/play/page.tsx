import { createMetadata } from "@/lib/metadata";
import { PlayContent } from "./content";

export const metadata = createMetadata({
  title: "Play",
  description: "Photography, HiFi, and things I enjoy outside of work.",
  path: "/play",
});

export default function PlayPage() {
  return <PlayContent />;
}
