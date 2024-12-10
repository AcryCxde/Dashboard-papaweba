import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       // Укажите порт, который хотите использовать
    strictPort: true, // Если порт занят, завершить работу
  },
})
