import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";

export default async function InventoryPage() {
  const items = await prisma.inventoryItem.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      supplier: true,
    },
  });

  return (
    <AppShell
      section="Stock Management"
      title="Inventory"
      description="Control stock levels, pricing, and supplier coverage with clarity."
      actions={
        <>
          <Link
            href="/dashboard"
            className="rounded-lg border border-blue-300/20 bg-[#112349] px-4 py-2 text-sm text-blue-100/80 transition hover:border-blue-300/45 hover:bg-[#173469]"
          >
            Dashboard
          </Link>
          <Link
            href="/inventory/new"
            className="rounded-lg border border-blue-300/40 bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-blue-500/30"
          >
            Add Item
          </Link>
        </>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {["All Categories", "Low Stock", "Out", "Archived"].map((tab, i) => (
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

      <div className="overflow-hidden rounded-2xl border border-blue-300/20 bg-[#112349] shadow-[0_0_50px_rgba(37,99,235,0.12)]">
        <div className="border-b border-blue-300/20 px-6 py-4">
          <h2 className="text-lg font-medium text-white">All Items</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Screens, batteries, screws, flex cables, and consumables.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="px-6 py-10 text-sm text-zinc-400">No inventory items yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0b1731] text-xs uppercase tracking-[0.14em] text-blue-100/55">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Buy Price</th>
                  <th className="px-6 py-4 font-medium">Supplier</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-blue-300/20 text-zinc-200 transition hover:bg-blue-500/5"
                  >
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td className="px-6 py-4">{item.quantityInStock}</td>
                    <td className="px-6 py-4">{item.buyPrice}</td>
                    <td className="px-6 py-4">{item.supplier?.name ?? "—"}</td>
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
