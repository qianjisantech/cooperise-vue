<template>
  <t-dialog
    v-model:visible="dialogVisible"
    :header="isEdit ? '编辑发布日志' : '新增发布日志'"
    width="800px"
    :on-confirm="handleSubmit"
    :on-cancel="handleCancel"
    :confirm-btn="{ content: '确定', theme: 'primary', loading: submitting }"
  >
    <t-form
      ref="formRef"
      :data="formData"
      :rules="rules"
      label-width="100px"
      @submit="handleSubmit"
    >
      <t-form-item label="版本号" name="version">
        <t-input
          v-model="formData.version"
          placeholder="请输入版本号，例如：v1.0.0"
          clearable
        />
      </t-form-item>

      <t-form-item label="标题" name="title">
        <t-input
          v-model="formData.title"
          placeholder="请输入发布日志标题"
          clearable
        />
      </t-form-item>

      <t-form-item label="类型" name="type">
        <t-select
          v-model="formData.type"
          placeholder="请选择类型"
          clearable
        >
          <t-option label="新功能" :value="0" />
          <t-option label="修复" :value="1" />
          <t-option label="改进" :value="2" />
        </t-select>
      </t-form-item>

      <t-form-item label="发布日期" name="publishDate">
        <t-date-picker
          v-model="formData.publishDate"
          placeholder="请选择发布日期"
          clearable
          style="width: 100%"
        />
      </t-form-item>

      <t-form-item label="内容分类">
        <t-checkbox-group v-model="selectedCategories">
          <t-checkbox value="features">新增功能</t-checkbox>
          <t-checkbox value="improvements">优化改进</t-checkbox>
          <t-checkbox value="bugfixes">问题修复</t-checkbox>
        </t-checkbox-group>
      </t-form-item>

      <!-- 新增功能 -->
      <t-form-item
        v-if="selectedCategories.includes('features')"
        label="新增功能"
        name="featuresContent"
      >
        <RichTextEditor
          v-model="formData.featuresContent"
          placeholder="请输入新增功能的详细描述..."
        />
      </t-form-item>

      <!-- 优化改进 -->
      <t-form-item
        v-if="selectedCategories.includes('improvements')"
        label="优化改进"
        name="improvementsContent"
      >
        <RichTextEditor
          v-model="formData.improvementsContent"
          placeholder="请输入优化改进的详细描述..."
        />
      </t-form-item>

      <!-- 问题修复 -->
      <t-form-item
        v-if="selectedCategories.includes('bugfixes')"
        label="问题修复"
        name="bugfixesContent"
      >
        <RichTextEditor
          v-model="formData.bugfixesContent"
          placeholder="请输入问题修复的详细描述..."
        />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { createChangelog, updateChangelog } from '@/api/changelog.js'
import RichTextEditor from '@/views/workspace/components/RichTextEditor.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  changelog: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'success'])

const formRef = ref(null)
const submitting = ref(false)
const selectedCategories = ref(['features', 'improvements', 'bugfixes'])

const dialogVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  }
})

const isEdit = computed(() => {
  return props.changelog && props.changelog.id
})

const formData = ref({
  version: '',
  title: '',
  type: 0,
  publishDate: '',
  content: '', // 保留用于向后兼容
  featuresContent: '',
  improvementsContent: '',
  bugfixesContent: ''
})

const rules = {
  version: [
    { required: true, message: '请输入版本号', type: 'error' }
  ],
  title: [
    { required: true, message: '请输入标题', type: 'error' }
  ],
  type: [
    { required: true, message: '请选择类型', type: 'error' }
  ],
  publishDate: [
    { required: true, message: '请选择发布日期', type: 'error' }
  ]
}

// 重置表单
const resetForm = () => {
  formData.value = {
    version: '',
    title: '',
    type: 0,
    publishDate: '',
    content: '',
    featuresContent: '',
    improvementsContent: '',
    bugfixesContent: ''
  }
  selectedCategories.value = ['features', 'improvements', 'bugfixes']
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 监听 changelog 变化，初始化表单
watch(() => props.changelog, (newVal) => {
  if (newVal) {
    formData.value = {
      version: newVal.version || '',
      title: newVal.title || '',
      type: newVal.type || 0,
      publishDate: newVal.publishDate || '',
      content: newVal.content || '',
      featuresContent: newVal.featuresContent || '',
      improvementsContent: newVal.improvementsContent || '',
      bugfixesContent: newVal.bugfixesContent || ''
    }

    // 根据已有内容设置分类
    const categories = []
    if (newVal.featuresContent) categories.push('features')
    if (newVal.improvementsContent) categories.push('improvements')
    if (newVal.bugfixesContent) categories.push('bugfixes')
    selectedCategories.value = categories.length > 0 ? categories : ['features', 'improvements', 'bugfixes']
  } else {
    resetForm()
  }
}, { immediate: true })

// 处理提交
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  // 验证至少选择了一个分类并填写了内容
  const hasContent = selectedCategories.value.some(category => {
    const fieldMap = {
      features: 'featuresContent',
      improvements: 'improvementsContent',
      bugfixes: 'bugfixesContent'
    }
    const content = formData.value[fieldMap[category]]
    return content && content.trim()
  })

  if (!hasContent) {
    MessagePlugin.warning('请至少填写一个分类的内容')
    return
  }

  try {
    submitting.value = true

    // 清理未选中分类的内容
    const submitData = { ...formData.value }
    if (!selectedCategories.value.includes('features')) {
      submitData.featuresContent = ''
    }
    if (!selectedCategories.value.includes('improvements')) {
      submitData.improvementsContent = ''
    }
    if (!selectedCategories.value.includes('bugfixes')) {
      submitData.bugfixesContent = ''
    }

    let res
    if (isEdit.value) {
      res = await updateChangelog(props.changelog.id, submitData)
    } else {
      res = await createChangelog(submitData)
    }

    if (res.success) {
      MessagePlugin.success(isEdit.value ? '更新成功' : '创建成功')
      emit('success', res) // 传递响应结果
      dialogVisible.value = false
    } else {
      MessagePlugin.error(res.message || '操作失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
    MessagePlugin.error('操作失败')
  } finally {
    submitting.value = false
  }
}

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false
}
</script>

<style scoped lang="scss">
// ChangelogFormDialog styles
</style>
