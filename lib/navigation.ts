export const NAV_LINKS = [
  { num: "01", label: "ABOUT", href: "/" },
  { num: "02", label: "WORK", href: "/work" },
  { num: "03", label: "STACK", href: "/stack" },
  { num: "04", label: "WRITING", href: "/writing" },
  { num: "05", label: "CONTACT", href: "/contact" },
] as const;

export function isNavLinkActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href + "/")
}
