"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type DirectDebit = {
  id: string;
  name: string;
  cost: number;
  category: string;
  signup_url: string;
  eligibility: string[] | string;
  cancel_info: string | null;
};

const BANK_OPTIONS = [
  "Lloyds",
  "NatWest",
  "HSBC",
  "First Direct",
  "TSB",
];

function normaliseEligibility(
  raw: string[] | string | null | undefined
): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return raw
    .replace(/[{}]/g, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function SwitchPlannerPage() {
  const [dds, setDDs] = useState<DirectDebit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bank, setBank] = useState<string>("Lloyds");
  const [ddCount, setDdCount] = useState<number>(2);

  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchDDs = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("direct_debits")
        .select("*");

      if (error) {
        console.error(error);
        setError("Could not load direct debit options right now.");
      } else if (data) {
        setDDs(data as DirectDebit[]);
      }

      setLoading(false);
    };

    fetchDDs();
  }, []);

  const eligibleDDs = dds.sort((a, b) => a.cost - b.cost);

  const selectedDDs =
  mode === "auto"
    ? eligibleDDs.slice(0, ddCount)
    : eligibleDDs.filter((dd) => selectedIds.includes(dd.id)).slice(0, ddCount);

    const toggleSelected = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">
          Switch planner · beta
        </p>
        <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">
          Draft a simple switch plan in a couple of clicks.
        </h1>
        <p className="max-w-xl text-sm text-slate-300">
          Choose your bank and how many direct debits you&apos;re happy to set
          up. Flowstack will suggest some low-cost options and a rough outline
          of what to do next. Always check the bank&apos;s official switch
          terms before relying on any of this.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm">
            Bank you&apos;re switching to:
            <select
              className="ml-2 rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-sm"
              value={bank}
              onChange={(e) => {
                setBank(e.target.value);
                setSelectedIds([]); // reset manual selection when bank changes
              }}
            >
              {BANK_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            Number of DDs you&apos;re okay with:
            <select
              className="ml-2 rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-sm"
              value={ddCount}
              onChange={(e) => setDdCount(Number(e.target.value))}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-slate-400">Mode:</span>
            <button
                type="button"
                onClick={() => setMode("auto")}
                className={`rounded-full px-3 py-1 border ${
                mode === "auto"
                    ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-200"
                    : "border-slate-700 bg-slate-950 text-slate-300"
                }`}
            >
                Auto pick cheapest
            </button>
            <button
                type="button"
                onClick={() => setMode("manual")}
                className={`rounded-full px-3 py-1 border ${
                mode === "manual"
                    ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-200"
                    : "border-slate-700 bg-slate-950 text-slate-300"
                }`}
            >
                I&apos;ll choose manually
            </button>
        </div>


        {loading && (
          <p className="text-xs text-slate-300">Loading options…</p>
        )}
        {error && (
          <p className="text-xs text-red-400 bg-slate-950/60 border border-red-500/30 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {!loading && !error && eligibleDDs.length === 0 && (
          <p className="text-xs text-slate-300">
            We don&apos;t have any direct debits marked as eligible for this bank
            yet. DD Finder might still have other ideas you can use manually.
          </p>
        )}
      </section>

      {!loading && !error && eligibleDDs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Suggested direct debits
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">
          These are example low-cost direct debits to help you plan quickly. Most DDs
          generally work with any bank — feel free to use any that fit your needs.
          </p>

          {mode === "manual" && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] space-y-2">
                <p className="text-slate-200 font-medium">
                Choose which direct debits you want to use for this switch:
                </p>
                <div className="grid gap-2 md:grid-cols-2">
                {eligibleDDs.map((dd) => (
                    <label
                    key={dd.id}
                    className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 cursor-pointer"
                    >
                    <input
                        type="checkbox"
                        className="mt-[2px]"
                        checked={selectedIds.includes(dd.id)}
                        onChange={() => toggleSelected(dd.id)}
                    />
                    <div>
                        <p className="text-[11px] font-semibold text-slate-100">
                        {dd.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                        {dd.category} · £{dd.cost.toFixed(2)}/month
                        </p>
                    </div>
                    </label>
                ))}
                </div>
                <p className="text-[10px] text-slate-400">
                The plan below will use up to {ddCount} of the options you tick here. If
                you don&apos;t tick anything, we&apos;ll fall back to the cheapest ones.
                </p>
            </div>
            )}


          <div className="grid gap-3 md:grid-cols-2">
            {selectedDDs.map((dd) => (
              <article
                key={dd.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold">{dd.name}</h3>
                    <p className="text-[11px] text-slate-400">{dd.category}</p>
                  </div>
                  <p className="text-sm font-semibold">
                    £{dd.cost.toFixed(2)}
                    <span className="text-[11px] text-slate-400"> / month</span>
                  </p>
                </div>
                {dd.cancel_info && (
                  <p className="text-[11px] text-amber-200/90 bg-amber-500/5 border border-amber-400/30 rounded-xl px-3 py-2">
                    <span className="font-medium">Cancel note:</span>{" "}
                    {dd.cancel_info}
                  </p>
                )}
                <a
                  href={dd.signup_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 underline underline-offset-4"
                >
                  Open sign-up page ↗
                </a>
              </article>
            ))}
          </div>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-[11px] space-y-2">
            <h3 className="text-xs font-semibold text-slate-100">
              Rough outline for a switch
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>
                Double-check <span className="font-medium">{bank}</span>
                &apos;s current switch offer and requirements on their official site.
              </li>
              <li>
                Set up the suggested direct debits above on your old account and
                wait for the first payments to be collected.
              </li>
              <li>
                Once the DDs have gone out at least once, start your full switch
                into {bank} using the Current Account Switch Service.
              </li>
              <li>
                After the switch completes and any switch bonus has been paid,
                review whether you still need each direct debit and cancel any
                you don&apos;t want to keep.
              </li>
            </ol>
            <p className="text-[10px] text-slate-400 pt-1">
              This is just a rough helper, not advice. Always read the latest
              terms from {bank} and each provider before making decisions.
            </p>
          </section>
        </section>
      )}
    </div>
  );
}
