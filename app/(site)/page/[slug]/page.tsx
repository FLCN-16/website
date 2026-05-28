import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPayloadClient } from "@/lib/payload";
import { createMetadata } from "@/lib/metadata";

interface BasicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BasicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchBasicPage(slug);
  if (!page) return { title: "Not Found" };
  return createMetadata({ title: page.title });
}

export default async function BasicPage({ params }: BasicPageProps) {
  const { slug } = await params;
  const page = await fetchBasicPage(slug);
  if (!page) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-sans text-4xl font-semibold tracking-tight mb-8">
        {page.title}
      </h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <RichText data={page.body} />
      </div>
    </div>
  );
}

async function fetchBasicPage(slug: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "pages",
    where: {
      and: [
        { slug: { equals: slug } },
        { template: { equals: "basic" } },
      ],
    },
    limit: 1,
  });
  return result.docs[0] ?? null;
}
