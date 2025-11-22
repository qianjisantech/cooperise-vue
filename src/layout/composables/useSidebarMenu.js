import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

/**
 * Sidebar 菜单状态管理
 */
export function useSidebarMenu(menuList) {
  const router = useRouter()
  const route = useRoute()

  // 当前激活的一级菜单
  const activeFirstMenu = ref('')

  // 显示二级菜单
  const showSecondary = ref(false)

  // 当前选中的二级菜单路径
  const activeSecondPath = ref('')

  // 当前二级菜单内容
  const currentSecondaryMenu = computed(() => {
    const menu = menuList.value.find(m => m.value === activeFirstMenu.value)
    return menu?.children || []
  })

  // 判断菜单项是否激活
  const isMenuItemActive = (item) => {
    if (!item.path) return false

    // 完全匹配
    if (route.path === item.path) return true

    // 路径前缀匹配（用于子路由）
    if (route.path.startsWith(item.path + '/')) return true

    return false
  }

  // 处理一级菜单点击
  const handlePrimaryMenuClick = (menu) => {
    // 如果有children，展开二级菜单
    if (menu.children && menu.children.length > 0) {
      activeFirstMenu.value = menu.value
      showSecondary.value = true

      // 查找第一个可点击的菜单项并跳转
      const firstClickableItem = menu.children.find(
        item => item.path && !item.actions && item.type !== 'divider'
      )
      if (firstClickableItem && firstClickableItem.path) {
        router.push(firstClickableItem.path)
      }
    } else if (menu.path) {
      // 没有children，直接跳转
      activeFirstMenu.value = menu.value
      showSecondary.value = false
      router.push(menu.path)
    }
  }

  // 处理二级菜单项点击
  const handleItemClick = (item) => {
    // 如果有操作按钮（actions），不执行跳转
    if (item.actions) return

    // 如果是分隔线
    if (item.type === 'divider') return

    // 如果有路径，进行跳转
    if (item.path) {
      activeSecondPath.value = item.path
      router.push(item.path)
    }

    // 如果有自定义点击处理
    if (item.onClick) {
      item.onClick()
    }
  }

  // 根据当前路由初始化激活菜单
  const initActiveMenu = () => {
    const currentPath = route.path

    // 查找匹配的一级菜单
    for (const menu of menuList.value) {
      // 直接匹配一级菜单
      if (menu.path === currentPath) {
        activeFirstMenu.value = menu.value
        showSecondary.value = false
        return
      }

      // 检查二级菜单
      if (menu.children && menu.children.length > 0) {
        const matchedChild = menu.children.find(child => {
          if (!child.path) return false
          return currentPath === child.path || currentPath.startsWith(child.path + '/')
        })

        if (matchedChild) {
          activeFirstMenu.value = menu.value
          showSecondary.value = true
          activeSecondPath.value = matchedChild.path
          return
        }
      }

      // 路径前缀匹配一级菜单
      if (menu.path && currentPath.startsWith(menu.path + '/')) {
        activeFirstMenu.value = menu.value
        showSecondary.value = menu.children && menu.children.length > 0
        return
      }
    }
  }

  return {
    activeFirstMenu,
    showSecondary,
    activeSecondPath,
    currentSecondaryMenu,
    isMenuItemActive,
    handlePrimaryMenuClick,
    handleItemClick,
    initActiveMenu
  }
}
