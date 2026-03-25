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
        "border border-outline text-primary bg-transparent",
        "transition-colors duration-base hover:bg-surface-highest"
      )}
    >
      ROLLBACK_TRANSACTION
    </button>
  );
}
