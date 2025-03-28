<template>
  <div class="flex-1 flex">
    <!-- File Explorer (Left Side) -->
    <div class="w-64 bg-base-100 border-r border-base-300 p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-medium flex items-center gap-2">
          <Icon name="mdi:folder-outline" size="20" class="text-primary" />
          文档列表
        </h2>
        <button class="btn btn-ghost btn-sm btn-circle" @click="addNewFile">
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
          @click="activeFileId = file.id"
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
            <button 
              class="btn btn-ghost btn-xs btn-circle"
              @click="closeFile"
            >
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
          v-model="activeFileContent"
        ></textarea>
        <div v-else class="flex items-center justify-center h-full text-base-content/50">
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
          @click="processFile"
        >
          <Icon name="mdi:play" size="16" />
          处理
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

// 定义接口
interface DocumentFile {
  id: string
  name: string
  content: string
}

// 定义事件
const emit = defineEmits(['process'])

// 使用 defineModel 暴露接口
const files = defineModel<DocumentFile[]>('files')
const activeFileId = defineModel<string | null>('activeFileId')

// 计算当前活动文件
const activeFile = computed(() => {
  return files.value!.find(file => file.id === activeFileId.value) || null
})

// 为活动文件内容创建一个单独的 model
const activeFileContent = defineModel<string>('activeFileContent', { default: '' })

// 监听活动文件变化，更新内容
watch(activeFile, (newFile) => {
  activeFileContent.value = newFile?.content || ''
}, { immediate: true })

// 监听内容变化，更新文件
watch(activeFileContent, (newContent) => {
  if (activeFile.value) {
    const updatedFiles = files.value!.map(file => {
      if (file.id === activeFileId.value) {
        return { ...file, content: newContent }
      }
      return file
    })
    files.value = updatedFiles
  }
})

// 添加新文件
const addNewFile = () => {
  const newId = `file-${Date.now()}`
  const newFile = {
    id: newId,
    name: `新文件-${files.value!.length + 1}.txt`,
    content: ''
  }
  files.value = [...files.value!, newFile]
  activeFileId.value = newId
}

// 关闭文件
const closeFile = () => {
  if (files.value!.length > 0) {
    activeFileId.value = files.value![0].id
  } else {
    activeFileId.value = null
  }
}

// 处理文件
const processFile = () => {
  // 这里可以添加文件处理逻辑
  console.log('处理文件:', activeFile.value)
  emit('process', activeFile.value)
}
</script>

<style scoped>
/* 确保菜单项占满宽度 */
:deep(.menu li a) {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

:deep(.menu li) {
  width: 100%;
}

/* 确保紧凑菜单项占满宽度 */
:deep(.menu-compact > li > a) {
  width: 100% !important;
  margin: 0;
  border-radius: 0.25rem;
}
</style>
