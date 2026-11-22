"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#222226]/90 bg-[#09090B]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-6 w-6 grid-cols-2 gap-[3px] border border-[#3F3F46] p-[4px]">
            <span className="bg-[#FAFAFA]" />
            <span className="bg-[#8E8E93]" />
            <span className="bg-[#8E8E93]" />
            <span className="bg-[#FAFAFA]" />
          </span>
          <span className="text-sm font-semibold tracking-[0.18em]">DRYDOCK</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link className="nav-link" href="/#thesis">Manifesto</Link>
          <Link className="nav-link" href="/offers">Offers</Link>
        </div>

        <Link href="/offers" className="hidden h-9 items-center gap-2 rounded-lg border border-[#333338] bg-[#FAFAFA] px-4 text-sm font-semibold text-[#09090B] transition hover:bg-white md:flex">
          Explore Offers <ArrowUpRight size={15} strokeWidth={1.5} />
        </Link>

        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#222226] md:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="relative h-3 w-4">
            <span className={`absolute left-0 h-px w-4 bg-white transition ${open ? "top-[5px] rotate-45" : "top-1"}`} />
            <span className={`absolute left-0 h-px w-4 bg-white transition ${open ? "top-[5px] -rotate-45" : "top-2"}`} />
          </span>
        </button>

        {open && (
          <div className="absolute left-0 top-16 w-full border-b border-[#222226] bg-[#09090B] p-5 md:hidden">
            <div className="flex flex-col gap-1">
              {[
                ["Manifesto", "/#thesis"],
                ["Offers", "/offers"],
              ].map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-[#FAFAFA] hover:bg-[#111113]">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
