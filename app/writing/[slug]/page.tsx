import type { Metadata } from "next";

interface PostProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: PostProps
): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug,
  };
}

export default async function Post({ params }: PostProps) {
  const { slug } = await params;

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
        Article
      </p>
      <h1 className="font-sans text-4xl font-semibold tracking-tight mb-6">
        Post: {slug}
      </h1>
      <p className="text-muted-foreground">
        Coming soon.
      </p>
    </div>
  );
}
