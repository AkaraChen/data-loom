<template>
  <div class="toast toast-bottom toast-end z-50">
    <div v-for="(toast, index) in toasts" :key="index" 
         :class="['alert', getAlertClass(toast.type)]">
      <div>
        <Icon v-if="toast.type" :name="getIconName(toast.type)" class="w-6 h-6 mr-2" />
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/use-toast'

// 获取 toast 状态
const { toasts } = useToast()

// 获取 alert 类名
const getAlertClass = (type?: string) => {
  switch (type) {
    case 'info':
      return 'alert-info'
    case 'success':
      return 'alert-success'
    case 'warning':
      return 'alert-warning'
    case 'error':
      return 'alert-error'
    default:
      return 'alert-info'
  }
}

// 获取图标名称
const getIconName = (type: string) => {
  switch (type) {
    case 'info':
      return 'mdi:information-outline'
    case 'success':
      return 'mdi:check-circle-outline'
    case 'warning':
      return 'mdi:alert-outline'
    case 'error':
      return 'mdi:alert-circle-outline'
    default:
      return 'mdi:information-outline'
  }
}
</script>
