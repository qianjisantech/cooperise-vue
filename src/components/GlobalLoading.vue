<template>
  <transition name="loading-fade">
    <div v-if="loadingStore.isLoading" class="global-loading-overlay">
      <div class="global-loading-content">
        <div class="loading-spinner">
          <t-loading size="large" :loading="true" />
        </div>
        <div class="loading-text">{{ loadingStore.loadingText }}</div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useLoadingStore } from '@/store/loading'
import { computed, onMounted, onUnmounted } from 'vue'

const loadingStore = useLoadingStore()

// 动态计算侧边栏宽度
const updateOverlayPosition = () => {
  const sidebar = document.querySelector('.sidebar-container')
  const overlay = document.querySelector('.global-loading-overlay')

  if (sidebar && overlay) {
    const sidebarWidth = sidebar.offsetWidth
    overlay.style.left = `${sidebarWidth}px`
  }
}

// 监听侧边栏宽度变化
let resizeObserver = null

onMounted(() => {
  // 初始化位置
  updateOverlayPosition()

  // 监听侧边栏宽度变化
  const sidebar = document.querySelector('.sidebar-container')
  if (sidebar) {
    resizeObserver = new ResizeObserver(() => {
      updateOverlayPosition()
    })
    resizeObserver.observe(sidebar)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style scoped lang="scss">
.global-loading-overlay {
  position: fixed;
  top: 64px; // 从Header下方开始
  left: 80px; // 初始值，会被JS动态更新
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999; // 降低层级，确保不遮挡Header和侧边栏
  transition: left 0.28s cubic-bezier(0.4, 0, 0.2, 1); // 与侧边栏动画同步

  .global-loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    animation: float 2s ease-in-out infinite;

    .loading-spinner {
      :deep(.t-loading) {
        color: #0052d9;
      }

      :deep(.t-loading__gradient) {
        stop:first-child {
          stop-color: #0052d9;
        }
        stop:last-child {
          stop-color: #0052d9;
          stop-opacity: 0.3;
        }
      }
    }

    .loading-text {
      font-size: 14px;
      color: #4e5969;
      font-weight: 400;
      letter-spacing: 0.3px;
      line-height: 22px;
    }
  }
}

// 浮动动画
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

// 淡入淡出动画
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.25s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
</style>
