"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Sun02Icon, Moon02Icon } from "@hugeicons/core-free-icons"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="size-8" />
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <HugeiconsIcon icon={Sun02Icon} size={16} strokeWidth={1.5} />
      ) : (
        <HugeiconsIcon icon={Moon02Icon} size={16} strokeWidth={1.5} />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
