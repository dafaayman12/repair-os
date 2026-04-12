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
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Operations
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Dashboard
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              Home
            </Link>
            <Link
              href="/inventory"
              className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              Inventory
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
            >
              <p className="text-sm text-zinc-400">{card.title}</p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {card.value}
              </p>
              <p className="mt-2 text-sm text-zinc-500">{card.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}