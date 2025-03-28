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
import { ref, watch } from 'vue'
import { useEditorModel, type DocumentFile } from '~/composables/use-editor-model'

definePageMeta({
  layout: 'default',
})

const taskDescription = ref('')
const requirements = ref('')

// 初始化文件列表
const initialFiles: DocumentFile[] = [
  {
    id: 'file-1',
    name: '示例文档.txt',
    content: '这是一个示例文档，你可以在这里编辑内容。'
  }
]

// 使用编辑器模型
const editorModel = useEditorModel({
  initialFiles,
  initialActiveFileId: 'file-1',
  fileNamePrefix: '文档'
})

// 暴露给组件的状态
const files = ref(editorModel.files.value)
const activeFileId = ref(editorModel.activeFileId.value)
const activeFileContent = ref(editorModel.activeFileContent.value)

// 同步编辑器模型状态变化
watch(() => editorModel.files.value, (newFiles) => {
  files.value = newFiles
})

watch(() => editorModel.activeFileId.value, (newId) => {
  activeFileId.value = newId
})

watch(() => editorModel.activeFileContent.value, (newContent) => {
  activeFileContent.value = newContent
})

// 处理文档
const processDocument = (file: DocumentFile) => {
  console.log('处理文档:', file)
  // 这里可以添加文档处理逻辑
}
</script>
