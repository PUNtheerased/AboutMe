import {
  CtaBand,
  HeroFloatingCards,
  TwoWays,
} from "@/components/home/hero-floating-cards";
import { getPhotos } from "@/lib/photos";

export default async function HomePage() {
  const photos = await getPhotos();
  return (
    <>
      <HeroFloatingCards featured={photos} />
      <TwoWays />
      <CtaBand />
    </>
  );
}
