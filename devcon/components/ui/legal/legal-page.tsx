import type { ReactNode } from 'react';
import NavBar from '@/components/ui/nav-bar/nav-bar';
import Footer from '@/components/ui/sections/footer';

/**
 * LegalPage — the shared layout for the Privacy Policy and Terms (LEGAL-01).
 *
 * The site's own navbar and footer, so the pages don't feel like a detour, and
 * a single readable column: line length capped for long-form text, and
 * headings in order (one h1, then h2 sections) for screen readers and the
 * accessibility audit.
 */
export default function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main className="bg-background text-foreground">
        <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{title}</h1>
          <p className="mt-4 font-mono text-sm text-muted">Last updated: {lastUpdated}</p>
          <div className="legal-prose mt-10 space-y-6 text-base leading-relaxed text-foreground/90">{children}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}

/** A section heading plus its body, keeping every section's spacing identical. */
export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 pt-4">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
