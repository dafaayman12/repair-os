import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";

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
            className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 transition hover:border-amber-200/35 hover:bg-zinc-900"
          >
            Dashboard
          </Link>
          <Link
            href="/repairs/new"
            className="rounded-xl border border-amber-200/35 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-300/20"
          >
            New Repair
          </Link>
        </>
      }
    >
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-[0_0_60px_rgba(251,146,60,0.08)]">
        <div className="border-b border-white/10 px-6 py-5">
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
              <thead className="bg-zinc-950/80 text-xs uppercase tracking-[0.14em] text-zinc-500">
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
                    className="border-t border-white/10 text-zinc-200 transition hover:bg-white/[0.02]"
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
