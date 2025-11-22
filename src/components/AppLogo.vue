<template>
  <div class="app-logo" :class="{ clickable: clickable }" @click="handleClick">
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 背景圆角矩形 -->
      <rect width="48" height="48" rx="12" fill="url(#logo-gradient)"/>

      <!-- 主图形 - 组合了 D 字母和文档/项目的抽象图形 -->
      <!-- D 字母的左侧竖线 -->
      <path d="M14 12 L14 36" stroke="white" stroke-width="3" stroke-linecap="round"/>

      <!-- D 字母的弧形部分 + 文档层叠效果 -->
      <path d="M14 12 C14 12, 28 12, 28 24 C28 36, 14 36, 14 36"
            stroke="white"
            stroke-width="3"
            stroke-linecap="round"
            fill="none"/>

      <!-- 内部装饰 - 代表任务/事项的小元素 -->
      <!-- 第一个点 -->
      <circle cx="20" cy="18" r="1.5" fill="white" opacity="0.9"/>
      <line x1="23" y1="18" x2="30" y2="18" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>

      <!-- 第二个点 -->
      <circle cx="20" cy="24" r="1.5" fill="white" opacity="0.9"/>
      <line x1="23" y1="24" x2="28" y2="24" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>

      <!-- 第三个点 -->
      <circle cx="20" cy="30" r="1.5" fill="white" opacity="0.9"/>
      <line x1="23" y1="30" x2="30" y2="30" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>

      <!-- 右上角小装饰 - 代表完成的对勾 -->
      <path d="M33 14 L35 16 L39 11"
            stroke="#4CAF50"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
            opacity="0.95"/>

      <!-- 渐变定义 -->
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0052D9"/>
          <stop offset="50%" stop-color="#0066FF"/>
          <stop offset="100%" stop-color="#0080FF"/>
        </linearGradient>
      </defs>
    </svg>
    <span class="logo-text">Diego</span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  clickable: {
    type: Boolean,
    default: false
  },
  to: {
    type: String,
    default: '/home'
  }
})

const router = useRouter()

const handleClick = () => {
  if (props.clickable) {
    router.push(props.to)
  }
}
</script>

<style scoped lang="scss">
.app-logo {
  display: flex;
  align-items: center;
  gap: 12px;

  &.clickable {
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);

      svg {
        filter: drop-shadow(0 4px 8px rgba(0, 82, 217, 0.3));
      }

      .logo-text {
        color: #0052D9;
      }
    }
  }

  svg {
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .logo-text {
    font-size: 20px;
    font-weight: 700;
    color: #1f2329;
    white-space: nowrap;
    transition: color 0.3s ease;
    letter-spacing: 0.5px;
  }
}
</style>
