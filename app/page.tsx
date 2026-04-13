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
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 shadow-[0_0_60px_rgba(251,191,36,0.06)] md:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">
          Luxury Tech Control Panel
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Manage your shop with calm precision.
        </h2>
        <p className="mt-4 max-w-3xl text-zinc-400">
          Access every critical area from one place with a unified workspace
          built for speed and clarity.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
      </div>
    </AppShell>
  );
}
