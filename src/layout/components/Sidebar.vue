<template>
  <div class="sidebar-container" :class="{ 'has-secondary': showSecondary }">
    <!-- 菜单区域 -->
    <div class="sidebar-menus" :class="{ 'has-secondary': showSecondary }">
      <!-- 一级菜单栏 -->
      <div class="primary-menu">
        <div class="primary-menu-list">
          <div
            v-for="menu in menuList"
            :key="menu.value"
            class="primary-menu-item"
            :class="{
              'is-active': activeFirstMenu === menu.value,
              'has-submenu': menu.children && menu.children.length > 0
            }"
            @click="handlePrimaryMenuClick(menu)"
          >
            <t-icon :name="menu.icon" size="22px" />
            <span class="menu-label">{{ menu.label }}</span>
            <div v-if="menu.badge" class="menu-badge">{{ menu.badge }}</div>
          </div>
        </div>
      </div>

      <!-- 二级菜单栏 -->
      <transition name="slide">
        <div v-if="showSecondary" class="secondary-menu">
          <!-- 视图加载中状态 -->
          <div v-if="viewsLoading && activeFirstMenu === '/workspace'" class="views-loading-container">
            <t-loading text="正在加载视图..." size="small" />
          </div>

          <div class="secondary-menu-list" :class="{ 'is-loading': viewsLoading && activeFirstMenu === '/workspace' }">
            <template v-for="(item, index) in currentSecondaryMenu" :key="index">
              <!-- 分隔线 -->
              <div v-if="item.type === 'divider'" class="menu-divider"></div>

              <!-- 菜单项 -->
              <div
                v-else
                class="secondary-menu-item"
                :class="{
                  'is-active': !item.actions && !item.showAddAction && !item.showLogActions && !item.showFolderActions && !item.showViewActions && !item.type && isMenuItemActive(item),
                  'has-actions': item.actions || item.showAddAction || item.showLogActions || item.showFolderActions || item.showViewActions,
                  'no-click': item.actions,
                  'is-indent': item.indent,
                  'is-double-indent': item.doubleIndent,
                  'is-folder': item.type === 'folder'
                }"
                @click="handleItemClick(item)"
              >
                <t-icon v-if="item.icon" :name="item.icon" size="16px" />
                <span class="item-label">{{ item.label }}</span>

                <!-- 我的视图-右侧操作按钮 -->
                <div v-if="item.actions" class="item-actions" @click.stop>
                  <t-icon
                    name="search"
                    size="16px"
                    class="action-icon"
                    @click="handleSearch"
                  />
                  <t-dropdown
                    v-model:visible="showAddDropdown"
                    :min-column-width="120"
                    trigger="click"
                  >
                    <t-icon
                      name="add"
                      size="16px"
                      class="action-icon"
                    />
                    <t-dropdown-menu>
                      <t-dropdown-item @click="handleCreateView">
                        新建视图
                      </t-dropdown-item>
                      <t-dropdown-item @click="handleCreateViewGroup">
                        新建视图分组
                      </t-dropdown-item>
                    </t-dropdown-menu>
                  </t-dropdown>
                </div>

                <!-- 文件夹-右侧操作按钮 -->
                <div v-if="item.showFolderActions" class="item-actions" @click.stop>
                  <t-dropdown :min-column-width="120" trigger="click">
                    <t-icon
                      name="ellipsis"
                      size="16px"
                      class="action-icon"
                    />
                    <t-dropdown-menu>
                      <t-dropdown-item @click="handleCreateViewInFolder(item.folderData)">
                        <t-icon name="add" size="14px" style="margin-right: 4px" />
                        新建视图
                      </t-dropdown-item>
                      <t-dropdown-item @click="handleEditFolder(item.folderData)">
                        <t-icon name="edit" size="14px" style="margin-right: 4px" />
                        重命名
                      </t-dropdown-item>
                      <t-dropdown-item @click="handleDeleteFolder(item.folderData)">
                        <t-icon name="delete" size="14px" style="margin-right: 4px" />
                        删除
                      </t-dropdown-item>
                    </t-dropdown-menu>
                  </t-dropdown>
                </div>

                <!-- 视图-右侧操作按钮 -->
                <div v-if="item.showViewActions" class="item-actions" @click.stop>
                  <t-dropdown :min-column-width="120" trigger="click">
                    <t-icon
                      name="ellipsis"
                      size="16px"
                      class="action-icon"
                    />
                    <t-dropdown-menu>
                      <t-dropdown-item @click="handleEditView(item.viewData)">
                        <t-icon name="edit" size="14px" style="margin-right: 4px" />
                        重命名
                      </t-dropdown-item>
                      <t-dropdown-item @click="handleDeleteView(item.viewData)">
                        <t-icon name="delete" size="14px" style="margin-right: 4px" />
                        删除
                      </t-dropdown-item>
                    </t-dropdown-menu>
                  </t-dropdown>
                </div>

                <!-- 全部日志-右侧新增按钮 -->
                <div v-if="item.showAddAction" class="item-actions" @click.stop>
                  <t-icon
                    v-permission="'changelog:add'"
                    name="add"
                    size="16px"
                    class="action-icon"
                    @click="handleCreateChangelog"
                  />
                </div>

                <!-- 发布日志-右侧编辑/删除按钮 -->
                <div v-if="item.showLogActions" class="item-actions" @click.stop>
                  <t-icon
                    v-permission="'changelog:edit'"
                    name="edit"
                    size="16px"
                    class="action-icon"
                    @click="handleEditChangelog(item.logData)"
                  />
                  <t-icon
                    v-permission="'changelog:delete'"
                    name="delete"
                    size="16px"
                    class="action-icon action-icon-danger"
                    @click="handleDeleteChangelog(item.logData)"
                  />
                </div>
              </div>
            </template>

          </div>
        </div>
      </transition>
    </div>

    <!-- 新建视图弹窗 -->
    <CreateViewDialog
      v-model="showCreateViewDialog"
      @submit="handleSubmitCreateView"
    />

    <!-- 新建文件夹弹窗 -->
    <CreateFolderDialog
      v-model="showCreateFolderDialog"
      @submit="handleSubmitCreateFolder"
    />

    <!-- 发布日志表单弹窗 -->
    <ChangelogFormDialog
      v-model:visible="showChangelogFormDialog"
      :changelog="currentChangelog"
      @success="handleChangelogFormSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWorkspaceStore } from '@/store/workspace'
import { useUserStore } from '@/store/user'
import {
  getMyViews,
  createView,
  updateView,
  deleteView,
  createViewFolder,
  updateViewFolder,
  deleteViewFolder,
  getViewFolderList
} from '@/api/workspace'
import { getChangelogList, deleteChangelog } from '@/api/changelog'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import CreateViewDialog from './components/CreateViewDialog.vue'
import CreateFolderDialog from './components/CreateFolderDialog.vue'
import ChangelogFormDialog from '@/views/changelog/components/ChangelogFormDialog.vue'
import { eventBus, EVENTS } from '@/utils/eventBus.js'

const router = useRouter()
const route = useRoute()
const workspaceStore = useWorkspaceStore()
const userStore = useUserStore()

// 定义emit事件
const emit = defineEmits(['secondary-change'])

const activeMenu = ref(route.path)
const activeFirstMenu = ref('')
const showSecondary = ref(false)
const showAddDropdown = ref(false)
const showCreateViewDialog = ref(false)
const showCreateFolderDialog = ref(false)
const showChangelogFormDialog = ref(false)
const currentChangelog = ref(null)

// 视图数据和文件夹
const myViews = ref([])
const viewFolders = ref([])
const expandedFolders = ref(new Set()) // 展开的文件夹ID集合
const viewsLoading = ref(false)

