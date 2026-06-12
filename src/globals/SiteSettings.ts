import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { CACHE_TAGS } from "@/lib/cache-tags";

const RESUME_FILENAME = "resume.pdf";

function buildS3Client() {
  return new S3Client({
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
  });
}

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    description: "Global site configuration — controls live content shown on the public site.",
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data.resume) return data;

        const resumeId =
          typeof data.resume === "string"
            ? data.resume
            : (data.resume as { id: string }).id;

        // Skip if the resume field didn't change
        const current = await req.payload.findGlobal({
          slug: "site-settings",
          overrideAccess: true,
        });
        const currentResumeId =
          current.resume && typeof current.resume === "object"
            ? (current.resume as { id: string }).id
            : (current.resume as string | null | undefined);

        if (currentResumeId === resumeId) return data;

        // Fetch the newly selected media document
        const media = await req.payload.findByID({
          collection: "media",
          id: resumeId,
          overrideAccess: true,
        });

        const oldFilename = (media as { filename?: string }).filename ?? "";
        if (!oldFilename || oldFilename === RESUME_FILENAME) return data;

        // Copy to fixed key, then delete old object and update media record in parallel
        const client = buildS3Client();
        const bucket = process.env.R2_BUCKET_NAME!;

        await client.send(
          new CopyObjectCommand({
            Bucket: bucket,
            CopySource: `${bucket}/${oldFilename}`,
            Key: RESUME_FILENAME,
            ContentType: "application/pdf",
          })
        );

        await Promise.all([
          client.send(
            new DeleteObjectCommand({
              Bucket: bucket,
              Key: oldFilename,
            })
          ),
          req.payload.update({
            collection: "media",
            id: resumeId,
            data: {
              filename: RESUME_FILENAME,
              url: `${process.env.R2_PUBLIC_URL}/${RESUME_FILENAME}`,
            },
            overrideAccess: true,
          }),
        ]);

        return data;
      },
    ],
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag(CACHE_TAGS.home, 'max')
        } catch {
          // not in Next.js request context
        }
        return doc
      },
    ],
  },
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────
    {
      name: 'identity',
      type: 'group',
      label: 'Identity',
      admin: {
        description: 'Your personal details — shown in the nav, footer, metadata, and SEO.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Full Name',
          admin: { description: 'e.g. Jane Smith' },
        },
        {
          name: 'handle',
          type: 'text',
          label: 'Handle / Username',
          admin: { description: 'e.g. janesmith — used in Twitter/X meta tags' },
        },
        {
          name: 'role',
          type: 'text',
          label: 'Role / Title',
          admin: { description: 'e.g. Senior Frontend Developer' },
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location',
          admin: { description: 'e.g. San Francisco, CA' },
        },
        {
          name: 'timezone',
          type: 'text',
          label: 'Timezone',
          admin: { description: 'e.g. UTC-8 — shown in footer and contact page' },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          admin: { description: 'Contact email shown on the site and in RSS feed' },
        },
        {
          name: 'siteUrl',
          type: 'text',
          label: 'Site URL',
          admin: { description: 'Full URL including https, e.g. https://janedoe.dev' },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: '≤160 chars — shown in Google search snippets',
            rows: 3,
          },
        },
      ],
    },

    // ── Socials ───────────────────────────────────────────────────────────────
    {
      name: 'socials',
      type: 'array',
      label: 'Social Links',
      maxRows: 6,
      admin: {
        description: 'Social profiles shown in the footer and writing CTA.',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Platform',
          required: true,
          options: [
            { label: 'GitHub', value: 'github' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'Profile URL',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Display Label',
          admin: { description: 'e.g. GitHub, LinkedIn' },
        },
      ],
    },

    // ── Philosophy ────────────────────────────────────────────────────────────
    {
      name: 'philosophy',
      type: 'array',
      label: 'Engineering Philosophy',
      maxRows: 5,
      admin: {
        description:
          'The philosophy pillars shown on the homepage. Order is top-to-bottom display order.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Pillar Title',
          required: true,
          admin: { description: 'e.g. Performance is a feature' },
        },
        {
          name: 'body',
          type: 'textarea',
          label: 'Pillar Body',
          required: true,
          admin: { rows: 4 },
        },
      ],
    },

    // ── Résumé ────────────────────────────────────────────────────────────────
    {
      name: "resume",
      type: "upload",
      relationTo: "media",
      label: "Résumé PDF",
      admin: {
        description:
          "Upload your résumé PDF here. It will be stored as resume.pdf in your R2 bucket.",
      },
    },

    // ── Availability ──────────────────────────────────────────────────────────
    {
      name: "availability",
      type: "group",
      label: "Availability Status",
      admin: {
        description: "Controls the status badge in the sidebar navigation.",
      },
      fields: [
        {
          name: "available",
          type: "checkbox",
          label: "Currently available for roles",
          defaultValue: true,
        },
        {
          name: "label",
          type: "text",
          label: "Badge label",
          defaultValue: "OPEN TO ROLES",
          admin: {
            description: "Displayed in the nav badge, e.g. OPEN TO ROLES or NOT AVAILABLE.",
          },
        },
      ],
    },

    // ── Maintenance Mode ──────────────────────────────────────────────────────
    {
      name: "maintenanceMode",
      type: "group",
      label: "Maintenance Mode",
      admin: {
        description: "When enabled, all public pages redirect to the maintenance page.",
      },
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          label: "Enable maintenance mode",
          defaultValue: false,
        },
        {
          name: "message",
          type: "textarea",
          label: "Maintenance message",
          defaultValue: "We're doing some work on the site. We'll be back shortly.",
          admin: {
            description: "Displayed on the maintenance page.",
            rows: 3,
          },
        },
      ],
    },

    // ── Hero copy ─────────────────────────────────────────────────────────────
    {
      name: "headline",
      type: "textarea",
      label: "Hero Headline",
      admin: {
        description: "Main headline on the homepage. Use \\n for line breaks.",
        rows: 2,
      },
    },
    {
      name: "subheadline",
      type: "textarea",
      label: "Hero Subheadline",
      admin: {
        description: "Supporting paragraph below the headline.",
        rows: 4,
      },
    },
    {
      name: "eyebrow",
      type: "text",
      label: "Eyebrow",
      admin: {
        description:
          "Small label above the headline, e.g. Technical Lead — Full Stack · Jalandhar, India.",
      },
    },

    // ── Stats ─────────────────────────────────────────────────────────────────
    {
      name: "stats",
      type: "array",
      label: "Stats",
      maxRows: 6,
      admin: {
        description: "Metric tiles shown on the homepage.",
      },
      fields: [
        {
          name: "value",
          type: "text",
          label: "Value",
          required: true,
          admin: { description: "e.g. 9+" },
        },
        {
          name: "label",
          type: "text",
          label: "Label",
          required: true,
          admin: { description: "e.g. Years Shipping" },
        },
      ],
    },
  ],
};
