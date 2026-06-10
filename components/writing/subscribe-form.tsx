"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans text-xl font-semibold tracking-tight">
            Stay in the loop
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            New articles on frontend engineering, system design, and building software that lasts. Straight to your inbox.
          </DialogDescription>
        </DialogHeader>

        {state === "success" ? (
          <div className="py-4">
            <p className="font-mono text-sm text-muted-foreground">
              You&apos;re in. New articles coming your way.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <input
              type="email"
              required
              aria-label="Email address"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setState("idle") }}
              disabled={isPending}
              className="font-mono text-sm h-10 px-4 rounded-lg border border-border bg-transparent placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-full"
            />

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full"
              >
                {isPending ? "Subscribing…" : "Subscribe →"}
              </Button>

              {state === "error" && (
                <p className="font-mono text-xs text-destructive">{errorMsg}</p>
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
