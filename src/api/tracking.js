import request from '@/utils/request'

/**
 * 分页查询埋点日志
 * @param {Object} query 查询条件
 */
export function pageTrackingLogs(query) {
  return request({
    url: '/tracking/page',
    method: 'post',
    data: query
  })
}

/**
 * 保存埋点日志
 * @param {Object} data 埋点数据
 */
export function saveTrackingLog(data) {
  return request({
    url: '/tracking/save',
    method: 'post',
    data
  })
}

/**
 * 查询埋点日志详情
 * @param {Number} id 日志ID
 */
export function getTrackingLogById(id) {
  return request({
    url: `/tracking/${id}`,
    method: 'get'
  })
}
