import { cva } from "class-variance-authority"

// buttonVariants is kept in a separate file so calendar.tsx and other
// non-component callers can import it without triggering fast-refresh violations.
const buttonVariants = cva(
  "inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer select-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:     "bg-primary text-primary-foreground hover:brightness-90",
        outline:     "border border-border bg-background hover:bg-muted",
        secondary:   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:       "hover:bg-muted hover:text-foreground",
        link:        "text-primary underline-offset-4 hover:underline",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        default: "h-8 px-3",
        xs:      "h-6 px-2 text-[10px]",
        sm:      "h-7 px-2.5",
        lg:      "h-10 px-5",
        xl:      "h-[52px] px-8 text-sm",
        icon:    "size-8 rounded-sm",
        "icon-xs": "size-6 rounded-sm",
        "icon-sm": "size-7 rounded-sm",
        "icon-lg": "size-9 rounded-sm",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export { buttonVariants }
