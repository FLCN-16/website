import type { CollectionConfig } from "payload";

export const Submissions: CollectionConfig = {
  slug: "submissions",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "inquiry", "submittedAt"],
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    {
      name: "inquiry",
      type: "select",
      options: [
        { label: "New Project", value: "project" },
        { label: "Consulting", value: "consulting" },
        { label: "Full-time Role", value: "fulltime" },
        { label: "Other", value: "other" },
      ],
    },
    { name: "message", type: "textarea", required: true },
    {
      name: "submittedAt",
      type: "date",
      admin: { position: "sidebar" },
    },
    {
      name: "ip",
      type: "text",
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "userAgent",
      type: "text",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};
