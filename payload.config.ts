import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { Users } from "./collections/Users.ts";
import { Posts } from "./collections/Posts.ts";
import { Media } from "./collections/Media.ts";
import { Submissions } from "./collections/Submissions.ts";
import { Work } from "./collections/Work.ts";
import { Projects } from "./collections/Projects.ts";
import { Timeline } from "./collections/Timeline.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Posts, Media, Submissions, Work, Projects, Timeline],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || "",
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  upload: {
    limits: {
      fileSize: 5_000_000,
    },
  },
});
