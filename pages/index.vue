<template>
  <div class="flex flex-row h-[calc(100vh-3.5rem)]">
    <!-- Sidebar -->
    <div class="w-64 bg-base-100 p-4 shadow-lg border-r border-base-300">
      <!-- Task Section -->
      <UiTextSection
        icon="mdi:clipboard-text-outline"
        title="任务描述"
        placeholder="Enter task description..."
        v-model="taskDescription"
      />

      <!-- Requirements Section -->
      <UiTextSection
        icon="mdi:chevron-right"
        title="要求"
        placeholder="Enter requirements..."
        v-model="requirements"
      />

      <!-- Action Button -->
      <button class="btn btn-primary w-full gap-2">
        <Icon name="mdi:play-circle-outline" size="20" />
        生成
      </button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex">
      <!-- File Explorer (Left Side) -->
      <div class="w-64 bg-base-100 border-r border-base-300 p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-medium flex items-center gap-2">
            <Icon name="mdi:folder-outline" size="20" class="text-primary" />
            文档列表
          </h2>
        </div>

        <!-- Updated menu with full width hover -->
        <ul class="menu menu-compact w-full p-0">
          <EditorFileItem 
            fileName="a.txt"
            :isActive="activeFile === 'a.txt'"
            @click="activeFile = 'a.txt'"
          />
          <EditorFileItem 
            fileName="b.txt"
            :isActive="activeFile === 'b.txt'"
            @click="activeFile = 'b.txt'"
          />
          <EditorFileItem 
            fileName="c.txt"
            :isActive="activeFile === 'c.txt'"
            @click="activeFile = 'c.txt'"
          />
        </ul>
      </div>

      <!-- File Content -->
      <div class="flex-1 flex flex-col">
        <!-- Editor Tabs -->
        <div class="flex bg-base-100 border-b border-base-content/10">
          <div class="flex-1 flex overflow-x-auto">
            <div
              class="px-3 py-2 flex items-center gap-2 bg-base-100 border-r border-base-content/10"
            >
              <Icon name="mdi:file-outline" size="16" class="text-primary" />
              <span>{{ activeFile }}</span>
              <button class="btn btn-ghost btn-xs btn-circle">
                <Icon name="mdi:close" size="12" />
              </button>
            </div>
          </div>
        </div>

        <!-- Editor Content -->
        <div class="flex-1 overflow-auto bg-base-100 p-0.5 font-mono text-sm">
          <textarea
            class="textarea !border-transparent !outline-none w-full h-full"
            placeholder="Enter content..."
          ></textarea>
        </div>

        <!-- Editor Actions -->
        <div
          class="flex justify-end p-2 bg-base-100 border-t border-base-content/10"
        >
          <button class="btn btn-sm btn-primary gap-1">
            <Icon name="mdi:play" size="16" />
            处理
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
definePageMeta({
  layout: 'default',
})

const taskDescription = ref('')
const requirements = ref('')
const activeFile = ref('a.txt')
</script>

<style>
/* Add custom styles for full-width hover in menu */
.menu li a {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.menu li {
  width: 100%;
}

/* Ensure menu items take full width */
.menu-compact > li > a {
  width: 100% !important;
  margin: 0;
  border-radius: 0.25rem;
}
</style>
