/**
 * 权限指令
 * 使用方式：v-permission="'rbac:user:add'" 或 v-permission="['rbac:user:add', 'rbac:user:edit']"
 */
import { useUserStore } from '@/store/user'
import { watch } from 'vue'

function checkPermission(el, binding) {
  const { value } = binding
  const userStore = useUserStore()
  const permissions = userStore.menuPermissions

  // 如果权限还未加载，先标记元素，等待权限加载
  if (!permissions || !Array.isArray(permissions)) {
    // 暂时不移除元素，等待权限数据加载
    el._permissionPending = true
    return
  }

  // 权限已加载，清除等待标记
  el._permissionPending = false

  if (value) {
    let hasPermission = false

    if (Array.isArray(value)) {
      // 数组形式，只要有一个权限即可
      hasPermission = value.some(permission => permissions.includes(permission))
    } else if (typeof value === 'string') {
      // 字符串形式
      hasPermission = permissions.includes(value)
    }

    if (!hasPermission && !el._permissionRemoved) {
      // 没有权限，移除元素
      el._permissionRemoved = true
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}

export default {
  mounted(el, binding) {
    const userStore = useUserStore()

    // 立即检查一次
    checkPermission(el, binding)

    // 监听权限变化，当权限加载完成后重新检查
    const stopWatch = watch(
      () => userStore.menuPermissions,
      (newPermissions) => {
        if (newPermissions && Array.isArray(newPermissions) && newPermissions.length > 0) {
          checkPermission(el, binding)
        }
      },
      { immediate: false }
    )

    // 保存停止监听的函数，在元素卸载时清理
    el._stopPermissionWatch = stopWatch
  },
  updated(el, binding) {
    checkPermission(el, binding)
  },
  unmounted(el) {
    // 清理监听器
    if (el._stopPermissionWatch) {
      el._stopPermissionWatch()
    }
  }
}
