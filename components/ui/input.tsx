import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="gradient-border w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "h-8 w-full min-w-0 rounded-none bg-background px-2.5 py-1 text-xs outline-none transition-colors",
          "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          "dark:bg-card",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }
