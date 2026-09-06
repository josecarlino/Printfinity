import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Logo } from "./Logo";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `py-xs font-sans text-label-md transition-colors ${
    isActive
      ? "text-text-primary border-b-2 border-primary pt-0.5"
      : "text-text-secondary hover:text-text-primary"
  }`;

export function Header() {
  const { session, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const email = session?.user.email ?? "";

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest border-b border-border">
      <div className="relative h-16 max-w-page mx-auto px-layout-mobile md:px-layout-desktop flex items-center justify-between">
        <Logo />
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-xl">
          <NavLink to="/pedidos" className={navLinkClass}>
            Pedidos
          </NavLink>
          <NavLink to="/calculadora" className={navLinkClass}>
            Calculadora
          </NavLink>
        </nav>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-surface border border-border hover:border-border-hover transition-colors cursor-pointer select-none"
          >
            <span className="font-sans text-label-sm text-text-primary hidden sm:inline max-w-[160px] truncate">
              {email}
            </span>
            <span className="material-symbols-outlined text-text-secondary text-base">
              expand_more
            </span>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-20 min-w-[180px] bg-surface border border-border rounded-lg py-1 shadow-2xl">
                <button
                  type="button"
                  onClick={signOut}
                  className="w-full text-left px-3 py-2 font-sans text-body-md text-text-primary hover:bg-surface-subtle transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