// 发布日志数据
const changelogList = ref([])
const changelogLoaded = ref(false) // 标记是否已加载过发布日志

// 加载发布日志列表
const loadChangelogList = async () => {
  try {
    const res = await getChangelogList()
    if (res.success) {
      changelogList.value = res.data || []
      // 按创建时间降序排序
      changelogList.value.sort((a, b) => {
        return new Date(b.createTime) - new Date(a.createTime)
      })
      changelogLoaded.value = true
    } else {
      console.error('获取发布日志列表失败:', res.message)
    }
  } catch (error) {
    console.error('获取发布日志列表失败:', error)
  }
}

// 生成视图菜单项（支持文件夹层级）
const generateViewMenuItems = () => {
  const items = []

  // 获取根级别的视图（没有folderId的）
  const rootViews = myViews.value.filter(view => !view.folderId)

  // 遍历文件夹
  viewFolders.value.forEach(folder => {
    // 添加文件夹项
    items.push({
      type: 'folder',
      id: folder.id,
      label: folder.name,
      icon: expandedFolders.value.has(folder.id) ? 'folder-open' : 'folder',
      indent: true,
      isExpanded: expandedFolders.value.has(folder.id),
      showFolderActions: true, // 标记显示文件夹操作按钮
      folderData: folder // 保存完整的文件夹数据
    })

    // 如果文件夹展开，添加该文件夹下的视图
    if (expandedFolders.value.has(folder.id)) {
      const folderViews = myViews.value.filter(view => view.folderId === folder.id)
      folderViews.forEach(view => {
        items.push({
          value: '/workspace/view/my',
          query: { id: view.id },
          label: view.name,
          icon: getViewIcon(view.type),
          indent: true,
          doubleIndent: true, // 文件夹下的视图需要双重缩进
          viewId: view.id,
          showViewActions: true, // 标记显示视图操作按钮
          viewData: view // 保存完整的视图数据
        })
      })
    }
  })

  // 添加根级别的视图
  rootViews.forEach(view => {
    items.push({
      value: '/workspace/view/my',
      query: { id: view.id },
      label: view.name,
      icon: getViewIcon(view.type),
      indent: true,
      viewId: view.id,
      showViewActions: true, // 标记显示视图操作按钮
      viewData: view // 保存完整的视图数据
    })
  })

  return items
}

// 检查是否有权限
const hasPermission = (permission) => {
  if (!permission) return true // 没有权限要求的菜单默认显示

  const permissions = userStore.menuPermissions

  // 如果权限数据还未加载或为空，暂时允许显示（避免空白）
  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    console.warn('权限数据未加载或为空，暂时允许访问:', permission)
    return true
  }

  // admin用户拥有所有权限
  if (permissions.includes('*:*:*')) return true

  // 精确匹配
  if (permissions.includes(permission)) return true

  // 通配符匹配
  return permissions.some(p => {
    if (p.endsWith('*')) {
      const prefix = p.slice(0, -1)
      return permission.startsWith(prefix)
    }
    return false
  })
}

// 过滤菜单项（根据权限）
const filterMenuByPermission = (menu) => {
  if (!menu) return null

  console.log('[filterMenuByPermission] 处理菜单:', menu.label, '权限:', menu.permission)

  // 一级菜单：始终显示，不管权限如何（只过滤子菜单）
  // 判断标准：在 rawMenuList 的顶层（通过检查是否是直接子项）
  const isFirstLevelMenu = true // 在 computed 中调用时，第一层都是一级菜单

  // 如果有子菜单，递归过滤子菜单
  if (menu.children && Array.isArray(menu.children)) {
    console.log('[filterMenuByPermission] 菜单有子项:', menu.children.length)
    const filteredChildren = menu.children
      .map(child => {
        // 对于子菜单，需要检查权限
        if (child.permission && !hasPermission(child.permission)) {
          console.log('[filterMenuByPermission] 子菜单无权限，过滤:', child.label)
          return null
        }
        return child
      })
      .filter(child => child !== null)

    console.log('[filterMenuByPermission] 过滤后子菜单数量:', filteredChildren.length)

    // 一级菜单即使没有可见的子菜单也要显示（让用户知道这个模块存在）
    return { ...menu, children: filteredChildren.length > 0 ? filteredChildren : null }
  }

  // 一级菜单（无子菜单）始终返回
  console.log('[filterMenuByPermission] 返回一级菜单:', menu.label)
  return menu
}

// 菜单配置（原始配置，带权限标识）
// 🔄 改用后端返回的菜单数据，首页保持写死
const rawMenuList = computed(() => {
  console.log('🍔🍔🍔 [rawMenuList] 重新计算菜单列表')
  console.log('🍔🍔🍔 [rawMenuList] userStore.sidebarMenus:', userStore.sidebarMenus)
  console.log('🍔🍔🍔 [rawMenuList] userStore.menus:', userStore.menus)

  // 首页菜单（写死的，始终显示）
  const homeMenu = {
    value: '/home',
    label: '首页',
    icon: 'home',
    children: null
  }

  // 如果后端菜单还未加载，只显示首页
  if (!userStore.sidebarMenus || userStore.sidebarMenus.length === 0) {
    console.log('🍔🍔🍔 [rawMenuList] 后端菜单未加载，只显示首页')
    return [homeMenu]
  }

  // 合并首页 + 后端菜单
  const menuList = [homeMenu, ...userStore.sidebarMenus]
  console.log('🍔🍔🍔 [rawMenuList] 最终菜单列表:', menuList.map(m => m.label))

  return menuList
})

// 过滤后的菜单列表（根据权限）
const menuList = computed(() => {
  console.log('==================== menuList computed 执行 ====================')
  console.log('[menuList] 当前路由:', route.path)
  console.log('[menuList] 原始菜单数量:', rawMenuList.value.length)

  const filtered = rawMenuList.value
    .map((menu, index) => {
      console.log(`[menuList] 过滤菜单 ${index}:`, menu.label, '权限:', menu.permission)
      const result = filterMenuByPermission(menu)
      console.log(`[menuList] 过滤结果:`, result ? result.label : 'null (被过滤)')
      return result
    })
    .filter(menu => menu !== null)

  console.log('[menuList] 过滤后菜单数量:', filtered.length)
  console.log('[menuList] 过滤后的菜单列表:', filtered.map(m => ({ value: m.value, label: m.label })))

  if (filtered.length === 0) {
    console.error('⚠️⚠️⚠️ [menuList] 警告：所有菜单都被过滤了！一级菜单将消失！')
  }

  console.log('================================================================')

  return filtered
})

// 当前二级菜单列表
const currentSecondaryMenu = computed(() => {
  // 特殊处理：发布日志的二级菜单需要动态生成
  if (activeFirstMenu.value === '/changelog') {
    const items = []

    // 添加"全部日志"菜单项（带新增按钮）
    items.push({
      label: '全部日志',
      path: '/changelog',
      icon: 'queue',
      showAddAction: true  // 显示新增按钮
    })

    // 添加分隔线
    if (changelogList.value.length > 0) {
      items.push({ type: 'divider' })
    }

    // 添加每个发布日志作为菜单项
    changelogList.value.forEach(log => {
      items.push({
        label: `${log.version} - ${log.title}`,
        value: '/changelog',  // 保持在 changelog 路由
        path: '/changelog',
        logId: log.id,  // 用于激活状态判断
        query: { id: log.id },  // 通过 query 参数传递日志ID
        indent: true,  // 缩进显示
        icon: 'file-icon',
        showLogActions: true,  // 显示编辑/删除按钮
        logData: log  // 传递完整日志数据（用于操作）
      })
    })

    return items
  }

  // 特殊处理：工作台的二级菜单需要在"我的视图"和"我的事项"之间添加分隔线
  if (activeFirstMenu.value === 'workspace') {
    const menu = menuList.value.find(m => m.value === activeFirstMenu.value)
    if (!menu || !menu.children || menu.children.length === 0) {
      return []
    }

    const items = []

    // 先找到"我的视图"和"我的事项"的索引
    const myViewsIndex = menu.children.findIndex(child => child.label === '我的视图' || child.actions)
    const myIssuesIndex = menu.children.findIndex(child => child.label === '我的事项')

    menu.children.forEach((child, index) => {
      items.push(child)

      // 如果找到了"我的视图"，并且下一个是"我的事项"，在中间插入分隔线
      if (myViewsIndex !== -1 && myIssuesIndex !== -1 &&
          index === myViewsIndex && myIssuesIndex === index + 1) {
        items.push({ type: 'divider' })
      }
    })

    return items
  }

  // 其他菜单从 menuList 读取 children
  const menu = menuList.value.find(m => m.value === activeFirstMenu.value)
  return menu?.children || []
})

