// components/writing/filter-drawer.tsx
"use client"

import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FilterPanel, type FilterPanelProps } from "./filter-panel"

export function FilterDrawer(props: FilterPanelProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">
          Filters{props.activeFilterCount > 0 ? ` (${props.activeFilterCount})` : ""}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-4">
          <FilterPanel {...props} />
        </div>
        <div className="border-t border-border p-4">
          <SheetClose asChild>
            <button className="w-full rounded-lg bg-foreground py-2.5 font-mono text-xs text-background transition-colors hover:opacity-90">
              Apply
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
