/**
 * Toast 消息类型
 */
export interface Toast {
  /**
   * 消息内容
   */
  message: string
  /**
   * 消息类型
   */
  type?: 'info' | 'success' | 'warning' | 'error'
  /**
   * 显示持续时间（毫秒）
   */
  duration?: number
  /**
   * 唯一标识符（内部使用）
   */
  id?: number
}
