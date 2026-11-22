"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";

type CheckoutModalProps = {
  open: boolean;
  onClose: () => void;
  plan: "monthly" | "lifetime";
};

export default function CheckoutModal({ open, onClose, plan }: CheckoutModalProps) {
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (!open) {
      setFallback(false);
      return;
    }
    const url = plan === "monthly"
      ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_URL
      : process.env.NEXT_PUBLIC_STRIPE_LIFETIME_URL;

    if (url) {
      setFallback(false);
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      setFallback(true);
    }
  }, [open, plan]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm md:items-center" role="dialog" aria-modal="true" aria-label="Checkout">
      <div className="w-full max-w-md rounded-xl border border-[#333338] bg-[#111113] p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] text-[#8E8E93]">{plan === "monthly" ? "MONTHLY ACCESS" : "FOUNDING LIFETIME"}</p>
            <h2 className="mt-2 text-xl font-semibold">{fallback ? "Opening in final batch" : "Opening secure checkout"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg border border-[#222226] text-[#8E8E93] hover:text-white"><X size={15} strokeWidth={1.5} /></button>
        </div>
        <div className="mt-6 rounded-lg border border-[#222226] bg-[#09090B] p-4">
          {fallback ? (
            <>
              <p className="text-sm leading-6 text-[#8E8E93]">Payment checkout is being prepared. Reserve an early spot and we’ll confirm access as the final founding batch opens.</p>
              <button type="button" onClick={onClose} className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#FAFAFA] text-sm font-semibold text-[#09090B]">
                Reserve Early Spot <ArrowUpRight size={14} strokeWidth={1.5} />
              </button>
            </>
          ) : (
            <p className="text-sm text-[#8E8E93]">Your secure payment page should open in a new tab.</p>
          )}
        </div>
      </div>
    </div>
  );
}
