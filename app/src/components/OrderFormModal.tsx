import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Order } from "../types/order";

interface OrderFormModalProps {
  onClose: () => void;
  onCreated: (order: Order) => void;
  initialPrice?: number | null;
}

const inputClass =
  "w-full h-10 px-sm bg-surface border border-border rounded-lg text-text-primary font-sans text-body-md placeholder:text-text-secondary/60 focus:outline-none focus:border-primary transition-colors";
const labelClass = "font-sans text-[13px] leading-4 font-medium text-text-secondary";

export function OrderFormModal({ onClose, onCreated, initialPrice }: OrderFormModalProps) {
  const [client, setClient] = useState("");
  const [piece, setPiece] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [price, setPrice] = useState(initialPrice != null ? initialPrice.toFixed(2) : "");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("orders")
      .insert({
        client,
        piece,
        due_date: dueDate || null,
        price: Number(price) || 0,
        link: link || null,
        notes: notes || null,
        status: "Pendiente",
      })
      .select()
      .single();

    setSubmitting(false);

    if (insertError || !data) {
      setError(insertError?.message ?? "No se pudo crear el pedido.");
      return;
    }

    onCreated(data as Order);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-order-title"
        className="w-full max-w-[500px] bg-surface border border-border rounded-xl p-xl flex flex-col gap-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-xs">
          <h2
            id="new-order-title"
            className="font-sans text-headline-md text-text-primary tracking-tight"
          >
            Nuevo pedido
          </h2>
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded hover:bg-surface-subtle flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2xs">
            <label className={labelClass} htmlFor="order-client">
              Cliente
            </label>
            <input
              id="order-client"
              className={inputClass}
              placeholder="Nombre del cliente"
              required
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2xs">
            <label className={labelClass} htmlFor="order-piece">
              Impresión 3D
            </label>
            <input
              id="order-piece"
              className={inputClass}
              placeholder="Nombre de la impresión 3D o modelo"
              required
              value={piece}
              onChange={(e) => setPiece(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div className="flex flex-col gap-2xs">
              <label className={labelClass} htmlFor="order-due-date">
                Fecha de entrega
              </label>
              <input
                id="order-due-date"
                type="date"
                className={inputClass}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2xs">
              <label className={labelClass} htmlFor="order-price">
                Precio (S/)
              </label>
              <input
                id="order-price"
                type="number"
                min="0"
                step="0.01"
                className={inputClass}
                placeholder="S/ 0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2xs">
            <label className={labelClass} htmlFor="order-link">
              Link
            </label>
            <input
              id="order-link"
              type="url"
              className={inputClass}
              placeholder="URL o enlace de referencia"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2xs">
            <label className={labelClass} htmlFor="order-notes">
              Comentarios
            </label>
            <textarea
              id="order-notes"
              rows={3}
              className={`${inputClass} h-auto py-sm resize-none`}
              placeholder="Detalles o comentarios adicionales..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && <p className="font-sans text-body-sm text-error">{error}</p>}

          <div className="flex items-center justify-end gap-sm pt-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 h-10 border border-border bg-transparent hover:bg-surface-subtle hover:border-border-hover text-text-primary font-sans text-label-md rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 h-10 bg-primary hover:bg-primary/90 text-text-on-primary font-sans text-label-md font-semibold rounded-lg transition-all disabled:opacity-60"
            >
              {submitting ? "Creando…" : "Crear pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
