/**
 * 路由辅助函数
 * 用于根据后端返回的菜单数据动态生成路由
 */

// 动态加载组件的映射
const modules = import.meta.glob('../views/**/*.vue')

// 固定子路由配置（不在菜单中，但需要路由）
const FIXED_SUB_ROUTES = {
  '/changelog': [
    {
      path: '/changelog/detail',
      name: 'ChangelogDetail',
      component: () => import('../views/changelog/components/ChangelogDetail.vue'),
      meta: {
        title: '发布日志详情',
        requiresAuth: true,
        hidden: true,  // 不显示在菜单中
        parentPath: '/changelog'
      }
    }
  ]
}

/**
 * 根据菜单数据生成路由配置
 * @param {Array} menus - 后端返回的菜单数据
 * @param {String} parentPath - 父级路径
 * @returns {Array} 路由配置数组
 */
export function generateRoutes(menus, parentPath = '') {
  const routes = []

  console.log('[generateRoutes] 开始生成路由，菜单数量:', menus?.length)

  menus.forEach((menu, index) => {
    console.log(`[generateRoutes] 处理菜单 ${index}:`, {
      menuName: menu.menuName,
      menuType: menu.menuType,
      visible: menu.visible,
      status: menu.status,
      path: menu.path,
      component: menu.component
    })

    // 只处理可见的菜单
    if (menu.visible !== 1 || menu.status !== 1) {
      console.log(`[generateRoutes] 跳过菜单 ${menu.menuName}: visible=${menu.visible}, status=${menu.status}`)
      return
    }

    // menuType: 1-目录，2-菜单，3-按钮
    // 只有菜单类型(2)才生成路由
    if (menu.menuType === 2 && menu.path && menu.component) {
      console.log(`[generateRoutes] 生成路由: ${menu.path}`)
      const route = {
        path: menu.path,
        name: menu.menuCode,
        component: loadComponent(menu.component),
        meta: {
          title: menu.menuName,
          icon: menu.icon,
          permission: menu.permission,
          menuId: menu.id,
          parentId: menu.parentId,
          hidden: menu.visible !== 1,
          requiresAuth: true
        }
      }

      // 如果有子菜单，递归处理
      if (menu.children && menu.children.length > 0) {
        const childRoutes = generateRoutes(menu.children, menu.path)
        if (childRoutes.length > 0) {
          route.children = childRoutes
        }
      }

      // 添加固定的子路由（如详情页）
      const fixedSubRoutes = FIXED_SUB_ROUTES[menu.path]
      if (fixedSubRoutes && fixedSubRoutes.length > 0) {
        if (!route.children) {
          route.children = []
        }
        route.children.push(...fixedSubRoutes)
        console.log(`[generateRoutes] 为 ${menu.path} 添加了 ${fixedSubRoutes.length} 个固定子路由`)
      }

      routes.push(route)
    }
    // 如果是目录(1)，只递归处理子菜单
    else if (menu.menuType === 1 && menu.children && menu.children.length > 0) {
      console.log(`[generateRoutes] 处理目录 ${menu.menuName}，子菜单数量: ${menu.children.length}`)
      const childRoutes = generateRoutes(menu.children, menu.path || parentPath)
      console.log(`[generateRoutes] 目录 ${menu.menuName} 生成了 ${childRoutes.length} 个路由`)

      // 🔧 目录类型也可能需要固定子路由
      // 将固定子路由添加到子路由列表中
      if (menu.path) {
        const fixedSubRoutes = FIXED_SUB_ROUTES[menu.path]
        if (fixedSubRoutes && fixedSubRoutes.length > 0) {
          childRoutes.push(...fixedSubRoutes)
          console.log(`[generateRoutes] 为目录 ${menu.path} 添加了 ${fixedSubRoutes.length} 个固定子路由`)
        }
      }

      routes.push(...childRoutes)
    }
  })

  // 🔧 将所有固定子路由作为独立路由添加（兜底方案）
  // 这样即使父路由不存在，固定子路由也能正常访问
  console.log('[generateRoutes] 🔧 开始添加固定子路由作为独立路由...')
  Object.entries(FIXED_SUB_ROUTES).forEach(([parentPath, subRoutes]) => {
    console.log(`[generateRoutes] 处理父路径: ${parentPath}, 子路由数量: ${subRoutes.length}`)
    subRoutes.forEach(subRoute => {
      // 检查该路由是否已经被添加（避免重复）
      const exists = routes.some(r => r.path === subRoute.path)
      if (!exists) {
        routes.push(subRoute)
        console.log(`[generateRoutes] ✅ 添加独立固定子路由: ${subRoute.path} (name: ${subRoute.name})`)
      } else {
        console.log(`[generateRoutes] ⚠️ 路由已存在，跳过: ${subRoute.path}`)
      }
    })
  })
  console.log('[generateRoutes] 🔧 固定子路由添加完成')

  console.log('[generateRoutes] 生成路由完成，总数:', routes.length)
  return routes
}

