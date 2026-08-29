# DevCon Laguna Website

The official website for **DevCon Laguna** — a local chapter of Developers Connect (DevCon Philippines). Built with [Next.js 15](https://nextjs.org), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS v4](https://tailwindcss.com/).

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Heroicons, Remixicon |
| Fonts | DM Sans (headings), JetBrains Mono (body) |
| Theme | next-themes (dark/light) |
| Package manager | pnpm |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
devcon/
├── app/
│   ├── layout.tsx          # Root layout — fonts, ThemeProvider, metadata
│   ├── page.tsx            # Home page — composes all sections
│   └── globals.css         # Tailwind theme tokens and global styles
│
├── components/
│   ├── theme-provider.tsx  # Wraps next-themes provider (dark-first)
│   └── ui/
│       ├── button.tsx          # Reusable Button (primary / outline variants)
│       ├── dynamic-carousel.tsx # Horizontally scrollable carousel with arrow controls
│       ├── fonts.ts            # Google Font instances (DM Sans, JetBrains Mono)
│       ├── logo.tsx            # DevCon Laguna logo (dark/light aware)
│       ├── scroll-reveal.tsx   # Framer Motion scroll-triggered entrance animation
│       ├── splash-screen.tsx   # Full-screen loading splash (currently disabled)
│       ├── nav-bar/
│       │   ├── nav-bar.tsx     # Top-level sticky navigation bar
│       │   ├── nav-links.tsx   # Horizontal / vertical nav link list
│       │   ├── nav-actions.tsx # "Join Us" CTA + theme toggle
│       │   ├── mobile-nav.tsx  # Hamburger menu for mobile breakpoints
│       │   └── theme-button.tsx # Sun/Moon dark-mode toggle button
│       └── sections/
│           ├── hero.tsx                        # Landing hero with headline and CTAs
│           ├── stats.tsx                       # Community statistics grid
│           ├── about.tsx                       # "Who We Are" with image carousel
│           ├── mission-vision/
│           │   ├── mission-vision.tsx          # Mission + Vision two-card layout
│           │   └── info-card.tsx               # Reusable gradient card with masked icon
│           ├── what-we-do.tsx                  # Bento-grid of activity photos
│           ├── events.tsx                      # Featured Events carousel
│           ├── officers.tsx                    # Officers carousel (two-row grid)
│           ├── program-and-activities.tsx      # Auto-sliding banner (currently disabled)
│           ├── social-media.tsx                # Social media icon links
│           └── footer.tsx                      # Site footer with links and copyright
│
└── lib/
    └── content/
        ├── README.md                   # Content layer contributor guide
        ├── about-devcon-slideshow.ts   # Slide images for the About section
        ├── events.ts                   # Featured events data
        ├── officers.ts                 # Officer/team member data
        ├── programs-and-activities.ts  # Programs & Activities slide data
        ├── social-links.tsx            # Social media platform links and icons
        ├── stats.ts                    # Community statistics data
        └── what-we-do.ts              # What We Do bento-grid items
```

---

## Theming & Design Tokens

All brand colors are defined as CSS custom properties in [`app/globals.css`](app/globals.css) and exposed as Tailwind utilities:

| Token | Value | Usage |
|---|---|---|
| `devcon-purple-500` | `#6A0DF2` | Primary brand purple |
| `devcon-purple-700` | `#6320EE` | Darker purple (seminar tags, gradients) |
| `devcon-purple-300` | `#3A0066` | Deep purple background accent |
| `devcon-lime-500` | `#C0E00B` | Lime green (primary CTA, community tags) |
| `devcon-lime-300` | `#6FC71E` | Darker lime |
| `devcon-yellow-500` | `#F0C419` | Yellow (workshop tags) |
| `devcon-orange-500` | `#E06B22` | Orange (career tags) |
| `devcon-black-500` | `#0B0B0C` | Near-black background |
| `devcon-white-500` | `#FFFFFF` | White |

The site defaults to **dark mode**. Light mode is supported via the `next-themes` provider.

---

## Content Editing

All website copy and data lives in `lib/content/`. You can update text, images, and links without touching any component code. See [`lib/content/README.md`](lib/content/README.md) for a complete contributor guide.

---

## Event Tag Colors

Category colors for event badges are centrally defined in [`components/ui/sections/events.tsx`](components/ui/sections/events.tsx). To retheme a category, edit the `categoryColors` map — do **not** set colors per-event.

| Category | Color token |
|---|---|
| `hackaton` | `devcon-purple-500` |
| `workshop` | `devcon-yellow-500` |
| `seminar` | `devcon-purple-700` |
| `community` | `devcon-lime-500` |
| `career` | `devcon-orange-500` |

---

## Scripts

```bash
pnpm dev      # Start development server (http://localhost:3000)
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```
