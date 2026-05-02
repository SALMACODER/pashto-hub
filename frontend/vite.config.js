import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // "/api/..." is forwarded to the Express server in dev (avoids CORS + IPv4/IPv6 issues)
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
      // Locally-uploaded book covers / PDFs are served from the backend at
      // /uploads/<bucket>/<file>. Without this proxy the dev server would
      // 404 on every local-mode upload.
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split heavy vendor libs into their own long-cacheable chunks.
        manualChunks: {
          'react-vendor':  ['react', 'react-dom'],
          'router':        ['react-router-dom'],
          'icons':         ['react-icons', 'lucide-react'],
          'http':          ['axios'],
        },
      },
    },
  },
  esbuild: {
    // Strip console/debugger from production bundles for smaller, faster code.
    drop: ['debugger'],
    pure: ['console.log', 'console.debug'],
  },
})
