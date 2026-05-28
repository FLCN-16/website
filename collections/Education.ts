import type { CollectionConfig } from "payload";

export const Education: CollectionConfig = {
  slug: "education",
  admin: {
    useAsTitle: "degree",
    defaultColumns: ["degree", "institution", "start", "end", "status", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "institution",
      type: "text",
      required: true,
    },
    {
      name: "degree",
      type: "text",
      required: true,
    },
    {
      name: "location",
      type: "text",
    },
    {
      name: "start",
      type: "text",
      admin: {
        description: "Year as string: 2016",
      },
    },
    {
      name: "end",
      type: "text",
      admin: {
        description: "Year as string: 2017 — leave blank for ongoing",
      },
    },
    {
      name: "gpa",
      type: "text",
      admin: {
        description: "e.g. CGPA 8.31 / 10",
      },
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Completed", value: "completed" },
        { label: "Ongoing", value: "ongoing" },
        { label: "Expected", value: "expected" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "order",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Lower = displayed first.",
      },
    },
  ],
};
