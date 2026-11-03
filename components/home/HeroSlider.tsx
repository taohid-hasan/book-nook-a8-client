"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Slide {
  eyebrow: string;
  title: string;
  body: string;
  gradient: string;
  art: "shelf" | "lamp" | "moon" | "book";
}

const slides: Slide[] = [
  {
    eyebrow: "The neighbourhood library, online",
    title: "Your next favourite story is one borrow away",
    body: "Browse our shelves and take any book home for a week.",
    gradient:
      "linear-gradient(135deg, #2F4A3A 0%, #25392D 55%, #17110D 100%)",
    art: "shelf",
  },
  {
    eyebrow: "Share the shelf",
    title: "Got a book gathering dust? Share it.",
    body: "Add your book to BookNook and let other readers discover it.",
    gradient:
      "linear-gradient(135deg, #7A3E1D 0%, #4A2A1C 55%, #17110D 100%)",
    art: "lamp",
  },
  {
    eyebrow: "Seven-day borrows",
    title: "Read it. Return it. Pass the magic on.",
    body: "Every returned book makes someone else's weekend.",
    gradient:
      "linear-gradient(135deg, #26324C 0%, #1F2438 55%, #17110D 100%)",
    art: "moon",
  },
  {
    eyebrow: "Five corners to wander",
    title: "A little library for every kind of reader",
    body: "Fiction, science, history, kids' tales and more.",
    gradient:
      "linear-gradient(135deg, #3B4B36 0%, #2F4A3A 50%, #17110D 100%)",
    art: "book",
  },
];

const cream = "#FBF5E9";
const amber = "#E39A55";
const sage = "#8FB29A";

function ShelfArt() {
  return (
    <svg
      viewBox="0 0 460 340"
      fill="none"
      role="img"
      aria-label="Illustration of a bookshelf with a small plant"
      className="h-auto w-full"
    >
      <circle cx="356" cy="74" r="52" fill={amber} opacity=".12" />
      <circle cx="356" cy="74" r="30" fill={amber} opacity=".22" />
      <rect
        x="34"
        y="42"
        width="392"
        height="258"
        rx="22"
        fill={cream}
        fillOpacity=".05"
        stroke={cream}
        strokeOpacity=".18"
      />
      <path
        d="M64 164h332M64 262h332"
        stroke={amber}
        strokeOpacity=".45"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <g fill={cream} opacity=".82">
        <rect x="82" y="88" width="18" height="76" rx="3" />
        <rect x="106" y="104" width="14" height="60" rx="3" opacity=".7" />
        <rect x="126" y="78" width="22" height="86" rx="3" opacity=".9" />
      </g>
      <rect x="154" y="112" width="16" height="52" rx="3" fill={amber} opacity=".85" />
      <g fill={cream} opacity=".7">
        <rect x="176" y="94" width="13" height="70" rx="3" />
        <rect x="195" y="108" width="20" height="56" rx="3" opacity=".85" />
      </g>
      <rect x="221" y="124" width="14" height="40" rx="3" fill={sage} opacity=".85" />
      <g fill={cream} opacity=".75">
        <rect x="241" y="86" width="18" height="78" rx="3" />
        <rect x="265" y="102" width="12" height="62" rx="3" opacity=".65" />
      </g>

      <g fill={cream} opacity=".78">
        <rect x="78" y="188" width="16" height="74" rx="3" />
        <rect x="100" y="202" width="23" height="60" rx="3" opacity=".9" />
        <rect x="129" y="182" width="14" height="80" rx="3" opacity=".7" />
      </g>
      <rect x="149" y="206" width="19" height="56" rx="3" fill={amber} opacity=".8" />
      <g fill={cream} opacity=".72">
        <rect x="174" y="192" width="13" height="70" rx="3" />
        <rect x="193" y="210" width="21" height="52" rx="3" opacity=".85" />
        <rect x="220" y="186" width="16" height="76" rx="3" />
      </g>

      <path
        d="M322 262v-30c0-14 10-24 24-24s24 10 24 24v30"
        stroke={sage}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M346 208c-2-18 4-30 18-38 2 16-3 29-18 38ZM346 210c-10-14-20-18-34-16 6 14 18 19 34 16Z"
        fill={sage}
        opacity=".8"
      />
      <rect x="310" y="258" width="72" height="12" rx="4" fill={amber} opacity=".55" />
    </svg>
  );
}

