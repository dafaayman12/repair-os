"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  LayoutGrid,
  Package,
  Phone,
  Plus,
  Save,
  Settings2,
  ShieldAlert,
  Users,
  Wrench,
  X,
} from "lucide-react";

type WorkflowItem = {
  label: string;
  key: string;
  hint: string;
};

type RecentRepairItem = {
  id: string;
  customerName: string;
  deviceLabel: string;
  status: string;
};

type LowStockItem = {
  id: string;
  name: string;
  category: string;
  quantityInStock: number;
  minStock: number;
};

type DashboardWorkspaceProps = {
  openRepairs: number;
  waitingParts: number;
  revenueToday: number;
  inventoryCount: number;
  recentRepairs: RecentRepairItem[];
  lowStockItems: LowStockItem[];
  quickLinks: Array<{ label: string; href: string }>;
  workflow: WorkflowItem[];
  pipelineCounts: Record<string, number>;
};

type WidgetKey =
  | "kpi"
  | "quickNav"
  | "activity"
  | "shopStats"
  | "workflow"
  | "lowStock";

const widgetCatalog: Array<{ key: WidgetKey; label: string; description: string }> = [
  { key: "kpi", label: "KPI Cards", description: "Open, waiting, revenue, low stock" },
  { key: "quickNav", label: "Quick Navigation", description: "Jump to high-frequency actions" },
  { key: "activity", label: "Latest Activity", description: "Recent repair activity table" },
  { key: "shopStats", label: "Shop Stats", description: "Compact daily metrics" },
  { key: "workflow", label: "Workflow Queue", description: "Queue status counters" },
  { key: "lowStock", label: "Low Stock Watch", description: "Parts near minimum stock" },
];

const baseWidgetState: Record<WidgetKey, boolean> = {
  kpi: true,
  quickNav: true,
  activity: true,
  shopStats: true,
  workflow: true,
  lowStock: true,
};

