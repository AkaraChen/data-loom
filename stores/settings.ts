// 设置存储
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    provider: '',
    apiKey: '',
    apiEndpoint: '',
    theme: 'system'
  }),
  
  actions: {
    // 更新设置
    updateSettings(settings: Partial<{
      provider: string;
      apiKey: string;
      apiEndpoint: string;
      theme: string;
    }>) {
      if (settings.provider !== undefined) this.provider = settings.provider;
      if (settings.apiKey !== undefined) this.apiKey = settings.apiKey;
      if (settings.apiEndpoint !== undefined) this.apiEndpoint = settings.apiEndpoint;
      if (settings.theme !== undefined) this.theme = settings.theme;
    },
    
    // 重置设置
    resetSettings() {
      this.provider = '';
      this.apiKey = '';
      this.apiEndpoint = '';
      this.theme = 'system';
    }
  },
  
  // 配置持久化
  persist: {
    key: 'data-loom-settings'
  }
});
