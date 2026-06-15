"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import Link from "next/link"

import { dataRequestSchema, REQUEST_TYPE_OPTIONS, type DataRequestFormData } from "@/lib/schemas/data-request"
import { submitDataRequest } from "@/actions/data-request"
import { trackEvent } from "@/lib/analytics"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1 font-mono text-xs text-destructive">{message}</p>
  )
}

export function DataRequestFormSection() {
  const [isPending, setIsPending] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DataRequestFormData>({
    resolver: zodResolver(dataRequestSchema),
  })

  async function onSubmit(data: DataRequestFormData) {
    setIsPending(true)
    try {
      const result = await submitDataRequest(data)
      if (result.ok) {
        trackEvent({ event: 'generate_lead', form_source: 'data_request', request_type: data.requestType })
        toast.success("Request submitted. You'll receive a confirmation email shortly.")
        reset()
        setFormKey((k) => k + 1)
      } else {
        toast.error(result.error ?? "Something went wrong. Please try again.")
        trackEvent({ event: 'form_error', form_source: 'data_request', error_message: result.error ?? 'Unknown error' })
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.")
      trackEvent({ event: 'form_error', form_source: 'data_request', error_message: 'Network error' })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="mt-10 border-t border-border pt-10">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
        Submit a Request
      </p>
      <h2 className="text-2xl font-semibold tracking-tight mb-2">
        Data Subject Request Form
      </h2>
      <p className="text-muted-foreground text-sm max-w-prose mb-8">
        Use this form to exercise any of your rights described above. All requests are acknowledged within 30 days as required by GDPR Art. 12.
      </p>

      <form
        key={formKey}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5 max-w-xl"
      >
        {/* Honeypot — hidden from real users, visible to bots */}
        <div className="absolute -left-[9999px] -top-[9999px] overflow-hidden" aria-hidden="true">
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("_honeypot")}
          />
        </div>

        {/* Name + Email — side-by-side on sm+ */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="dr-name" className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Full Name
            </Label>
            <Input
              id="dr-name"
              placeholder="Your full name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              className="h-11 px-3 text-sm"
              {...register("name")}
            />
            <FieldError message={errors.name?.message} />
          </div>

          <div>
            <Label htmlFor="dr-email" className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Email
            </Label>
            <Input
              id="dr-email"
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

        {/* Request Type */}
        <div>
          <Label htmlFor="dr-request-type" className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">
            Request Type
          </Label>
          <Controller
            name="requestType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  id="dr-request-type"
                  className="w-full data-[size=default]:h-11 px-3 text-sm"
                  aria-invalid={!!errors.requestType}
                >
                  <SelectValue placeholder="Select your GDPR right" />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.requestType?.message} />
        </div>

        {/* Details */}
        <div>
          <Label htmlFor="dr-details" className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">
            Details
          </Label>
          <Textarea
            id="dr-details"
            placeholder="Describe your request and any information that helps us locate your data (e.g. the email address you used, approximate dates of interaction)."
            rows={8}
            aria-invalid={!!errors.details}
            className="px-3 py-2.5 text-sm resize-y min-h-[160px]"
            maxLength={2000}
            {...register("details")}
          />
          <FieldError message={errors.details?.message} />
        </div>

        {/* Consent checkbox */}
        <div>
          <div className="flex items-start gap-3">
            <Controller
              name="consent"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="dr-consent"
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked === true ? true : undefined)}
                  aria-invalid={!!errors.consent}
                  className="mt-0.5 shrink-0"
                />
              )}
            />
            <Label
              htmlFor="dr-consent"
              className={cn(
                "text-sm leading-relaxed cursor-pointer",
                errors.consent ? "text-destructive" : "text-muted-foreground"
              )}
            >
              I confirm I am the data subject (or am authorised to act on their behalf), and that the information provided above is accurate.
            </Label>
          </div>
          <FieldError message={errors.consent?.message} />
        </div>

        <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
          Identity verification may be required before your request is fulfilled. We aim to respond within 30 days (GDPR Art. 12).
        </p>

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending} size="lg" className="flex-1">
            {isPending ? "Submitting…" : "Submit Request"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isPending}
            onClick={() => { reset(); setFormKey((k) => k + 1) }}
          >
            Reset
          </Button>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-[11px] text-muted-foreground/60 leading-relaxed text-center">
            By submitting, you agree to the{" "}
            <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
              Privacy Policy
            </Link>
            . Your data is used solely to process this request.
          </p>
        </div>
      </form>
    </div>
  )
}
