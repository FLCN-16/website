import { describe, it, expect } from "vitest";
import { RECOVERY_LINKS } from "@/lib/navigation";

describe("RECOVERY_LINKS", () => {
  it("excludes the home link", () => {
    expect(RECOVERY_LINKS.some((link) => link.href === "/")).toBe(false);
  });

  it("keeps the non-home nav links in order", () => {
    expect(RECOVERY_LINKS.map((link) => link.href)).toEqual([
      "/work",
      "/stack",
      "/writing",
      "/contact",
    ]);
  });
});
