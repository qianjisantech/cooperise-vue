import request from '@/utils/request'

/**
 * 获取发布日志列表（不分页）
 */
export function getChangelogList() {
  return request({
    url: '/changelog/list',
    method: 'get',
    showLoading: true,
    loadingText: '正在加载发布日志...'
  })
}

/**
 * 分页查询发布日志
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页大小
 * @param {string} params.version - 版本号
 * @param {string} params.keyword - 关键词搜索
 */
export function getChangelogPage(params) {
  return request({
    url: '/changelog/page',
    method: 'post',
    data: params,
    showLoading: true,
    loadingText: '正在加载发布日志...'
  })
}

/**
 * 根据ID获取发布日志详情
 * @param {number} id - 发布日志ID
 */
export function getChangelogById(id) {
  return request({
    url: `/changelog/${id}`,
    method: 'get'
  })
}

/**
 * 创建发布日志
 * @param {Object} data - 发布日志数据
 * @param {string} data.version - 版本号
 * @param {string} data.title - 标题
 * @param {string} data.description - 描述
 * @param {string} data.releaseDate - 发布日期
 * @param {Array} data.features - 新功能列表
 * @param {Array} data.improvements - 改进列表
 * @param {Array} data.bugfixes - 修复列表
 */
export function createChangelog(data) {
  return request({
    url: '/changelog',
    method: 'post',
    data
  })
}

/**
 * 更新发布日志
 * @param {number} id - 发布日志ID
 * @param {Object} data - 发布日志数据
 */
export function updateChangelog(id, data) {
  return request({
    url: `/changelog/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除发布日志
 * @param {number} id - 发布日志ID
 */
export function deleteChangelog(id) {
  return request({
    url: `/changelog/${id}`,
    method: 'delete'
  })
}
