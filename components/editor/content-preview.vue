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
    <div v-else-if="fileType === 'json'" class="json-preview">
      <pre>{{ formattedJson }}</pre>
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
    return `Invalid JSON: ${error.message}`
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
