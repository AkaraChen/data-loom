<template>
  <div class="json-preview relative h-full">
    <JsonViewer v-if="jsonParseSuccess" :value="parsedJson" />
    <div v-else class="flex items-center justify-center h-full w-full">
      <div
        v-if="isStreaming"
        class="text-base-content/70 flex flex-col items-center"
      >
        <div class="loading loading-spinner loading-md mb-2"></div>
        <p>JSON 数据生成中...</p>
      </div>
      <div v-else class="flex flex-col items-center">
        <div class="bg-base-200 rounded-lg px-8 py-6 max-w-xs gap-4">
          <div class="text-base-content/80 mb-2 flex gap-2 items-center">
            <Icon name="mdi:code-json" size="20" />
            <span class="font-medium text-base-content/90">JSON 解析失败</span>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs text-base-content/80">
              请重新生成，或者进入源码模式手动修复。
            </span>
            <span class="text-xs text-base-content/60">
              错误信息: {{ jsonErrorMessage }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// @ts-ignore
import { JsonViewer } from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/index.css'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  isStreaming: {
    type: Boolean,
    default: false,
  },
})

// 解析 JSON 内容
const parsedJson = computed(() => {
  try {
    return JSON.parse(props.content || '{}')
  } catch (error) {
    return {}
  }
})

// JSON 解析状态
const jsonParseSuccess = computed(() => {
  try {
    JSON.parse(props.content || '{}')
    return true
  } catch {
    return false
  }
})

// JSON 错误信息
const jsonErrorMessage = computed(() => {
  try {
    JSON.parse(props.content || '{}')
    return ''
  } catch (error: any) {
    return error.message || '未知错误'
  }
})
</script>

<style scoped>
.json-preview {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
}
</style>
