import type { Metadata } from "next"
import { StackSection } from "@/components/sections/stack-section"
import { StackMatrix } from "@/components/sections/stack-matrix"
import { stack } from "@/content/stack"

export const metadata: Metadata = {
  title: "Stack",
  description: stack.intro,
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
