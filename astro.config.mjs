import { defineConfig, passthroughImageService } from 'astro/config'

export default defineConfig({
  site: 'https://outcast.pages.dev',
  output: 'static',
  image: {
    service: passthroughImageService(),
  },
})
