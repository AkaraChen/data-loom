<template>
  <li class="w-full" ref="liRef">
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
      <details class="dropdown ml-auto" ref="detailsRef" :open="isOpen">
        <summary class="btn btn-ghost btn-square btn-xs" @click.stop>
          <Icon name="mdi:more-vert" size="16" />
        </summary>
        <ul
          class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          @click.stop="isOpen = false"
        >
          <li><a @click="$emit('rename')">Rename</a></li>
          <li><a @click="$emit('duplicate')">Duplicate</a></li>
          <li>
            <a @click="$emit('delete')" class="text-error">Delete</a>
          </li>
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

const emit = defineEmits(['click', 'rename', 'duplicate', 'delete'])

const liRef = ref<HTMLElement | null>(null)
const detailsRef = ref<HTMLDetailsElement | null>(null)
const isOpen = ref(false)

// Handle click outside to close the dropdown
function handleClickOutside(event: MouseEvent) {
  if (detailsRef.value && !detailsRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

// Watch for details open state changes
watch(isOpen, newValue => {
  if (newValue) {
    // Add click event listener when dropdown opens
    nextTick(() => {
      document.addEventListener('click', handleClickOutside)
    })
  } else {
    // Remove click event listener when dropdown closes
    document.removeEventListener('click', handleClickOutside)
  }
})

// Watch the actual details element's open attribute
onMounted(() => {
  if (detailsRef.value) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'open') {
          isOpen.value = detailsRef.value?.hasAttribute('open') || false
        }
      })
    })

    observer.observe(detailsRef.value, { attributes: true })

    // Clean up observer on unmount
    onUnmounted(() => {
      observer.disconnect()
      document.removeEventListener('click', handleClickOutside)
    })
  }
})
</script>
