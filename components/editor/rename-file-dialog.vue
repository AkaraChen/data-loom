<template>
  <dialog
    id="rename-file-dialog"
    class="modal modal-bottom sm:modal-middle"
    ref="dialogRef"
  >
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">重命名文件</h3>

      <fieldset class="fieldset mb-4">
        <legend class="fieldset-legend">文件名</legend>
        <input
          type="text"
          placeholder="请输入新文件名"
          class="input w-full"
          v-model="fileName"
          @keyup.enter="renameFile"
          ref="inputRef"
        />
        <p v-if="errorMessage" class="text-error text-xs mt-1">
          {{ errorMessage }}
        </p>
      </fieldset>

      <div class="modal-action">
        <form method="dialog">
          <button class="btn">取消</button>
        </form>
        <button
          class="btn btn-primary"
          @click="renameFile"
          :disabled="!!errorMessage"
        >
          确认
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>关闭</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const emit = defineEmits(['rename'])
const fileName = ref('')
const originalFileName = ref('')
const originalExtension = ref('')
const dialogRef = ref<HTMLDialogElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

// 错误信息
const errorMessage = computed(() => {
  const trimmedName = fileName.value.trim()

  if (!trimmedName) {
    return '文件名不能为空'
  }

  // 检查文件名是否包含非法字符
  if (/[\\/:*?"<>|]/.test(trimmedName)) {
    return '文件名不能包含以下字符: \\ / : * ? " < > |'
  }

  // 检查文件扩展名是否匹配
  const extension = getExtension(trimmedName)
  if (extension && extension !== originalExtension.value) {
    return `请保持原文件扩展名 (${originalExtension.value})`
  }

  return ''
})

// 获取文件扩展名
const getExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1) return ''
  return filename.substring(lastDotIndex).toLowerCase()
}

// 重命名文件方法
const renameFile = () => {
  const trimmedName = fileName.value.trim()

  if (trimmedName && !errorMessage.value) {
    // 如果用户没有添加扩展名，则添加原始扩展名
    let finalFileName = trimmedName
    if (!getExtension(finalFileName) && originalExtension.value) {
      finalFileName += originalExtension.value
    }

    emit('rename', finalFileName)
    fileName.value = ''
    // 关闭对话框
    dialogRef.value?.close()
  }
}

// 打开对话框的方法 - 可以从父组件调用
const open = async (currentFileName: string) => {
  originalFileName.value = currentFileName

  // 提取原始扩展名
  originalExtension.value = getExtension(currentFileName)

  // 设置初始文件名（如果有扩展名，则去掉扩展名）
  if (originalExtension.value) {
    const nameWithoutExt = currentFileName.slice(
      0,
      currentFileName.length - originalExtension.value.length,
    )
    fileName.value = nameWithoutExt
  } else {
    fileName.value = currentFileName
  }

  dialogRef.value?.showModal()

  // 等待对话框打开后聚焦输入框并选中所有文本
  await nextTick()
  if (inputRef.value) {
    inputRef.value.focus()
    inputRef.value.select()
  }
}

// 暴露方法给父组件
defineExpose({ open })
</script>
