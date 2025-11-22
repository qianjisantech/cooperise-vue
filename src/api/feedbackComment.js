import request from '@/utils/request'

/**
 * 获取反馈评论列表(不分页)
 * @param {number} feedbackId - 反馈ID
 */
export function getFeedbackCommentList(feedbackId) {
  return request({
    url: '/feedback-comment/list',
    method: 'get',
    params: { feedbackId },
    showLoading: true,
    loadingText: '正在加载评论列表...'
  })
}

/**
 * 分页查询反馈评论
 * @param {Object} params - 查询参数
 * @param {number} params.feedbackId - 反馈ID
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页大小
 */
export function getFeedbackCommentPage(params) {
  return request({
    url: '/feedback-comment/page',
    method: 'post',
    data: params,
    showLoading: true,
    loadingText: '正在加载评论列表...'
  })
}

/**
 * 根据ID获取评论详情
 * @param {number} id - 评论ID
 */
export function getFeedbackCommentById(id) {
  return request({
    url: `/feedback-comment/${id}`,
    method: 'get'
  })
}

/**
 * 创建评论
 * @param {Object} data - 评论数据
 * @param {number} data.feedbackId - 反馈ID
 * @param {string} data.content - 评论内容
 */
export function createFeedbackComment(data) {
  return request({
    url: '/feedback-comment',
    method: 'post',
    data
  })
}

/**
 * 更新评论
 * @param {number} id - 评论ID
 * @param {Object} data - 评论数据
 */
export function updateFeedbackComment(id, data) {
  return request({
    url: `/feedback-comment/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除评论
 * @param {number} id - 评论ID
 */
export function deleteFeedbackComment(id) {
  return request({
    url: `/feedback-comment/${id}`,
    method: 'delete'
  })
}
