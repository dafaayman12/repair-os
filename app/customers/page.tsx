import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      phone: true,
      whatsapp: true,
      _count: {
        select: {
          repairs: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Customer Directory
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Customers
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
              href="/repairs"
              className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              Repairs
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
          <div className="border-b border-zinc-800 px-6 py-4">
            <h2 className="text-lg font-medium text-white">All Customers</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Contact details and repair history counts.
            </p>
          </div>

          {customers.length === 0 ? (
            <div className="px-6 py-10 text-sm text-zinc-400">
              No customers yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950/70 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Full Name</th>
                    <th className="px-6 py-4 font-medium">Phone</th>
                    <th className="px-6 py-4 font-medium">WhatsApp</th>
                    <th className="px-6 py-4 font-medium">Repairs</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-t border-zinc-800 text-zinc-200"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="text-white underline-offset-4 hover:underline"
                        >
                          {customer.fullName}
                        </Link>
                      </td>
                      <td className="px-6 py-4">{customer.phone ?? "—"}</td>
                      <td className="px-6 py-4">{customer.whatsapp ?? "—"}</td>
                      <td className="px-6 py-4">{customer._count.repairs}</td>
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
