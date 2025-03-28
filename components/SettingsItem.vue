<template>
  <div class="mb-6 border-b border-base-300 pb-6 last:border-b-0 last:pb-0">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div class="flex-1">
        <h3 class="text-lg font-medium mb-1">{{ title }}</h3>
        <p class="text-sm opacity-70">{{ description }}</p>
      </div>
      <div class="w-full md:w-auto md:min-w-[300px]">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
});
</script>
