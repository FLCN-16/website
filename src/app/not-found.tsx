import Link from "next/link";

import LiveClock from "@/components/LiveClock";
import RollbackButton from "@/components/RollbackButton";
import { cn } from "@/lib/utils";

/* ── Metadata column ── */

function MetaCol({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-01">
      <span className="font-mono text-label-sm tracking-label text-outline">{label}</span>
      <span className="font-mono text-body-md font-medium text-primary">{value}</span>
    </div>
  );
}

/* ── Page ── */

export default function NotFound() {
  return (
    <main className="min-h-page-shell flex w-full flex-col items-center justify-between bg-surface px-8">
      {/* ── Center block ── */}
      <div className="my-auto flex flex-col items-center gap-6">
        {/* Status label */}
        <p className="font-mono text-label-sm tracking-label text-outline">
          STATUS: ERROR_NODE_404
        </p>

        {/* 404 */}
        <h1
          className={cn(
            "font-headline leading-none font-black tracking-tighter text-primary",
            "text-9xl",
          )}
        >
          404
        </h1>

        {/* Divider */}
        <div className="h-px w-16 bg-outline-variant" />

        {/* Error code */}
        <h2 className="font-mono text-title-md font-bold tracking-label text-primary uppercase">
          SYSTEM_PATH_NOT_DEFINED
        </h2>

        {/* Description */}
        <p className="max-w-sm text-center font-body text-body-md text-primary-container">
          The requested structural asset could not be located within the current architectural
          configuration. The node may have been decommissioned or relocated.
        </p>

        {/* Actions */}
        <div className="mt-04 flex items-center gap-04">
          <Link
            href="/"
            className={cn(
              "px-08 py-04 font-mono text-label-sm tracking-label",
              "bg-primary text-on-primary",
              "duration-base transition-colors hover:bg-primary-container",
            )}
          >
            REINITIALIZE_SEQUENCE
          </Link>

          <RollbackButton />
        </div>
      </div>

      {/* ── Bottom metadata ── */}
      <div className="mt-auto grid w-full max-w-screen-xl grid-cols-4 gap-8 border-t border-outline-variant pt-6">
        <MetaCol label="NODE_ID" value="ARCH-00-404-X" />
        <MetaCol label="PROTOCOL" value="MONOLITH_OS_V2" />
        <MetaCol label="LOCAL_TIME" value={<LiveClock />} />
        <MetaCol label="ENVIRONMENT" value="PRODUCTION_ENV" />
      </div>
    </main>
  );
}
