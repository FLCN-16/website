import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
  },
  upload: {
    disableLocalStorage: true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
  ],
};
