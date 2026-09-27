import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// VITE_BASE_PATH solo se define en el workflow de GitHub Actions
// (ver .github/workflows/deploy-gh-pages.yml). En Netlify y en local
// queda sin definir y Vite usa "/" como siempre.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
})
