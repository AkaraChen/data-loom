<template>
  <div class="csv-preview" v-html="csvData"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import csvToMarkdown from 'csv-to-markdown-table'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})

// 将 CSV 转换为 Markdown 表格
const csvData = computed(() => {
  try {
    if (!props.content) return ''

    // 解析 CSV 数据
    const lines = props.content.trim().split('\n')
    if (lines.length < 1) return ''

    const headers = lines[0].split(',')
    const rows = lines.slice(1)

    // 使用 csvToMarkdown 转换为 Markdown 表格
    return csvToMarkdown(props.content, ',', true)
  } catch (error) {
    console.error('CSV 解析错误:', error)
    return '<div class="text-error">CSV 格式错误</div>'
  }
})
</script>

<style scoped>
.csv-preview {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
}

/* 表格样式 */
.csv-preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1rem;
}

.csv-preview :deep(th),
.csv-preview :deep(td) {
  border: 1px solid hsl(var(--b3));
  padding: 0.5rem;
  text-align: left;
}

.csv-preview :deep(th) {
  background-color: hsl(var(--b2));
  font-weight: bold;
}

.csv-preview :deep(tr:nth-child(even)) {
  background-color: hsl(var(--b1));
}
</style>
