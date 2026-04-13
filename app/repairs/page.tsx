import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { AlertCircle, Search, SlidersHorizontal, Wrench } from "lucide-react";

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "NEW":
      return "border-zinc-500/40 bg-zinc-800/80 text-zinc-100";
    case "DIAGNOSING":
      return "border-blue-500/35 bg-blue-950/80 text-blue-200";
    case "WAITING_PART":
      return "border-amber-500/35 bg-amber-950/80 text-amber-200";
    case "IN_PROGRESS":
      return "border-cyan-500/35 bg-cyan-950/80 text-cyan-200";
    case "READY":
      return "border-emerald-500/35 bg-emerald-950/80 text-emerald-200";
    case "CLOSED":
      return "border-purple-500/35 bg-purple-950/80 text-purple-200";
    default:
      return "border-zinc-500/40 bg-zinc-800/80 text-zinc-100";
  }
}

export default async function RepairsPage() {
  const repairs = await prisma.repair.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      device: true,
    },
  });

  return (
    <AppShell
      section="Repair Workflow"
      title="Repairs"
      description="Track tickets, customers, devices, and repair progress in one workspace."
      actions={
        <>
          <Link
            href="/dashboard"
            className="rounded-lg border border-blue-300/20 bg-[#112349] px-4 py-2 text-sm text-blue-100/80 transition hover:border-blue-300/45 hover:bg-[#173469]"
          >
            Dashboard
          </Link>
          <Link
            href="/repairs/new"
            className="rounded-lg border border-blue-300/40 bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-blue-500/30"
          >
            New Repair
          </Link>
        </>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { label: "All Active", icon: Wrench },
          { label: "Work Queue", icon: SlidersHorizontal },
          { label: "Customer Waiting", icon: AlertCircle },
          { label: "Completed", icon: Wrench },
        ].map((tab, i) => (
            <span
              key={tab.label}
              className={`rounded-lg border px-3 py-1.5 text-xs ${
                i === 0
                  ? "border-blue-300/45 bg-blue-500/20 text-blue-100"
                  : "border-blue-300/20 bg-[#112349] text-blue-100/70"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <tab.icon size={12} />
                {tab.label}
              </span>
            </span>
          )
        )}
      </div>

      <div className="mb-4 grid gap-2 lg:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-3 top-2.5 text-blue-100/45" />
          <input
            placeholder="Search orders..."
            className="w-full rounded-lg border border-blue-300/20 bg-[#0b1731] px-9 py-2 text-sm text-blue-100/80 outline-none placeholder:text-blue-100/40"
          />
        </div>
        <select className="rounded-lg border border-blue-300/20 bg-[#0b1731] px-3 py-2 text-sm text-blue-100/75 outline-none">
          <option>All Priorities</option>
        </select>
        <select className="rounded-lg border border-blue-300/20 bg-[#0b1731] px-3 py-2 text-sm text-blue-100/75 outline-none">
          <option>All Services</option>
        </select>
        <div className="rounded-lg border border-blue-300/20 bg-[#112349] px-3 py-2 text-sm text-blue-100/65">
          {repairs.length} in queue
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-blue-300/20 bg-[#112349] shadow-[0_0_50px_rgba(37,99,235,0.12)]">
        <div className="border-b border-blue-300/20 px-6 py-4">
          <h2 className="text-lg font-medium text-white">All Repairs</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Prioritize jobs quickly with cleaner status visibility.
          </p>
        </div>

        {repairs.length === 0 ? (
          <div className="px-6 py-10 text-sm text-zinc-400">No repairs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0b1731] text-xs uppercase tracking-[0.14em] text-blue-100/55">
                <tr>
                  <th className="px-6 py-4 font-medium">Repair No</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Device</th>
                  <th className="px-6 py-4 font-medium">Issue</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {repairs.map((repair) => (
                  <tr
                    key={repair.id}
                    className="border-t border-blue-300/20 text-zinc-200 transition hover:bg-blue-500/5"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/repairs/${repair.id}`}
                        className="text-white underline-offset-4 hover:underline"
                      >
                        {repair.repairNumber}
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        href={`/customers/${repair.customer.id}`}
                        className="text-white underline-offset-4 hover:underline"
                      >
                        {repair.customer.fullName}
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      {repair.device.brand} {repair.device.model}
                    </td>

                    <td className="px-6 py-4">{repair.issue}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide ${getStatusBadgeClass(
                          repair.status
                        )}`}
                      >
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
    </AppShell>
  );
}
