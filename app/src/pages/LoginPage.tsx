import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

export function LoginPage() {
  const { session, signInWithPassword, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (session) return <Navigate to="/pedidos" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);

    const result =
      mode === "signin" ? await signInWithPassword(email, password) : await signUp(email, password);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (mode === "signup") {
      setNotice("Cuenta creada. Revisa tu correo si se requiere confirmación, o inicia sesión.");
      setMode("signin");
    }
  }

  async function handleGoogle() {
    setError(null);
    const result = await signInWithGoogle();
    if (result.error) setError(result.error);
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Escribe tu correo arriba y luego pulsa \"¿Olvidaste tu contraseña?\".");
      return;
    }
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
    setNotice(resetError ? null : `Te enviamos un enlace de recuperación a ${email}.`);
    if (resetError) setError(resetError.message);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 bg-background">
      <div className="w-full max-w-[440px] bg-surface border border-border rounded-2xl p-7 sm:p-9 relative overflow-hidden">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white mb-4">
            <div className="w-5 h-5 rounded-[4px] bg-background" />
          </div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-white">
            {mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
        </div>

        <div className="space-y-4 mb-6">
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-xl border border-border bg-surface-subtle hover:bg-surface-container-high font-sans text-sm font-medium text-text-primary transition-colors duration-150"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>
          <div className="relative flex items-center justify-center">
            <div className="border-t border-border/70 w-full" />
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-sans font-medium text-text-secondary mb-1.5" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@gmail.com"
              className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-border rounded-lg font-sans text-sm text-white placeholder:text-text-secondary/60 focus:outline-none focus:border-border-hover transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-text-secondary mb-1.5" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 pr-11 bg-surface-container-lowest border border-border rounded-lg font-sans text-sm text-white placeholder:text-text-secondary/60 focus:outline-none focus:border-border-hover transition-colors"
              />
              <button
                type="button"
                aria-label="Alternar visibilidad de contraseña"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-secondary hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-surface-container-lowest border-border cursor-pointer"
              />
              <span className="font-sans text-text-secondary group-hover:text-white transition-colors">
                Recordar sesión
              </span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="font-sans text-text-secondary hover:text-white transition-colors font-medium hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {error && <p className="font-sans text-body-sm text-error">{error}</p>}
          {notice && <p className="font-sans text-body-sm text-status-delivered-text">{notice}</p>}

          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-white hover:bg-white/90 text-background font-sans font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <span>{submitting ? "Un momento…" : mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-border/60 text-center text-xs font-sans text-text-secondary">
          {mode === "signin" ? (
            <>
              ¿No tienes una cuenta aún?{" "}
              <button
                type="button"
                className="text-white hover:underline font-semibold ml-1"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setNotice(null);
                }}
              >
                Regístrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                className="text-white hover:underline font-semibold ml-1"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                  setNotice(null);
                }}
              >
                Inicia sesión
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
