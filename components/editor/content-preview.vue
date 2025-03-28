<template>
  <EditorPreview
    v-model="modelValue"
    :fileType="fileType"
    :isStreaming="isStreaming"
  />
</template>

<script setup lang="ts">
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
/* 样式已移至各个预览组件中 */
</style>