// 根据当前路由初始化激活状态
const initActiveMenu = (path) => {
  console.log('======================== 路由初始化 ========================')
  console.log('[路由初始化] 当前路径:', path)
  console.log('[路由初始化] 变化前 - 激活的一级菜单:', activeFirstMenu.value)
  console.log('[路由初始化] 变化前 - 二级菜单展开:', showSecondary.value)

  if (path === '/home') {
    activeFirstMenu.value = '/home'
    showSecondary.value = false
    console.log('[路由初始化] 匹配到: 首页')
  } else if (path.startsWith('/workspace')) {
    activeFirstMenu.value = 'workspace'
    showSecondary.value = true
    console.log('[路由初始化] 匹配到: 工作台')
  } else if (path.startsWith('/space')) {
    activeFirstMenu.value = '/space'
    showSecondary.value = false
    console.log('[路由初始化] 匹配到: 空间')
  } else if (path === '/announcement') {
    activeFirstMenu.value = '/announcement'
    showSecondary.value = false
    console.log('[路由初始化] 匹配到: 公告')
  } else if (path.startsWith('/settings')) {
    activeFirstMenu.value = '/settings'
    showSecondary.value = false
    console.log('[路由初始化] 匹配到: 设置')
  } else if (path.startsWith('/rbac')) {
    activeFirstMenu.value = 'rbac'
    showSecondary.value = true
    console.log('[路由初始化] 匹配到: 权限管理')
  } else if (path === '/feedback') {
    activeFirstMenu.value = '/feedback'
    showSecondary.value = false
    console.log('[路由初始化] 匹配到: 问题反馈')
  } else if (path.startsWith('/changelog')) {
    activeFirstMenu.value = '/changelog'
    // changelog 路径下（包括详情页）都显示二级菜单
    showSecondary.value = true
    console.log('[路由初始化] 匹配到: 发布日志')
  } else if (path === '/operation-log') {
    activeFirstMenu.value = '/operation-log'
    showSecondary.value = false
    console.log('[路由初始化] 匹配到: 操作日志')
  } else {
    console.log('[路由初始化] 未匹配到任何菜单，保持当前状态')
  }

  console.log('[路由初始化] 变化后 - 激活的一级菜单:', activeFirstMenu.value)
  console.log('[路由初始化] 变化后 - 二级菜单展开:', showSecondary.value)
  console.log('============================================================')
}

// 初始化
initActiveMenu(route.path)

// 监听路由变化
watch(() => route.path, (newPath, oldPath) => {
  console.log('🔄🔄🔄 ==================== 路由变化开始 ====================')
  console.log('[路由监听] 路由变化:', oldPath, '->', newPath)
  activeMenu.value = newPath
  initActiveMenu(newPath)

  // 在路由跳转后检查一级菜单状态
  nextTick(() => {
    console.log('🚨🚨🚨 ==================== 路由跳转后检查 ====================')
    console.log('🚨🚨🚨 [路由跳转后] 路由已跳转到:', newPath)
    console.log('🚨🚨🚨 [路由跳转后] menuList.value.length:', menuList.value.length)
    console.log('🚨🚨🚨 [路由跳转后] DOM 中的菜单元素数量:', document.querySelectorAll('.primary-menu-item').length)

    // 检查所有关键容器
    const containers = {
      layoutContainer: document.querySelector('.layout-container'),
      permissionLoading: document.querySelector('.permission-loading'),
      layoutBody: document.querySelector('.layout-body'),
      headerContainer: document.querySelector('.header-container'),
      sidebarContainer: document.querySelector('.sidebar-container'),
      primaryMenu: document.querySelector('.primary-menu'),
      layoutMain: document.querySelector('.layout-main')
    }

    console.log('📦📦📦 [容器存在性检查]:')
    Object.entries(containers).forEach(([name, element]) => {
      if (element) {
        const styles = window.getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        console.log(`✅ ${name}:`, {
          存在: true,
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          position: styles.position,
          zIndex: styles.zIndex,
          位置: `left:${Math.round(rect.left)}, top:${Math.round(rect.top)}`,
          尺寸: `${Math.round(rect.width)}x${Math.round(rect.height)}`
        })
      } else {
        console.error(`❌ ${name}: 不存在！`)
      }
    })

    // 特别检查：permission-loading 是否显示
    if (containers.permissionLoading) {
      const loadingStyles = window.getComputedStyle(containers.permissionLoading)
      console.warn('⚠️⚠️⚠️ [路由跳转后] permission-loading 元素存在！display:', loadingStyles.display)
      console.warn('⚠️⚠️⚠️ 这可能导致 layout-body (包含 Sidebar) 被隐藏！')
    }

    // 检查 layout-body 的显示状态
    if (containers.layoutBody) {
      console.log('✅✅✅ [路由跳转后] layout-body 存在且可见，Sidebar 应该在其中')
    } else {
      console.error('❌❌❌ [路由跳转后] layout-body 不存在！可能被 v-if 隐藏了！')
      console.error('❌❌❌ 检查 userStore.permissionsLoaded 的值')
    }

    const primaryMenu = containers.primaryMenu
    if (primaryMenu) {
      const rect = primaryMenu.getBoundingClientRect()
      const styles = window.getComputedStyle(primaryMenu)
      console.log('🎯🎯🎯 [路由跳转后] .primary-menu 详细信息:')
      console.log('  display:', styles.display)
      console.log('  visibility:', styles.visibility)
      console.log('  opacity:', styles.opacity)
      console.log('  width:', styles.width)
      console.log('  height:', styles.height)
      console.log('  位置:', {left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom})
      console.log('  是否在屏幕内:', rect.left >= 0 && rect.top >= 0 && rect.width > 0 && rect.height > 0)

      // 检查是否被其他元素遮挡（多个位置）
      const testPoints = [
        { x: 40, y: 100, desc: '一级菜单顶部' },
        { x: 40, y: 300, desc: '一级菜单中部' },
        { x: 40, y: 500, desc: '一级菜单底部' }
      ]

      console.log('🔍🔍🔍 [遮挡检查] 测试多个位置:')
      testPoints.forEach(point => {
        const element = document.elementFromPoint(point.x, point.y)
        const isPrimaryMenu = element?.closest('.primary-menu') !== null
        console.log(`  位置(${point.x}, ${point.y}) [${point.desc}]:`, {
          元素: element?.className || element?.tagName,
          是否是一级菜单: isPrimaryMenu,
          状态: isPrimaryMenu ? '✅ 正常' : '❌ 被遮挡'
        })
      })
    } else {
      console.error('❌❌❌ [路由跳转后] .primary-menu 元素不存在！')
    }

    console.log('🚨🚨🚨 ==================== 路由跳转后检查结束 ====================')
  })
})

