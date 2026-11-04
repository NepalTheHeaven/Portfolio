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

function githubPagesSpaPlugin() {
  return {
    name: 'github-pages-spa',
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
