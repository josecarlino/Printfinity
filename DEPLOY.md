# Desplegar Printfinity

Dos plataformas gratuitas: **Supabase** (base de datos + autenticación) y **Netlify** (hosting del sitio). Sigue los pasos en orden la primera vez; los pasos 1-4 también son necesarios para poder usar la app en local.

## 1. Crear el proyecto de Supabase

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta (con GitHub o email).
2. **New project** → elige un nombre, una región cercana a ti, y una contraseña de base de datos (guárdala, no la necesitarás en el día a día).
3. Espera 1-2 minutos a que el proyecto termine de aprovisionarse.

## 2. Crear la tabla de pedidos

1. En el panel del proyecto, abre **SQL Editor → New query**.
2. Pega todo el contenido de [`app/supabase/schema.sql`](app/supabase/schema.sql) y pulsa **Run**.
3. Verifica en **Table Editor** que aparece la tabla `orders`.

Esto crea la tabla con seguridad a nivel de fila (RLS): cada usuario solo puede ver, crear, editar y borrar sus propios pedidos.

## 3. Activar los métodos de acceso (Auth)

**Email/contraseña** viene activo por defecto en **Authentication → Providers → Email**. No requiere nada más.

**Google (opcional pero recomendado, así funciona el botón "Continuar con Google")**:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/) → crea un proyecto (o usa uno existente) → **APIs & Services → OAuth consent screen**: configúralo como "External", con tu correo, y publícalo (o déjalo en modo prueba y agrégate a ti mismo como "Test user").
2. **APIs & Services → Credentials → Create Credentials → OAuth client ID** → tipo **Web application**.
3. En **Authorized redirect URIs** agrega la URL de callback de tu proyecto Supabase (la encuentras en Supabase, **Authentication → Providers → Google**, campo "Callback URL"): algo como `https://<tu-proyecto>.supabase.co/auth/v1/callback`.
4. Copia el **Client ID** y **Client secret** generados.
5. En Supabase, **Authentication → Providers → Google**: actívalo y pega ahí el Client ID y Client secret. Guarda.

## 4. Configurar URLs permitidas

En Supabase, **Authentication → URL Configuration**:

- **Site URL**: por ahora `http://localhost:5173` (lo cambiarás por la URL real en el paso 7).
- **Redirect URLs**: agrega `http://localhost:5173/pedidos` (y más adelante la URL de Netlify + `/pedidos`).

## 5. Configurar y probar en local

1. En `app/`, copia `.env.example` a `.env` y pega tu **Project URL** y **anon public key** (Supabase → **Project Settings → API**).
2. Instala dependencias y corre la app:

   ```
   npm install
   npm run dev
   ```

3. Abre `http://localhost:5173`, prueba registrarte con correo/contraseña (o Google si ya lo configuraste), crear un pedido, editarlo, cambiar su estado, marcarlo pagado, eliminarlo, y usar la calculadora.

Si vas a ser el único usuario, después de crear tu cuenta puedes desactivar altas públicas en **Authentication → Providers → Email → "Allow new users to sign up"** (desactívalo) para que nadie más pueda registrarse.

## 6. Compilar para producción

```
npm run build
```

Esto genera `app/dist/` con los archivos estáticos listos para publicar.

## 7. Publicar en Netlify

**Opción rápida (sin cuenta de GitHub):**

1. Entra a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastra la carpeta `app/dist` completa.
3. En segundos obtienes una URL pública (ej. `https://algo-al-azar.netlify.app`). Puedes renombrarla en **Site settings → Change site name**.

**Opción con auto-despliegue (recomendada a mediano plazo):** sube el proyecto a un repositorio de GitHub, luego en Netlify **Add new site → Import an existing project**, conecta el repo, y configura:
- Base directory: `app`
- Build command: `npm run build`
- Publish directory: `app/dist`
- Variables de entorno (Site settings → Environment variables): `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los mismos valores de tu `.env`.

Así, cada vez que hagas `git push`, Netlify recompila y publica automáticamente.

## 8. Registrar la URL final

Con la URL de Netlify ya asignada:

1. En Supabase → **Authentication → URL Configuration**: cambia **Site URL** a tu URL de Netlify, y agrega `https://tu-sitio.netlify.app/pedidos` a **Redirect URLs** (deja también la de `localhost` si seguirás probando en local).
2. Si activaste Google OAuth, en Google Cloud Console → tu credencial OAuth → agrega tu dominio de Netlify a **Authorized JavaScript origins** (`https://tu-sitio.netlify.app`). El **Authorized redirect URI** no cambia: sigue siendo la URL de callback de Supabase del paso 3.

## Checklist final

- [ ] Login con correo/contraseña funciona en la URL de producción.
- [ ] Login con Google funciona en la URL de producción (si lo activaste).
- [ ] Crear, editar, cambiar estado, marcar pagado y eliminar un pedido funciona y persiste al recargar.
- [ ] Buscar, filtrar por estado/pago y paginar funciona.
- [ ] La calculadora calcula bien y "Usar en nuevo pedido" precarga el precio en el modal de alta.
