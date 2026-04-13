import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";

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
    <AppShell
      section="Customer Directory"
      title="Customers"
      description="View relationships, contact channels, and service history at a glance."
      actions={
        <>
          <Link
            href="/dashboard"
            className="rounded-lg border border-blue-300/20 bg-[#112349] px-4 py-2 text-sm text-blue-100/80 transition hover:border-blue-300/45 hover:bg-[#173469]"
          >
            Dashboard
          </Link>
          <Link
            href="/repairs"
            className="rounded-lg border border-blue-300/20 bg-[#112349] px-4 py-2 text-sm text-blue-100/80 transition hover:border-blue-300/45 hover:bg-[#173469]"
          >
            Repairs
          </Link>
        </>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {["All Customers", "Insights"].map((tab, i) => (
          <span
            key={tab}
            className={`rounded-lg border px-3 py-1.5 text-xs ${
              i === 0
                ? "border-blue-300/45 bg-blue-500/20 text-blue-100"
                : "border-blue-300/20 bg-[#112349] text-blue-100/70"
            }`}
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="mb-4 grid gap-2 md:grid-cols-[1fr_auto]">
        <input
          placeholder="Search customers..."
          className="rounded-lg border border-blue-300/20 bg-[#0b1731] px-3 py-2 text-sm text-blue-100/80 outline-none placeholder:text-blue-100/40"
        />
        <button className="rounded-lg border border-blue-300/40 bg-blue-500/20 px-4 py-2 text-sm text-blue-100">
          Add Customer
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-blue-300/20 bg-[#112349] shadow-[0_0_50px_rgba(37,99,235,0.12)]">
        <div className="border-b border-blue-300/20 px-6 py-4">
          <h2 className="text-lg font-medium text-white">All Customers</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Contact details and repair history counts.
          </p>
        </div>

        {customers.length === 0 ? (
          <div className="px-6 py-10 text-sm text-zinc-400">No customers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0b1731] text-xs uppercase tracking-[0.14em] text-blue-100/55">
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
                    className="border-t border-blue-300/20 text-zinc-200 transition hover:bg-blue-500/5"
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
    </AppShell>
  );
}
