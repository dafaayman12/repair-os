import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
        <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900/70 p-10 shadow-2xl">
          <div className="mb-8">
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
              Local Repair Shop Manager
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white">
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
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-4 transition hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className="text-lg font-medium text-white">Dashboard</div>
              <div className="mt-1 text-sm text-zinc-400">
                Overview of repairs, stock, and activity.
              </div>
            </Link>

            <Link
              href="/repairs"
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-4 transition hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className="text-lg font-medium text-white">Repairs</div>
              <div className="mt-1 text-sm text-zinc-400">
                Track repair tickets, status, and totals.
              </div>
            </Link>

            <Link
              href="/inventory"
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-4 transition hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className="text-lg font-medium text-white">Inventory</div>
              <div className="mt-1 text-sm text-zinc-400">
                Track screens, batteries, screws, and parts.
              </div>
            </Link>

            <Link
              href="/customers"
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-4 transition hover:border-zinc-700 hover:bg-zinc-900"
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
