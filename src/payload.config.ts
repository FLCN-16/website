import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { CodeHighlightFeature } from "./features/code-highlight-feature";
import { s3Storage } from "@payloadcms/storage-s3";
import { resendAdapter } from "@payloadcms/email-resend";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { searchPlugin } from "@payloadcms/plugin-search";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { mcpPlugin } from "@payloadcms/plugin-mcp";
import { Users } from "./collections/Users";
import { Posts } from "./collections/Posts";
import { Media } from "./collections/Media";
import { Work } from "./collections/Work";
import { Projects } from "./collections/Projects";
import { Timeline } from "./collections/Timeline";
import { Education } from "./collections/Education";
import { Certifications } from "./collections/Certifications";
import { Pages } from "./collections/Pages";
import { SiteSettings } from "./globals/SiteSettings";
import { generatePreviewUrl } from "./lib/preview";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    dashboard: {
      widgets: [
        {
          slug: "content-stats",
          label: "Content Overview",
          Component: "/components/admin/widgets/ContentStats",
          minWidth: "medium",
        },
        {
          slug: "recent-posts",
          label: "Recent Posts",
          Component: "/components/admin/widgets/RecentPosts",
          minWidth: "small",
        },
        {
          slug: "recent-submissions",
          label: "Recent Inquiries",
          Component: "/components/admin/widgets/RecentSubmissions",
          minWidth: "small",
        },
        {
          slug: "posts-activity",
          label: "Publishing Activity",
          Component: "/components/admin/widgets/PostsActivity",
          minWidth: "medium",
        },
        {
          slug: "content-pipeline",
          label: "Content Pipeline",
          Component: "/components/admin/widgets/ContentPipeline",
          minWidth: "small",
        },
        {
          slug: "inquiry-breakdown",
          label: "Inquiry Breakdown",
          Component: "/components/admin/widgets/InquiryBreakdown",
          minWidth: "small",
        },
        {
          slug: "tag-frequency",
          label: "Tag Frequency",
          Component: "/components/admin/widgets/TagFrequency",
          minWidth: "medium",
        },
      ],
      defaultLayout: [
        { widgetSlug: "posts-activity", width: "full" },
        { widgetSlug: "content-pipeline", width: "small" },
        { widgetSlug: "tag-frequency", width: "medium" },
        { widgetSlug: "inquiry-breakdown", width: "small" },
        { widgetSlug: "recent-posts", width: "medium" },
        { widgetSlug: "recent-submissions", width: "medium" },
        { widgetSlug: "content-stats", width: "full" },
        { widgetSlug: "collections", width: "full" },
      ],
    },
    livePreview: {
      url: ({ data, collectionConfig }) => {
        return generatePreviewUrl({
          collection: collectionConfig?.slug ?? '',
          slug: String(data?.slug ?? ''),
          template: data?.template ? String(data.template) : undefined,
        })
      },
      collections: ['posts', 'pages'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Posts, Media, Work, Projects, Timeline, Education, Certifications, Pages],
  globals: [SiteSettings],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || "",
    transactionOptions: false,
    connectOptions: {
      maxPoolSize: 1,
    },
  }),
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, CodeHighlightFeature()],
  }),
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM_ADDRESS || "hello@thefalcon.dev",
    defaultFromName: process.env.RESEND_FROM_NAME || "The Falcon",
    apiKey: process.env.RESEND_API_KEY || "",
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const key = prefix ? `${prefix}/${filename}` : filename
            return `${process.env.R2_PUBLIC_URL}/${key}`
          },
        },
      },
      bucket: process.env.R2_BUCKET_NAME || "",
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        forcePathStyle: true,
      },
    }),
    seoPlugin({
      collections: ["posts", "pages", "work", "projects"],
      uploadsCollection: "media",
      tabbedUI: true,
      generateTitle: ({ doc }) => (doc as { title?: string })?.title ?? "",
      generateDescription: ({ doc }) => {
        const d = doc as { excerpt?: string; description?: string };
        return d?.excerpt ?? d?.description ?? "";
      },
    }),
    searchPlugin({
      collections: ["posts", "work", "projects"],
      defaultPriorities: {
        posts: 20,
        work: 10,
        projects: 10,
      },
      searchOverrides: {
        admin: { group: 'Admin' },
      },
    }),
    formBuilderPlugin({
      formOverrides: {
        admin: { group: 'Admin' },
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: "slug",
            type: "text",
            required: true,
            unique: true,
            index: true,
            admin: { position: "sidebar" },
          },
          {
            name: "enabled",
            type: "checkbox",
            defaultValue: true,
            label: "Enable Submissions (DB write)",
            admin: { position: "sidebar" },
          },
        ],
      },
      fields: {
        text: true,
        textarea: true,
        select: true,
        email: true,
        checkbox: true,
        number: true,
        message: true,
        date: false,
        payment: false,
      },
      defaultToEmail: "hello@thefalcon.dev",
      formSubmissionOverrides: {
        admin: { group: 'Admin' },
      },
    }),
    mcpPlugin({
      collections: {
        posts: { enabled: true },
        work: { enabled: true },
        projects: { enabled: true },
        timeline: { enabled: true },
        education: { enabled: true },
        certifications: { enabled: true },
        media: { enabled: true },
        pages: { enabled: true },
      },
      globals: {
        'site-settings': { enabled: true },
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "../payload-types.ts"),
  },
  upload: {
    limits: {
      fileSize: 5_000_000,
    },
  },
});
