import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

const { DIRECTUS_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '')

export default defineConfig({
  site: 'https://outcast.pages.dev',
  output: 'static',
  image: {
    // Authorize the Directus asset endpoint so Astro <Image /> downloads and
    // optimizes remote images at build time (served from Pages CDN, not Directus).
    remotePatterns: DIRECTUS_URL
      ? [{ protocol: new URL(DIRECTUS_URL).protocol.replace(':', ''), hostname: new URL(DIRECTUS_URL).hostname }]
      : [],
  },
})
