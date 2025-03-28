// 设置类型定义
export interface SettingsState {
  provider: string
  model: string
  apiKey: string
  apiEndpoint: string
  theme: string
}

// 默认设置值
const DEFAULT_SETTINGS: SettingsState = {
  provider: 'openai',
  model: '',
  apiKey: '',
  apiEndpoint: '',
  theme: 'system',
}

// 设置存储
export const useSettingsStore = defineStore(
  'settings',
  () => {
    // 状态
    const provider = ref(DEFAULT_SETTINGS.provider)
    const model = ref(DEFAULT_SETTINGS.model)
    const apiKey = ref(DEFAULT_SETTINGS.apiKey)
    const apiEndpoint = ref(DEFAULT_SETTINGS.apiEndpoint)
    const theme = ref(DEFAULT_SETTINGS.theme)

    // 更新设置
    function updateSettings(settings: Partial<SettingsState>) {
      if (settings.provider !== undefined) provider.value = settings.provider
      if (settings.model !== undefined) model.value = settings.model
      if (settings.apiKey !== undefined) apiKey.value = settings.apiKey
      if (settings.apiEndpoint !== undefined)
        apiEndpoint.value = settings.apiEndpoint
      if (settings.theme !== undefined) theme.value = settings.theme
    }

    // 重置设置
    function resetSettings() {
      provider.value = DEFAULT_SETTINGS.provider
      model.value = DEFAULT_SETTINGS.model
      apiKey.value = DEFAULT_SETTINGS.apiKey
      apiEndpoint.value = DEFAULT_SETTINGS.apiEndpoint
      theme.value = DEFAULT_SETTINGS.theme
    }

    // 导出状态和方法
    return {
      provider,
      model,
      apiKey,
      apiEndpoint,
      theme,
      updateSettings,
      resetSettings,
    }
  },
  {
    // 配置持久化
    persist: {
      key: 'data-loom-settings',
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    },
  },
)
