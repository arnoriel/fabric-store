import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Fungsi ini akan memisahkan library di node_modules menjadi file tersendiri
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    // Opsional: menaikkan limit sedikit ke 600kb agar lebih fleksibel
    chunkSizeWarningLimit: 600,
  }
})