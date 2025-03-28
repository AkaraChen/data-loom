<template>
  <li class="w-full">
    <a 
      class="w-full flex justify-start" 
      :class="{ 
        'active': isActive,
        'cursor-not-allowed opacity-70': disabled
      }"
      @click="$emit('click')"
    >
      <Icon name="mdi:file-outline" size="16" />
      {{ fileName }}
    </a>
  </li>
</template>

<script setup lang="ts">
defineProps({
  fileName: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>
