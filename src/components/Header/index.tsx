import Link from "next/link";
import NavItem from "./NavItem";

const navItems = [
  { id: "01", label: "ABOUT", href: "/" },
  { id: "02", label: "WORK", href: "/work" },
  { id: "03", label: "STACK", href: "/stack" },
  { id: "04", label: "CONTACT", href: "/contact" },
];

function Header() {
  return (
    <header className="sticky top-0 z-nav w-full bg-surface-low border-b border-outline-variant">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-08">
        {/* ── Logo ── */}
        <div className="flex items-baseline gap-04">
          <Link href="/" className="font-headline text-title-md font-bold tracking-tight text-primary uppercase">
            THE FALCON
          </Link>
          {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
          <span className="font-mono text-label-sm text-outline-variant tracking-label">// REV. 2026.08</span>
        </div>

        <nav className="font-space-grotesk">
          <ul className="flex items-center gap-x-12">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavItem {...item} />
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/resume.pdf"
          className="font-space-grotesk text-label-sm tracking-label text-primary border border-outline px-04 py-02 transition-colors duration-base hover:bg-primary hover:text-on-primary"
          download
        >
          GET_RESUME.PDF
        </Link>
      </div>
    </header>
  );
}

export default Header;
