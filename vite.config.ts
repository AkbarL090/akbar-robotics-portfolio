import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '127.0.0.1',
    fs: {
      deny: [
        '.env', '.env.*', '*.{crt,pem,key,zip,pdf}',
        '**/.git/**', '**/.local/**', '**/recovery/**',
        '**/references/**', '**/docs/**',
      ],
    },
  },
})
