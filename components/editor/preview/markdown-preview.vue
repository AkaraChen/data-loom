<template>
  <div class="markdown-preview markdown-body" v-html="renderedMarkdown"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import 'github-markdown-css/github-markdown.css'

// 使用 defineModel 实现双向绑定
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})

// 渲染 Markdown 内容
const renderedMarkdown = computed(() => {
  return marked(props.content || '')
})
</script>

<style scoped>
.markdown-preview {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
}
</style>
