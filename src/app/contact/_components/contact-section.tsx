import { cn } from "@/lib/utils";

import ContactForm from "./contact-form";

/* ── Sidebar icons ── */

function SignalIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.97741 9.5452C1.3601 8.92501 0.876203 8.20746 0.525722 7.39255C0.175241 6.57765 0 5.70433 0 4.7726C0 3.83798 0.175241 2.96322 0.525722 2.14832C0.876203 1.33341 1.3601 0.617308 1.97741 0L2.5125 0.535099C1.9625 1.0851 1.53125 1.7226 1.21875 2.4476C0.906255 3.1726 0.750005 3.9476 0.750005 4.7726C0.750005 5.6101 0.906255 6.39135 1.21875 7.11635C1.53125 7.84135 1.9625 8.4726 2.5125 9.0101L1.97741 9.5452ZM4.09616 7.42645C3.75385 7.08126 3.48558 6.68246 3.29135 6.23005C3.09712 5.77765 3 5.29183 3 4.7726C3 4.25048 3.09712 3.76322 3.29135 3.31082C3.48558 2.85841 3.75385 2.46106 4.09616 2.11875L4.63125 2.65385C4.35625 2.92885 4.14063 3.2476 3.98438 3.6101C3.82813 3.9726 3.75 4.3601 3.75 4.7726C3.75 5.1851 3.82813 5.5726 3.98438 5.9351C4.14063 6.2976 4.35625 6.61635 4.63125 6.89135L4.09616 7.42645ZM6.75 5.5226C6.54904 5.5226 6.3738 5.44784 6.22428 5.29832C6.07476 5.1488 6 4.97356 6 4.7726C6 4.57164 6.07476 4.39639 6.22428 4.24687C6.3738 4.09735 6.54904 4.02259 6.75 4.02259C6.95097 4.02259 7.12621 4.09735 7.27573 4.24687C7.42525 4.39639 7.50001 4.57164 7.50001 4.7726C7.50001 4.97356 7.42525 5.1488 7.27573 5.29832C7.12621 5.44784 6.95097 5.5226 6.75 5.5226ZM9.40385 7.42645L8.86875 6.89135C9.14375 6.61635 9.35938 6.2976 9.51563 5.9351C9.67188 5.5726 9.75 5.1851 9.75 4.7726C9.75 4.3601 9.67188 3.9726 9.51563 3.6101C9.35938 3.2476 9.14375 2.92885 8.86875 2.65385L9.40385 2.11875C9.74616 2.46106 10.0144 2.85841 10.2087 3.31082C10.4029 3.76322 10.5 4.25048 10.5 4.7726C10.5 5.29183 10.4029 5.77765 10.2087 6.23005C10.0144 6.68246 9.74616 7.08126 9.40385 7.42645ZM11.5226 9.5452L10.9875 9.0101C11.5375 8.4601 11.9688 7.8226 12.2813 7.0976C12.5938 6.3726 12.75 5.5976 12.75 4.7726C12.75 3.94471 12.5938 3.16827 12.2813 2.44327C11.9688 1.71827 11.5375 1.08221 10.9875 0.535099L11.5226 0C12.1399 0.617308 12.6238 1.33341 12.9743 2.14832C13.3248 2.96322 13.5 3.83798 13.5 4.7726C13.5 5.70433 13.3248 6.57765 12.9743 7.39255C12.6238 8.20746 12.1399 8.92501 11.5226 9.5452Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.4625 13.425V12.675C8.02597 12.5904 8.55457 12.4466 9.04832 12.2438C9.54207 12.0409 9.98847 11.7817 10.3875 11.4664L10.9125 12.0058C10.4115 12.401 9.87645 12.7127 9.30722 12.9411C8.73799 13.1695 8.12308 13.3308 7.4625 13.425ZM12.0058 10.9183L11.475 10.3875C11.8 9.975 12.0625 9.52188 12.2625 9.02813C12.4625 8.53438 12.6 8.0125 12.675 7.4625H13.4337C13.3625 8.09327 13.2055 8.69977 12.9627 9.28198C12.72 9.86419 12.401 10.4096 12.0058 10.9183ZM12.675 5.9625C12.6 5.4 12.4625 4.87188 12.2625 4.37813C12.0625 3.88438 11.8 3.4375 11.475 3.0375L12.0202 2.52116C12.4471 3.09039 12.7666 3.62596 12.9786 4.12789C13.1906 4.62981 13.3423 5.24135 13.4337 5.9625H12.675ZM5.9625 13.425C4.26154 13.2096 2.84255 12.4678 1.70553 11.1995C0.56851 9.93126 0 8.43558 0 6.7125C0 4.98654 0.566106 3.48702 1.69832 2.21394C2.83053 0.940866 4.25193 0.202885 5.9625 0V0.750005C4.4625 0.962505 3.21875 1.63125 2.23125 2.75625C1.24375 3.88125 0.750005 5.2 0.750005 6.7125C0.750005 8.225 1.24375 9.54063 2.23125 10.6594C3.21875 11.7781 4.4625 12.45 5.9625 12.675V13.425ZM10.425 1.9875C9.97501 1.65 9.50241 1.375 9.00722 1.1625C8.51202 0.950005 8.00673 0.812505 7.49135 0.750005V0C8.12308 0.0817306 8.72116 0.239183 9.28558 0.472356C9.85001 0.705529 10.3923 1.02115 10.9125 1.41923L10.425 1.9875ZM6.71683 9.72693C6.13606 9.2202 5.58702 8.68414 5.06971 8.11876C4.55241 7.55337 4.29375 6.88847 4.29375 6.12404C4.29375 5.4375 4.52668 4.85193 4.99255 4.36731C5.45842 3.88269 6.03318 3.64039 6.71683 3.64039C7.40049 3.64039 7.97525 3.88269 8.44111 4.36731C8.90698 4.85193 9.13991 5.4375 9.13991 6.12404C9.13991 6.88847 8.88126 7.55337 8.36395 8.11876C7.84664 8.68414 7.2976 9.2202 6.71683 9.72693ZM6.71683 6.69808C6.90337 6.69808 7.05794 6.63678 7.18053 6.51419C7.30313 6.39159 7.36443 6.23702 7.36443 6.05048C7.36443 5.86683 7.30313 5.71298 7.18053 5.58895C7.05794 5.46491 6.90337 5.40289 6.71683 5.40289C6.53029 5.40289 6.37573 5.46491 6.25313 5.58895C6.13053 5.71298 6.06923 5.86683 6.06923 6.05048C6.06923 6.23702 6.13053 6.39159 6.25313 6.51419C6.37573 6.63678 6.53029 6.69808 6.71683 6.69808Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ── Stat Row ── */

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-02">
      <div className="flex items-center gap-02 text-primary">
        {icon}
        <span className="font-space-grotesk text-label-sm tracking-label font-bold text-primary">{label}</span>
      </div>
      <p className="font-space-grotesk text-body-md text-primary-container pl-06">{value}</p>
    </div>
  );
}

