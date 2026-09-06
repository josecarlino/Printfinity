interface LogoProps {
  size?: number;
  showName?: boolean;
}

/**
 * Reemplaza /public/logo.svg por el logo real cuando esté listo;
 * este componente no necesita cambios.
 */
export function Logo({ size = 28, showName = true }: LogoProps) {
  return (
    <div className="flex items-center gap-sm">
      <img src="/logo.svg" alt="Printfinity" width={size} height={size} className="rounded" />
      {showName && (
        <span className="font-sans text-headline-sm text-text-primary tracking-tight">
          Printfinity
        </span>
      )}
    </div>
  );
}
