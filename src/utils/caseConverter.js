/**
 * 命名格式转换工具
 * 用于在前端（小驼峰）和后端（下划线）之间转换
 */

/**
 * 将字符串从小驼峰转换为下划线
 * @param {string} str - 小驼峰字符串
 * @returns {string} 下划线字符串
 * @example
 * camelToSnake('userName') // 'user_name'
 * camelToSnake('createTime') // 'create_time'
 */
export function camelToSnake(str) {
  if (typeof str !== 'string') return str
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

/**
 * 将字符串从下划线转换为小驼峰
 * @param {string} str - 下划线字符串
 * @returns {string} 小驼峰字符串
 * @example
 * snakeToCamel('user_name') // 'userName'
 * snakeToCamel('create_time') // 'createTime'
 */
export function snakeToCamel(str) {
  if (typeof str !== 'string') return str
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 递归地将对象的所有key从小驼峰转换为下划线
 * @param {*} obj - 需要转换的对象/数组/基本类型
 * @returns {*} 转换后的对象/数组/基本类型
 * @example
 * objectKeysToSnake({ userName: 'admin', createTime: '2024-01-01' })
 * // { user_name: 'admin', create_time: '2024-01-01' }
 */
export function objectKeysToSnake(obj) {
  if (obj === null || obj === undefined) {
    return obj
  }

  // 如果是数组，递归处理每个元素
  if (Array.isArray(obj)) {
    return obj.map(item => objectKeysToSnake(item))
  }

  // 如果是对象（但不是Date等特殊对象）
  if (typeof obj === 'object' && obj.constructor === Object) {
    const result = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeKey = camelToSnake(key)
        result[snakeKey] = objectKeysToSnake(obj[key])
      }
    }
    return result
  }

  // 基本类型直接返回
  return obj
}

/**
 * 递归地将对象的所有key从下划线转换为小驼峰
 * @param {*} obj - 需要转换的对象/数组/基本类型
 * @returns {*} 转换后的对象/数组/基本类型
 * @example
 * objectKeysToCamel({ user_name: 'admin', create_time: '2024-01-01' })
 * // { userName: 'admin', createTime: '2024-01-01' }
 */
export function objectKeysToCamel(obj) {
  if (obj === null || obj === undefined) {
    return obj
  }

  // 如果是数组，递归处理每个元素
  if (Array.isArray(obj)) {
    return obj.map(item => objectKeysToCamel(item))
  }

  // 如果是对象（但不是Date等特殊对象）
  if (typeof obj === 'object' && obj.constructor === Object) {
    const result = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = snakeToCamel(key)
        result[camelKey] = objectKeysToCamel(obj[key])
      }
    }
    return result
  }

  // 基本类型直接返回
  return obj
}
