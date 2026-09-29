import type { OrderStatus } from "../types/order";

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pendiente: "bg-status-new-bg text-status-new-text border border-status-new-border",
  "En proceso": "bg-status-progress-bg text-status-progress-text border border-status-progress-border",
  // border-transparent (en vez de omitir el borde) mantiene la misma altura
  // que las otras dos insignias, que sí tienen un borde de 1px visible.
  Entregado: "bg-status-delivered-bg text-status-delivered-text border border-transparent",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-sans font-semibold ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
