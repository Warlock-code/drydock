"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

type CheckoutModalProps = {
  open: boolean;
  onClose: () => void;
  plan: "six-month";
  remaining?: number;
};

export default function CheckoutModal({ open, onClose, plan, remaining: initialRemaining = 10 }: CheckoutModalProps) {
  const [buyerEmail, setBuyerEmail] = useState("");
  const [transferReference, setTransferReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(initialRemaining);

  useEffect(() => {
    if (!open) return;
    setRemaining(initialRemaining);
    fetch("/api/disputes/spots", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((spots) => {
        if (spots && typeof spots.remaining === "number") setRemaining(spots.remaining);
      })
      .catch(() => undefined);
  }, [open, initialRemaining]);

  if (!open) return null;

  async function submitPaymentProof(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: buyerEmail,
          reference: transferReference,
          plan,
          amount: 399,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Unable to log payment.");
      }
      setSubmitted(true);
      setBuyerEmail("");
      setTransferReference("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to log payment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm md:items-center" role="dialog" aria-modal="true" aria-label="Checkout">
      <div className="max-h-[calc(100vh-24px)] w-full max-w-lg overflow-y-auto rounded-xl border border-[#333338] bg-[#111113] p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] text-[#10B981]">6-MONTH ACCESS PASS // $399</p>
            <p className="mt-2 font-mono text-[9px] text-[#8E8E93]">{remaining} of 10 passes left</p>
            <h2 className="mt-2 text-xl font-semibold">Direct Bank Transfer</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg border border-[#222226] text-[#8E8E93] hover:text-white"><X size={15} strokeWidth={1.5} /></button>
        </div>
        <div className="mt-6 rounded-lg border border-[#222226] bg-[#09090B] p-4">
          <p className="font-mono text-[9px] text-[#8E8E93]">WIRE / ACH INSTRUCTIONS</p>
          <dl className="mt-4 grid grid-cols-[110px_1fr] gap-x-3 gap-y-3 text-xs">
            <dt className="text-[#8E8E93]">Bank Name</dt>
            <dd>Lead Bank</dd>
            <dt className="text-[#8E8E93]">Account Name</dt>
            <dd>Anim-Bronyina Agyekum</dd>
            <dt className="text-[#8E8E93]">Account Number</dt>
            <dd className="font-mono">210631779687</dd>
            <dt className="text-[#8E8E93]">ACH Routing Number</dt>
            <dd className="font-mono">101019644</dd>
            <dt className="text-[#8E8E93]">Account Type</dt>
            <dd>Checking</dd>
            <dt className="text-[#8E8E93]">Address</dt>
            <dd>1801 Main St., Kansas City, MO 64108</dd>
          </dl>
          <p className="mt-4 border-t border-[#222226] pt-4 text-xs leading-5 text-[#A1A1AA]">
            <strong className="text-[#FAFAFA]">Reference Note:</strong> Include your email address as the transfer reference.
          </p>
          <p className="mt-3 text-[11px] leading-5 text-[#8E8E93]">
            A founding pass spot is locked in once payment clears and your access key is activated.
          </p>
        </div>

        {submitted ? (
          <div className="mt-5 rounded-lg border border-[#10B981]/30 bg-[#09090B] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Check size={16} className="text-[#10B981]" />
              Payment logged
            </div>
            <p className="mt-2 text-sm leading-6 text-[#8E8E93]">
              Your 6-Month Access Key will be emailed to you within 2 hours once the transfer clears.
            </p>
          </div>
        ) : (
          <form onSubmit={submitPaymentProof} className="mt-5 grid gap-3">
            <label className="text-[11px] text-[#B3B3B8]">
              Buyer Email
              <input required type="email" value={buyerEmail} onChange={(event) => setBuyerEmail(event.target.value)} placeholder="you@company.com" className="mt-2 h-11 w-full border border-[#222226] bg-[#09090B] px-3 text-sm text-[#FAFAFA] placeholder:text-[#5F5F66]" />
            </label>
            <label className="text-[11px] text-[#B3B3B8]">
              Transfer Reference / Transaction ID
              <input required value={transferReference} onChange={(event) => setTransferReference(event.target.value)} placeholder="Reference or transaction ID" className="mt-2 h-11 w-full border border-[#222226] bg-[#09090B] px-3 text-sm text-[#FAFAFA] placeholder:text-[#5F5F66]" />
            </label>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={submitting || remaining === 0} className="mt-1 h-11 rounded-lg bg-[#FAFAFA] text-sm font-semibold text-[#09090B] disabled:cursor-not-allowed disabled:opacity-50">
              {remaining === 0 ? "All Founding Passes Activated" : submitting ? "Logging payment..." : "Submit Transfer Proof"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
