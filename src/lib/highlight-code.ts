// Server-side syntax highlighting for Lexical `code` blocks.
//
// IMPORTANT: keep this module server-only. It pulls PrismJS plus a set of
// grammars into whatever bundle imports it. The frontend renders code blocks
// from a React Server Component (see app/(site)/.../page.tsx) so Prism never
// ships to the client. Do not import this (directly or via the rich-text
// converters) from a "use client" module.
//
// Why render-time highlighting: post content is created programmatically via
// the Payload MCP / seed scripts, which never run the browser editor's
// `registerCodeHighlighting` plugin. Stored code nodes therefore contain plain
// text, not pre-tokenized `code-highlight` nodes. Highlighting here, at render
// time, works regardless of how the content was authored.
//
// Prism emits `<span class="token …">` markup whose classes are styled by the
// `.token.*` rules in app/globals.css.
import Prism from "prismjs";

// Grammars, imported in dependency order. Prism core already includes markup,
// css, clike and javascript; the rest are loaded explicitly. typescript
// extends javascript; jsx extends markup+javascript; tsx extends jsx+typescript.
import "prismjs/components/prism-markup.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-clike.js";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-yaml.js";
import "prismjs/components/prism-markdown.js";
import "prismjs/components/prism-sql.js";
import "prismjs/components/prism-go.js";
import "prismjs/components/prism-rust.js";
import "prismjs/components/prism-diff.js";

const ALIASES: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  console: "bash",
  yml: "yaml",
  md: "markdown",
  py: "python",
  golang: "go",
  rs: "rust",
  html: "markup",
  xml: "markup",
  svg: "markup",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Resolve a user-supplied language label to a loaded Prism grammar id, or "" if
 * none is available (unknown/unsupported/empty -> render as plain text).
 */
export function normalizeLanguage(lang?: string): string {
  if (!lang) return "";
  const lower = lang.trim().toLowerCase();
  if (!lower) return "";
  const resolved = ALIASES[lower] ?? lower;
  return Prism.languages[resolved] ? resolved : "";
}

export interface HighlightedCode {
  /** HTML to place inside `<code>` via dangerouslySetInnerHTML. Always escaped. */
  html: string;
  /** Resolved Prism language id, or "" when unhighlighted. */
  language: string;
}

/**
 * Highlight a code string. For supported languages, returns Prism token markup;
 * otherwise returns HTML-escaped plain text. The returned HTML is always safe to
 * inject — Prism escapes the source, and the fallback escapes it manually.
 */
export function highlightCode(code: string, lang?: string): HighlightedCode {
  const language = normalizeLanguage(lang);
  if (!language) {
    return { html: escapeHtml(code), language: "" };
  }
  const html = Prism.highlight(code, Prism.languages[language], language);
  return { html, language };
}

interface LexicalCodeChild {
  type?: string;
  text?: string;
}

/**
 * Reconstruct the raw source text of a Lexical `code` node from its children.
 * Programmatic content stores a single text node with embedded "\n"; editor
 * content may use `linebreak` nodes between text/`code-highlight` nodes.
 */
export function lexicalCodeText(node: { children?: LexicalCodeChild[] }): string {
  const children = node?.children;
  if (!Array.isArray(children)) return "";
  let out = "";
  for (const child of children) {
    if (child?.type === "linebreak") out += "\n";
    else if (typeof child?.text === "string") out += child.text;
  }
  return out;
}
