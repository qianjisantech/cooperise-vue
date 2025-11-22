import request from '@/utils/request'

/**
 * 获取空间列表（分页）
 * @param {object} data - 查询参数
 * @returns {Promise}
 */
export function getSpaceListPage(data) {
  return request({
    url: '/space/page',
    method: 'post',
    data,
    showLoading: true,
    loadingText: '正在加载空间列表...'
  })
}

/**
 * 获取空间列表（全部）
 * @returns {Promise}
 */
export function getSpaceList() {
  return request({
    url: '/space/list',
    method: 'get',
    showLoading: false  // 全部列表用于下拉选择，不需要loading
  })
}

/**
 * 创建空间
 * @param {object} data - 空间数据
 * @returns {Promise}
 */
export function createSpace(data) {
  return request({
    url: '/space',
    method: 'post',
    data
  })
}

/**
 * 更新空间
 * @param {number} id - 空间ID
 * @param {object} data - 空间数据
 * @returns {Promise}
 */
export function updateSpace(id, data) {
  return request({
    url: `/space/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除空间
 * @param {number} id - 空间ID
 * @returns {Promise}
 */
export function deleteSpace(id) {
  return request({
    url: `/space/${id}`,
    method: 'delete'
  })
}

/**
 * 获取空间详情
 * @param {number} id - 空间ID
 * @returns {Promise}
 */
export function getSpaceDetail(id) {
  return request({
    url: `/space/${id}`,
    method: 'get'
  })
}

/**
 * 根据用户ID获取空间列表
 * @param {number} ownerId - 用户ID
 * @returns {Promise}
 */
export function getSpaceListByOwner(ownerId) {
  return request({
    url: `/space/owner/${ownerId}`,
    method: 'get'
  })
}

/**
 * 获取空间成员列表（分页）
 * @param {object} params - 查询参数
 * @returns {Promise}
 */
export function getSpaceMemberPage(params) {
  return request({
    url: '/space/member/page',
    method: 'post',
    data: params
  })
}

/**
 * 添加空间成员
 * @param {object} data - 成员数据
 * @returns {Promise}
 */
export function addSpaceMember(data) {
  return request({
    url: '/space/member',
    method: 'post',
    data
  })
}

/**
 * 更新空间成员
 * @param {number} id - 成员ID
 * @param {object} data - 成员数据
 * @returns {Promise}
 */
export function updateSpaceMember(id, data) {
  return request({
    url: `/space/member/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除空间成员
 * @param {number} id - 成员ID
 * @returns {Promise}
 */
export function deleteSpaceMember(id) {
  return request({
    url: `/space/member/${id}`,
    method: 'delete'
  })
}

/**
 * 获取可添加到空间的用户列表
 * @param {number} spaceId - 空间ID
 * @returns {Promise}
 */
export function getAvailableUsers(spaceId) {
  return request({
    url: `/space/member/available-users/${spaceId}`,
    method: 'get'
  })
}
