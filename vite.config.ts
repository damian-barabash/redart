import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH ustawia workflow GitHub Pages (np. "/redart/"); przy własnej domenie zostaje "/".
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1100 },
})
