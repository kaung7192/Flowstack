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

type BankKey = "Lloyds" | "NatWest" | "HSBC" | "First Direct" | "TSB";

const BANKS: BankKey[] = ["Lloyds", "NatWest", "HSBC", "First Direct", "TSB"];

const BANK_CONFIG: Record<
  BankKey,
  {
    displayName: string;
    minPayIn: number; // rough assumed minimum pay-in
    requiredDDs: number; // rough assumed number of DDs for a switch bonus
    typicalRewardTiming: string; // human text, not exact promise
    notes: string;
  }
> = {
  Lloyds: {
    displayName: "Lloyds Bank",
    minPayIn: 1500,
    requiredDDs: 2,
    typicalRewardTiming: "around 30–60 days after conditions are met",
    notes:
      "This planner assumes Lloyds typically requires at least £1,500 paid in and 2 active direct debits for a switch offer. Always check the current official terms before you switch.",
  },
  NatWest: {
    displayName: "NatWest",
    minPayIn: 1250,
    requiredDDs: 2,
    typicalRewardTiming: "around 30–60 days after conditions are met",
    notes:
      "This planner assumes NatWest typically requires around £1,250 paid in and 2 active direct debits. Exact amounts and deadlines change with each offer.",
  },
  HSBC: {
    displayName: "HSBC UK",
    minPayIn: 1500,
    requiredDDs: 2,
    typicalRewardTiming: "around 30–60 days after conditions are met",
    notes:
      "This planner assumes HSBC usually requires a larger pay-in (around £1,500) and at least 2 direct debits, plus a full switch from a non-HSBC account.",
  },
  "First Direct": {
    displayName: "first direct",
    minPayIn: 1000,
    requiredDDs: 2,
    typicalRewardTiming: "around 30–60 days after conditions are met",
    notes:
      "This planner assumes first direct typically asks for at least £1,000 paid in and 2 active direct debits, plus a full CASS switch.",
  },
  TSB: {
    displayName: "TSB",
    minPayIn: 500,
    requiredDDs: 2,
    typicalRewardTiming: "around 30–60 days after conditions are met",
    notes:
      "This planner assumes TSB often requires at least £500 paid in and 2 direct debits. The exact thresholds can change with each promotion.",
  },
};

