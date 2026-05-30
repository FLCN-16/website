"use client"

import { useState } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { contactSchema, INQUIRY_OPTIONS, type ContactFormData } from "@/lib/schemas/contact"
import { submitContact } from "@/actions/contact"
import { site } from "@/content/site"
import { trackEvent } from "@/lib/analytics"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { FadeRise } from "@/components/anim/fade-rise"
import { cn } from "@/lib/utils"

const NODE_STATS = [
  { label: "LOCATION", value: site.location },
  { label: "TIMEZONE", value: site.timezone },
  { label: "STATUS", value: site.status.label },
  { label: "RESPONSE", value: "~24 hours" },
  { label: "PREFERRED", value: "Email / This form" },
] as const

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1 font-mono text-xs text-destructive">{message}</p>
  )
}

export function ContactFormSection() {
  const [isPending, setIsPending] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const messageValue = useWatch({ control, name: "message" }) ?? ""
  const tokenCount = Math.round(messageValue.length / 4)
  const ctxPct = tokenCount > 0 ? (tokenCount / 200_000 * 100).toFixed(3) : "0.000"
  const CHAR_MAX = 2000

  async function onSubmit(data: ContactFormData) {
    setIsPending(true)
    try {
      const result = await submitContact(data)
      if (result.ok) {
        trackEvent({ event: 'generate_lead', form_source: 'contact', inquiry_type: data.inquiry })
        toast.success("Message sent. I'll be in touch soon.")
        reset()
        // Increment key to remount the form — forces Radix Select back to placeholder
        setFormKey((k) => k + 1)
      } else {
        toast.error(result.error ?? "Something went wrong. Please try again.")
        trackEvent({ event: 'form_error', form_source: 'contact', error_message: result.error ?? 'Unknown error' })
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.")
      trackEvent({ event: 'form_error', form_source: 'contact', error_message: 'Network error' })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <FadeRise>
      <section className="py-16 md:py-28">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Get In Touch
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Let&apos;s talk.
          </h1>
          <p className="text-muted-foreground text-base max-w-md">
            Have a project, role, or idea? Fill out the form and I&apos;ll get back within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-[300px_1fr] xl:grid-cols-[300px_1fr_200px] gap-10 md:gap-16 items-start">
          {/* NODE_STATS panel — cut-corner border matching button aesthetic */}
          <aside className="relative font-mono text-sm order-last md:order-first md:sticky md:top-24" aria-label="Contact details">
            {/* SVG border: top, left, right, bottom edges + diagonal cut at bottom-right */}
            <svg
              className="absolute inset-0 w-full h-full text-border pointer-events-none"
              viewBox="0 0 1 1"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon
                points="0,0 1,0 1,0.91 0.91,1 0,1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div className="p-6">
              <p className="text-muted-foreground text-xs uppercase tracking-widest mb-5">
                Node Status
              </p>
              <div className="space-y-4">
                {NODE_STATS.map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-muted-foreground/50 text-xs uppercase tracking-widest">
                      {label}
                    </span>
                    <span className="text-foreground text-sm">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-border">
                <p className="text-muted-foreground/50 text-xs uppercase tracking-widest mb-1.5">
                  Direct Email
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="text-foreground text-sm hover:text-primary transition-colors break-all"
                >
                  {site.email}
                </a>
              </div>
            </div>
          </aside>

          {/* Form */}
          <form key={formKey} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 order-first md:order-last">
            {/* Honeypot — hidden from real users, visible to bots */}
            <div className="absolute -left-[9999px] -top-[9999px] overflow-hidden" aria-hidden="true">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("_honeypot")}
              />
            </div>

            {/* Name + Email — side-by-side on lg */}
            <div className="grid lg:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  className="h-11 px-3 text-sm"
                  {...register("name")}
                />
                <FieldError message={errors.name?.message} />
              </div>

              <div>
                <Label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  className="h-11 px-3 text-sm"
                  {...register("email")}
                />
                <FieldError message={errors.email?.message} />
              </div>
            </div>

            {/* Inquiry */}
            <div>
              <Label htmlFor="inquiry-trigger" className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Inquiry
              </Label>
              <Controller
                name="inquiry"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="inquiry-trigger"
                      className="w-full data-[size=default]:h-11 px-3 text-sm"
                      aria-invalid={!!errors.inquiry}
                    >
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      {INQUIRY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.inquiry?.message} />
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="What's on your mind?"
                rows={14}
                aria-invalid={!!errors.message}
                className="px-3 py-2.5 text-sm resize-y min-h-[200px]"
                maxLength={CHAR_MAX}
                {...register("message")}
              />
              <div className="flex items-center justify-between mt-1">
                <FieldError message={errors.message?.message} />
                <p className={cn(
                  "font-mono text-[10px] tabular-nums ml-auto",
                  tokenCount >= CHAR_MAX / 4 ? "text-destructive" : tokenCount > CHAR_MAX / 4 * 0.9 ? "text-amber-500" : "text-muted-foreground/50"
                )}>
                  ~{tokenCount} tok · {ctxPct}% of 200k ctx
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isPending} size="lg" className="flex-1">
                {isPending ? "Sending…" : "Send Message"}
              </Button>
              <Button type="button" variant="outline" size="lg" disabled={isPending} onClick={() => { reset(); setFormKey((k) => k + 1) }}>
                Reset
              </Button>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-[11px] text-muted-foreground/60 leading-relaxed text-center">
                By sending, you agree to the{" "}
                <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
                  Privacy Policy
                </Link>
                {" "}and{" "}
                <Link href="/legal/terms" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
                  Terms
                </Link>
                . Your information is only used to respond to your message.
              </p>
            </div>
          </form>

        </div>
      </section>
    </FadeRise>
  )
}
