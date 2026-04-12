import Link from "next/link";
import { prisma } from "@/lib/prisma";

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "NEW":
      return "border-zinc-700 bg-zinc-800 text-zinc-100";
    case "DIAGNOSING":
      return "border-blue-900 bg-blue-950 text-blue-200";
    case "WAITING_PART":
      return "border-amber-900 bg-amber-950 text-amber-200";
    case "IN_PROGRESS":
      return "border-cyan-900 bg-cyan-950 text-cyan-200";
    case "READY":
      return "border-emerald-900 bg-emerald-950 text-emerald-200";
    case "CLOSED":
      return "border-purple-900 bg-purple-950 text-purple-200";
    default:
      return "border-zinc-700 bg-zinc-800 text-zinc-100";
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
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Repair Workflow
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Repairs
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              Dashboard
            </Link>
            <Link
              href="/repairs/new"
              className="rounded-lg border border-zinc-700 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white"
            >
              New Repair
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
          <div className="border-b border-zinc-800 px-6 py-4">
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
                <thead className="bg-zinc-950/70 text-zinc-400">
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
                      className="border-t border-zinc-800 text-zinc-200"
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