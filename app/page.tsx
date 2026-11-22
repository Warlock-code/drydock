import Link from "next/link";
import { ArrowRight, ArrowUpRight, Boxes, LockKeyhole, Workflow } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="grid-background border-b border-[#222226]">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center px-5 py-20 md:px-8 md:py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#27272A] bg-[#111113]/80 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-[#A1A1AA]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              DRYDOCK STUDIO // BUILDING IN PUBLIC
            </div>
            <h1 className="mt-8 max-w-4xl text-[clamp(3.25rem,8vw,6.75rem)] font-semibold leading-[0.94] tracking-[-0.065em]">
              Small software.
              <br />
              Serious operational value.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-[#A1A1AA] md:text-lg">
              Drydock is the parent company for focused business tools. We turn expensive, repetitive problems into software that is simple enough to use immediately.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/offers" className="group flex h-12 items-center justify-center gap-3 rounded-lg bg-[#FAFAFA] px-5 text-sm font-semibold text-[#09090B] transition hover:bg-white">
                Explore tools &amp; offers
                <ArrowRight size={16} strokeWidth={1.5} className="transition group-hover:translate-x-0.5" />
              </Link>
              <Link href="/tools/disputeshield" className="flex h-12 items-center justify-center gap-3 rounded-lg border border-[#333338] px-5 text-sm font-medium text-[#FAFAFA] transition hover:border-[#4A4A50] hover:bg-[#111113]">
                Inspect DisputeShield
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="thesis" className="border-b border-[#222226]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-[0.14em] text-[#8E8E93]">METHOD // 001—003</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">The Drydock Method</h2>
            </div>
          </div>
          <div className="grid border-l border-t border-[#222226] md:grid-cols-3">
            {[
              ["01 / Purpose-Built", "Each tool fixes one clear operational problem.", Workflow],
              ["02 / Self-Serve", "Choose a tool, enter your data, and get the result. No sales calls.", LockKeyhole],
              ["03 / Modular", "Start with the problem you have now. Add more tools later.", Boxes],
            ].map(([title, copy, Icon]) => (
              <article key={title as string} className="border-b border-r border-[#222226] p-6 transition hover:bg-[#111113] md:min-h-52">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#222226] text-[#8E8E93]">
                  <Icon size={17} strokeWidth={1.5} />
                </div>
                <h3 className="mt-8 text-sm font-semibold">{title as string}</h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-[#8E8E93]">{copy as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#222226]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[10px] tracking-[0.14em] text-[#8E8E93]">LIVE TOOL // 01</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">DisputeShield</h2>
            </div>
            <span className="font-mono text-[10px] text-[#10B981]">SHIPPING NOW</span>
          </div>
          <Link href="/tools/disputeshield" className="group mt-6 grid overflow-hidden rounded-xl border border-[#222226] bg-[#111113] md:grid-cols-[1fr_280px]">
            <div className="p-6 md:p-8">
              <p className="max-w-2xl text-xl font-medium leading-8 md:text-2xl md:leading-9">
                Turn Stripe and Shopify chargeback evidence into a structured rebuttal dossier in 8 seconds.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm text-[#FAFAFA]">
                Inspect the workflow <ArrowUpRight size={14} strokeWidth={1.5} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
            <div className="grid grid-cols-2 border-t border-[#222226] md:grid-cols-1 md:border-l md:border-t-0">
              <div className="border-r border-[#222226] p-5 md:border-b md:border-r-0">
                <p className="font-mono text-[9px] text-[#8E8E93]">FROM</p>
                <p className="mt-3 font-mono text-2xl">~2 hours</p>
              </div>
              <div className="p-5">
                <p className="font-mono text-[9px] text-[#8E8E93]">TO</p>
                <p className="mt-3 font-mono text-2xl text-[#10B981]">8 seconds</p>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
