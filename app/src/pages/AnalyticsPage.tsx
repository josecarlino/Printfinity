import { useEffect, useMemo, useState } from "react";
import { Header } from "../components/Header";
import { supabase } from "../lib/supabaseClient";
import { formatCurrency } from "../lib/format";
import type { Order } from "../types/order";

const GOAL_NAME = "Snapmaker U1";
const GOAL_AMOUNT = 4600;

const TIERS = [
  { max: 20, color: "var(--color-tier1)", label: "Muy bajo" },
  { max: 40, color: "var(--color-tier2)", label: "Bajo" },
  { max: 60, color: "var(--color-tier3)", label: "Medio" },
  { max: 80, color: "var(--color-tier4)", label: "Bueno" },
  { max: 100, color: "var(--color-tier5)", label: "Excelente" },
] as const;

const MILESTONES = [0, 20, 40, 60, 80, 100];

function tierIndexForPercentage(pct: number) {
  const index = TIERS.findIndex((t) => pct <= t.max);
  return index === -1 ? TIERS.length - 1 : index;
}

export function AnalyticsPage() {
  const [orders, setOrders] = useState<Pick<Order, "price" | "status" | "paid">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("orders")
      .select("price, status, paid")
      .then(({ data }) => {
        if (!active) return;
        if (data) setOrders(data);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const { collected, percentage } = useMemo(() => {
    const collected = orders
      .filter((o) => o.status === "Entregado" && o.paid)
      .reduce((sum, o) => sum + Number(o.price), 0);
    return { collected, percentage: (collected / GOAL_AMOUNT) * 100 };
  }, [orders]);

  const tierIndex = tierIndexForPercentage(percentage);
  const tier = TIERS[tierIndex];
  const barPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="w-full max-w-page mx-auto px-layout-mobile md:px-layout-desktop py-xl">
          <section className="w-full bg-surface border border-border rounded-lg pt-xl lg:pt-2xl pr-xl lg:pr-2xl pl-xl lg:pl-2xl pb-xl lg:pb-[3.375rem] relative overflow-hidden">
            <header className="mb-2xl">
              <h1 className="font-sans text-2xl font-bold text-text-primary tracking-tight mb-1">
                Recuperación de {GOAL_NAME}
              </h1>
              <p className="font-sans text-sm text-text-secondary font-normal">
                Monto total y porcentaje recaudado de la impresora, hasta la fecha actual
              </p>
            </header>

            {loading ? (
              <p className="font-sans text-body-md text-text-secondary">Cargando datos…</p>
            ) : (
              <div className="flex flex-col lg:flex-row lg:items-center gap-lg lg:gap-2xl">
                <div className="flex items-center gap-md flex-shrink-0 lg:border-r lg:border-border/80 lg:pr-2xl">
                  <div
                    className="w-14 h-14 rounded-[12px] bg-black border flex items-center justify-center shadow-inner flex-shrink-0"
                    style={{ borderColor: `color-mix(in srgb, ${tier.color} 60%, transparent)` }}
                  >
                    <span className="text-xl font-bold" style={{ color: tier.color }}>
                      {tierIndex + 1}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-4xl font-bold text-text-primary tracking-tight leading-none">
                      {percentage.toFixed(1)}%
                    </span>
                    <span
                      className="text-sm font-semibold mt-1.5 uppercase tracking-wide"
                      style={{ color: tier.color }}
                    >
                      {tier.label}
                    </span>
                    <span className="text-xs text-text-secondary mt-0.5 font-medium">
                      {formatCurrency(collected)} recaudados
                    </span>
                  </div>
                </div>

                <div className="flex-1 w-full pt-4 pb-2 pr-6">
                  <div className="relative w-full">
                    <div className="relative w-full h-10 mb-4">
                      {MILESTONES.map((p, i) => (
                        <div
                          key={p}
                          className="absolute -translate-x-1/2 flex flex-col items-center gap-1"
                          style={{ left: `${p}%` }}
                        >
                          <span className="w-6 h-6 rounded-[6px] bg-black border border-border flex items-center justify-center text-xs font-semibold text-white shadow-sm">
                            {i + 1}
                          </span>
                          <span className="text-[11px] text-text-secondary font-normal whitespace-nowrap">
                            {formatCurrency(Math.round((GOAL_AMOUNT * p) / 100))}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-5 gap-2 w-full h-3.5 my-1">
                      {TIERS.map((t) => (
                        <div
                          key={t.label}
                          className="h-full rounded-full shadow-sm"
                          style={{ backgroundColor: t.color }}
                        />
                      ))}
                    </div>

                    <div className="relative w-full h-5 mt-3 text-[11px] text-text-secondary font-normal">
                      {MILESTONES.map((p) => (
                        <span key={p} className="absolute -translate-x-1/2" style={{ left: `${p}%` }}>
                          {p}%
                        </span>
                      ))}
                    </div>

                    <div
                      className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
                      style={{ left: `${barPercentage}%`, top: "3.25rem" }}
                    >
                      <div className="w-[1.5px] h-9 bg-white shadow-sm" />
                      <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-white" />
                      <span className="text-xs font-bold text-white tracking-tight whitespace-nowrap mt-3.5">
                        {formatCurrency(collected)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
