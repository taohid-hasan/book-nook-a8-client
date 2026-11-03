# BookNook — Client

A neighbourhood library, rendered as a warm reading nook. BookNook is a
Next.js client for the BookNook Express API where readers can add books to the
shared shelf, borrow them for a week, and return them when they are done.

## Tech stack

- Next.js 16 (App Router, Turbopack, Cache Components)
- React 19 + TypeScript
- Tailwind CSS v4 with shadcn/ui components
- Better Auth (MongoDB adapter + JWT plugin) for email/password sessions
- Express API on `http://localhost:5000` (sibling repo `book-nook-a8-server`)
- sonner toasts, framer-motion, Swiper, lucide-react + react-icons
- imgbb image uploads

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The Express API must be running separately:

```bash
# in ../book-nook-a8-server
npm install
npm run dev
```

The API verifies BookNook JWTs against this client's JWKS endpoint, so the
server `.env` needs:

```env
CLIENT_URL=http://localhost:3000
JWKS_URL=http://localhost:3000/api/auth/jwks
```

## Environment

Create `.env.local` in the project root (it is git-ignored):

```env
# MongoDB database used by Better Auth
MONGODB_URI=mongodb+srv://...
MONGODB_DB=book-nook-a8-server

# Generate with: npx better-auth secret
BETTER_AUTH_SECRET=replace-with-a-long-random-string
BETTER_AUTH_URL=http://localhost:3000

# Express API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional: book cover uploads (https://api.imgbb.com/)
NEXT_PUBLIC_IMGBB_KEY=

# Optional: Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Without `NEXT_PUBLIC_IMGBB_KEY` the add/edit form still works — it shows a
"paste an image URL" field instead of the upload button.

## Scripts

| Script          | What it does                              |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Start the dev server on port 3000         |
| `npm run build` | Production build (type-checks every page) |
| `npm start`     | Serve the production build                |
| `npm run lint`  | ESLint (Next.js core-web-vitals + TS)     |

## Routes

Public:

- `/` — hero, featured shelf, categories, how it works
- `/books` — searchable, filterable catalogue
- `/login`, `/register` — library-card auth screens
- `/books/[id]` — book detail with the vintage checkout-slip borrow dialog
  (sign-in required to borrow)

Private (redirect to `/login` when signed out):

- `/add-book` — add a book to the shelf, with cover upload
- `/my-books` — edit or remove books you added
- `/my-borrows` — current loans, due stamps, and return slips
- `/profile` — library card, reading stats, password change, sign out

Every route renders the BookNook navbar and footer, has its own
`BookNook | …` document title, and shows a loading spinner while data is in
flight. Unknown routes land on a custom 404 page with a "Back to Home" link.

## Project structure

```
app/
├─ (auth)/              # login, register + shared auth shell
├─ (private)/           # add-book, my-books, my-borrows, profile
├─ (root)/              # home, books, books/[id]
├─ api/auth/[...all]/   # Better Auth route handler
├─ globals.css          # design tokens, paper grain, slip + stamp styles
├─ layout.tsx           # fonts, providers, navbar, footer
├─ loading.tsx
└─ not-found.tsx
components/
├─ home/                # home page sections
├─ shared/              # navbar, footer, book card/form, guards, states
└─ ui/                  # shadcn/ui primitives
hooks/                  # kebab-case hooks
lib/                    # api, auth, auth-client, mongodb, imgbb, utils
types/                  # book + borrow types and category metadata
proxy.ts                # optimistic cookie guard for private routes
```

## Design system

The "Cozy Reading Nook" palette lives in `app/globals.css`:

| Token          | Light     | Dark      |
| -------------- | --------- | --------- |
| Background     | `#FBF5E9` | `#17110D` |
| Card           | `#FFFDF7` | `#221913` |
| Ink            | `#2B1D14` | `#F3E9D8` |
| Primary green  | `#2F4A3A` | `#8FB29A` |
| Amber accent   | `#C8743A` | `#E39A55` |
| Border         | `#E6D9C3` | `#3A2C21` |

Headings use Fraunces, body copy uses Inter, both loaded with `next/font`.
Category spine colors (Fiction terracotta, Science teal, History ochre, Kids
rose, Others sage), the paper-grain background, bookmark-ribbon section
headings, rotated due-date stamps, and the checkout-slip borrow modal are all
part of the shared visual language.

## Notes

- All data fetching happens client-side with a fresh Better Auth JWT
  (`authClient.token()`), so pages remain statically prerenderable while the
  Express API stays the single source of truth.
- `proxy.ts` only checks whether a session cookie exists. The real guard,
  `RequireAuth`, waits for `authClient.useSession()` to finish loading before
  deciding to redirect, so a page refresh never bounces a signed-in reader.
- Password rules (at least one uppercase letter, one lowercase letter, and six
  characters) are enforced in the forms and by a Better Auth `before` hook.
- No `alert`, `confirm`, or `prompt` — feedback uses sonner toasts and shadcn
  dialogs.
