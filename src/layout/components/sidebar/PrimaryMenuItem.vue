<template>
  <div
    class="primary-menu-item"
    :class="{
      'is-active': isActive,
      'has-submenu': hasSubmenu
    }"
    @click="$emit('click', menu)"
  >
    <t-icon :name="menu.icon" size="22px" />
    <span class="menu-label">{{ menu.label }}</span>
    <div v-if="menu.badge" class="menu-badge">{{ menu.badge }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  menu: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const hasSubmenu = computed(() => {
  return props.menu.children && props.menu.children.length > 0
})
</script>

<style scoped lang="scss">
.primary-menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  margin: 4px 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.is-active {
    background: rgba(255, 255, 255, 0.15);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: #ffffff;
      border-radius: 0 2px 2px 0;
    }
  }

  .t-icon {
    color: rgba(255, 255, 255, 0.9);
    transition: transform 0.3s;
  }

  .menu-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.85);
    text-align: center;
    line-height: 1.2;
    transition: color 0.3s;
  }

  .menu-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    background: #e34d59;
    color: #ffffff;
    font-size: 11px;
    font-weight: 600;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover .t-icon {
    transform: scale(1.1);
  }

  &.is-active .menu-label {
    color: #ffffff;
    font-weight: 600;
  }
}
</style>
