import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses
    port: 5173
  },
  // Ensure the root is correctly set
  root: process.cwd(), // This should point to where your index.html is
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // Add @ alias pointing to src directory
    },
    extensions: ['.js', '.jsx', '.json']
  }
})