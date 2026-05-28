import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "template", "slug"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL-friendly identifier, e.g. privacy, terms, about",
      },
    },
    {
      name: "template",
      type: "select",
      required: true,
      options: [
        { label: "Legal", value: "legal" },
        { label: "Basic", value: "basic" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "lastUpdated",
      type: "date",
      admin: {
        position: "sidebar",
        condition: (data) => data.template === "legal",
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "body",
      type: "richText",
      required: true,
      editor: lexicalEditor(),
    },
  ],
};
