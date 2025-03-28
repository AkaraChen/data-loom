<template>
  <div class="content-preview">
    <!-- Markdown Preview -->
    <MarkdownPreview v-if="fileType === 'md'" :content="modelValue" />

    <!-- Plain Text Preview -->
    <PlaintextPreview v-else-if="fileType === 'txt'" :content="modelValue" />

    <!-- JSON Preview -->
    <JsonPreview 
      v-else-if="fileType === 'json'" 
      :content="modelValue" 
      :isStreaming="isStreaming" 
    />

    <!-- CSV Preview -->
    <CsvPreview v-else-if="fileType === 'csv'" :content="modelValue" />

    <!-- Default Preview (Fallback to plain text) -->
    <PlaintextPreview v-else :content="modelValue" />
  </div>
</template>

<script setup lang="ts">
import MarkdownPreview from './markdown-preview.vue'
import PlaintextPreview from './plaintext-preview.vue'
import JsonPreview from './json-preview.vue'
import CsvPreview from './csv-preview.vue'

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
    default: false,
  },
})
</script>

<style scoped>
.content-preview {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
