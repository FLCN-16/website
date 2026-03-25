import Link from "next/link";
import { cn } from "@/lib/utils";
import LiveClock from "@/components/LiveClock";
import RollbackButton from "@/components/RollbackButton";

/* ── Metadata column ── */

function MetaCol({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-01">
      <span className="font-mono text-label-sm tracking-label text-outline-variant">{label}</span>
      <span className="font-mono text-body-md font-medium text-primary">{value}</span>
    </div>
  );
}

/* ── Page ── */

export default function NotFound() {
  return (
    <main className="w-full min-h-[calc(100vh-114px)] bg-surface flex flex-col items-center justify-between px-8">
      {/* ── Center block ── */}
      <div className="flex flex-col items-center gap-6 my-auto">
        {/* Status label */}
        <p className="font-mono text-label-sm tracking-label text-outline-variant">STATUS: ERROR_NODE_404</p>

        {/* 404 */}
        <h1 className={cn("font-headline font-black text-primary tracking-tighter leading-none", "text-9xl")}>404</h1>

        {/* Divider */}
        <div className="w-16 h-px bg-outline-variant" />

        {/* Error code */}
        <h2 className="font-mono text-title-md font-bold text-primary tracking-label uppercase">
          SYSTEM_PATH_NOT_DEFINED
        </h2>

        {/* Description */}
        <p className="font-body text-body-md text-primary-container text-center max-w-sm">
          The requested structural asset could not be located within the current architectural configuration. The node
          may have been decommissioned or relocated.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-04 mt-04">
          <Link
            href="/"
            className={cn(
              "px-08 py-04 font-mono text-label-sm tracking-label",
              "bg-primary text-on-primary",
              "transition-colors duration-base hover:bg-primary-container",
            )}
          >
            REINITIALIZE_SEQUENCE
          </Link>

          <RollbackButton />
        </div>
      </div>

      {/* ── Bottom metadata ── */}
      <div className="w-full max-w-screen-xl border-t border-outline-variant pt-6 grid grid-cols-4 gap-8 mt-auto">
        <MetaCol label="NODE_ID" value="ARCH-00-404-X" />
        <MetaCol label="PROTOCOL" value="MONOLITH_OS_V2" />
        <MetaCol label="LOCAL_TIME" value={<LiveClock />} />
        <MetaCol label="ENVIRONMENT" value="PRODUCTION_ENV" />
      </div>
    </main>
  );
}
