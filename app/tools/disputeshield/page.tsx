"use client";

import { useState } from "react";
import { ArrowRight, Check, FileText, ShieldCheck } from "lucide-react";
import CheckoutModal from "@/components/CheckoutModal";

export default function DisputeShieldPage() {
  const [checkout, setCheckout] = useState<"monthly" | "lifetime" | null>(null);

  return (
    <>
      <section className="grid-background border-b border-[#222226]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-[#8E8E93]">01 // DISPUTESHIELD</span>
            <span className="rounded-md border border-[#10B981]/30 px-2 py-1 font-mono text-[9px] text-[#10B981]">SHIPPING NOW</span>
          </div>
          <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] md:text-7xl">Turn chargeback chaos into a 6-page rebuttal dossier.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#8E8E93] md:text-lg">Turn raw Stripe &amp; Shopify order logs, carrier tracking, and refund policies into a Visa/Mastercard-compliant chargeback rebuttal PDF in 8 seconds.</p>
        </div>
      </section>

      <section className="border-b border-[#222226]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <p className="font-mono text-[10px] tracking-[0.14em] text-[#8E8E93]">PROBLEM / SOLUTION</p>
          <div className="mt-6 grid overflow-hidden rounded-xl border border-[#222226] md:grid-cols-2">
            <article className="border-b border-[#222226] p-6 md:border-b-0 md:border-r md:p-8">
              <p className="font-mono text-[10px] text-[#F59E0B]">BEFORE // MANUAL SCRAMBLE</p>
              <h2 className="mt-5 text-2xl font-semibold">2 hours across 7 tabs.</h2>
              <ul className="mt-6 space-y-3 text-sm text-[#8E8E93]">
                <li>Search Stripe, Shopify, and carrier portals</li>
                <li>Copy IP, AVS/CVC, timestamps, and policies</li>
                <li>Format each reason code by hand</li>
                <li>Risk missing one critical piece of evidence</li>
              </ul>
            </article>
            <article className="bg-[#111113] p-6 md:p-8">
              <p className="font-mono text-[10px] text-[#10B981]">AFTER // DRYDOCK ENGINE</p>
              <h2 className="mt-5 text-2xl font-semibold">A clean dossier in 8 seconds.</h2>
              <ul className="mt-6 space-y-3 text-sm text-[#8E8E93]">
                {["Auto-compiled order evidence", "Visa/Mastercard-ready structure", "Reason-code-specific formatting", "One export-ready PDF"].map((item) => (
                  <li key={item} className="flex items-center gap-2"><Check size={14} strokeWidth={1.5} className="text-[#10B981]" /> {item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-[#222226]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <p className="font-mono text-[10px] tracking-[0.14em] text-[#8E8E93]">WORKFLOW // LIVE SCHEMATIC</p>
          <div className="mt-6 grid items-stretch gap-3 lg:grid-cols-[1fr_56px_1fr_56px_1fr]">
            <div className="rounded-xl border border-[#222226] bg-[#111113] p-5">
              <p className="font-mono text-[9px] text-[#8E8E93]">01 // INPUT PAYLOAD</p>
              <div className="mt-5 rounded-lg border border-[#222226] bg-[#09090B] p-4 font-mono text-[10px] leading-5 text-[#8E8E93]">
                {"{"}<br />&nbsp;&nbsp;&quot;platform&quot;: &quot;stripe&quot;,<br />&nbsp;&nbsp;&quot;order&quot;: &quot;ord_8841&quot;,<br />&nbsp;&nbsp;&quot;tracking&quot;: &quot;1Z...&quot;,<br />&nbsp;&nbsp;&quot;avs&quot;: &quot;matched&quot;<br />{"}"}
              </div>
            </div>
            <div className="hidden items-center justify-center lg:flex"><ArrowRight size={17} strokeWidth={1.5} className="text-[#5F5F66]" /></div>
            <div className="rounded-xl border border-[#222226] bg-[#111113] p-5">
              <p className="font-mono text-[9px] text-[#8E8E93]">02 // EVIDENCE ENGINE</p>
              <div className="mt-5 grid h-32 place-items-center rounded-lg border border-[#222226] bg-[#09090B]"><ShieldCheck size={34} strokeWidth={1.5} className="text-[#10B981]" /></div>
            </div>
            <div className="hidden items-center justify-center lg:flex"><ArrowRight size={17} strokeWidth={1.5} className="text-[#5F5F66]" /></div>
            <div className="rounded-xl border border-[#222226] bg-[#111113] p-5">
              <p className="font-mono text-[9px] text-[#8E8E93]">03 // OUTPUT DOSSIER</p>
              <div className="mt-5 flex h-32 items-center gap-4 rounded-lg border border-[#222226] bg-[#09090B] px-5">
                <FileText size={28} strokeWidth={1.5} />
                <div><p className="text-xs font-semibold">Rebuttal.pdf</p><p className="mt-1 font-mono text-[9px] text-[#8E8E93]">6 PAGES // READY</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#222226]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <p className="font-mono text-[10px] tracking-[0.14em] text-[#8E8E93]">PRICING // ONE-TOOL ACCESS</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-[#222226] bg-[#111113] p-6 md:p-8">
              <p className="font-mono text-[10px] text-[#8E8E93]">STANDARD / MONTHLY</p>
              <div className="mt-5 flex items-end gap-1"><span className="font-mono text-5xl">$79</span><span className="pb-2 text-xs text-[#8E8E93]">/mo</span></div>
              <p className="mt-5 text-sm text-[#8E8E93]">Full DisputeShield access. Cancel anytime.</p>
              <button type="button" onClick={() => setCheckout("monthly")} className="mt-8 h-11 w-full rounded-lg bg-[#FAFAFA] text-sm font-semibold text-[#09090B]">Choose Monthly</button>
            </article>
            <article className="rounded-xl border border-[#333338] bg-[#111113] p-6 md:p-8">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] text-[#10B981]">FOUNDING ACCESS</p>
                <span className="font-mono text-[9px] text-[#8E8E93]">25 SPOTS</span>
              </div>
              <div className="mt-5 flex items-end gap-1"><span className="font-mono text-5xl">$299</span><span className="pb-2 text-xs text-[#8E8E93]">one-time</span></div>
              <p className="mt-5 text-sm text-[#8E8E93]">Founding lifetime access. Limited batch.</p>
              <button type="button" onClick={() => setCheckout("lifetime")} className="mt-8 h-11 w-full rounded-lg bg-[#FAFAFA] text-sm font-semibold text-[#09090B]">Reserve Lifetime Access</button>
            </article>
          </div>
        </div>
      </section>

      <CheckoutModal open={checkout !== null} onClose={() => setCheckout(null)} plan={checkout ?? "monthly"} />
    </>
  );
}
