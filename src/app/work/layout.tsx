export default function WorkLayout({
  children,
  sidebar,
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  return (
    <section className="w-full bg-surface">
      <div className="mx-auto max-w-screen-xl border-outline-variant lg:border-x">
        <div className="work-shell">
          {children}
          {sidebar}
        </div>
      </div>
    </section>
  );
}
