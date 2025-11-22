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

const userStore = useUserStore()

// 应用启动时，如果已登录则加载权限数据
onMounted(async () => {
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
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  width: 100%;
  min-height: 100vh;
}

/* 全局设置弹窗蒙层样式 - 统一设置为浅灰色半透明 */
.t-drawer__mask,
.t-dialog__mask,
.t-popup__mask,
.t-modal__mask {
  background-color: rgba(0, 0, 0, 0.3) !important;
}
</style>
