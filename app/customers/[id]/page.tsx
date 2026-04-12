import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

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

export default async function CustomerDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      devices: true,
      repairs: {
        include: {
          device: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Customer History
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              {customer.fullName}
            </h1>
          </div>

          <Link
            href="/repairs"
            className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            Back to Repairs
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 lg:col-span-1">
            <h2 className="text-lg font-medium text-white">Customer Info</h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm text-zinc-400">Full Name</p>
                <p className="mt-1 text-white">{customer.fullName}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-400">Phone</p>
                <p className="mt-1 text-white">{customer.phone ?? "—"}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-400">WhatsApp</p>
                <p className="mt-1 text-white">{customer.whatsapp ?? "—"}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-400">Devices</p>
                <p className="mt-1 text-white">{customer.devices.length}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-400">Total Repairs</p>
                <p className="mt-1 text-white">{customer.repairs.length}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 lg:col-span-2">
            <h2 className="text-lg font-medium text-white">Repair History</h2>

            {customer.repairs.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-400">No repairs found.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-zinc-400">
                    <tr className="border-b border-zinc-800">
                      <th className="py-3 font-medium">Repair No</th>
                      <th className="py-3 font-medium">Device</th>
                      <th className="py-3 font-medium">Issue</th>
                      <th className="py-3 font-medium">Status</th>
                      <th className="py-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.repairs.map((repair) => (
                      <tr
                        key={repair.id}
                        className="border-b border-zinc-800/70 text-zinc-200"
                      >
                        <td className="py-3">
                          <Link
                            href={`/repairs/${repair.id}`}
                            className="text-white underline-offset-4 hover:underline"
                          >
                            {repair.repairNumber}
                          </Link>
                        </td>
                        <td className="py-3">
                          {repair.device.brand} {repair.device.model}
                        </td>
                        <td className="py-3">{repair.issue}</td>
                        <td className="py-3">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
                              repair.status
                            )}`}
                          >
                            {repair.status}
                          </span>
                        </td>
                        <td className="py-3">{repair.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}