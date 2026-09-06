import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { NumberField } from "../components/NumberField";
import { formatCurrency } from "../lib/format";

interface Piece {
  id: string;
  gramos: number;
  horas: number;
  minutos: number;
}

let pieceSeq = 0;
function newPiece(gramos = 0, horas = 0, minutos = 0): Piece {
  pieceSeq += 1;
  return { id: `piece-${pieceSeq}`, gramos, horas, minutos };
}

// Inputs que están directamente sobre la tarjeta (bg-surface): necesitan un fondo
// más claro para distinguirse en reposo, no solo al enfocarlos.
const baseFieldClass =
  "w-full h-10 pr-6 px-3 bg-surface-subtle text-text-primary font-sans text-body-md rounded-lg focus:outline-none focus:bg-surface-container transition-colors";
// Inputs dentro de una fila de pieza (bg-surface-subtle): usan el fondo más oscuro.
const pieceFieldClass =
  "w-full h-10 pr-6 px-3 bg-surface text-text-primary font-sans text-body-md rounded-lg focus:outline-none focus:bg-surface-container transition-colors";

export function CalculatorPage() {
  const navigate = useNavigate();

  const [costoGramo, setCostoGramo] = useState(0.06);
  const [costoEnergiaMin, setCostoEnergiaMin] = useState(0.02);
  const [manoObra, setManoObra] = useState(0);
  const [margenPct, setMargenPct] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>([newPiece(0, 0, 0)]);

  const totals = useMemo(() => {
    const totalGramos = pieces.reduce((sum, p) => sum + (p.gramos || 0), 0);
    const totalMinutos = pieces.reduce((sum, p) => sum + (p.horas || 0) * 60 + (p.minutos || 0), 0);
    const costoMaterial = totalGramos * costoGramo;
    const costoEnergia = totalMinutos * costoEnergiaMin;
    const subtotal = costoMaterial + costoEnergia + manoObra;
    const montoMargen = subtotal * (margenPct / 100);
    const precioFinal = subtotal + montoMargen;
    return { totalGramos, totalMinutos, costoMaterial, costoEnergia, subtotal, montoMargen, precioFinal };
  }, [pieces, costoGramo, costoEnergiaMin, manoObra, margenPct]);

  function updatePiece(id: string, patch: Partial<Piece>) {
    setPieces((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function removePiece(id: string) {
    setPieces((prev) => {
      if (prev.length <= 1) {
        return prev.map((p) => (p.id === id ? { ...p, gramos: 0, horas: 0, minutos: 0 } : p));
      }
      return prev.filter((p) => p.id !== id);
    });
  }

  function addPiece() {
    setPieces((prev) => [...prev, newPiece()]);
  }

  function handleUseInNewOrder() {
    navigate("/pedidos", { state: { prefillPrice: Number(totals.precioFinal.toFixed(2)) } });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="flex flex-col w-full max-w-page mx-auto px-layout-mobile md:px-layout-desktop py-xl">
          <div className="mb-xl">
            <h1 className="font-sans text-headline-lg text-text-primary tracking-tight">
              Calculadora de precios
            </h1>
            <p className="font-sans text-body-md text-text-secondary mt-1">
              Calcula el precio final de una impresión
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
            <div className="lg:col-span-8 bg-surface rounded-xl p-xl space-y-xl">
              <div>
                <h2 className="font-sans text-headline-sm text-text-primary mb-sm flex items-center gap-xs">
                  <span className="material-symbols-outlined text-text-secondary">tune</span>
                  Costos operativos base
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div className="space-y-2xs">
                    <label className="block font-sans text-label-sm text-text-secondary" htmlFor="costo-gramo">
                      Costo de filamento por gramo (S/)
                    </label>
                    <NumberField
                      id="costo-gramo"
                      step={0.01}
                      min={0}
                      value={costoGramo}
                      onChange={setCostoGramo}
                      inputClassName={`${baseFieldClass} pl-8`}
                      prefix="S/"
                    />
                  </div>
                  <div className="space-y-2xs">
                    <label className="block font-sans text-label-sm text-text-secondary" htmlFor="costo-energia">
                      Costo de energía por minuto (S/)
                    </label>
                    <NumberField
                      id="costo-energia"
                      step={0.005}
                      min={0}
                      value={costoEnergiaMin}
                      onChange={setCostoEnergiaMin}
                      inputClassName={`${baseFieldClass} pl-8`}
                      prefix="S/"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-xs">
                    <span className="font-sans text-headline-sm text-text-primary">Piezas de la impresión</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-subtle text-text-secondary font-sans text-table-header uppercase tracking-wider">
                      {pieces.length} {pieces.length === 1 ? "pieza" : "piezas"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addPiece}
                    className="inline-flex items-center gap-1 font-sans text-label-md text-primary hover:text-text-secondary transition-colors py-1 px-2 rounded hover:bg-surface-subtle"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Agregar pieza</span>
                  </button>
                </div>
                <div className="space-y-xs">
                  {pieces.map((piece, index) => (
                    <div
                      key={piece.id}
                      className="bg-surface-subtle p-sm rounded-lg flex flex-col sm:flex-row items-stretch sm:items-end gap-sm"
                    >
                      <div className="flex items-center justify-center sm:h-10 sm:self-end">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-surface border border-border text-text-secondary font-sans text-label-sm select-none">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 space-y-2xs">
                        <label className="block font-sans text-table-header uppercase tracking-wider text-text-secondary">
                          Gramos
                        </label>
                        <NumberField
                          min={0}
                          value={piece.gramos}
                          onChange={(v) => updatePiece(piece.id, { gramos: v })}
                          inputClassName={pieceFieldClass}
                        />
                      </div>
                      <div className="flex-1 space-y-2xs">
                        <label className="block font-sans text-table-header uppercase tracking-wider text-text-secondary">
                          Horas
                        </label>
                        <NumberField
                          min={0}
                          value={piece.horas}
                          onChange={(v) => updatePiece(piece.id, { horas: v })}
                          inputClassName={pieceFieldClass}
                        />
                      </div>
                      <div className="flex-1 space-y-2xs">
                        <label className="block font-sans text-table-header uppercase tracking-wider text-text-secondary">
                          Minutos
                        </label>
                        <NumberField
                          min={0}
                          max={59}
                          value={piece.minutos}
                          onChange={(v) => updatePiece(piece.id, { minutos: v })}
                          inputClassName={pieceFieldClass}
                        />
                      </div>
                      <div className="flex justify-end items-center sm:pb-0.5">
                        <button
                          type="button"
                          title="Eliminar fila"
                          onClick={() => removePiece(piece.id)}
                          className="h-10 w-10 flex items-center justify-center text-text-secondary hover:text-error hover:bg-surface rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-body-lg">close</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-xs">
                <h2 className="font-sans text-headline-sm text-text-primary mb-sm flex items-center gap-xs">
                  <span className="material-symbols-outlined text-text-secondary">engineering</span>
                  Honorarios &amp; Rentabilidad
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div className="space-y-2xs">
                    <label className="block font-sans text-label-sm text-text-secondary" htmlFor="mano-obra">
                      Mano de obra / diseño (S/)
                    </label>
                    <NumberField
                      id="mano-obra"
                      min={0}
                      step={0.5}
                      value={manoObra}
                      onChange={setManoObra}
                      inputClassName={`${baseFieldClass} pl-8`}
                      prefix="S/"
                    />
                  </div>
                  <div className="space-y-2xs">
                    <label className="block font-sans text-label-sm text-text-secondary" htmlFor="margen">
                      Margen de ganancia (%)
                    </label>
                    <NumberField
                      id="margen"
                      min={0}
                      step={1}
                      value={margenPct}
                      onChange={setMargenPct}
                      inputClassName={`${baseFieldClass} pr-12`}
                      suffix="%"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 sticky top-20">
              <div className="bg-surface rounded-xl p-xl space-y-lg">
                <div className="flex items-center justify-between pb-xs border-b border-border/50">
                  <span className="font-sans text-headline-sm text-text-primary">Resumen</span>
                  <span className="material-symbols-outlined text-text-secondary text-base">receipt_long</span>
                </div>
                <div className="space-y-md py-xs">
                  <div className="flex items-center justify-between text-body-md">
                    <span className="font-sans text-text-secondary flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      Material ({totals.totalGramos}g)
                    </span>
                    <span className="font-sans text-label-md text-text-primary">
                      {formatCurrency(totals.costoMaterial)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-body-md">
                    <span className="font-sans text-text-secondary flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      Energía ({totals.totalMinutos}m)
                    </span>
                    <span className="font-sans text-label-md text-text-primary">
                      {formatCurrency(totals.costoEnergia)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-body-md">
                    <span className="font-sans text-text-secondary flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      Mano de obra
                    </span>
                    <span className="font-sans text-label-md text-text-primary">{formatCurrency(manoObra)}</span>
                  </div>
                </div>
                <div className="h-px w-full bg-surface-variant" />
                <div className="space-y-md py-xs">
                  <div className="flex items-center justify-between text-body-md">
                    <span className="font-sans text-label-md text-text-primary">Subtotal costo</span>
                    <span className="font-sans text-label-md text-text-primary">
                      {formatCurrency(totals.subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-body-md">
                    <span className="font-sans text-text-secondary">Margen ({margenPct}%)</span>
                    <span className="font-sans text-label-md text-text-primary">
                      {formatCurrency(totals.montoMargen)}
                    </span>
                  </div>
                </div>
                <div className="h-px w-full bg-surface-variant" />
                <div className="bg-surface-subtle p-md rounded-lg flex flex-col gap-xs">
                  <span className="font-sans text-label-sm text-text-secondary tracking-wide">
                    Precio final recomendado
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-sans text-headline-lg tracking-tight font-bold text-text-primary">
                      {formatCurrency(totals.precioFinal)}
                    </span>
                    <span className="font-sans text-table-header uppercase text-text-secondary">Soles</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleUseInNewOrder}
                  className="w-full h-10 rounded-lg bg-primary text-text-on-primary font-sans text-label-md font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Usar en nuevo pedido
                </button>
                <p className="text-center font-sans text-body-sm text-text-secondary select-none">
                  Valores actualizados automáticamente
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