/**
 * 动态加载组件
 * @param {String} componentPath - 组件路径
 * @returns {Function} 组件加载函数
 */
function loadComponent(componentPath) {
  // 将后端返回的组件路径转换为实际的文件路径
  // 例如: "workspace/Issue" => "../views/workspace/Issue.vue"
  const path = `../views/${componentPath}.vue`

  // 从 glob 映射中查找对应的组件
  const component = modules[path]

  if (!component) {
    console.warn(`Component not found: ${path}`)
    // 返回一个默认的错误组件
    return () => import('../views/error/404.vue').catch(() => {
      return {
        template: '<div>Component not found: ' + componentPath + '</div>'
      }
    })
  }

  return component
}

/**
 * 扁平化路由树
 * @param {Array} routes - 路由配置数组
 * @returns {Array} 扁平化的路由数组
 */
export function flattenRoutes(routes) {
  const result = []

  function flatten(routeList) {
    routeList.forEach(route => {
      result.push(route)
      if (route.children && route.children.length > 0) {
        flatten(route.children)
      }
    })
  }

  flatten(routes)
  return result
}

/**
 * 根据权限过滤路由
 * @param {Array} routes - 路由配置数组
 * @param {Array} permissions - 用户权限列表
 * @returns {Array} 过滤后的路由数组
 */
export function filterRoutesByPermission(routes, permissions) {
  const result = []

  routes.forEach(route => {
    const tmp = { ...route }

    // 如果路由需要权限验证
    if (tmp.meta && tmp.meta.permission) {
      // 检查用户是否有该权限
      if (permissions.includes(tmp.meta.permission)) {
        // 递归处理子路由
        if (tmp.children) {
          tmp.children = filterRoutesByPermission(tmp.children, permissions)
        }
        result.push(tmp)
      }
    } else {
      // 没有权限要求的路由直接添加
      if (tmp.children) {
        tmp.children = filterRoutesByPermission(tmp.children, permissions)
      }
      result.push(tmp)
    }
  })

  return result
}

/**
 * 生成面包屑导航
 * @param {Array} routes - 所有路由
 * @param {String} currentPath - 当前路径
 * @returns {Array} 面包屑数组
 */
export function generateBreadcrumb(routes, currentPath) {
  const breadcrumb = []
  const flatRoutes = flattenRoutes(routes)

  // 查找当前路由
  const currentRoute = flatRoutes.find(route => route.path === currentPath)

  if (!currentRoute) {
    return breadcrumb
  }

  // 递归查找父级路由
  function findParents(route) {
    breadcrumb.unshift({
      title: route.meta.title,
      path: route.path,
      icon: route.meta.icon
    })

    if (route.meta.parentId) {
      const parent = flatRoutes.find(r => r.meta.menuId === route.meta.parentId)
      if (parent) {
        findParents(parent)
      }
    }
  }

  findParents(currentRoute)
  return breadcrumb
}

/**
 * 转换菜单数据为侧边栏菜单格式
 * @param {Array} menus - 后端返回的菜单数据
 * @returns {Array} 侧边栏菜单数据
 */
export function menusToSidebar(menus) {
  const result = []

  menus.forEach(menu => {
    // 只处理可见的菜单和目录
    if (menu.visible !== 1 || menu.status !== 1) {
      return
    }

    // 菜单类型：1-目录，2-菜单，3-按钮（按钮不显示在侧边栏）
    if (menu.menuType === 1 || menu.menuType === 2) {
      const item = {
        // 🔧 修复：目录使用 menuCode，菜单使用 path
        // 目录（menuType=1）不会生成路由，所以不能使用 path，否则会跳转到 404
        // 菜单（menuType=2）有对应的路由，使用 path
        value: menu.menuType === 1 ? menu.menuCode : (menu.path || menu.menuCode),
        label: menu.menuName,
        icon: menu.icon,
        permission: menu.permission,
        children: null
      }

      // 递归处理子菜单
      if (menu.children && menu.children.length > 0) {
        const childItems = menusToSidebar(menu.children)
        if (childItems.length > 0) {
          item.children = childItems
        }
      }

      result.push(item)
    }
  })

  return result
}

/**
 * 获取默认首页路由
 * @param {Array} menus - 菜单数据
 * @returns {String} 首页路径
 */
export function getDefaultHomePage(menus) {
  // 递归查找第一个菜单类型(2)的路由
  function findFirstMenu(menuList) {
    for (const menu of menuList) {
      if (menu.menuType === 2 && menu.path && menu.visible === 1) {
        return menu.path
      }
      if (menu.children && menu.children.length > 0) {
        const path = findFirstMenu(menu.children)
        if (path) {
          return path
        }
      }
    }
    return null
  }

  return findFirstMenu(menus) || '/home'
}
