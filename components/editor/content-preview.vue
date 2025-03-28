<template>
  <div class="content-preview markdown-body">
    <!-- Markdown Preview -->
    <div v-if="fileType === 'md'" v-html="renderedMarkdown"></div>

    <!-- Plain Text Preview -->
    <div
      v-else-if="fileType === 'txt'"
      class="plain-text-preview whitespace-pre-wrap"
    >
      {{ modelValue }}
    </div>

    <!-- JSON Preview -->
    <div v-else-if="fileType === 'json'" class="json-preview relative h-full">
      <pre v-if="jsonParseSuccess">{{ formattedJson }}</pre>
      <div v-else class="flex items-center justify-center h-full w-full">
        <div v-if="isStreaming" class="text-base-content/70 flex flex-col items-center">
          <div class="loading loading-spinner loading-md mb-2"></div>
          <p>JSON 数据生成中...</p>
        </div>
        <div v-else class="text-error flex flex-col items-center">
          <Icon name="mdi:alert-circle-outline" size="24" class="mb-2" />
          <p>JSON 格式错误，请重新生成</p>
          <p class="text-xs mt-1">{{ jsonErrorMessage }}</p>
        </div>
      </div>
    </div>

    <!-- CSV Preview -->
    <div v-else-if="fileType === 'csv'" class="csv-preview">
      <div v-html="csvData"></div>
    </div>

    <!-- Default Preview (Fallback to plain text) -->
    <div v-else class="plain-text-preview whitespace-pre-wrap">
      {{ modelValue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import 'github-markdown-css/github-markdown.css'
import csvToMarkdown from 'csv-to-markdown-table'

// 使用 defineModel 实现双向绑定
const modelValue = defineModel<string>('modelValue', { default: '' })

// 定义组件属性
defineProps({
  fileType: {
    type: String,
    default: 'txt',
  },
  isStreaming: {
    type: Boolean,
    default: false
  }
})

// 渲染 Markdown 内容
const renderedMarkdown = computed(() => {
  return marked(modelValue.value || '')
})

// 格式化 JSON 内容
const formattedJson = computed(() => {
  try {
    const parsed = JSON.parse(modelValue.value || '{}')
    return JSON.stringify(parsed, null, 2)
  } catch (error: any) {
    return ''
  }
})

// JSON 解析状态
const jsonParseSuccess = computed(() => {
  try {
    JSON.parse(modelValue.value || '{}')
    return true
  } catch {
    return false
  }
})

// JSON 错误信息
const jsonErrorMessage = computed(() => {
  try {
    JSON.parse(modelValue.value || '{}')
    return ''
  } catch (error: any) {
    return error.message
  }
})

// 解析 CSV 内容
const csvData = computed(() => {
  return marked(csvToMarkdown(modelValue.value || '', ',', true))
})
</script>

<style scoped>
.content-preview {
  height: 100%;
  width: 100%;
  overflow: auto;
  padding: 0.5rem;
}

.markdown-body {
  padding: 0.5rem;
}

.plain-text-preview {
  font-family: monospace;
}

.json-preview pre {
  margin: 0;
  font-family: monospace;
}

.csv-preview {
  overflow-x: auto;
}

.csv-preview table {
  border-collapse: collapse;
}

.csv-preview th,
.csv-preview td {
  border: 1px solid var(--b3);
  padding: 0.25rem 0.5rem;
}
</style>
