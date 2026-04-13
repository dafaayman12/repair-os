import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";

type PageProps = {
  params: Promise<{ id: string }>;
};

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
    <AppShell
      section="Customer History"
      title={customer.fullName}
      description="Review customer profile, contact channels, and full repair timeline."
      actions={
        <Link
          href="/repairs"
          className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 transition hover:border-amber-200/35 hover:bg-zinc-900"
        >
          Back to Repairs
        </Link>
      }
      toolbar={
        <>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Customer Overview
          </p>
          <div className="rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-400">
            {customer.repairs.length} Repairs Logged
          </div>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 xl:col-span-1">
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

        <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 xl:col-span-2">
          <h2 className="text-lg font-medium text-white">Repair History</h2>

          {customer.repairs.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-400">No repairs found.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                  <tr className="border-b border-white/10">
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
                      className="border-b border-white/10 text-zinc-200 transition hover:bg-white/[0.02]"
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
                          className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide ${getStatusBadgeClass(
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
    </AppShell>
  );
}
