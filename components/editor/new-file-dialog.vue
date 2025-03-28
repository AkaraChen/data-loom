<template>
  <dialog
    id="new-file-dialog"
    class="modal modal-bottom sm:modal-middle"
    ref="dialogRef"
  >
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">新建文件</h3>

      <fieldset class="fieldset mb-4">
        <legend class="fieldset-legend">文件名</legend>
        <input
          type="text"
          placeholder="请输入文件名"
          class="input w-full"
          v-model="fileName"
          @keyup.enter="createFile"
          ref="inputRef"
        />
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">文件类型</legend>
        <select class="select w-full" v-model="selectedFileType">
          <option v-for="option in fileTypeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <p class="text-xs text-base-content/70 mt-1">
          选择文件类型将决定生成内容的格式
        </p>
      </fieldset>

      <div class="modal-action">
        <form method="dialog">
          <button class="btn">取消</button>
        </form>
        <button class="btn btn-primary" @click="createFile">创建</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>关闭</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { OutputMode } from '~/stores/workspace'

const emit = defineEmits(['create'])
const fileName = ref('')
const selectedFileType = ref<OutputMode>('markdown')
const dialogRef = ref<HTMLDialogElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

// 文件类型选项
const fileTypeOptions = [
  { value: 'plaintext', label: '纯文本 (.txt)', extension: '.txt' },
  { value: 'markdown', label: 'Markdown (.md)', extension: '.md' },
  { value: 'csv', label: 'CSV (.csv)', extension: '.csv' },
  { value: 'json', label: 'JSON (.json)', extension: '.json' },
]

// 获取当前选择的文件类型扩展名
const getSelectedExtension = (): string => {
  const option = fileTypeOptions.find(opt => opt.value === selectedFileType.value)
  return option ? option.extension : '.md'
}

// 创建文件方法
const createFile = () => {
  if (fileName.value.trim()) {
    // 获取文件名，如果用户已经添加了扩展名，则使用用户输入的文件名
    // 否则添加所选文件类型的扩展名
    let finalFileName = fileName.value.trim()
    const hasExtension = /\.\w+$/.test(finalFileName)
    
    if (!hasExtension) {
      finalFileName += getSelectedExtension()
    }
    
    emit('create', finalFileName, selectedFileType.value)
    fileName.value = ''
    // 关闭对话框
    dialogRef.value?.close()
  }
}

// 打开对话框的方法 - 可以从父组件调用
const open = async (defaultFileType: OutputMode = 'markdown') => {
  // 设置默认文件类型
  selectedFileType.value = defaultFileType
  dialogRef.value?.showModal()
  // 使用 nextTick 确保 DOM 已更新后再聚焦
  await nextTick()
  inputRef.value?.focus()
}

// 暴露方法给父组件
defineExpose({ open })
</script>
