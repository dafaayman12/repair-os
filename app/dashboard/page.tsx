import Link from "next/link";

const cards = [
  { title: "Open Repairs", value: "0", hint: "No repairs yet" },
  { title: "Waiting Parts", value: "0", hint: "Nothing pending" },
  { title: "Low Stock Items", value: "0", hint: "Inventory healthy" },
  { title: "Today Revenue", value: "0 DH", hint: "No sales recorded" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
              Operations
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Dashboard
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
            >
              Home
            </Link>
            <Link
              href="/customers"
              className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
            >
              Customers
            </Link>
            <Link
              href="/repairs"
              className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
            >
              Repairs
            </Link>
            <Link
              href="/inventory"
              className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
            >
              Inventory
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
            >
              <p className="text-sm tracking-wide text-zinc-400">{card.title}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {card.value}
              </p>
              <p className="mt-3 text-sm text-zinc-500">{card.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
