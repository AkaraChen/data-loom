<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">设置</h1>
    
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">API 设置</h2>
        
        <form @submit.prevent="saveSettings">
          <div class="form-control w-full max-w-md mb-4">
            <label class="label">
              <span class="label-text">模型供应商</span>
            </label>
            <select v-model="settings.provider" class="select select-bordered w-full">
              <option disabled value="">请选择供应商</option>
              <option value="openai">OpenAI</option>
              <option value="google">Google</option>
              <option value="claude">Claude</option>
            </select>
          </div>
          
          <div class="form-control w-full max-w-md mb-4">
            <label class="label">
              <span class="label-text">API Key</span>
            </label>
            <input 
              type="password" 
              v-model="settings.apiKey" 
              placeholder="输入你的 API Key" 
              class="input input-bordered w-full" 
            />
          </div>
          
          <div class="form-control w-full max-w-md mb-6">
            <label class="label">
              <span class="label-text">API Endpoint</span>
            </label>
            <input 
              type="text" 
              v-model="settings.apiEndpoint" 
              placeholder="输入 API Endpoint（可选）" 
              class="input input-bordered w-full" 
            />
          </div>
          
          <div class="flex justify-end">
            <button type="submit" class="btn btn-primary">保存设置</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const settings = ref({
  provider: '',
  apiKey: '',
  apiEndpoint: ''
});

// 从本地存储加载设置
const loadSettings = () => {
  const savedSettings = localStorage.getItem('data-loom-settings');
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings);
  }
};

// 保存设置到本地存储
const saveSettings = () => {
  localStorage.setItem('data-loom-settings', JSON.stringify(settings.value));
  alert('设置已保存');
};

// 页面加载时读取设置
onMounted(() => {
  loadSettings();
});

definePageMeta({
  layout: 'default'
})
</script>
