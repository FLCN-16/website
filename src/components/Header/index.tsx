"use client";

import Link from "next/link";

import { useState } from "react";

import NavItem from "./NavItem";

const navItems = [
  { id: "01", label: "ABOUT", href: "/" },
  { id: "02", label: "WORK", href: "/work" },
  { id: "03", label: "STACK", href: "/stack" },
  { id: "04", label: "CONTACT", href: "/contact" },
];

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-nav w-full border-b border-outline-variant bg-surface/80 backdrop-blur-glass">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-6 lg:px-8">
        {/* ── Logo ── */}
        <div className="flex items-baseline gap-2">
          <Link
            href="/"
            className="font-headline text-title-md font-bold tracking-tight text-primary uppercase"
            onClick={() => setOpen(false)}
          >
            THE FALCON
          </Link>
          <span className="hidden font-mono text-label-sm tracking-label text-outline sm:block">
            {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
            // REV. 2026.08
          </span>
        </div>

        {/* ── Desktop nav ── */}
        <nav className="hidden font-space-grotesk lg:block">
          <ul className="flex items-center gap-x-12">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavItem {...item} />
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Desktop resume CTA ── */}
        <Link
          href="/resume.pdf"
          className="duration-base hidden border border-primary px-04 py-02 font-mono text-label-sm tracking-label text-primary transition-colors hover:bg-primary hover:text-on-primary lg:inline-flex"
          download
        >
          GET_RESUME.PDF
        </Link>

        {/* ── Mobile menu toggle ── */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="duration-base font-mono text-label-sm tracking-label text-primary-muted transition-colors hover:text-primary lg:hidden"
        >
          {open ? "//Close" : "//Menu"}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div className="border-t border-outline-variant bg-surface/95 backdrop-blur-glass lg:hidden">
          <nav className="mx-auto max-w-screen-xl px-6 py-4">
            <ul className="flex flex-col gap-0 divide-y divide-outline-variant">
              {navItems.map((item) => (
                <li key={item.id} onClick={() => setOpen(false)} className="py-3">
                  <NavItem {...item} />
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-outline-variant pt-4">
              <Link
                href="/resume.pdf"
                className="duration-base inline-flex border border-primary px-4 py-2 font-mono text-label-sm tracking-label text-primary transition-colors hover:bg-primary hover:text-on-primary"
                download
                onClick={() => setOpen(false)}
              >
                GET_RESUME.PDF
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
