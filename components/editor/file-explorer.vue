<template>
  <div class="w-64 bg-base-100 border-r border-base-300 flex flex-col h-full">
    <!-- Document List Section - Max 2/3 height -->
    <div class="flex flex-col h-full max-h-[66%] min-h-[200px] p-4">
      <div
        :class="[
          'flex items-center justify-between mb-2',
          { 'opacity-50 pointer-events-none': disabled },
        ]"
      >
        <h2 class="font-medium flex items-center gap-2">
          <Icon name="mdi:folder-outline" size="20" class="text-primary" />
          文档列表
        </h2>
        <button
          class="btn btn-ghost btn-sm btn-circle"
          @click="$emit('new-file')"
        >
          <Icon name="mdi:plus" size="16" />
        </button>
      </div>

      <!-- Document List -->
      <div class="overflow-y-auto overflow-x-hidden flex-1">
        <ul class="menu menu-compact w-full p-0">
          <EditorFileItem
            v-for="file in files"
            :key="file.id"
            :fileName="file.name"
            :isActive="activeFileId === file.id"
            :disabled="disabled"
            v-model:checked="fileContextMap[file.id]"
            @click="$emit('select-file', file.id)"
            @delete="$emit('delete-file', file.id)"
            @rename="$emit('rename-file', file.id)"
            @duplicate="$emit('duplicate-file', file.id)"
          />
        </ul>
      </div>
    </div>

    <!-- Context Files Section - Max 1/3 height -->
    <div
      v-if="contextFiles.length > 0"
      class="mt-0 flex-1 max-h-[33%] flex flex-col border-t border-base-300"
    >
      <div class="p-4">
        <h3 class="font-medium flex items-center gap-2">
          <Icon name="mdi:link-variant" size="16" class="text-primary" />
          上下文文件
        </h3>
        <div class="text-xs text-base-content/70">
          已选择 {{ contextFiles.length }} 个文件作为上下文
        </div>
      </div>
      <div class="overflow-y-auto overflow-x-hidden flex-1 px-4 pb-4">
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
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

// 文档文件接口
interface DocumentFile {
  id: string
  name: string
  content: string
}

// 定义属性
const props = defineProps<{
  files: DocumentFile[]
  activeFileId: string | null
  disabled: boolean
}>()

// 使用 defineModel 处理 contextFileIds
const contextFileIds = defineModel<string[]>('contextFileIds', {
  default: () => [],
})

// 定义事件
const emit = defineEmits<{
  'select-file': [fileId: string]
  'new-file': []
  'delete-file': [fileId: string]
  'rename-file': [fileId: string]
  'duplicate-file': [fileId: string]
}>()

// 文件上下文映射表，用于跟踪每个文件的选中状态
const fileContextMap = reactive<Record<string, boolean>>({})

// 监听文件列表变化，更新映射表
watch(
  () => props.files,
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

    if (JSON.stringify(selectedIds) !== JSON.stringify(contextFileIds.value)) {
      // 更新 contextFileIds
      contextFileIds.value = selectedIds
    }
  },
  { deep: true },
)

// 监听上下文文件ID数组变化，更新映射表
watch(
  contextFileIds,
  newIds => {
    props.files.forEach(file => {
      fileContextMap[file.id] = newIds.includes(file.id)
    })
  },
  { deep: true },
)

// 计算当前上下文文件列表
const contextFiles = computed(() => {
  return props.files.filter(file => contextFileIds.value.includes(file.id))
})
</script>

<style scoped>
/* 确保菜单项占满宽度 */
:deep(.menu li a) {
  width: 100%;
}
</style>
