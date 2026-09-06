interface NumberFieldProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  inputClassName: string;
  prefix?: string;
  suffix?: string;
}

function clamp(value: number, min?: number, max?: number) {
  let next = value;
  if (min != null && next < min) next = min;
  if (max != null && next > max) next = max;
  return next;
}

export function NumberField({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  inputClassName,
  prefix,
  suffix,
}: NumberFieldProps) {
  function handleStep(delta: number) {
    const precision = step < 1 ? String(step).split(".")[1]?.length ?? 0 : 0;
    const next = Number((value + delta).toFixed(precision));
    onChange(clamp(next, min, max));
  }

  return (
    <div className="relative group">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-sans text-label-sm select-none pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className={inputClassName}
      />
      {suffix && (
        <span className="absolute right-7 top-1/2 -translate-y-1/2 text-text-secondary font-sans text-label-sm select-none pointer-events-none">
          {suffix}
        </span>
      )}
      <div className="absolute right-1 inset-y-1 hidden group-hover:flex flex-col w-5 overflow-hidden rounded">
        <button
          type="button"
          tabIndex={-1}
          onClick={() => handleStep(step)}
          className="flex-1 min-h-0 flex items-center justify-center overflow-hidden text-text-primary hover:opacity-70"
          aria-label="Aumentar"
        >
          <span className="material-symbols-outlined text-[12px] leading-none">keyboard_arrow_up</span>
        </button>
        <button
          type="button"
          tabIndex={-1}
          onClick={() => handleStep(-step)}
          className="flex-1 min-h-0 flex items-center justify-center overflow-hidden text-text-primary hover:opacity-70"
          aria-label="Disminuir"
        >
          <span className="material-symbols-outlined text-[12px] leading-none">keyboard_arrow_down</span>
        </button>
      </div>
    </div>
  );
}
