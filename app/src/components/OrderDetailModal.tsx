import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Order, OrderStatus } from "../types/order";
import { StatusBadge } from "./StatusBadge";

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onUpdated: (order: Order) => void;
  onDeleted: (id: string) => void;
}

const STATUS_OPTIONS: OrderStatus[] = ["Pendiente", "En proceso", "Entregado"];

const inputClass =
  "w-full h-10 px-md bg-surface-subtle border border-border rounded-lg text-text-primary font-sans text-body-md focus:outline-none focus:border-primary transition-colors";
const labelClass = "font-sans text-label-sm text-text-secondary";

export function OrderDetailModal({ order, onClose, onUpdated, onDeleted }: OrderDetailModalProps) {
  const [client, setClient] = useState(order.client);
  const [piece, setPiece] = useState(order.piece);
  const [dueDate, setDueDate] = useState(order.due_date ?? "");
  const [price, setPrice] = useState(String(order.price));
  const [paid, setPaid] = useState(order.paid);
  const [link, setLink] = useState(order.link ?? "");
  const [notes, setNotes] = useState(order.notes ?? "");
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);

    const { data, error: updateError } = await supabase
      .from("orders")
      .update({
        client,
        piece,
        due_date: dueDate || null,
        price: Number(price) || 0,
        paid,
        link: link || null,
        notes: notes || null,
        status,
      })
      .eq("id", order.id)
      .select()
      .single();

    setSaving(false);

    if (updateError || !data) {
      setError(updateError?.message ?? "No se pudo guardar el pedido.");
      return;
    }

    onUpdated(data as Order);
    onClose();
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar el pedido de ${order.client}? Esta acción no se puede deshacer.`)) {
      return;
    }
    setDeleting(true);
    const { error: deleteError } = await supabase.from("orders").delete().eq("id", order.id);
    setDeleting(false);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    onDeleted(order.id);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/75 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[500px] bg-surface rounded-xl border border-border p-xl flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-md pb-lg border-b border-border">
          <div>
            <span className="font-sans text-table-header uppercase text-text-secondary tracking-wider font-semibold block mb-1">
              Detalle de pedido
            </span>
            <h2 className="font-sans text-headline-md text-text-primary tracking-tight">
              {order.piece}
            </h2>
          </div>
          <div className="flex items-center gap-xs">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              title="Eliminar pedido"
              className="h-7 px-xs rounded border border-error/30 bg-error/10 hover:bg-error/20 text-error font-sans text-label-sm inline-flex items-center gap-1 transition-colors disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              <span>Eliminar</span>
            </button>
            <StatusBadge status={status} />
            <button
              type="button"
              aria-label="Cerrar"
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded hover:bg-surface-subtle"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-md py-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Cliente</label>
              <input className={inputClass} value={client} onChange={(e) => setClient(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Fecha de entrega</label>
              <input
                type="date"
                className={inputClass}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Impresión 3D</label>
              <input className={inputClass} value={piece} onChange={(e) => setPiece(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-sm items-end">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Precio</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-secondary font-sans text-label-md select-none">
                    S/
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`${inputClass} pl-8 font-semibold text-headline-sm`}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <label className="flex items-center h-10 pb-0.5 gap-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={paid}
                  onChange={(e) => setPaid(e.target.checked)}
                />
                <span
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    paid
                      ? "border-status-delivered-text bg-status-delivered-bg text-status-delivered-text"
                      : "border-border text-transparent"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </span>
                <span className="font-sans text-body-md text-text-primary font-semibold">Pagado</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Link</label>
            <input className={inputClass} value={link} onChange={(e) => setLink(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Comentarios</label>
            <textarea
              rows={2}
              className={`${inputClass} h-auto py-md resize-none`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-xs mb-lg pt-1">
          <label className="font-sans text-table-header uppercase text-text-secondary tracking-wider font-semibold">
            Cambiar estado
          </label>
          <div className="grid grid-cols-3 gap-xs pt-1">
            {STATUS_OPTIONS.map((option) => {
              const isActive = status === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatus(option)}
                  className={`h-10 px-xs rounded-lg border font-sans text-label-md transition-all text-center ${
                    isActive
                      ? option === "Pendiente"
                        ? "border-status-new-text text-status-new-text bg-status-new-bg"
                        : option === "En proceso"
                          ? "border-status-progress-text text-status-progress-text bg-status-progress-bg"
                          : "border-status-delivered-text text-status-delivered-text bg-status-delivered-bg"
                      : "border-border bg-transparent text-text-secondary hover:text-text-primary hover:border-border-hover"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className="font-sans text-body-sm text-error mb-sm">{error}</p>}

        <div className="grid grid-cols-2 gap-sm pt-xs border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-border hover:border-border-hover bg-transparent hover:bg-surface-subtle text-text-primary font-sans text-label-md transition-colors flex items-center justify-center"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-11 rounded-lg bg-primary text-text-on-primary font-sans text-label-md font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            <span>{saving ? "Guardando…" : "Guardar"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