export function DashboardWorkspace({
  openRepairs,
  waitingParts,
  revenueToday,
  inventoryCount,
  recentRepairs,
  lowStockItems,
  quickLinks,
  workflow,
  pipelineCounts,
}: DashboardWorkspaceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [savedWidgets, setSavedWidgets] = useState(baseWidgetState);
  const [draftWidgets, setDraftWidgets] = useState(baseWidgetState);

  const activeWidgets = isEditing ? draftWidgets : savedWidgets;

  const stats = useMemo(
    () => [
      { title: "Open", value: String(openRepairs), hint: "active tickets", icon: Wrench },
      { title: "Waiting", value: String(waitingParts), hint: "need parts", icon: Clock3 },
      {
        title: "Low Stock",
        value: String(lowStockItems.length),
        hint: "restock now",
        icon: ShieldAlert,
      },
      {
        title: "Revenue Today",
        value: `${revenueToday} DH`,
        hint: "closed jobs",
        icon: CircleDollarSign,
      },
    ],
    [openRepairs, waitingParts, lowStockItems.length, revenueToday]
  );

  const panelClass = (enabled: boolean) =>
    [
      "rounded-lg border bg-[#112349] p-3",
      enabled ? "border-blue-300/25" : "border-blue-300/20 opacity-50",
      isEditing ? "border-dashed" : "",
    ].join(" ");

  return (
    <div className="relative">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "Board", icon: LayoutGrid },
            { label: "Queue", icon: Wrench },
            { label: "Customers", icon: Users },
            { label: "Revenue", icon: CircleDollarSign },
          ].map((tab, index) => (
            <span
              key={tab.label}
              className={`rounded-md border px-2.5 py-1 text-[11px] ${
                index === 0
                  ? "border-blue-300/55 bg-blue-500/30 text-blue-100"
                  : "border-blue-300/20 bg-[#112349] text-blue-100/70"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <tab.icon size={11} />
                {tab.label}
              </span>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setSavedWidgets(draftWidgets);
                  setIsEditing(false);
                }}
                className="inline-flex items-center gap-1 rounded-md border border-blue-300/45 bg-blue-600/60 px-2.5 py-1 text-[11px] font-medium text-blue-50"
              >
                <Save size={11} /> Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftWidgets(savedWidgets);
                  setIsEditing(false);
                }}
                className="inline-flex items-center gap-1 rounded-md border border-blue-300/30 bg-[#112349] px-2.5 py-1 text-[11px] text-blue-100"
              >
                <X size={11} /> Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 rounded-md border border-blue-300/35 bg-[#123061] px-2.5 py-1 text-[11px] text-blue-100"
            >
              <Settings2 size={11} /> Edit Dashboard
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="mb-2 rounded-lg border border-dashed border-blue-300/45 bg-blue-500/10 px-3 py-2 text-xs text-blue-100/85">
          Edit mode is on. Toggle widgets from the right drawer, then Save or Cancel.
        </div>
      ) : null}

      {activeWidgets.kpi ? (
        <section className={`${panelClass(activeWidgets.kpi)} mb-3 p-2`}>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.title}
                className="rounded-md border border-blue-300/25 bg-[#0b1731] px-2.5 py-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-blue-100/60">
                    {item.title}
                  </p>
                  <item.icon size={12} className="text-blue-200/70" />
                </div>
                <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
                <p className="text-[10px] text-blue-100/55">{item.hint}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-3 xl:grid-cols-[1.05fr_1.2fr_0.9fr]">
        <div className="space-y-3">
          {activeWidgets.quickNav ? (
            <div className={panelClass(activeWidgets.quickNav)}>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Quick Navigation</h2>
                <Link href="/dashboard" className="text-[11px] text-blue-200/70 hover:text-blue-100">
                  refresh
                </Link>
              </div>
              <div className="grid gap-1.5">
                {quickLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs text-blue-100/85 transition hover:border-blue-300/45 hover:bg-[#122a52]"
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={12} className="text-blue-200/65" />
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {activeWidgets.workflow ? (
            <div className={panelClass(activeWidgets.workflow)}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-blue-100/55">
                Workflow Queue
              </p>
              <div className="mt-2 grid gap-1.5">
                {workflow.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2"
                  >
                    <div>
                      <p className="text-xs text-white">{item.label}</p>
                      <p className="text-[11px] text-blue-100/50">{item.hint}</p>
                    </div>
                    <span className="rounded-md border border-blue-300/30 bg-[#123061] px-2 py-0.5 text-xs font-medium text-blue-100">
                      {pipelineCounts[item.key] ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {activeWidgets.activity ? (
          <div className={panelClass(activeWidgets.activity).replace(" p-3", "")}>
            <div className="flex items-center justify-between border-b border-blue-300/20 px-3 py-2.5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-blue-100/55">
                  Ready & Appointments
                </p>
                <h2 className="text-sm font-semibold text-white">Front Desk Board</h2>
              </div>
              <Link
                href="/repairs"
                className="rounded-md border border-blue-300/30 bg-[#113264] px-2.5 py-1 text-[11px] font-medium text-blue-100 hover:bg-[#1a4280]"
              >
                Open Board
              </Link>
            </div>

            {recentRepairs.length === 0 ? (
              <div className="px-3 py-8 text-sm text-blue-100/55">No repair activity yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b1731] uppercase tracking-[0.12em] text-blue-100/55">
                    <tr>
                      <th className="px-3 py-2 font-medium">Customer</th>
                      <th className="px-3 py-2 font-medium">Device</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRepairs.map((repair) => (
                      <tr
                        key={repair.id}
                        className="border-t border-blue-300/20 text-zinc-200 transition hover:bg-blue-500/10"
                      >
                        <td className="px-3 py-2.5">
                          <Link
                            href={`/repairs/${repair.id}`}
                            className="text-white underline-offset-4 hover:underline"
                          >
                            {repair.customerName}
                          </Link>
                        </td>
                        <td className="px-3 py-2.5">{repair.deviceLabel}</td>
                        <td className="px-3 py-2.5">
                          <span className="inline-flex items-center gap-1 rounded-md border border-blue-300/30 bg-[#123061] px-1.5 py-0.5 text-[11px] text-blue-100">
                            <Clock3 size={10} />
                            {repair.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="inline-flex items-center gap-1 text-blue-100/75">
                            <Phone size={10} />
                            Call
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}

        <div className="space-y-3">
          {activeWidgets.shopStats ? (
            <div className={panelClass(activeWidgets.shopStats)}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-blue-100/55">Shop Stats</p>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-blue-100/75">
                    <CalendarDays size={11} /> Today Jobs
                  </span>
                  <span className="font-semibold text-white">{recentRepairs.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-blue-100/75">
                    <Wrench size={11} /> Active Queue
                  </span>
                  <span className="font-semibold text-white">{openRepairs}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-blue-100/75">
                    <Package size={11} /> Inventory Items
                  </span>
                  <span className="font-semibold text-white">{inventoryCount}</span>
                </div>
              </div>
            </div>
          ) : null}

          {activeWidgets.lowStock ? (
            <div className={panelClass(activeWidgets.lowStock)}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-blue-100/55">
                Low Stock Watch
              </p>
              {lowStockItems.length === 0 ? (
                <div className="mt-2 rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2 text-xs text-blue-100/60">
                  No low-stock items right now.
                </div>
              ) : (
                <div className="mt-2 space-y-1.5">
                  {lowStockItems.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-md border border-blue-300/20 bg-[#0b1731] px-2.5 py-2"
                    >
                      <p className="text-xs text-white">{item.name}</p>
                      <p className="text-[11px] text-blue-100/50">
                        {item.category} · {item.quantityInStock}/{item.minStock}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>

      {isEditing ? (
        <aside className="fixed right-0 top-0 z-20 h-screen w-80 border-l border-blue-300/30 bg-[#08142d] p-4 shadow-[-12px_0_30px_rgba(2,6,23,0.5)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Widget Drawer</h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-blue-300/30 bg-[#112349] p-1 text-blue-100"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {widgetCatalog.map((widget) => {
              const checked = draftWidgets[widget.key];
              return (
                <label
                  key={widget.key}
                  className="block rounded-md border border-blue-300/20 bg-[#0b1731] px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium text-white">{widget.label}</p>
                      <p className="text-[11px] text-blue-100/55">{widget.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDraftWidgets((prev) => ({
                          ...prev,
                          [widget.key]: !prev[widget.key],
                        }))
                      }
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] ${
                        checked
                          ? "border-blue-300/40 bg-blue-600/50 text-blue-50"
                          : "border-blue-300/25 bg-[#112349] text-blue-100/70"
                      }`}
                    >
                      {checked ? <X size={11} /> : <Plus size={11} />}
                      {checked ? "Remove" : "Add"}
                    </button>
                  </div>
                </label>
              );
            })}
          </div>
        </aside>
      ) : null}
    </div>
  );
}
