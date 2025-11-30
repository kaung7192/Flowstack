export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-12">
      {/* Hero */}
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">
          Flowstack · beta
        </p>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
          Simple tools to make bank switching and money admin less annoying.
        </h1>
        <p className="max-w-xl text-sm text-slate-300">
          Flowstack gives you small, focused tools — not a full dashboard. Use
          them to find low-cost example direct debits, sketch a basic switch
          plan, and keep your money admin a bit tidier.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="/dd-finder"
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-emerald-400"
          >
            Open DD Finder
          </a>
          <a
            href="/switch-planner"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-slate-500"
          >
            Try Switch Planner (beta)
          </a>
        </div>
      </section>

      {/* Secondary */}
      <section className="grid gap-4 text-sm text-slate-300 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-100">
            DD Finder
          </h2>
          <p className="text-[13px] text-slate-300">
            Browse a small, curated list of low-cost direct debit examples.
            Filter by cost and category, then follow links to set things up with
            providers directly.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-100">
            Switch Planner
          </h2>
          <p className="text-[13px] text-slate-300">
            Rough out a simple switch plan in a couple of clicks. Choose how
            many DDs you&apos;re happy to use and get a rough timeline you can
            adapt to your situation.
          </p>
        </div>
      </section>

      <section className="text-[11px] text-slate-500">
        Flowstack is a personal project and does not provide regulated financial
        advice. Always check full details with your bank and providers.
      </section>
    </main>
  );
}
