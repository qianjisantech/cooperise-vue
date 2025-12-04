// MUST BE FIRST - Polyfill for @stomp/stompjs
import './polyfill'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import App from './App.vue'
import router from './router'
import permission from './directives/permission'
import { initApp } from './utils/initApp'
import tracking, { setupTrackingRouter, setupTrackingClick } from './utils/tracking'

// 初始化应用并启动
;(async () => {
  // 初始化 IndexedDB 并迁移数据
  await initApp()

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  app.use(TDesign)

  // 注册全局权限指令
  app.directive('permission', permission)

  // 初始化埋点SDK
  setupTrackingRouter(router)
  setupTrackingClick()

  // 将tracking实例挂载到全局
  app.config.globalProperties.$tracking = tracking

  app.mount('#app')
  
  // 应用初始化完成后隐藏加载动画
  setTimeout(() => {
    const loadingOverlay = document.getElementById('loading-overlay')
    if (loadingOverlay) {
      loadingOverlay.classList.add('fade-out')
      // 动画完成后移除元素
      setTimeout(() => {
        loadingOverlay.remove()
      }, 500)
    }
  }, 100)
})()
