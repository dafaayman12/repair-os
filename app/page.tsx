import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
        <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-10 shadow-[0_0_50px_rgba(24,24,27,0.45)]">
          <div className="mb-10">
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-zinc-500">
              Local Repair Shop Manager
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              RepairOS
            </h1>
            <p className="mt-4 max-w-2xl text-zinc-400">
              A modern local-first repair management system for repairs,
              inventory, customers, and purchases.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/dashboard"
              className="rounded-2xl border border-white/10 bg-zinc-950/80 px-5 py-5 transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-900"
            >
              <div className="text-lg font-medium text-white">Dashboard</div>
              <div className="mt-1 text-sm text-zinc-400">
                Overview of repairs, stock, and activity.
              </div>
            </Link>

            <Link
              href="/repairs"
              className="rounded-2xl border border-white/10 bg-zinc-950/80 px-5 py-5 transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-900"
            >
              <div className="text-lg font-medium text-white">Repairs</div>
              <div className="mt-1 text-sm text-zinc-400">
                Track repair tickets, status, and totals.
              </div>
            </Link>

            <Link
              href="/inventory"
              className="rounded-2xl border border-white/10 bg-zinc-950/80 px-5 py-5 transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-900"
            >
              <div className="text-lg font-medium text-white">Inventory</div>
              <div className="mt-1 text-sm text-zinc-400">
                Track screens, batteries, screws, and parts.
              </div>
            </Link>

            <Link
              href="/customers"
              className="rounded-2xl border border-white/10 bg-zinc-950/80 px-5 py-5 transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-900"
            >
              <div className="text-lg font-medium text-white">Customers</div>
              <div className="mt-1 text-sm text-zinc-400">
                Browse customer contacts and repair history.
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
