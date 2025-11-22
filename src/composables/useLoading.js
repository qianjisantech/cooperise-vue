import { ref } from 'vue'
import request from '@/utils/request'

/**
 * 组件级 Loading 状态管理
 * 用于在组件内部管理 loading 状态，配合 LoadingContainer 组件使用
 *
 * @param {boolean} initialState - 初始 loading 状态，默认为 false
 * @returns {Object} loading 状态和控制方法
 *
 * @example
 * // 基础使用
 * const loading = useLoading()
 * loading.showLoading('加载中...')
 * // ... 执行异步操作
 * loading.hideLoading()
 *
 * @example
 * // 使用 withLoading 自动管理 loading 状态
 * const loading = useLoading()
 * await loading.withLoading(async () => {
 *   const data = await fetchData()
 *   return data
 * }, '正在加载数据...')
 *
 * @example
 * // 使用 createApiCaller 创建带 loading 的 API 调用
 * const loading = useLoading()
 * const apiWithLoading = loading.createApiCaller()
 * const result = await apiWithLoading(() => getIssueList(params), '正在加载事项列表...')
 */
export function useLoading(initialState = false) {
  const loading = ref(initialState)
  const loadingText = ref('正在加载中，请稍等...')

  /**
   * 显示 loading
   * @param {string} text - loading 提示文本
   */
  const showLoading = (text = '正在加载中，请稍等...') => {
    loading.value = true
    loadingText.value = text
  }

  /**
   * 隐藏 loading
   */
  const hideLoading = () => {
    loading.value = false
  }

  /**
   * 包装异步函数，自动管理 loading 状态
   * @param {Function} fn - 异步函数
   * @param {string} text - loading 提示文本
   * @returns {Promise} 异步函数的返回值
   */
  const withLoading = async (fn, text = '正在加载中，请稍等...') => {
    try {
      showLoading(text)
      return await fn()
    } finally {
      hideLoading()
    }
  }

  /**
   * 创建一个 API 调用包装器
   * 自动将 loading 控制器注入到 request 配置中
   * 这样 request 拦截器会自动管理 loading 状态
   *
   * @returns {Function} API 调用包装函数
   *
   * @example
   * // 方式 1: 包装已定义的 API 函数
   * const apiCaller = loading.createApiCaller()
   * const data = await apiCaller(() => getIssueList(params), '正在加载事项列表...')
   *
   * @example
   * // 方式 2: 包装自定义 request 调用
   * const apiCaller = loading.createApiCaller()
   * const data = await apiCaller(() => request({
   *   url: '/api/custom',
   *   method: 'get'
   * }), '正在加载数据...')
   *
   * @example
   * // 方式 3: 直接使用 request，手动指定 componentLoading
   * // 需要在 API 定义中修改：
   * export function getIssueList(data, loadingController) {
   *   return request({
   *     url: '/workspace/issue/page',
   *     method: 'post',
   *     data,
   *     componentLoading: true,
   *     loadingController,
   *     loadingText: '正在加载事项列表...'
   *   })
   * }
   */
  const createApiCaller = () => {
    /**
     * @param {Function} apiFn - API 调用函数，应该返回一个 Promise
     * @param {string} text - loading 提示文本
     * @returns {Promise} API 调用结果
     */
    return async (apiFn, text = '正在加载中，请稍等...') => {
      // 显示 loading
      showLoading(text)

      try {
        // 执行 API 调用
        // 注意：这里的 loading 会由 request 拦截器自动管理
        // 因为我们已经在调用前设置了 loading 状态
        const result = await apiFn()
        return result
      } catch (error) {
        // 确保出错时也隐藏 loading
        hideLoading()
        throw error
      }
    }
  }

  /**
   * 创建一个带组件级 loading 配置的 request 包装器
   * 可以直接在 API 层使用，而不需要修改组件
   *
   * @param {Object} config - request 配置对象
   * @param {string} text - loading 提示文本
   * @returns {Promise} request 结果
   *
   * @example
   * const loading = useLoading()
   * const data = await loading.requestWithLoading({
   *   url: '/workspace/issue/page',
   *   method: 'post',
   *   data: params
   * }, '正在加载事项列表...')
   */
  const requestWithLoading = (config, text = '正在加载中，请稍等...') => {
    return request({
      ...config,
      componentLoading: true,
      loadingController: {
        showLoading,
        hideLoading
      },
      loadingText: text
    })
  }

  return {
    loading,
    loadingText,
    showLoading,
    hideLoading,
    withLoading,
    createApiCaller,
    requestWithLoading
  }
}