// 监听二级菜单状态变化，通知父组件
watch(showSecondary, (newValue) => {
  emit('secondary-change', newValue)
}, { immediate: true })

// 监听 menuList 变化（用于调试）
watch(menuList, (newValue, oldValue) => {
  console.log('⚡⚡⚡ [menuList 变化] ⚡⚡⚡')
  console.log('[menuList 变化] 旧菜单数量:', oldValue?.length || 0)
  console.log('[menuList 变化] 新菜单数量:', newValue.length)

  if (newValue.length === 0) {
    console.error('❌❌❌ [menuList 变化] 严重警告：menuList 变成空数组！一级菜单将全部消失！')
    console.error('[menuList 变化] 当前路由:', route.path)
    console.error('[menuList 变化] 用户权限:', userStore.menuPermissions)
    console.error('[menuList 变化] 原始菜单:', rawMenuList.value.map(m => m.label))
  }

  console.log('[menuList 变化] 菜单列表:', newValue.map(m => m.label))
}, { deep: true })

// 暴露获取菜单状态的方法（用于调试）
const getSidebarState = () => {
  const state = {
    activeFirstMenu: activeFirstMenu.value,
    activeSecondaryMenu: activeMenu.value,
    showSecondary: showSecondary.value,
    currentRoute: route.path,
    menuList: menuList.value.map(m => ({
      value: m.value,
      label: m.label,
      icon: m.icon,
      hasChildren: !!(m.children && m.children.length > 0),
      childrenCount: m.children?.length || 0,
      permission: m.permission
    })),
    currentSecondaryMenuItems: currentSecondaryMenu.value.length
  }

  console.log('======================== 侧边栏状态 ========================')
  console.log('[当前状态] 激活的一级菜单:', state.activeFirstMenu)
  console.log('[当前状态] 激活的二级菜单:', state.activeSecondaryMenu)
  console.log('[当前状态] 二级菜单展开:', state.showSecondary)
  console.log('[当前状态] 当前路由:', state.currentRoute)
  console.log('[当前状态] 一级菜单列表:', state.menuList)
  console.log('[当前状态] 当前二级菜单项数:', state.currentSecondaryMenuItems)
  console.log('============================================================')

  return state
}

// 添加全局检查所有布局容器的方法
const checkAllContainers = () => {
  console.log('==================== 全局容器检查 ====================')

  const containers = {
    layoutContainer: document.querySelector('.layout-container'),
    layoutBody: document.querySelector('.layout-body'),
    layoutMain: document.querySelector('.layout-main'),
    headerContainer: document.querySelector('.header-container'),
    sidebarContainer: document.querySelector('.sidebar-container'),
    sidebarMenus: document.querySelector('.sidebar-menus'),
    primaryMenu: document.querySelector('.primary-menu'),
  }

  Object.entries(containers).forEach(([name, element]) => {
    if (element) {
      const styles = window.getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      console.log(`✅ ${name}:`, {
        存在: true,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        位置: `(${rect.left}, ${rect.top})`,
        尺寸: `${rect.width}x${rect.height}`,
        zIndex: styles.zIndex
      })
    } else {
      console.error(`❌ ${name}: 不存在！`)
    }
  })

  console.log('页面上的一级菜单元素数量:', document.querySelectorAll('.primary-menu-item').length)
  console.log('====================================================')
}

// 将方法挂载到 window 对象，方便在控制台调试
if (typeof window !== 'undefined') {
  window.__getSidebarState = getSidebarState
  window.__checkAllContainers = checkAllContainers
}

// 在组件挂载时提示可用的调试方法
onMounted(() => {
  console.log('[Sidebar] 调试方法已加载:')
  console.log('  - window.__getSidebarState() - 查看侧边栏状态')
  console.log('  - window.__checkAllContainers() - 检查所有布局容器')
})

