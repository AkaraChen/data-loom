<template>
  <div class="plaintext-preview whitespace-pre-wrap">
    {{ content }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  content: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.plaintext-preview {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  font-family: monospace;
}
</style>
