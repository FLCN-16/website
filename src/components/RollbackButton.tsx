"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

export default function RollbackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={cn(
        "px-08 py-04 font-mono text-label-sm tracking-label",
        "border border-outline bg-transparent text-primary",
        "duration-base transition-colors hover:bg-surface-highest",
      )}
    >
      ROLLBACK_TRANSACTION
    </button>
  );
}
