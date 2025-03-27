import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [],
  css: ['@/assets/app.css'],
  vite: {
    plugins: [
      // @ts-expect-error fuck vite
      tailwindcss()
    ]
  }
})
