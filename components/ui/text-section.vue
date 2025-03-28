<template>
  <div class="mb-6">
    <div class="flex items-center gap-2 mb-2">
      <Icon :name="icon" size="20" class="text-primary" />
      <h2 class="text-lg font-medium">{{ title }}</h2>
    </div>
    <textarea
      class="textarea textarea-bordered w-full"
      :placeholder="placeholder"
      v-model="content"
    ></textarea>
  </div>
</template>

<script setup>
const content = defineModel()

defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
})
</script>
