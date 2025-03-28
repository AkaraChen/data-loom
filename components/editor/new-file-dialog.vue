<template>
  <dialog id="new-file-dialog" class="modal modal-bottom sm:modal-middle">
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
        />
        <p class="fieldset-label">You can edit page title later on from settings</p>
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
import { ref } from 'vue'

const emit = defineEmits(['create'])
const fileName = ref('')

// 创建文件方法
const createFile = () => {
  if (fileName.value.trim()) {
    emit('create', fileName.value.trim())
    fileName.value = ''
    // 关闭对话框
    const dialog = document.getElementById('new-file-dialog') as HTMLDialogElement
    dialog?.close()
  }
}

// 打开对话框的方法 - 可以从父组件调用
const open = () => {
  const dialog = document.getElementById('new-file-dialog') as HTMLDialogElement
  dialog?.showModal()
  // 聚焦到输入框
  setTimeout(() => {
    const input = dialog?.querySelector('input')
    input?.focus()
  }, 100)
}

// 暴露方法给父组件
defineExpose({ open })
</script>
