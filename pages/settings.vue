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
          <select v-model="settingsStore.provider" class="select select-bordered select-sm w-full">
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
              v-model="settingsStore.apiKey" 
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
            v-model="settingsStore.apiEndpoint" 
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
          <select v-model="settingsStore.theme" class="select select-bordered select-sm w-full">
            <option value="light">浅色</option>
            <option value="dark">深色</option>
            <option value="system">跟随系统</option>
          </select>
        </settings-item>
      </settings-section>
    </div>
  </div>
</template>

<script setup>
import { useToggle } from '@vueuse/core';

const settingsStore = useSettingsStore();

// 切换 API Key 可见性
const [showApiKey,toggleApiKeyVisibility] = useToggle(false)

definePageMeta({
  layout: 'default'
});
</script>