// 处理一级菜单点击
const handlePrimaryMenuClick = (menu) => {
  console.log('======================== 一级菜单点击 ========================')
  console.log('[一级菜单] 点击菜单:', menu.label)
  console.log('[一级菜单] 菜单值:', menu.value)
  console.log('[一级菜单] 菜单图标:', menu.icon)
  console.log('[一级菜单] 是否有子菜单:', menu.children && menu.children.length > 0)
  console.log('[一级菜单] 子菜单数量:', menu.children?.length || 0)
  console.log('[一级菜单] 权限:', menu.permission || '无权限要求')

  // 🔍 检查路由是否存在
  const currentRoutes = router.getRoutes()
  const targetRoute = currentRoutes.find(r => r.path === menu.value)
  console.log('🔍🔍🔍 [路由检查] 目标路径:', menu.value)
  console.log('🔍🔍🔍 [路由检查] 路由是否存在:', !!targetRoute)

  if (targetRoute) {
    console.log('✅✅✅ [路由检查] 路由存在，路由信息:', {
      name: targetRoute.name,
      path: targetRoute.path,
      component: targetRoute.component?.name || '匿名组件',
      meta: targetRoute.meta
    })
  } else {
    console.error('❌❌❌ [路由检查] 路由不存在！这会导致跳转到 404 页面，Layout 将被销毁！')
    console.error('❌❌❌ [路由检查] 目标路径:', menu.value)
    console.error('❌❌❌ [路由检查] 菜单数据来源:', menu)

    // 检查后端菜单数据
    console.error('❌❌❌ [后端数据检查] userStore.menus:')
    console.table(userStore.menus?.map(m => ({
      menuName: m.menuName,
      path: m.path,
      component: m.component,
      menuType: m.menuType,
      visible: m.visible,
      status: m.status
    })))

    // 检查动态路由是否已加载
    console.error('❌❌❌ [路由状态] userStore.routesLoaded:', userStore.routesLoaded)
    console.error('❌❌❌ [路由状态] userStore.routes.length:', userStore.routes?.length || 0)

    // 列出所有已注册的路由
    console.error('❌❌❌ [路由检查] 所有已注册的路由 (总数:', currentRoutes.length, '):')
    const layoutChildRoutes = currentRoutes.filter(r => {
      // 查找属于 Layout 的子路由（不是 /login、/404 等顶级路由）
      return r.path !== '/login' && r.path !== '/404' && r.path !== '/:pathMatch(.*)*' && r.path !== '/'
    })
    console.error('❌❌❌ [路由检查] Layout 子路由 (总数:', layoutChildRoutes.length, '):')
    layoutChildRoutes.forEach(r => {
      console.log('  ✓', r.path, '(name:', r.name, ', component:', r.component?.name || '匿名', ')')
    })

    // 查找相似的路由
    const similarRoutes = layoutChildRoutes.filter(r =>
      r.path.includes(menu.value.split('/').pop()) ||
      menu.value.includes(r.path.split('/').pop())
    )
    if (similarRoutes.length > 0) {
      console.warn('⚠️⚠️⚠️ [路由检查] 找到相似的路由:')
      similarRoutes.forEach(r => {
        console.log('  ?', r.path, '(与', menu.value, '相似)')
      })
    }
  }

  // 🔍 立即检查 menuList 的状态
  console.log('🔍🔍🔍 [点击时检查] menuList.value.length:', menuList.value.length)
  console.log('🔍🔍🔍 [点击时检查] menuList 内容:', menuList.value.map(m => m.label))
  console.log('🔍🔍🔍 [点击时检查] rawMenuList.value.length:', rawMenuList.value.length)

  // 记录状态变化前的值
  console.log('[状态变化前] 当前激活的一级菜单:', activeFirstMenu.value)
  console.log('[状态变化前] 当前激活的二级菜单:', activeMenu.value)
  console.log('[状态变化前] 二级菜单是否展开:', showSecondary.value)

  activeFirstMenu.value = menu.value

  console.log('[状态变化后] 激活的一级菜单:', activeFirstMenu.value)

  if (menu.children && menu.children.length > 0) {
    // 有子菜单，展开二级菜单
    showSecondary.value = true
    console.log('[一级菜单] 展开二级菜单')
    console.log('[一级菜单] 子菜单列表:', menu.children.map(c => c.label || c.type))

    // 如果是工作台，自动跳转到我的事项
    if (menu.value === 'workspace') {
      console.log('[一级菜单] 工作台 - 自动跳转到: /workspace/issue')
      router.push('/workspace/issue')
      activeMenu.value = '/workspace/issue'
    }
    // 如果是权限管理，自动跳转到用户管理
    else if (menu.value === 'rbac') {
      console.log('[一级菜单] 权限管理 - 自动跳转到: /rbac/user')
      router.push('/rbac/user')
      activeMenu.value = '/rbac/user'
    }
    // 如果是发布日志，跳转到列表页（展示所有日志）
    else if (menu.value === '/changelog') {
      console.log('[一级菜单] 发布日志 - 跳转到列表页')
      // 首次点击时才加载发布日志数据
      if (!changelogLoaded.value) {
        loadChangelogList()
      }
      router.push('/changelog')
      activeMenu.value = '/changelog'
    }
  } else {
    // 没有子菜单，直接跳转并隐藏二级菜单
    console.log('[一级菜单] 无子菜单，直接跳转到:', menu.value)
    showSecondary.value = false
    router.push(menu.value)
    activeMenu.value = menu.value
  }

  console.log('[最终状态] 激活的一级菜单:', activeFirstMenu.value)
  console.log('[最终状态] 激活的二级菜单:', activeMenu.value)
  console.log('[最终状态] 二级菜单展开状态:', showSecondary.value)
  console.log('[最终状态] 当前路由路径:', route.path)

  // 🔍 再次检查 menuList 的状态
  console.log('🔍🔍🔍 [点击结束检查] menuList.value.length:', menuList.value.length)
  console.log('🔍🔍🔍 [点击结束检查] menuList 内容:', menuList.value.map(m => m.label))

  // 使用 nextTick 检查 DOM 更新后的状态
  nextTick(() => {
    console.log('🔍🔍🔍 [DOM 更新后] menuList.value.length:', menuList.value.length)
    console.log('🔍🔍🔍 [DOM 更新后] 页面上的一级菜单元素数量:', document.querySelectorAll('.primary-menu-item').length)

    // 🚨 检查关键容器是否存在
    const layoutContainer = document.querySelector('.layout-container')
    const layoutBody = document.querySelector('.layout-body')
    const header = document.querySelector('.header-container')

    console.log('🚨🚨🚨 [容器检查] .layout-container 存在:', !!layoutContainer)
    console.log('🚨🚨🚨 [容器检查] .layout-body 存在:', !!layoutBody)
    console.log('🚨🚨🚨 [容器检查] .header-container 存在:', !!header)

    if (header) {
      const headerStyles = window.getComputedStyle(header)
      const headerRect = header.getBoundingClientRect()
      console.log('🚨🚨🚨 [容器检查] .header-container CSS:')
      console.log('  display:', headerStyles.display)
      console.log('  visibility:', headerStyles.visibility)
      console.log('  position:', headerStyles.position)
      console.log('  zIndex:', headerStyles.zIndex)
      console.log('  位置:', headerRect.left, headerRect.top, headerRect.right, headerRect.bottom)
    }

    if (layoutContainer) {
      const styles = window.getComputedStyle(layoutContainer)
      console.log('🚨🚨🚨 [容器检查] .layout-container display:', styles.display)
      console.log('🚨🚨🚨 [容器检查] .layout-container visibility:', styles.visibility)
    }

    // 检查 CSS 样式
    const primaryMenu = document.querySelector('.primary-menu')
    const sidebarMenus = document.querySelector('.sidebar-menus')
    const sidebarContainer = document.querySelector('.sidebar-container')

    console.log('🚨🚨🚨 [容器检查] .sidebar-container 存在:', !!sidebarContainer)
    console.log('🚨🚨🚨 [容器检查] .sidebar-menus 存在:', !!sidebarMenus)
    console.log('🚨🚨🚨 [容器检查] .primary-menu 存在:', !!primaryMenu)

    if (primaryMenu) {
      const styles = window.getComputedStyle(primaryMenu)
      const rect = primaryMenu.getBoundingClientRect()
      console.log('🎨🎨🎨 [CSS 检查] .primary-menu 样式:')
      console.log('  display:', styles.display)
      console.log('  visibility:', styles.visibility)
      console.log('  opacity:', styles.opacity)
      console.log('  width:', styles.width)
      console.log('  height:', styles.height)
      console.log('  transform:', styles.transform)
      console.log('  position:', styles.position)
      console.log('  left:', styles.left)
      console.log('  z-index:', styles.zIndex)

      console.log('📍📍📍 [位置检查] .primary-menu 位置:')
      console.log('  left:', rect.left, 'px')
      console.log('  top:', rect.top, 'px')
      console.log('  right:', rect.right, 'px')
      console.log('  bottom:', rect.bottom, 'px')
      console.log('  是否在屏幕内:', rect.left >= 0 && rect.top >= 0 && rect.right <= window.innerWidth)

      // 检查第一个菜单项
      const firstItem = primaryMenu.querySelector('.primary-menu-item')
      if (firstItem) {
        const itemRect = firstItem.getBoundingClientRect()
        const itemStyles = window.getComputedStyle(firstItem)
        console.log('📍📍📍 [菜单项检查] 第一个菜单项:')
        console.log('  可见性:', itemStyles.visibility)
        console.log('  不透明度:', itemStyles.opacity)
        console.log('  位置:', itemRect.left, itemRect.top)
        console.log('  尺寸:', itemRect.width, 'x', itemRect.height)
      }
    } else {
      console.error('❌ .primary-menu 元素不存在！')
    }

    if (sidebarMenus) {
      const styles = window.getComputedStyle(sidebarMenus)
      console.log('🎨🎨🎨 [CSS 检查] .sidebar-menus 样式:')
      console.log('  display:', styles.display)
      console.log('  width:', styles.width)
      console.log('  overflow:', styles.overflow)
    }

    if (sidebarContainer) {
      const styles = window.getComputedStyle(sidebarContainer)
      console.log('🎨🎨🎨 [CSS 检查] .sidebar-container 样式:')
      console.log('  display:', styles.display)
      console.log('  width:', styles.width)
      console.log('  transform:', styles.transform)
    }
  })

  console.log('============================================================')
}

// 判断菜单项是否激活
const isMenuItemActive = (item) => {
  // 如果菜单项有 viewId，说明是视图菜单项，需要匹配路径和 query 参数
  if (item.viewId) {
    return route.path === item.value && route.query.id === item.viewId
  }
  // 如果菜单项有 logId，说明是发布日志菜单项，需要匹配路径和 query 参数
  if (item.logId) {
    const targetPath = item.path || item.value
    return route.path === targetPath && String(route.query.id) === String(item.logId)
  }
  // 普通菜单项，只匹配路径
  const targetPath = item.path || item.value
  return activeMenu.value === targetPath || route.path === targetPath
}

// 统一处理菜单项点击
const handleItemClick = (item) => {
  // 如果是文件夹，切换展开/收起状态
  if (item.type === 'folder') {
    toggleFolder(item.id)
    return
  }

  // 如果有 actions，不做任何操作
  if (item.actions) {
    return
  }

  // 普通菜单项，执行跳转
  handleSecondaryMenuClick(item)
}

