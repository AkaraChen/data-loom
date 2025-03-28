/**
 * 文件操作相关的工具函数
 */

/**
 * 文档文件接口
 */
export interface DocumentFile {
  id: string
  name: string
  content: string
}

/**
 * 获取文件扩展名
 * @param fileName 文件名
 * @returns 文件扩展名，如果没有扩展名则返回 'txt'
 */
export function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex === -1) return 'txt'
  return fileName.substring(lastDotIndex + 1).toLowerCase()
}

/**
 * 生成新文件的初始内容
 * @param fileExt 文件扩展名
 * @returns 文件的初始内容
 */
export function getInitialContent(fileExt: string): string {
  switch (fileExt) {
    case 'json':
      return '{}'
    default:
      return ''
  }
}

/**
 * 创建新文件对象
 * @param fileName 文件名
 * @returns 新文件对象
 */
export function createFileObject(fileName: string): DocumentFile {
  const newId = `file-${Date.now()}`
  const fileExt = getFileExtension(fileName)
  const initialContent = getInitialContent(fileExt)

  return {
    id: newId,
    name: fileName,
    content: initialContent,
  }
}

/**
 * 创建文件副本名称
 * @param fileName 原文件名
 * @returns 副本文件名
 */
export function createDuplicateFileName(fileName: string): string {
  let baseName = fileName
  const lastDotIndex = baseName.lastIndexOf('.')
  let extension = ''

  if (lastDotIndex !== -1) {
    extension = baseName.substring(lastDotIndex)
    baseName = baseName.substring(0, lastDotIndex)
  }

  return `${baseName} 副本${extension}`
}

/**
 * 查找文件索引
 * @param files 文件列表
 * @param fileId 文件ID
 * @returns 文件索引，如果未找到则返回 -1
 */
export function findFileIndex(files: DocumentFile[], fileId: string): number {
  return files.findIndex(f => f.id === fileId)
}

/**
 * 查找文件
 * @param files 文件列表
 * @param fileId 文件ID
 * @returns 文件对象，如果未找到则返回 null
 */
export function findFile(
  files: DocumentFile[],
  fileId: string,
): DocumentFile | null {
  return files.find(f => f.id === fileId) || null
}
