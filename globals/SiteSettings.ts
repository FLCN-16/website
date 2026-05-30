import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { CACHE_TAGS } from "@/lib/cache-tags";

const RESUME_FILENAME = "rishabh-kumar-resume.pdf";

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
    // ── Résumé ────────────────────────────────────────────────────────────────
    {
      name: "resume",
      type: "upload",
      relationTo: "media",
      label: "Résumé PDF",
      admin: {
        description:
          "Upload the PDF to Media, then select it here. It will automatically be renamed to rishabh-kumar-resume.pdf in R2.",
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
