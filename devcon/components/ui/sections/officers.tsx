'use client';
import React, { useState } from 'react';
import Button from '@/components/ui/button';
 
interface TeamMember {
  id: number;
  name: string;
  role: string;
  img?: string;
  gradient: string;
}
 
const TEAM: TeamMember[] = [
  { id: 1, name: 'Danmel Laranga', role: 'President', img: '/images/officers/president.png', gradient: 'from-transparent from-10% to-[#F0C419]' },
  { id: 2, name: 'Sherwin Limosnero', role: 'Executive Vice President', img: '/images/officers/vice-president.png', gradient: 'from-transparent from-15% to-[#F2801E]' },
  { id: 3, name: 'Ivy Villarin', role: 'Secretary', img: '/images/officers/secretary.png', gradient: 'from-transparent from-20% to-[#6A0DF2]' },
  { id: 4, name: 'Stephanie Rano', role: 'VP for Finance', img: '/images/officers/finance.png', gradient: 'from-transparent from-18% to-[#96AE01]' },
  { id: 5, name: 'Lucky Guevarra', role: 'VP for Technology', img: '/images/officers/technology.png', gradient: 'from-transparent from-18% to-[#96AE01]' },
  { id: 6, name: 'Raziel Sevilla', role: 'VP for Memberships', img: '/images/officers/membership.png', gradient: 'from-transparent from-20% to-[#6A0DF2]' },
  { id: 7, name: 'Nichole Caraliman', role: 'VP for Communications', img: '/images/officers/communication.png', gradient: 'from-transparent from-15% to-[#F2801E]' },
  { id: 8, name: 'Andrew Dejito', role: 'VP for Partnerships & Fundraising', img: '/images/officers/partnerships-fundraising.png', gradient: 'from-transparent from-10% to-[#F0C419]' },
  { id: 9, name: 'Alyssa Marie Valera', role: 'VP for Marketing', img: '/images/officers/marketing.png', gradient: 'from-devcon-black to-[#C0E00B]' },
  { id: 10, name: 'Kurt Joshua P. Cayaga', role: 'VP for Campus DevCon', img: '/images/officers/campus-devcon.png', gradient: 'from-devcon-black to-[#F2801E]' },
  { id: 11, name: 'Emmanuel Benedict Soliveres', role: 'VP for DevCon Kids', img: '/images/officers/devcon-kids.png', gradient: 'from-devcon-black to-devcon-purple-bright' },
  { id: 12, name: 'Zyrus Alvez', role: 'Code Camp & Summit Lead', img: '/images/officers/code-camp-and-summit-lead.png', gradient: 'from-devcon-black to-[#4A5D23]' },
];
 
const MEMBERS_PER_PAGE = 8;
 
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
      <div className={`relative w-61 h-62 rounded-full overflow-hidden bg-gradient-to-b ${member.gradient} flex items-center justify-center`}>
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

        <h3 className="text-devcon-white text-[28px] leading-[38px] font-semibold mt-6 text-center whitespace-nowrap">
        {member.name}
        </h3>
        <p className="text-devcon-gray text-[20px] leading-[18px] font-normal uppercase tracking-[0.1em] mt-1 text-center whitespace-pre-line">
        {member.role}
        </p>
    </div>
  );
}
 
export default function TeamSection() {
  const totalPages = Math.max(1, Math.ceil(TEAM.length / MEMBERS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState(0);
 
  const pages = Array.from({ length: totalPages }, (_, i) =>
    TEAM.slice(i * MEMBERS_PER_PAGE, i * MEMBERS_PER_PAGE + MEMBERS_PER_PAGE)
  );
 
  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  return (
    <section id="officers" className="w-full bg-devcon-black py-24 px-6">
      {/* 2. CONTAINER */}
      <div className="max-w-[1300px] mx-auto relative">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Meet Our <span className="text-devcon-purple-bright">Officers</span>
          </h2>
            <p className="text-devcon-gray max-w-4xl text-center text-body-md font-normal leading-[30px] tracking-normal font-sans">
              Behind every successful community is a passionate team of volunteers dedicated to creating meaningful<br className="hidden md:block" />
              experiences for developers. Meet the officers leading DevCon Laguna's initiatives and programs.
            </p>
        </div>
        
        {/* Next button */}
        <button
          onClick={nextPage}
          className="absolute -right-4 md:-right-12 top-[55%] -translate-y-1/2 z-20 w-11 h-11 bg-white hover:bg-white/90 text-black rounded-full flex items-center justify-center shadow-md transition-all"
          aria-label="Next page"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Previous button */}
        <button
          onClick={prevPage}
          className="absolute -left-4 md:-left-12 top-[55%] -translate-y-1/2 z-20 w-11 h-11 bg-white hover:bg-white/90 text-black rounded-full flex items-center justify-center shadow-md transition-all"
          aria-label="Previous page"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
                className="w-full flex-shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-20"
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
                  currentPage === idx ? 'w-7 bg-white' : 'w-3 bg-white/30'
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        )}
 
        <div className="flex justify-center mt-10 [&_svg]:hidden [&>a]:!px-[54px] [&>a]:!py-[28px] [&>a]:!h-[74px] [&>a]:!rounded-[47px]
         [&>a]:!text-[20px] [&>a]:!font-[700] [&>a]:!leading-[20px] [&>a]:!tracking-[0%] [&>a]:![font-family:'DM_Sans',sans-serif]">
            <Button label="Meet the Team" href="/team" hasArrow={false} />
        </div>
      </div>
    </section>
  );
}