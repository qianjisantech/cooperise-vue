<template>
  <t-dialog
    v-model:visible="visible"
    :header="dialogTitle"
    :confirm-btn="{ content: '确定', loading: submitting }"
    :on-confirm="handleSubmit"
    width="800px"
    @close="handleClose"
  >
    <t-form
      ref="formRef"
      :data="formData"
      :rules="rules"
      label-width="100px"
      @submit="handleSubmit"
    >
      <t-form-item label="标题" name="title">
        <t-input
          v-model="formData.title"
          :placeholder="isSystemUpdate ? '请输入更新标题' : '请输入通知标题'"
          clearable
          maxlength="100"
        />
      </t-form-item>

      <!-- 系统更新：版本号 -->
      <t-form-item v-if="isSystemUpdate" label="版本号" name="version">
        <t-input
          v-model="formData.version"
          placeholder="请输入版本号，如：v1.0.0"
          clearable
          maxlength="50"
        />
      </t-form-item>

      <!-- 顶部通知：类型 -->
      <t-form-item v-if="!isSystemUpdate" label="通知类型" name="type">
        <t-select
          v-model="formData.type"
          placeholder="请选择通知类型"
          clearable
        >
          <t-option :value="1" label="信息" />
          <t-option :value="2" label="警告" />
          <t-option :value="3" label="错误" />
          <t-option :value="4" label="成功" />
        </t-select>
      </t-form-item>

      <t-form-item label="内容" name="content">
        <t-textarea
          v-model="formData.content"
          :placeholder="isSystemUpdate ? '请输入更新内容' : '请输入通知内容'"
          :autosize="{ minRows: 6, maxRows: 12 }"
          maxlength="2000"
        />
      </t-form-item>

      <!-- 顶部通知：链接 -->
      <t-form-item v-if="!isSystemUpdate" label="跳转链接" name="link">
        <t-input
          v-model="formData.link"
          placeholder="请输入跳转链接（可选）"
          clearable
          maxlength="500"
        />
      </t-form-item>

      <!-- 顶部通知：生效时间范围 -->
      <t-form-item v-if="!isSystemUpdate" label="生效时间" name="timeRange">
        <t-date-range-picker
          v-model="formData.timeRange"
          enable-time-picker
          :placeholder="['开始时间（可选）', '结束时间（可选）']"
          clearable
          style="width: 100%;"
        />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import {
  createSystemUpdate,
  updateSystemUpdate,
  createTopNotification,
  updateTopNotification
} from '@/api/announcement.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  tabType: {
    type: String,
    required: true,
    validator: (value) => ['systemUpdate', 'topNotification'].includes(value)
  },
  announcementData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

// 是否为系统更新
const isSystemUpdate = computed(() => props.tabType === 'systemUpdate')

// 是否为编辑模式
const isEdit = computed(() => !!props.announcementData)

// 对话框标题
const dialogTitle = computed(() => {
  if (isSystemUpdate.value) {
    return isEdit.value ? '编辑系统更新' : '创建系统更新'
  } else {
    return isEdit.value ? '编辑顶部通知' : '创建顶部通知'
  }
})

// 控制对话框显示
const visible = ref(props.modelValue)
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val && props.announcementData) {
    // 编辑模式，填充数据
    if (isSystemUpdate.value) {
      Object.assign(formData, {
        id: props.announcementData.id,
        title: props.announcementData.title,
        version: props.announcementData.version || '',
        content: props.announcementData.content
      })
    } else {
      // 构建时间范围数组
      let timeRange = []
      if (props.announcementData.startTime && props.announcementData.endTime) {
        timeRange = [props.announcementData.startTime, props.announcementData.endTime]
      }

      Object.assign(formData, {
        id: props.announcementData.id,
        title: props.announcementData.title,
        type: props.announcementData.type,
        content: props.announcementData.content,
        link: props.announcementData.link || '',
        timeRange: timeRange
      })
    }
  } else {
    // 创建模式，重置表单
    resetForm()
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 表单引用
const formRef = ref(null)

// 提交状态
const submitting = ref(false)

// 表单数据
const formData = reactive({
  id: null,
  title: '',
  version: '', // 系统更新专用
  type: 1, // 顶部通知专用：默认信息类型
  content: '',
  link: '', // 顶部通知专用
  timeRange: [] // 顶部通知专用：[开始时间, 结束时间]
})

// 表单验证规则
const rules = computed(() => {
  const baseRules = {
    title: [
      { required: true, message: '请输入标题', type: 'error' },
      { min: 2, max: 100, message: '标题长度为2-100个字符', type: 'error' }
    ],
    content: [
      { required: true, message: '请输入内容', type: 'error' },
      { min: 10, max: 2000, message: '内容长度为10-2000个字符', type: 'error' }
    ]
  }

  // 系统更新需要版本号
  if (isSystemUpdate.value) {
    baseRules.version = [
      { required: true, message: '请输入版本号', type: 'error' },
      { max: 50, message: '版本号长度不能超过50个字符', type: 'error' }
    ]
  } else {
    // 顶部通知需要类型
    baseRules.type = [
      { required: true, message: '请选择通知类型', type: 'error' }
    ]
  }

  return baseRules
})

// 重置表单
const resetForm = () => {
  formData.id = null
  formData.title = ''
  formData.version = ''
  formData.type = 1
  formData.content = ''
  formData.link = ''
  formData.timeRange = []
  formRef.value?.clearValidate()
}

// 处理提交
const handleSubmit = async () => {
  try {
    // 验证表单
    const valid = await formRef.value?.validate()
    if (!valid) return

    submitting.value = true

    let submitData
    let res
    const itemName = isSystemUpdate.value ? '系统更新' : '顶部通知'

    if (isSystemUpdate.value) {
      // 系统更新数据
      submitData = {
        title: formData.title,
        version: formData.version,
        content: formData.content,
        status: 0 // 默认为草稿
      }

      if (isEdit.value) {
        // 编辑系统更新
        res = await updateSystemUpdate(formData.id, submitData)
      } else {
        // 创建系统更新
        res = await createSystemUpdate(submitData)
      }
    } else {
      // 顶部通知数据
      // 从时间范围数组中提取开始和结束时间
      const startTime = formData.timeRange && formData.timeRange.length > 0 ? formData.timeRange[0] : null
      const endTime = formData.timeRange && formData.timeRange.length > 1 ? formData.timeRange[1] : null

      submitData = {
        title: formData.title,
        type: formData.type,
        content: formData.content,
        link: formData.link || null,
        startTime: startTime,
        endTime: endTime,
        status: 0 // 默认为草稿
      }

      if (isEdit.value) {
        // 编辑顶部通知
        res = await updateTopNotification(formData.id, submitData)
      } else {
        // 创建顶部通知
        res = await createTopNotification(submitData)
      }
    }

    if (res.success) {
      await MessagePlugin.success(`${itemName}${isEdit.value ? '更新' : '创建'}成功`)
      emit('success')
      visible.value = false
    } else {
      await MessagePlugin.error(res.message || `${itemName}${isEdit.value ? '更新' : '创建'}失败`)
    }
  } catch (error) {
    console.error('提交失败:', error)
    const message = error.response?.data?.message || error.message || '操作失败'
    await MessagePlugin.error(message)
  } finally {
    submitting.value = false
  }
}

// 处理关闭
const handleClose = () => {
  resetForm()
  visible.value = false
}
</script>

<style scoped lang="scss">
:deep(.t-form__item) {
  margin-bottom: 24px;
}

:deep(.t-textarea__inner) {
  font-size: 14px;
  line-height: 1.6;
}
</style>
