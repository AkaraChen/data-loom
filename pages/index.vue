<template>
  <div class="flex flex-row h-[calc(100vh-3.5rem)]">
    <!-- Sidebar -->
    <div class="w-64 bg-base-100 p-4 shadow-lg border-r border-base-300">
      <!-- Task Section -->
      <UiTextSection
        icon="mdi:clipboard-text-outline"
        title="任务描述"
        placeholder="Enter task description..."
        v-model="workspaceStore.taskDescription"
      />

      <!-- Requirements Section -->
      <UiTextSection
        icon="mdi:chevron-right"
        title="要求"
        placeholder="Enter requirements..."
        v-model="workspaceStore.requirements"
      />

      <!-- Action Button -->
      <button
        class="btn btn-primary w-full gap-2"
        @click="generateContent"
        :disabled="workspaceStore.isStreaming"
      >
        <Icon
          v-if="!workspaceStore.isStreaming"
          name="mdi:play-circle-outline"
          size="20"
        />
        <span v-else class="loading loading-spinner loading-sm"></span>
        {{ workspaceStore.isStreaming ? '生成中...' : '生成' }}
      </button>
    </div>

    <!-- Main Content - Document Editor -->
    <EditorDocumentEditor
      v-model:files="workspaceStore.files"
      v-model:activeFileId="workspaceStore.activeFileId"
      v-model:activeFileContent="workspaceStore.activeFileContent"
      v-model:contextFileIds="workspaceStore.contextFileIds"
      :blocking="workspaceStore.isStreaming"
      @process="handleProcessFile"
      @fileSelectBlocked="handleFileSelectBlocked"
    />
  </div>
</template>

<script setup lang="ts">
import { useChat } from '~/composables/use-chat'
import { useWorkspaceStore, type DocumentFile } from '~/stores/workspace'
import { watch } from 'vue'

definePageMeta({
  layout: 'default',
})

// 初始化工作区存储
const workspaceStore = useWorkspaceStore()

// 初始化聊天功能
const {
  sendMessage,
  isStreaming,
  abortChat,
  reset: resetChat,
} = useChat({
  onUpdate: text => {
    // 实时更新活动文件内容
    if (workspaceStore.activeFileId) {
      workspaceStore.activeFileContent = text
    }
  },
})

// 监听流式传输状态变化
watch(
  () => isStreaming.value,
  newValue => {
    workspaceStore.isStreaming = newValue
  },
)

// 处理文件处理请求
const handleProcessFile = (file: DocumentFile) => {
  // 重置聊天内容
  resetChat()

  // 获取提示词
  const prompt = workspaceStore.getPrompt()

  // 发送消息到 OpenAI
  sendMessage({
    content: prompt,
    systemPrompt:
      '你是一个专业的内容生成助手，擅长根据用户的要求生成高质量的文档内容。',
  })
}

// 生成内容
const generateContent = async () => {
  if (!workspaceStore.activeFileId) {
    // 如果没有活动文件，创建一个新文件，默认使用 markdown
    const extension = '.md'
    const newId = workspaceStore.createFile(`生成的文档${extension}`)
    workspaceStore.activeFileId = newId
  }

  // 重置聊天内容
  resetChat()

  // 获取提示词
  const prompt = workspaceStore.getPrompt()

  // 发送消息到 OpenAI
  sendMessage({
    content: prompt,
    systemPrompt:
      '你是一个专业的内容生成助手，擅长根据用户的要求生成高质量的文档内容。',
  })
}

// 处理文件选择被阻塞的情况
const handleFileSelectBlocked = (fileId: string) => {
  console.log('文件选择被阻塞:', fileId)
}
</script>
