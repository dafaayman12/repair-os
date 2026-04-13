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
    <main className="min-h-screen bg-[#060f24] text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-[1700px]">
        <aside className="hidden w-64 shrink-0 border-r border-blue-300/20 bg-[#08142d] px-3 py-3 xl:block">
          <div className="rounded-xl border border-blue-300/30 bg-gradient-to-br from-blue-400/20 via-blue-300/10 to-transparent px-3 py-2.5 shadow-[0_0_18px_rgba(59,130,246,0.15)]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-blue-200/80">
              Service Desk
            </p>
            <p className="mt-1 text-lg font-semibold text-white">RepairOS</p>
          </div>

          <p className="mt-4 mb-2 px-1 text-[10px] uppercase tracking-[0.18em] text-blue-200/55">
            Navigation
          </p>
          <nav className="space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group block rounded-lg border border-blue-300/20 bg-[#0d1a36] px-3 py-2 text-sm text-blue-100/85 transition hover:border-blue-300/45 hover:bg-[#123061] hover:text-white"
              >
                <span className="inline-flex items-center gap-2">
                  <link.icon size={14} className="text-blue-200/75 transition group-hover:text-blue-200" />
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-5 rounded-lg border border-blue-300/20 bg-[#0d1a36] px-3 py-2 text-xs text-blue-100/65">
            <span className="inline-flex items-center gap-2">
              <Settings2 size={13} />
              Settings
            </span>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-blue-300/20 bg-[#08142d] px-4 py-3 lg:px-6">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-blue-200/60">
                  {section}
                </p>
                <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-white md:text-2xl">
                  {title}
                </h1>
                <p className="mt-0.5 text-xs text-blue-100/55">{description}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden rounded-md border border-blue-300/20 bg-[#0d1a36] px-2.5 py-1 text-[11px] text-blue-100/65 md:block">
                  Service Desk Live
                </div>
                {actions ? <div className="flex gap-2">{actions}</div> : null}
              </div>
            </div>
          </header>

          <section className="flex-1 px-4 py-4 lg:px-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-blue-300/20 bg-[#0d1a36] px-3 py-2">
              {toolbar ?? (
                <>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/60">
                    Main Workspace
                  </p>
                  <div className="rounded-md border border-blue-300/20 bg-[#112349] px-2.5 py-0.5 text-[11px] text-blue-100/65">
                    Operations
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
