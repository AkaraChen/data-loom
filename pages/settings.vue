<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div class="flex items-center gap-2 mb-4">
      <Icon name="mdi:cog" size="24" class="text-primary" />
      <h1 class="text-2xl font-bold">设置</h1>
    </div>
    
    <div class="grid grid-cols-1 gap-4">
      <!-- API Settings Section -->
      <settings-section title="API 设置" icon="mdi:api">
        <settings-item 
          title="模型供应商" 
          description="选择你想要使用的 AI 模型供应商"
        >
          <select v-model="settings.provider" class="select select-bordered select-sm w-full">
            <option disabled value="">请选择供应商</option>
            <option value="openai">OpenAI</option>
            <option value="google">Google</option>
            <option value="claude">Claude</option>
          </select>
        </settings-item>
        
        <settings-item 
          title="API Key" 
          description="输入你的 API Key 以访问所选供应商的服务"
        >
          <div class="flex">
            <input 
              :type="showApiKey ? 'text' : 'password'" 
              v-model="settings.apiKey" 
              placeholder="输入你的 API Key" 
              class="input input-bordered input-sm flex-1" 
            />
            <button 
              class="btn btn-square btn-outline btn-sm ml-1"
              @click="toggleApiKeyVisibility"
            >
              <Icon :name="showApiKey ? 'mdi:eye-off' : 'mdi:eye'" size="16" />
            </button>
          </div>
        </settings-item>
        
        <settings-item 
          title="API Endpoint" 
          description="可选：自定义 API 端点，如果你需要使用非默认服务器"
        >
          <input 
            type="text" 
            v-model="settings.apiEndpoint" 
            placeholder="输入 API Endpoint（可选）" 
            class="input input-bordered input-sm w-full" 
          />
        </settings-item>
      </settings-section>
      
      <!-- UI Settings Section (Example) -->
      <settings-section title="界面设置" icon="mdi:palette">
        <settings-item 
          title="主题" 
          description="选择应用的显示主题"
        >
          <select v-model="settings.theme" class="select select-bordered select-sm w-full">
            <option value="light">浅色</option>
            <option value="dark">深色</option>
            <option value="system">跟随系统</option>
          </select>
        </settings-item>
      </settings-section>
    </div>
    
    <!-- Save Button -->
    <div class="mt-4 flex justify-end">
      <button 
        @click="saveSettings" 
        class="btn btn-primary btn-sm gap-1"
      >
        <Icon name="mdi:content-save" size="16" />
        保存设置
      </button>
    </div>
    
    <!-- Notification -->
    <div v-if="showNotification" class="toast toast-end">
      <div class="alert alert-success py-2 px-4 min-h-0">
        <Icon name="mdi:check-circle" size="16" />
        <span class="text-sm">设置已保存</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const settings = ref({
  provider: '',
  apiKey: '',
  apiEndpoint: '',
  theme: 'system'
});

const showApiKey = ref(false);
const showNotification = ref(false);

// 从本地存储加载设置
const loadSettings = () => {
  const savedSettings = localStorage.getItem('data-loom-settings');
  if (savedSettings) {
    // Merge saved settings with defaults
    settings.value = {
      ...settings.value,
      ...JSON.parse(savedSettings)
    };
  }
};

// 保存设置到本地存储
const saveSettings = () => {
  localStorage.setItem('data-loom-settings', JSON.stringify(settings.value));
  
  // Show notification
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

// 切换 API Key 可见性
const toggleApiKeyVisibility = () => {
  showApiKey.value = !showApiKey.value;
};

// 页面加载时读取设置
onMounted(() => {
  loadSettings();
});

definePageMeta({
  layout: 'default'
});
</script>
