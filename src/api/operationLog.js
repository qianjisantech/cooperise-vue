import request from '@/utils/request'

/**
 * 分页查询操作日志
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getOperationLogPage(params) {
  return request({
    url: '/operation-log/page',
    method: 'post',
    data: params,
    showLoading: true,
    loadingText: '正在加载操作日志...'
  })
}

/**
 * 根据ID查询操作日志详情
 * @param {Number} id - 日志ID
 * @returns {Promise}
 */
export function getOperationLogById(id) {
  return request({
    url: `/operation-log/${id}`,
    method: 'get'
  })
}
