import request from '@/utils/request'

/**
 * 获取反馈列表（不分页）
 */
export function getFeedbackList() {
  return request({
    url: '/feedback/list',
    method: 'get',
    showLoading: true,
    loadingText: '正在加载反馈列表...'
  })
}

/**
 * 分页查询反馈
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页大小
 * @param {string} params.type - 反馈类型
 * @param {string} params.status - 处理状态
 * @param {string} params.keyword - 关键词搜索
 */
export function getFeedbackPage(params) {
  return request({
    url: '/feedback/page',
    method: 'post',
    data: params,
    showLoading: true,
    loadingText: '正在加载反馈列表...'
  })
}

/**
 * 根据ID获取反馈详情
 * @param {number} id - 反馈ID
 */
export function getFeedbackById(id) {
  return request({
    url: `/feedback/${id}`,
    method: 'get'
  })
}

/**
 * 创建反馈
 * @param {Object} data - 反馈数据
 * @param {string} data.type - 反馈类型
 * @param {string} data.title - 反馈标题
 * @param {string} data.content - 反馈内容
 * @param {string} data.contactInfo - 联系方式
 */
export function createFeedback(data) {
  return request({
    url: '/feedback',
    method: 'post',
    data
  })
}

/**
 * 更新反馈
 * @param {number} id - 反馈ID
 * @param {Object} data - 反馈数据
 */
export function updateFeedback(id, data) {
  return request({
    url: `/feedback/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除反馈
 * @param {number} id - 反馈ID
 */
export function deleteFeedback(id) {
  return request({
    url: `/feedback/${id}`,
    method: 'delete'
  })
}

/**
 * 点赞反馈
 * @param {number} id - 反馈ID
 */
export function likeFeedback(id) {
  return request({
    url: `/feedback/${id}/like`,
    method: 'post'
  })
}

/**
 * 取消点赞反馈
 * @param {number} id - 反馈ID
 */
export function unlikeFeedback(id) {
  return request({
    url: `/feedback/${id}/unlike`,
    method: 'post'
  })
}

/**
 * 获取反馈的评论列表
 * @param {number} id - 反馈ID
 */
export function getFeedbackComments(id) {
  return request({
    url: `/feedback/${id}/comments`,
    method: 'get'
  })
}

/**
 * 添加反馈评论
 * @param {number} id - 反馈ID
 * @param {Object} data - 评论数据
 * @param {string} data.content - 评论内容
 */
export function addFeedbackComment(id, data) {
  return request({
    url: `/feedback/${id}/comments`,
    method: 'post',
    data
  })
}

/**
 * 删除反馈评论
 * @param {number} feedbackId - 反馈ID
 * @param {number} commentId - 评论ID
 */
export function deleteFeedbackComment(feedbackId, commentId) {
  return request({
    url: `/feedback/${feedbackId}/comments/${commentId}`,
    method: 'delete'
  })
}
