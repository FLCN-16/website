/**
 * Sends a Resend Broadcast to the subscriber audience when a post is published.
 * Called fire-and-forget from the Posts afterChange hook — never throws into the caller.
 */
import { Resend } from "resend"
import type { Payload } from "payload"
import { mapPayloadPost } from "@/lib/posts"
import { site } from "@/content/site"
import { PostBroadcast } from "@/emails/post-broadcast"

interface SendPostBroadcastArgs {
  doc: any // eslint-disable-line @typescript-eslint/no-explicit-any
  payload: Payload
}

export async function sendPostBroadcast({ doc, payload }: SendPostBroadcastArgs): Promise<void> {
  try {
    const apiKey = process.env.RESEND_API_KEY
    const segmentId = process.env.RESEND_SEGMENT_ID
    if (!apiKey || !segmentId) {
      payload.logger.warn(
        "[post-broadcast] Missing RESEND_API_KEY or RESEND_SEGMENT_ID — skipping broadcast.",
      )
      return
    }

    // Re-fetch the doc at depth:1 when the cover field isn't already populated
    // (afterChange may deliver the cover as a bare ID depending on save context).
    const heroRaw =
      doc.cover && typeof doc.cover === "object" && doc.cover.url
        ? doc
        : await payload.findByID({
            collection: "posts",
            id: doc.id as string,
            depth: 1,
            overrideAccess: true,
          })

    const hero = mapPayloadPost(heroRaw)

    // Fetch up to 3 other recent published posts (exclude the hero)
    const recentRes = await payload.find({
      collection: "posts",
      where: {
        and: [
          { status: { equals: "published" } },
          { slug: { not_equals: hero.slug } },
        ],
      },
      sort: "-publishedAt",
      limit: 3,
      depth: 1,
      overrideAccess: true,
    })
    const recent = recentRes.docs.map(mapPayloadPost)

    // Build URLs and sender identity
    const siteUrl = site.url
    const postUrl = `${siteUrl}/writing/${hero.slug}`
    const writingIndexUrl = `${siteUrl}/writing`
    const fromName = process.env.RESEND_FROM_NAME ?? "The Falcon"
    const fromAddress = process.env.RESEND_FROM_ADDRESS ?? "noreply@thefalcon.dev"
    const from = `${fromName} <${fromAddress}>`

    // Create and immediately send the broadcast via Resend.
    // `send: true` sends on creation — avoids a second API round-trip.
    // `audienceId` is @deprecated in the SDK in favour of `segmentId`,
    // but continues to work and maps directly to `audience_id` in the request body.
    const resend = new Resend(apiKey)
    const created = await resend.broadcasts.create({
      segmentId,
      from,
      subject: `New post: ${hero.title}`,
      previewText: hero.excerpt ?? undefined,
      name: `Post: ${hero.slug}`,
      react: PostBroadcast({
        title: hero.title,
        slug: hero.slug,
        excerpt: hero.excerpt ?? null,
        cover: hero.cover ? { url: hero.cover.url, alt: hero.cover.alt ?? null } : null,
        tag: hero.tags?.[0]?.tag ?? null,
        publishedAt: hero.publishedAt ?? null,
        readingTime: hero.readingTime ?? null,
        recent: recent.map((p) => ({
          title: p.title,
          slug: p.slug,
          publishedAt: p.publishedAt ?? null,
          readingTime: p.readingTime ?? null,
        })),
        siteUrl,
        postUrl,
        writingIndexUrl,
      }),
      send: true,
    })

    if (created.error || !created.data?.id) {
      payload.logger.error({
        msg: "[post-broadcast] Broadcast create/send failed",
        err: created.error,
      })
      return
    }

    payload.logger.info(
      `[post-broadcast] Broadcast ${created.data.id} sent for post "${hero.slug}".`,
    )
  } catch (err) {
    try {
      payload.logger.error({ msg: "[post-broadcast] Unexpected error", err })
    } catch {
      /* noop — logger itself may be unavailable */
    }
  }
}
