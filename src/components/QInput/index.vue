<template>
  <div class="qianji-input-wrapper">
    <label v-if="label" class="qianji-input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <div class="qianji-input-container" :class="{ 'is-focused': isFocused, 'is-error': error }">
      <input
        ref="inputRef"
        class="qianji-input"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      />
      <span v-if="clearable && modelValue && !disabled" class="clear-icon" @click="handleClear">
        ×
      </span>
    </div>
    <div v-if="error" class="qianji-input-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'q-input'
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
    default: '请输入'
  },
  type: {
    type: String,
    default: 'text'
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
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])

const isFocused = ref(false)
const inputRef = ref(null)

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}

const handleFocus = (e) => {
  isFocused.value = true
  emit('focus', e)
}

const handleBlur = (e) => {
  isFocused.value = false
  emit('blur', e)
}

const handleChange = (e) => {
  emit('change', e.target.value)
}

const handleClear = () => {
  emit('update:modelValue', '')
  inputRef.value?.focus()
}
</script>

<style scoped>
.qianji-input-wrapper {
  width: 100%;
}

.qianji-input-label {
  display: block;
  font-size: 10px;
  font-weight: 500;
  color: #101111;
}

.required-mark {
  color: #de350b;
  margin-left: 2px;
}

.qianji-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1.5px solid #dfe1e6;
  border-radius: 1px;
  transition: all 0.2s ease;
}

.qianji-input-container:hover {
  background-color: #fff;
}

.qianji-input-container.is-focused {
  background-color: #fff;
  border-color: #dfe1e6;
}

.qianji-input-container.is-error {
  border-color: #de350b;
}

.qianji-input {
  flex: 1;
  width: 100%;
  padding: 2px 2px;
  font-size: 14px;
  line-height: 1.5;
  color: #172b4d;
  background-color: transparent;
  border: none;
  outline: none;
}

.qianji-input::placeholder {
  color: #8993a4;
}

.qianji-input:disabled {
  cursor: not-allowed;
  color: #8993a4;
}

.clear-icon {
  position: absolute;
  right: 8px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #8993a4;
  cursor: pointer;
  user-select: none;
}

.clear-icon:hover {
  color: #42526e;
}

.qianji-input-error {
  margin-top: 4px;
  font-size: 12px;
  color: #de350b;
}
</style>
