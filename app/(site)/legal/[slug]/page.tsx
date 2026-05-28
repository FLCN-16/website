import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPayloadClient } from "@/lib/payload";
import { createMetadata } from "@/lib/metadata";

interface LegalPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await fetchLegalPage(slug);
    if (!page) return { title: "Not Found" };
    return createMetadata({ title: page.title });
  } catch {
    return { title: slug };
  }
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;

  let page: Awaited<ReturnType<typeof fetchLegalPage>> | undefined;
  try {
    page = await fetchLegalPage(slug);
  } catch {
    // Payload unavailable — fall through to notFound below
  }

  if (!page) notFound();

  const lastUpdated = page.lastUpdated
    ? new Date(page.lastUpdated).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
        Legal
      </p>
      <h1 className="font-sans text-4xl font-semibold tracking-tight mb-2">
        {page.title}
      </h1>
      {lastUpdated && (
        <p className="text-sm text-muted-foreground mb-8">
          Last updated {lastUpdated}
        </p>
      )}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <RichText data={page.body} />
      </div>
    </div>
  );
}

async function fetchLegalPage(slug: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "pages",
    where: {
      and: [
        { slug: { equals: slug } },
        { template: { equals: "legal" } },
      ],
    },
    limit: 1,
  });
  return result.docs[0] ?? null;
}
