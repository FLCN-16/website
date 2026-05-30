import { StackSection } from "@/components/sections/stack-section"
import { StackMatrix } from "@/components/sections/stack-matrix"
import { stack } from "@/content/stack"
import { createMetadata } from "@/lib/metadata"

export const dynamic = 'force-static'

export const metadata = createMetadata({
  title: "Stack",
  description: stack.intro,
  path: '/stack',
})

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
