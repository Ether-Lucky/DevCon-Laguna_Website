## Content Data Layer Guide

This folder contains structured content files used by the UI.

Goal: allow developers to update website content without modifying component code.

## Files You Can Edit

- `officers.ts`: officers/team members shown in the Officers section.
- `events.ts`: events shown in the Events carousel.
- `programs-and-activities.ts`: slides shown in the Programs and Activities section.

## General Rules

1. Keep object keys and exported names unchanged.
2. Keep `id` values unique within each file.
3. Use valid image paths from `public/` (example: `/images/officers/president.png`).
4. If an image is not ready, you may omit the image field. The UI has a fallback placeholder.
5. Preserve TypeScript types unless you are intentionally updating the data model.

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
	gradient: string
}
```

### How To Add A New Officer

1. Open `officers.ts`.
2. Add a new object inside the `team` array.
3. Use the next available `id`.
4. Provide `name`, `role`, and `gradient`.
5. Add `img` if a photo exists in `public/images/officers/`.

Example:

```ts
{
	id: 13,
	name: 'Jane Doe',
	role: 'VP for Engineering',
	img: '/images/officers/jane-doe.png',
	gradient: 'from-devcon-black to-[#C0E00B]'
}
```

### How To Update An Existing Officer

1. Find the entry by `id`.
2. Edit one or more fields (`name`, `role`, `img`, `gradient`).
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
	img?: string,
	color: string
}
```

### Important Category Constraint

Use the value exactly as defined in `events.ts` unless you also update the type and all related usage.

### How To Add A New Event

1. Open `events.ts`.
2. Add a new object inside the `events` array.
3. Use the next available `id`.
4. Set a supported `category` and matching `color` class string.
5. Add `img` if you have an image in `public/images/`.

Example:

```ts
{
	id: 10,
	title: 'Cloud Engineering Workshop',
	date: 'Nov 5, 2026',
	category: 'workshop',
	color: 'bg-[#F2C94C] text-black',
	img: '/images/cloud-workshop.png'
}
```

### How To Update An Existing Event

1. Find the event by `id`.
2. Edit fields such as `title`, `date`, `category`, `color`, or `img`.
3. Keep `category` inside the allowed union type.

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

## Quick Quality Check After Editing

1. Run the app and visit the homepage sections:
	 - Officers
	 - Featured Events
	 - Programs and Activities
2. Verify no TypeScript errors appear.
3. Confirm image paths load and fallback placeholders look acceptable where images are missing.
4. Check carousel pagination still feels correct after your new item count.

## Common Mistakes To Avoid

- Duplicate `id` values.
- Typo in category strings.
- Invalid or missing image paths.
- Changing type names/exports accidentally.
- Leaving button labels set but links empty when the action should navigate.
