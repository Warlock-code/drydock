"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, FileText, ShieldCheck } from "lucide-react";
import CheckoutModal from "@/components/CheckoutModal";

export default function DisputeShieldPage() {
  const [checkout, setCheckout] = useState<"six-month" | null>(null);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [remaining, setRemaining] = useState(10);
  const [form, setForm] = useState({
    storeName: "",
    orderId: "",
    transactionAmount: "",
    disputeReason: "",
    customerEmail: "",
    ipAddress: "",
    avsCvcMatch: "",
    carrierAndTracking: "",
    deliveryStatus: "",
    policySummary: "",
  });

  const inputClass = "mt-2 h-11 w-full border border-[#222226] bg-[#09090B] px-3 text-sm text-[#FAFAFA] placeholder:text-[#5F5F66]";
  const labelClass = "text-[11px] font-medium text-[#B3B3B8]";

  useEffect(() => {
    async function loadAccessState() {
      try {
        const spotsResponse = await fetch("/api/disputes/spots", { cache: "no-store" });
        if (spotsResponse.ok) {
          const spots = await spotsResponse.json() as { remaining: number };
          setRemaining(spots.remaining);
        }
      } catch {
        // Keep the UI at the safe default until the next check.
      }

      const storedKey = window.localStorage.getItem("drydock_ds_access_key");
      if (!storedKey) return;

      try {
        const response = await fetch("/api/keys/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyCode: storedKey }),
        });
        const data = await response.json().catch(() => null);

        if (response.ok && data?.valid && data.expiresAt) {
          window.localStorage.setItem("drydock_ds_unlocked", "true");
          window.localStorage.setItem("drydock_ds_expires_at", data.expiresAt);
          setUnlocked(true);
          setExpiresAt(data.expiresAt);
        } else {
          window.localStorage.removeItem("drydock_ds_unlocked");
          window.localStorage.removeItem("drydock_ds_access_key");
          window.localStorage.removeItem("drydock_ds_expires_at");
          setUnlocked(false);
          setExpiresAt("");
          setStatus(data?.error || "Your access key is no longer active.");
        }
      } catch {
        setUnlocked(false);
      }
    }

    loadAccessState();
  }, []);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function loadSample() {
    setForm({
      storeName: "Northstar Supply Co.",
      orderId: "ORD-8841",
      transactionAmount: "$248.00",
      disputeReason: "Merchandise/Services Not Received",
      customerEmail: "customer@example.com",
      ipAddress: "203.0.113.42",
      avsCvcMatch: "AVS Y - matched / CVC M - matched",
      carrierAndTracking: "UPS // 1Z8841EXAMPLE",
      deliveryStatus: "Delivered - signed by recipient",
      policySummary: "Orders ship within 2 business days. Delivery is confirmed by carrier proof. Refund requests are accepted within 30 days of delivery.",
    });
    setStatus("Sample dispute loaded.");
  }

  async function generateDossier(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isUnlocked = window.localStorage.getItem("drydock_ds_unlocked") === "true";
    const storedAccessKey = window.localStorage.getItem("drydock_ds_access_key");
    if (!isUnlocked && window.localStorage.getItem("drydock_ds_free_used") === "true") {
      if (remaining > 0) setCheckout("six-month");
      else setStatus("All 10 founding passes have been activated.");
      return;
    }

    setGenerating(true);
    setStatus("");

    try {
      const response = await fetch("/api/disputes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          accessKey: isUnlocked ? storedAccessKey || undefined : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Unable to generate dossier.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `DisputeShield-${form.orderId.replace(/[^A-Za-z0-9_-]+/g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      if (!isUnlocked) {
        window.localStorage.setItem("drydock_ds_free_used", "true");
      }
      setStatus("Dossier generated and downloaded.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to generate dossier.");
    } finally {
      setGenerating(false);
    }
  }

  async function unlockDisputeShield() {
    if (!accessKey.trim()) {
      setStatus("Enter an access key.");
      return;
    }

    try {
      const response = await fetch("/api/keys/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyCode: accessKey }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.valid) {
        setStatus(data?.error || "Invalid or revoked access key");
        return;
      }

      window.localStorage.setItem("drydock_ds_unlocked", "true");
      window.localStorage.setItem("drydock_ds_access_key", data.keyCode);
      window.localStorage.setItem("drydock_ds_expires_at", data.expiresAt);
      setUnlocked(true);
      setExpiresAt(data.expiresAt);
      setAccessKey("");
      setStatus("6-Month Access Pass unlocked. Unlimited dossiers enabled.");

      const spotsResponse = await fetch("/api/disputes/spots", { cache: "no-store" });
      if (spotsResponse.ok) {
        const spots = await spotsResponse.json() as { remaining: number };
        setRemaining(spots.remaining);
      }
    } catch {
      setStatus("Unable to verify access key.");
    }
  }

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

      <section className="border-b border-[#222226] bg-[#09090B]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.14em] text-[#10B981]">LIVE GENERATOR // 1 FREE DOWNLOAD</p>
              <span className="mt-4 inline-flex rounded-md border border-[#10B981]/30 px-3 py-2 font-mono text-[9px] text-[#10B981]">
                {remaining} OF 10 FOUNDING 6-MONTH PASSES REMAINING
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Live Dispute Dossier Generator</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8E8E93]">Compile transaction, identity, fulfillment, and policy evidence into a structured rebuttal PDF.</p>
            </div>
            <button type="button" onClick={loadSample} className="h-10 rounded-lg border border-[#333338] bg-[#111113] px-4 text-xs font-semibold hover:border-[#4A4A50]">
              Load Sample Dispute
            </button>
          </div>

          <form onSubmit={generateDossier} className="mt-8 grid gap-3 rounded-xl border border-[#222226] bg-[#111113] p-5 md:grid-cols-2 md:p-7">
            <label className={labelClass}>
              Store name
              <input className={inputClass} required value={form.storeName} onChange={(event) => updateField("storeName", event.target.value)} placeholder="Northstar Supply Co." />
            </label>
            <label className={labelClass}>
              Order ID
              <input className={inputClass} required value={form.orderId} onChange={(event) => updateField("orderId", event.target.value)} placeholder="ORD-8841" />
            </label>
            <label className={labelClass}>
              Transaction amount
              <input className={inputClass} required value={form.transactionAmount} onChange={(event) => updateField("transactionAmount", event.target.value)} placeholder="$248.00" />
            </label>
            <label className={labelClass}>
              Dispute reason
              <input className={inputClass} required value={form.disputeReason} onChange={(event) => updateField("disputeReason", event.target.value)} placeholder="Merchandise/Services Not Received" />
            </label>
            <label className={labelClass}>
              Customer email
              <input className={inputClass} required type="email" value={form.customerEmail} onChange={(event) => updateField("customerEmail", event.target.value)} placeholder="customer@example.com" />
            </label>
            <label className={labelClass}>
              IP address
              <input className={inputClass} required value={form.ipAddress} onChange={(event) => updateField("ipAddress", event.target.value)} placeholder="203.0.113.42" />
            </label>
            <label className={labelClass}>
              AVS / CVC match
              <input className={inputClass} required value={form.avsCvcMatch} onChange={(event) => updateField("avsCvcMatch", event.target.value)} placeholder="AVS Y - matched / CVC M - matched" />
            </label>
            <label className={labelClass}>
              Carrier and tracking
              <input className={inputClass} required value={form.carrierAndTracking} onChange={(event) => updateField("carrierAndTracking", event.target.value)} placeholder="UPS // 1Z8841EXAMPLE" />
            </label>
            <label className={`md:col-span-2 ${labelClass}`}>
              Delivery status
              <input className={inputClass} required value={form.deliveryStatus} onChange={(event) => updateField("deliveryStatus", event.target.value)} placeholder="Delivered - signed by recipient" />
            </label>
            <label className={`md:col-span-2 ${labelClass}`}>
              Policy summary
              <textarea className="mt-2 min-h-28 w-full resize-y border border-[#222226] bg-[#09090B] px-3 py-3 text-sm text-[#FAFAFA] placeholder:text-[#5F5F66]" required value={form.policySummary} onChange={(event) => updateField("policySummary", event.target.value)} placeholder="Describe shipping, delivery, return, and refund terms..." />
            </label>
            <div className="mt-2 flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-[9px] text-[#8E8E93]" aria-live="polite">
                  {status || (unlocked
                    ? `ACTIVE UNTIL ${expiresAt ? new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(expiresAt)).toUpperCase() : "VERIFIED"}`
                    : "FREE FILE // 1 REMAINING ON THIS DEVICE")}
                </p>
                <div className="mt-3 flex max-w-lg items-end gap-2">
                  <label className="min-w-0 flex-1 text-[10px] text-[#8E8E93]">
                    Already have a 6-Month Access Key? Enter Key
                    <input
                      value={accessKey}
                      onChange={(event) => setAccessKey(event.target.value)}
                      placeholder="DRYDOCK-6M-..."
                      className="mt-2 h-10 w-full border border-[#222226] bg-[#09090B] px-3 text-xs text-[#FAFAFA] placeholder:text-[#5F5F66]"
                    />
                  </label>
                  <button type="button" onClick={unlockDisputeShield} className="h-10 shrink-0 rounded-lg border border-[#333338] px-3 text-xs font-semibold hover:border-[#4A4A50]">
                    {unlocked ? "Unlocked" : "Unlock"}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={generating} className="h-11 min-w-48 rounded-lg bg-[#FAFAFA] px-5 text-sm font-semibold text-[#09090B] disabled:cursor-wait disabled:opacity-60">
                {generating ? "Generating..." : unlocked ? "Generate Unlimited PDF" : "Generate & Download PDF"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="border-b border-[#222226]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <p className="font-mono text-[10px] tracking-[0.14em] text-[#8E8E93]">PRICING // ONE-TOOL ACCESS</p>
          <article className="mt-6 rounded-xl border border-[#333338] bg-[#111113] p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[10px] text-[#10B981]">6-MONTH ACCESS PASS</p>
              <span className="font-mono text-[9px] text-[#8E8E93]">DIRECT GREY / BANK TRANSFER</span>
            </div>
            <div className="mt-5 flex items-end gap-2">
              <span className="font-mono text-5xl">$399</span>
              <span className="pb-2 text-xs text-[#8E8E93]">/ 6 months</span>
            </div>
            <p className="mt-5 text-sm text-[#8E8E93]">Unlimited DisputeShield PDF dossiers for 6 months.</p>
            <button type="button" onClick={() => setCheckout("six-month")} disabled={remaining === 0} className="mt-8 h-11 w-full rounded-lg bg-[#FAFAFA] text-sm font-semibold text-[#09090B] disabled:cursor-not-allowed disabled:opacity-50">
              {remaining === 0 ? "All Founding Passes Activated" : "Get 6-Month Access Pass"}
            </button>
          </article>
        </div>
      </section>

      <CheckoutModal open={checkout !== null} onClose={() => setCheckout(null)} plan="six-month" remaining={remaining} />
    </>
  );
}
