<template>
  <div class="flex flex-row h-[calc(100vh-3.5rem)]">
    <!-- Sidebar -->
    <div class="w-64 bg-base-100 p-4 shadow-lg border-r border-base-300">
      <!-- Task Section -->
      <UiTextSection
        icon="mdi:clipboard-text-outline"
        title="任务描述"
        placeholder="在此输入任务描述..."
        v-model="workspaceStore.taskDescription"
      />

      <!-- Requirements Section -->
      <UiTextSection
        icon="mdi:chevron-right"
        title="要求"
        placeholder="在此输入要求..."
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

// 初始化处理文件的聊天功能
const {
  sendMessage: processFile,
  isStreaming: isProcessing,
  abortChat: abortProcess,
  reset: resetProcessChat,
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
  () => isStreaming.value || isProcessing.value,
  newValue => {
    workspaceStore.isStreaming = newValue
  },
)

// 处理文件处理请求
const handleProcessFile = (data: { file: DocumentFile; action: any }) => {
  // 重置处理聊天内容
  resetProcessChat()

  // 准备文件内容
  const fileContent = data.file.content
  const fileName = data.file.name

  // 获取自定义提示
  const customPrompt = typeof data.action === 'string' ? '' : data.action.prompt

  // 生成系统提示和用户提示
  const systemPrompt = `你是一个专业的内容处理助手，擅长根据用户的特定要求处理文档内容。文件名: ${fileName}`
  const userPrompt = `文件内容：\n\n${fileContent}\n\n处理要求：${customPrompt}`

  // 发送处理请求
  processFile({
    content: userPrompt,
    systemPrompt,
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
  const { systemPrompt, userMessage } = workspaceStore.getPrompt()

  // 发送消息到 OpenAI
  sendMessage({
    content: userMessage,
    systemPrompt,
  })
}

// 处理文件选择被阻塞的情况
const handleFileSelectBlocked = (fileId: string) => {
  console.log('文件选择被阻塞:', fileId)
}
</script>
