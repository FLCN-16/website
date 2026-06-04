import { describe, it, expect } from "vitest";
import { highlightCode, normalizeLanguage, lexicalCodeText } from "../highlight-code";

describe("normalizeLanguage", () => {
  it("returns empty string for missing/empty language", () => {
    expect(normalizeLanguage()).toBe("");
    expect(normalizeLanguage("")).toBe("");
    expect(normalizeLanguage("   ")).toBe("");
  });

  it("passes through supported canonical languages", () => {
    expect(normalizeLanguage("typescript")).toBe("typescript");
    expect(normalizeLanguage("bash")).toBe("bash");
    expect(normalizeLanguage("json")).toBe("json");
  });

  it("resolves common aliases", () => {
    expect(normalizeLanguage("ts")).toBe("typescript");
    expect(normalizeLanguage("js")).toBe("javascript");
    expect(normalizeLanguage("sh")).toBe("bash");
    expect(normalizeLanguage("shell")).toBe("bash");
    expect(normalizeLanguage("yml")).toBe("yaml");
    expect(normalizeLanguage("py")).toBe("python");
  });

  it("is case-insensitive and trims", () => {
    expect(normalizeLanguage("  TypeScript ")).toBe("typescript");
  });

  it("returns empty string for unsupported languages", () => {
    expect(normalizeLanguage("brainfuck")).toBe("");
  });
});

describe("highlightCode", () => {
  it("highlights typescript keywords into prism token spans", () => {
    const { html, language } = highlightCode("const x = 1", "typescript");
    expect(language).toBe("typescript");
    expect(html).toContain('class="token keyword"');
  });

  it("highlights bash", () => {
    const { html, language } = highlightCode("npm install foo", "bash");
    expect(language).toBe("bash");
    expect(html).toContain('class="token');
  });

  it("normalizes the language before highlighting", () => {
    const { html, language } = highlightCode("const x = 1", "ts");
    expect(language).toBe("typescript");
    expect(html).toContain('class="token keyword"');
  });

  it("escapes HTML so raw tags never leak into output", () => {
    const { html } = highlightCode('const t = "<div>"', "typescript");
    // The security-critical guarantee: `<` is escaped so no element can be
    // injected. (Prism leaves a bare `>` unescaped, which is harmless text.)
    expect(html).not.toContain("<div>");
    expect(html).toContain("&lt;div");
  });

  it("returns escaped plain text with no language for unknown languages", () => {
    const { html, language } = highlightCode("a < b && c > d", "brainfuck");
    expect(language).toBe("");
    expect(html).not.toContain('class="token');
    expect(html).toBe("a &lt; b &amp;&amp; c &gt; d");
  });

  it("returns escaped plain text with no language when language is empty", () => {
    const { html, language } = highlightCode("plain text", "");
    expect(language).toBe("");
    expect(html).toBe("plain text");
  });
});

describe("lexicalCodeText", () => {
  it("returns empty string when there are no children", () => {
    expect(lexicalCodeText({})).toBe("");
    expect(lexicalCodeText({ children: undefined })).toBe("");
  });

  it("extracts a single text node with embedded newlines (programmatic content)", () => {
    expect(
      lexicalCodeText({ children: [{ type: "text", text: "line1\nline2" }] }),
    ).toBe("line1\nline2");
  });

  it("joins text nodes and converts linebreak nodes to newlines (editor content)", () => {
    expect(
      lexicalCodeText({
        children: [
          { type: "text", text: "a" },
          { type: "linebreak" },
          { type: "text", text: "b" },
        ],
      }),
    ).toBe("a\nb");
  });

  it("reads text from pre-tokenized code-highlight nodes", () => {
    expect(
      lexicalCodeText({
        children: [
          { type: "code-highlight", text: "const" },
          { type: "code-highlight", text: " x" },
        ],
      }),
    ).toBe("const x");
  });
});
