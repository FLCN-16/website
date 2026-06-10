"use client"

import { useState, useTransition, useEffect } from "react"
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
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon, Alert01Icon } from "@hugeicons/core-free-icons"
import { subscribe } from "@/actions/subscribe"

interface SubscribeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function SubscribeDialog({ open, onOpenChange }: SubscribeDialogProps) {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleOpenChange(next: boolean) {
    if (!next) {
      setState("idle")
      setEmail("")
      setErrorMsg("")
    }
    onOpenChange(next)
  }

  useEffect(() => {
    if (state !== "success") return
    const t = setTimeout(() => {
      setState("idle")
      setEmail("")
      setErrorMsg("")
      onOpenChange(false)
    }, 1500)
    return () => clearTimeout(t)
  }, [state, onOpenChange])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await subscribe({ email })
      if (result.ok) {
        setState("success")
        setEmail("")
      } else {
        setState("error")
        setErrorMsg(result.error ?? "Something went wrong.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stay in the loop</DialogTitle>
          <DialogDescription>
            New articles on frontend engineering, system design, and building software that lasts. Straight to your inbox.
          </DialogDescription>
        </DialogHeader>

        {state === "success" ? (
          <div className="flex items-start gap-3 py-2">
            <HugeiconsIcon
              icon={CheckmarkCircle01Icon}
              size={16}
              strokeWidth={1.5}
              className="shrink-0 mt-0.5 text-foreground"
            />
            <div>
              <p className="font-mono text-xs font-medium">You&apos;re in.</p>
              <p className="font-mono text-xs text-muted-foreground">New articles coming your way.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <Input
              type="email"
              required
              aria-label="Email address"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setState("idle") }}
              disabled={isPending}
            />

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                size="default"
                disabled={isPending}
                className="w-full"
              >
                {isPending ? "Subscribing…" : "Subscribe →"}
              </Button>

              {state === "error" && (
                <p className="flex items-center gap-1.5 font-mono text-xs text-destructive">
                  <HugeiconsIcon icon={Alert01Icon} size={12} strokeWidth={1.5} className="shrink-0" />
                  {errorMsg}
                </p>
              )}

              <div className="text-xs text-muted-foreground text-center space-y-0.5">
                <p>
                  By subscribing you agree to our{" "}
                  <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/legal/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">
                    Terms
                  </Link>.
                </p>
                <p>Unsubscribe anytime.</p>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function SubscribeButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size="xl" className="w-full" onClick={() => setOpen(true)}>
        Get the dispatch →
      </Button>
      <SubscribeDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
