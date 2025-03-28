<template>
  <div class="card bg-base-100 shadow-xl mb-6">
    <div class="card-body">
      <h2 class="card-title flex items-center gap-2 mb-6 pb-4 border-b border-base-300">
        <Icon :name="icon" size="24" class="text-primary" />
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
