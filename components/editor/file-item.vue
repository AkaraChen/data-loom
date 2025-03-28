<template>
  <li class="w-full">
    <a
      class="w-full flex justify-start"
      :class="{
        active: isActive,
        'cursor-not-allowed opacity-70': disabled,
      }"
      @click="disabled ? null : $emit('click')"
    >
      <Icon name="mdi:file-outline" size="16" />
      {{ fileName }}
      <details class="dropdown ml-auto">
        <summary class="btn btn-ghost btn-square btn-xs">
          <Icon name="mdi:more-vert" size="16"/>
        </summary>
        <ul
          class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
        >
          <li><a>Item 1</a></li>
          <li><a>Item 2</a></li>
        </ul>
      </details>
    </a>
  </li>
</template>

<script setup lang="ts">
defineProps({
  fileName: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>
