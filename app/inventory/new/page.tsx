import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { createInventoryItem } from "../actions";

export default async function NewInventoryItemPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <AppShell
      section="Stock Management"
      title="Add Inventory Item"
      description="Register new stock with pricing, supplier, and storage details."
      actions={
        <Link
          href="/inventory"
          className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 transition hover:border-amber-200/35 hover:bg-zinc-900"
        >
          Back to Inventory
        </Link>
      }
      toolbar={
        <>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Inventory Intake
          </p>
          <div className="rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-400">
            Stock Form
          </div>
        </>
      }
    >
      <form
        action={createInventoryItem}
        className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-7 shadow-[0_0_60px_rgba(251,146,60,0.08)]"
      >
        <section>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">SKU</label>
              <input
                name="sku"
                required
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="IP12-OLED-BLK"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Name</label>
              <input
                name="name"
                required
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="iPhone 12 OLED Screen"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Category</label>
              <input
                name="category"
                required
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Screen"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Compatible Models
              </label>
              <input
                name="compatibleModels"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
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
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Minimum Stock</label>
              <input
                name="minStock"
                type="number"
                min="0"
                defaultValue="0"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
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
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Sell Price</label>
              <input
                name="sellPrice"
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Supplier</label>
              <select
                name="supplierId"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
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
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Shelf A3"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 pt-6">
          <label className="mb-2 block text-sm text-zinc-300">Notes</label>
          <textarea
            name="notes"
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
            placeholder="Extra details..."
          />
        </section>

        <div className="flex gap-3 border-t border-white/10 pt-6">
          <button
            type="submit"
            className="rounded-xl border border-amber-200/35 bg-amber-300/10 px-5 py-3 text-sm font-medium text-amber-100 transition hover:bg-amber-300/20"
          >
            Save Item
          </button>

          <Link
            href="/inventory"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Cancel
          </Link>
        </div>
      </form>
    </AppShell>
  );
}
