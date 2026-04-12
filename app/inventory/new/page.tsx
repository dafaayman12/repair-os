import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createInventoryItem } from "../actions";

export default async function NewInventoryItemPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Stock Management
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Add Inventory Item
            </h1>
          </div>

          <Link
            href="/inventory"
            className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            Back to Inventory
          </Link>
        </div>

        <form
          action={createInventoryItem}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">SKU</label>
              <input
                name="sku"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="IP12-OLED-BLK"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Name</label>
              <input
                name="name"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="iPhone 12 OLED Screen"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Category</label>
              <input
                name="category"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Screen"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Compatible Models
              </label>
              <input
                name="compatibleModels"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="iPhone 12"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Stock</label>
              <input
                name="quantityInStock"
                type="number"
                min="0"
                defaultValue="0"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Minimum Stock</label>
              <input
                name="minStock"
                type="number"
                min="0"
                defaultValue="0"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Buy Price</label>
              <input
                name="buyPrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Sell Price</label>
              <input
                name="sellPrice"
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Supplier</label>
              <select
                name="supplierId"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                defaultValue=""
              >
                <option value="">No supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Location</label>
              <input
                name="location"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Shelf A3"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm text-zinc-300">Notes</label>
            <textarea
              name="notes"
              rows={4}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
              placeholder="Extra details..."
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-xl bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-950 hover:bg-white"
            >
              Save Item
            </button>

            <Link
              href="/inventory"
              className="rounded-xl border border-zinc-800 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}