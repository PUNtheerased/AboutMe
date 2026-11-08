import type { Metadata } from "next";
import { AboutContent } from "@/components/about/about-content";

export const metadata: Metadata = {
  description: "About Pun — code, photography, CubeSat, CTF, AstroShutter.",
};

export default function AboutPage() {
  return <AboutContent />;
}
