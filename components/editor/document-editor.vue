<template>
  <div class="flex-1 flex">
    <!-- File Explorer (Left Side) -->
    <div class="w-64 bg-base-100 border-r border-base-300 p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-medium flex items-center gap-2">
          <Icon name="mdi:folder-outline" size="20" class="text-primary" />
          文档列表
        </h2>
        <button
          class="btn btn-ghost btn-sm btn-circle"
          @click="showNewFileDialog"
        >
          <Icon name="mdi:plus" size="16" />
        </button>
      </div>

      <!-- Document List -->
      <ul class="menu menu-compact w-full p-0">
        <EditorFileItem
          v-for="file in files"
          :key="file.id"
          :fileName="file.name"
          :isActive="activeFileId === file.id"
          :disabled="blocking"
          @click="handleFileSelect(file.id)"
          @delete="handleDeleteFile(file.id)"
          @rename="handleRenameFile(file.id)"
          @duplicate="handleDuplicateFile(file.id)"
        />
      </ul>
    </div>

    <!-- File Content -->
    <div class="flex-1 flex flex-col">
      <!-- Editor Tabs -->
      <div class="flex bg-base-100 border-b border-base-content/10">
        <div class="flex-1 flex overflow-x-auto">
          <div
            v-if="activeFile"
            class="px-3 py-2 flex items-center gap-2 bg-base-100 border-r border-base-content/10"
          >
            <Icon name="mdi:file-outline" size="16" class="text-primary" />
            <span>{{ activeFile.name }}</span>
            <button class="btn btn-ghost btn-xs btn-circle" @click="closeFile">
              <Icon name="mdi:close" size="12" />
            </button>
          </div>
        </div>
      </div>

      <!-- Editor Content -->
      <div class="flex-1 overflow-auto bg-base-100 p-0.5 font-mono text-sm">
        <textarea
          v-if="activeFile"
          class="textarea !border-transparent !outline-none w-full h-full"
          placeholder="Enter content..."
          :value="activeFileContent"
          @input="updateFileContent($event)"
        ></textarea>
        <div
          v-else
          class="flex items-center justify-center h-full text-base-content/50"
        >
          <p>选择或创建一个文件开始编辑</p>
        </div>
      </div>

      <!-- Editor Actions -->
      <div
        class="flex justify-end p-2 bg-base-100 border-t border-base-content/10"
      >
        <button
          class="btn btn-sm btn-primary gap-1"
          :disabled="!activeFile"
          @click="handleProcessFile"
        >
          <Icon name="mdi:play" size="16" />
          处理
        </button>
      </div>
    </div>
  </div>

  <!-- 新建文件对话框 -->
  <EditorNewFileDialog ref="newFileDialog" @create="createNewFile" />
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'

// 文档文件接口
interface DocumentFile {
  id: string
  name: string
  content: string
}

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

// 新建文件对话框引用
const newFileDialog = ref<{ open: () => void } | null>(null)

// 计算当前活动文件
const activeFile = computed(() => {
  if (!activeFileId.value) return null
  return files.value.find(file => file.id === activeFileId.value) || null
})

// 监听活动文件变化，更新内容
watch(activeFile, newActiveFile => {
  if (newActiveFile) {
    activeFileContent.value = newActiveFile.content
  } else {
    activeFileContent.value = ''
  }
})

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
  const newId = `file-${Date.now()}`
  const newFile: DocumentFile = {
    id: newId,
    name: fileName,
    content: '',
  }

  files.value = [...files.value, newFile]

  // 只有在非阻塞状态下才更新活动文件ID
  if (!props.blocking) {
    activeFileId.value = newId
  } else {
    emit('fileSelectBlocked', newId)
  }
}

// 关闭文件
const closeFile = () => {
  activeFileId.value = null
}

// 更新文件内容
const updateFileContent = (event: Event) => {
  const content = (event.target as HTMLTextAreaElement).value
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

// 处理文件
const handleProcessFile = () => {
  if (activeFile.value) {
    emit('process', activeFile.value)
  }
}

// 删除文件
const handleDeleteFile = (fileId: string) => {
  files.value = files.value.filter(file => file.id !== fileId)
  if (activeFileId.value === fileId) {
    activeFileId.value = null
  }
}

// 重命名文件
const handleRenameFile = (fileId: string) => {
  const file = files.value.find(f => f.id === fileId)
  if (!file) return

  // 解析文件名和扩展名
  const fileNameParts = file.name.split('.')
  const extension = fileNameParts.length > 1 ? fileNameParts.pop() || '' : ''
  const currentBaseName = fileNameParts.join('.')

  const newBaseName = prompt('输入新文件名（不包含扩展名）', currentBaseName)
  
  if (newBaseName && newBaseName.trim()) {
    // 检查用户输入是否包含扩展名
    if (newBaseName.includes('.')) {
      alert('请不要输入扩展名，只需输入文件名')
      return
    }
    
    // 构建新的完整文件名（保留原扩展名）
    const finalName = extension ? `${newBaseName.trim()}.${extension}` : newBaseName.trim()
    
    const fileIndex = files.value.findIndex(f => f.id === fileId)
    if (fileIndex !== -1) {
      const updatedFiles = [...files.value]
      updatedFiles[fileIndex] = {
        ...updatedFiles[fileIndex],
        name: finalName,
      }
      files.value = updatedFiles
    }
  }
}

// 复制文件
const handleDuplicateFile = (fileId: string) => {
  const file = files.value.find(f => f.id === fileId)
  if (!file) return

  // 解析文件名和扩展名
  const fileNameParts = file.name.split('.')
  const extension = fileNameParts.length > 1 ? fileNameParts.pop() || '' : ''
  const baseName = fileNameParts.join('.')
  
  // 检查文件名中是否已经包含"复制"字样
  const copyRegex = /\(复制(?:\s*\d*)?\)$/
  const hasCopyText = copyRegex.test(baseName)
  
  let newName
  if (hasCopyText) {
    // 如果已经有"复制"字样，则添加数字或增加数字
    const match = baseName.match(/\(复制(?:\s*(\d+))?\)$/)
    const copyNumber = match && match[1] ? parseInt(match[1], 10) + 1 : 1
    const baseNameWithoutCopy = baseName.replace(copyRegex, '').trim()
    newName = copyNumber > 1 
      ? `${baseNameWithoutCopy} (复制 ${copyNumber})` 
      : `${baseNameWithoutCopy} (复制 1)`
  } else {
    // 如果没有"复制"字样，则添加
    newName = `${baseName} (复制)`
  }
  
  // 添加扩展名
  const finalName = extension ? `${newName}.${extension}` : newName

  const newId = `file-${Date.now()}`
  const newFile: DocumentFile = {
    id: newId,
    name: finalName,
    content: file.content,
  }

  files.value = [...files.value, newFile]

  // 只有在非阻塞状态下才更新活动文件ID
  if (!props.blocking) {
    activeFileId.value = newId
  }
}
</script>

<style scoped>
/* 确保菜单项占满宽度 */
:deep(.menu li a) {
  width: 100%;
}
</style>
