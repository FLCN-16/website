interface AuthorBioProps {
  name: string
  role: string
  description: string
  socials: Array<{ platform: string; url: string; label: string }>
}

export function AuthorBio({ name, role, description, socials }: AuthorBioProps) {
  return (
    <div className="mt-12 pt-8 border-t border-border">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
        About the author
      </p>

      <div className="border border-border p-5 sm:p-6 flex flex-col gap-3">
        {/* Name + role */}
        <div className="flex flex-col gap-0.5">
          <span className="font-sans text-base font-bold text-foreground leading-tight">
            {name}
          </span>
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            {role}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

        {/* Social links */}
        {socials.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-1">
            {socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {social.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
