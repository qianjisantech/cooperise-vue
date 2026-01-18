<template>
  <button
    class="q-button"
    :class="[
      `q-button--${type}`,
      `q-button--${size}`,
      {
        'is-disabled': disabled,
        'is-loading': loading
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="q-button__loading">
      <svg class="q-button__loading-icon" viewBox="0 0 16 16" width="14" height="14">
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
        <path d="M8 2 A6 6 0 0 1 14 8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 8 8"
            to="360 8 8"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </span>
    <slot></slot>
  </button>
</template>

<script setup>
defineOptions({
  name: 'QButton'
})

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.q-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 16px;
  font-size: 13px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background-color: #e9f5fe;
  color: #303133;
  outline: none;
  white-space: nowrap;
  user-select: none;
}

.q-button:hover {
  background-color: #d4ebfd;
}

.q-button:active {
  background-color: #c0e0fc;
}

.q-button:focus {
  outline: none;
}

/* 类型样式 */
.q-button--primary {
  background-color: #0052D9;
  color: #ffffff;
}

.q-button--primary:hover {
  background-color: #0042AD;
}

.q-button--primary:active {
  background-color: #003580;
}

.q-button--success {
  background-color: #52C41A;
  color: #ffffff;
}

.q-button--success:hover {
  background-color: #3FA116;
}

.q-button--success:active {
  background-color: #2F7E12;
}

.q-button--warning {
  background-color: #FA9550;
  color: #ffffff;
}

.q-button--warning:hover {
  background-color: #E87A2F;
}

.q-button--warning:active {
  background-color: #D6621A;
}

.q-button--danger {
  background-color: #F5222D;
  color: #ffffff;
}

.q-button--danger:hover {
  background-color: #D91F29;
}

.q-button--danger:active {
  background-color: #B01B24;
}

/* 尺寸样式 */
.q-button--small {
  padding: 4px 12px;
  font-size: 12px;
}

.q-button--medium {
  padding: 6px 16px;
  font-size: 13px;
}

.q-button--large {
  padding: 8px 20px;
  font-size: 14px;
}

/* 禁用状态 */
.q-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.q-button.is-disabled:hover {
  background-color: #e9f5fe;
}

.q-button--primary.is-disabled:hover {
  background-color: #0052D9;
}

.q-button--success.is-disabled:hover {
  background-color: #52C41A;
}

.q-button--warning.is-disabled:hover {
  background-color: #FA9550;
}

.q-button--danger.is-disabled:hover {
  background-color: #F5222D;
}

/* 加载状态 */
.q-button.is-loading {
  cursor: not-allowed;
  opacity: 0.8;
}

.q-button__loading {
  display: inline-flex;
  align-items: center;
}

.q-button__loading-icon {
  display: block;
}
</style>
