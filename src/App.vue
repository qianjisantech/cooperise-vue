<template>
  <router-view />
  <GlobalLoading />
  <SystemUpdateChecker />
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import GlobalLoading from '@/components/GlobalLoading.vue'
import SystemUpdateChecker from '@/components/SystemUpdateChecker.vue'
import { getBrowserInfo, featureDetection } from '@/utils/responsive'

const userStore = useUserStore()

// 应用启动时，如果已登录则加载权限数据
onMounted(async () => {
  // 浏览器兼容性检测
  const browserInfo = getBrowserInfo()
  const features = {
    grid: featureDetection.supportsGrid(),
    flexbox: featureDetection.supportsFlexbox(),
    cssVariables: featureDetection.supportsCSSVariables(),
    intersectionObserver: featureDetection.supportsIntersectionObserver(),
    webp: featureDetection.supportsWebP(),
    touch: featureDetection.supportsTouch()
  }
  
  console.log('[App] 浏览器信息:', browserInfo)
  console.log('[App] 特性支持:', features)
  
  // 添加浏览器类名到 body，方便 CSS 针对性处理
  if (browserInfo.isIE) {
    document.body.classList.add('browser-ie')
  }
  if (browserInfo.isMobile) {
    document.body.classList.add('device-mobile')
  }
  if (browserInfo.isTablet) {
    document.body.classList.add('device-tablet')
  }
  if (browserInfo.isDesktop) {
    document.body.classList.add('device-desktop')
  }
  
  // 添加屏幕尺寸类名
  const updateScreenClass = () => {
    const width = window.innerWidth
    document.body.classList.remove('screen-xs', 'screen-sm', 'screen-md', 'screen-lg', 'screen-xl')
    
    if (width < 480) {
      document.body.classList.add('screen-xs')
    } else if (width < 768) {
      document.body.classList.add('screen-sm')
    } else if (width < 1024) {
      document.body.classList.add('screen-md')
    } else if (width < 1440) {
      document.body.classList.add('screen-lg')
    } else {
      document.body.classList.add('screen-xl')
    }
  }
  
  updateScreenClass()
  window.addEventListener('resize', updateScreenClass, { passive: true })
  
  if (userStore.token) {
    try {
      await userStore.getPermissions()
    } catch (error) {
      console.error('加载权限失败:', error)
    }
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* 浏览器兼容性 */
  -webkit-tap-highlight-color: transparent;
}

*::before,
*::after {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', sans-serif;
  /* 浏览器兼容性 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* 移动端优化 */
  -webkit-overflow-scrolling: touch;
  /* 防止页面缩放（可选） */
  touch-action: manipulation;
}

#app {
  width: 100%;
  min-height: 100vh;
  /* iOS Safari 兼容性 */
  min-height: -webkit-fill-available;
  /* 防止内容溢出 */
  overflow-x: hidden;
  /* 硬件加速 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  will-change: scroll-position;
}

/* 全局设置弹窗蒙层样式 - 统一设置为浅灰色半透明 */
.t-drawer__mask,
.t-dialog__mask,
.t-popup__mask,
.t-modal__mask {
  background-color: rgba(0, 0, 0, 0.3) !important;
  /* 浏览器兼容性 */
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
}

/* 响应式工具类 */
.container-responsive {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 1024px) {
  .container-responsive {
    padding: 0 16px;
  }
}

@media (max-width: 768px) {
  .container-responsive {
    padding: 0 12px;
  }
}

@media (max-width: 480px) {
  .container-responsive {
    padding: 0 8px;
  }
}

/* 文本溢出处理 */
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-ellipsis-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 移动端触摸优化 */
@media (max-width: 768px) {
  /* 增大触摸目标 */
  button, a, .t-button {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* 优化输入框 */
  input, textarea, select {
    font-size: 16px; /* 防止 iOS 自动缩放 */
  }
}

/* 打印样式 */
@media print {
  * {
    background: transparent !important;
    color: black !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
  
  a, a:visited {
    text-decoration: underline;
  }
  
  pre, blockquote {
    border: 1px solid #999;
    page-break-inside: avoid;
  }
  
  thead {
    display: table-header-group;
  }
  
  tr, img {
    page-break-inside: avoid;
  }
  
  img {
    max-width: 100% !important;
  }
  
  p, h2, h3 {
    orphans: 3;
    widows: 3;
  }
  
  h2, h3 {
    page-break-after: avoid;
  }
}
</style>
