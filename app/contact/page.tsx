import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default function Contact() {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
        Get In Touch
      </p>
      <h1 className="font-sans text-4xl font-semibold tracking-tight mb-6">
        Contact
      </h1>
      <p className="text-muted-foreground">
        Coming soon.
      </p>
    </div>
  );
}
