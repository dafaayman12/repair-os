import Link from "next/link";
import { AppShell } from "@/components/app-shell";

const cards = [
  { title: "Open Repairs", value: "0", hint: "No repairs yet" },
  { title: "Waiting Parts", value: "0", hint: "Nothing pending" },
  { title: "Low Stock Items", value: "0", hint: "Inventory healthy" },
  { title: "Today Revenue", value: "0 DH", hint: "No sales recorded" },
];

const workflow = [
  { label: "New", value: "0", hint: "Recently created tickets" },
  { label: "Diagnosing", value: "0", hint: "In technical review" },
  { label: "Waiting Part", value: "0", hint: "Pending parts arrival" },
  { label: "Ready", value: "0", hint: "Ready for pickup" },
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
      toolbar={
        <>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Daily Command Center
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-400">
              Today
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-400">
              Repairs + Inventory
            </div>
          </div>
        </>
      }
    >
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-[0_0_45px_rgba(251,191,36,0.05)]"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                {card.title}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {card.value}
              </p>
              <p className="mt-2 text-sm text-zinc-500">{card.hint}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 xl:col-span-2">
            <div className="border-b border-white/10 px-6 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Recent Repairs
              </p>
              <h2 className="mt-2 text-lg font-medium text-white">
                Latest ticket activity
              </h2>
            </div>
            <div className="px-6 py-10 text-sm text-zinc-400">
              No recent repairs yet.
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Low Stock Watch
            </p>
            <h2 className="mt-2 text-lg font-medium text-white">
              Parts to monitor
            </h2>
            <div className="mt-5 rounded-xl border border-white/10 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-400">
              No low-stock items right now.
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-amber-200/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 shadow-[0_0_60px_rgba(251,146,60,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-200/70">
                Workflow Pipeline
              </p>
              <h2 className="mt-2 text-lg font-medium text-white">
                Repair stage distribution
              </h2>
            </div>
            <Link
              href="/repairs"
              className="rounded-xl border border-amber-200/30 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-300/20"
            >
              Open Repairs Board
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{item.hint}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
