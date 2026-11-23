"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { catalog, getVertical } from "@/lib/catalog";

export default function OffersPage() {
  const [branchName, setBranchName] = useState("E-Commerce");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [expandedTool, setExpandedTool] = useState<string | null>("disputeshield");
  const branch = getVertical(branchName);
  const availableTools = branch.tools.filter((tool) => tool.status === "SHIPPING NOW");

  return (
    <main className="grid-background min-h-[calc(100vh-128px)]">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <p className="font-mono text-[10px] tracking-[0.14em] text-[#8E8E93]">OFFERS // CHOOSE A BRANCH</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
          Find the tool for the problem.
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[248px_1fr]">
          <aside className="lg:border-r lg:border-[#222226] lg:pr-6">
            <p className="mb-3 font-mono text-[9px] tracking-[0.14em] text-[#8E8E93]">BUSINESS BRANCH</p>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
              {catalog.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setBranchName(item.name);
                    setSubmitted(false);
                    setError("");
                  }}
                  className={`flex min-w-[180px] items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition lg:min-w-0 ${
                    branchName === item.name
                      ? "border-[#3F3F46] bg-[#111113] text-[#FAFAFA]"
                      : "border-transparent text-[#8E8E93] hover:border-[#222226] hover:text-[#FAFAFA]"
                  }`}
                >
                  <span>{item.name}</span>
                  {branchName === item.name && <ChevronRight size={15} strokeWidth={1.5} />}
                </button>
              ))}
            </div>
          </aside>

          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-[#8E8E93]">{branch.id} // {branch.name.toUpperCase()}</span>
              {branch.status === "ACTIVE" && (
                <span className="rounded-md border border-[#10B981]/30 px-2 py-1 font-mono text-[9px] text-[#10B981]">ACTIVE</span>
              )}
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8E8E93]">{branch.description}</p>
            {branch.problemAreas.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {branch.problemAreas.map((problem) => (
                  <span key={problem} className="rounded-md border border-[#222226] bg-[#111113] px-2.5 py-1.5 text-[11px] text-[#A1A1AA]">
                    {problem}
                  </span>
                ))}
              </div>
            )}

            {availableTools.length > 0 ? (
              <div className="mt-8 grid gap-3">
                {availableTools.map((tool) => (
                  <article key={tool.slug} className="overflow-hidden rounded-xl border border-[#222226] bg-[#111113] transition hover:border-[#3F3F46]">
                    <button
                      type="button"
                      aria-expanded={expandedTool === tool.slug}
                      onClick={() => setExpandedTool(expandedTool === tool.slug ? null : tool.slug)}
                      className="flex w-full flex-col items-start justify-between gap-5 p-6 text-left md:flex-row md:items-center"
                    >
                      <div className="pr-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] text-[#8E8E93]">{tool.id} // TOOL</span>
                          <span className="font-mono text-[9px] text-[#10B981]">{tool.status}</span>
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold">{tool.name}</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8E8E93]">{tool.tagline}</p>
                      </div>
                      <div className="flex w-full shrink-0 items-end justify-between md:w-48">
                        <div className="flex items-end gap-1">
                          <span className="font-mono text-3xl">${tool.monthlyPrice}</span>
                          <span className="pb-1 text-xs text-[#8E8E93]">{tool.sixMonthPrice ? "/6 months" : "/mo"}</span>
                        </div>
                        <ChevronDown size={18} strokeWidth={1.5} className={`mb-1 transition ${expandedTool === tool.slug ? "rotate-180" : ""}`} />
                      </div>
                    </button>
                    {expandedTool === tool.slug && (
                      <div className="border-t border-[#222226] px-6 py-6">
                        {tool.painSolved && (
                          <p className="max-w-2xl text-sm leading-7 text-[#A1A1AA]">{tool.painSolved}</p>
                        )}
                        {tool.highlights && (
                          <div className="mt-5 grid gap-3 md:grid-cols-3">
                            {tool.highlights.map((highlight) => (
                              <div key={highlight} className="rounded-lg border border-[#222226] p-4 text-xs leading-5 text-[#C9C9CE]">
                                {highlight}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-6 flex flex-col items-start gap-4 border-t border-[#222226] pt-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-xs text-[#8E8E93]">
                            <span className="font-mono text-[#FAFAFA]">~2 hours</span> of manual work <span className="px-1">→</span> <span className="font-mono text-[#10B981]">8 seconds</span>
                          </div>
                          <Link href={`/tools/${tool.slug}`} className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#FAFAFA] px-4 text-sm font-semibold text-[#09090B]">
                            Inspect Tool <ArrowRight size={14} strokeWidth={1.5} />
                          </Link>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-[#222226] bg-[#111113] p-6">
                <p className="font-mono text-[10px] text-[#F59E0B]">NO LIVE TOOL IN THIS BRANCH YET</p>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#8E8E93]">
                  Tell us what you need first. We use real requests to decide what Drydock builds next.
                </p>
              </div>
            )}

            <section className="mt-10 border-t border-[#222226] pt-8">
              <p className="font-mono text-[10px] tracking-[0.14em] text-[#8E8E93]">
                {availableTools.length > 0 ? "CAN'T FIND YOUR PROBLEM?" : "TELL US WHAT SHOULD EXIST"}
              </p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <h2 className="text-xl font-semibold">Request a Drydock tool</h2>
                <span className="hidden font-mono text-[9px] text-[#8E8E93] sm:block">PRIVATE // DEMAND REQUEST</span>
              </div>

              {submitted ? (
                <div className="mt-5 rounded-xl border border-[#10B981]/30 bg-[#111113] p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Check size={16} strokeWidth={1.5} className="text-[#10B981]" />
                    Request received
                  </div>
                  <p className="mt-2 text-sm text-[#8E8E93]">We’ll use this to help decide what Drydock builds next.</p>
                </div>
              ) : (
                <form
                  className="mt-5 grid gap-3"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    setSubmitting(true);
                    setError("");
                    const form = event.currentTarget;
                    const data = new FormData(form);
                    const payload = {
                      branch: branchName,
                      problem: String(data.get("problem") ?? ""),
                      monthlyBudget: String(data.get("monthlyBudget") ?? ""),
                      urgency: String(data.get("urgency") ?? ""),
                      details: String(data.get("details") ?? ""),
                      email: String(data.get("email") ?? ""),
                    };

                    try {
                      const response = await fetch("/api/problem-requests", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                      });
                      if (!response.ok) throw new Error("Unable to submit");
                      setSubmitted(true);
                      form.reset();
                    } catch {
                      setError("The request could not be sent. Please try again.");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  <label className="text-xs text-[#8E8E93]" htmlFor="problem">What problem are you trying to solve?</label>
                  <textarea id="problem" name="problem" required rows={4} placeholder="Describe the expensive, repetitive problem…" className="rounded-lg border border-[#333338] bg-[#09090B] px-4 py-3 text-sm outline-none placeholder:text-[#5F5F66] focus:border-[#5A5A62]" />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs text-[#8E8E93]">
                      Monthly budget
                      <input name="monthlyBudget" required type="text" placeholder="$50–$100" className="mt-2 h-11 w-full rounded-lg border border-[#333338] bg-[#09090B] px-4 text-sm outline-none placeholder:text-[#5F5F66] focus:border-[#5A5A62]" />
                    </label>
                    <label className="text-xs text-[#8E8E93]">
                      How urgent is it?
                      <select name="urgency" required defaultValue="" className="mt-2 h-11 w-full rounded-lg border border-[#333338] bg-[#09090B] px-4 text-sm outline-none focus:border-[#5A5A62]">
                        <option value="" disabled>Select urgency</option>
                        <option value="ASAP">I need it now</option>
                        <option value="SOON">Within 1–3 months</option>
                        <option value="EXPLORING">Just exploring</option>
                      </select>
                    </label>
                  </div>

                  <label className="text-xs text-[#8E8E93]" htmlFor="details">Anything else we should know?</label>
                  <input id="details" name="details" type="text" placeholder="Volume, current tools, cost of the problem…" className="h-11 rounded-lg border border-[#333338] bg-[#09090B] px-4 text-sm outline-none placeholder:text-[#5F5F66] focus:border-[#5A5A62]" />

                  <label className="text-xs text-[#8E8E93]" htmlFor="email">Email</label>
                  <input id="email" name="email" required type="email" placeholder="work@company.com" className="h-11 rounded-lg border border-[#333338] bg-[#09090B] px-4 text-sm outline-none placeholder:text-[#5F5F66] focus:border-[#5A5A62]" />

                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <button type="submit" disabled={submitting} className="mt-2 h-11 rounded-lg bg-[#FAFAFA] text-sm font-semibold text-[#09090B] disabled:opacity-60">
                    {submitting ? "Sending…" : "Send Problem Request"}
                  </button>
                </form>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
