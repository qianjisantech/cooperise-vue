<template>
  <div class="q-collapse">
    <div class="collapse-header" @click="toggle">
      <svg
        class="collapse-icon"
        :class="{ 'is-open': isOpen }"
        viewBox="0 0 16 16"
        width="16"
        height="16"
      >
        <path d="M5 6l3 3 3-3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="collapse-title">{{ title }}</span>
      <div v-if="$slots.extra" class="collapse-extra">
        <slot name="extra"></slot>
      </div>
    </div>
    <div v-show="isOpen" class="collapse-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  defaultOpen: {
    type: Boolean,
    default: true
  }
})

const isOpen = ref(props.defaultOpen)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.q-collapse {
  border-bottom: 1px solid #e7e7e7;
}

.collapse-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.collapse-header:hover {
  background-color: #f5f7fa;
}

.collapse-icon {
  flex-shrink: 0;
  color: #606266;
  transition: transform 0.3s;
  transform: rotate(-90deg);
}

.collapse-icon.is-open {
  transform: rotate(0deg);
}

.collapse-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  flex: 1;
}

.collapse-extra {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.collapse-content {
  padding: 0;
}
</style>