function LampArt() {
  return (
    <svg
      viewBox="0 0 460 340"
      fill="none"
      role="img"
      aria-label="Illustration of a reading lamp beside a stack of books"
      className="h-auto w-full"
    >
      <ellipse cx="238" cy="292" rx="186" ry="24" fill="#17110D" opacity=".35" />
      <circle cx="298" cy="84" r="58" fill={amber} opacity=".14" />
      <path
        d="M296 154c30 0 54 22 58 52l14 56H224l14-56c4-30 28-52 58-52Z"
        fill={amber}
        fillOpacity=".16"
      />
      <path
        d="M238 118h116l-20 62H258l-20-62Z"
        fill={amber}
        opacity=".9"
      />
      <path d="M238 118h116" stroke={cream} strokeOpacity=".35" strokeWidth="3" />
      <path
        d="M296 180v52m-38 40h76"
        stroke={cream}
        strokeOpacity=".55"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="272" y="266" width="48" height="10" rx="5" fill={cream} opacity=".35" />
      <circle cx="296" cy="108" r="5" fill={cream} opacity=".85" />

      <g>
        <rect x="92" y="244" width="118" height="20" rx="4" fill={sage} opacity=".85" />
        <rect x="104" y="222" width="104" height="20" rx="4" fill={cream} opacity=".75" />
        <rect x="86" y="266" width="132" height="16" rx="4" fill={amber} opacity=".5" />
        <rect x="120" y="200" width="82" height="20" rx="4" fill={cream} opacity=".5" />
      </g>

      <path
        d="M60 78c10 4 18 12 22 22-10 2-21-2-29-10M398 196c8 4 14 10 17 18-9 2-17-2-23-8"
        stroke={cream}
        strokeOpacity=".35"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonArt() {
  return (
    <svg
      viewBox="0 0 460 340"
      fill="none"
      role="img"
      aria-label="Illustration of a full moon over a quiet reading hill"
      className="h-auto w-full"
    >
      <circle cx="318" cy="98" r="74" fill={cream} opacity=".08" />
      <circle cx="318" cy="98" r="54" fill={cream} opacity=".92" />
      <circle cx="300" cy="82" r="9" fill="#1F2438" opacity=".2" />
      <circle cx="334" cy="112" r="12" fill="#1F2438" opacity=".16" />
      <circle cx="327" cy="74" r="5" fill="#1F2438" opacity=".18" />
      <circle cx="92" cy="72" r="3" fill={cream} opacity=".7" />
      <circle cx="132" cy="122" r="2" fill={amber} opacity=".8" />
      <circle cx="196" cy="62" r="2.5" fill={cream} opacity=".55" />
      <path
        d="M164 168c4-8 14-8 18 0 4-8 14-8 18 0"
        stroke={amber}
        strokeOpacity=".7"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M0 288c52-30 96-30 144-6 46 24 92 22 148-2 50-22 108-18 168 8v52H0v-52Z"
        fill={cream}
        fillOpacity=".08"
      />
      <path
        d="M0 306c60-22 112-20 164 0 52 20 104 18 156-4 48-20 92-16 140 4v34H0v-34Z"
        fill={sage}
        fillOpacity=".16"
      />

      <path
        d="M230 226c-34-22-72-26-108-16v66c36-8 74-4 108 16 34-20 72-24 108-16v-66c-36-10-74-6-108 16Z"
        fill={cream}
        fillOpacity=".12"
        stroke={cream}
        strokeOpacity=".45"
        strokeWidth="2"
      />
      <path d="M230 226v66" stroke={amber} strokeWidth="3" strokeLinecap="round" />
      <path
        d="M150 236c22-4 42 0 62 10M150 254c22-4 42 0 62 10M310 236c-22-4-42 0-62 10M310 254c-22-4-42 0-62 10"
        stroke={cream}
        strokeOpacity=".4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OpenBookArt() {
  return (
    <svg
      viewBox="0 0 460 340"
      fill="none"
      role="img"
      aria-label="Illustration of an open book with stories floating out"
      className="h-auto w-full"
    >
      <circle cx="230" cy="188" r="128" fill={amber} opacity=".1" />
      <circle cx="230" cy="188" r="96" stroke={cream} strokeOpacity=".12" />
      <path
        d="M230 148c-42-30-92-34-140-22v142c48-12 98-8 140 22 42-30 92-34 140-22V126c-48-12-98-8-140 22Z"
        fill={cream}
        fillOpacity=".1"
        stroke={cream}
        strokeOpacity=".45"
        strokeWidth="2.5"
      />
      <path d="M230 148v142" stroke={amber} strokeWidth="3" strokeLinecap="round" />
      <path
        d="M128 154c30-4 60 2 84 18M128 182c30-4 60 2 84 18M128 210c30-4 60 2 84 18M332 154c-30-4-60 2-84 18M332 182c-30-4-60 2-84 18M332 210c-30-4-60 2-84 18"
        stroke={cream}
        strokeOpacity=".35"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <g stroke={amber} strokeWidth="2.5" strokeLinecap="round">
        <path d="M230 96v-18M262 104l10-16M198 104l-10-16" />
      </g>
      <circle cx="230" cy="68" r="4" fill={amber} />
      <circle cx="278" cy="82" r="3" fill={sage} />
      <circle cx="182" cy="82" r="3" fill={cream} opacity=".7" />
      <path
        d="M120 104c14 2 24 10 30 22-14 2-26-4-34-14M340 104c-14 2-24 10-30 22 14 2 26-4 34-14"
        stroke={sage}
        strokeOpacity=".7"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const artByKey = {
  shelf: ShelfArt,
  lamp: LampArt,
  moon: MoonArt,
  book: OpenBookArt,
} as const;

const emptySubscribe = () => () => {};

/** False during SSR and hydration, true once the page is interactive. */
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function HeroSlider() {
  // Swiper instantiates itself during render, and its modules read the clock,
  // which makes prerendering bail out to a loading fallback. Render the first
  // slide as static markup on the server, then swap in the carousel once the
  // page is hydrated.
  const hydrated = useHydrated();

  return (
    <section
      aria-label="Featured stories from the BookNook shelves"
      className="relative overflow-hidden bg-[#17110D]"
    >
      {hydrated ? (
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={900}
          loop
          grabCursor
          autoplay={{ delay: 6500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="hero-swiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.title}>
              <HeroSlide slide={slide} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="h-[35rem] sm:h-[34rem] lg:h-[36rem]">
          <HeroSlide slide={slides[0]} />
        </div>
      )}
    </section>
  );
}

function HeroSlide({ slide }: { slide: Slide }) {
  const Art = artByKey[slide.art];

  return (
    <div
      className="relative flex h-full items-center overflow-hidden"
      style={{ backgroundImage: slide.gradient }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(227,154,85,0.18),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle_at_1px_1px,#FBF5E9_1px,transparent_0)] [background-size:24px_24px]"
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-4 pt-14 pb-20 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8">
        <div className="max-w-xl text-[#FBF5E9]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FBF5E9]/20 bg-[#FBF5E9]/10 px-3.5 py-1.5 text-[0.68rem] font-semibold tracking-[0.16em] uppercase backdrop-blur">
            <SparklesIcon className="size-3.5 text-[#E39A55]" aria-hidden />
            {slide.eyebrow}
          </span>

          <h1 className="mt-5 font-heading text-4xl leading-[1.06] font-semibold text-balance sm:text-5xl lg:text-[3.4rem]">
            {slide.title}
          </h1>

          <p className="mt-5 max-w-lg text-pretty text-sm leading-relaxed text-[#FBF5E9]/75 sm:text-base">
            {slide.body}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/books"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group bg-[#E39A55] text-[#2B1D14] hover:bg-[#F0AE6F]",
              )}
            >
              Browse Books
              <ArrowRightIcon
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
            <Link
              href={slide.art === "lamp" ? "/add-book" : "/register"}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#FBF5E9]/75 underline-offset-4 transition-colors hover:text-[#FBF5E9] hover:underline"
            >
              {slide.art === "lamp" ? "Share a book instead" : "Get a library card"}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-md lg:block lg:max-w-none">
          <Art />
        </div>
      </div>
    </div>
  );
}
