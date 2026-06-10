/**
 * One-off migration: posts.tags from array-of-objects [{ tag: "x" }] to
 * plain string arrays ["x"], matching the hasMany text field.
 * Run: npx tsx scripts/migrate-post-tags.ts
 *
 * Idempotent — only rewrites docs whose first tags element is still an object.
 * Talks to Mongo directly (mongoose) because Payload validation on either
 * side of the schema change would reject the opposite shape.
 */

import { readFileSync } from "fs"
import { resolve } from "path"
import mongoose from "mongoose"

function loadEnvLocal() {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf8")
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIdx = trimmed.indexOf("=")
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      let value = trimmed.slice(eqIdx + 1).trim()
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
      if (!(key in process.env)) process.env[key] = value
    }
  } catch {
    // .env.local optional — env may come from the shell
  }
}

async function main() {
  loadEnvLocal()
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI is not set")

  await mongoose.connect(uri)
  const posts = mongoose.connection.db!.collection("posts")

  const result = await posts.updateMany(
    { "tags.0.tag": { $exists: true } },
    [
      {
        $set: {
          tags: {
            $map: { input: "$tags", as: "t", in: "$$t.tag" },
          },
        },
      },
    ],
  )

  console.log(`Matched ${result.matchedCount}, migrated ${result.modifiedCount} posts`)

  const remaining = await posts.countDocuments({ "tags.0.tag": { $exists: true } })
  console.log(`Posts still in old shape: ${remaining}`)

  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
