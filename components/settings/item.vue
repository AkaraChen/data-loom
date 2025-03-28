<template>
  <div
    class="mb-3 border-b border-base-300 pb-3 last:border-b-0 last:pb-0 last:mb-0"
  >
    <div
      class="flex flex-col md:flex-row md:items-start md:justify-between gap-2"
    >
      <div class="flex-1">
        <h3 class="text-base font-medium mb-0.5">{{ title }}</h3>
        <p class="text-xs opacity-70">{{ description }}</p>
      </div>
      <div class="w-full md:w-auto md:min-w-[250px]">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})
</script>
