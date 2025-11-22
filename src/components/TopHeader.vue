<template>
  <div class="top-header">
    <div class="header-content">
      <AppLogo :clickable="true" :to="logoRoute" />

      <div v-if="showActions" class="header-actions">
        <slot name="actions"></slot>
      </div>

      <!-- 右侧按钮 -->
      <div v-if="!isLoggedIn" class="header-right">
        <t-button theme="primary" variant="text" @click="goToHome" class="home-button">
          <template #icon>
            <t-icon name="home" />
          </template>
          返回首页
        </t-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLogo from './AppLogo.vue'

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

// Logo 点击跳转路由
const logoRoute = computed(() => {
  return props.isLoggedIn ? '/home' : '/'
})

// 返回首页
const goToHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.top-header {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  z-index: 100;

  .header-content {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;

    .home-button {
      font-size: 14px;
      font-weight: 500;
      height: 40px;
      padding: 0 20px;
      border-radius: 20px;
      transition: all 0.3s ease;
      background: rgba(0, 82, 217, 0.08);

      &:hover {
        background: rgba(0, 82, 217, 0.15);
        transform: translateY(-1px);
      }

      :deep(.t-icon) {
        font-size: 16px;
      }
    }
  }
}
</style>
