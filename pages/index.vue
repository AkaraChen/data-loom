<template>
  <div class="flex flex-row h-[calc(100vh-3.5rem)]">
    <!-- Sidebar -->
    <div class="w-64 bg-base-100 p-4 shadow-lg border-r border-base-300">
      <!-- Task Section -->
      <UiTextSection
        icon="mdi:clipboard-text-outline"
        title="任务描述"
        placeholder="Enter task description..."
        v-model="taskDescription"
      />

      <!-- Requirements Section -->
      <UiTextSection
        icon="mdi:chevron-right"
        title="要求"
        placeholder="Enter requirements..."
        v-model="requirements"
      />

      <!-- Action Button -->
      <button class="btn btn-primary w-full gap-2">
        <Icon name="mdi:play-circle-outline" size="20" />
        生成
      </button>
    </div>

    <!-- Main Content - Document Editor -->
    <EditorDocumentEditor
      v-model:files="files"
      v-model:activeFileId="activeFileId"
      v-model:activeFileContent="activeFileContent"
      @process="processDocument"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DocumentFile } from '~/composables/use-editor-model'

definePageMeta({
  layout: 'default',
})

const taskDescription = ref('')
const requirements = ref('')

// 初始化文件列表
const files = ref<DocumentFile[]>([])

// 当前活动文件ID
const activeFileId = ref<string | null>(null)

// 活动文件内容
const activeFileContent = ref<string>(
  '这是一个示例文档，你可以在这里编辑内容。',
)

// 处理文档
const processDocument = (file: DocumentFile) => {
  console.log('处理文档:', file)
  // 这里可以添加文档处理逻辑
}
</script>
