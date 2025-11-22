/**
 * 应用初始化脚本
 * 处理数据迁移、初始化等任务
 */

import dbManager, { migrateFromLocalStorage } from './indexedDB'

/**
 * 初始化 IndexedDB 并迁移旧数据
 */
export async function initIndexedDB() {
  try {
    console.log('[InitApp] 开始初始化 IndexedDB...')

    // 初始化数据库
    await dbManager.init()
    console.log('[InitApp] IndexedDB 初始化成功')

    // 检查是否已经迁移过
    const migrationFlag = await dbManager.getItem('__migration_completed__')

    if (!migrationFlag) {
      console.log('[InitApp] 开始迁移 localStorage 数据...')

      // 迁移列配置数据
      const migratedKeys = await migrateFromLocalStorage('table_view_columns_')

      // 迁移 Issue 页面的列配置
      const issueColumnConfig = localStorage.getItem('issue_list_columns')
      if (issueColumnConfig) {
        try {
          const parsedValue = JSON.parse(issueColumnConfig)
          await dbManager.setItem('issue_list_columns', parsedValue)
          localStorage.removeItem('issue_list_columns')
          console.log('[InitApp] 已迁移 issue_list_columns')
        } catch (err) {
          console.warn('[InitApp] 迁移 issue_list_columns 失败:', err)
        }
      }

      // 设置迁移完成标志
      await dbManager.setItem('__migration_completed__', {
        completed: true,
        timestamp: Date.now(),
        migratedCount: migratedKeys.length
      })

      console.log(`[InitApp] 数据迁移完成，共迁移 ${migratedKeys.length} 条数据`)
    } else {
      console.log('[InitApp] 数据已迁移，跳过迁移步骤')
    }

    return true
  } catch (error) {
    console.error('[InitApp] IndexedDB 初始化失败:', error)
    return false
  }
}

/**
 * 初始化应用
 */
export async function initApp() {
  try {
    console.log('[InitApp] 应用初始化开始...')

    // 初始化 IndexedDB
    await initIndexedDB()

    console.log('[InitApp] 应用初始化完成')
    return true
  } catch (error) {
    console.error('[InitApp] 应用初始化失败:', error)
    return false
  }
}

/**
 * 重置所有数据（用于调试）
 */
export async function resetAllData() {
  try {
    await dbManager.clear()
    localStorage.clear()
    sessionStorage.clear()
    console.log('[InitApp] 所有数据已重置')
    return true
  } catch (error) {
    console.error('[InitApp] 重置数据失败:', error)
    return false
  }
}

/**
 * 查看 IndexedDB 中的所有数据（用于调试）
 */
export async function viewAllData() {
  try {
    const allData = await dbManager.getAll()
    console.log('[InitApp] IndexedDB 中的所有数据:')
    console.table(allData)
    return allData
  } catch (error) {
    console.error('[InitApp] 查看数据失败:', error)
    return []
  }
}

// 将调试函数挂载到 window 对象上，方便控制台调试
if (typeof window !== 'undefined') {
  window.__dcp_debug__ = {
    resetAllData,
    viewAllData,
    initIndexedDB
  }
  console.log('[InitApp] 调试工具已挂载到 window.__dcp_debug__')
}
