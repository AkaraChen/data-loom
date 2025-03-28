import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'

/**
 * 文档文件接口
 */
export interface DocumentFile {
  id: string
  name: string
  content: string
}

/**
 * 编辑器模型返回值接口
 */
export interface EditorModelReturn {
  // 文件列表
  files: Ref<DocumentFile[]>
  // 当前活动文件ID
  activeFileId: Ref<string | null>
  // 当前活动文件内容
  activeFileContent: Ref<string>
  // 当前活动文件
  activeFile: Ref<DocumentFile | null>
  // 添加新文件
  addNewFile: () => void
  // 关闭文件
  closeFile: () => void
  // 更新文件内容
  updateFileContent: (content: string) => void
  // 处理文件
  processFile: () => DocumentFile | null
}

/**
 * 编辑器模型选项接口
 */
export interface EditorModelOptions {
  // 初始文件列表
  initialFiles?: DocumentFile[]
  // 初始活动文件ID
  initialActiveFileId?: string | null
  // 文件名前缀
  fileNamePrefix?: string
}

/**
 * 文档编辑器模型组合式函数
 * 
 * @param options 编辑器选项
 * @returns 编辑器模型接口
 */
export function useEditorModel(options: EditorModelOptions = {}): EditorModelReturn {
  const {
    initialFiles = [],
    initialActiveFileId = null,
    fileNamePrefix = '新文件'
  } = options

  // 文件列表
  const files = ref<DocumentFile[]>(initialFiles) as Ref<DocumentFile[]>
  
  // 当前活动文件ID
  const activeFileId = ref<string | null>(initialActiveFileId)
  
  // 当前活动文件内容
  const activeFileContent = ref<string>('')
  
  // 计算当前活动文件
  const activeFile = computed(() => {
    return files.value.find(file => file.id === activeFileId.value) || null
  })

  // 监听活动文件变化，更新内容
  watch(activeFile, (newFile) => {
    activeFileContent.value = newFile?.content || ''
  }, { immediate: true })

  // 监听内容变化，更新文件
  watch(activeFileContent, (newContent) => {
    if (activeFile.value) {
      const updatedFiles = files.value.map(file => {
        if (file.id === activeFileId.value) {
          return { ...file, content: newContent }
        }
        return file
      })
      files.value = updatedFiles
    }
  })

  /**
   * 添加新文件
   */
  const addNewFile = () => {
    const newId = `file-${Date.now()}`
    const newFile = {
      id: newId,
      name: `${fileNamePrefix}-${files.value.length + 1}.txt`,
      content: ''
    }
    files.value = [...files.value, newFile]
    activeFileId.value = newId
  }

  /**
   * 关闭文件
   */
  const closeFile = () => {
    if (files.value.length > 0) {
      activeFileId.value = files.value[0].id
    } else {
      activeFileId.value = null
    }
  }

  /**
   * 更新文件内容
   * @param content 新内容
   */
  const updateFileContent = (content: string) => {
    activeFileContent.value = content
  }

  /**
   * 处理文件
   * @returns 当前活动文件或null
   */
  const processFile = () => {
    // 这里可以添加文件处理逻辑
    console.log('处理文件:', activeFile.value)
    return activeFile.value
  }

  return {
    files,
    activeFileId,
    activeFileContent,
    activeFile,
    addNewFile,
    closeFile,
    updateFileContent,
    processFile
  }
}
