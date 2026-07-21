'use client';
import React, { useState } from 'react';
import Button from '@/components/ui/button';
 
interface TeamMember {
  id: number;
  name: string;
  role: string;
  img?: string; // add a real photo path here when available
  gradient: string; // fallback background behind the avatar
}
 
const TEAM: TeamMember[] = [
  { id: 1, name: 'Danmel Laranga', role: 'President', img: '/images/officers/president.png', gradient: 'from-transparent from-10% to-[#C0E00B]' },
  { id: 2, name: 'Sherwin Limosnero', role: 'Executive Vice President', img: '/images/officers/vice-president.png', gradient: 'from-devcon-black to-[#F2801E]' },
  { id: 3, name: 'Ivy Villarin', role: 'Secretary', img: '/images/officers/secretary.png', gradient: 'from-devcon-black to-[#6A0DF2]' },
  { id: 4, name: 'Stephanie Rano', role: 'VP for Finance', img: '/images/officers/finance.png', gradient: 'from-devcon-black to-[#96AE01]' },
  { id: 5, name: 'Lucky Guevarra', role: 'VP for Technology', gradient: 'from-devcon-black to-[#C0E00B]' },
  { id: 6, name: 'Raziel Sevilla', role: 'VP for Memberships', gradient: 'from-devcon-black to-devcon-purple-bright' },
  { id: 7, name: 'Nichole Caraliman', role: 'VP for Communications', gradient: 'from-devcon-black to-[#F2801E]' },
  { id: 8, name: 'Andrew Dejito', role: 'VP for Partnerships & Fundraising', gradient: 'from-devcon-black to-[#4A5D23]' },
  // Placeholder members below — swap in real names/roles/photos when available
  { id: 9, name: 'Team Member 9', role: 'Role TBA', gradient: 'from-devcon-black to-[#C0E00B]' },
  { id: 10, name: 'Team Member 10', role: 'Role TBA', gradient: 'from-devcon-black to-[#F2801E]' },
  { id: 11, name: 'Team Member 11', role: 'Role TBA', gradient: 'from-devcon-black to-devcon-purple-bright' },
  { id: 12, name: 'Team Member 12', role: 'Role TBA', gradient: 'from-devcon-black to-[#4A5D23]' },
  { id: 13, name: 'Team Member 13', role: 'Role TBA', gradient: 'from-devcon-black to-[#C0E00B]' },
  { id: 14, name: 'Team Member 14', role: 'Role TBA', gradient: 'from-devcon-black to-devcon-purple-bright' },
  { id: 15, name: 'Team Member 15', role: 'Role TBA', gradient: 'from-devcon-black to-[#F2801E]' },
  { id: 16, name: 'Team Member 16', role: 'Role TBA', gradient: 'from-devcon-black to-[#4A5D23]' },
  { id: 17, name: 'Team Member 17', role: 'Role TBA', gradient: 'from-devcon-black to-[#C0E00B]' },
  { id: 18, name: 'Team Member 18', role: 'Role TBA', gradient: 'from-devcon-black to-[#F2801E]' },
  { id: 19, name: 'Team Member 19', role: 'Role TBA', gradient: 'from-devcon-black to-devcon-purple-bright' },
  { id: 20, name: 'Team Member 20', role: 'Role TBA', gradient: 'from-devcon-black to-[#4A5D23]' },
  { id: 21, name: 'Team Member 21', role: 'Role TBA', gradient: 'from-devcon-black to-[#C0E00B]' },
  { id: 22, name: 'Team Member 22', role: 'Role TBA', gradient: 'from-devcon-black to-devcon-purple-bright' },
  { id: 23, name: 'Team Member 23', role: 'Role TBA', gradient: 'from-devcon-black to-[#F2801E]' },
  { id: 24, name: 'Team Member 24', role: 'Role TBA', gradient: 'from-devcon-black to-[#4A5D23]' },
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
      {/* 
        Changed to bg-gradient-to-b. 
        Since your TEAM array uses 'from-devcon-black', this makes the top black, 
        transitioning 'to' the vibrant color at the bottom.
      */}
      <div className={`relative w-52 h-52 rounded-full overflow-hidden bg-gradient-to-b ${member.gradient} flex items-center justify-center`}>
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

      <h3 className="text-devcon-white text-xl font-bold mt-6">{member.name}</h3>
      <p className="text-devcon-gray text-xs font-semibold uppercase tracking-widest mt-1 max-w-[180px]">
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
 
  return (
    <section className="w-full bg-devcon-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {pages.map((pageMembers, pageIdx) => (
              <div
                key={pageIdx}
                className="w-full flex-shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-14"
              >
                {pageMembers.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            ))}
          </div>
        </div>
 
        {/* Dots — one per page. Add more members to TEAM to fill additional pages. */}
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
 
        <div className="flex justify-center mt-10">
          <Button label="Meet the Team" href="/team" hasArrow={false} />
        </div>
      </div>
    </section>
  );
}