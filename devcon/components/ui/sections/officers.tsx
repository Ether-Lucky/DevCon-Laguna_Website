'use client';
import React, { useState } from 'react';
import Button from '@/components/ui/button';
import {TeamMember, team, membersPerPage} from '@/lib/content/officers'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
 
function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* 1. AVATAR */}
      <div className={`relative w-28 h-28 sm:w-40 sm:h-40 md:w-61 md:h-62 rounded-full overflow-hidden bg-gradient-to-b ${member.gradient} flex items-center justify-center`}>
        {member.img ? (
          <img
            src={member.img}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover object-bottom"
          />
        ) : (
          <span className="text-devcon-white/70 text-4xl font-bold">{initials(member.name)}</span>
        )}
      </div>

        <h3 className="mt-4 sm:mt-6 text-center text-lg sm:text-[28px] font-semibold leading-tight sm:leading-[38px] text-foreground">
        {member.name}
        </h3>
        <p className="mt-1 whitespace-pre-line text-center text-xs sm:text-[20px] font-normal uppercase leading-tight sm:leading-[18px] tracking-[0.1em] text-muted">
        {member.role}
        </p>
    </div>
  );
}
 
export default function TeamSection() {
  const totalPages = Math.max(1, Math.ceil(team.length / membersPerPage));
  const [currentPage, setCurrentPage] = useState(0);
 
  const pages = Array.from({ length: totalPages }, (_, i) =>
    team.slice(i * membersPerPage, i * membersPerPage + membersPerPage)
  );
 
  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  return (
    <section id="officers" className="w-full bg-background px-4 py-16 sm:px-6 sm:py-20 md:px-6 md:py-24">
      {/* 2. CONTAINER */}
      <div className="relative mx-auto max-w-[1300px]">
        
        {/* HEADER SECTION */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="mb-6 text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Meet Our <span className="text-devcon-purple-bright">Officers</span>
          </h2>
            <p className="max-w-4xl text-center font-sans text-body-sm sm:text-body-md font-normal leading-[24px] sm:leading-[30px] tracking-normal text-muted px-2 sm:px-0">
              Behind every successful community is a passionate team of volunteers dedicated to creating meaningful<br className="hidden md:block" />
              experiences for developers. Meet the officers leading DevCon Laguna's initiatives and programs.
            </p>
        </div>
        
        {/* Next button */}
        <button
          onClick={nextPage}
          className="absolute -right-2 sm:-right-4 md:-right-12 top-[55%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 bg-white hover:bg-white/90 text-black rounded-full flex items-center justify-center shadow-md transition-all"
          aria-label="Next page"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Previous button */}
        <button
          onClick={prevPage}
          className="absolute -left-2 sm:-left-4 md:-left-12 top-[55%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 bg-white hover:bg-white/90 text-black rounded-full flex items-center justify-center shadow-md transition-all"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {pages.map((pageMembers, pageIdx) => (
              <div
                key={pageIdx}
                className="w-full flex-shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-x-4 sm:gap-x-12 gap-y-10 sm:gap-y-20"
              >
                {pageMembers.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            ))}
          </div>
        </div>
 
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentPage === idx ? 'w-7 bg-foreground' : 'w-3 bg-foreground/30'
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        )}
 
        <div className="flex justify-center mt-8 sm:mt-10 [&_svg]:hidden [&>a]:!px-[32px] sm:[&>a]:!px-[54px] [&>a]:!py-[20px] sm:[&>a]:!py-[28px] [&>a]:!h-[56px] sm:[&>a]:!h-[74px] [&>a]:!rounded-[47px]
         [&>a]:!text-[16px] sm:[&>a]:!text-[20px] [&>a]:!font-[700] [&>a]:!leading-[20px] [&>a]:!tracking-[0%] [&>a]:![font-family:'DM_Sans',sans-serif]">
            <Button label="Meet the Team" href="/team" hasArrow={false} />
        </div>
      </div>
    </section>
  );
}