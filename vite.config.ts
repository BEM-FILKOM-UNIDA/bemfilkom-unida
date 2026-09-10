import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { target: 'esnext' }, // ponytail: native esnext tanpa transpile Baseline — hemat 11KB polyfill
})