import { describe, it, expect } from "vitest";
import { RECOVERY_LINKS, isWritingDetailRoute } from "@/lib/navigation";

describe("isWritingDetailRoute", () => {
  it("matches an individual article path", () => {
    expect(isWritingDetailRoute("/writing/my-post")).toBe(true);
  });

  it("does not match the writing list page", () => {
    expect(isWritingDetailRoute("/writing")).toBe(false);
  });

  it("does not match the writing list with a trailing slash", () => {
    expect(isWritingDetailRoute("/writing/")).toBe(false);
  });

  it("does not match deeper nested paths under writing", () => {
    expect(isWritingDetailRoute("/writing/a/b")).toBe(false);
  });

  it("does not match unrelated routes", () => {
    expect(isWritingDetailRoute("/")).toBe(false);
    expect(isWritingDetailRoute("/work/some-project")).toBe(false);
    expect(isWritingDetailRoute("/contact")).toBe(false);
  });
});

describe("RECOVERY_LINKS", () => {
  it("excludes the home link", () => {
    expect(RECOVERY_LINKS.some((link) => (link.href as string) === "/")).toBe(false);
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
