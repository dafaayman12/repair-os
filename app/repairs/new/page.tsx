import Link from "next/link";
import { createRepair } from "../actions";

export default function NewRepairPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Repair Workflow
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              New Repair
            </h1>
          </div>

          <Link
            href="/repairs"
            className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            Back to Repairs
          </Link>
        </div>

        <form
          action={createRepair}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-medium text-white">Customer</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Customer Name
              </label>
              <input
                name="customerName"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Reda"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Phone Number
              </label>
              <input
                name="customerPhone"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="06xxxxxxxx"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                WhatsApp
              </label>
              <input
                name="customerWhatsapp"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="06xxxxxxxx"
              />
            </div>
          </div>

          <div className="mb-6 mt-8">
            <h2 className="text-lg font-medium text-white">Device</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Brand</label>
              <input
                name="brand"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Apple"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Model</label>
              <input
                name="model"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="iPhone 11"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">IMEI</label>
              <input
                name="imei"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Serial Number
              </label>
              <input
                name="serialNumber"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Color</label>
              <input
                name="color"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Black"
              />
            </div>
          </div>

          <div className="mb-6 mt-8">
            <h2 className="text-lg font-medium text-white">Repair Details</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-zinc-300">Issue</label>
              <input
                name="issue"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Screen broken"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-zinc-300">
                Diagnosis
              </label>
              <textarea
                name="diagnosis"
                rows={4}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Display damaged after impact"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Labor Price
              </label>
              <input
                name="laborPrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-xl bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-950 hover:bg-white"
            >
              Save Repair
            </button>

            <Link
              href="/repairs"
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