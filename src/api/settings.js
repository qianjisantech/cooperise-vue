import request from '@/utils/request'

/**
 * 获取用户设置
 * @returns {Promise}
 */
export function getUserSettings() {
  return request({
    url: '/settings/user',
    method: 'get'
  })
}

/**
 * 更新账号设置
 * @param {Object} data - 账号数据
 * @returns {Promise}
 */
export function updateAccountSettings(data) {
  return request({
    url: '/settings/account',
    method: 'put',
    data
  })
}

/**
 * 更新通知设置
 * @param {Object} data - 通知设置数据
 * @returns {Promise}
 */
export function updateNotificationSettings(data) {
  return request({
    url: '/settings/notification',
    method: 'put',
    data
  })
}

/**
 * 更新系统设置
 * @param {Object} data - 系统设置数据
 * @returns {Promise}
 */
export function updateSystemSettings(data) {
  return request({
    url: '/settings/system',
    method: 'put',
    data
  })
}

/**
 * 修改密码
 * @param {Object} data - 密码数据
 * @returns {Promise}
 */
export function updatePassword(data) {
  return request({
    url: '/settings/security/password',
    method: 'put',
    data
  })
}

/**
 * 启用/禁用双重认证
 * @param {Object} data - 双重认证数据
 * @returns {Promise}
 */
export function updateTwoFactor(data) {
  return request({
    url: '/settings/security/two-factor',
    method: 'put',
    data
  })
}

/**
 * 获取登录日志
 * @param {Object} params - 分页参数
 * @returns {Promise}
 */
export function getLoginLogs(params) {
  return request({
    url: '/settings/security/login-logs',
    method: 'get',
    params
  })
}

/**
 * 上传头像
 * @param {FormData} formData - 头像文件
 * @returns {Promise}
 */
export function uploadAvatar(formData) {
  return request({
    url: '/settings/account/avatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
