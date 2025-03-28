import { ref } from 'vue'
import type { Toast } from '~/types/toast'

// 创建一个全局的 toast 状态
const toasts = ref<Toast[]>([])

// 为每个 toast 创建一个唯一 ID
let nextId = 0

export function useToast() {
  // 显示 toast
  const showToast = (toast: Toast) => {
    // 添加唯一 ID
    const id = nextId++
    const toastWithId = { ...toast, id }
    
    // 添加 toast 到列表
    toasts.value.push(toastWithId)
    
    // 确保只在客户端执行
    if (import.meta.client) {
      // 设置自动移除
      const duration = toast.duration || 3000
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }
  
  // 移除指定 ID 的 toast
  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  // 快捷方法
  const info = (message: string, duration?: number) => {
    showToast({ message, type: 'info', duration })
  }

  const success = (message: string, duration?: number) => {
    showToast({ message, type: 'success', duration })
  }

  const warning = (message: string, duration?: number) => {
    showToast({ message, type: 'warning', duration })
  }

  const error = (message: string, duration?: number) => {
    showToast({ message, type: 'error', duration })
  }

  return {
    toasts,
    showToast,
    removeToast,
    info,
    success,
    warning,
    error
  }
}
