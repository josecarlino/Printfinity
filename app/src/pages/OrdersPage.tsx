import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { StatusBadge } from "../components/StatusBadge";
import { OrderFormModal } from "../components/OrderFormModal";
import { OrderDetailModal } from "../components/OrderDetailModal";
import { supabase } from "../lib/supabaseClient";
import { formatCurrency, formatDate } from "../lib/format";
import type { Order, OrderStatus } from "../types/order";

const STATUS_FILTERS: Array<OrderStatus | "Todos"> = ["Todos", "Pendiente", "En proceso", "Entregado"];
const PAGE_SIZE = 10;

export function OrdersPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "Todos">("Todos");
  const [paidFilter, setPaidFilter] = useState<"Todos" | "Pagado" | "Pendiente">("Todos");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [formInitialPrice, setFormInitialPrice] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setLoadError(error.message);
        } else {
          setOrders(data as Order[]);
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const state = location.state as { prefillPrice?: number } | null;
    if (state?.prefillPrice != null) {
      setFormInitialPrice(state.prefillPrice);
      setFormOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orderNumbers = useMemo(() => {
    const chronological = [...orders].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    const map = new Map<string, number>();
    chronological.forEach((order, index) => map.set(order.id, index + 1));
    return map;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (term && !`${order.client} ${order.piece}`.toLowerCase().includes(term)) return false;
      if (statusFilter !== "Todos" && order.status !== statusFilter) return false;
      if (paidFilter === "Pagado" && !order.paid) return false;
      if (paidFilter === "Pendiente" && order.paid) return false;
      return true;
    });
  }, [orders, search, statusFilter, paidFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageOrders = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function resetPageAnd<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  function handleCreated(order: Order) {
    setOrders((prev) => [order, ...prev]);
  }

  function handleUpdated(order: Order) {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
  }

  function handleDeleted(id: string) {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="w-full max-w-page mx-auto px-layout-mobile md:px-layout-desktop py-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-xl">
            <div>
              <h1 className="font-sans text-headline-lg text-text-primary tracking-tight">
                Gestión de pedidos
              </h1>
              <p className="font-sans text-body-md text-text-secondary mt-2xs">
                {orders.length} {orders.length === 1 ? "pedido registrado" : "pedidos registrados"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormInitialPrice(null);
                setFormOpen(true);
              }}
              className="inline-flex items-center justify-center gap-xs h-10 px-md bg-primary text-text-on-primary font-sans text-label-md rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <span className="font-semibold">+ Nuevo pedido</span>
            </button>
          </div>

          <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-md mb-md">
            <div className="relative flex-1 max-w-[28rem]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-base pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por cliente o pieza..."
                value={search}
                onChange={(e) => resetPageAnd(setSearch)(e.target.value)}
                className="w-full h-10 pl-9 pr-md bg-surface border border-border rounded-lg font-sans text-body-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-border-hover transition-colors"
              />
            </div>
            <div className="flex flex-wrap items-center gap-sm">
              <div className="flex items-center bg-surface border border-border rounded-lg p-0.5">
                {STATUS_FILTERS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => resetPageAnd(setStatusFilter)(option)}
                    className={`px-3 py-1 rounded-md font-sans text-label-sm transition-colors ${
                      statusFilter === option
                        ? "bg-surface-subtle text-text-primary font-semibold"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <select
                value={paidFilter}
                onChange={(e) => resetPageAnd(setPaidFilter)(e.target.value as typeof paidFilter)}
                className="h-10 px-md bg-surface border border-border rounded-lg font-sans text-label-sm text-text-primary focus:outline-none focus:border-border-hover transition-colors cursor-pointer"
              >
                <option value="Todos">Pago: Todos</option>
                <option value="Pagado">Pagado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
          </div>

          <div className="w-full bg-surface rounded-xl overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full table-fixed text-left border-collapse min-w-[720px]">
                <thead>
                  <tr className="bg-surface-subtle/50">
                    <th className="py-md px-lg font-sans text-table-header uppercase text-text-secondary w-[6%]">
                      N°
                    </th>
                    <th className="py-md px-lg font-sans text-table-header uppercase text-text-secondary w-[20%]">
                      Cliente
                    </th>
                    <th className="py-md px-lg font-sans text-table-header uppercase text-text-secondary w-[26%]">
                      Impresión 3D
                    </th>
                    <th className="py-md px-lg font-sans text-table-header uppercase text-text-secondary w-[14%]">
                      Fecha de entrega
                    </th>
                    <th className="py-md px-lg font-sans text-table-header uppercase text-text-secondary w-[13%]">
                      Estado
                    </th>
                    <th className="py-md px-lg font-sans text-table-header uppercase text-text-secondary text-right w-[12%]">
                      Precio
                    </th>
                    <th className="py-md px-lg font-sans text-table-header uppercase text-text-secondary text-center w-[9%]">
                      Pago
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={7} className="py-lg px-lg text-center font-sans text-body-md text-text-secondary">
                        Cargando pedidos…
                      </td>
                    </tr>
                  )}
                  {!loading && loadError && (
                    <tr>
                      <td colSpan={7} className="py-lg px-lg text-center font-sans text-body-md text-error">
                        {loadError}
                      </td>
                    </tr>
                  )}
                  {!loading && !loadError && pageOrders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-lg px-lg text-center font-sans text-body-md text-text-secondary">
                        No hay pedidos que coincidan.
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    !loadError &&
                    pageOrders.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-surface-subtle transition-colors cursor-pointer group border-t border-border/60 first:border-t-0"
                      >
                        <td className="py-md px-lg font-sans text-label-md text-text-secondary font-mono">
                          {orderNumbers.get(order.id)}
                        </td>
                        <td
                          className="py-md px-lg font-sans text-label-md text-text-primary group-hover:text-primary truncate"
                          title={order.client}
                        >
                          {order.client}
                        </td>
                        <td className="py-md px-lg font-sans text-body-md text-on-surface truncate" title={order.piece}>
                          {order.piece}
                        </td>
                        <td className="py-md px-lg font-sans text-body-sm text-text-secondary font-mono">
                          {formatDate(order.due_date)}
                        </td>
                        <td className="py-md px-lg">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-md px-lg font-sans text-label-md text-text-primary text-right font-semibold">
                          {formatCurrency(order.price)}
                        </td>
                        <td className="py-md px-lg text-center">
                          <span
                            className={`inline-flex items-center justify-center w-5 h-5 rounded border ${
                              order.paid
                                ? "bg-surface-container-lowest border-white/60 text-text-primary"
                                : "bg-surface-subtle border-border text-text-secondary"
                            }`}
                          >
                            {order.paid && (
                              <span className="material-symbols-outlined text-sm! font-bold leading-none!">
                                check
                              </span>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="px-lg py-sm bg-surface-subtle/30 flex flex-col sm:flex-row items-center justify-between gap-sm border-t border-border">
              <span className="font-sans text-body-sm text-text-secondary">
                {filteredOrders.length === 0
                  ? "Sin pedidos"
                  : `Mostrando ${(currentPage - 1) * PAGE_SIZE + 1} a ${Math.min(
                      currentPage * PAGE_SIZE,
                      filteredOrders.length,
                    )} de ${filteredOrders.length} pedidos`}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  title="Anterior"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-base leading-none">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPage(num)}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-sans text-label-sm transition-colors ${
                      num === currentPage
                        ? "bg-primary text-text-on-primary font-semibold"
                        : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-hover"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  title="Siguiente"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-base leading-none">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {formOpen && (
        <OrderFormModal
          key={formInitialPrice ?? "blank"}
          onClose={() => setFormOpen(false)}
          onCreated={handleCreated}
          initialPrice={formInitialPrice}
        />
      )}
      {selectedOrder && (
        <OrderDetailModal
          key={selectedOrder.id}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
