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
        "duration-base border-b border-transparent pb-px text-label-md text-nav-link transition-colors",
        "hover:text-nav-link-active",
        isActive && "border-nav-link-active font-semibold text-nav-link-active",
      )}
    >
      {id}.&nbsp;{label}
    </Link>
  );
}
