import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/manual_of_arms/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
})
