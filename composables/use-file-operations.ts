import { ref, computed } from 'vue'

// 文档文件接口
export interface DocumentFile {
  id: string
  name: string
  content: string
}

export function useFileOperations() {
  // 文件列表
  const files = ref<DocumentFile[]>([])

  // 活动文件ID
  const activeFileId = ref<string | null>(null)

  // 活动文件内容
  const activeFileContent = ref<string>('')

  // 上下文文件ID列表
  const contextFileIds = ref<string[]>([])

  // 计算当前活动文件
  const activeFile = computed(() => {
    if (!activeFileId.value) return null
    return files.value.find(file => file.id === activeFileId.value) || null
  })

  // 计算当前上下文文件列表
  const contextFiles = computed(() => {
    return files.value.filter(file => contextFileIds.value.includes(file.id))
  })

  // 获取文件扩展名
  const getFileExtension = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf('.')
    if (lastDotIndex === -1) return 'txt'
    return fileName.substring(lastDotIndex + 1).toLowerCase()
  }

  // 创建新文件
  const createNewFile = (fileName: string) => {
    const newId = `file-${Date.now()}`
    let initialContent = ''

    // 为特定文件类型设置默认内容
    const fileExt = getFileExtension(fileName)
    if (fileExt === 'json') {
      initialContent = '{}'
    }

    const newFile: DocumentFile = {
      id: newId,
      name: fileName,
      content: initialContent,
    }

    files.value = [...files.value, newFile]

    return newId
  }

  // 删除文件
  const deleteFile = (fileId: string) => {
    // 如果删除的是当前活动文件，先清空活动文件ID
    if (activeFileId.value === fileId) {
      activeFileId.value = null
    }

    // 从文件列表中移除
    files.value = files.value.filter(file => file.id !== fileId)

    // 从上下文文件ID数组中移除
    if (contextFileIds.value.includes(fileId)) {
      contextFileIds.value = contextFileIds.value.filter(id => id !== fileId)
    }
  }

  // 重命名文件
  const renameFile = (fileId: string, newFileName: string) => {
    const fileIndex = files.value.findIndex(f => f.id === fileId)
    if (fileIndex !== -1) {
      const updatedFiles = [...files.value]
      updatedFiles[fileIndex] = {
        ...updatedFiles[fileIndex],
        name: newFileName,
      }
      files.value = updatedFiles
    }
  }

  // 复制文件
  const duplicateFile = (fileId: string) => {
    const file = files.value.find(f => f.id === fileId)
    if (!file) return null

    // 创建新文件名 (添加 "副本" 后缀)
    let baseName = file.name
    const lastDotIndex = baseName.lastIndexOf('.')
    let extension = ''

    if (lastDotIndex !== -1) {
      extension = baseName.substring(lastDotIndex)
      baseName = baseName.substring(0, lastDotIndex)
    }

    const newName = `${baseName} 副本${extension}`

    // 创建新文件
    const newId = `file-${Date.now()}`
    const newFile: DocumentFile = {
      id: newId,
      name: newName,
      content: file.content,
    }

    files.value = [...files.value, newFile]

    return newId
  }

  // 更新文件内容
  const updateFileContent = (content: string) => {
    activeFileContent.value = content

    // 更新文件内容
    if (activeFile.value) {
      const fileIndex = files.value.findIndex(f => f.id === activeFileId.value)
      if (fileIndex !== -1) {
        const updatedFiles = [...files.value]
        updatedFiles[fileIndex] = {
          ...updatedFiles[fileIndex],
          content,
        }
        files.value = updatedFiles
      }
    }
  }

  // 设置活动文件
  const setActiveFile = (fileId: string | null) => {
    activeFileId.value = fileId

    // 如果有活动文件，更新活动文件内容
    if (fileId) {
      const file = files.value.find(f => f.id === fileId)
      if (file) {
        activeFileContent.value = file.content
      }
    } else {
      activeFileContent.value = ''
    }
  }

  // 切换文件上下文状态
  const toggleFileContext = (fileId: string, isContext: boolean) => {
    if (isContext) {
      // 添加到上下文
      if (!contextFileIds.value.includes(fileId)) {
        contextFileIds.value = [...contextFileIds.value, fileId]
      }
    } else {
      // 从上下文中移除
      contextFileIds.value = contextFileIds.value.filter(id => id !== fileId)
    }
  }

  return {
    files,
    activeFileId,
    activeFileContent,
    contextFileIds,
    activeFile,
    contextFiles,
    getFileExtension,
    createNewFile,
    deleteFile,
    renameFile,
    duplicateFile,
    updateFileContent,
    setActiveFile,
    toggleFileContext,
  }
}
