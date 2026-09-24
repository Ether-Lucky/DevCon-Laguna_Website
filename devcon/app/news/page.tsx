import type { Metadata } from 'next';
import NavBar from '@/components/ui/nav-bar/nav-bar';
import Footer from '@/components/ui/sections/footer';
import PostCard from '@/components/ui/news/post-card';
import { getPosts } from '@/lib/portal/content';
import { siteConfig } from '@/lib/site-config';

/**
 * The news index (NEWS-02, #179).
 *
 * Every published post, newest first. Unlike the homepage section — which
 * renders nothing when there is no news — this page exists whether or not there
 * are posts: it is a destination people can be sent to, and a 404 for a link in
 * a chat message is worse than a page that says there is nothing yet.
 *
 * It reads `/api/public/posts` rather than the landing payload, which carries
 * only the three most recent.
 */
export const metadata: Metadata = {
  title: 'News',
  description: `Announcements, event recaps and updates from ${siteConfig.name}.`,
  alternates: { canonical: '/news' },
};

export default async function NewsIndexPage() {
  const posts = await getPosts();

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <h1 className="text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
          Latest <span className="text-accent-purple">News</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted">
          Announcements, recaps and what the community has been working on.
        </p>

        {posts.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          // Also what an unreachable portal looks like. Saying "nothing yet" is
          // honest in both cases, and the page still renders rather than
          // erroring.
          <p className="mt-12 text-base text-muted">
            No news yet. Follow us on social media in the meantime — announcements go up here first.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
