/**
 * 日期时间格式化工具
 */

/**
 * 格式化日期时间
 * @param {Date|string|number} time - 日期时间
 * @param {string} format - 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的时间字符串
 */
export function formatDateTime(time, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!time) return '-'

  // 统一转换为Date对象
  let date
  if (typeof time === 'string') {
    // 处理ISO格式: 2025-11-08T01:17:00
    date = new Date(time)
  } else if (typeof time === 'number') {
    date = new Date(time)
  } else if (time instanceof Date) {
    date = time
  } else {
    return '-'
  }

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return time.toString()
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // 根据格式模板替换
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化为相对时间（如：刚刚、3分钟前、2小时前）
 * @param {Date|string|number} time - 日期时间
 * @returns {string} 相对时间字符串
 */
export function formatRelativeTime(time) {
  if (!time) return '-'

  const date = typeof time === 'string' ? new Date(time) : time
  if (isNaN(date.getTime())) return '-'

  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    // 超过7天显示完整日期
    return formatDateTime(time, 'YYYY-MM-DD HH:mm')
  }
}

/**
 * 格式化日期（仅日期部分）
 * @param {Date|string|number} time - 日期时间
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(time) {
  return formatDateTime(time, 'YYYY-MM-DD')
}

/**
 * 格式化时间（仅时间部分）
 * @param {Date|string|number} time - 日期时间
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(time) {
  return formatDateTime(time, 'HH:mm:ss')
}
