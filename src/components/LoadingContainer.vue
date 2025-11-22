<template>
  <div class="loading-container" :class="{ 'loading-container--full-height': fullHeight }">
    <slot></slot>
    <div v-if="loading" class="loading-overlay">
      <t-loading :loading="true" :text="loadingText" size="large" />
    </div>
  </div>
</template>

<script setup>
/**
 * LoadingContainer - 组件级 Loading 容器
 *
 * 用于包裹需要显示 loading 的内容区域，只在当前区域显示 loading 遮罩
 *
 * @example
 * <LoadingContainer :loading="loading" loading-text="正在加载数据...">
 *   <div>your content here</div>
 * </LoadingContainer>
 *
 * @example
 * // 配合 useLoading 使用
 * const loadingState = useLoading()
 * <LoadingContainer :loading="loadingState.loading" :loading-text="loadingState.loadingText">
 *   <div>your content here</div>
 * </LoadingContainer>
 */
defineProps({
  /**
   * loading 状态
   */
  loading: {
    type: Boolean,
    default: false
  },
  /**
   * loading 提示文本
   */
  loadingText: {
    type: String,
    default: '正在加载中，请稍等...'
  },
  /**
   * 是否占满容器高度
   */
  fullHeight: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.loading-container {
  position: relative;
  min-height: 100px;
}

.loading-container--full-height {
  height: 100%;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(2px);
  z-index: 1000;
  border-radius: inherit;
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .loading-overlay {
    background: rgba(0, 0, 0, 0.7);
  }
}
</style>
