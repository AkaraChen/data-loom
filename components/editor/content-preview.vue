<template>
  <div class="content-preview markdown-body">
    <!-- Markdown Preview -->
    <div v-if="fileType === 'md'" v-html="renderedMarkdown"></div>
    
    <!-- Plain Text Preview -->
    <div v-else-if="fileType === 'txt'" class="plain-text-preview whitespace-pre-wrap">{{ modelValue }}</div>
    
    <!-- JSON Preview -->
    <div v-else-if="fileType === 'json'" class="json-preview">
      <pre>{{ formattedJson }}</pre>
    </div>
    
    <!-- CSV Preview -->
    <div v-else-if="fileType === 'csv'" class="csv-preview">
      <table class="table table-compact w-full">
        <thead v-if="csvData.length > 0">
          <tr>
            <th v-for="(header, index) in csvData[0]" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in csvData.slice(1)" :key="rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Default Preview (Fallback to plain text) -->
    <div v-else class="plain-text-preview whitespace-pre-wrap">{{ modelValue }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import 'github-markdown-css/github-markdown.css'

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
  if (!modelValue.value) return []
  
  const rows = modelValue.value.split('\n')
  return rows.map(row => row.split(',').map(cell => cell.trim()))
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

.csv-preview th, .csv-preview td {
  border: 1px solid var(--b3);
  padding: 0.25rem 0.5rem;
}
</style>
