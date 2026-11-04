import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/what-if/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icono.svg', 'img/**/*.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json}'],
      },
      manifest: {
        name: 'WHAT IF?',
        short_name: 'WHAT IF?',
        description: 'Minijuegos para descubrir cómo piensas',
        lang: 'es',
        start_url: '/what-if/',
        scope: '/what-if/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#fff8e7',
        theme_color: '#ff8a3d',
        icons: [
          { src: 'icons/icono-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icono-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icono.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
    }),
  ],
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
