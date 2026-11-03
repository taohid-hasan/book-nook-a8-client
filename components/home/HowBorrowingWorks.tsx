"use client";

import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaHandHoldingHeart,
  FaRegClock,
  FaRotateLeft,
} from "react-icons/fa6";

import { SectionHeading } from "@/components/home/SectionHeading";

const steps = [
  {
    Icon: FaBookOpen,
    title: "Browse the shelves",
    body: "Wander the five corners of the library or search for a title you already love.",
  },
  {
    Icon: FaHandHoldingHeart,
    title: "Borrow with one click",
    body: "Pick an available copy and sign the checkout slip. No queue, no paperwork.",
  },
  {
    Icon: FaRegClock,
    title: "Read for 7 days",
    body: "Take the book home for a week. Your due date is stamped on your library card.",
  },
  {
    Icon: FaRotateLeft,
    title: "Return and repeat",
    body: "Bring it back when you're done so the next reader can begin their own week.",
  },
];

export function HowBorrowingWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-border/70 bg-card/40"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeading
            eyebrow="How borrowing works"
            title="Four small steps, one shared shelf"
            description="No late fees, no complicated forms. Just a library card, a book, and a promise to pass it on."
            align="center"
            className="mx-auto"
          />
        </motion.div>

        <div className="relative mt-12">
          <span
            className="pointer-events-none absolute top-7 right-[12.5%] left-[12.5%] hidden border-t-2 border-dotted border-accent/45 md:block"
            aria-hidden
          />
          <div className="relative grid gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-5">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="relative flex flex-col items-center text-center"
              >
                <span className="relative z-10 flex size-14 items-center justify-center rounded-full border-2 border-accent/45 bg-background text-accent shadow-[0_10px_24px_-18px_rgba(43,29,20,0.8)]">
                  <step.Icon className="size-5" aria-hidden />
                </span>
                <span className="mt-4 text-[0.62rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                  Step {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-heading text-lg font-semibold text-balance">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
