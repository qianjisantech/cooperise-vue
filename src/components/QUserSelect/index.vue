<template>
  <div class="qianji-user-select-wrapper">
    <label v-if="label" class="qianji-user-select-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <div
      ref="selectRef"
      class="qianji-user-select-container"
      :class="{ 'is-focused': isOpen, 'is-error': error, 'is-disabled': disabled }"
      @click="toggleDropdown"
    >
      <div class="qianji-user-select-input">
        <div v-if="selectedUsers.length > 0" class="selected-users">
          <div
            v-for="user in selectedUsers"
            :key="user[valueKey]"
            class="user-tag"
          >
            <div class="user-avatar" :style="{ backgroundColor: user.color || '#4A7BA7' }">
              {{ user[nameKey]?.charAt(0)?.toUpperCase() }}
            </div>
            <span class="user-name">{{ user[nameKey] }}</span>
            <span
              v-if="multiple && !disabled"
              class="remove-icon"
              @click.stop="removeUser(user)"
            >
              ×
            </span>
          </div>
        </div>
        <span v-else class="placeholder-text">{{ placeholder }}</span>
      </div>
      <span class="arrow-icon" :class="{ 'is-open': isOpen }">▼</span>
    </div>

    <Teleport to="body">
      <div
        v-show="isOpen"
        ref="dropdownRef"
        class="qianji-user-select-dropdown"
        :style="dropdownStyle"
      >
        <div class="search-box">
          <input
            ref="searchInputRef"
            v-model="searchText"
            type="text"
            class="search-input"
            placeholder="搜索用户..."
            @click.stop
          />
        </div>
        <div class="users-list">
          <div
            v-for="user in filteredUsers"
            :key="user[valueKey]"
            class="user-item"
            :class="{ 'is-selected': isUserSelected(user) }"
            @click.stop="selectUser(user)"
          >
            <div class="user-avatar" :style="{ backgroundColor: user.color || '#4A7BA7' }">
              {{ user[nameKey]?.charAt(0)?.toUpperCase() }}
            </div>
            <div class="user-info">
              <div class="user-name">{{ user[nameKey] }}</div>
              <div v-if="user.email" class="user-email">{{ user.email }}</div>
            </div>
            <span v-if="isUserSelected(user)" class="check-icon">✓</span>
          </div>
          <div v-if="filteredUsers.length === 0" class="no-data">
            暂无用户
          </div>
        </div>
      </div>
    </Teleport>

    <div v-if="error" class="qianji-user-select-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'

defineOptions({
  name: 'q-user-select'
})

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择人员'
  },
  values: {
    type: Array,
    default: () => []
  },
  nameKey: {
    type: String,
    default: 'name'
  },
  valueKey: {
    type: String,
    default: 'id'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
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

const selectedUsers = computed(() => {
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? props.modelValue : []
    return props.values.filter(user => values.includes(user[props.valueKey]))
  } else {
    const user = props.values.find(u => u[props.valueKey] === props.modelValue)
    return user ? [user] : []
  }
})

const filteredUsers = computed(() => {
  if (!searchText.value) {
    return props.values
  }
  const search = searchText.value.toLowerCase()
  return props.values.filter(user =>
    user[props.nameKey].toLowerCase().includes(search) ||
    (user.email && user.email.toLowerCase().includes(search))
  )
})

const isUserSelected = (user) => {
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? props.modelValue : []
    return values.includes(user[props.valueKey])
  }
  return props.modelValue === user[props.valueKey]
}

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      updateDropdownPosition()
      if (searchInputRef.value) {
        searchInputRef.value.focus()
      }
    })
  } else {
    searchText.value = ''
  }
}

const selectUser = (user) => {
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = values.indexOf(user[props.valueKey])
    if (index > -1) {
      values.splice(index, 1)
    } else {
      values.push(user[props.valueKey])
    }
    emit('update:modelValue', values)
    emit('change', values)
  } else {
    emit('update:modelValue', user[props.valueKey])
    emit('change', user[props.valueKey])
    isOpen.value = false
    searchText.value = ''
  }
}

const removeUser = (user) => {
  if (!props.multiple) return
  const values = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const index = values.indexOf(user[props.valueKey])
  if (index > -1) {
    values.splice(index, 1)
    emit('update:modelValue', values)
    emit('change', values)
  }
}

const updateDropdownPosition = () => {
  if (!selectRef.value || !dropdownRef.value) return

  const rect = selectRef.value.getBoundingClientRect()
  const dropdownHeight = dropdownRef.value.offsetHeight || 300
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
.qianji-user-select-wrapper {
  width: 100%;
  margin-bottom: 16px;
}

.qianji-user-select-label {
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

.qianji-user-select-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 30px;
  padding: 3px 12px;
  background-color: #fff;
  border: 2px solid #dfe1e6;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.qianji-user-select-container:hover {
  background-color: #fff;
}

.qianji-user-select-container.is-focused {
  background-color: #fff;
  border-color: #dfe1e6;
}

.qianji-user-select-container.is-error {
  border-color: #de350b;
}

.qianji-user-select-container.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.qianji-user-select-input {
  flex: 1;
  min-height: 26px;
  display: flex;
  align-items: center;
}

.selected-users {
  display: flex;
  flex-wrap: wrap;
}

.user-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background-color: #ebecf0;
  border-radius: 3px;
  font-size: 13px;
}

.user-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.user-name {
  color: #172b4d;
}

.remove-icon {
  margin-left: 2px;
  font-size: 18px;
  color: #42526e;
  cursor: pointer;
  line-height: 1;
}

.remove-icon:hover {
  color: #172b4d;
}

.placeholder-text {
  color: #8993a4;
  font-size: 14px;
}

.arrow-icon {
  margin-left: 8px;
  font-size: 10px;
  color: #42526e;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.arrow-icon.is-open {
  transform: rotate(180deg);
}

.qianji-user-select-dropdown {
  background-color: #fff;
  border: 1px solid #dfe1e6;
  border-radius: 3px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 400px;
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

.users-list {
  overflow-y: auto;
  max-height: 350px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.user-item:hover {
  background-color: #ebecf0;
}

.user-item.is-selected {
  background-color: #f0f0f0;
}

.user-item .user-avatar {
  width: 32px;
  height: 32px;
  font-size: 14px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-info .user-name {
  font-size: 14px;
  font-weight: 500;
  color: #172b4d;
}

.user-email {
  font-size: 12px;
  color: #6b778c;
  margin-top: 2px;
}

.check-icon {
  color: #4A7BA7;
  font-size: 16px;
  font-weight: bold;
}

.no-data {
  padding: 16px;
  text-align: center;
  color: #8993a4;
  font-size: 14px;
}

.qianji-user-select-error {
  margin-top: 4px;
  font-size: 12px;
  color: #de350b;
}
</style>
