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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-[0_0_50px_rgba(251,191,36,0.04)]"
          >
            <p className="text-sm tracking-wide text-zinc-400">{card.title}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {card.value}
            </p>
            <p className="mt-3 text-sm text-zinc-500">{card.hint}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
