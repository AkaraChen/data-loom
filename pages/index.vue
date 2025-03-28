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
      <button
        class="btn btn-primary w-full gap-2"
        @click="generateContent"
        :disabled="isStreaming"
      >
        <Icon v-if="!isStreaming" name="mdi:play-circle-outline" size="20" />
        <span v-else class="loading loading-spinner loading-sm"></span>
        {{ isStreaming ? '生成中...' : '生成' }}
      </button>
    </div>

    <!-- Main Content - Document Editor -->
    <EditorDocumentEditor
      v-model:files="files"
      v-model:activeFileId="activeFileId"
      v-model:activeFileContent="activeFileContent"
      @process="processDocument"
      :blocking="isStreaming"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChat } from '~/composables/use-chat'
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

// 初始化聊天功能
const {
  sendMessage,
  isStreaming,
  streamedText,
  abortChat,
  reset: resetChat,
} = useChat({
  onUpdate: text => {
    // 实时更新活动文件内容
    if (activeFileId.value) {
      activeFileContent.value = text
    }
  },
})

// 生成内容
const generateContent = async () => {
  if (!activeFileId.value) {
    // 如果没有活动文件，创建一个新文件
    const newFile: DocumentFile = {
      id: `file-${Date.now()}`,
      name: '生成的文档.md',
      content: '',
    }

    files.value.push(newFile)
    activeFileId.value = newFile.id
  }

  // 重置聊天内容
  resetChat()

  // 构建提示词
  const prompt = `
任务描述: ${taskDescription.value}
要求: ${requirements.value}

请根据以上信息生成内容。
`

  // 发送消息到 OpenAI
  sendMessage({
    content: prompt,
    systemPrompt:
      '你是一个专业的内容生成助手，擅长根据用户的要求生成高质量的文档内容。',
  })
}

// 处理文档
const processDocument = (file: DocumentFile) => {
  console.log('处理文档:', file)
  // 这里可以添加文档处理逻辑
}
</script>
