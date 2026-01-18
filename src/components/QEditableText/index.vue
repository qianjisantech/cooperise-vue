<template>
  <div
    class="editable-text-wrapper"
    @mouseenter="showEditIcon = true"
    @mouseleave="showEditIcon = false"
  >
    <!-- 显示模式 -->
    <div v-if="!isEditing" class="editable-text-display">
      <span class="text-content">
        <!-- 使用插槽自定义显示内容 -->
        <slot name="display" :value="modelValue">
          {{ modelValue || placeholder }}
        </slot>
      </span>
      <svg
        v-show="showEditIcon"
        class="edit-icon"
        @click="startEdit"
        viewBox="0 0 1024 1024"
        fill="currentColor"
      >
        <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9c3.9-3.9 3.9-10.2 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2c-1.9 11.1 1.5 21.9 9.4 29.8 6.6 6.4 14.9 9.9 23.8 9.9z m67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"/>
      </svg>
    </div>

    <!-- 编辑模式 -->
    <div v-else class="editable-text-input">
      <div class="input-container">
        <!-- 使用插槽自定义编辑组件，如果没有提供则使用默认的 input -->
        <slot name="edit" :value="localValue" :update-value="updateLocalValue">
          <input
            ref="inputRef"
            v-model="localValue"
            type="text"
            :placeholder="placeholder"
            @keyup.enter="finishEdit"
            @keyup.esc="cancelEdit"
          />
        </slot>
        <div class="action-buttons">
          <svg
            class="action-icon confirm-icon"
            @mousedown.prevent
            @click="finishEdit"
            viewBox="0 0 1024 1024"
            fill="currentColor"
          >
            <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474c-6.1-7.7-15.3-12.2-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1 0.4-12.8-6.3-12.8z"/>
          </svg>
          <svg
            class="action-icon cancel-icon"
            @mousedown.prevent
            @click="cancelEdit"
            viewBox="0 0 1024 1024"
            fill="currentColor"
          >
            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9c-4.4 5.2-.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, getCurrentInstance } from 'vue'

// 模块级别的变量，跟踪当前正在编辑的实例
let currentEditingInstance = null

defineOptions({
  name: 'q-editable-text'
})

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '点击编辑'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const showEditIcon = ref(false)
const isEditing = ref(false)
const localValue = ref(props.modelValue)
const inputRef = ref(null)
const instance = getCurrentInstance()

const updateLocalValue = (newValue) => {
  localValue.value = newValue
}

const startEdit = async () => {
  // 如果有其他实例正在编辑，取消它的编辑状态
  if (currentEditingInstance && currentEditingInstance !== instance) {
    currentEditingInstance.cancelEdit?.()
  }

  // 设置当前实例为正在编辑
  currentEditingInstance = instance

  isEditing.value = true
  localValue.value = props.modelValue
  await nextTick()
  inputRef.value?.focus()
}

const finishEdit = () => {
  isEditing.value = false
  const newValue = localValue.value
  emit('update:modelValue', newValue)
  emit('confirm', newValue)

  // 清除当前编辑实例
  if (currentEditingInstance === instance) {
    currentEditingInstance = null
  }
}

const cancelEdit = () => {
  isEditing.value = false
  localValue.value = props.modelValue

  // 清除当前编辑实例
  if (currentEditingInstance === instance) {
    currentEditingInstance = null
  }
}

// 暴露 cancelEdit 方法供其他实例调用
instance.cancelEdit = cancelEdit
</script>

<style scoped>
.editable-text-wrapper {
  display: inline-block;
  min-width: 120px;
}

.editable-text-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
}

.editable-text-display:hover {
  background-color: #f0f0f0;
  border-color: #e0e0e0;
}

.text-content {
  font-size: 14px;
  color: #303133;
  flex: 1;
}

.edit-icon {
  width: 16px;
  height: 16px;
  color: #909399;
  cursor: pointer;
  transition: color 0.2s;
}

.edit-icon:hover {
  color: #409eff;
}

.editable-text-input {
  display: inline-block;
  width: 100%;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.editable-text-input input {
  flex: 1;
  padding: 6px 12px;
  font-size: 14px;
  color: #303133;
  border: 1px solid #409eff;
  border-radius: 3px;
  outline: none;
  transition: all 0.2s;
}

.editable-text-input input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.action-buttons {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
}

.action-icon {
  width: 18px;
  height: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-icon {
  color: #67c23a;
}

.confirm-icon:hover {
  color: #85ce61;
}

.cancel-icon {
  color: #f56c6c;
}

.cancel-icon:hover {
  color: #f78989;
}
</style>
