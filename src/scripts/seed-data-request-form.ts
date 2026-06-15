/**
 * Seed script — creates the data-request form in the Payload form builder.
 * Safe to run multiple times: skips creation if the form already exists.
 *
 * Run: pnpm seed:data-request-form
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

  const existing = await payload.find({
    collection: "forms",
    where: { slug: { equals: "data-request" } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log("data-request form already exists — skipping.")
    process.exit(0)
  }

  console.log("Creating data-request form…")

  await payload.create({
    collection: "forms",
    data: {
      title: "Data Request",
      slug: "data-request",
      submitButtonLabel: "SUBMIT REQUEST",
      confirmationType: "message",
      confirmationMessage: {
        root: {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [{ type: "text", text: "Your request has been received. You will receive a confirmation email and a response within 30 days.", version: 1, format: 0, detail: 0, mode: "normal", style: "" }],
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
      enabled: true,
      fields: [
        {
          blockType: "text",
          name: "name",
          label: "FULL NAME",
          required: true,
        },
        {
          blockType: "email",
          name: "email",
          label: "EMAIL ADDRESS",
          required: true,
        },
        {
          blockType: "select",
          name: "requestType",
          label: "REQUEST TYPE",
          required: true,
          options: [
            { label: "Access my data (Art. 15)", value: "access" },
            { label: "Correct my data (Art. 16)", value: "rectification" },
            { label: "Delete my data (Art. 17)", value: "erasure" },
            { label: "Restrict processing (Art. 18)", value: "restriction" },
            { label: "Export my data (Art. 20)", value: "portability" },
            { label: "Object to processing (Art. 21)", value: "objection" },
            { label: "Withdraw consent (Art. 7)", value: "withdraw-consent" },
            { label: "Automated decisions / Other (Art. 22)", value: "automated-decision" },
          ],
        },
        {
          blockType: "textarea",
          name: "details",
          label: "DETAILS",
          required: true,
        },
        {
          blockType: "checkbox",
          name: "consent",
          label: "I confirm I am the data subject (or authorised to act on their behalf) and the information provided is accurate.",
          required: true,
          defaultValue: false,
        },
      ],
    } as never,
  })

  console.log("Done — data-request form created.")
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
