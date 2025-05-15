import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://clubpage-api-env.eba-rstfvjmj.us-west-1.elasticbeanstalk.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
        ws: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src')
    },
    dedupe: ['@radix-ui/react-label', '@radix-ui/react-dialog', '@radix-ui/react-slot', '@radix-ui/react-toast']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    },
    outDir: 'dist',
    sourcemap: true,
  },
  preview: {
    port: 5173,
  }
})