<template>
  <li
    class="w-full"
    ref="liRef"
    @click="disabled ? null : $emit('click')"
    :class="{ 'cursor-not-allowed opacity-70': disabled }"
  >
    <a
      class="w-full flex justify-start active:!bg-transparent"
      :class="{
        'btn-active': isActive,
      }"
    >
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          class="checkbox checkbox-xs checkbox-primary"
          :checked="checked"
          @change="updateChecked($event)"
          @click.stop
        />
        <Icon name="mdi:file-outline" size="16" />
        <span 
          class="truncate max-w-[120px]" 
          :title="fileName"
        >{{ fileName }}</span>
      </div>
      <details class="dropdown ml-auto" ref="detailsRef" :open="isOpen">
        <summary
          class="btn btn-ghost btn-square btn-xs !bg-transparent !border-transparent"
          @click.stop
        >
          <Icon name="mdi:more-vert" size="16" />
        </summary>
        <ul
          class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm !fixed"
          @click.stop="isOpen = false"
        >
          <li @click="$emit('rename')">
            <a>
              <Icon name="mdi:rename" size="16" />
              重命名</a
            >
          </li>
          <li @click="$emit('duplicate')">
            <a>
              <Icon name="mdi:content-copy" size="16" />
              复制</a
            >
          </li>
          <li @click="$emit('delete')">
            <a class="text-error">
              <Icon name="mdi:delete" size="16" />
              删除</a
            >
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

// 使用 defineModel 实现双向绑定
const checked = defineModel<boolean>('checked', { default: false })

// 更新选中状态
const updateChecked = (event: Event) => {
  const target = event.target as HTMLInputElement
  checked.value = target.checked
}

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
