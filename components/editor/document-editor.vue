<template>
  <div class="flex-1 flex">
    <!-- File Explorer (Left Side) -->
    <EditorFileExplorer
      :files="files"
      :active-file-id="activeFileId"
      v-model:contextFileIds="contextFileIds"
      :disabled="blocking"
      @select-file="handleFileSelect"
      @new-file="showNewFileDialog"
      @delete-file="handleDeleteFile"
      @rename-file="handleRenameFile"
      @duplicate-file="handleDuplicateFile"
    />

    <!-- Editor Area (Right Side) -->
    <EditorArea
      :files="files"
      :active-file-id="activeFileId"
      v-model="activeFileContent"
      :is-preview-mode="isPreviewMode"
      :disabled="blocking"
      @toggle-preview="togglePreviewMode"
      @process-file="handleProcessFile"
      @close-file="closeFile"
    />
  </div>

  <!-- 新建文件对话框 -->
  <EditorNewFileDialog ref="newFileDialog" @create="createNewFile" />

  <!-- 重命名文件对话框 -->
  <EditorRenameFileDialog ref="renameFileDialog" @rename="confirmRenameFile" />

  <!-- 处理文件对话框 -->
  <EditorProcessFileDialog
    ref="processFileDialog"
    @process="handleProcessAction"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EditorFileExplorer from './file-explorer.vue'
import EditorArea from './editor-area.vue'
import {
  type DocumentFile,
  createFileObject,
  createDuplicateFileName,
  findFile,
  findFileIndex,
} from '~/utils/file'

// 定义属性
const props = defineProps({
  blocking: {
    type: Boolean,
    default: false,
  },
})

// 定义事件
const emit = defineEmits(['process', 'fileSelectBlocked'])

// 使用 defineModel 暴露接口
const files = defineModel<DocumentFile[]>('files', { default: () => [] })
const activeFileId = defineModel<string | null>('activeFileId', {
  default: null,
})
const activeFileContent = defineModel<string>('activeFileContent', {
  default: '',
})
const contextFileIds = defineModel<string[]>('contextFileIds', {
  default: () => [],
})

// 新建文件对话框引用
const newFileDialog = ref<{ open: () => void } | null>(null)

// 重命名文件对话框引用
const renameFileDialog = ref<{ open: (fileName: string) => void } | null>(null)

// 处理文件对话框引用
const processFileDialog = ref<{ open: (fileName: string) => void } | null>(null)

// 当前正在重命名的文件ID
const renamingFileId = ref<string | null>(null)

// 处理文件选择
const handleFileSelect = (fileId: string) => {
  if (props.blocking) {
    // 如果处于阻塞状态，发出事件但不更新活动文件
    emit('fileSelectBlocked', fileId)
    return
  }

  // 非阻塞状态，正常更新活动文件
  activeFileId.value = fileId
}

// 显示新建文件对话框
const showNewFileDialog = () => {
  newFileDialog.value?.open()
}

// 创建新文件
const createNewFile = (fileName: string) => {
  const newFile = createFileObject(fileName)
  files.value = [...files.value, newFile]

  // 只有在非阻塞状态下才更新活动文件ID
  if (!props.blocking) {
    activeFileId.value = newFile.id
  } else {
    emit('fileSelectBlocked', newFile.id)
  }
}

// 关闭文件
const closeFile = () => {
  // 在 blocking 状态下禁止关闭文件
  if (props.blocking) {
    return
  }

  activeFileId.value = null
}

// 处理文件
const handleProcessFile = () => {
  const file = findFile(files.value, activeFileId.value || '')
  if (file) {
    // 打开处理文件对话框
    processFileDialog.value?.open(file.name)
  }
}

// 处理文件动作
const handleProcessAction = (action: string) => {
  const file = findFile(files.value, activeFileId.value || '')
  if (file) {
    // 将处理动作和文件一起发送给父组件
    emit('process', { file, action })
  }
}

// 删除文件
const handleDeleteFile = (fileId: string) => {
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
const handleRenameFile = (fileId: string) => {
  const file = findFile(files.value, fileId)
  if (!file) return

  // 保存当前正在重命名的文件ID
  renamingFileId.value = fileId

  // 打开重命名对话框
  renameFileDialog.value?.open(file.name)
}

// 确认重命名文件
const confirmRenameFile = (newFileName: string) => {
  if (!renamingFileId.value) return

  // 更新文件名
  const fileIndex = findFileIndex(files.value, renamingFileId.value)
  if (fileIndex !== -1) {
    const updatedFiles = [...files.value]
    updatedFiles[fileIndex] = {
      ...updatedFiles[fileIndex],
      name: newFileName,
    }
    files.value = updatedFiles
  }

  // 重置重命名文件ID
  renamingFileId.value = null
}

// 复制文件
const handleDuplicateFile = (fileId: string) => {
  const file = findFile(files.value, fileId)
  if (!file) return

  // 创建新文件名 (添加 "副本" 后缀)
  const newName = createDuplicateFileName(file.name)

  // 创建新文件
  const newId = `file-${Date.now()}`
  const newFile: DocumentFile = {
    id: newId,
    name: newName,
    content: file.content,
  }

  files.value = [...files.value, newFile]

  // 只有在非阻塞状态下才更新活动文件ID
  if (!props.blocking) {
    activeFileId.value = newId
  } else {
    emit('fileSelectBlocked', newId)
  }
}

// 预览模式
const isPreviewMode = ref(false)

// 切换预览模式
const togglePreviewMode = () => {
  isPreviewMode.value = !isPreviewMode.value
}
</script>
