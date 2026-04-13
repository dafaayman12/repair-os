import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import {
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Cog,
  Package,
  Users,
  Wrench,
  Zap,
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
    customersCount,
    todayRevenueResult,
    recentRepairs,
    readyCount,
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
    prisma.customer.count(),
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
    prisma.repair.count({
      where: {
        status: "READY",
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

  const kpis = [
    {
      label: "To Evaluate",
      value: waitingParts,
      hint: "awaiting diagnosis",
      tone: "bg-amber-300",
    },
    {
      label: "In Progress",
      value: openRepairs,
      hint: "being repaired",
      tone: "bg-blue-300",
    },
    {
      label: "Ready",
      value: readyCount,
      hint: "awaiting pickup",
      tone: "bg-emerald-300",
    },
    {
      label: "Active",
      value: recentRepairs.length,
      hint: "total in shop",
      tone: "bg-cyan-300",
    },
    {
      label: "Customers",
      value: customersCount,
      hint: "registered",
      tone: "bg-violet-300",
    },
  ];

  return (
    <AppShell
      fullWidth
      showToolbar={false}
      section="Operations"
      title="Dashboard"
      description="Repair shop overview"
      actions={
        <>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-blue-300/35 bg-blue-600/70 px-3 py-1.5 text-xs font-medium text-blue-50"
          >
            <Wrench size={12} /> Check-In
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-blue-300/35 bg-[#12366d] px-3 py-1.5 text-xs font-medium text-blue-100"
          >
            <Zap size={12} /> Quick Service
          </button>
          <button
            type="button"
            className="rounded-md border border-blue-300/35 bg-[#112349] p-1.5 text-blue-100"
            aria-label="Dashboard settings"
          >
            <Cog size={12} />
          </button>
        </>
      }
    >
      <div className="space-y-2">
        <section className="grid gap-2 xl:grid-cols-5">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-lg border border-blue-300/25 bg-[#101f40] px-3 py-2.5"
            >
              <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-blue-100/60">
                <span className={`h-1.5 w-1.5 rounded-full ${kpi.tone}`} />
                {kpi.label}
              </p>
              <p className="mt-1 text-3xl font-semibold leading-none text-white">{kpi.value}</p>
              <p className="mt-1 text-xs text-blue-100/55">{kpi.hint}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-2 xl:grid-cols-[1fr_1.45fr_1fr]">
          <div className="space-y-2">
            <div className="rounded-lg border border-blue-300/25 bg-[#101f40]">
              <div className="border-b border-blue-300/20 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100/70">
                  Quick Navigation
                </p>
              </div>
              <div className="space-y-1.5 px-3 py-2">
                {[
                  { label: "Repair Orders", href: "/repairs", icon: Wrench },
                  { label: "Customers", href: "/customers", icon: Users },
                  { label: "Inventory", href: "/inventory", icon: Package },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs text-blue-100/85"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <item.icon size={11} className="text-blue-200/75" />
                      {item.label}
                    </span>
                    <ChevronRight size={12} className="text-blue-200/65" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-blue-300/25 bg-[#101f40]">
              <div className="border-b border-blue-300/20 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100/70">
                  Workflow Queue
                </p>
              </div>
              <div className="space-y-1.5 px-3 py-2">
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

          <div className="space-y-2">
            <div className="rounded-lg border border-blue-300/25 bg-[#101f40]">
              <div className="flex items-center justify-between border-b border-blue-300/20 px-3 py-2">
                <h2 className="text-sm font-semibold text-blue-100">Ready for Pickup ({readyCount})</h2>
                <Link href="/repairs" className="text-xs text-blue-300 hover:text-blue-200">
                  View all
                </Link>
              </div>
              {recentRepairs.filter((repair) => repair.status === "READY").length === 0 ? (
                <div className="px-3 py-10 text-center text-sm text-blue-100/45">
                  Nothing ready yet
                </div>
              ) : (
                <div className="space-y-1.5 px-3 py-2">
                  {recentRepairs
                    .filter((repair) => repair.status === "READY")
                    .slice(0, 5)
                    .map((repair) => (
                      <Link
                        key={repair.id}
                        href={`/repairs/${repair.id}`}
                        className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs text-blue-100/85"
                      >
                        <span>{repair.customer.fullName}</span>
                        <span className="text-blue-100/60">
                          {repair.device.brand} {repair.device.model}
                        </span>
                      </Link>
                    ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-blue-300/25 bg-[#101f40]">
              <div className="flex items-center justify-between border-b border-blue-300/20 px-3 py-2">
                <h2 className="text-sm font-semibold text-blue-100">Today&apos;s Appointments (0)</h2>
                <Link href="/repairs" className="text-xs text-blue-300 hover:text-blue-200">
                  View all
                </Link>
              </div>
              <div className="px-3 py-10 text-center text-sm text-blue-100/45">
                No appointments today
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="rounded-lg border border-blue-300/25 bg-[#101f40]">
              <div className="border-b border-blue-300/20 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100/70">
                  Shop Stats
                </p>
              </div>
              <div className="space-y-1.5 px-3 py-2">
                <div className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-blue-100/75">
                    <Wrench size={11} /> Total Repairs
                  </span>
                  <span className="font-semibold text-white">{openRepairs}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-blue-100/75">
                    <CalendarDays size={11} /> Completed Today
                  </span>
                  <span className="font-semibold text-emerald-300">
                    {todayRevenueResult._sum.totalPrice ? 1 : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-blue-100/75">
                    <CircleDollarSign size={11} /> Week Revenue
                  </span>
                  <span className="font-semibold text-emerald-300">
                    ${todayRevenueResult._sum.totalPrice ?? 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-300/25 bg-[#101f40]">
              <div className="border-b border-blue-300/20 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100/70">
                  Low Stock Watch
                </p>
              </div>
              {lowStockItems.length === 0 ? (
                <p className="px-3 py-3 text-xs text-blue-100/50">No low-stock alerts.</p>
              ) : (
                <div className="space-y-1.5 px-3 py-2">
                  {lowStockItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2"
                    >
                      <p className="text-xs text-white">{item.name}</p>
                      <p className="text-[11px] text-blue-100/50">
                        {item.category} · Stock {item.quantityInStock}
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
