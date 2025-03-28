<template>
  <div class="flex-1 flex">
    <!-- File Explorer (Left Side) -->
    <div class="w-64 bg-base-100 border-r border-base-300 p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-medium flex items-center gap-2">
          <Icon name="mdi:folder-outline" size="20" class="text-primary" />
          文档列表
        </h2>
        <button class="btn btn-ghost btn-sm btn-circle" @click="editorModel.addNewFile">
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
              @click="editorModel.closeFile"
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
          :value="activeFileContent"
          @input="(e) => editorModel.updateFileContent((e.target as HTMLTextAreaElement).value)"
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
          @click="handleProcessFile"
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
import { useEditorModel, type DocumentFile } from '~/composables/use-editor-model'

// 定义事件
const emit = defineEmits(['process'])

// 使用 defineModel 暴露接口
const files = defineModel<DocumentFile[]>('files', { default: () => [] })
const activeFileId = defineModel<string | null>('activeFileId', { default: null })
const activeFileContent = defineModel<string>('activeFileContent', { default: '' })

// 使用编辑器模型
const editorModel = useEditorModel({
  initialFiles: files.value,
  initialActiveFileId: activeFileId.value,
  fileNamePrefix: '新文件'
})

// 计算当前活动文件 - 用于模板中访问
const activeFile = computed(() => editorModel.activeFile.value)

// 同步模型和组件状态
watch(() => editorModel.files.value, (newFiles) => {
  files.value = newFiles
}, { immediate: true })

watch(() => editorModel.activeFileId.value, (newActiveFileId) => {
  activeFileId.value = newActiveFileId
}, { immediate: true })

watch(() => editorModel.activeFileContent.value, (newContent) => {
  activeFileContent.value = newContent
}, { immediate: true })

// 同步组件状态到模型
watch(() => files.value, (newFiles) => {
  if (newFiles && JSON.stringify(newFiles) !== JSON.stringify(editorModel.files.value)) {
    editorModel.files.value = newFiles
  }
}, { deep: true })

watch(() => activeFileId.value, (newActiveFileId) => {
  if (newActiveFileId !== editorModel.activeFileId.value) {
    editorModel.activeFileId.value = newActiveFileId
  }
})

watch(() => activeFileContent.value, (newContent) => {
  if (newContent !== editorModel.activeFileContent.value) {
    editorModel.updateFileContent(newContent)
  }
})

// 处理文件
const handleProcessFile = () => {
  const file = editorModel.processFile()
  if (file) {
    emit('process', file)
  }
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
