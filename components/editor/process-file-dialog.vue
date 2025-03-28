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
        <p class="text-xs text-base-content/70">
          请选择要对此文件执行的操作
        </p>
      </div>

      <div class="grid grid-cols-1 gap-3 mb-4">
        <button 
          class="btn btn-outline flex justify-start gap-2 normal-case" 
          @click="selectAction('summarize')"
        >
          <Icon name="mdi:text-box-outline" size="18" />
          <div class="flex flex-col items-start">
            <span>总结内容</span>
            <span class="text-xs text-base-content/70">生成文档内容的摘要</span>
          </div>
        </button>
        
        <button 
          class="btn btn-outline flex justify-start gap-2 normal-case" 
          @click="selectAction('analyze')"
        >
          <Icon name="mdi:chart-box-outline" size="18" />
          <div class="flex flex-col items-start">
            <span>分析数据</span>
            <span class="text-xs text-base-content/70">分析文档中的数据并生成报告</span>
          </div>
        </button>
        
        <button 
          class="btn btn-outline flex justify-start gap-2 normal-case" 
          @click="selectAction('transform')"
        >
          <Icon name="mdi:file-replace-outline" size="18" />
          <div class="flex flex-col items-start">
            <span>转换格式</span>
            <span class="text-xs text-base-content/70">将文档转换为其他格式</span>
          </div>
        </button>
        
        <button 
          class="btn btn-outline flex justify-start gap-2 normal-case" 
          @click="selectAction('custom')"
        >
          <Icon name="mdi:cog-outline" size="18" />
          <div class="flex flex-col items-start">
            <span>自定义处理</span>
            <span class="text-xs text-base-content/70">使用自定义提示进行处理</span>
          </div>
        </button>
      </div>

      <div class="modal-action">
        <form method="dialog">
          <button class="btn">取消</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>关闭</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义可用的处理动作类型
type ProcessAction = 'summarize' | 'analyze' | 'transform' | 'custom'

// 定义事件
const emit = defineEmits(['process'])

// 文件名
const fileName = ref('')
const dialogRef = ref<HTMLDialogElement | null>(null)

// 选择处理动作
const selectAction = (action: ProcessAction) => {
  emit('process', action)
  dialogRef.value?.close()
}

// 打开对话框的方法 - 可以从父组件调用
const open = (currentFileName: string) => {
  fileName.value = currentFileName
  dialogRef.value?.showModal()
}

// 暴露方法给父组件
defineExpose({ open })
</script>
