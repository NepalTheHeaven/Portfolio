import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const staticRoutes = [
  'work',
  'work/edit-01',
  'work/edit-02',
  'work/edit-03',
  'work/edit-04',
  'work/edit-05',
  'apps',
  'apps/samadhan',
  'apps/national-winning-project',
  'story',
  'contact',
]

const PRODUCTION_CSP = [
  "default-src 'self'",
  "script-src 'self' 'report-sample'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://nepaltheheaven.github.io",
  "media-src 'self'",
  "connect-src 'self' https://gaktvjyrdznirvxgsxem.supabase.co",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ')

function githubPagesSpaPlugin() {
  return {
    name: 'github-pages-spa',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (ctx.server) return html
        return html.replace(
          '<meta charset="UTF-8" />',
          `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${PRODUCTION_CSP}" />`,
        )
      },
    },
    closeBundle() {
      const outDir = resolve('dist')
      const indexHtml = resolve(outDir, 'index.html')
      copyFileSync(indexHtml, resolve(outDir, '404.html'))
      writeFileSync(resolve(outDir, '.nojekyll'), '')
      for (const route of staticRoutes) {
        const target = resolve(outDir, route, 'index.html')
        mkdirSync(dirname(target), { recursive: true })
        copyFileSync(indexHtml, target)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/Portfolio/',
  plugins: [react(), githubPagesSpaPlugin()],
})
