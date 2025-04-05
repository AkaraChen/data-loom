import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/icon',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    '@hebilicious/vue-query-nuxt',
    'nuxt-monaco-editor',
    '@nuxt/fonts',
  ],
  css: ['@/assets/app.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  ssr: false,

  // 托管模式配置
  runtimeConfig: {
    public: {
      managedMode: false,
      apiProvider: 'openai',
      apiKey: '',
      apiEndpoint: '',
      model: '',
    },
  },
})
