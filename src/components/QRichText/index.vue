<template>
  <div class="qianji-richtext-wrapper">
    <label v-if="label" class="qianji-richtext-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <div class="qianji-richtext-container" :class="{ 'is-focused': isFocused, 'is-error': error }">
      <Toolbar
        class="qianji-richtext-toolbar"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        mode="default"
      />
      <Editor
        class="qianji-richtext-editor"
        v-model="currentValue"
        :defaultConfig="editorConfig"
        mode="default"
        @onCreated="handleCreated"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
        @onChange="handleChange"
      />
    </div>
    <div v-if="error" class="qianji-richtext-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, shallowRef, watch, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

defineOptions({
  name: 'q-rich-text'
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
    default: '请输入内容'
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
  },
  height: {
    type: String,
    default: '300px'
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])

const editorRef = shallowRef()
const currentValue = ref(props.modelValue)
const isFocused = ref(false)

const toolbarConfig = {
  excludeKeys: [
    'codeBlock', // 排除代码块功能，避免 highlight.js 依赖问题
    'group-video' // 可选：排除视频功能
  ]
}

const editorConfig = {
  placeholder: props.placeholder,
  readOnly: props.disabled
}

watch(() => props.modelValue, (newVal) => {
  if (newVal !== currentValue.value) {
    currentValue.value = newVal
  }
})

watch(() => props.disabled, (newVal) => {
  if (editorRef.value) {
    if (newVal) {
      editorRef.value.disable()
    } else {
      editorRef.value.enable()
    }
  }
})

const handleCreated = (editor) => {
  editorRef.value = editor
  if (props.disabled) {
    editor.disable()
  }
}

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}

const handleBlur = () => {
  isFocused.value = false
  emit('blur')
}

const handleChange = (editor) => {
  const html = editor.getHtml()
  emit('update:modelValue', html)
  emit('change', html)
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style scoped>
.qianji-richtext-wrapper {
  width: 100%;
  margin-bottom: 16px;
}

.qianji-richtext-label {
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

.qianji-richtext-container {
  border: 2px solid #dfe1e6;
  border-radius: 3px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.qianji-richtext-container:hover {
  border-color: #c1c7d0;
}

.qianji-richtext-container.is-focused {
  border-color: #4A7BA7;
}

.qianji-richtext-container.is-error {
  border-color: #de350b;
}

.qianji-richtext-toolbar {
  border-bottom: 1px solid #dfe1e6;
  background-color: #fafbfc;
}

.qianji-richtext-editor {
  height: v-bind(height);
  overflow-y: auto;
}

.qianji-richtext-error {
  margin-top: 4px;
  font-size: 12px;
  color: #de350b;
}

/* 自定义编辑器样式 */
:deep(.w-e-text-container) {
  background-color: #fff;
}

:deep(.w-e-text-placeholder) {
  color: #8993a4;
  font-style: normal;
}

:deep(.w-e-toolbar) {
  background-color: #fafbfc !important;
  border-bottom: 1px solid #dfe1e6 !important;
}

:deep(.w-e-bar-item button) {
  color: #42526e;
}

:deep(.w-e-bar-item button:hover) {
  background-color: #ebecf0;
}
</style>
