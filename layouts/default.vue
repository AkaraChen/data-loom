<template>
  <div class="min-h-screen bg-base-200">
    <!-- Navbar - Simplified with just gear icon and aligned padding -->
    <div class="bg-base-100 border-b border-base-300">
      <div class="px-4 flex items-center h-14">
        <NuxtLink to="/" class="flex-1 flex items-center gap-3">
          <Icon name="mdi:lightning-bolt" size="24" class="text-primary" />
          <span class="text-lg font-medium">Data Loom</span>
        </NuxtLink>
        <div>
          <NuxtLink to="/settings" class="btn btn-sm btn-ghost btn-circle">
            <Icon name="mdi:cog" size="20" />
          </NuxtLink>
        </div>
      </div>
    </div>
    <slot />

    <!-- Toast 组件 -->
    <UiToast />
  </div>
</template>

<script setup lang="ts">
// 这里不需要导入任何内容，因为 UiToast 组件会自动导入
</script>
