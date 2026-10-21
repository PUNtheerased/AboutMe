export type SamplePhoto = {
  id: string;
  title: string;
  category: string;
  caption?: string;
  takenAt?: string;
  camera?: string;
  lens?: string;
  iso?: number;
  aperture?: string;
  shutter?: string;
  imageUrl?: string;
  storagePath?: string;
  gradient: string;
  width: number;
  height: number;
  blurDataUrl?: string;
  featured: boolean;
  sortOrder: number;
};

export const samplePhotos: SamplePhoto[] = [
  {
    id: "1",
    title: "Golden hour",
    category: "Street",
    caption: "Warm light on a quiet walk.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    gradient: "linear-gradient(160deg,#FFB38A,#FF6F91)",
    width: 900,
    height: 1200,
    featured: true,
    sortOrder: 0,
  },
  {
    id: "2",
    title: "Rooftop blues",
    category: "Landscape",
    caption: "City haze after class.",
    imageUrl:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=900&q=80",
    gradient: "linear-gradient(160deg,#7BD8FF,#3B5BFF)",
    width: 900,
    height: 1200,
    featured: true,
    sortOrder: 1,
  },
  {
    id: "3",
    title: "Quiet corners",
    category: "Street",
    imageUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=80",
    gradient: "linear-gradient(160deg,#C8F7D8,#2FB58A)",
    width: 900,
    height: 1200,
    featured: true,
    sortOrder: 2,
  },
  {
    id: "4",
    title: "Night sky",
    category: "Landscape",
    caption: "AstroShutter-style hush.",
    imageUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
    gradient: "linear-gradient(160deg,#1B1F3B,#5B6CFF)",
    width: 900,
    height: 1200,
    featured: true,
    sortOrder: 3,
  },
  {
    id: "5",
    title: "Portrait no.1",
    category: "Portrait",
    imageUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80",
    gradient: "linear-gradient(160deg,#E7B8FF,#7A4DFF)",
    width: 900,
    height: 1200,
    featured: true,
    sortOrder: 4,
  },
  {
    id: "6",
    title: "Night market",
    category: "Travel",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(160deg,#FF9A8B,#4A3AFF)",
    width: 1200,
    height: 800,
    featured: true,
    sortOrder: 5,
  },
  {
    id: "7",
    title: "Astro hush",
    category: "Landscape",
    caption: "Placeholder for AstroShutter sky work.",
    camera: "Mirrorless",
    iso: 1600,
    aperture: "f/1.8",
    shutter: "8s",
    imageUrl:
      "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(160deg,#1B1F3B,#5B6CFF)",
    width: 1200,
    height: 800,
    featured: true,
    sortOrder: 6,
  },
  {
    id: "8",
    title: "Soft rain",
    category: "Street",
    imageUrl:
      "https://images.unsplash.com/photo-1428908728789-d78ea335200f?auto=format&fit=crop&w=900&q=80",
    gradient: "linear-gradient(160deg,#A8C0FF,#3F2B96)",
    width: 900,
    height: 1200,
    featured: true,
    sortOrder: 7,
  },
  {
    id: "9",
    title: "Harbor glow",
    category: "Travel",
    imageUrl:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=80",
    gradient: "linear-gradient(160deg,#FFE48A,#FF6F91)",
    width: 900,
    height: 1200,
    featured: true,
    sortOrder: 8,
  },
  {
    id: "10",
    title: "Forest path",
    category: "Landscape",
    imageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
    gradient: "linear-gradient(160deg,#5ED6B0,#3B5BFF)",
    width: 900,
    height: 1200,
    featured: true,
    sortOrder: 9,
  },
];
