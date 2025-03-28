<template>
  <div class="flex flex-row h-[calc(100vh-3.5rem)]">
    <!-- Sidebar -->
    <div class="w-64 bg-base-100 p-4 shadow-lg border-r border-base-300">
      <!-- Task Section -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 class="text-lg font-medium">任务描述</h2>
        </div>
        <textarea class="textarea textarea-bordered w-full" placeholder="Enter task description..."></textarea>
      </div>

      <!-- Requirements Section -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <h2 class="text-lg font-medium">要求</h2>
        </div>
        <textarea class="textarea textarea-bordered w-full" placeholder="Enter requirements..."></textarea>
      </div>

      <!-- Action Button -->
      <button class="btn btn-primary w-full gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        生成
      </button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex">
      <!-- File Explorer (Left Side) -->
      <div class="w-64 bg-base-100 border-r border-base-300 p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            文档列表
          </h2>
        </div>
        
        <!-- Updated menu with full width hover -->
        <ul class="menu menu-compact w-full p-0">
          <li class="w-full">
            <a class="active w-full flex justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              a.txt
            </a>
          </li>
          <li class="w-full">
            <a class="w-full flex justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              b.txt
            </a>
          </li>
          <li class="w-full">
            <a class="w-full flex justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
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
            <div class="px-3 py-2 flex items-center gap-2 bg-base-100 border-r border-base-content/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>a.txt</span>
              <button class="btn btn-ghost btn-xs btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Editor Content -->
        <div class="flex-1 overflow-auto bg-base-100 p-4 font-mono text-sm">
          Content will appear here...
        </div>
        
        <!-- Editor Actions -->
        <div class="flex justify-end p-2 bg-base-100 border-t border-base-content/10">
          <button class="btn btn-sm btn-primary gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            处理
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 页面逻辑
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
