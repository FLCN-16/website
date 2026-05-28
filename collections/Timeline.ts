import type { CollectionConfig } from "payload";

export const Timeline: CollectionConfig = {
  slug: "timeline",
  admin: {
    useAsTitle: "company",
    defaultColumns: ["company", "role", "start", "end", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "company",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "text",
      required: true,
    },
    {
      name: "start",
      type: "text",
      required: true,
      admin: {
        description: "Year as string: 2022",
      },
    },
    {
      name: "end",
      type: "text",
      admin: {
        description: "Year or leave blank for current role",
      },
    },
    {
      name: "summary",
      type: "textarea",
    },
    {
      name: "tags",
      type: "array",
      fields: [
        {
          name: "tag",
          type: "text",
        },
      ],
    },
    {
      name: "order",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Lower = displayed first. Current role = 1.",
      },
    },
  ],
};
