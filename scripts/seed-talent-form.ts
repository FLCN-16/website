/**
 * Seed script — creates the talent-inquiry form in the Payload form builder.
 * Safe to run multiple times: skips creation if the form already exists.
 *
 * Run: pnpm seed:talent-form
 */

import { readFileSync } from "fs"
import { resolve } from "path"

function loadEnvLocal() {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf8")
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIdx = trimmed.indexOf("=")
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "")
      if (key && !process.env[key]) process.env[key] = val
    }
  } catch {
    // no .env.local — rely on shell environment
  }
}

async function main() {
  loadEnvLocal()

  console.log("Connecting to Payload…")
  const { getPayload } = await import("payload")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { default: config } = await import("../payload.config") as any
  const payload = await getPayload({ config })

  // Check if form already exists
  const existing = await payload.find({
    collection: "forms",
    where: { slug: { equals: "talent-inquiry" } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log("talent-inquiry form already exists — skipping.")
    process.exit(0)
  }

  console.log("Creating talent-inquiry form…")

  await payload.create({
    collection: "forms",
    data: {
      title: "Talent Inquiry",
      slug: "talent-inquiry",
      submitButtonLabel: "SEND DETAILS",
      confirmationType: "message",
      confirmationMessage: {
        root: {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [{ type: "text", text: "Details sent. I'll be in touch.", version: 1, format: 0, detail: 0, mode: "normal", style: "" }],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
              textFormat: 0,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1,
        },
      },
      // Custom fields from formOverrides
      enabled: true,
      // Form builder fields
      fields: [
        {
          blockType: "email",
          name: "email",
          label: "EMAIL ADDRESS",
          required: true,
        },
        {
          blockType: "textarea",
          name: "pitch",
          label: "JOB DESCRIPTION / PITCH",
          required: false,
        },
      ],
    } as never,
  })

  console.log("Done — talent-inquiry form created.")
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
