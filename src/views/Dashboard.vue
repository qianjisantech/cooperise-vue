<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>需求管理平台</h1>
      <t-button theme="primary" @click="handleLogout">退出登录</t-button>
    </div>
    <div class="dashboard-content">
      <t-card title="欢迎使用" style="margin: 20px;">
        <p>您已成功登录需求管理平台！</p>
        <p style="margin-top: 10px;">该平台提供完整的数字化协作解决方案，帮助团队高效协作。</p>
      </t-card>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { MessagePlugin } from 'tdesign-vue-next'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = async () => {
  try {
    // 调用 store 的 logout 方法（会调用后端接口并清除前端信息）
    await userStore.logout()
    await MessagePlugin.success('已退出登录')
    // 跳转到登录页
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
    await MessagePlugin.error('退出登录失败，请重试')
  }
}
</script>

<style scoped lang="scss">
.dashboard-container {
  min-height: 100vh;
  background: #f5f5f5;

  .dashboard-header {
    background: #fff;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    h1 {
      font-size: 20px;
      font-weight: 600;
      color: #000;
      margin: 0;
    }
  }

  .dashboard-content {
    padding: 24px;
  }
}
</style>
