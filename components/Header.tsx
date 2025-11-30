"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-3 py-1 rounded-md text-sm transition ${
      pathname === path
        ? "text-white bg-slate-800"
        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
    }`;

  return (
    <header className="border-b border-slate-800 bg-black/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">

        {/* Logo / Brand */}
        <Link href="/" className="text-lg font-semibold text-white">
          Flowstack
        </Link>

        {/* Navigation */}
        <nav className="flex gap-2">
          <Link href="/dd-finder" className={linkClass("/dd-finder")}>
            DD Finder
          </Link>

          <Link href="/switch-planner" className={linkClass("/switch-planner")}>
            Planner
          </Link>

          <Link href="/about" className={linkClass("/about")}>
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
