<template>
  <div class="qianji-tag-input-wrapper">
    <label v-if="label" class="qianji-tag-input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <div
      ref="containerRef"
      class="qianji-tag-input-container"
      :class="{ 'is-focused': isFocused, 'is-error': error }"
      @click="handleContainerClick"
    >
      <div class="tags-wrapper">
        <div
          v-for="(tag, index) in tags"
          :key="index"
          class="tag-item"
        >
          <span class="tag-text">{{ tag }}</span>
          <span
            v-if="!disabled"
            class="tag-remove"
            @click.stop="removeTag(index)"
          >
            ×
          </span>
        </div>
        <input
          v-if="!disabled"
          ref="inputRef"
          v-model="inputValue"
          class="tag-input"
          type="text"
          :placeholder="tags.length === 0 ? placeholder : ''"
          @input="handleInput"
          @keydown.enter.prevent="handleEnter"
          @keydown.backspace="handleBackspace"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </div>
    </div>
    <div v-if="error" class="qianji-tag-input-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

defineOptions({
  name: 'q-tag-input'
})

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入标签，按回车添加'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  separator: {
    type: String,
    default: ','
  },
  maxTags: {
    type: Number,
    default: undefined
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'add', 'remove'])

const isFocused = ref(false)
const inputValue = ref('')
const inputRef = ref(null)
const containerRef = ref(null)
const tags = ref([...props.modelValue])

watch(() => props.modelValue, (newVal) => {
  tags.value = [...newVal]
}, { deep: true })

const handleContainerClick = () => {
  if (!props.disabled) {
    inputRef.value?.focus()
  }
}

const handleInput = (e) => {
  const value = e.target.value
  if (value.includes(props.separator)) {
    const newTags = value.split(props.separator).filter(tag => tag.trim())
    if (newTags.length > 0) {
      addTags(newTags)
      inputValue.value = ''
    }
  }
}

const handleEnter = () => {
  if (inputValue.value.trim()) {
    addTag(inputValue.value.trim())
    inputValue.value = ''
  }
}

const handleBackspace = () => {
  if (inputValue.value === '' && tags.value.length > 0) {
    removeTag(tags.value.length - 1)
  }
}

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}

const handleBlur = () => {
  isFocused.value = false
  if (inputValue.value.trim()) {
    addTag(inputValue.value.trim())
    inputValue.value = ''
  }
  emit('blur')
}

const addTag = (tag) => {
  if (props.maxTags && tags.value.length >= props.maxTags) {
    return
  }
  if (!tags.value.includes(tag)) {
    tags.value.push(tag)
    updateValue()
    emit('add', tag)
  }
}

const addTags = (newTags) => {
  newTags.forEach(tag => {
    if (props.maxTags && tags.value.length >= props.maxTags) {
      return
    }
    if (!tags.value.includes(tag)) {
      tags.value.push(tag)
    }
  })
  updateValue()
}

const removeTag = (index) => {
  const removedTag = tags.value[index]
  tags.value.splice(index, 1)
  updateValue()
  emit('remove', removedTag)
}

const updateValue = () => {
  emit('update:modelValue', [...tags.value])
  emit('change', [...tags.value])
}
</script>

<style scoped>
.qianji-tag-input-wrapper {
  width: 100%;
  margin-bottom: 16px;
}

.qianji-tag-input-label {
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

.qianji-tag-input-container {
  min-height: 30px;
  padding: 3px 8px;
  background-color: #fff;
  border: 2px solid #dfe1e6;
  border-radius: 3px;
  transition: all 0.2s ease;
  cursor: text;
}

.qianji-tag-input-container:hover {
  background-color: #fff;
}

.qianji-tag-input-container.is-focused {
  background-color: #fff;
  border-color: #dfe1e6;
}

.qianji-tag-input-container.is-error {
  border-color: #de350b;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background-color: #ebecf0;
  border-radius: 3px;
  font-size: 13px;
  color: #42526e;
  max-width: 200px;
}

.tag-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-remove {
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  color: #6b778c;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.tag-remove:hover {
  color: #172b4d;
}

.tag-input {
  flex: 1;
  min-width: 100px;
  padding: 3px 2px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #172b4d;
}

.tag-input::placeholder {
  color: #8993a4;
}

.qianji-tag-input-error {
  margin-top: 4px;
  font-size: 12px;
  color: #de350b;
}
</style>
