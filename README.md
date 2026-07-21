# DevCon Laguna Website

Official website for DevCon Laguna, built with Next.js and Tailwind CSS.

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- TypeScript
- ESLint

## Getting Started

Install dependencies inside the `devcon` app folder, then start the dev server:

```bash
cd devcon
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

Run these from the `devcon` folder:

- `pnpm dev` - start the development server
- `pnpm build` - create a production build
- `pnpm start` - start the production server
- `pnpm lint` - run ESLint

## Project Structure

- `app/` - application routes, layout, and global styles
- `components/ui/` - reusable UI components
- `public/` - static assets such as images and icons

## Notes

The root workspace contains the Next.js app inside the `devcon` directory.