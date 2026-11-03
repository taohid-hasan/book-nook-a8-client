import type { Metadata } from "next";

import { HeroSlider } from "@/components/home/HeroSlider";
import { HowBorrowingWorks } from "@/components/home/HowBorrowingWorks";
import { NewArrivals } from "@/components/home/NewArrivals";
import { TopCategories } from "@/components/home/TopCategories";
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
      <NewArrivals />
      <HowBorrowingWorks />
      <TopCategories />
    </>
  );
}
