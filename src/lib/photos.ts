import { samplePhotos, type SamplePhoto } from "@/lib/data/sample-photos";
import { createClient } from "@/lib/supabase/server";

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function mapRow(row: Record<string, unknown>): SamplePhoto {
  return {
    id: String(row.id),
    title: String(row.title),
    category: String(row.category ?? "Uncategorized"),
    caption: row.caption ? String(row.caption) : undefined,
    takenAt: row.taken_at ? String(row.taken_at) : undefined,
    camera: row.camera ? String(row.camera) : undefined,
    lens: row.lens ? String(row.lens) : undefined,
    iso: typeof row.iso === "number" ? row.iso : undefined,
    aperture: row.aperture ? String(row.aperture) : undefined,
    shutter: row.shutter ? String(row.shutter) : undefined,
    imageUrl: String(row.image_url),
    storagePath: row.storage_path ? String(row.storage_path) : undefined,
    gradient: "linear-gradient(160deg,#9AA3B2,#3B5BFF)",
    width: Number(row.width) || 1200,
    height: Number(row.height) || 1600,
    blurDataUrl: row.blur_data_url ? String(row.blur_data_url) : undefined,
    featured: Boolean(row.featured),
    sortOrder: Number(row.sort_order) || 0,
  };
}

export async function getPhotos(): Promise<SamplePhoto[]> {
  if (!hasSupabaseEnv()) return samplePhotos;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return samplePhotos;
    return data.map((row) => mapRow(row as Record<string, unknown>));
  } catch {
    return samplePhotos;
  }
}

export async function getFeaturedPhotos(): Promise<SamplePhoto[]> {
  const photos = await getPhotos();
  const featured = photos.filter((p) => p.featured);
  return featured.length ? featured.slice(0, 4) : photos.slice(0, 4);
}

export async function getCategories(): Promise<string[]> {
  const photos = await getPhotos();
  return [...new Set(photos.map((p) => p.category))];
}
