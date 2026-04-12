import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function InventoryPage() {
  const items = await prisma.inventoryItem.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      supplier: true,
    },
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Stock Management
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Inventory
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
              href="/inventory/new"
              className="rounded-lg border border-zinc-700 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white"
            >
              Add Item
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
          <div className="border-b border-zinc-800 px-6 py-4">
            <h2 className="text-lg font-medium text-white">All Items</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Screens, batteries, screws, flex cables, and consumables.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="px-6 py-10 text-sm text-zinc-400">
              No inventory items yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950/70 text-zinc-400">
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
                      className="border-t border-zinc-800 text-zinc-200"
                    >
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">{item.category}</td>
                      <td className="px-6 py-4">{item.quantityInStock}</td>
                      <td className="px-6 py-4">{item.buyPrice}</td>
                      <td className="px-6 py-4">
                        {item.supplier?.name ?? "—"}
                      </td>
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