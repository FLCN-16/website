import Link from "next/link";

const socialLinks = [
  { label: "LINKED_IN", href: "https://linkedin.com/in/thefalcon" },
  { label: "GITHUB", href: "https://github.com/thefalcon" },
];

function Footer() {
  return (
    <footer className="w-full bg-surface-low border-t border-outline-variant">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-08">
        {/* ── Copyright ── */}
        <p className="font-mono text-label-sm tracking-label text-outline-variant">
          © 2025 THEFALCON.DEV&nbsp;&nbsp;//&nbsp;&nbsp;ALL_SPECIFICATIONS_RESERVED.
        </p>

        {/* ── Social Links ── */}
        <ul className="flex items-center gap-08">
          {socialLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-label-sm tracking-label text-outline-variant transition-colors duration-base hover:text-primary"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
