import request from '@/utils/request'

/**
 * 获取顶部滚动通知
 * @returns {Promise}
 */
export function getBannerNotifications() {
  return request({
    url: '/notification/banner',
    method: 'get'
  })
}

/**
 * 检查系统更新
 * @returns {Promise}
 */
export function checkSystemUpdate() {
  return request({
    url: '/system/check-update',
    method: 'get'
  })
}

/**
 * 获取未读通知数量
 * @returns {Promise}
 */
export function getUnreadCount() {
  return request({
    url: '/notification/unread-count',
    method: 'get'
  })
}

/**
 * 获取通知列表（分页）
 * @param {Object} data - 分页参数
 * @returns {Promise}
 */
export function getNotificationList(data) {
  return request({
    url: '/notification/page',
    method: 'post',
    data,
    showLoading: true,
    loadingText: '正在加载通知列表...'
  })
}

/**
 * 标记通知为已读
 * @param {Object} data - 通知ID列表
 * @returns {Promise}
 */
export function markAsRead(data) {
  return request({
    url: '/notification/read',
    method: 'put',
    data
  })
}

/**
 * 全部标记为已读
 * @returns {Promise}
 */
export function markAllAsRead() {
  return request({
    url: '/notification/read-all',
    method: 'put'
  })
}
