import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const makanReelsDir = path.resolve(rootDir, '../Makan/public/reels')

function serveMakanReels() {
  return {
    name: 'serve-makan-reels',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/reels/')) {
          next()
          return
        }

        const relative = decodeURIComponent(req.url.slice('/reels/'.length).split('?')[0] || '')
        const filePath = path.resolve(makanReelsDir, relative)
        if (!filePath.startsWith(makanReelsDir) || !fs.existsSync(filePath)) {
          next()
          return
        }

        res.setHeader('Content-Type', 'video/mp4')
        fs.createReadStream(filePath).pipe(res)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), serveMakanReels()],
  server: {
    port: 5174,
    open: true,
  },
})
