import Link from "next/link";

const socialLinks = [
  { label: "LINKED_IN", href: "https://linkedin.com/in/rishabh-kumar-flcn16" },
  { label: "PORTFOLIO", href: "https://thefalcon.dev" },
];

const legalLinks = [
  { label: "PRIVACY_POLICY", href: "/legal/privacy-policy" },
  { label: "TERMS_OF_USE", href: "/legal/terms" },
];

function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant bg-surface">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
        {/* ── Main row ── */}
        <div className="flex flex-col gap-3 py-5 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:py-0">
          <p className="font-mono text-label-sm tracking-label text-outline">
            © 2026 THEFALCON.DEV&nbsp;&nbsp;//&nbsp;&nbsp;ALL_SPECIFICATIONS_RESERVED.
          </p>
          <ul className="flex items-center gap-6">
            {socialLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="duration-base font-mono text-label-sm tracking-label text-outline transition-colors hover:text-primary"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Legal row ── */}
        <div className="flex flex-wrap items-center gap-4 border-t border-outline-variant py-3 sm:h-10 sm:py-0">
          {legalLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="duration-base font-mono text-[0.6rem] tracking-label text-outline/60 uppercase transition-colors hover:text-outline"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
