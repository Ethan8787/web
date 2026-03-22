import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: true,
        port: 5173
    },
    plugins: [react(), Sitemap({ hostname: 'https://ethantw.dev' })],
})
