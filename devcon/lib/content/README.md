## Content Data Layer Guide

This folder contains the structured content used by the landing page UI.

The goal is to let non-UI developers update copy, links, and image data without editing component logic.

## Files You Can Edit

- `about-devcon-slideshow.ts`: photos used in the About section slideshow.
- `events.ts`: events shown in the Featured Events carousel.
- `officers.ts`: members displayed in the Officers section.
- `programs-and-activities.ts`: slides shown in the Programs and Activities section.
- `social-links.tsx`: external platform links used in the footer and social section.
- `stats.ts`: homepage impact metrics.
- `what-we-do.ts`: feature cards in the What We Do section.

## General Rules

1. Keep object keys and exported names unchanged.
2. Keep `id` values unique within each file.
3. Use valid image paths from `public/` (for example, `/images/officers/president.png`).
4. If an image is not ready, omit the field and let the UI fall back gracefully.
5. Preserve TypeScript types unless you are intentionally updating the data model.
6. Keep accessibility text (`alt`) meaningful for screen readers and search visibility.

---

## Updating Officers (`officers.ts`)

### Data Shape

Each officer entry follows this structure:

```ts
{
  id: number,
  name: string,
  role: string,
  img?: string,
  width: number,
  height: number,
  accent: 'yellow' | 'orange' | 'purple' | 'lime'
}
```

### How To Add A New Officer

1. Open `officers.ts`.
2. Add a new object inside the `team` array.
3. Use the next available `id`.
4. Provide `name`, `role`, `width`, `height`, and `accent`.
5. Add `img` if a photo exists in `public/images/officers/`.

Example:

```ts
{
  id: 13,
  name: 'Jane Doe',
  role: 'VP for Engineering',
  img: '/images/officers/jane-doe.png',
  width: 960,
  height: 960,
  accent: 'purple'
}
```

### How To Update An Existing Officer

1. Find the entry by `id`.
2. Edit one or more fields such as `name`, `role`, `img`, or `accent`.
3. Do not reuse or duplicate `id` values.

### Pagination Note

`membersPerPage` controls how many officers appear per carousel page.

---

## Updating Events (`events.ts`)

### Data Shape

Each event entry follows this structure:

```ts
{
  id: number,
  title: string,
  date: string,
  category: 'hackaton' | 'workshop' | 'seminar' | 'community' | 'career',
  img?: string
}
```

> Important: there is no `color` field. Badge colors are assigned by category in the component.

### How To Add A New Event

1. Open `events.ts`.
2. Add a new object inside the `events` array.
3. Use the next available `id`.
4. Set a supported `category`.
5. Add `img` only if a matching asset exists in `public/images/`.

Example:

```ts
{
  id: 10,
  title: 'Cloud Engineering Workshop',
  date: 'Nov 5, 2026',
  category: 'workshop',
  img: '/images/cloud-workshop.png'
}
```

### How To Update An Existing Event

1. Find the event by `id`.
2. Edit `title`, `date`, `category`, or `img` as needed.
3. Keep the category within the allowed union type.

### Pagination Note

`eventsPerPage` controls how many event cards appear per carousel page.

---

## Updating Programs and Activities (`programs-and-activities.ts`)

### Data Shape

Each slide entry follows this structure:

```ts
{
  id: number,
  title: string,
  description?: string,
  bannerImg?: string,
  primaryBtnLabel: string,
  primaryBtnLink: string,
  secondaryBtnLabel?: string,
  secondaryBtnLink?: string
}
```

### How To Add A New Program/Activity Slide

1. Open `programs-and-activities.ts`.
2. Add a new object inside `programsAndActivities`.
3. Use the next available `id`.
4. Fill in button labels and links.
5. Add `bannerImg` if a banner exists in `public/images/banner/`.

Example:

```ts
{
  id: 4,
  title: 'Build Real Apps with Mentors',
  description: 'Work with peers and mentors to ship projects from idea to demo.',
  bannerImg: '/images/banner/banner4.png',
  primaryBtnLabel: 'Start Building',
  primaryBtnLink: '/programs',
  secondaryBtnLabel: 'Mentor Directory',
  secondaryBtnLink: '/mentors'
}
```

### How To Update An Existing Slide

1. Find the entry by `id`.
2. Update content text, banner, or button fields.
3. If a secondary button is not needed, remove both secondary fields.

---

## Updating Stats (`stats.ts`)

The homepage stat cards are driven by the `stats` array. Each item includes a label, a numeric value, and a matching SVG icon in `public/stat/`.

- Keep the value as a number.
- Match the icon path to an existing file in `public/stat/`.
- Coordinate large updates with the design team so the card proportions remain balanced.

---

## Updating What We Do (`what-we-do.ts`)

This file defines the cards in the "What We Do" section. The `isTall` flag allows a card to render with larger dimensions while the rest remain compact.

- Update `title` and `img` as needed.
- Preserve `width` and `height` so Next.js image sizing remains accurate.
- Use `isTall: true` only for the larger featured card.

---

## Updating About Slideshow (`about-devcon-slideshow.ts`)

The slideshow uses `slides` entries with `src`, `alt`, and image dimensions. Review asset ratios before updating so the carousel layout stays visually consistent.

---

## Updating Social Links (`social-links.tsx`)

Each item in `socialLinks` contains a platform name, a destination URL, and an icon component.

- Keep links up to date with the current official channels.
- Preserve the `platform` naming pattern used by the UI.
- Use the existing icon library rather than adding custom SVGs unless absolutely necessary.

---

## Quick Quality Check After Editing

1. Run the app and visit the homepage sections:
   - About
   - Officers
   - Featured Events
   - What We Do
   - Programs and Activities
   - Footer social links
2. Verify no TypeScript errors appear.
3. Confirm that image paths load and placeholders remain acceptable where images are missing.
4. Check carousel pagination still feels correct after new entries are added.

## Common Mistakes To Avoid

- Duplicate `id` values.
- Typo in category strings.
- Missing or invalid image paths.
- Changing exported names unintentionally.
- Leaving button labels set while the target links are empty.
- Forgetting to add meaningful `alt` text for slideshow assets.
