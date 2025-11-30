import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800/60 py-8 text-xs text-slate-400">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 md:flex-row md:justify-between">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} Flowstack. All rights reserved.
        </p>

        <nav className="flex flex-wrap justify-center gap-4 text-[11px]">
          <Link href="/" className="hover:text-slate-200 transition">
            Home
          </Link>
          <Link href="/dd-finder" className="hover:text-slate-200 transition">
            DD Finder
          </Link>
          <Link href="/switch-planner" className="hover:text-slate-200 transition">
            Switch Planner
          </Link>
          <Link href="/about" className="hover:text-slate-200 transition">
            About
          </Link>
          <Link href="/privacy" className="hover:text-slate-200 transition">
            Privacy
          </Link>

          {/* mailto stays as a normal <a> */}
          <a
            href="mailto:support@flowstack.uk"
            className="hover:text-slate-200 transition"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}

