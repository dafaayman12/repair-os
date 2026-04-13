import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  Clock3,
  Package,
  ShieldAlert,
  Users,
  Wrench,
} from "lucide-react";

export default async function HomePage() {
  const [
    openRepairs,
    waitingParts,
    inventoryItems,
    customersCount,
    recentRepairs,
    inventoryCount,
  ] = await Promise.all([
    prisma.repair.count({
      where: {
        status: {
          not: "CLOSED",
        },
      },
    }),
    prisma.repair.count({
      where: {
        status: "WAITING_PART",
      },
    }),
    prisma.inventoryItem.findMany({
      select: {
        id: true,
        quantityInStock: true,
        minStock: true,
      },
    }),
    prisma.customer.count(),
    prisma.repair.findMany({
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: true,
        device: true,
      },
    }),
    prisma.inventoryItem.count(),
  ]);

  const lowStockItems = inventoryItems.filter(
    (item) => item.quantityInStock <= item.minStock
  ).length;

  const quickActions = [
    { label: "New Repair", href: "/repairs/new", icon: Wrench },
    { label: "Repairs", href: "/repairs", icon: Clock3 },
    { label: "Customers", href: "/customers", icon: Users },
    { label: "Inventory", href: "/inventory", icon: Package },
  ];

  const overview = [
    { label: "Open Repairs", value: openRepairs, icon: Wrench },
    { label: "Waiting Parts", value: waitingParts, icon: Clock3 },
    { label: "Low Stock", value: lowStockItems, icon: ShieldAlert },
    { label: "Customers", value: customersCount, icon: Users },
  ];

  return (
    <AppShell
      section="Workspace"
      title="Home"
      description="Service-desk home for repair intake, queue monitoring, and stock visibility."
    >
      <div className="space-y-3">
        <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="rounded-lg border border-blue-300/25 bg-[#112349] px-3 py-2.5 transition hover:border-blue-300/50 hover:bg-[#123061]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-100">
                  <action.icon size={12} className="text-blue-200/80" />
                  {action.label}
                </span>
                <ArrowRight size={12} className="text-blue-200/70" />
              </div>
            </Link>
          ))}
        </section>

        <section className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {overview.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-blue-300/25 bg-[#112349] px-3 py-2.5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.14em] text-blue-100/60">
                  {item.label}
                </p>
                <item.icon size={13} className="text-blue-200/70" />
              </div>
              <p className="mt-1 text-xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-3 xl:grid-cols-[1fr_1.4fr_0.9fr]">
          <div className="rounded-lg border border-blue-300/25 bg-[#112349] p-3">
            <h2 className="text-sm font-semibold text-white">Quick Navigation</h2>
            <div className="mt-2 space-y-1.5">
              <Link
                href="/dashboard"
                className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs text-blue-100/85 transition hover:border-blue-300/45 hover:bg-[#122a52]"
              >
                Operations Dashboard
                <ArrowRight size={12} className="text-blue-200/70" />
              </Link>
              <Link
                href="/repairs"
                className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs text-blue-100/85 transition hover:border-blue-300/45 hover:bg-[#122a52]"
              >
                Repair Queue
                <ArrowRight size={12} className="text-blue-200/70" />
              </Link>
              <Link
                href="/inventory"
                className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs text-blue-100/85 transition hover:border-blue-300/45 hover:bg-[#122a52]"
              >
                Inventory Board
                <ArrowRight size={12} className="text-blue-200/70" />
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-blue-300/25 bg-[#112349]">
            <div className="border-b border-blue-300/20 px-3 py-2">
              <h2 className="text-sm font-semibold text-white">Latest Activity</h2>
              <p className="text-[11px] text-blue-100/55">Recent repair tickets</p>
            </div>
            {recentRepairs.length === 0 ? (
              <div className="px-3 py-6 text-xs text-blue-100/55">No repairs yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b1731] uppercase tracking-[0.12em] text-blue-100/55">
                    <tr>
                      <th className="px-3 py-2 font-medium">Customer</th>
                      <th className="px-3 py-2 font-medium">Device</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRepairs.map((repair) => (
                      <tr key={repair.id} className="border-t border-blue-300/20 text-zinc-200">
                        <td className="px-3 py-2.5">
                          <Link
                            href={`/repairs/${repair.id}`}
                            className="text-white underline-offset-4 hover:underline"
                          >
                            {repair.customer.fullName}
                          </Link>
                        </td>
                        <td className="px-3 py-2.5">
                          {repair.device.brand} {repair.device.model}
                        </td>
                        <td className="px-3 py-2.5">{repair.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-blue-300/25 bg-[#112349] p-3">
            <h2 className="text-sm font-semibold text-white">Shop Stats</h2>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs">
                <span className="text-blue-100/75">Repairs in queue</span>
                <span className="font-semibold text-white">{openRepairs}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs">
                <span className="text-blue-100/75">Waiting parts</span>
                <span className="font-semibold text-white">{waitingParts}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs">
                <span className="text-blue-100/75">Inventory items</span>
                <span className="font-semibold text-white">{inventoryCount}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs">
                <span className="text-blue-100/75">Customers</span>
                <span className="font-semibold text-white">{customersCount}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
