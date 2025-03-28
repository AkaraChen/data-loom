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

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'default',
})

const taskDescription = ref('')
const requirements = ref('')

// 初始化文件列表
const files = ref([
  { id: 'file-1', name: 'a.txt', content: '' },
  { id: 'file-2', name: 'b.txt', content: '' },
  { id: 'file-3', name: 'c.txt', content: '' }
])

// 当前活动文件ID
const activeFileId = ref('file-1')

// 活动文件内容
const activeFileContent = ref('')

// 处理文档
const processDocument = () => {
  const activeFile = files.value.find(file => file.id === activeFileId.value)
  if (activeFile) {
    console.log('处理文档:', activeFile)
    // 这里可以添加处理逻辑
  }
}
</script>
