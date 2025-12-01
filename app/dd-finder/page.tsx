"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type DirectDebit = {
  id: string;
  name: string;
  cost: number;
  category: string;
  signup_url: string;
  cancel_info: string | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORIES = ["All", "Charity", "SIM", "Broadband", "Membership", "Digital Subscription", "Magazine"];

export default function DDFinderPage() {
  const [dds, setDDs] = useState<DirectDebit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [maxCost, setMaxCost] = useState<string>("");

  useEffect(() => {
    const fetchDDs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("direct_debits")
          .select("id, name, cost, category, signup_url, cancel_info")
          .order("cost", { ascending: true });

        if (error) {
          console.error(error);
          setError("Could not load direct debits right now.");
          return;
        }

        setDDs((data || []) as DirectDebit[]);
      } finally {
        setLoading(false);
      }
    };

    fetchDDs();
  }, []);

  const filteredDDs = dds.filter((dd) => {
    if (categoryFilter !== "All" && dd.category !== categoryFilter) return false;

    if (maxCost.trim() !== "") {
      const limit = Number(maxCost);
      if (!Number.isNaN(limit) && Number(dd.cost) > limit) return false;
    }

    return true;
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-slate-200">
      <header className="mb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">
          Tool · DD Finder
        </p>
        <h1 className="text-2xl font-semibold text-slate-50">
          Direct Debit Finder
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Browse a small set of low-cost example direct debits that are often
          used to meet bank switch requirements or to keep accounts active.
          These are only examples — most UK direct debits generally work with
          any bank.
        </p>
      </header>

      <section className="mb-6 flex flex-wrap gap-4 text-sm">
        <div className="space-y-1">
          <label className="block text-xs text-slate-400">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-slate-400">
            Max monthly cost (£)
          </label>
          <input
            type="number"
            min={0}
            step="0.5"
            value={maxCost}
            onChange={(e) => setMaxCost(e.target.value)}
            className="w-32 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none"
            placeholder="No limit"
          />
        </div>
      </section>

      {loading && (
        <p className="text-sm text-slate-400">Loading example direct debits…</p>
      )}

      {error && !loading && (
        <p className="text-sm text-rose-300">{error}</p>
      )}

      {!loading && !error && filteredDDs.length === 0 && (
        <p className="text-sm text-slate-400">
          No direct debits match those filters yet. Try widening your search.
        </p>
      )}

      {!loading && !error && filteredDDs.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2">
          {filteredDDs.map((dd) => (
            <article
              key={dd.id}
              className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-50">
                    {dd.name}
                  </h2>
                  <p className="text-[11px] text-slate-400">{dd.category}</p>
                </div>
                <p className="text-sm font-semibold text-slate-50">
                  £{Number(dd.cost).toFixed(2)}
                  <span className="text-[11px] text-slate-400"> / month</span>
                </p>
              </div>

              {dd.cancel_info && (
                <p className="rounded-xl border border-amber-400/20 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-100">
                  <span className="font-semibold">Cancel note:</span>{" "}
                  {dd.cancel_info}
                </p>
              )}

              <p className="text-[11px] text-slate-400">
                These are just example low-cost direct debits. Most UK direct
                debits generally work with any bank, but always check the
                provider&apos;s terms and your bank&apos;s switch conditions
                before relying on them.
              </p>

              <a
                href={dd.signup_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-[11px] font-semibold text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
              >
                Open sign-up page ↗
              </a>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
