import type { Metadata } from "next";

import { HeroSlider } from "@/components/home/HeroSlider";
import { FeaturedBooks } from "@/components/home/featured-books";
import { CategorySection } from "@/components/home/category-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { ReadingRoomCta } from "@/components/home/reading-room-cta";
import { PageTitle } from "@/components/shared/page-title";

export const metadata: Metadata = {
  title: "BookNook | Home",
  description:
    "BookNook is a small online library for the neighbourhood. Add a book, borrow a book, return a book.",
};

export default function HomePage() {
  return (
    <>
      <PageTitle title="Home" />
      <HeroSlider />
      <FeaturedBooks />
      <CategorySection />
      <HowItWorks />
      <ReadingRoomCta />
    </>
  );
}
