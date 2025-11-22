/**
 * 简单的事件总线，用于组件间通信
 */
import { ref } from 'vue'

const events = new Map()

export const eventBus = {
  /**
   * 订阅事件
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(event, callback) {
    if (!events.has(event)) {
      events.set(event, [])
    }
    events.get(event).push(callback)
  },

  /**
   * 取消订阅事件
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  off(event, callback) {
    if (!events.has(event)) return
    const callbacks = events.get(event)
    const index = callbacks.indexOf(callback)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  },

  /**
   * 触发事件
   * @param {string} event - 事件名称
   * @param {*} data - 传递的数据
   */
  emit(event, data) {
    if (!events.has(event)) return
    events.get(event).forEach(callback => callback(data))
  },

  /**
   * 清除所有事件监听
   */
  clear() {
    events.clear()
  }
}

// 定义事件常量
export const EVENTS = {
  CHANGELOG_UPDATED: 'changelog:updated', // 发布日志更新事件
  CHANGELOG_CREATED: 'changelog:created', // 发布日志创建事件
  CHANGELOG_DELETED: 'changelog:deleted'  // 发布日志删除事件
}
