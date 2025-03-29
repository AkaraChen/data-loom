<template>
  <div class="flex-1 flex flex-col">
    <!-- Editor Tabs -->
    <div class="flex bg-base-100 border-b border-base-content/10">
      <div class="flex-1 flex overflow-x-auto">
        <div
          v-if="activeFile"
          class="px-3 py-2 flex items-center gap-2 bg-base-100 border-r border-base-content/10"
        >
          <Icon name="mdi:file-outline" size="16" class="text-primary" />
          <span>{{ activeFile.name }}</span>
          <button
            class="btn btn-ghost btn-xs btn-circle"
            @click="$emit('close-file')"
            :disabled="disabled"
          >
            <Icon name="mdi:close" size="12" />
          </button>
        </div>
      </div>
    </div>

    <!-- Editor Content -->
    <div class="flex-1 overflow-auto bg-base-100 p-0.5 text-sm">
      <EditorPreview
        v-if="isPreviewMode && activeFile"
        v-model="modelValue"
        :fileType="getFileExtension(activeFile?.name || '')"
        :isStreaming="disabled || isProcessing"
      />
      <MonacoEditor
        v-else-if="activeFile"
        v-model="modelValue"
        :lang="getFileExtension(activeFile?.name || '')"
        class="w-full h-full"
        :options="{
          minimap: { enabled: false },
          unicodeHighlight: {
            nonBasicASCII: false,
            ambiguousCharacters: false,
          },
          fontFamily: 'Space Mono, Noto Sans SC, monospace',
        }"
      />
      <div
        v-else
        class="flex items-center justify-center h-full text-base-content/50"
      >
        <p>选择或创建一个文件开始编辑</p>
      </div>
    </div>

    <!-- Editor Actions -->
    <div
      class="flex justify-between p-2 bg-base-100 border-t border-base-content/10"
    >
      <div class="flex items-center">
        <button
          class="btn btn-sm btn-ghost gap-1"
          @click="$emit('toggle-preview')"
          :class="{ 'btn-active': isPreviewMode }"
        >
          <Icon :name="isPreviewMode ? 'mdi:eye' : 'mdi:code-tags'" size="16" />
          {{ isPreviewMode ? '预览' : '源码' }}
        </button>
      </div>
      <div class="flex gap-2">
        <button
          class="btn btn-sm btn-outline gap-1"
          :disabled="!activeFile || disabled"
          @click="handleExport"
        >
          <Icon name="mdi:export" size="16" />
          导出
        </button>
        <button
          class="btn btn-sm gap-1"
          :class="isProcessing ? 'btn-error' : 'btn-primary'"
          :disabled="!activeFile || disabled"
          @click="isProcessing ? $emit('abort-process') : $emit('process-file')"
        >
          <Icon :name="isProcessing ? 'mdi:stop' : 'mdi:play'" size="16" />
          {{ isProcessing ? '停止处理' : '处理' }}
        </button>
      </div>
    </div>
  </div>

  <!-- 导出文件对话框 -->
  <EditorExportFileDialog
    ref="exportFileDialog"
    :file="activeFile ? createFileFromActiveFile() : null"
    @exported="handleExported"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import EditorPreview from './preview/index.vue'
import EditorExportFileDialog from './export-file-dialog.vue'

// 文档文件接口
interface DocumentFile {
  id: string
  name: string
  content: string
}

// 定义属性
const props = defineProps<{
  files: DocumentFile[]
  activeFileId: string | null
  isPreviewMode: boolean
  disabled: boolean
  isProcessing: boolean
}>()

// 使用 defineModel 处理 v-model
const modelValue = defineModel<string>('modelValue')

// 定义事件
const emit = defineEmits(['toggle-preview', 'process-file', 'abort-process', 'close-file'])

// 导出对话框引用
const exportFileDialog = ref<{ open: () => void } | null>(null)

// 计算当前活动文件
const activeFile = computed(() => {
  if (!props.activeFileId) return null
  return props.files.find(file => file.id === props.activeFileId) || null
})

// 获取文件扩展名
function getFileExtension(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  
  // 根据扩展名返回对应的语言
  if (ext === 'md' || ext === 'markdown') return 'markdown'
  if (ext === 'js') return 'javascript'
  if (ext === 'ts') return 'typescript'
  if (ext === 'html') return 'html'
  if (ext === 'css') return 'css'
  if (ext === 'json') return 'json'
  if (ext === 'yaml' || ext === 'yml') return 'yaml'
  if (ext === 'csv') return 'csv'
  
  return ext
}

// 获取文件内容类型
function getFileContentType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  
  // 根据扩展名返回对应的MIME类型
  if (ext === 'md' || ext === 'markdown') return 'text/markdown'
  if (ext === 'js') return 'application/javascript'
  if (ext === 'ts') return 'application/typescript'
  if (ext === 'html') return 'text/html'
  if (ext === 'css') return 'text/css'
  if (ext === 'json') return 'application/json'
  if (ext === 'yaml' || ext === 'yml') return 'application/yaml'
  if (ext === 'csv') return 'text/csv'
  
  return 'text/plain'
}

// 创建文件对象
function createFileFromActiveFile(): File {
  if (!activeFile.value) throw new Error('No active file')
  return new File(
    [modelValue.value || ''], 
    activeFile.value.name, 
    { type: getFileContentType(activeFile.value.name) }
  )
}

// 处理导出
function handleExport() {
  exportFileDialog.value?.open()
}

// 处理导出完成
function handleExported() {
  // 可以添加导出成功的提示或其他逻辑
}
</script>

<style scoped>
/* 用于触发 nuxt font */
.not-exist-class {
  font-family: 'Space Mono', 'Noto Sans SC';
}
</style>
