import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // El Service Worker se actualiza solo
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Leones Fan App',
        short_name: 'Leones App',
        description: 'Resultados en vivo y estadísticas de los Leones de Yucatán.',
        theme_color: '#000000',      // Barra de estado negra tipo iOS
        background_color: '#000000', // Fondo de la pantalla de carga (splash screen)
        display: 'standalone',       // Oculta la barra del navegador (experiencia nativa)
        orientation: 'portrait',     // Bloquea en vertical
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Para los íconos adaptativos de Android
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})