import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';
import NavBar from '@/components/ui/nav-bar/nav-bar';
import Footer from '@/components/ui/sections/footer';
import { getPost } from '@/lib/portal/content';
import { formatPostDate, postExcerpt, postPath } from '@/lib/portal/posts';
import { isAllowedRemoteImage } from '@/lib/remote-images';
import { siteConfig } from '@/lib/site-config';

/**
 * A news post's page (NEWS-02, #179).
 *
 * The body is **plain text**, rendered as text with its paragraph breaks kept.
 * It is never treated as HTML or Markdown: that is the contract agreed with the
 * portal team, and it means a mistake in an admin screen cannot rewrite a public
 * page. React escapes the content, so a post containing `<script>` shows those
 * characters and does nothing.
 *
 * An unknown slug is a 404 rather than a redirect, for the same reason as an
 * unknown event: a wrong link should say so.
 */
export async function generateMetadata({ params }: PageProps<'/news/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const description = postExcerpt(post);
  const cover =
    post.cover_image_url && isAllowedRemoteImage(post.cover_image_url) ? post.cover_image_url : null;

  return {
    title: post.title,
    description,
    alternates: { canonical: postPath(post) },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `${siteConfig.url}${postPath(post)}`,
      publishedTime: post.published_at,
      ...(cover ? { images: [{ url: cover, alt: post.title }] } : {}),
    },
  };
}

export default async function PostPage({ params }: PageProps<'/news/[slug]'>) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const cover =
    post.cover_image_url && isAllowedRemoteImage(post.cover_image_url) ? post.cover_image_url : null;

  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    datePublished: post.published_at,
    description: postExcerpt(post),
    url: `${siteConfig.url}${postPath(post)}`,
    publisher: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
    ...(cover ? { image: cover } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escaping `<` stops a post from closing the script tag early, which
        // would otherwise be an injection vector for text an officer typed.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, '\\u003c') }}
      />
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden />
          All news
        </Link>

        <article className="mt-8">
          <p className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted">
            <CalendarIcon className="h-4 w-4 shrink-0" aria-hidden />
            <time dateTime={post.published_at}>{formatPostDate(post.published_at)}</time>
          </p>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
            {post.title}
          </h1>

          {cover ? (
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-[28px] bg-zinc-900">
              {/*
                The heading says what the picture is of, and the portal has no
                alt field for post covers. An empty alt marks it decorative,
                which is honest — better than repeating the headline or
                describing the file.
              */}
              <Image src={cover} alt="" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
            </div>
          ) : null}

          <div className="mt-10 whitespace-pre-line text-base leading-relaxed text-foreground md:text-lg">
            {post.body}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
