import Link from "next/link";
import { ReactNode } from "react";
import {
  BarChart3,
  Home,
  Package,
  Settings2,
  Users,
  Wrench,
} from "lucide-react";

type AppShellProps = {
  section: string;
  title: string;
  description: string;
  actions?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
};

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/repairs", label: "Repairs", icon: Wrench },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/customers", label: "Customers", icon: Users },
];

export function AppShell({
  section,
  title,
  description,
  actions,
  toolbar,
  children,
}: AppShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060f24] text-zinc-100">
      <div className="pointer-events-none absolute -left-24 top-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1700px]">
        <aside className="hidden w-72 shrink-0 border-r border-blue-400/20 bg-[#08142d] px-4 py-5 xl:block">
          <div className="rounded-2xl border border-blue-300/30 bg-gradient-to-br from-blue-400/20 via-blue-300/10 to-transparent px-4 py-4 shadow-[0_0_25px_rgba(59,130,246,0.18)]">
            <p className="text-[11px] uppercase tracking-[0.26em] text-blue-200/80">
              Repair Workspace
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
              RepairOS
            </p>
          </div>

          <p className="mt-6 mb-2 px-2 text-[10px] uppercase tracking-[0.2em] text-blue-200/50">
            Navigation
          </p>
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group block rounded-xl border border-blue-300/15 bg-[#0d1a36] px-4 py-2.5 text-sm text-blue-100/80 transition hover:border-blue-300/50 hover:bg-[#112349] hover:text-white"
              >
                <span className="inline-flex items-center gap-2">
                  <link.icon size={14} className="text-blue-200/65 transition group-hover:text-blue-200" />
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-xl border border-blue-300/15 bg-[#0d1a36] px-4 py-3 text-xs text-blue-100/60">
            <span className="inline-flex items-center gap-2">
              <Settings2 size={13} />
              Settings
            </span>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-blue-400/20 bg-[#08142d]/90 px-6 py-4 backdrop-blur lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-blue-200/55">
                  {section}
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-[28px]">
                  {title}
                </h1>
                <p className="mt-1 max-w-3xl text-sm text-blue-100/55">{description}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-lg border border-blue-300/20 bg-[#0d1a36] px-3 py-1.5 text-xs tracking-wide text-blue-100/60 md:block">
                  Service Desk
                </div>
                {actions ? <div className="flex gap-3">{actions}</div> : null}
              </div>
            </div>
          </header>

          <section className="flex-1 px-6 py-6 lg:px-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-300/20 bg-[#0d1a36] px-4 py-2.5">
              {toolbar ?? (
                <>
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-100/55">
                    Main Workspace
                  </p>
                  <div className="rounded-lg border border-blue-300/20 bg-[#112349] px-3 py-1 text-xs text-blue-100/60">
                    Live Surface
                  </div>
                </>
              )}
            </div>

            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
