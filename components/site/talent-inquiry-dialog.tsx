"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { submitTalentInquiry } from "@/actions/talent-inquiry"
import type { Form, FormFieldBlock } from "@payloadcms/plugin-form-builder/types"
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

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => setOpen(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  function handleOpenChange(next: boolean) {
    if (!next) {
      localStorage.setItem(STORAGE_KEY, "1")
    }
    setOpen(next)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const fd = new FormData(e.currentTarget)
    fd.set("formId", form.id)

    const result = await submitTalentInquiry(fd)

    if (result.ok) {
      localStorage.setItem(STORAGE_KEY, "1")
      setOpen(false)
      toast.success("Details sent.")
    } else {
      setError(result.error ?? "Something went wrong. Please try again.")
    }

    setIsPending(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Opportunity
          </p>
          <DialogTitle className="font-mono text-base uppercase tracking-widest">
            Looking for Talent?
          </DialogTitle>
          <DialogDescription>
            Hiring or have an opportunity?
          </DialogDescription>
        </DialogHeader>

        <p className="text-xs text-muted-foreground leading-relaxed">
          If you&apos;re building something that demands precision and are looking
          for a full-time Front-End Technical Lead, I&apos;d love to hear about it.
          <br />
          <span className="font-medium text-foreground">
            Please note: I am only open to full-time opportunities (no freelance or contract work).
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
              Or Attach JD File
            </p>
            <div className="flex items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                name="jdFile"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="font-mono text-xs uppercase tracking-widest"
                onClick={() => fileRef.current?.click()}
              >
                Browse Files
              </Button>
              {fileName && (
                <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                  {fileName}
                </span>
              )}
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive font-mono">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full font-mono uppercase tracking-widest text-xs"
          >
            {isPending ? <Spinner className="mr-2 h-3 w-3" /> : null}
            {isPending ? "Sending…" : (form.submitButtonLabel ?? "Send Details")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
