import { StackSection } from "@/components/sections/stack-section"
import { StackMatrix } from "@/components/sections/stack-matrix"
import { stack } from "@/content/stack"
import { createMetadata } from "@/lib/metadata"
import { getCachedSiteSettings } from "@/lib/data"
import { buildIdentity } from "@/lib/site-identity"

export const dynamic = 'force-static'

export async function generateMetadata() {
  const settings = await getCachedSiteSettings()
  const identity = buildIdentity(settings)
  return createMetadata({
    kind: 'STACK',
    title: "Stack",
    description: stack.intro,
    path: '/stack',
    identity,
  })
}

export default function StackPage() {
  return (
    <>
      <StackSection
        eyebrow={stack.eyebrow}
        heading={stack.heading}
        intro={stack.intro}
        bigStat={stack.bigStat}
        disciplines={stack.disciplines}
      />
      <StackMatrix disciplines={stack.disciplines} />
    </>
  )
}
