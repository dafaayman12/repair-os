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
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 px-6 py-8 lg:block">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200/70">
              Repair Workspace
            </p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-white">
              RepairOS
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-2.5 text-sm text-zinc-200 transition hover:border-amber-200/30 hover:bg-zinc-800/80 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-white/10 bg-zinc-950/70 px-6 py-4 backdrop-blur lg:px-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                  {section}
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  {title}
                </h1>
                <p className="mt-2 text-sm text-zinc-400">{description}</p>
              </div>

              {actions ? <div className="flex gap-3">{actions}</div> : null}
            </div>
          </header>

          <section className="flex-1 px-6 py-8 lg:px-10">{children}</section>
        </div>
      </div>
    </main>
  );
}
