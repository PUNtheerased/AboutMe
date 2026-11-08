import type { Metadata } from "next";
import { GalleryBrowser } from "@/components/gallery/gallery-browser";
import { getCategories, getPhotos } from "@/lib/photos";

export const revalidate = 60;

export const metadata: Metadata = {
  description: "Photography archive — street, portrait, travel, and more.",
};

export default async function GalleryPage() {
  const [photos, categories] = await Promise.all([
    getPhotos(),
    getCategories(),
  ]);
  return <GalleryBrowser photos={photos} categories={categories} />;
}
