import type { Metadata } from "next";

interface WorkDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: WorkDetailProps
): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug,
  };
}

export default async function WorkDetail({ params }: WorkDetailProps) {
  const { slug } = await params;

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
        Project Briefing
      </p>
      <h1 className="font-sans text-4xl font-semibold tracking-tight mb-6">
        Work: {slug}
      </h1>
      <p className="text-muted-foreground">
        Coming soon.
      </p>
    </div>
  );
}
