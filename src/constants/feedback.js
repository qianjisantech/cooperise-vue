/**
 * 问题反馈模块数据字典常量
 * 用于前端展示值和后端存储值之间的转换
 */

// ==================== 反馈类型 (Type) ====================

// 类型枚举：前端使用的字符串值
export const FEEDBACK_TYPE = {
  BUG: 'bug',
  FEATURE: 'feature',
  IMPROVEMENT: 'improvement',
  OTHER: 'other'
}

// 类型映射：前端 -> 后端（提交数据时使用）
export const TYPE_TO_INT = {
  bug: 1,
  feature: 2,
  improvement: 3,
  other: 4
}

// 类型映射：后端 -> 前端（接收数据时使用）
export const INT_TO_TYPE = {
  1: 'bug',
  2: 'feature',
  3: 'improvement',
  4: 'other'
}

// 类型显示文本
export const TYPE_LABELS = {
  bug: '问题反馈',
  feature: '功能建议',
  improvement: '改进建议',
  other: '其他'
}

// ==================== 反馈状态 (Status) ====================

// 状态枚举：前端使用的字符串值
export const FEEDBACK_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed'
}

// 状态映射：前端 -> 后端
export const STATUS_TO_INT = {
  open: 1,
  closed: 2
}

// 状态映射：后端 -> 前端
export const INT_TO_STATUS = {
  1: 'open',
  2: 'closed'
}

// 状态显示文本
export const STATUS_LABELS = {
  open: '未解决',
  closed: '已解决'
}

// ==================== 优先级 (Priority) ====================

// 优先级枚举：前端使用的字符串值
export const FEEDBACK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
}

// 优先级映射：前端 -> 后端
export const PRIORITY_TO_INT = {
  low: 1,
  medium: 2,
  high: 3
}

// 优先级映射：后端 -> 前端
export const INT_TO_PRIORITY = {
  1: 'low',
  2: 'medium',
  3: 'high'
}

// 优先级显示文本
export const PRIORITY_LABELS = {
  low: '低',
  medium: '中',
  high: '高'
}

// ==================== 数据转换工具函数 ====================

/**
 * 将前端数据转换为后端格式
 * @param {Object} frontendData - 前端数据对象
 * @returns {Object} 后端数据对象
 */
export function toBackendData(frontendData) {
  const result = { ...frontendData }

  // 转换 type
  if (result.type && TYPE_TO_INT[result.type] !== undefined) {
    result.type = TYPE_TO_INT[result.type]
  }

  // 转换 status
  if (result.status && STATUS_TO_INT[result.status] !== undefined) {
    result.status = STATUS_TO_INT[result.status]
  }

  // 转换 priority
  if (result.priority && PRIORITY_TO_INT[result.priority] !== undefined) {
    result.priority = PRIORITY_TO_INT[result.priority]
  }

  return result
}

/**
 * 将后端数据转换为前端格式
 * @param {Object} backendData - 后端数据对象
 * @returns {Object} 前端数据对象
 */
export function toFrontendData(backendData) {
  const result = { ...backendData }

  // 转换 type
  if (result.type !== undefined && INT_TO_TYPE[result.type]) {
    result.type = INT_TO_TYPE[result.type]
  }

  // 转换 status
  if (result.status !== undefined && INT_TO_STATUS[result.status]) {
    result.status = INT_TO_STATUS[result.status]
  }

  // 转换 priority
  if (result.priority !== undefined && INT_TO_PRIORITY[result.priority]) {
    result.priority = INT_TO_PRIORITY[result.priority]
  }

  return result
}

/**
 * 批量转换后端数据列表为前端格式
 * @param {Array} backendList - 后端数据列表
 * @returns {Array} 前端数据列表
 */
export function toFrontendDataList(backendList) {
  if (!Array.isArray(backendList)) return []
  return backendList.map(item => toFrontendData(item))
}

// ==================== 后端参考说明 ====================

/**
 * 数据库字段说明（供后端开发参考）
 *
 * CREATE TABLE `feedback` (
 *   `type` TINYINT(2) NOT NULL DEFAULT 1 COMMENT '反馈类型：1-问题反馈(bug), 2-功能建议(feature), 3-改进建议(improvement), 4-其他(other)',
 *   `status` TINYINT(2) NOT NULL DEFAULT 1 COMMENT '状态：1-未解决(open), 2-已解决(closed)',
 *   `priority` TINYINT(2) DEFAULT 2 COMMENT '优先级：1-低(low), 2-中(medium), 3-高(high)',
 *   ...
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='问题反馈表';
 *
 * 后端 API 返回示例：
 * {
 *   "id": 1,
 *   "title": "登录页面异常",
 *   "type": 1,        // 数字类型，前端会转换为 'bug'
 *   "status": 1,      // 数字类型，前端会转换为 'open'
 *   "priority": 3,    // 数字类型，前端会转换为 'high'
 *   ...
 * }
 *
 * 前端提交数据示例（已转换）：
 * {
 *   "title": "登录页面异常",
 *   "type": 1,        // 前端 'bug' 转换为 1
 *   "status": 1,      // 前端 'open' 转换为 1
 *   "priority": 3,    // 前端 'high' 转换为 3
 *   ...
 * }
 */
