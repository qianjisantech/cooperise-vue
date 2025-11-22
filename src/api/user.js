import request from '@/utils/request'

/**
 * 获取用户列表
 * @returns {Promise}
 */
export function getUserList() {
  return request({
    url: '/user/list',
    method: 'get'
  })
}

/**
 * 获取用户详情
 * @param {number} id - 用户ID
 * @returns {Promise}
 */
export function getUserDetail(id) {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}