/* ── Social Link ── */

function SocialLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-between px-04 py-04",
        "font-space-grotesk text-label-sm tracking-label text-dark-blue",
        "border border-dark-blue",
        "transition-colors duration-base hover:bg-dark-blue hover:text-surface",
      )}
    >
      {label}
      <span aria-hidden>↗</span>
    </a>
  );
}

/* ── Section ── */

export default function ContactSection() {
  return (
    <section className="w-full py-12">
      <div className="mx-auto max-w-screen-xl grid grid-cols-[1fr_28rem] bg-[#E8ECEF] border border-[#D1D9E0]">
        {/* ── Left — Form ── */}
        <div className="px-08 py-16">
          <ContactForm />
        </div>

        {/* ── Right — Sidebar ── */}
        <aside className="border-l border-light-blue/20 px-08 py-16 flex flex-col gap-10 bg-[#DFE4E9]">
          {/* NODE_STATS header */}
          <div className="flex items-center gap-02">
            <span className="text-primary text-label-sm">■</span>
            <span className="font-mono text-label-sm tracking-label text-nav-link">NODE_STATS</span>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-08">
            <StatRow
              icon={<SignalIcon />}
              label="AVAILABILITY"
              value={"2 / 2 Project Slots Filled for Q2. Waitlist open for Q3."}
            />
            <StatRow icon={<TargetIcon />} label="DEPLOYMENT_BASE" value="Punjab, India / Remote [UTC+5.5]" />
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-outline-variant" />

          {/* Comm link */}
          <div className="flex flex-col gap-02">
            <span className="font-mono text-label-sm tracking-label text-nav-link">COMM_LINK</span>
            <a
              href="mailto:work@thefalcon.dev"
              className="font-headline text-title-md font-bold text-dark-blue hover:opacity-70 transition-opacity duration-base break-all"
            >
              work@thefalcon.dev
            </a>
          </div>

          {/* Social index */}
          <div className="flex flex-col gap-04">
            <span className="font-mono text-label-sm tracking-label text-nav-link">SOCIAL_INDEX</span>
            <SocialLink label="LINKEDIN_PROTOCOLS" href="https://linkedin.com" />
            <SocialLink label="GITHUB_REPOSITORIES" href="https://github.com" />
          </div>

          {/* Metadata footer */}
          <div className="mt-auto flex items-center justify-between pt-08 border-t border-outline-variant">
            <span className="font-mono text-label-sm tracking-label text-nav-link">CHK_SUM: 8F2A9C</span>
            <span className="font-mono text-label-sm tracking-label text-nav-link">PAGE_OFFSET: 0X004</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
