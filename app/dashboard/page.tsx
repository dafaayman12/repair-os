import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { Activity, CircleDollarSign, Clock3, Users, Wrench } from "lucide-react";

const workflow = [
  { label: "New", key: "NEW", hint: "Recently created tickets" },
  { label: "Diagnosing", key: "DIAGNOSING", hint: "In technical review" },
  { label: "Waiting Part", key: "WAITING_PART", hint: "Pending parts arrival" },
  { label: "Ready", key: "READY", hint: "Ready for pickup" },
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
      take: 6,
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

  const cards = [
    {
      title: "Open Repairs",
      value: String(openRepairs),
      hint: openRepairs === 0 ? "No repairs yet" : "Active repair tickets",
    },
    {
      title: "Waiting Parts",
      value: String(waitingParts),
      hint: waitingParts === 0 ? "Nothing pending" : "Pending part arrivals",
    },
    {
      title: "Low Stock Items",
      value: String(lowStockItems.length),
      hint:
        lowStockItems.length === 0 ? "Inventory healthy" : "Needs restocking",
    },
    {
      title: "Today Revenue",
      value: `${todayRevenueResult._sum.totalPrice ?? 0} DH`,
      hint: "From repairs closed today",
    },
  ];

  return (
    <AppShell
      section="Operations"
      title="Dashboard"
      description="Track the most important daily signals across your repair business."
      actions={
        <>
          <Link
            href="/repairs"
            className="rounded-lg border border-blue-300/25 bg-[#112349] px-4 py-2 text-sm text-blue-100 transition hover:border-blue-300/50 hover:bg-[#173469]"
          >
            Repairs
          </Link>
          <Link
            href="/inventory"
            className="rounded-lg border border-blue-300/40 bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-blue-500/30"
          >
            Inventory
          </Link>
        </>
      }
      toolbar={
        <>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <p className="text-xs uppercase tracking-[0.2em] text-blue-100/70">
              Daily Command Center
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-lg border border-blue-300/20 bg-[#112349] px-3 py-1.5 text-xs text-blue-100/70">
              Today
            </div>
            <div className="rounded-lg border border-blue-300/20 bg-[#112349] px-3 py-1.5 text-xs text-blue-100/70">
              Repairs + Inventory
            </div>
          </div>
        </>
      }
    >
      <div className="space-y-6">
        <section className="flex flex-wrap gap-2">
          {[
            { label: "Overview", icon: Activity },
            { label: "Queue", icon: Wrench },
            { label: "Customers", icon: Users },
            { label: "Revenue", icon: CircleDollarSign },
          ].map((tab, index) => (
            <span
              key={tab.label}
              className={`rounded-lg border px-3 py-1.5 text-xs ${
                index === 0
                  ? "border-blue-300/45 bg-blue-500/20 text-blue-100"
                  : "border-blue-300/20 bg-[#112349] text-blue-100/70"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <tab.icon size={12} />
                {tab.label}
              </span>
            </span>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-blue-300/20 bg-[#112349] p-5 shadow-[0_0_35px_rgba(37,99,235,0.12)]"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-blue-100/55">
                {card.title}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {card.value}
              </p>
              <p className="mt-2 text-sm text-blue-100/55">{card.hint}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-blue-300/20 bg-[#112349] xl:col-span-2">
            <div className="border-b border-blue-300/20 px-5 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-100/55">
                Recent Repairs
              </p>
              <h2 className="mt-2 text-lg font-medium text-white">
                Latest ticket activity
              </h2>
            </div>
            {recentRepairs.length === 0 ? (
              <div className="px-6 py-10 text-sm text-zinc-400">
                No recent repairs yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0b1731] text-xs uppercase tracking-[0.14em] text-blue-100/55">
                    <tr>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      <th className="px-6 py-4 font-medium">Device</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRepairs.map((repair) => (
                      <tr
                        key={repair.id}
                        className="border-t border-blue-300/20 text-zinc-200 transition hover:bg-blue-500/5"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/repairs/${repair.id}`}
                            className="text-white underline-offset-4 hover:underline"
                          >
                            {repair.customer.fullName}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          {repair.device.brand} {repair.device.model}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1">
                            <Clock3 size={12} className="text-blue-200/60" />
                            {repair.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{repair.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-blue-300/20 bg-[#112349] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-100/55">
              Low Stock Watch
            </p>
            <h2 className="mt-2 text-lg font-medium text-white">
              Parts to monitor
            </h2>
            {lowStockItems.length === 0 ? (
              <div className="mt-5 rounded-lg border border-blue-300/20 bg-[#0b1731] px-4 py-3 text-sm text-blue-100/60">
                No low-stock items right now.
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {lowStockItems.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-blue-300/20 bg-[#0b1731] px-4 py-3"
                  >
                    <p className="text-sm text-white">{item.name}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {item.category} · Stock {item.quantityInStock} / Min{" "}
                      {item.minStock}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-blue-300/25 bg-[#112349] p-5 shadow-[0_0_50px_rgba(37,99,235,0.15)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-100/65">
                Workflow Pipeline
              </p>
              <h2 className="mt-2 text-lg font-medium text-white">
                Repair stage distribution
              </h2>
            </div>
            <Link
              href="/repairs"
              className="rounded-lg border border-blue-300/45 bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-blue-500/30"
            >
              Open Repairs Board
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-blue-300/20 bg-[#0b1731] p-4"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {pipelineCounts[item.key] ?? 0}
                </p>
                <p className="mt-1 text-xs text-blue-100/50">{item.hint}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
