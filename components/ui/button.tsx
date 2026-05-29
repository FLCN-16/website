"use client"

import * as React from "react"
import { Slot } from "radix-ui"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ── SVG path generators ────────────────────────────────────────────────────────
// The Twenty.com button shape: rounded left edge, flat top/bottom, diagonal cut at bottom-right.

function leftPath(h: number, outline: boolean) {
  return outline
    ? `M4 0.5 A3.5 3.5 0 0 0 0.5 4 V${h - 4} A3.5 3.5 0 0 0 4 ${h - 0.5}`
    : `M4 0 A4 4 0 0 0 0 4 V${h - 4} A4 4 0 0 0 4 ${h} Z`
}

function rightPath(h: number, outline: boolean) {
  // All values scale proportionally from the original h=40 design
  const n = (v: number) => +(v * h / 40).toFixed(3)
  return outline
    ? [
        `M0 0.5 h11 a3.5 3.5 0 0 1 3.5 3.5`,
        `v${n(20.523)}`,
        `a${n(5.5)} ${n(5.5)} 0 0 1 ${n(-1.416)} ${n(3.684)}`,
        `l${n(-8.547)} ${n(9.477)}`,
        `a${n(5.5)} ${n(5.5)} 0 0 1 ${n(-4.084)} ${n(1.816)}`,
        `H0`,
      ].join(" ")
    : [
        `M0 0 h11 a4 4 0 0 1 4 4`,
        `v${n(20.523)}`,
        `a${n(6)} ${n(6)} 0 0 1 ${n(-1.544)} ${n(4.019)}`,
        `l${n(-8.548)} ${n(9.477)}`,
        `A${n(6)} ${n(6)} 0 0 1 ${n(0.453)} ${h}`,
        `H0 Z`,
      ].join(" ")
}

// ── Variant colour config ──────────────────────────────────────────────────────

const COLORS = {
  default:     { svgFill: "var(--primary)",     svgStroke: "var(--primary)",     textClass: "text-primary-foreground" },
  outline:     { svgFill: "transparent",         svgStroke: "var(--foreground)",  textClass: "text-foreground" },
  secondary:   { svgFill: "var(--secondary)",    svgStroke: "var(--secondary)",   textClass: "text-secondary-foreground" },
  destructive: { svgFill: "var(--destructive)",  svgStroke: "var(--destructive)", textClass: "text-white" },
} as const

// Height per size token
const HEIGHTS: Record<string, number> = {
  xs: 24, sm: 28, default: 32, lg: 40, xl: 52,
}

// ── Shape renderers ────────────────────────────────────────────────────────────

function ShapeLayer({ h, outline, color }: { h: number; outline: boolean; color: string }) {
  return (
    <div className="absolute inset-0 flex" aria-hidden="true">
      {/* Left rounded cap — 4px wide */}
      <svg width={4} height={h} viewBox={`0 0 4 ${h}`} fill="none" className="shrink-0">
        {outline
          ? <path d={leftPath(h, true)} stroke={color} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
          : <path d={leftPath(h, false)} fill={color} />}
      </svg>

      {/* Middle — stretches to fill button width */}
      <svg height={h} width="100%" preserveAspectRatio="none" fill="none" className="flex-1 min-w-0">
        {outline ? (
          <>
            <line x1="0" x2="100%" y1="0.5" y2="0.5" stroke={color} strokeWidth={1} />
            <line x1="0" x2="100%" y1={h - 0.5} y2={h - 0.5} stroke={color} strokeWidth={1} />
          </>
        ) : (
          <rect width="102%" height={h} fill={color} />
        )}
      </svg>

      {/* Right diagonal-cut cap — 15px wide */}
      <svg width={15} height={h} viewBox={`0 0 15 ${h}`} fill="none" className="shrink-0">
        {outline
          ? <path d={rightPath(h, true)} stroke={color} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
          : <path d={rightPath(h, false)} fill={color} />}
      </svg>
    </div>
  )
}

// ── Main Button component ──────────────────────────────────────────────────────

type ButtonVariant = "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
type ButtonSize = "xs" | "sm" | "default" | "lg" | "xl" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

function Button({
  variant = "default",
  size = "default",
  asChild = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {

  // ── Ghost / link — simple CSS, no SVG ─────────────────────────────────────
  if (variant === "ghost" || variant === "link") {
    const Comp = asChild ? Slot.Root : "button"
    return (
      <Comp
        data-slot="button"
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
          "font-mono text-xs uppercase tracking-widest cursor-pointer select-none",
          "transition-colors disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          variant === "ghost" && "hover:bg-muted hover:text-foreground px-3 rounded-sm",
          variant === "link" && "text-primary underline-offset-4 hover:underline",
          size === "default" && "h-8",
          size === "sm" && "h-7",
          size === "lg" && "h-10",
          size === "xl" && "h-[52px] text-sm",
          size === "xs" && "h-6 text-[10px]",
          className,
        )}
        {...(props as Record<string, unknown>)}
      >
        {children}
      </Comp>
    )
  }

  // ── Icon sizes — square with rounded corners, no diagonal cut ─────────────
  if (size === "icon" || size === "icon-xs" || size === "icon-sm" || size === "icon-lg") {
    const sizeClass = { icon: "size-8", "icon-xs": "size-6", "icon-sm": "size-7", "icon-lg": "size-9" }[size]
    const Comp = asChild ? Slot.Root : "button"
    return (
      <Comp
        data-slot="button"
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-sm cursor-pointer select-none",
          "transition-colors disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0",
          variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
          variant === "outline" && "border border-border bg-background hover:bg-muted",
          variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          variant === "destructive" && "bg-destructive text-white hover:bg-destructive/90",
          sizeClass,
          className,
        )}
        {...(props as Record<string, unknown>)}
      >
        {children}
      </Comp>
    )
  }

  // ── SVG-shaped button ──────────────────────────────────────────────────────
  const h = HEIGHTS[size] ?? 32
  const isOutline = variant === "outline"
  const colors = COLORS[variant as keyof typeof COLORS] ?? COLORS.default
  const shapeColor = isOutline ? colors.svgStroke : colors.svgFill

  // asChild: extract the child element's type and props, render SVG structure inside it
  type AnyProps = Record<string, unknown>
  let Comp: React.ElementType = "button"
  let outerProps: AnyProps = { disabled, ...props } as AnyProps
  let innerContent: React.ReactNode = children

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<AnyProps>
    Comp = child.type as React.ElementType
    outerProps = { ...(props as AnyProps), ...(child.props as AnyProps) }
    innerContent = (child.props as { children?: React.ReactNode }).children
  }

  return (
    <Comp
      data-slot="button"
      {...outerProps}
      style={{ height: h, ...(((outerProps as { style?: React.CSSProperties }).style) ?? {}) }}
      className={cn(
        "relative inline-flex items-stretch cursor-pointer select-none",
        "transition-all hover:brightness-90 active:brightness-75",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none",
        className,
      )}
    >
      <ShapeLayer h={h} outline={isOutline} color={shapeColor} />

      {/* Text layer — sits above the SVG shape */}
      <span className={cn(
        "relative z-10 flex items-center justify-center gap-1.5 px-5",
        "font-mono text-xs uppercase tracking-widest whitespace-nowrap font-medium",
        "[&_svg]:shrink-0",
        colors.textClass,
      )}>
        {innerContent}
      </span>
    </Comp>
  )
}

// ── buttonVariants — kept for components that generate class strings ───────────
// (e.g. calendar.tsx uses buttonVariants({ variant: "ghost" }) for nav arrows)

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

export { Button, buttonVariants }
export type { ButtonProps }
