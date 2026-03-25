"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavItemProps {
  id: string;
  label: string;
  href: string;
}

export default function NavItem({ id, label, href }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "text-label-md tracking-label text-nav-link border-b-1",
        "pb-px transition-colors duration-base border-transparent",
        "hover:text-nav-link-active",
        isActive && "border-nav-link-active text-nav-link-active font-semibold",
      )}
    >
      {id}.&nbsp;{label}
    </Link>
  );
}
