import Link from "next/link";
import { ReactNode } from "react";

type AppShellProps = {
  section: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/repairs", label: "Repairs" },
  { href: "/inventory", label: "Inventory" },
  { href: "/customers", label: "Customers" },
];

export function AppShell({
  section,
  title,
  description,
  actions,
  children,
}: AppShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute -left-24 top-28 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1700px]">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-zinc-950/80 px-6 py-8 backdrop-blur xl:block">
          <div className="rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-300/20 via-amber-300/5 to-transparent px-4 py-4 shadow-[0_0_25px_rgba(251,146,60,0.12)]">
            <p className="text-[11px] uppercase tracking-[0.26em] text-amber-200/70">
              Repair Workspace
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
              RepairOS
            </p>
          </div>

          <p className="mt-8 mb-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Navigation
          </p>
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group block rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300 transition hover:border-amber-200/30 hover:bg-zinc-800/80 hover:text-white"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 transition group-hover:bg-amber-300" />
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-white/10 bg-zinc-950/70 px-6 py-5 backdrop-blur lg:px-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                  {section}
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  {title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-zinc-400">{description}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-xs tracking-wide text-zinc-400 md:block">
                  Premium Control Surface
                </div>
                {actions ? <div className="flex gap-3">{actions}</div> : null}
              </div>
            </div>
          </header>

          <section className="flex-1 px-6 py-8 lg:px-10">{children}</section>
        </div>
      </div>
    </main>
  );
}
