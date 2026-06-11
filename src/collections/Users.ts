import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    group: 'System',
    useAsTitle: "email",
  },
  auth: true,
  fields: [],
};
