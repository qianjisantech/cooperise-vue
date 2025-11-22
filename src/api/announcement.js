import request from '@/utils/request'

// ==================== 系统更新 API ====================

/**
 * 获取系统更新列表（分页）
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页
 * @param {number} params.pageSize - 每页条数
 * @param {number} params.status - 状态（可选）
 * @returns {Promise}
 */
export function getSystemUpdatePage(params) {
  return request({
    url: '/feedback/system-update/page',
    method: 'get',
    params
  })
}

/**
 * 获取系统更新详情
 * @param {number} id - 系统更新ID
 * @returns {Promise}
 */
export function getSystemUpdateDetail(id) {
  return request({
    url: `/feedback/system-update/${id}`,
    method: 'get'
  })
}

/**
 * 创建系统更新
 * @param {Object} data - 系统更新数据
 * @returns {Promise}
 */
export function createSystemUpdate(data) {
  return request({
    url: '/feedback/system-update',
    method: 'post',
    data
  })
}

/**
 * 更新系统更新
 * @param {number} id - 系统更新ID
 * @param {Object} data - 系统更新数据
 * @returns {Promise}
 */
export function updateSystemUpdate(id, data) {
  return request({
    url: `/feedback/system-update/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除系统更新
 * @param {number} id - 系统更新ID
 * @returns {Promise}
 */
export function deleteSystemUpdate(id) {
  return request({
    url: `/feedback/system-update/${id}`,
    method: 'delete'
  })
}

/**
 * 发布系统更新
 * @param {number} id - 系统更新ID
 * @returns {Promise}
 */
export function publishSystemUpdate(id) {
  return request({
    url: `/feedback/system-update/${id}/publish`,
    method: 'post'
  })
}

/**
 * 获取已发布的系统更新
 * @returns {Promise}
 */
export function getPublishedSystemUpdate() {
  return request({
    url: '/feedback/system-update/published',
    method: 'get'
  })
}

// ==================== 顶部通知 API ====================

/**
 * 获取顶部通知列表（分页）
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页
 * @param {number} params.pageSize - 每页条数
 * @param {number} params.status - 状态（可选）
 * @param {number} params.type - 类型（可选）
 * @returns {Promise}
 */
export function getTopNotificationPage(params) {
  return request({
    url: '/feedback/top-notification/page',
    method: 'get',
    params
  })
}

/**
 * 获取顶部通知详情
 * @param {number} id - 顶部通知ID
 * @returns {Promise}
 */
export function getTopNotificationDetail(id) {
  return request({
    url: `/feedback/top-notification/${id}`,
    method: 'get'
  })
}

/**
 * 创建顶部通知
 * @param {Object} data - 顶部通知数据
 * @returns {Promise}
 */
export function createTopNotification(data) {
  return request({
    url: '/feedback/top-notification',
    method: 'post',
    data
  })
}

/**
 * 更新顶部通知
 * @param {number} id - 顶部通知ID
 * @param {Object} data - 顶部通知数据
 * @returns {Promise}
 */
export function updateTopNotification(id, data) {
  return request({
    url: `/feedback/top-notification/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除顶部通知
 * @param {number} id - 顶部通知ID
 * @returns {Promise}
 */
export function deleteTopNotification(id) {
  return request({
    url: `/feedback/top-notification/${id}`,
    method: 'delete'
  })
}

/**
 * 发布顶部通知
 * @param {number} id - 顶部通知ID
 * @returns {Promise}
 */
export function publishTopNotification(id) {
  return request({
    url: `/feedback/top-notification/${id}/publish`,
    method: 'post'
  })
}

/**
 * 获取已发布的顶部通知
 * @returns {Promise}
 */
export function getPublishedTopNotification() {
  return request({
    url: '/feedback/top-notification/published',
    method: 'get'
  })
}

// ==================== 旧版公告 API（保留兼容） ====================

/**
 * 获取公告列表（分页）
 * @param {Object} data - 分页参数
 * @param {number} data.pageNum - 页码
 * @param {number} data.pageSize - 每页条数
 * @param {string} data.type - 公告类型（可选）
 * @param {string} data.status - 公告状态（可选）
 * @returns {Promise}
 */
export function getAnnouncementPage(data) {
  return request({
    url: '/announcement/page',
    method: 'post',
    data,
    showLoading: true,
    loadingText: '正在加载公告列表...'
  })
}

/**
 * 获取公告详情
 * @param {number} id - 公告ID
 * @returns {Promise}
 */
export function getAnnouncementDetail(id) {
  return request({
    url: `/announcement/${id}`,
    method: 'get'
  })
}

/**
 * 创建公告
 * @param {Object} data - 公告数据
 * @returns {Promise}
 */
export function createAnnouncement(data) {
  return request({
    url: '/announcement',
    method: 'post',
    data
  })
}

/**
 * 更新公告
 * @param {number} id - 公告ID
 * @param {Object} data - 公告数据
 * @returns {Promise}
 */
export function updateAnnouncement(id, data) {
  return request({
    url: `/announcement/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除公告
 * @param {number} id - 公告ID
 * @returns {Promise}
 */
export function deleteAnnouncement(id) {
  return request({
    url: `/announcement/${id}`,
    method: 'delete'
  })
}

/**
 * 置顶公告
 * @param {number} id - 公告ID
 * @param {boolean} isTop - 是否置顶
 * @returns {Promise}
 */
export function toggleAnnouncementTop(id, isTop) {
  return request({
    url: `/announcement/${id}/top`,
    method: 'put',
    data: { isTop }
  })
}
