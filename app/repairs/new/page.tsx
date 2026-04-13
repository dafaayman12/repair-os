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
          className="rounded-lg border border-blue-300/20 bg-[#112349] px-4 py-2 text-sm text-blue-100/80 transition hover:border-blue-300/45 hover:bg-[#173469]"
        >
          Back to Repairs
        </Link>
      }
      toolbar={
        <>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-100/70">
            Ticket Creation
          </p>
          <div className="rounded-lg border border-blue-300/20 bg-[#112349] px-3 py-1.5 text-xs text-blue-100/65">
            Multi-step Intake
          </div>
        </>
      }
    >
      <div className="mx-auto mb-4 max-w-4xl rounded-xl border border-blue-300/25 bg-[#112349] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          {["Customer", "Device", "Details", "Confirm"].map((step, i) => (
            <span
              key={step}
              className={`rounded-full border px-3 py-1 text-xs ${
                i === 0
                  ? "border-blue-300/45 bg-blue-500/20 text-blue-100"
                  : "border-blue-300/20 bg-[#0b1731] text-blue-100/65"
              }`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      <form
        action={createRepair}
        className="mx-auto max-w-4xl space-y-5 rounded-xl border border-blue-300/25 bg-[#112349] p-5 shadow-[0_0_40px_rgba(37,99,235,0.12)]"
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

        <section className="border-t border-blue-300/20 pt-5">
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

        <section className="border-t border-blue-300/20 pt-5">
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

        <div className="flex gap-3 border-t border-blue-300/20 pt-5">
          <button
            type="submit"
            className="rounded-lg border border-blue-300/40 bg-blue-500/20 px-5 py-2.5 text-sm font-medium text-blue-100 transition hover:bg-blue-500/30"
          >
            Save Repair
          </button>

          <Link
            href="/repairs"
            className="rounded-lg border border-blue-300/20 px-5 py-2.5 text-sm text-blue-100/75 transition hover:border-blue-300/45 hover:bg-[#0b1731]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </AppShell>
  );
}
