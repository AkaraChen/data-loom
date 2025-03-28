<template>
  <dialog
    id="new-file-dialog"
    class="modal modal-bottom sm:modal-middle"
    ref="dialogRef"
  >
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">新建文件</h3>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">文件名</legend>
        <input
          type="text"
          placeholder="请输入文件名 (将自动添加 .txt 后缀)"
          class="input w-full"
          v-model="fileName"
          @keyup.enter="createFile"
          ref="inputRef"
        />
        <p class="fieldset-label">
          You can edit page title later on from settings
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

const emit = defineEmits(['create'])
const fileName = ref('')
const dialogRef = ref<HTMLDialogElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

// 创建文件方法
const createFile = () => {
  if (fileName.value.trim()) {
    emit('create', fileName.value.trim())
    fileName.value = ''
    // 关闭对话框
    dialogRef.value?.close()
  }
}

// 打开对话框的方法 - 可以从父组件调用
const open = async () => {
  dialogRef.value?.showModal()
  // 使用 nextTick 确保 DOM 已更新后再聚焦
  await nextTick()
  inputRef.value?.focus()
}

// 暴露方法给父组件
defineExpose({ open })
</script>
