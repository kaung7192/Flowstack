"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type DirectDebit = {
  id: string;
  name: string;
  cost: number;
  category: string;
  signup_url: string;
  eligibility: string[] | string; // 👈 allow string or array
  cancel_info: string | null;
};

const BANK_OPTIONS = [
  "All banks",
  "Lloyds",
  "NatWest",
  "HSBC",
  "First Direct",
  "TSB",
];

const CATEGORY_OPTIONS = [
  "All categories",
  "Charity",
  "SIM",
  "Broadband",
  "Digital Subscription",
  "Magazine",
  "Membership",
];

function getCategoryStyles(category: string) {
  switch (category) {
    case "Charity":
      return "bg-emerald-400/10 text-emerald-200 border-emerald-400/40";
    case "SIM":
      return "bg-sky-400/10 text-sky-200 border-sky-400/40";
    case "Broadband":
      return "bg-violet-400/10 text-violet-200 border-violet-400/40";
    case "Digital Subscription":
      return "bg-pink-400/10 text-pink-200 border-pink-400/40";
    case "Magazine":
      return "bg-amber-400/10 text-amber-200 border-amber-400/40";
    case "Membership":
      return "bg-cyan-400/10 text-cyan-200 border-cyan-400/40";
    default:
      return "bg-slate-700/30 text-slate-200 border-slate-500/40";
  }
}

function normaliseEligibility(raw: string[] | string | null | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;

  // raw is a string like "{Lloyds,NatWest}"
  return raw
    .replace(/[{}]/g, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function DDFinderPage() {
  const [dds, setDDs] = useState<DirectDebit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bankFilter, setBankFilter] = useState("All banks");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");

  useEffect(() => {
    const fetchDDs = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("direct_debits")
        .select("*")
        .order("cost", { ascending: true });

      if (error) {
        console.error(error);
        setError("Could not load direct debit options right now.");
      } else if (data) {
        // supabase-js returns unknown[] so we cast to our type
        setDDs(data as DirectDebit[]);
      }

      setLoading(false);
    };

    fetchDDs();
  }, []);

  const filteredDDs = dds
  // bank filter
  .filter((dd) =>
    bankFilter === "All banks"
      ? true
      : normaliseEligibility(dd.eligibility).includes(bankFilter)
  )
  // category filter
  .filter((dd) =>
    categoryFilter === "All categories"
      ? true
      : dd.category === categoryFilter
  )
  // search filter
  .filter((dd) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    return (
      dd.name.toLowerCase().includes(q) ||
      dd.category.toLowerCase().includes(q)
    );
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">
            Direct Debit Finder (beta)
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Quickly find low-cost direct debits that may qualify for bank switch
            requirements. Always check the provider&apos;s and bank&apos;s
            official terms before relying on any DD for an offer.
          </p>
        </header>

        {/* Filters */}
        <section className="mb-6 flex flex-wrap items-center gap-3">
          <label className="text-sm">
            Bank:
            <select
              className="ml-2 rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
            >
              {BANK_OPTIONS.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            Category:
            <select
              className="ml-2 rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <div className="flex-1 min-w-[180px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or category…"
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400/70"
            />
          </div>
        </section>

        {/* Loading / error */}
        {loading && (
          <p className="text-sm text-slate-300">Loading options…</p>
        )}

        {error && (
          <p className="text-sm text-red-400 mb-4 bg-slate-900/60 border border-red-500/40 px-3 py-2 rounded-xl">
            {error}
          </p>
        )}

        {/* Results */}
        {!loading && !error && filteredDDs.length === 0 && (
          <p className="text-sm text-slate-300">
            No direct debit options found for this filter yet.
          </p>
        )}

        {!loading && !error && filteredDDs.length > 0 && (
          <section className="space-y-3">
            {filteredDDs.map((dd) => (
              <article
                key={dd.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col gap-3 shadow-sm shadow-slate-950/60 hover:border-emerald-400/50 hover:shadow-emerald-500/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold">{dd.name}</h2>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[10px] font-medium ${getCategoryStyles(
                          dd.category
                        )}`}
                      >
                        {dd.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Eligible banks:{" "}
                      <span className="text-slate-200">
                        {normaliseEligibility(dd.eligibility).join(", ") || "Not specified"}
                      </span>
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold">
                      £{dd.cost.toFixed(2)}
                      <span className="text-[11px] text-slate-400"> / month</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      ID: <span className="text-slate-300 text-[10px]">DD-{dd.id.slice(0, 6)}</span>
                    </p>
                  </div>
                </div>

                {dd.cancel_info && (
                  <p className="text-[11px] text-amber-200/90 bg-amber-500/5 border border-amber-400/30 rounded-xl px-3 py-2">
                    <span className="font-medium">Cancel note:</span> {dd.cancel_info}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-slate-400">
                    Always double-check with your bank before relying on any DD for a switch.
                  </p>
                  <a
                    href={dd.signup_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 underline underline-offset-4"
                  >
                    Go to sign-up ↗
                  </a>
                </div>
              </article>

            ))}
          </section>
        )}
      </div>
    </main>
  );
}
