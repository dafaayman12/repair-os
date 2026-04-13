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
            className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 transition hover:border-amber-200/35 hover:bg-zinc-900"
          >
            Dashboard
          </Link>
          <Link
            href="/inventory/new"
            className="rounded-xl border border-amber-200/35 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-300/20"
          >
            Add Item
          </Link>
        </>
      }
    >
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-[0_0_60px_rgba(251,191,36,0.04)]">
        <div className="border-b border-white/10 px-6 py-4">
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
              <thead className="bg-zinc-950/80 text-zinc-400">
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
                  <tr key={item.id} className="border-t border-white/10 text-zinc-200">
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
