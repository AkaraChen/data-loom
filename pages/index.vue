<template>
  <div class="flex flex-row h-[calc(100vh-3.5rem)]">
    <!-- Sidebar -->
    <div class="w-64 bg-base-100 p-4 shadow-lg border-r border-base-300">
      <!-- Task Section -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-2">
          <Icon
            name="mdi:clipboard-text-outline"
            size="20"
            class="text-primary"
          />
          <h2 class="text-lg font-medium">任务描述</h2>
        </div>
        <textarea
          class="textarea textarea-bordered w-full"
          placeholder="Enter task description..."
        ></textarea>
      </div>

      <!-- Requirements Section -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="mdi:chevron-right" size="20" class="text-primary" />
          <h2 class="text-lg font-medium">要求</h2>
        </div>
        <textarea
          class="textarea textarea-bordered w-full"
          placeholder="Enter requirements..."
        ></textarea>
      </div>

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
          <li class="w-full">
            <a class="active w-full flex justify-start">
              <Icon name="mdi:file-outline" size="16" />
              a.txt
            </a>
          </li>
          <li class="w-full">
            <a class="w-full flex justify-start">
              <Icon name="mdi:file-outline" size="16" />
              b.txt
            </a>
          </li>
          <li class="w-full">
            <a class="w-full flex justify-start">
              <Icon name="mdi:file-outline" size="16" />
              c.txt
            </a>
          </li>
        </ul>
      </div>

      <!-- File Content (Right Side - VSCode Style) -->
      <div class="flex-1 flex flex-col">
        <!-- Editor Tabs -->
        <div class="flex bg-base-100 border-b border-base-content/10">
          <div class="flex-1 flex overflow-x-auto">
            <div
              class="px-3 py-2 flex items-center gap-2 bg-base-100 border-r border-base-content/10"
            >
              <Icon name="mdi:file-outline" size="16" class="text-primary" />
              <span>a.txt</span>
              <button class="btn btn-ghost btn-xs btn-circle">
                <Icon name="mdi:close" size="12" />
              </button>
            </div>
          </div>
        </div>

        <!-- Editor Content -->
        <div class="flex-1 overflow-auto bg-base-100 p-4 font-mono text-sm">
          Content will appear here...
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
definePageMeta({
  layout: 'default',
})
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
