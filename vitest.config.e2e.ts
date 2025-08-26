import path from 'path'
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: './test/setup-e2e.ts',
  },
  plugins: [swc.vite()],
  resolve: {
    alias: {
      '@/app.module': path.resolve(__dirname, './src/app.module'),
      '@/pipes': path.resolve(__dirname, './src/pipes'),
      '@/prisma': path.resolve(__dirname, './src/prisma'),
      '@/auth': path.resolve(__dirname, './src/auth'),
    },
  },
})
