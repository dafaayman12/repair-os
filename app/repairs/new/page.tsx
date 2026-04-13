import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { createRepair } from "../actions";

export default function NewRepairPage() {
  return (
    <AppShell
      section="Repair Workflow"
      title="New Repair"
      description="Create a new ticket with customer, device, and issue details."
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
            Ticket Creation
          </p>
          <div className="rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-400">
            Intake Form
          </div>
        </>
      }
    >
      <form
        action={createRepair}
        className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-7 shadow-[0_0_60px_rgba(251,146,60,0.08)]"
      >
        <section>
          <h2 className="text-lg font-medium text-white">Customer</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Customer Name
              </label>
              <input
                name="customerName"
                required
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Reda"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Phone Number
              </label>
              <input
                name="customerPhone"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="06xxxxxxxx"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                WhatsApp
              </label>
              <input
                name="customerWhatsapp"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="06xxxxxxxx"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 pt-6">
          <h2 className="text-lg font-medium text-white">Device</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Brand</label>
              <input
                name="brand"
                required
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Apple"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Model</label>
              <input
                name="model"
                required
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="iPhone 11"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">IMEI</label>
              <input
                name="imei"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Serial Number
              </label>
              <input
                name="serialNumber"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Color</label>
              <input
                name="color"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Black"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 pt-6">
          <h2 className="text-lg font-medium text-white">Repair Details</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-zinc-300">Issue</label>
              <input
                name="issue"
                required
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
                placeholder="Screen broken"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-zinc-300">Diagnosis</label>
              <textarea
                name="diagnosis"
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
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
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
              />
            </div>
          </div>
        </section>

        <div className="flex gap-3 border-t border-white/10 pt-6">
          <button
            type="submit"
            className="rounded-xl border border-amber-200/35 bg-amber-300/10 px-5 py-3 text-sm font-medium text-amber-100 transition hover:bg-amber-300/20"
          >
            Save Repair
          </button>

          <Link
            href="/repairs"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Cancel
          </Link>
        </div>
      </form>
    </AppShell>
  );
}
