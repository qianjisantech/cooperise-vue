<template>
  <div class="qianji-search-wrapper">
    <label v-if="label" class="qianji-search-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <div
      ref="searchRef"
      class="qianji-search-container"
      :class="{ 'is-focused': isFocused, 'is-error': error }"
    >
      <svg class="search-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path d="M945.066667 898.133333l-189.866667-189.866666c55.466667-64 87.466667-149.333333 87.466667-241.066667 0-204.8-168.533333-373.333333-373.333334-373.333333S96 264.533333 96 469.333333 264.533333 842.666667 469.333333 842.666667c91.733333 0 174.933333-34.133333 241.066667-87.466667l189.866667 189.866667c6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333c8.533333-12.8 8.533333-34.133333-2.133333-46.933334zM469.333333 778.666667C298.666667 778.666667 160 640 160 469.333333S298.666667 160 469.333333 160 778.666667 298.666667 778.666667 469.333333 640 778.666667 469.333333 778.666667z"/>
      </svg>
      <input
        ref="inputRef"
        class="qianji-search-input"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="handleSearch"
      />
      <span
        v-if="modelValue && clearable && !disabled"
        class="clear-icon"
        @click="handleClear"
      >
      </span>

    </div>

    <Teleport to="body">
      <div
        v-show="isFocused && showDropdown"
        ref="dropdownRef"
        class="qianji-search-dropdown"
        :style="dropdownStyle"
      >
        <div v-if="suggestions.length > 0" class="suggestions-list">
          <div
            v-for="(item, index) in suggestions"
            :key="index"
            class="suggestion-item"
            @mousedown.prevent="selectSuggestion(item)"
          >
            <div class="suggestion-type-icon" :style="{ backgroundColor: item.iconColor || '#4A7BA7' }">
              {{ item.icon || '📋' }}
            </div>
            <div class="suggestion-content">
              <div class="suggestion-title">{{ item.title || item.name || item }}</div>
              <div v-if="item.code" class="suggestion-code">{{ item.code }}</div>
            </div>
          </div>
        </div>
        <div v-else class="no-suggestions">
          暂无搜索建议
        </div>
      </div>
    </Teleport>

    <div v-if="error" class="qianji-search-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

defineOptions({
  name: 'q-search'
})

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  showSearchButton: {
    type: Boolean,
    default: false
  },
  showDropdown: {
    type: Boolean,
    default: true
  },
  suggestions: {
    type: Array,
    default: () => []
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'focus', 'blur', 'clear', 'select'])

const isFocused = ref(false)
const inputRef = ref(null)
const searchRef = ref(null)
const dropdownRef = ref(null)
const dropdownStyle = ref({})

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}

const handleFocus = (e) => {
  isFocused.value = true
  emit('focus', e)
  nextTick(() => {
    updateDropdownPosition()
  })
}

const handleBlur = (e) => {
  isFocused.value = false
  emit('blur', e)
}

const handleSearch = () => {
  emit('search', props.modelValue)
  isFocused.value = false
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

const selectSuggestion = (item) => {
  // 如果 item 是对象，提取 title 或 name 属性；否则直接使用 item
  const value = typeof item === 'object' ? (item.title || item.name || item) : item
  emit('update:modelValue', value)
  emit('select', item)
  isFocused.value = false
}

const updateDropdownPosition = () => {
  if (!searchRef.value || !dropdownRef.value) return

  const rect = searchRef.value.getBoundingClientRect()

  dropdownStyle.value = {
    position: 'absolute',
    top: `${rect.bottom + window.scrollY + 4}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${rect.width}px`,
    zIndex: 10001
  }
}

watch(isFocused, (val) => {
  if (val) {
    window.addEventListener('scroll', updateDropdownPosition, true)
    window.addEventListener('resize', updateDropdownPosition)
  } else {
    window.removeEventListener('scroll', updateDropdownPosition, true)
    window.removeEventListener('resize', updateDropdownPosition)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateDropdownPosition, true)
  window.removeEventListener('resize', updateDropdownPosition)
})
</script>

<style scoped>
.qianji-search-wrapper {
  width: 100%;
  margin-bottom: 16px;
}

.qianji-search-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #42526e;
}

.required-mark {
  color: #de350b;
  margin-left: 2px;
}

.qianji-search-container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 2px solid #dfe1e6;
  border-radius: 3px;
  transition: all 0.2s ease;
  gap: 8px;
  padding: 0 12px;
}

.qianji-search-container:hover {
  background-color: #fff;
}

.qianji-search-container.is-focused {
  background-color: #fff;
  border-color: #dfe1e6;
}

.qianji-search-container.is-error {
  border-color: #de350b;
}

.search-icon {
  width: 16px;
  height: 16px;
  fill: #909399;
  flex-shrink: 0;
  transition: fill 0.2s ease;
}

.qianji-search-container.is-focused .search-icon {
  fill: #909399;
}

.qianji-search-input {
  flex: 1;
  width: 100%;
  padding: 6px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #172b4d;
  background-color: transparent;
  border: none;
  outline: none;
}

.qianji-search-input::placeholder {
  color: #8993a4;
}

.qianji-search-input:disabled {
  cursor: not-allowed;
  color: #8993a4;
}

.clear-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #8993a4;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.clear-icon:hover {
  color: #42526e;
}

.search-button {
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background-color: #4A7BA7;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
  margin: 4px 0;
}

.search-button:hover:not(:disabled) {
  background-color: #3a6a94;
}

.search-button:active:not(:disabled) {
  background-color: #2f5a80;
}

.search-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.qianji-search-error {
  margin-top: 4px;
  font-size: 12px;
  color: #de350b;
}

.qianji-search-dropdown {
  background-color: #fff;
  border: 1px solid #dfe1e6;
  border-radius: 3px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 10001;
}

.suggestions-list {
  padding: 4px 0;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f5f7fa;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background-color: #f5f7fa;
}

.suggestion-type-icon {
  width: 18px;
  height: 18px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  flex-shrink: 0;
}

.suggestion-content {
  flex: 1;
  min-width: 0;
}

.suggestion-title {
  font-size: 13px;
  color: #303133;
  font-weight: 400;
  line-height: 1.4;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suggestion-code {
  font-size: 11px;
  color: #909399;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-suggestions {
  padding: 16px;
  text-align: center;
  font-size: 14px;
  color: #909399;
}
</style>
