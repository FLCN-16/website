"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { contactSchema, INQUIRY_OPTIONS, type ContactFormData } from "@/lib/schemas/contact"
import { submitContact } from "@/actions/contact"
import { site } from "@/content/site"

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
import { FadeRise } from "@/components/anim/fade-rise"

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
    // @ts-expect-error — hookform/resolvers types lag behind zod v4 minor releases
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(data: ContactFormData) {
    setIsPending(true)
    try {
      const result = await submitContact(data)
      if (result.ok) {
        toast.success("Message sent. I'll be in touch soon.")
        reset()
        // Increment key to remount the form — forces Radix Select back to placeholder
        setFormKey((k) => k + 1)
      } else {
        toast.error(result.error ?? "Something went wrong. Please try again.")
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <FadeRise>
      <section className="py-16 md:py-24">
        {/* Header */}
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Get In Touch
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-10">
          Let&apos;s talk.
        </h1>

        <div className="grid md:grid-cols-[1fr_340px] gap-12 md:gap-16 items-start">
          {/* Form */}
          <form key={formKey} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
                <Label htmlFor="name" className="font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">
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
                <Label htmlFor="email" className="font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">
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
              <Label htmlFor="inquiry-trigger" className="font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">
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
              <Label htmlFor="message" className="font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="What's on your mind?"
                rows={6}
                aria-invalid={!!errors.message}
                className="px-3 py-2.5 text-sm"
                {...register("message")}
              />
              <FieldError message={errors.message?.message} />
            </div>

            <Button type="submit" disabled={isPending} size="lg" className="w-full md:w-auto">
              {isPending ? "Sending…" : "Send Message"}
            </Button>
          </form>

          {/* NODE_STATS panel — cut-corner border matching button aesthetic */}
          <aside className="relative font-mono text-sm md:sticky md:top-8" aria-label="Contact details">
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
        </div>
      </section>
    </FadeRise>
  )
}
