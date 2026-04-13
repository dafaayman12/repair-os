import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { DashboardWorkspace } from "./dashboard-workspace";

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
    { label: "Create Repair", href: "/repairs/new" },
    { label: "Open Repairs", href: "/repairs" },
    { label: "Add Inventory", href: "/inventory/new" },
    { label: "Customer List", href: "/customers" },
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
      <DashboardWorkspace
        openRepairs={openRepairs}
        waitingParts={waitingParts}
        revenueToday={todayRevenueResult._sum.totalPrice ?? 0}
        inventoryCount={inventoryItems.length}
        recentRepairs={recentRepairs.map((repair) => ({
          id: repair.id,
          customerName: repair.customer.fullName,
          deviceLabel: `${repair.device.brand} ${repair.device.model}`,
          status: repair.status,
        }))}
        lowStockItems={lowStockItems}
        quickLinks={quickLinks}
        workflow={workflow}
        pipelineCounts={pipelineCounts}
      />
    </AppShell>
  );
}