// 切换文件夹展开/收起
const toggleFolder = (folderId) => {
  if (expandedFolders.value.has(folderId)) {
    expandedFolders.value.delete(folderId)
  } else {
    expandedFolders.value.add(folderId)
  }
  // 触发响应式更新
  expandedFolders.value = new Set(expandedFolders.value)
}

// 处理二级菜单点击
const handleSecondaryMenuClick = (item) => {
  if (item.type === 'divider') return

  // 使用 path 或 value（兼容两种方式）
  const targetPath = item.path || item.value

  // 如果有 query 参数，使用对象形式跳转
  if (item.query) {
    router.push({
      path: targetPath,
      query: item.query
    })
  } else {
    router.push(targetPath)
  }

  activeMenu.value = targetPath
}

// 获取视图图标
const getViewIcon = (viewType) => {
  const iconMap = {
    list: 'view-list',
    gantt: 'chart-bar',
    resource: 'user-circle',
    board: 'view-module',
    calendar: 'calendar'
  }
  return iconMap[viewType] || 'view-list'
}

// 加载我的视图
const loadMyViews = async () => {
  try {
    viewsLoading.value = true
    const res = await getMyViews()
    if (res.success) {
      const data = res.data || []

      // 解析树形结构数据
      const folders = []
      const views = []

      data.forEach(item => {
        if (item.type === 'folder') {
          // 添加文件夹
          folders.push({
            id: item.id,
            name: item.name
          })

          // 添加文件夹下的视图
          if (item.children && item.children.length > 0) {
            item.children.forEach(child => {
              views.push({
                id: child.id,
                name: child.name,
                type: child.type,
                folderId: item.id // 关联到父文件夹
              })
            })
          }
        } else {
          // 根级别的视图（没有文件夹）
          views.push({
            id: item.id,
            name: item.name,
            type: item.type,
            folderId: null
          })
        }
      })

      viewFolders.value = folders
      myViews.value = views

      // 默认展开所有文件夹
      folders.forEach(folder => {
        expandedFolders.value.add(folder.id)
      })
    } else {
      MessagePlugin.error(res.message || '获取视图列表失败')
    }
  } catch (error) {
    console.error('获取视图列表失败:', error)
    MessagePlugin.error('获取视图列表失败')
  } finally {
    viewsLoading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  console.log('搜索视图')
  // TODO: 实现搜索功能
}

// 当前选中的文件夹（用于在文件夹下新建视图）
const currentFolderId = ref(null)

// 处理新建视图
const handleCreateView = (folderId = null) => {
  currentFolderId.value = folderId
  showAddDropdown.value = false
  showCreateViewDialog.value = true
}

// 在文件夹下新建视图
const handleCreateViewInFolder = (folder) => {
  handleCreateView(folder.id)
}

// 处理新建视图分组（文件夹）
const handleCreateViewGroup = () => {
  showAddDropdown.value = false
  showCreateFolderDialog.value = true
}

// 加载文件夹列表
const loadViewFolders = async () => {
  try {
    console.log('[加载文件夹列表] 开始')
    const res = await getViewFolderList()

    console.log('[加载文件夹列表] 响应:', res)

    if (res.success || res.code === 200) {
      viewFolders.value = res.data || []
      console.log('[加载文件夹列表] 成功，数量:', viewFolders.value.length)
    } else {
      console.error('获取文件夹列表失败:', res.message)
    }
  } catch (error) {
    console.error('[加载文件夹列表] 失败:', error)
  }
}

// 提交新建文件夹
const handleSubmitCreateFolder = async (formData) => {
  try {
    console.log('[创建文件夹] 请求数据:', formData)

    const folderData = {
      name: formData.folderName,
      ownerId: null, // 后端自动设置
      parentId: null, // 顶层文件夹
      sortOrder: 0
    }

    const res = await createViewFolder(folderData)

    console.log('[创建文件夹] 响应数据:', res)

    if (res.success || res.code === 200) {
      MessagePlugin.success('创建文件夹成功')
      showCreateFolderDialog.value = false
      // 刷新文件夹列表
      await loadViewFolders()
      await loadMyViews()
    } else {
      MessagePlugin.error(res.message || '创建文件夹失败')
    }
  } catch (error) {
    console.error('[创建文件夹] 失败:', error)
    const errorMsg = error.response?.data?.message || error.message || '创建文件夹失败'
    MessagePlugin.error(errorMsg)
  }
}

// 编辑文件夹
const handleEditFolder = async (folder) => {
  const dialog = DialogPlugin.confirm({
    header: '编辑文件夹',
    body: `
      <div style="padding: 20px 0;">
        <div style="margin-bottom: 8px;">文件夹名称</div>
        <input
          id="folder-name-input"
          type="text"
          value="${folder.name}"
          style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
        />
      </div>
    `,
    confirmBtn: '保存',
    cancelBtn: '取消',
    onConfirm: async () => {
      const input = document.getElementById('folder-name-input')
      const newName = input?.value?.trim()

      if (!newName) {
        MessagePlugin.error('文件夹名称不能为空')
        return
      }

      try {
        console.log('[编辑文件夹] ID:', folder.id, '新名称:', newName)

        const res = await updateViewFolder(folder.id, {
          name: newName
        })

        if (res.success || res.code === 200) {
          MessagePlugin.success('编辑文件夹成功')
          await loadViewFolders()
          await loadMyViews()
          dialog.destroy()
        } else {
          MessagePlugin.error(res.message || '编辑文件夹失败')
        }
      } catch (error) {
        console.error('[编辑文件夹] 失败:', error)
        const errorMsg = error.response?.data?.message || error.message || '编辑文件夹失败'
        MessagePlugin.error(errorMsg)
      }
    }
  })
}

// 删除文件夹
const handleDeleteFolder = async (folder) => {
  const confirmDialog = DialogPlugin.confirm({
    header: '删除文件夹',
    body: `确定要删除文件夹"${folder.name}"吗？如果文件夹内有视图或子文件夹，将无法删除。`,
    confirmBtn: '删除',
    cancelBtn: '取消',
    theme: 'warning',
    onConfirm: async () => {
      try {
        console.log('[删除文件夹] ID:', folder.id)

        const res = await deleteViewFolder(folder.id)

        if (res.success || res.code === 200) {
          MessagePlugin.success('删除文件夹成功')
          await loadViewFolders()
          await loadMyViews()
          confirmDialog.destroy()
        } else {
          MessagePlugin.error(res.message || '删除文件夹失败')
        }
      } catch (error) {
        console.error('[删除文件夹] 失败:', error)
        const errorMsg = error.response?.data?.message || error.message || '删除文件夹失败'
        MessagePlugin.error(errorMsg)
      }
    }
  })
}

// 编辑视图
const handleEditView = async (view) => {
  const dialog = DialogPlugin.confirm({
    header: '重命名视图',
    body: `
      <div style="padding: 20px 0;">
        <div style="margin-bottom: 8px;">视图名称</div>
        <input
          id="view-name-input"
          type="text"
          value="${view.name}"
          style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
        />
      </div>
    `,
    confirmBtn: '保存',
    cancelBtn: '取消',
    onConfirm: async () => {
      const input = document.getElementById('view-name-input')
      const newName = input?.value?.trim()

      if (!newName) {
        MessagePlugin.error('视图名称不能为空')
        return
      }

      try {
        console.log('[编辑视图] ID:', view.id, '新名称:', newName)

        const res = await updateView(view.id, {
          name: newName
        })

        if (res.success || res.code === 200) {
          MessagePlugin.success('重命名成功')
          await loadMyViews()
          dialog.destroy()
        } else {
          MessagePlugin.error(res.message || '重命名失败')
        }
      } catch (error) {
        console.error('[编辑视图] 失败:', error)
        const errorMsg = error.response?.data?.message || error.message || '重命名失败'
        MessagePlugin.error(errorMsg)
      }
    }
  })
}

// 删除视图
const handleDeleteView = async (view) => {
  const confirmDialog = DialogPlugin.confirm({
    header: '删除视图',
    body: `确定要删除视图"${view.name}"吗？此操作不可恢复。`,
    confirmBtn: '删除',
    cancelBtn: '取消',
    theme: 'warning',
    onConfirm: async () => {
      try {
        console.log('[删除视图] ID:', view.id)

        const res = await deleteView(view.id)

        if (res.success || res.code === 200) {
          MessagePlugin.success('删除视图成功')

          // 判断是否删除的是当前查看的视图
          const isDeletingCurrent = route.path === '/workspace/view/my' &&
                                   String(route.query.id) === String(view.id)

          // 刷新视图列表
          await loadMyViews()

          // 如果删除的是当前查看的视图，跳转到"我的事项"页面
          if (isDeletingCurrent) {
            router.push('/workspace/issue')
          }

          confirmDialog.destroy()
        } else {
          MessagePlugin.error(res.message || '删除视图失败')
        }
      } catch (error) {
        console.error('[删除视图] 失败:', error)
        const errorMsg = error.response?.data?.message || error.message || '删除视图失败'
        MessagePlugin.error(errorMsg)
      }
    }
  })
}

// 提交新建视图
const handleSubmitCreateView = async (formData) => {
  try {
    // 构建完整的视图数据
    const viewData = {
      name: formData.viewName,
      type: formData.viewType,
      config: JSON.stringify({}), // 将 config 转为 JSON 字符串
      spaceId: null, // 如果不属于特定空间，设为 null
      ownerId: null, // 后端会自动设置当前用户
      isPublic: 0, // 默认私有
      folderId: currentFolderId.value, // 设置文件夹ID
      sortOrder: 0, // 默认排序
      description: formData.description || '' // 添加描述字段
    }

    console.log('[创建视图] 请求数据:', viewData)
    console.log('[创建视图] 所属文件夹ID:', currentFolderId.value)

    const res = await createView(viewData)

    console.log('[创建视图] 响应数据:', res)

    if (res.success || res.code === 200) {
      const folderMsg = currentFolderId.value ? '（已添加到文件夹）' : ''
      MessagePlugin.success('视图创建成功' + folderMsg)
      showCreateViewDialog.value = false
      currentFolderId.value = null // 重置文件夹ID
      // 刷新视图列表
      await loadMyViews()
    } else {
      MessagePlugin.error(res.message || '创建视图失败')
    }
  } catch (error) {
    console.error('[创建视图] 失败:', error)
    console.error('[创建视图] 错误详情:', error.response?.data)

    const errorMsg = error.response?.data?.message || error.message || '创建视图失败'
    MessagePlugin.error(errorMsg)
  } finally {
    currentFolderId.value = null // 确保重置
  }
}

// 处理新增发布日志
const handleCreateChangelog = () => {
  currentChangelog.value = null
  showChangelogFormDialog.value = true
}

// 处理编辑发布日志
const handleEditChangelog = (changelog) => {
  currentChangelog.value = { ...changelog }
  showChangelogFormDialog.value = true
}

// 处理删除发布日志
const handleDeleteChangelog = (changelog) => {
  const confirmDialog = DialogPlugin.confirm({
    header: '删除确认',
    body: `确定要删除发布日志 "${changelog.version}" 吗？此操作不可恢复，请谨慎操作！`,
    confirmBtn: '删除',
    cancelBtn: '取消',
    theme: 'warning',
    onConfirm: async () => {
      try {
        const res = await deleteChangelog(changelog.id)
        if (res.success) {
          MessagePlugin.success('删除成功')

          // 判断是否删除的是当前查看的日志
          const isDeletingCurrent = route.path === '/changelog' &&
                                   String(route.query.id) === String(changelog.id)

          // 刷新发布日志列表
          await loadChangelogList()

          // 如果删除的是当前查看的日志
          if (isDeletingCurrent) {
            // 如果还有其他日志，跳转到最新的一个
            if (changelogList.value.length > 0) {
              const latestLog = changelogList.value[0]
              router.push({
                path: '/changelog',
                query: { id: latestLog.id }
              })
            } else {
              // 如果没有日志了，跳转到列表页（无query参数）
              router.push('/changelog')
            }
          }

          confirmDialog.destroy()
        } else {
          MessagePlugin.error(res.message || '删除失败')
        }
      } catch (error) {
        console.error('删除发布日志失败:', error)
        MessagePlugin.error('删除失败')
      }
    }
  })
}

// 发布日志表单提交成功
const handleChangelogFormSuccess = async (result) => {
  showChangelogFormDialog.value = false
  const isEdit = !!currentChangelog.value
  const editingId = currentChangelog.value?.id
  currentChangelog.value = null

  // 刷新发布日志列表
  await loadChangelogList()

  // 如果是编辑操作且在日志页，刷新当前日志
  if (isEdit && route.path === '/changelog' && String(route.query.id) === String(editingId)) {
    // 触发页面刷新（通过重新导航到同一个路由）
    router.replace({
      path: '/changelog',
      query: { id: editingId, t: Date.now() }
    })
  }
  // 如果是新增操作，跳转到新创建的日志
  else if (!isEdit && result?.data?.id) {
    router.push({
      path: '/changelog',
      query: { id: result.data.id }
    })
  }
}

// 组件挂载时加载数据
// 定义事件处理器函数（用于后续清理）
const handleChangelogUpdate = () => {
  loadChangelogList()
}

onMounted(() => {
  loadViewFolders() // 加载文件夹列表
  loadMyViews()

  // 🔧 优化：只在用户访问发布日志页面时才加载数据
  // 如果当前路由是发布日志页面，则加载数据
  if (route.path === '/changelog') {
    loadChangelogList()
  }

  // 监听发布日志事件，确保侧边栏列表同步更新
  eventBus.on(EVENTS.CHANGELOG_CREATED, handleChangelogUpdate)
  eventBus.on(EVENTS.CHANGELOG_UPDATED, handleChangelogUpdate)
  eventBus.on(EVENTS.CHANGELOG_DELETED, handleChangelogUpdate)
})

onUnmounted(() => {
  // 清理事件监听器
  eventBus.off(EVENTS.CHANGELOG_CREATED, handleChangelogUpdate)
  eventBus.off(EVENTS.CHANGELOG_UPDATED, handleChangelogUpdate)
  eventBus.off(EVENTS.CHANGELOG_DELETED, handleChangelogUpdate)
})
</script>

<style scoped lang="scss">
// 侧边栏容器
.sidebar-container {
  position: fixed;
  left: 0;
  top: 64px; // 从Header下方开始
  bottom: 0;
  z-index: 10; // 设置为较低的层级，与主内容区域在同一层级
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e3e6eb;
  width: 80px;
  transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 8px 0 rgba(0, 0, 0, 0.04);

  &.has-secondary {
    width: 280px;
  }
}

// 菜单区域
.sidebar-menus {
  flex: 1;
  display: flex;
  overflow: visible; // 改为 visible，确保一级菜单不会被裁剪
  transition: width 0.3s ease;
  max-height: calc(100vh - 64px); // 限制最大高度，减去Header高度
  box-sizing: border-box;

  &:not(.has-secondary) {
    width: 80px;
  }

  &.has-secondary {
    width: 280px;
  }
}

// 一级菜单栏
.primary-menu {
  width: 80px;
  min-width: 80px;
  background: #fff;
  display: flex !important; // 强制显示，防止被覆盖
  flex-direction: column;
  flex-shrink: 0; // 防止被 flex 布局压缩
  z-index: 1; // 确保在二级菜单之上
  visibility: visible !important; // 强制可见
  opacity: 1 !important; // 强制不透明

  // 有二级菜单时添加右边框
  .sidebar-menus.has-secondary & {
    border-right: 1px solid #e7e7e7;
  }

  .primary-menu-list {
    flex: 1;
    padding: 8px 6px;
    overflow-y: auto;

    .primary-menu-item {
      position: relative;
      min-height: 64px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-bottom: 8px;
      padding: 8px 4px;
      border-radius: 6px;
      cursor: pointer;
      color: #646a73;
      transition: all 0.3s;

      .t-icon {
        color: #646a73;
        flex-shrink: 0;
      }

      .menu-label {
        font-size: 12px;
        text-align: center;
        line-height: 1.2;
        word-break: break-all;
      }

      .menu-badge {
        position: absolute;
        top: 4px;
        right: 4px;
        background: #e34d59;
        color: #fff;
        font-size: 10px;
        padding: 2px 4px;
        border-radius: 8px;
        min-width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }

      &:hover {
        background: #f5f7fa;
        color: #1f2329;

        .t-icon {
          color: #1f2329;
        }
      }

      &.is-active {
        background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);
        color: #0052d9;

        .t-icon {
          color: #0052d9;
        }
      }
    }
  }
}

