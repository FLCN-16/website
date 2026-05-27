import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
};

export default function WorkIndex() {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
        Systems Portfolio
      </p>
      <h1 className="font-sans text-4xl font-semibold tracking-tight mb-6">
        Selected Work
      </h1>
      <p className="text-muted-foreground">
        Coming soon.
      </p>
    </div>
  );
}
