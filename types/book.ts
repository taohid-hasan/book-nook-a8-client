export const BOOK_CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export type BookCategoryFilter = "All" | BookCategory;

export interface BookOwner {
  name: string;
  email: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: BookCategory | string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  addedBy: BookOwner;
  createdAt: string;
}

export interface BookInput {
  title: string;
  author: string;
  category: BookCategory;
  image: string;
  description: string;
  totalCopies: number;
}

export interface CategoryMeta {
  label: BookCategory;
  spineClass: string;
  badgeClass: string;
  blurb: string;
}

export const CATEGORY_META: Record<BookCategory, CategoryMeta> = {
  Fiction: {
    label: "Fiction",
    spineClass: "text-spine-fiction",
    badgeClass:
      "border-spine-fiction/35 bg-spine-fiction/10 text-spine-fiction",
    blurb: "Novels, short stories, and imagined worlds.",
  },
  Science: {
    label: "Science",
    spineClass: "text-spine-science",
    badgeClass:
      "border-spine-science/35 bg-spine-science/10 text-spine-science",
    blurb: "Curious minds, experiments, and the natural world.",
  },
  History: {
    label: "History",
    spineClass: "text-spine-history",
    badgeClass:
      "border-spine-history/35 bg-spine-history/10 text-spine-history",
    blurb: "People, places, and the stories that shaped us.",
  },
  Kids: {
    label: "Kids",
    spineClass: "text-spine-kids",
    badgeClass: "border-spine-kids/35 bg-spine-kids/10 text-spine-kids",
    blurb: "Picture books and early readers for small shelves.",
  },
  Others: {
    label: "Others",
    spineClass: "text-spine-others",
    badgeClass:
      "border-spine-others/35 bg-spine-others/10 text-spine-others",
    blurb: "Poetry, cookbooks, memoirs, and everything between.",
  },
};

export function getCategoryMeta(category: string | null | undefined): CategoryMeta {
  if (category && category in CATEGORY_META) {
    return CATEGORY_META[category as BookCategory];
  }
  return CATEGORY_META.Others;
}
