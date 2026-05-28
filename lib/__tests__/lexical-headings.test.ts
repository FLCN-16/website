import { describe, it, expect } from "vitest";
import { extractHeadings } from "../lexical-headings";

const makeDoc = (children: unknown[]) => ({ root: { children } });

describe("extractHeadings", () => {
  it("returns empty array for null/undefined body", () => {
    expect(extractHeadings(null)).toEqual([]);
    expect(extractHeadings(undefined)).toEqual([]);
  });

  it("returns empty array when root has no children", () => {
    expect(extractHeadings(makeDoc([]))).toEqual([]);
  });

  it("extracts h2 headings", () => {
    const body = makeDoc([
      { type: "heading", tag: "h2", children: [{ text: "Section One" }] },
    ]);
    expect(extractHeadings(body)).toEqual([
      { id: "section-one", text: "Section One", level: 2 },
    ]);
  });

  it("extracts h3 headings", () => {
    const body = makeDoc([
      { type: "heading", tag: "h3", children: [{ text: "Sub Section" }] },
    ]);
    expect(extractHeadings(body)).toEqual([
      { id: "sub-section", text: "Sub Section", level: 3 },
    ]);
  });

  it("ignores h1 and h4 headings", () => {
    const body = makeDoc([
      { type: "heading", tag: "h1", children: [{ text: "Title" }] },
      { type: "heading", tag: "h4", children: [{ text: "Minor" }] },
    ]);
    expect(extractHeadings(body)).toEqual([]);
  });

  it("ignores non-heading nodes", () => {
    const body = makeDoc([
      { type: "paragraph", children: [{ text: "Hello" }] },
      { type: "heading", tag: "h2", children: [{ text: "Real Heading" }] },
    ]);
    expect(extractHeadings(body)).toEqual([
      { id: "real-heading", text: "Real Heading", level: 2 },
    ]);
  });

  it("slugifies text with special characters", () => {
    const body = makeDoc([
      { type: "heading", tag: "h2", children: [{ text: "Hello, World! (2026)" }] },
    ]);
    expect(extractHeadings(body)).toEqual([
      { id: "hello-world-2026", text: "Hello, World! (2026)", level: 2 },
    ]);
  });

  it("concatenates multiple text children", () => {
    const body = makeDoc([
      {
        type: "heading",
        tag: "h2",
        children: [{ text: "Hello " }, { text: "World" }],
      },
    ]);
    expect(extractHeadings(body)).toEqual([
      { id: "hello-world", text: "Hello World", level: 2 },
    ]);
  });

  it("returns mixed h2 and h3 in document order", () => {
    const body = makeDoc([
      { type: "heading", tag: "h2", children: [{ text: "Alpha" }] },
      { type: "paragraph", children: [{ text: "content" }] },
      { type: "heading", tag: "h3", children: [{ text: "Beta" }] },
      { type: "heading", tag: "h2", children: [{ text: "Gamma" }] },
    ]);
    expect(extractHeadings(body)).toEqual([
      { id: "alpha", text: "Alpha", level: 2 },
      { id: "beta", text: "Beta", level: 3 },
      { id: "gamma", text: "Gamma", level: 2 },
    ]);
  });
});
