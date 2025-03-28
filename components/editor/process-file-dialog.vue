<template>
  <dialog
    id="process-file-dialog"
    class="modal modal-bottom sm:modal-middle"
    ref="dialogRef"
  >
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">处理文件</h3>
      
      <div class="mb-4">
        <p class="text-base-content/80 mb-2">
          当前文件: <span class="font-medium">{{ fileName }}</span>
        </p>
      </div>
      
      <!-- Custom Processing Form -->
      <div class="form-control mb-4 flex flex-col">
        <textarea 
          class="textarea textarea-bordered h-24 w-full" 
          placeholder="请输入处理要求..." 
          v-model="customPrompt"
        ></textarea>
      </div>

      <div class="modal-action">
        <form method="dialog">
          <button 
            class="btn btn-primary" 
            @click="submitCustomProcess"
            :disabled="!customPrompt.trim()"
          >
            提交
          </button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义可用的处理动作类型
type ProcessAction = 'summarize' | 'analyze' | 'transform' | 'custom'

// 定义事件
const emit = defineEmits(['process'])

// 文件名和自定义提示
const fileName = ref('')
const customPrompt = ref('')
const dialogRef = ref<HTMLDialogElement | null>(null)

// 选择处理动作
const selectAction = (action: ProcessAction) => {
  emit('process', action)
  dialogRef.value?.close()
}

// 提交自定义处理
const submitCustomProcess = () => {
  if (customPrompt.value.trim()) {
    emit('process', { action: 'custom', prompt: customPrompt.value.trim() })
    dialogRef.value?.close()
  }
}

// 打开对话框的方法 - 可以从父组件调用
const open = (currentFileName: string) => {
  fileName.value = currentFileName
  customPrompt.value = ''
  dialogRef.value?.showModal()
}

// 暴露方法给父组件
defineExpose({ open })
</script>
