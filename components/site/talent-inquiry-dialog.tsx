"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { trackEvent } from "@/lib/analytics"
import { submitTalentInquiry } from "@/actions/talent-inquiry"
import type { Form, FormFieldBlock } from "@payloadcms/plugin-form-builder/types"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "talent_popup_seen"
const DELAY_MS = 15_000

interface Props {
  form: Form
}

export function TalentInquiryDialog({ form }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const submittedRef = useRef(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => {
      setOpen(true)
      trackEvent({ event: 'popup_impression', form_source: 'talent_dialog' })
    }, DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  function handleOpenChange(next: boolean) {
    if (!next) {
      if (!submittedRef.current && !isPending) {
        trackEvent({ event: 'popup_dismiss', form_source: 'talent_dialog' })
      }
      localStorage.setItem(STORAGE_KEY, "1")
    }
    setOpen(next)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    try {
      const fd = new FormData(e.currentTarget)
      fd.set("formId", form.id)

      const result = await submitTalentInquiry(fd)

      if (result.ok) {
        trackEvent({ event: 'generate_lead', form_source: 'talent_dialog' })
        localStorage.setItem(STORAGE_KEY, "1")
        submittedRef.current = true
        setOpen(false)
        toast.success("Details sent.")
      } else {
        setError(result.error ?? "Something went wrong. Please try again.")
        trackEvent({ event: 'form_error', form_source: 'talent_dialog', error_message: result.error ?? 'Unknown error' })
      }
    } catch {
      setError("Network error. Please check your connection and try again.")
      trackEvent({ event: 'form_error', form_source: 'talent_dialog', error_message: 'Network error' })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Opportunity
          </p>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Looking for Talent?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Building something that demands precision? I&apos;m a Full-Stack Technical Lead
            open to the right full-time role.
          </DialogDescription>
        </DialogHeader>

        <div className="border-l-2 border-amber-500/50 pl-3 py-0.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500/80 mr-1.5">Note:</span>
            Full-time only. No freelance or contract work.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* CMS-driven fields */}
          {form.fields?.map((field: FormFieldBlock) => {
            if (field.blockType === "email") {
              return (
                <div key={field.name}>
                  <Label
                    htmlFor={`talent-${field.name}`}
                    className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block"
                  >
                    {field.label ?? "Email Address"}
                    {field.required && " *"}
                  </Label>
                  <Input
                    id={`talent-${field.name}`}
                    type="email"
                    name={field.name}
                    required={field.required ?? false}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="h-10 px-3 text-sm"
                  />
                </div>
              )
            }

            if (field.blockType === "textarea") {
              return (
                <div key={field.name}>
                  <Label
                    htmlFor={`talent-${field.name}`}
                    className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block"
                  >
                    {field.label ?? "Message"}
                  </Label>
                  <Textarea
                    id={`talent-${field.name}`}
                    name={field.name}
                    required={field.required ?? false}
                    rows={4}
                    className="px-3 py-2 text-sm resize-none"
                  />
                </div>
              )
            }

            return null
          })}

          {/* Static file input */}
          <div>
            <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Or Attach JD File
            </Label>
            <input
              ref={fileRef}
              type="file"
              name="jdFile"
              accept=".pdf,.doc,.docx"
              aria-label="Attach job description file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f && f.size > 5 * 1024 * 1024) {
                  setError("File must be under 5 MB.")
                  e.target.value = ""
                  return
                }
                setError(null)
                setFileName(f?.name ?? null)
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full h-10 px-3 flex items-center gap-2 border border-input rounded-sm bg-transparent hover:bg-muted transition-colors cursor-pointer text-left"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground shrink-0">
                Browse
              </span>
              <span className="h-4 w-px bg-border shrink-0" />
              <span className={cn("text-xs truncate", fileName ? "text-foreground" : "text-muted-foreground/50")}>
                {fileName ?? "No file chosen"}
              </span>
            </button>
          </div>

          {error && (
            <p className="text-xs text-destructive font-mono">{error}</p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? <Spinner className="mr-2 size-3" /> : null}
            {isPending ? "Sending…" : (form.submitButtonLabel ?? "Send Details")}
          </Button>

          <p className="text-[11px] text-muted-foreground/60 leading-relaxed text-center -mt-3">
            By sending, you agree to the{" "}
            <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
              Privacy Policy
            </Link>
            {" "}and{" "}
            <Link href="/legal/terms" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
              Terms
            </Link>
            . Your information is only used to respond to your inquiry.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
