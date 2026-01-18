<template>
  <div class="qianji-select-wrapper">
    <label v-if="label" class="qianji-select-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <div
      ref="selectRef"
      class="qianji-select-container"
      :class="{ 'is-focused': isOpen, 'is-error': error, 'is-disabled': disabled }"
      @click="toggleDropdown"
    >
      <div class="qianji-select-input">
        <span v-if="selectedLabel" class="selected-text">{{ selectedLabel }}</span>
        <span v-else class="placeholder-text">{{ placeholder }}</span>
      </div>
      <span class="arrow-icon" :class="{ 'is-open': isOpen }">▼</span>
    </div>

    <Teleport to="body">
      <div
        v-show="isOpen"
        ref="dropdownRef"
        class="qianji-select-dropdown"
        :style="dropdownStyle"
      >
        <div v-if="filterable" class="search-box">
          <input
            ref="searchInputRef"
            v-model="searchText"
            type="text"
            class="search-input"
            placeholder="搜索..."
            @click.stop
          />
        </div>
        <div class="options-list">
          <div
            v-for="option in filteredOptions"
            :key="option[valueKey]"
            class="option-item"
            :class="{ 'is-selected': option[valueKey] === modelValue }"
            @click.stop="selectOption(option)"
          >
            {{ option[labelKey] }}
          </div>
          <div v-if="filteredOptions.length === 0" class="no-data">
            暂无数据
          </div>
        </div>
      </div>
    </Teleport>

    <div v-if="error" class="qianji-select-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

defineOptions({
  name: 'q-select'
})

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  options: {
    type: Array,
    default: () => []
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  filterable: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const searchText = ref('')
const selectRef = ref(null)
const dropdownRef = ref(null)
const searchInputRef = ref(null)
const dropdownStyle = ref({})

// 标准化选项格式：将字符串数组转换为对象数组
const normalizedOptions = computed(() => {
  return props.options.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { [props.labelKey]: opt, [props.valueKey]: opt }
    }
    return opt
  })
})

const selectedLabel = computed(() => {
  const selected = normalizedOptions.value.find(opt => opt[props.valueKey] === props.modelValue)
  return selected ? selected[props.labelKey] : ''
})

const filteredOptions = computed(() => {
  if (!props.filterable || !searchText.value) {
    return normalizedOptions.value
  }
  return normalizedOptions.value.filter(opt =>
    String(opt[props.labelKey]).toLowerCase().includes(searchText.value.toLowerCase())
  )
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      updateDropdownPosition()
      if (props.filterable && searchInputRef.value) {
        searchInputRef.value.focus()
      }
    })
  } else {
    searchText.value = ''
  }
}

const selectOption = (option) => {
  emit('update:modelValue', option[props.valueKey])
  emit('change', option[props.valueKey])
  isOpen.value = false
  searchText.value = ''
}

const updateDropdownPosition = () => {
  if (!selectRef.value || !dropdownRef.value) return

  const rect = selectRef.value.getBoundingClientRect()
  const dropdownHeight = dropdownRef.value.offsetHeight || 200
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top

  let top = rect.bottom + window.scrollY

  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    top = rect.top + window.scrollY - dropdownHeight
  }

  dropdownStyle.value = {
    position: 'absolute',
    top: `${top}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${rect.width}px`,
    zIndex: 10001
  }
}

const handleClickOutside = (e) => {
  if (selectRef.value && !selectRef.value.contains(e.target) &&
      dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
    searchText.value = ''
  }
}

watch(isOpen, (val) => {
  if (val) {
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('scroll', updateDropdownPosition, true)
    window.addEventListener('resize', updateDropdownPosition)
  } else {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('scroll', updateDropdownPosition, true)
    window.removeEventListener('resize', updateDropdownPosition)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', updateDropdownPosition, true)
  window.removeEventListener('resize', updateDropdownPosition)
})
</script>

<style scoped>
.qianji-select-wrapper {
  width: 100%;
  margin-bottom: 16px;
}

.qianji-select-label {
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

.qianji-select-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background-color: #fff;
  border: 2px solid #dfe1e6;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.qianji-select-container:hover {
  background-color: #fff;
}

.qianji-select-container.is-focused {
  background-color: #fff;
  border-color: #dfe1e6;
}

.qianji-select-container.is-error {
  border-color: #de350b;
}

.qianji-select-container.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.qianji-select-input {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
}

.selected-text {
  color: #172b4d;
}

.placeholder-text {
  color: #8993a4;
}

.arrow-icon {
  margin-left: 8px;
  font-size: 10px;
  color: #42526e;
  transition: transform 0.2s ease;
}

.arrow-icon.is-open {
  transform: rotate(180deg);
}

.qianji-select-dropdown {
  background-color: #fff;
  border: 1px solid #dfe1e6;
  border-radius: 3px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 10001;
}

.search-box {
  padding: 8px;
  border-bottom: 1px solid #dfe1e6;
}

.search-input {
  width: 100%;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #dfe1e6;
  border-radius: 3px;
  outline: none;
}

.search-input:focus {
  border-color: #4A7BA7;
}

.options-list {
  overflow-y: auto;
  max-height: 250px;
}

.option-item {
  padding: 8px 12px;
  font-size: 14px;
  color: #172b4d;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.option-item:hover {
  background-color: #ebecf0;
}

.option-item.is-selected {
  background-color: #f0f0f0;
  color: #172b4d;
}

.no-data {
  padding: 16px;
  text-align: center;
  color: #8993a4;
  font-size: 14px;
}

.qianji-select-error {
  margin-top: 4px;
  font-size: 12px;
  color: #de350b;
}
</style>