// 二级菜单栏
.secondary-menu {
  width: 200px;
  min-width: 200px;
  background: #fff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e7e7e7;
  position: relative;

  // 视图加载中容器
  .views-loading-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    z-index: 10;
    backdrop-filter: blur(2px);
  }

  .secondary-menu-list {
    flex: 1;
    padding: 12px 8px 8px 8px;
    overflow-y: auto;

    // loading 时降低透明度
    &.is-loading {
      opacity: 0.4;
      pointer-events: none;
    }

    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 3px;

      &:hover {
        background: #bbb;
      }
    }

    .menu-divider {
      height: 1px;
      background: #e7e7e7;
      margin: 8px 0;
    }

    .secondary-menu-item {
      height: 36px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 12px;
      margin-bottom: 4px;
      border-radius: 4px;
      cursor: pointer;
      color: #646a73;
      transition: all 0.3s;
      position: relative;

      .t-icon {
        color: #646a73;
        flex-shrink: 0;
      }

      .item-label {
        font-size: 13px;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      // 缩进的菜单项（视图列表和文件夹）
      &.is-indent {
        padding-left: 32px;
        font-size: 13px;

        .t-icon {
          font-size: 14px;
        }
      }

      // 双重缩进（文件夹内的视图）
      &.is-double-indent {
        padding-left: 52px;
        font-size: 13px;

        .t-icon {
          font-size: 14px;
        }
      }

      // 文件夹样式
      &.is-folder {
        font-weight: 500;

        .t-icon {
          color: #667eea;
        }
      }

      // 不可点击的菜单项
      &.no-click {
        cursor: default;

        &:hover {
          background: transparent;
        }
      }

      // 右侧操作按钮
      .item-actions {
        display: flex;
        align-items: center;
        gap: 4px;

        .action-icon {
          color: #646a73;
          cursor: pointer;
          padding: 2px;
          border-radius: 2px;
          transition: all 0.2s;

          &:hover {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
          }

          &.action-icon-danger {
            &:hover {
              background: rgba(227, 77, 89, 0.1);
              color: #e34d59;
            }
          }
        }
      }

      &:hover {
        background: #f5f7fa;
        color: #1f2329;

        .t-icon {
          color: #1f2329;
        }
      }

      &.is-active {
        background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);
        color: #0052d9;

        .t-icon {
          color: #0052d9;
        }
      }

      // 有操作按钮的菜单项，左侧留出更多空间
      &.has-actions {
        .item-label {
          padding-left: 8px;
        }
      }
    }
  }
}

