'use client';
import React from 'react';
import { TeamMember, team } from '@/lib/content/officers'
import Image from 'next/image'
import { BatchCarousel } from '@/components/ui/batch-carousel';

/**
 * initials — derives up to 2 uppercase initials from a full name.
 * Used as the avatar fallback when a member photo is unavailable.
 *
 * @example initials("Lucky Guevarra") // → "LG"
 */
function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
 
/**
 * TeamCard — displays a single officer's circular avatar, name, and role.
 *
 * `toAccentColor` maps the member's `accent` keyword to a Tailwind `to-*` gradient
 * class used in the avatar circle background. If no matching key is found it falls
 * back to `devcon-purple-700`.
 *
 * When no `img` is provided, initials are shown inside the gradient circle.
 */
function TeamCard({ member }: { member: TeamMember }) {
  const toAccentColor: Record<string, string> = {
    'yellow': 'to-devcon-yellow-500',
    'orange': 'to-devcon-orange-500',
    'purple': 'to-devcon-purple-700',
    'lime': 'to-devcon-lime-500',
  } 
  return (
    <div className="flex flex-col items-center justify-start text-center font-sans w-full max-w-56 mx-auto px-2 h-full">
      {/* 1. AVATAR */}
      <div className={`relative w-full max-w-36 sm:max-w-44 md:max-w-52 aspect-square rounded-full overflow-hidden bg-gradient-to-b from-transparent from-15% ${toAccentColor[member.accent] || 'to-devcon-purple-700'} flex items-center justify-center`}>
        {member.img ? (
          <Image
            src={member.img}
            alt={member.name}
            width={member.width}
            height={member.height}
            sizes="(max-width: 640px) 9rem, (max-width: 768px) 11rem, 13rem"
            className="absolute inset-0 w-full h-full object-cover object-bottom"
          />
        ) : (
          <span className="text-devcon-white-500/70 text-4xl font-bold">{initials(member.name)}</span>
        )}
      </div>

      <h3 className="mt-6 text-xl md:text-2xl font-bold leading-tight text-foreground">
        {member.name}
      </h3>
      <p className="mt-2 text-sm md:text-base font-normal uppercase tracking-widest leading-tight text-muted">
        {member.role}
      </p>
    </div>
  );
}
 
/**
 * TeamSection — the "Meet Our Officers" homepage section.
 *
 * Officers are grouped into pairs, and each pair becomes one two-row column of
 * the carousel. The carousel shows a whole batch of those columns — four on a
 * desktop, fewer as the screen narrows — and each press moves it by exactly one
 * column: the column at the front leaves, one new column arrives at the end.
 *
 * It uses `BatchCarousel` rather than the shared `DynamicCarousel` for that
 * reason. A free-scrolling carousel leaves a half-cut officer at the edge, which
 * reads as an accident on a section whose whole job is introducing people.
 *
 * Accent colors are resolved inside `TeamCard` via the `toAccentColor` map.
 *
 * `members` comes from the DevConnect Portal, fetched on the server by
 * `lib/portal/content.ts` (CMS-03). It defaults to the bundled list so this
 * component still renders on its own — in a test, or anywhere the data has not
 * been fetched — rather than throwing on an undefined prop.
 */
export default function TeamSection({ members = team }: { members?: TeamMember[] }) {
  // Group members into columns of 2 for a two-row carousel
  const MEMBERS_PER_TILE = 2;
  const carouselTiles = [];
  for (let i = 0; i < members.length; i += MEMBERS_PER_TILE) {
    carouselTiles.push(
      <div key={i} className="grid grid-rows-2 gap-6 md:gap-10 h-full w-full">
        <TeamCard member={members[i]} />
        {members[i + 1] ? <TeamCard member={members[i + 1]} /> : <div />}
      </div>
    );
  }

  return (
    <section id="officers" className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      {/* 2. CONTAINER */}
      <div className="relative">
        
        {/* HEADER SECTION */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-foreground">
            Meet Our <span className="text-accent-purple">Officers</span>
          </h2>
        <p className="mt-6 max-w-xl text-base text-muted">
            Behind every successful community is a passionate team of volunteers dedicated to creating meaningful experiences for developers. Meet the officers leading DevCon Laguna&apos;s initiatives and programs.
          </p>
        </div>
        
        <BatchCarousel
          label="DevCon Laguna officers"
          previousLabel="Previous officers"
          nextLabel="Next officers"
          className="w-full py-8 px-4"
          tiles={carouselTiles}
          describeRange={(firstTile, lastTile) =>
            `Showing officers ${firstTile * MEMBERS_PER_TILE + 1} to ` +
            `${Math.min(members.length, (lastTile + 1) * MEMBERS_PER_TILE)} of ${members.length}`
          }
        />
       </div>
    </section>
  );
}