import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import {
  Activity,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Package,
  Phone,
  ShieldAlert,
  Users,
  Wrench,
} from "lucide-react";

const workflow = [
  { label: "New", key: "NEW", hint: "Recently created" },
  { label: "Diagnosing", key: "DIAGNOSING", hint: "In review" },
  { label: "Waiting Part", key: "WAITING_PART", hint: "Part not arrived" },
  { label: "Ready", key: "READY", hint: "Pickup now" },
];

export default async function DashboardPage() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const [
    openRepairs,
    waitingParts,
    inventoryItems,
    todayRevenueResult,
    recentRepairs,
    pipelineCountsRaw,
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
        name: true,
        category: true,
        quantityInStock: true,
        minStock: true,
      },
      orderBy: {
        quantityInStock: "asc",
      },
    }),
    prisma.repair.aggregate({
      where: {
        status: "CLOSED",
        closedAt: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
      _sum: {
        totalPrice: true,
      },
    }),
    prisma.repair.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
      include: {
        customer: true,
        device: true,
      },
    }),
    prisma.repair.groupBy({
      by: ["status"],
      where: {
        status: {
          in: ["NEW", "DIAGNOSING", "WAITING_PART", "READY"],
        },
      },
      _count: {
        _all: true,
      },
    }),
  ]);

  const lowStockItems = inventoryItems.filter(
    (item) => item.quantityInStock <= item.minStock
  );

  const pipelineCounts = Object.fromEntries(
    pipelineCountsRaw.map((item) => [item.status, item._count._all])
  );

  const quickLinks = [
    { label: "Create Repair", href: "/repairs/new", icon: Wrench },
    { label: "Open Repairs", href: "/repairs", icon: Activity },
    { label: "Add Inventory", href: "/inventory/new", icon: Package },
    { label: "Customer List", href: "/customers", icon: Users },
  ];

  const stats = [
    {
      title: "Open",
      value: String(openRepairs),
      hint: "active tickets",
      icon: Wrench,
    },
    {
      title: "Waiting",
      value: String(waitingParts),
      hint: "need parts",
      icon: Clock3,
    },
    {
      title: "Low Stock",
      value: String(lowStockItems.length),
      hint: "restock now",
      icon: ShieldAlert,
    },
    {
      title: "Revenue Today",
      value: `${todayRevenueResult._sum.totalPrice ?? 0} DH`,
      hint: "closed jobs",
      icon: CircleDollarSign,
    },
  ];

  return (
    <AppShell
      section="Operations"
      title="Dashboard"
      description="Live service desk board with queue, pickups, and stock alerts."
      actions={
        <>
          <Link
            href="/repairs/new"
            className="rounded-md border border-blue-300/45 bg-blue-600/55 px-3 py-1.5 text-xs font-semibold text-blue-50 transition hover:bg-blue-600/75"
          >
            New Repair
          </Link>
          <Link
            href="/inventory/new"
            className="rounded-md border border-blue-300/30 bg-[#113264] px-3 py-1.5 text-xs font-medium text-blue-100 transition hover:border-blue-300/50 hover:bg-[#1a4280]"
          >
            Add Part
          </Link>
        </>
      }
      toolbar={
        <>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-300 shadow-[0_0_8px_rgba(59,130,246,0.85)]" />
            <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/70">
              Service Operations · Today
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-md border border-blue-300/25 bg-[#112349] px-2 py-0.5 text-[11px] text-blue-100/70">
              Queue + Pickups
            </span>
            <span className="rounded-md border border-blue-300/25 bg-[#112349] px-2 py-0.5 text-[11px] text-blue-100/70">
              Inventory Watch
            </span>
          </div>
        </>
      }
    >
      <div className="space-y-3">
        <section className="flex flex-wrap gap-1.5">
          {[
            { label: "Board", icon: Activity },
            { label: "Queue", icon: Wrench },
            { label: "Customers", icon: Users },
            { label: "Revenue", icon: CircleDollarSign },
          ].map((tab, index) => (
            <span
              key={tab.label}
              className={`rounded-md border px-2.5 py-1 text-[11px] ${
                index === 0
                  ? "border-blue-300/55 bg-blue-500/30 text-blue-100"
                  : "border-blue-300/20 bg-[#112349] text-blue-100/70"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <tab.icon size={11} />
                {tab.label}
              </span>
            </span>
          ))}
        </section>

        <section className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-blue-300/25 bg-[#112349] px-3 py-2.5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.14em] text-blue-100/60">
                  {item.title}
                </p>
                <item.icon size={13} className="text-blue-200/70" />
              </div>
              <p className="mt-1 text-xl font-semibold text-white">{item.value}</p>
              <p className="text-[11px] text-blue-100/55">{item.hint}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-3 xl:grid-cols-[1.05fr_1.2fr_0.9fr]">
          <div className="space-y-3">
            <div className="rounded-lg border border-blue-300/25 bg-[#112349] p-3">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Quick Navigation</h2>
                <Link
                  href="/dashboard"
                  className="text-[11px] text-blue-200/70 hover:text-blue-100"
                >
                  refresh
                </Link>
              </div>
              <div className="grid gap-1.5">
                {quickLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs text-blue-100/85 transition hover:border-blue-300/45 hover:bg-[#122a52]"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <item.icon size={12} className="text-blue-200/75" />
                      {item.label}
                    </span>
                    <ChevronRight size={12} className="text-blue-200/65" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-blue-300/25 bg-[#112349] p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-blue-100/55">
                Workflow Queue
              </p>
              <div className="mt-2 grid gap-1.5">
                {workflow.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2"
                  >
                    <div>
                      <p className="text-xs text-white">{item.label}</p>
                      <p className="text-[11px] text-blue-100/50">{item.hint}</p>
                    </div>
                    <span className="rounded-md border border-blue-300/30 bg-[#123061] px-2 py-0.5 text-xs font-medium text-blue-100">
                      {pipelineCounts[item.key] ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-blue-300/25 bg-[#112349]">
            <div className="flex items-center justify-between border-b border-blue-300/20 px-3 py-2.5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-blue-100/55">
                  Ready & Appointments
                </p>
                <h2 className="text-sm font-semibold text-white">Front Desk Board</h2>
              </div>
              <Link
                href="/repairs"
                className="rounded-md border border-blue-300/30 bg-[#113264] px-2.5 py-1 text-[11px] font-medium text-blue-100 hover:bg-[#1a4280]"
              >
                Open Board
              </Link>
            </div>

            {recentRepairs.length === 0 ? (
              <div className="px-3 py-8 text-sm text-blue-100/55">No repair activity yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b1731] uppercase tracking-[0.12em] text-blue-100/55">
                    <tr>
                      <th className="px-3 py-2 font-medium">Customer</th>
                      <th className="px-3 py-2 font-medium">Device</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRepairs.map((repair) => (
                      <tr
                        key={repair.id}
                        className="border-t border-blue-300/20 text-zinc-200 transition hover:bg-blue-500/10"
                      >
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
                        <td className="px-3 py-2.5">
                          <span className="inline-flex items-center gap-1 rounded-md border border-blue-300/30 bg-[#123061] px-1.5 py-0.5 text-[11px] text-blue-100">
                            <Clock3 size={10} />
                            {repair.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="inline-flex items-center gap-1 text-blue-100/75">
                            <Phone size={10} />
                            Call
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-blue-300/25 bg-[#112349] p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-blue-100/55">
                Shop Stats
              </p>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-blue-100/75">
                    <CalendarDays size={11} /> Today Jobs
                  </span>
                  <span className="font-semibold text-white">{recentRepairs.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-blue-100/75">
                    <Wrench size={11} /> Active Queue
                  </span>
                  <span className="font-semibold text-white">{openRepairs}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-blue-100/75">
                    <Package size={11} /> Inventory Items
                  </span>
                  <span className="font-semibold text-white">{inventoryItems.length}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-300/25 bg-[#112349] p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-blue-100/55">
                Low Stock Watch
              </p>
              {lowStockItems.length === 0 ? (
                <div className="mt-2 rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs text-blue-100/60">
                  No low-stock items right now.
                </div>
              ) : (
                <div className="mt-2 space-y-1.5">
                  {lowStockItems.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2"
                    >
                      <p className="text-xs text-white">{item.name}</p>
                      <p className="text-[11px] text-blue-100/50">
                        {item.category} · {item.quantityInStock}/{item.minStock}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
