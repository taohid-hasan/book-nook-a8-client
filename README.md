# BookNook

A cosy neighbourhood library for borrowing, adding, and returning books.

**Live Site:** <paste your deployed URL here>

![BookNook screenshot](https://placehold.co/1200x630/FBF5E9/2F4A3A?text=BookNook+%E2%80%94+Home+Page)

> Replace the placeholder above with a capture of the home page or your
> library-card profile.

## Features

- **Swiper hero slider** — an animated, swipeable hero that introduces the
  BookNook shelves on every screen size.
- **Dynamic new arrivals** — the home page pulls the latest books from the API
  and renders them in a responsive shelf.
- **Email and Google sign-in** — Better Auth handles email/password accounts
  and optional Google OAuth from the same library-card screens.
- **JWT-protected API** — every private request fetches a fresh Better Auth JWT
  and sends it as a `Bearer` token to the Express API.
- **Add, edit, and delete books** — readers can manage their own listings, with
  cover uploads through imgbb (or a plain image URL fallback).
- **Borrow and return with live copy tracking** — each borrow decrements the
  available copies immediately, and returning a book puts the copy back on the
  shelf.
- **Double-borrow protection** — the API rejects a second active borrow of the
  same book by the same reader and the UI explains why.
- **Dark and light themes** — a lamp-lit / daylight theme toggle that persists
  across visits.
- **Responsive throughout** — layouts are tuned for 375 px phones, 768 px
  tablets, and desktop, with tables that become cards on small screens.
- **Framer Motion polish** — section reveals, card hovers, and page transitions
  keep the nook feeling alive without blocking interaction.
- **Loading, empty, and error states** — every async action shows a spinner and
  a sonner toast, and every list has a friendly empty state.

## Tech stack

| Layer      | Choice                                                        |
| ---------- | ------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack, Cache Components)          |
| Language   | React 19 + TypeScript                                         |
| Styling    | Tailwind CSS v4, shadcn/ui, Base UI primitives                |
| Auth       | Better Auth with the MongoDB adapter and JWT plugin           |
| Database   | MongoDB (Better Auth collections + Express API data)          |
| API        | Express (`book-nook-a8-server`)                               |
| Motion     | Framer Motion, Swiper                                         |
| Feedback   | sonner toasts, lucide-react icons                             |
| Images     | imgbb uploads                                                 |

## Environment

Create `.env.local` in the project root (it is git-ignored):

| Variable                 | Required | Description                                             |
| ------------------------ | -------- | ------------------------------------------------------- |
| `MONGODB_URI`            | Yes      | MongoDB connection string used by Better Auth.          |
| `MONGODB_DB`             | Yes      | Database name shared with the Express API.              |
| `BETTER_AUTH_SECRET`     | Yes      | Long random secret (`npx better-auth secret`).          |
| `BETTER_AUTH_URL`        | Yes      | Public URL of this app, e.g. `http://localhost:3000`.   |
| `NEXT_PUBLIC_API_URL`    | Yes      | Express API base URL, e.g. `http://localhost:5000`.     |
| `NEXT_PUBLIC_IMGBB_KEY`  | No       | imgbb API key for cover uploads.                        |
| `GOOGLE_CLIENT_ID`       | No       | Google OAuth client ID.                                 |
| `GOOGLE_CLIENT_SECRET`   | No       | Google OAuth client secret.                             |

Without `NEXT_PUBLIC_IMGBB_KEY`, the add/edit form still works — it shows a
"paste an image URL" field instead of the upload button.

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>
MONGODB_DB=book-nook-a8-server
BETTER_AUTH_SECRET=replace-with-a-long-random-string
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The Express API runs separately in the sibling `book-nook-a8-server` repo:

```bash
# in ../book-nook-a8-server
npm install
npm run dev
```

The API verifies BookNook JWTs against this client's JWKS endpoint, so the
server `.env` also needs:

```env
CLIENT_URL=http://localhost:3000
JWKS_URL=http://localhost:3000/api/auth/jwks
```

### Production build

```bash
npm run build
npm start
```

| Script          | What it does                              |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Start the dev server on port 3000         |
| `npm run build` | Production build and TypeScript check     |
| `npm start`     | Serve the production build                |
| `npm run lint`  | ESLint (Next.js core-web-vitals + TS)     |

## Routes

Public:

- `/` — hero, new arrivals, categories, and how borrowing works
- `/books` — searchable, filterable catalogue
- `/login`, `/register` — library-card auth screens
- `/books/[id]` — book detail with the checkout-slip borrow dialog

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

## Notes

- Data fetching happens client-side with a fresh Better Auth JWT
  (`authClient.token()`), so pages stay statically prerenderable while the
  Express API remains the single source of truth.
- `proxy.ts` only checks whether a session cookie exists. The real guard waits
  for `authClient.useSession()` to finish loading before redirecting, so a
  refresh never bounces a signed-in reader to the login page.
- Password rules (one uppercase letter, one lowercase letter, at least six
  characters) are enforced in the forms and by a Better Auth `before` hook.
- No `alert`, `confirm`, or `prompt` — feedback uses sonner toasts and shadcn
  dialogs.
