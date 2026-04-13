import Link from "next/link";
import { AppShell } from "@/components/app-shell";

const cards = [
  { title: "Open Repairs", value: "0", hint: "No repairs yet" },
  { title: "Waiting Parts", value: "0", hint: "Nothing pending" },
  { title: "Low Stock Items", value: "0", hint: "Inventory healthy" },
  { title: "Today Revenue", value: "0 DH", hint: "No sales recorded" },
];

export default function DashboardPage() {
  return (
    <AppShell
      section="Operations"
      title="Dashboard"
      description="Track the most important daily signals across your repair business."
      actions={
        <>
          <Link
            href="/repairs"
            className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 transition hover:border-amber-200/35 hover:bg-zinc-900"
          >
            Repairs
          </Link>
          <Link
            href="/inventory"
            className="rounded-xl border border-amber-200/35 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-300/20"
          >
            Inventory
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <section className="grid gap-5 xl:grid-cols-3">
          <div className="rounded-3xl border border-amber-200/25 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-7 shadow-[0_0_60px_rgba(251,146,60,0.12)] xl:col-span-2">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">
              Performance Snapshot
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Today is calm. Keep quality high.
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Your operational center is healthy. Use quick actions to open new
              repairs and maintain stock readiness.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/repairs/new"
                className="rounded-xl border border-amber-200/30 bg-amber-300/15 px-4 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-300/25"
              >
                Open New Repair
              </Link>
              <Link
                href="/inventory/new"
                className="rounded-xl border border-white/10 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-200 transition hover:border-amber-200/30 hover:bg-zinc-900"
              >
                Add Inventory Item
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Priority Focus
            </p>
            <div className="mt-4 space-y-4 text-sm text-zinc-300">
              <div className="rounded-xl border border-white/10 bg-zinc-900/70 px-4 py-3">
                Keep diagnostics moving for new tickets.
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-900/70 px-4 py-3">
                Watch parts availability for urgent jobs.
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-900/70 px-4 py-3">
                Close ready repairs to improve cash flow.
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-[0_0_45px_rgba(251,191,36,0.05)]"
            >
              <p className="text-sm tracking-wide text-zinc-400">{card.title}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {card.value}
              </p>
              <p className="mt-3 text-sm text-zinc-500">{card.hint}</p>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
