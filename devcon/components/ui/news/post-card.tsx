import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { formatPostDate, postExcerpt, postPath } from '@/lib/portal/posts';
import { isAllowedRemoteImage } from '@/lib/remote-images';
import type { PortalPost } from '@/lib/portal/types';

/**
 * PostCard — one news post in a list (NEWS-02).
 *
 * Used by the homepage's Latest News section and by `/news`, so the two cannot
 * drift apart.
 *
 * The whole card is one link: a screen reader hears one target rather than a
 * heading and an image separately, and there is no small "read more" to aim at.
 *
 * The cover image is checked against the same allowlist as officer photos and
 * event covers. A post whose image is hosted somewhere `next/image` will not
 * optimise renders without one rather than as a broken image — the production
 * incident from CMS-03-BT-01, applied before it can happen again.
 */
export default function PostCard({ post }: { post: PortalPost }) {
  const cover =
    post.cover_image_url && isAllowedRemoteImage(post.cover_image_url) ? post.cover_image_url : null;

  return (
    <Link
      href={postPath(post)}
      // `h-full` so a card without a cover image is the same height as the one
      // beside it; the grid stretches the row, and without it the shorter card
      // leaves a ragged gap.
      className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-zinc-900/40 ring-1 ring-foreground/10 transition-colors hover:ring-devcon-purple-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-devcon-purple-500"
    >
      {cover ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
          <Image
            src={cover}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
          <CalendarIcon className="h-4 w-4 shrink-0" aria-hidden />
          {formatPostDate(post.published_at)}
        </p>

        <h3 className="mt-3 text-xl font-bold leading-tight text-foreground">{post.title}</h3>

        {/*
          Always a sentence: `postExcerpt` falls back to the opening of the body,
          because the portal makes `excerpt` optional and a card with nothing
          under its heading looks unfinished.
        */}
        <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-3">{postExcerpt(post)}</p>
      </div>
    </Link>
  );
}
