<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div class="flex items-center gap-2 mb-4">
      <Icon name="mdi:cog" size="24" class="text-primary" />
      <h1 class="text-2xl font-bold">设置</h1>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <!-- 托管模式提示 -->
      <div v-if="isManagedMode" class="alert alert-success shadow-sm">
        <Icon name="mdi:information" size="20" />
        <span>应用当前处于托管模式，API 设置由系统管理员配置。</span>
      </div>

      <!-- API Settings Section -->
      <SettingsSection v-if="!isManagedMode" title="API 设置" icon="mdi:api">
        <SettingsItem
          title="模型供应商"
          description="选择你想要使用的 AI 模型供应商"
        >
          <div class="relative group">
            <select
              v-model="settingsStore.provider"
              class="select select-bordered select-sm w-full cursor-not-allowed opacity-80"
              disabled
              title="暂不支持切换模型供应商"
            >
              <option disabled value="">请选择供应商</option>
              <option value="openai">OpenAI</option>
              <option value="google">Google</option>
              <option value="claude">Claude</option>
            </select>
            <div
              class="tooltip tooltip-top absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-base-300 text-base-content px-2 py-1 rounded text-xs whitespace-nowrap"
            >
              暂不支持切换模型供应商
            </div>
          </div>
        </SettingsItem>

        <SettingsItem
          title="模型"
          description="选择要使用的模型（留空则使用默认模型）"
        >
          <div class="w-full">
            <select
              v-model="settingsStore.model"
              class="select select-bordered select-sm w-full"
              :disabled="!settingsStore.apiKey"
            >
              <option value="">默认模型 (gpt-3.5-turbo)</option>
              <template v-if="isLoadingModels">
                <option disabled>加载中...</option>
              </template>
              <template v-else-if="isModelsError">
                <option disabled>加载失败，请检查 API Key</option>
              </template>
              <template v-else-if="models && models.length">
                <option
                  v-for="model in models"
                  :key="model.id"
                  :value="model.id"
                >
                  {{ model.id }}
                </option>
              </template>
            </select>
            <p
              class="text-xs text-base-content/70 mt-1"
              v-if="!settingsStore.apiKey"
            >
              请先设置 API Key 以加载可用模型
            </p>
          </div>
        </SettingsItem>

        <SettingsItem
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
              @click="toggleApiKeyVisibility()"
            >
              <Icon :name="showApiKey ? 'mdi:eye-off' : 'mdi:eye'" size="16" />
            </button>
          </div>
        </SettingsItem>

        <SettingsItem
          title="API Endpoint"
          description="可选：自定义 API 端点，如果你需要使用非默认服务器"
        >
          <input
            type="text"
            v-model="settingsStore.apiEndpoint"
            placeholder="输入 API Endpoint（可选）"
            class="input input-bordered input-sm w-full"
          />
        </SettingsItem>
      </SettingsSection>

      <!-- UI Settings Section (Example) -->
      <SettingsSection title="界面设置" icon="mdi:palette">
        <SettingsItem title="主题" description="选择应用的显示主题">
          <select
            v-model="settingsStore.theme"
            class="select select-bordered select-sm w-full"
          >
            <option value="light">浅色</option>
            <option value="dark">深色</option>
            <option value="system">跟随系统</option>
          </select>
        </SettingsItem>
      </SettingsSection>
    </div>
  </div>
</template>

<script setup>
import { useToggle } from '@vueuse/core'
import { useModels } from '~/composables/use-models'
import { useRuntimeConfig } from '#imports'
import { computed } from 'vue'

const settingsStore = useSettingsStore()

// 获取可用的模型列表
const {
  models,
  isLoading: isLoadingModels,
  isError: isModelsError,
} = useModels()

// 切换 API Key 可见性
const [showApiKey, toggleApiKeyVisibility] = useToggle(false)

const isManagedMode = computed(
  () => useRuntimeConfig().public.managedMode === true,
)

definePageMeta({
  layout: 'default',
})
</script>
