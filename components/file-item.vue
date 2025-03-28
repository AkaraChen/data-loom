<template>
  <li class="w-full">
    <a 
      class="w-full flex justify-start" 
      :class="{ 'active': isActive }"
      @click="$emit('click')"
    >
      <Icon name="mdi:file-outline" size="16" />
      {{ fileName }}
    </a>
  </li>
</template>

<script setup>
defineProps({
  fileName: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>
