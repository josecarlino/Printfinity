# Printfinity

App de gestión de pedidos de impresión 3D: login, listado de pedidos con filtros y calculadora de precios. Construida a partir de los mockups de Google Stitch en `../` usando el sistema de diseño "Precision Dark" (`../precision_dark/DESIGN.md`).

Stack: Vite + React + TypeScript + Tailwind CSS v4, con Supabase (Postgres + Auth) como backend.

## Desarrollo local

1. Instala dependencias:

   ```
   npm install
   ```

2. Copia `.env.example` a `.env` y completa `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` con los datos de tu proyecto de Supabase (ver `DEPLOY.md` en la raíz del repo para crearlo).

3. Levanta el servidor de desarrollo:

   ```
   npm run dev
   ```

4. Abre `http://localhost:5173`.

## Build de producción

```
npm run build
```

Genera la carpeta `dist/` lista para desplegar como sitio estático (ver `DEPLOY.md`).

## Estructura

- `src/pages` — Login, Pedidos, Calculadora.
- `src/components` — Header, modales de pedido, badge de estado.
- `src/context/AuthContext.tsx` — sesión y métodos de autenticación (Supabase Auth).
- `src/lib/supabaseClient.ts` — cliente de Supabase.
- `supabase/schema.sql` — tabla `orders` + políticas de seguridad (RLS).

## Cambiar el logo

Reemplaza `public/logo.svg` por tu logo (mismo nombre de archivo) y vuelve a compilar. No hace falta tocar código.
