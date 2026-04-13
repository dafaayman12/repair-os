import Link from "next/link";
import { AppShell } from "@/components/app-shell";

const routes = [
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Overview of repairs, stock, and activity.",
  },
  {
    href: "/repairs",
    title: "Repairs",
    description: "Track repair tickets, status, and totals.",
  },
  {
    href: "/inventory",
    title: "Inventory",
    description: "Track screens, batteries, screws, and parts.",
  },
  {
    href: "/customers",
    title: "Customers",
    description: "Browse customer contacts and repair history.",
  },
];

export default function HomePage() {
  return (
    <AppShell
      section="Workspace"
      title="Welcome to RepairOS"
      description="A modern local-first repair management system for repairs, inventory, customers, and purchases."
    >
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-amber-200/25 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-8 shadow-[0_0_60px_rgba(251,146,60,0.12)] xl:col-span-2">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">
            Luxury Tech Control Panel
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Manage your repair operation with calm precision.
          </h2>
          <p className="mt-4 max-w-3xl text-zinc-400">
            Navigate your core workflows from one premium workspace with clearer
            hierarchy, strong focus, and less visual noise.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 transition hover:-translate-y-0.5 hover:border-amber-200/35 hover:bg-zinc-900"
              >
                <div className="text-lg font-medium text-white">{route.title}</div>
                <div className="mt-2 text-sm text-zinc-400">{route.description}</div>
              </Link>
            ))}
          </div>
        </section>

        <aside className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Workflow Principles
          </p>
          <div className="mt-4 space-y-4 text-sm text-zinc-300">
            <div className="rounded-xl border border-white/10 bg-zinc-900/70 px-4 py-3">
              Start repairs quickly and keep statuses updated.
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900/70 px-4 py-3">
              Keep stock visible before opening urgent jobs.
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900/70 px-4 py-3">
              Maintain strong customer communication context.
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