// 滑动动画
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

</style>

<style lang="scss">
// 下拉菜单全局样式
.t-dropdown__menu {
  .t-dropdown__item {
    padding: 8px 16px;
    font-size: 13px;
    color: #646a73;
    cursor: pointer;

    &:hover {
      background: #f5f2ff;
      color: #667eea;
    }
  }
}

// ========== 响应式适配 ==========

// 平板屏幕 (768px - 1024px)
@media (max-width: 1024px) {
  .sidebar-container {
    width: 64px;

    &.has-secondary {
      width: 248px;
    }
  }

  .sidebar-menus {
    &:not(.has-secondary) {
      width: 64px;
    }

    &.has-secondary {
      width: 248px;
    }
  }

  .primary-menu {
    width: 64px;
    min-width: 64px;
    flex-shrink: 0; // 防止被压缩
    z-index: 1; // 确保可见

    .primary-menu-list {
      padding: 6px 4px;

      .primary-menu-item {
        min-height: 56px;
        padding: 6px 2px;

        .menu-label {
          font-size: 11px;
        }
      }
    }
  }

  .secondary-menu {
    width: 184px;
    min-width: 184px;

    .secondary-menu-list {
      .secondary-menu-item {
        height: 32px;
        padding: 0 10px;

        .item-label {
          font-size: 12px;
        }

        &.is-indent {
          padding-left: 28px;
        }

        &.is-double-indent {
          padding-left: 46px;
        }
      }
    }
  }
}

// 手机屏幕 (768px 以下) - Sidebar 完全隐藏或浮动显示
@media (max-width: 768px) {
  .sidebar-container {
    // 默认隐藏（可以通过添加移动端菜单按钮来控制显示）
    // ⚠️ 临时注释掉以便调试 - 防止 Sidebar 在窄屏幕上消失
    // transform: translateX(-100%);
    // transition: transform 0.3s ease;
    z-index: 199; // 提高层级，覆盖主内容
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);

    // 当显示时（通过添加 .mobile-show 类）
    &.mobile-show {
      transform: translateX(0);
    }

    // 移动端默认不展开二级菜单，只显示56px的一级菜单
    width: 56px;

    &.has-secondary {
      width: 100%;
      max-width: 320px;
    }
  }

  .sidebar-menus {
    &:not(.has-secondary) {
      width: 56px;
    }

    &.has-secondary {
      width: 100%;
      max-width: 320px;
    }
  }

  .primary-menu {
    width: 56px;
    min-width: 56px;
    flex-shrink: 0; // 防止被压缩
    z-index: 1; // 确保可见

    .primary-menu-list {
      padding: 4px 2px;

      .primary-menu-item {
        min-height: 48px;
        padding: 4px 2px;
        margin-bottom: 4px;

        .t-icon {
          font-size: 20px;
        }

        .menu-label {
          font-size: 10px;
        }

        .menu-badge {
          top: 2px;
          right: 2px;
          font-size: 9px;
          padding: 1px 3px;
          min-width: 14px;
          height: 14px;
        }
      }
    }
  }

  .secondary-menu {
    width: calc(100% - 56px);
    min-width: calc(100% - 56px);
    max-width: 264px;

    .secondary-menu-list {
      padding: 8px 6px;

      .secondary-menu-item {
        height: 36px;
        padding: 0 8px;
        font-size: 12px;

        .item-label {
          font-size: 12px;
        }

        &.is-indent {
          padding-left: 24px;
        }

        &.is-double-indent {
          padding-left: 40px;
        }
      }
    }
  }
}

// 小屏手机 (480px 以下)
@media (max-width: 480px) {
  .sidebar-container {
    &.has-secondary {
      max-width: 280px;
    }
  }

  .sidebar-menus {
    &.has-secondary {
      max-width: 280px;
    }
  }

  .secondary-menu {
    max-width: 224px;
  }
}
</style>
