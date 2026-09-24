import Link from 'next/link';
import PostCard from '@/components/ui/news/post-card';
import type { PortalPost } from '@/lib/portal/types';

/**
 * News — the homepage's "Latest News" section (NEWS-02).
 *
 * **Renders nothing when there are no posts.** Not an empty state, not a
 * placeholder: a "Latest News" heading over nothing tells a visitor the chapter
 * has nothing to say, which is worse than not raising the subject. The section
 * appears the moment an officer publishes, and disappears again if every post is
 * unpublished.
 *
 * That is deliberately different from Events, which keeps an empty state,
 * because the page promises events elsewhere and an empty events section is
 * itself an answer ("nothing coming up"). Nobody was promised news.
 */
export default function News({ posts }: { posts: PortalPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="news" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-4xl font-extrabold text-foreground md:text-6xl">
            Latest <span className="text-accent-purple">News</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base text-muted">
            Announcements, recaps and what the community has been working on.
          </p>
        </div>

        <Link
          href="/news"
          className="shrink-0 text-sm font-semibold uppercase tracking-widest text-accent-purple underline underline-offset-8 hover:text-foreground transition-colors"
        >
          All news
        </Link>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
