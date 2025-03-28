<template>
  <div class="flex-1 flex">
    <!-- File Explorer (Left Side) -->
    <div
      class="w-64 bg-base-100 border-r border-base-300 p-4 flex flex-col h-full"
    >
      <!-- Document List Section - Max 2/3 height -->
      <div class="flex flex-col h-full max-h-[66%] min-h-[200px]">
        <div class="flex items-center justify-between mb-2">
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
        <div class="overflow-y-auto flex-1">
          <ul class="menu menu-compact w-full p-0">
            <EditorFileItem
              v-for="file in files"
              :key="file.id"
              :fileName="file.name"
              :isActive="activeFileId === file.id"
              :disabled="blocking"
              v-model:checked="fileContextMap[file.id]"
              @click="handleFileSelect(file.id)"
              @delete="handleDeleteFile(file.id)"
              @rename="handleRenameFile(file.id)"
              @duplicate="handleDuplicateFile(file.id)"
            />
          </ul>
        </div>
      </div>

      <!-- Context Files Section - Max 1/3 height -->
      <div
        v-if="contextFiles.length > 0"
        class="mt-4 flex-1 max-h-[33%] flex flex-col"
      >
        <div class="mb-2">
          <h3 class="font-medium flex items-center gap-2">
            <Icon name="mdi:link-variant" size="16" class="text-primary" />
            上下文文件
          </h3>
          <div class="text-xs text-base-content/70">
            已选择 {{ contextFiles.length }} 个文件作为上下文
          </div>
        </div>
        <div class="overflow-y-auto flex-1">
          <ul class="menu menu-compact w-full p-0 bg-base-200 rounded-box">
            <li
              v-for="file in contextFiles"
              :key="file.id"
              class="text-xs py-1 px-2"
            >
              {{ file.name }}
            </li>
          </ul>
        </div>
      </div>
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
        <EditorContentPreview
          v-if="isPreviewMode && activeFile"
          v-model="activeFileContent"
          :fileType="getFileExtension(activeFile?.name || '')"
        />
        <MonacoEditor
          v-else-if="activeFile"
          v-model="activeFileContent"
          :lang="getFileExtension(activeFile?.name || '')"
          @update:modelValue="updateFileContent"
          class="w-full h-full"
        />
        <!-- <textarea
          v-else-if="activeFile"
          class="textarea !border-transparent !outline-none w-full h-full"
          placeholder="Enter content..."
          :value="activeFileContent"
          @input="updateFileContent($event)"
        ></textarea> -->
        <div
          v-else
          class="flex items-center justify-center h-full text-base-content/50"
        >
          <p>选择或创建一个文件开始编辑</p>
        </div>
      </div>

      <!-- Editor Actions -->
      <div
        class="flex justify-between p-2 bg-base-100 border-t border-base-content/10"
      >
        <div class="flex items-center">
          <button
            class="btn btn-sm btn-ghost gap-1"
            @click="togglePreviewMode"
            :class="{ 'btn-active': isPreviewMode }"
          >
            <Icon
              :name="isPreviewMode ? 'mdi:eye' : 'mdi:code-tags'"
              size="16"
            />
            {{ isPreviewMode ? '预览' : '源码' }}
          </button>
        </div>
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
import { computed, watch, ref, reactive } from 'vue'
import EditorContentPreview from './content-preview.vue'

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
const contextFileIds = defineModel<string[]>('contextFileIds', {
  default: () => [],
})

// 文件上下文映射表，用于跟踪每个文件的选中状态
const fileContextMap = reactive<Record<string, boolean>>({})

// 监听文件列表变化，更新映射表
watch(
  files,
  newFiles => {
    // 添加新文件到映射表
    newFiles.forEach(file => {
      if (fileContextMap[file.id] === undefined) {
        fileContextMap[file.id] = contextFileIds.value.includes(file.id)
      }
    })

    // 移除不存在的文件
    Object.keys(fileContextMap).forEach(fileId => {
      if (!newFiles.some(file => file.id === fileId)) {
        delete fileContextMap[fileId]
      }
    })
  },
  { immediate: true, deep: true },
)

// 监听映射表变化，更新上下文文件ID数组
watch(
  fileContextMap,
  newMap => {
    const selectedIds = Object.entries(newMap)
      .filter(([_, checked]) => checked)
      .map(([id]) => id)

    contextFileIds.value = selectedIds
  },
  { deep: true },
)

// 监听上下文文件ID数组变化，更新映射表
watch(
  contextFileIds,
  newIds => {
    files.value.forEach(file => {
      fileContextMap[file.id] = newIds.includes(file.id)
    })
  },
  { deep: true },
)

// 计算当前上下文文件列表
const contextFiles = computed(() => {
  return files.value.filter(file => contextFileIds.value.includes(file.id))
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
  fileContextMap[newId] = false // 初始化新文件的上下文状态

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

// 处理文件
const handleProcessFile = () => {
  if (activeFile.value) {
    emit('process', activeFile.value)
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

  // 从映射表中移除
  delete fileContextMap[fileId]
}

// 重命名文件
const handleRenameFile = (fileId: string) => {
  const file = files.value.find(f => f.id === fileId)
  if (!file) return

  // 使用 prompt 获取新文件名
  const newName = prompt('输入新文件名:', file.name)
  if (!newName || newName === file.name) return

  // 更新文件名
  const fileIndex = files.value.findIndex(f => f.id === fileId)
  if (fileIndex !== -1) {
    const updatedFiles = [...files.value]
    updatedFiles[fileIndex] = {
      ...updatedFiles[fileIndex],
      name: newName,
    }
    files.value = updatedFiles
  }
}

// 复制文件
const handleDuplicateFile = (fileId: string) => {
  const file = files.value.find(f => f.id === fileId)
  if (!file) return

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
  fileContextMap[newId] = false // 初始化新文件的上下文状态

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

// 获取文件扩展名
const getFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex === -1) return 'txt'
  return fileName.substring(lastDotIndex + 1).toLowerCase()
}
</script>

<style scoped>
/* 确保菜单项占满宽度 */
:deep(.menu li a) {
  width: 100%;
}

.markdown-body {
  padding: 0.5rem;
}
</style>
