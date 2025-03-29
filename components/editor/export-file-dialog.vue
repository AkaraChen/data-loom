<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">导出文件</h3>
      <form method="dialog">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">导出格式</span>
          </label>
          <select
            v-model="selectedFormat"
            class="select select-bordered w-full"
          >
            <option disabled value="">请选择导出格式</option>
            <option
              v-for="format in availableFormats"
              :key="format.value"
              :value="format.value"
            >
              {{ format.label }}
            </option>
          </select>
        </div>

        <div class="modal-action">
          <button class="btn btn-ghost">取消</button>
          <button
            class="btn btn-primary"
            :disabled="!selectedFormat"
            @click.prevent="handleExport"
          >
            导出
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>关闭</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  markdownToPlaintext,
  markdownToDocx,
  csvToXlsx,
  jsonToYaml,
  downloadFile,
} from '~/utils/export'

interface ExportFormat {
  value: string
  label: string
  handler: (file: File) => Promise<File>
}

// 对话框引用
const dialogRef = ref<HTMLDialogElement | null>(null)

// 导出格式
const selectedFormat = ref('')

// 定义属性
const props = defineProps<{
  file: File | null
}>()

// 定义事件
const emit = defineEmits(['exported'])

// 可用的导出格式
const availableFormats = computed(() => {
  if (!props.file) return []

  const formats: ExportFormat[] = [
    {
      value: 'original',
      label: `原始格式 (${props.file.name})`,
      handler: async file => file,
    },
  ]

  const fileName = props.file.name.toLowerCase()

  // 根据文件类型添加可用的转换格式
  if (fileName.endsWith('.md') || fileName.endsWith('.markdown')) {
    formats.push(
      {
        value: 'plaintext',
        label: '纯文本 (.txt)',
        handler: markdownToPlaintext,
      },
      {
        value: 'docx',
        label: 'Word文档 (.docx)',
        handler: markdownToDocx,
      },
    )
  } else if (fileName.endsWith('.csv')) {
    formats.push({
      value: 'xlsx',
      label: 'Excel表格 (.xlsx)',
      handler: csvToXlsx,
    })
  } else if (fileName.endsWith('.json')) {
    formats.push({
      value: 'yaml',
      label: 'YAML文件 (.yml)',
      handler: jsonToYaml,
    })
  }

  return formats
})

// 打开对话框
const open = () => {
  selectedFormat.value = availableFormats.value.length > 0 ? 'original' : ''
  dialogRef.value?.showModal()
}

const toast = useToast()

// 处理导出
const handleExport = async () => {
  if (!props.file || !selectedFormat.value) return

  try {
    const format = availableFormats.value.find(
      f => f.value === selectedFormat.value,
    )
    if (!format) return

    const exportedFile = await format.handler(props.file)
    downloadFile(exportedFile)
    emit('exported', exportedFile)
  } catch (error) {
    console.error('导出失败:', error)
    toast.error('导出失败，请重试')
  } finally {
    dialogRef.value?.close()
  }
}

// 暴露方法
defineExpose({
  open,
})
</script>
