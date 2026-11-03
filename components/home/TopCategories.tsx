"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRightIcon } from "lucide-react";
import {
  FaBookAtlas,
  FaBookOpen,
  FaChild,
  FaFlask,
  FaLandmark,
} from "react-icons/fa6";

import { SectionHeading } from "@/components/home/SectionHeading";
import { cn } from "@/lib/utils";
import { CATEGORY_META, type BookCategory } from "@/types/book";

const categories: {
  name: BookCategory;
  Icon: typeof FaBookOpen;
  tagline: string;
}[] = [
  {
    name: "Fiction",
    Icon: FaBookOpen,
    tagline: "Novels and imagined worlds.",
  },
  {
    name: "Science",
    Icon: FaFlask,
    tagline: "Curiosity, experiments, nature.",
  },
  {
    name: "History",
    Icon: FaLandmark,
    tagline: "The stories that shaped us.",
  },
  {
    name: "Kids",
    Icon: FaChild,
    tagline: "Picture books for small readers.",
  },
  {
    name: "Others",
    Icon: FaBookAtlas,
    tagline: "Poetry, memoirs, everything else.",
  },
];

export function TopCategories() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <SectionHeading
          eyebrow="Wander the shelves"
          title="Top Categories"
          description="Every book carries a coloured spine so you can find your way at a glance. Pick a corner and start browsing."
          align="center"
          className="mx-auto"
        />
      </motion.div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map(({ name, Icon, tagline }, index) => {
          const meta = CATEGORY_META[name];

          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.07,
                ease: "easeOut",
              }}
              className="h-full last:col-span-2 sm:last:col-span-1"
            >
              <Link
                href={`/books?category=${encodeURIComponent(name)}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_18px_36px_-28px_rgba(43,29,20,0.8)]"
              >
                <span
                  className={cn("absolute inset-y-0 left-0 w-1.5", meta.spineClass)}
                  aria-hidden
                />
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full border",
                    meta.badgeClass,
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>

                <span className="mt-4 flex items-center justify-between gap-2">
                  <span className="font-heading text-lg font-semibold">
                    {name}
                  </span>
                  <ArrowUpRightIcon
                    className="size-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden
                  />
                </span>
                <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {tagline}
                </span>

                <span
                  className={cn(
                    "mt-auto block h-1 w-full rounded-full bg-current opacity-20",
                    meta.spineClass,
                  )}
                  aria-hidden
                />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
