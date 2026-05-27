import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <div className="gradient-border w-full">
      <textarea
        data-slot="textarea"
        className={cn(
          "flex field-sizing-content min-h-16 w-full rounded-none bg-background px-2.5 py-2 text-xs outline-none transition-colors",
          "placeholder:text-muted-foreground",
          "dark:bg-card",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Textarea }
