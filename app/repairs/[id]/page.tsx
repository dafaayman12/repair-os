import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import {
  addPartToRepair,
  removePartFromRepair,
  updateRepairDetails,
  updateRepairStatus,
} from "./actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "NEW":
      return "border-zinc-500/40 bg-zinc-800/80 text-zinc-100";
    case "DIAGNOSING":
      return "border-blue-500/35 bg-blue-950/80 text-blue-200";
    case "WAITING_PART":
      return "border-amber-500/35 bg-amber-950/80 text-amber-200";
    case "IN_PROGRESS":
      return "border-cyan-500/35 bg-cyan-950/80 text-cyan-200";
    case "READY":
      return "border-emerald-500/35 bg-emerald-950/80 text-emerald-200";
    case "CLOSED":
      return "border-purple-500/35 bg-purple-950/80 text-purple-200";
    default:
      return "border-zinc-500/40 bg-zinc-800/80 text-zinc-100";
  }
}

export default async function RepairDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const repair = await prisma.repair.findUnique({
    where: { id },
    include: {
      customer: true,
      device: true,
      partsUsed: {
        include: {
          inventoryItem: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!repair) {
    notFound();
  }

  const inventoryItems = await prisma.inventoryItem.findMany({
    where: {
      quantityInStock: {
        gt: 0,
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <AppShell
      section="Repair Workflow"
      title={repair.repairNumber}
      description="Monitor ticket details, pricing, status, and parts usage from one view."
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
            Repair Ticket
          </p>
          <div className="rounded-lg border border-blue-300/20 bg-[#112349] px-3 py-1.5 text-xs text-blue-100/65">
            {repair.status}
          </div>
        </>
      }
    >
      <div className="mb-4 grid gap-2 md:grid-cols-4">
        <div className="rounded-lg border border-blue-300/20 bg-[#112349] px-3 py-2 text-xs text-blue-100/75">
          Status: {repair.status}
        </div>
        <div className="rounded-lg border border-blue-300/20 bg-[#112349] px-3 py-2 text-xs text-blue-100/75">
          Priority: {repair.priority}
        </div>
        <div className="rounded-lg border border-blue-300/20 bg-[#112349] px-3 py-2 text-xs text-blue-100/75">
          Payment: {repair.paymentStatus}
        </div>
        <div className="rounded-lg border border-blue-300/20 bg-[#112349] px-3 py-2 text-xs text-blue-100/75">
          Total: {repair.totalPrice}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-blue-300/20 bg-[#112349] p-5 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Repair Details</h2>
            <span
              className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide ${getStatusBadgeClass(
                repair.status
              )}`}
            >
              {repair.status}
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-zinc-400">Customer</p>
              <p className="mt-1 text-white">{repair.customer.fullName}</p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Phone</p>
              <p className="mt-1 text-white">{repair.customer.phone ?? "—"}</p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Device</p>
              <p className="mt-1 text-white">
                {repair.device.brand} {repair.device.model}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Current Status</p>
              <p className="mt-1 text-white">{repair.status}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-zinc-400">Issue</p>
              <p className="mt-1 text-white">{repair.issue}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-zinc-400">Diagnosis</p>
              <p className="mt-1 text-white">{repair.diagnosis ?? "—"}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-blue-300/20 pt-5">
            <h3 className="text-sm font-medium text-white">Edit Repair</h3>

            <form action={updateRepairDetails} className="mt-4 grid gap-4">
              <input type="hidden" name="repairId" value={repair.id} />

              <div>
                <label className="mb-2 block text-sm text-zinc-300">Issue</label>
                <input
                  name="issue"
                  required
                  defaultValue={repair.issue}
                  className="w-full rounded-lg border border-blue-300/20 bg-[#0b1731] px-4 py-2.5 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Diagnosis
                </label>
                <textarea
                  name="diagnosis"
                  rows={4}
                  defaultValue={repair.diagnosis ?? ""}
                  className="w-full rounded-lg border border-blue-300/20 bg-[#0b1731] px-4 py-2.5 text-sm text-white outline-none"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Labor Price
                  </label>
                  <input
                    name="laborPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={repair.laborPrice}
                    className="w-full rounded-lg border border-blue-300/20 bg-[#0b1731] px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Payment Status
                  </label>
                  <select
                    name="paymentStatus"
                    defaultValue={repair.paymentStatus}
                    className="w-full rounded-lg border border-blue-300/20 bg-[#0b1731] px-4 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="UNPAID">UNPAID</option>
                    <option value="PARTIAL">PARTIAL</option>
                    <option value="PAID">PAID</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Priority
                  </label>
                  <select
                    name="priority"
                    defaultValue={repair.priority}
                    className="w-full rounded-lg border border-blue-300/20 bg-[#0b1731] px-4 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="rounded-lg border border-blue-300/40 bg-blue-500/20 px-5 py-2.5 text-sm font-medium text-blue-100 transition hover:bg-blue-500/30"
                >
                  Save Repair Changes
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6">
          <h2 className="text-lg font-medium text-white">Pricing</h2>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Labor</span>
              <span className="text-white">{repair.laborPrice}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Parts</span>
              <span className="text-white">{repair.partsCost}</span>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">Total</span>
                <span className="font-medium text-white">{repair.totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="text-sm font-medium text-white">Change Status</h3>

            <form action={updateRepairStatus} className="mt-4 space-y-4">
              <input type="hidden" name="repairId" value={repair.id} />

              <select
                name="status"
                defaultValue={repair.status}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="NEW">NEW</option>
                <option value="DIAGNOSING">DIAGNOSING</option>
                <option value="WAITING_PART">WAITING_PART</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="READY">READY</option>
                <option value="CLOSED">CLOSED</option>
              </select>

              <button
                type="submit"
                className="w-full rounded-lg border border-blue-300/40 bg-blue-500/20 px-5 py-2.5 text-sm font-medium text-blue-100 transition hover:bg-blue-500/30"
              >
                Update Status
              </button>
            </form>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Parts Used</h2>
          </div>

          {repair.partsUsed.length === 0 ? (
            <p className="text-sm text-zinc-400">No parts added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                  <tr className="border-b border-white/10">
                    <th className="py-3 font-medium">Item</th>
                    <th className="py-3 font-medium">Qty</th>
                    <th className="py-3 font-medium">Unit Cost</th>
                    <th className="py-3 font-medium">Total</th>
                    <th className="py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {repair.partsUsed.map((part) => (
                    <tr
                      key={part.id}
                      className="border-b border-white/10 text-zinc-200 transition hover:bg-white/[0.02]"
                    >
                      <td className="py-3">{part.inventoryItem.name}</td>
                      <td className="py-3">{part.quantity}</td>
                      <td className="py-3">{part.unitCost}</td>
                      <td className="py-3">{part.totalCost}</td>
                      <td className="py-3">
                        <form action={removePartFromRepair} className="space-y-2">
                          <input type="hidden" name="repairId" value={repair.id} />
                          <input type="hidden" name="partId" value={part.id} />
                          <label className="flex items-center gap-2 text-xs text-zinc-400">
                            <input
                              type="checkbox"
                              name="confirmRemove"
                              value="true"
                              className="h-3.5 w-3.5 rounded border border-white/15 bg-zinc-950"
                            />
                            Confirm
                          </label>
                          <button
                            type="submit"
                            className="rounded-lg border border-white/10 px-3 py-1 text-xs text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900"
                          >
                            Remove
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6">
          <h2 className="text-lg font-medium text-white">Add Part</h2>

          <form action={addPartToRepair} className="mt-5 space-y-4">
            <input type="hidden" name="repairId" value={repair.id} />

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Item</label>
              <select
                name="inventoryItemId"
                required
                defaultValue=""
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="" disabled>
                  Select an item
                </option>
                {inventoryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — stock {item.quantityInStock}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Quantity</label>
              <input
                name="quantity"
                type="number"
                min="1"
                defaultValue="1"
                required
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg border border-blue-300/40 bg-blue-500/20 px-5 py-2.5 text-sm font-medium text-blue-100 transition hover:bg-blue-500/30"
            >
              Add Part to Repair
            </button>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
