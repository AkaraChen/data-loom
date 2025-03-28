import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// 文档文件接口
export interface DocumentFile {
  id: string
  name: string
  content: string
}

// 输出模式类型
export type OutputMode = 'plaintext' | 'markdown' | 'csv' | 'json'

/**
 * 默认工作区状态
 */
export const DEFAULT_WORKSPACE = {
  taskDescription: '',
  requirements: '',
  files: [] as DocumentFile[],
  activeFileId: null as string | null,
  activeFileContent: '',
  isStreaming: false,
  outputMode: 'markdown' as OutputMode,
}

/**
 * 工作区存储
 */
export const useWorkspaceStore = defineStore(
  'workspace',
  () => {
    // 响应式状态
    const taskDescription = ref(DEFAULT_WORKSPACE.taskDescription)
    const requirements = ref(DEFAULT_WORKSPACE.requirements)
    const files = ref<DocumentFile[]>([...DEFAULT_WORKSPACE.files])
    const activeFileId = ref<string | null>(DEFAULT_WORKSPACE.activeFileId)
    const activeFileContent = ref(DEFAULT_WORKSPACE.activeFileContent)
    const isStreaming = ref(DEFAULT_WORKSPACE.isStreaming)
    const outputMode = ref<OutputMode>(DEFAULT_WORKSPACE.outputMode)

    // 计算属性：当前活动文件
    const activeFile = computed(
      () => files.value.find(file => file.id === activeFileId.value) || null,
    )

    // 监听活动文件ID变化，自动同步内容
    watch(activeFileId, newId => {
      if (newId) {
        const file = files.value.find(f => f.id === newId)
        if (file) {
          activeFileContent.value = file.content
        }
      } else {
        activeFileContent.value = ''
      }
    })

    // 监听活动文件内容变化，自动同步到文件对象
    watch(activeFileContent, newContent => {
      if (activeFileId.value) {
        const fileIndex = files.value.findIndex(
          f => f.id === activeFileId.value,
        )
        if (fileIndex !== -1) {
          const updatedFiles = [...files.value]
          updatedFiles[fileIndex] = {
            ...updatedFiles[fileIndex],
            content: newContent,
          }
          files.value = updatedFiles
        }
      }
    })

    /**
     * 创建新文件
     * @param fileName 文件名
     * @returns 新创建的文件ID
     */
    function createFile(fileName: string): string {
      const newId = `file-${Date.now()}`
      const hasExt = fileName.split('.').length > 1
      const newFile: DocumentFile = {
        id: newId,
        name: hasExt ? fileName : `${fileName}.txt`,
        content: '',
      }

      files.value.push(newFile)
      return newId
    }

    /**
     * 重置工作区
     */
    function resetWorkspace() {
      taskDescription.value = DEFAULT_WORKSPACE.taskDescription
      requirements.value = DEFAULT_WORKSPACE.requirements
      files.value = [...DEFAULT_WORKSPACE.files]
      activeFileId.value = DEFAULT_WORKSPACE.activeFileId
      activeFileContent.value = DEFAULT_WORKSPACE.activeFileContent
      isStreaming.value = DEFAULT_WORKSPACE.isStreaming
      outputMode.value = DEFAULT_WORKSPACE.outputMode
    }

    /**
     * 获取当前工作区状态的提示词
     */
    function getPrompt(): string {
      let prompt = ''

      if (taskDescription.value) {
        prompt += `任务描述: ${taskDescription.value}\n\n`
      }

      if (requirements.value) {
        prompt += `要求: ${requirements.value}\n\n`
      }

      prompt += `请以${getOutputModeDescription(outputMode.value)}格式输出结果，直接输出文件内容，除此以外不包含其他任何信息。`

      return prompt
    }

    /**
     * 获取输出模式的描述
     */
    function getOutputModeDescription(mode: OutputMode): string {
      switch (mode) {
        case 'plaintext':
          return '纯文本'
        case 'markdown':
          return 'Markdown'
        case 'csv':
          return 'CSV'
        case 'json':
          return 'JSON'
        default:
          return 'Markdown'
      }
    }

    return {
      taskDescription,
      requirements,
      files,
      activeFileId,
      activeFileContent,
      isStreaming,
      activeFile,
      outputMode,
      createFile,
      resetWorkspace,
      getPrompt,
    }
  },
  {
    persist: {
      key: 'data-loom-workspace',
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    },
  },
)
