import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { Boxes, ClipboardList, DollarSign, Eye } from "lucide-react";
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
          className="rounded-lg border border-blue-300/20 bg-[#112349] px-4 py-2 text-sm text-blue-100/80 transition hover:border-blue-300/45 hover:bg-[#173469]"
        >
          Back to Inventory
        </Link>
      }
      toolbar={
        <>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-100/70">
            Inventory Intake
          </p>
          <div className="rounded-lg border border-blue-300/20 bg-[#112349] px-3 py-1.5 text-xs text-blue-100/65">
            Modal-style Form
          </div>
        </>
      }
    >
      <div className="mx-auto mb-4 max-w-4xl rounded-xl border border-blue-300/25 bg-[#112349] px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Basic", icon: ClipboardList },
            { label: "Classification", icon: Boxes },
            { label: "Pricing", icon: DollarSign },
            { label: "Review", icon: Eye },
          ].map((step, i) => (
            <span
              key={step.label}
              className={`rounded-full border px-3 py-1 text-xs ${
                i === 0
                  ? "border-blue-300/45 bg-blue-500/20 text-blue-100"
                  : "border-blue-300/20 bg-[#0b1731] text-blue-100/65"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <step.icon size={12} />
                {step.label}
              </span>
            </span>
          ))}
        </div>
      </div>

      <form
        action={createInventoryItem}
        className="mx-auto max-w-4xl space-y-5 rounded-xl border border-blue-300/25 bg-[#112349] p-5 shadow-[0_0_40px_rgba(37,99,235,0.12)]"
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

        <section className="border-t border-blue-300/20 pt-5">
          <label className="mb-2 block text-sm text-zinc-300">Notes</label>
          <textarea
            name="notes"
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
            placeholder="Extra details..."
          />
        </section>

        <div className="flex gap-3 border-t border-blue-300/20 pt-5">
          <button
            type="submit"
            className="rounded-lg border border-blue-300/40 bg-blue-500/20 px-5 py-2.5 text-sm font-medium text-blue-100 transition hover:bg-blue-500/30"
          >
            Save Item
          </button>

          <Link
            href="/inventory"
            className="rounded-lg border border-blue-300/20 px-5 py-2.5 text-sm text-blue-100/75 transition hover:border-blue-300/45 hover:bg-[#0b1731]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </AppShell>
  );
}