// simple date helpers (client-side only)
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SwitchPlannerPage() {
  const [dds, setDDs] = useState<DirectDebit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bank, setBank] = useState<BankKey>("Lloyds");
  const [ddCount, setDdCount] = useState<number>(2);

  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // For timeline input (optional start date; defaults to today)
  const [startDateStr, setStartDateStr] = useState<string>("");

  useEffect(() => {
    const fetchDDs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("direct_debits")
          .select("id, name, cost, category, signup_url, cancel_info");

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

  const eligibleDDs = [...dds].sort((a, b) => Number(a.cost) - Number(b.cost));

  const selectedDDs =
    mode === "auto"
      ? eligibleDDs.slice(0, ddCount)
      : eligibleDDs
          .filter((dd) => selectedIds.includes(dd.id))
          .slice(0, ddCount);

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bankConfig = BANK_CONFIG[bank];

  // timeline calculations
  const baseStartDate = startDateStr ? new Date(startDateStr) : new Date();
  const ddSetupFrom = addDays(baseStartDate, 3);
  const ddSetupTo = addDays(baseStartDate, 7);
  const firstCollectionFrom = addDays(baseStartDate, 10);
  const firstCollectionTo = addDays(baseStartDate, 30);
  const recommendedSwitchFrom = addDays(firstCollectionFrom, 1);
  const recommendedSwitchTo = addDays(firstCollectionTo, 3);
  const rewardFrom = addDays(recommendedSwitchFrom, 30);
  const rewardTo = addDays(recommendedSwitchTo, 60);

  const ddShortfall =
    ddCount < bankConfig.requiredDDs
      ? bankConfig.requiredDDs - ddCount
      : 0;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-slate-200">
      <header className="mb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">
          Tool · Switch Planner
        </p>
        <h1 className="text-2xl font-semibold text-slate-50">
          Rough out a bank switch plan with direct debits
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          This planner uses simple assumptions about each bank&apos;s typical
          switch requirements (pay-in amount, number of direct debits and reward
          timing) to give you a rough plan. It&apos;s not official advice – you
          must still check the exact current offer before you switch – but it
          should make the planning part much clearer and less stressful.
        </p>
      </header>

      {/* CONFIG & MODE SECTION */}
      <section className="mb-8 space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
        <div className="flex flex-wrap gap-4">
          <label className="space-y-1 text-xs">
            <span className="block text-slate-400">Target bank</span>
            <select
              value={bank}
              onChange={(e) => {
                setBank(e.target.value as BankKey);
                setSelectedIds([]);
              }}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none"
            >
              {BANKS.map((b) => (
                <option key={b} value={b}>
                  {BANK_CONFIG[b].displayName}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-xs">
            <span className="block text-slate-400">
              Number of DDs you&apos;re okay with
            </span>
            <input
              type="number"
              min={0}
              max={10}
              value={ddCount}
              onChange={(e) =>
                setDdCount(Math.max(0, Math.min(10, Number(e.target.value))))
              }
              className="w-24 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none"
            />
          </label>

          <label className="space-y-1 text-xs">
            <span className="block text-slate-400">Planning start date</span>
            <input
              type="date"
              value={startDateStr}
              onChange={(e) => setStartDateStr(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none"
            />
            <span className="block text-[10px] text-slate-500">
              Leave empty to assume “today”.
            </span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400">Mode:</span>
          <button
            type="button"
            onClick={() => setMode("auto")}
            className={`rounded-full px-3 py-1 border text-xs ${
              mode === "auto"
                ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-200"
                : "border-slate-700 bg-slate-950 text-slate-300"
            }`}
          >
            Auto pick cheapest DDs
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`rounded-full px-3 py-1 border text-xs ${
              mode === "manual"
                ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-200"
                : "border-slate-700 bg-slate-950 text-slate-300"
            }`}
          >
            I&apos;ll choose them manually
          </button>
        </div>

        <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px]">
          <p className="font-semibold text-slate-100">
            Assumed requirements for {bankConfig.displayName}
          </p>
          <p className="text-slate-300">
            • Minimum pay-in: around £{bankConfig.minPayIn.toLocaleString("en-GB")}
            <br />
            • Direct debits: typically at least {bankConfig.requiredDDs} active DDs
            <br />
            • Reward timing: {bankConfig.typicalRewardTiming}
          </p>
          <p className="text-[10px] text-slate-500">
            This is a planning shortcut based on typical patterns – exact amounts,
            deadlines and eligibility can change with each promotion. Always
            confirm details on the bank&apos;s own website before relying on a
            specific switch offer.
          </p>
        </div>

        {ddShortfall > 0 && (
          <p className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100">
            You&apos;ve chosen {ddCount} direct debit
            {ddCount === 1 ? "" : "s"}, but this plan assumes{" "}
            {bankConfig.displayName} typically requires at least{" "}
            {bankConfig.requiredDDs}. Consider increasing your DD count if you
            want to match the usual switch requirements more closely.
          </p>
        )}
      </section>

      {loading && (
        <p className="text-sm text-slate-400">Loading planner options…</p>
      )}

      {error && !loading && (
        <p className="text-sm text-rose-300">{error}</p>
      )}

      {!loading && !error && eligibleDDs.length === 0 && (
        <p className="text-sm text-slate-400">
          No example direct debits are available yet. Add some in Supabase to
          get started.
        </p>
      )}

      {!loading && !error && eligibleDDs.length > 0 && (
        <section className="space-y-6">
          {/* MANUAL CHOICE PANEL */}
          {mode === "manual" && (
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-[11px]">
              <p className="text-slate-200 font-medium">
                Choose which direct debits you want to include in your plan:
              </p>
              <div className="grid gap-2 md:grid-cols-2">
                {eligibleDDs.map((dd) => (
                  <label
                    key={dd.id}
                    className="flex cursor-pointer items-start gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      className="mt-[2px]"
                      checked={selectedIds.includes(dd.id)}
                      onChange={() => toggleSelected(dd.id)}
                    />
                    <div>
                      <p className="font-semibold text-slate-100">
                        {dd.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {dd.category} · £{Number(dd.cost).toFixed(2)}/month
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-[10px] text-slate-400">
                The plan below will use up to {ddCount} of the options you tick
                here. If you don&apos;t tick anything, we&apos;ll just fall back
                to the cheapest ones (same as auto mode).
              </p>
            </div>
          )}

          {/* SELECTED DDEBITS */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-100">
              Selected direct debits
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {selectedDDs.map((dd) => (
                <article
                  key={dd.id}
                  className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-50">
                        {dd.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {dd.category}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-50">
                      £{Number(dd.cost).toFixed(2)}
                      <span className="text-[11px] text-slate-400">
                        /month
                      </span>
                    </p>
                  </div>

                  {dd.cancel_info && (
                    <p className="rounded-xl border border-amber-400/20 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-100">
                      <span className="font-semibold">Cancellation:</span>{" "}
                      {dd.cancel_info}
                    </p>
                  )}

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
            </div>
          </div>

          {/* TIMELINE + PLAN */}
          <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs">
            <h3 className="text-sm font-semibold text-slate-100">
              Rough switch timeline for {bankConfig.displayName}
            </h3>

            {ddCount === 0 || selectedDDs.length === 0 ? (
              <p className="text-[11px] text-slate-400">
                You haven&apos;t selected any direct debits for this plan yet.
                You can still switch without adding new DDs if you already have
                enough active ones on your existing account – just make sure you
                genuinely meet the bank&apos;s requirements before requesting
                the switch.
              </p>
            ) : (
              <>
                <p className="text-[11px] text-slate-300">
                  Based on your chosen start date and the example direct debits,
                  here&apos;s a rough planning outline. This uses simple
                  assumptions for DD setup time, first collection and reward
                  timing – it&apos;s designed to make your plan clearer, not to
                  predict exact dates.
                </p>

                <ul className="space-y-1 text-[11px] text-slate-300">
                  <li>
                    • <span className="font-semibold">DD setup window:</span>{" "}
                    {formatDate(ddSetupFrom)} – {formatDate(ddSetupTo)}
                  </li>
                  <li>
                    •{" "}
                    <span className="font-semibold">
                      First DD collection (estimated):
                    </span>{" "}
                    {formatDate(firstCollectionFrom)} –{" "}
                    {formatDate(firstCollectionTo)}
                  </li>
                  <li>
                    •{" "}
                    <span className="font-semibold">
                      Recommended switch request:
                    </span>{" "}
                    {formatDate(recommendedSwitchFrom)} –{" "}
                    {formatDate(recommendedSwitchTo)}
                  </li>
                  <li>
                    •{" "}
                    <span className="font-semibold">
                      Likely reward window (very approximate):
                    </span>{" "}
                    {formatDate(rewardFrom)} – {formatDate(rewardTo)}
                  </li>
                </ul>

                <ol className="mt-3 list-decimal space-y-1 pl-4 text-[11px] text-slate-300">
                  <li>
                    Open a new {bankConfig.displayName} current account (if you
                    haven&apos;t already) and carefully read the current switch
                    offer terms: required pay-in, number of DDs, deadlines and
                    account type.
                  </li>
                  <li>
                    Set up the selected direct debits on the new account:
                    {selectedDDs.map((dd, idx) => (
                      <span key={dd.id}>
                        {" "}
                        {idx > 0 && ","} {dd.name}
                      </span>
                    ))}
                    . Try to do this between{" "}
                    {formatDate(baseStartDate)} and{" "}
                    {formatDate(ddSetupTo)} so they have time to collect.
                  </li>
                  <li>
                    Wait for at least one successful collection for each DD,
                    which we&apos;ve roughly estimated between{" "}
                    {formatDate(firstCollectionFrom)} and{" "}
                    {formatDate(firstCollectionTo)}. Many switch offers only
                    count DDs once they&apos;ve actually been collected.
                  </li>
                  <li>
                    Pay in at least about £
                    {bankConfig.minPayIn.toLocaleString("en-GB")} to the new
                    account (often salary or a manual transfer). Do this once
                    your DDs look active so that all conditions are met together.
                  </li>
                  <li>
                    Request a full switch using the Current Account Switch
                    Service (CASS), ideally between{" "}
                    {formatDate(recommendedSwitchFrom)} and{" "}
                    {formatDate(recommendedSwitchTo)}, making sure this fits
                    inside the offer&apos;s deadline window.
                  </li>
                  <li>
                    After the switch date and once you&apos;re sure everything
                    has moved across safely, monitor the account for the switch
                    reward. This planner assumes a very rough reward timeframe of{" "}
                    {bankConfig.typicalRewardTiming}, which we&apos;ve turned
                    into the approximate calendar window shown above.
                  </li>
                  <li>
                    Once any reward is safely paid and you&apos;re happy with
                    the new account, review which direct debits you want to keep
                    and which, if any, you might cancel or move again, always
                    following the providers&apos; cancellation rules.
                  </li>
                </ol>
              </>
            )}

            <p className="mt-2 text-[10px] text-slate-500">
              This tool is a planning helper only. It does not guarantee any
              reward or outcome, and it doesn&apos;t know the exact current
              promotion details. Always rely on the bank&apos;s official offer
              page and your own judgement when making switching decisions.
            </p>
          </section>
        </section>
      )}
    </main>
  );
}
