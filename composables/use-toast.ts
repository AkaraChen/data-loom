import { ref } from 'vue'
import type { Toast } from '~/types/toast'

// 创建一个全局的 toast 状态
const toasts = ref<Toast[]>([])

export function useToast() {
  // 显示 toast
  const showToast = (toast: Toast) => {
    // 添加 toast 到列表
    toasts.value.push(toast)
    
    // 设置自动移除
    const duration = toast.duration || 3000
    setTimeout(() => {
      // 找到要移除的 toast 的索引
      const index = toasts.value.findIndex(t => t === toast)
      if (index !== -1) {
        toasts.value.splice(index, 1)
      }
    }, duration)
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
    info,
    success,
    warning,
    error
  }
}
