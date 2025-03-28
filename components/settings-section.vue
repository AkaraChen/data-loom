<template>
  <div class="card bg-base-100 shadow-sm mb-4">
    <div class="card-body p-4">
      <h2 class="card-title flex items-center gap-2 mb-3 pb-2 border-b border-base-300 text-lg">
        <Icon :name="icon" size="20" class="text-primary" />
        {{ title }}
      </h2>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'mdi:cog'
  }
});
</script>
