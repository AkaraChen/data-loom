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
  isGenerating: false,
  isProcessing: false,
  outputMode: 'markdown' as OutputMode,
  contextFileIds: [] as string[], // 添加上下文文件ID数组
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
    const isGenerating = ref(DEFAULT_WORKSPACE.isGenerating)
    const isProcessing = ref(DEFAULT_WORKSPACE.isProcessing)
    const outputMode = ref<OutputMode>(DEFAULT_WORKSPACE.outputMode)
    const contextFileIds = ref<string[]>([...DEFAULT_WORKSPACE.contextFileIds]) // 添加上下文文件ID数组

    // 计算属性：当前活动文件
    const activeFile = computed(
      () => files.value.find(file => file.id === activeFileId.value) || null,
    )

    // 计算属性：上下文文件列表
    const contextFiles = computed(() =>
      files.value.filter(file => contextFileIds.value.includes(file.id)),
    )

    // 计算属性：根据当前活动文件自动计算输出模式
    const currentOutputMode = computed(() => {
      if (!activeFile.value) return 'markdown'

      const extension =
        activeFile.value.name.split('.').pop()?.toLowerCase() || ''

      switch (extension) {
        case 'txt':
          return 'plaintext'
        case 'md':
          return 'markdown'
        case 'csv':
          return 'csv'
        case 'json':
          return 'json'
        default:
          return 'markdown' // 默认使用 markdown
      }
    })

    // 计算属性：是否有任何流式传输正在进行
    const isStreaming = computed(() => isGenerating.value || isProcessing.value)

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

    // 监听当前计算的输出模式，自动更新输出模式状态
    watch(
      currentOutputMode,
      newMode => {
        outputMode.value = newMode as OutputMode
      },
      { immediate: true },
    )

    /**
     * 获取当前工作区状态的提示词
     * @returns 包含系统提示和用户消息的对象
     */
    function getPrompt(): { systemPrompt: string; userMessage: string } {
      // 系统提示包含任务描述
      let systemPrompt =
        '你是一个专业的内容生成助手，擅长根据用户的要求生成高质量的文档内容。'

      if (taskDescription.value) {
        systemPrompt += `\n\n任务描述: ${taskDescription.value}`
      }

      // 用户消息包含具体要求和上下文文件
      let userMessage = ''

      if (requirements.value) {
        userMessage += `要求: ${requirements.value}\n\n`
      }

      // 添加上下文文件内容
      if (contextFiles.value.length > 0) {
        userMessage += `上下文文件:\n\n`

        contextFiles.value.forEach(file => {
          userMessage += `--- ${file.name} ---\n${file.content}\n\n`
        })
      }

      userMessage += `请以${getOutputModeDescription(outputMode.value)}格式输出结果，直接输出文件内容，不要将内容放置在代码块中，除内容外不包含其他任何信息。`

      return { systemPrompt, userMessage }
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

    /**
     * 创建新文件
     * @param fileName 文件名
     * @returns 新创建的文件ID
     */
    function createFile(fileName: string): string {
      const newId = `file-${Date.now()}`
      const newFile: DocumentFile = {
        id: newId,
        name: fileName,
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
      isGenerating.value = DEFAULT_WORKSPACE.isGenerating
      isProcessing.value = DEFAULT_WORKSPACE.isProcessing
      outputMode.value = DEFAULT_WORKSPACE.outputMode
      contextFileIds.value = [...DEFAULT_WORKSPACE.contextFileIds] // 重置上下文文件ID数组
    }

    /**
     * 添加或移除上下文文件
     * @param fileId 文件ID
     * @param checked 是否选中
     */
    function toggleContextFile(fileId: string, checked: boolean) {
      if (checked && !contextFileIds.value.includes(fileId)) {
        contextFileIds.value.push(fileId)
      } else if (!checked && contextFileIds.value.includes(fileId)) {
        contextFileIds.value = contextFileIds.value.filter(id => id !== fileId)
      }
    }

    /**
     * 检查文件是否在上下文列表中
     * @param fileId 文件ID
     */
    function isFileInContext(fileId: string): boolean {
      return contextFileIds.value.includes(fileId)
    }

    return {
      taskDescription,
      requirements,
      files,
      activeFileId,
      activeFileContent,
      isGenerating,
      isProcessing,
      isStreaming,
      outputMode,
      currentOutputMode,
      contextFileIds,
      contextFiles,
      createFile,
      resetWorkspace,
      getPrompt,
      toggleContextFile,
      isFileInContext,
    }
  },
  {
    persist: {
      key: 'data-loom-workspace',
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    },
  },
)
