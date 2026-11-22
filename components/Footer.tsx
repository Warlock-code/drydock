import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#222226]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:flex-row md:items-start md:justify-between lg:px-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-[#FAFAFA]">DRYDOCK // SOFTWARE FOR BORING BUSINESS PROBLEMS</p>
          <p className="mt-2 text-xs text-[#8E8E93]">Founded by Anim-Bronyina Agyekum (Obama)</p>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="https://x.com/xfd_obama" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#8E8E93] transition hover:text-[#FAFAFA]">
            @xfd_obama <ExternalLink size={12} strokeWidth={1.5} />
          </Link>
          <Link href="https://x.com/_drydock" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#8E8E93] transition hover:text-[#FAFAFA]">
            @_drydock <ExternalLink size={12} strokeWidth={1.5} />
          </Link>
          <div className="flex items-center gap-2 border-l border-[#222226] pl-5 text-[10px] font-medium tracking-[0.12em] text-[#8E8E93]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.35)]" />
            ALL SYSTEMS NOMINAL // BUILDING TOOL 01
          </div>
        </div>
      </div>
    </footer>
  );
}
