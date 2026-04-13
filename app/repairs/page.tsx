import Link from "next/link";
import { prisma } from "@/lib/prisma";

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "NEW":
      return "border-zinc-500/40 bg-zinc-800/70 text-zinc-100";
    case "DIAGNOSING":
      return "border-blue-500/30 bg-blue-950/70 text-blue-200";
    case "WAITING_PART":
      return "border-amber-500/30 bg-amber-950/70 text-amber-200";
    case "IN_PROGRESS":
      return "border-cyan-500/30 bg-cyan-950/70 text-cyan-200";
    case "READY":
      return "border-emerald-500/30 bg-emerald-950/70 text-emerald-200";
    case "CLOSED":
      return "border-purple-500/30 bg-purple-950/70 text-purple-200";
    default:
      return "border-zinc-500/40 bg-zinc-800/70 text-zinc-100";
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
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
              Repair Workflow
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Repairs
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
            >
              Dashboard
            </Link>
            <Link
              href="/repairs/new"
              className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/20"
            >
              New Repair
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="text-lg font-medium text-white">All Repairs</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Track tickets, customers, devices, and pricing.
            </p>
          </div>

          {repairs.length === 0 ? (
            <div className="px-6 py-10 text-sm text-zinc-400">
              No repairs yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950/80 text-zinc-400">
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
                      className="border-t border-white/10 text-zinc-200"
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
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
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
      </div>
    </main>
  );
}
