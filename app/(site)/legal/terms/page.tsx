import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Terms of Use",
});

export default function TermsOfUse() {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
        Legal
      </p>
      <h1 className="font-sans text-4xl font-semibold tracking-tight mb-6">
        Terms of Use
      </h1>
      <p className="text-muted-foreground">
        Coming soon.
      </p>
    </div>
  );
}
