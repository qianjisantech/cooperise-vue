<template>
  <t-dialog
    v-model:visible="visible"
    :header="isEdit ? '编辑空间' : '创建空间'"
    :confirm-btn="{ content: '确定', loading: submitting }"
    :on-confirm="handleSubmit"
    width="600px"
    @close="handleClose"
  >
    <t-form
      ref="formRef"
      :data="formData"
      :rules="rules"
      label-width="100px"
      @submit="handleSubmit"
    >
      <t-form-item label="空间名称" name="name">
        <t-input
          v-model="formData.name"
          placeholder="请输入空间名称"
          clearable
        />
      </t-form-item>

      <t-form-item label="空间编码" name="keyword">
        <t-input
          v-model="formData.keyword"
          placeholder="请输入空间编码（如：ASD）"
          clearable
        />
      </t-form-item>

      <t-form-item label="空间图标" name="icon">
        <t-select
          v-model="formData.icon"
          placeholder="请选择空间图标"
          clearable
        >
          <t-option
            v-for="icon in iconOptions"
            :key="icon.value"
            :value="icon.value"
            :label="icon.label"
          >
            <div class="icon-option">
              <t-icon :name="icon.value" size="20px" />
              <span>{{ icon.label }}</span>
            </div>
          </t-option>
        </t-select>
      </t-form-item>

      <t-form-item label="空间描述" name="description">
        <t-textarea
          v-model="formData.description"
          placeholder="请输入空间描述"
          :autosize="{ minRows: 3, maxRows: 6 }"
        />
      </t-form-item>

      <t-form-item label="负责人" name="ownerId">
        <t-select
          v-model="formData.ownerId"
          placeholder="请选择负责人"
          filterable
          clearable
          @change="handleOwnerChange"
        >
          <t-option
            v-for="user in userList"
            :key="user.id"
            :value="user.id"
            :label="`${user.username} (${user.email || '无邮箱'})`"
          >
            <div class="user-option">
              <span class="user-name">{{ user.username }}</span>
              <span class="user-email">({{ user.email || '无邮箱' }})</span>
            </div>
          </t-option>
        </t-select>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { createSpace, updateSpace } from '@/api/space.js'
import { getUserList } from '@/api/user.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  spaceData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

// 控制对话框显示
const visible = ref(props.modelValue)
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val && props.spaceData) {
    // 编辑模式，填充数据
    Object.assign(formData, props.spaceData)
  } else {
    // 创建模式，重置表单
    resetForm()
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 是否为编辑模式
const isEdit = ref(false)
watch(() => props.spaceData, (val) => {
  isEdit.value = !!val
})

// 表单引用
const formRef = ref(null)

// 提交状态
const submitting = ref(false)

// 用户列表
const userList = ref([])

// 获取用户列表
const fetchUserList = async () => {
  try {
    const res = await getUserList()
    if (res.success) {
      userList.value = res.data || []
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 组件挂载时获取用户列表
onMounted(() => {
  fetchUserList()
})

// 图标选项
const iconOptions = [
  { label: '图层', value: 'layers' },
  { label: '文件夹', value: 'folder' },
  { label: '应用', value: 'app' },
  { label: '星星', value: 'star' },
  { label: '火箭', value: 'rocket' },
  { label: '标签', value: 'flag' },
  { label: '书签', value: 'bookmark' },
  { label: '桌面', value: 'desktop' },
  { label: '服务器', value: 'server' },
  { label: '数据库', value: 'undertake-environment-management' }
]

// 表单数据
const formData = reactive({
  name: '',
  keyword: '',
  icon: 'layers',
  description: '',
  ownerId: null,
  ownerUsername: '',
  ownerNickname: ''
})

// 处理负责人选择变化
const handleOwnerChange = (value) => {
  const selectedUser = userList.value.find(user => user.id === value)
  if (selectedUser) {
    formData.ownerUsername = selectedUser.username
    formData.ownerNickname = selectedUser.username
  }
}

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入空间名称', type: 'error' },
    { min: 2, max: 50, message: '空间名称长度为2-50个字符', type: 'error' }
  ],
  code: [
    { required: true, message: '请输入空间编码', type: 'error' },
    {
      pattern: /^[A-Z0-9_]+$/,
      message: '空间编码只能包含大写字母、数字和下划线',
      type: 'error'
    },
    { min: 2, max: 20, message: '空间编码长度为2-20个字符', type: 'error' }
  ],
  ownerId: [
    { required: true, message: '请输入负责人ID', type: 'error' }
  ]
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.code = ''
  formData.icon = 'layers'
  formData.description = ''
  formData.ownerId = null
  formData.ownerUsername = ''
  formData.ownerNickname = ''
  formRef.value?.clearValidate()
}

// 处理提交
const handleSubmit = async () => {
  try {
    // 验证表单
    const valid = await formRef.value?.validate()
    if (!valid) return

    submitting.value = true

    if (isEdit.value) {
      // 编辑模式
      await updateSpace(formData.id, formData)
      MessagePlugin.success('空间更新成功')
    } else {
      // 创建模式
      await createSpace(formData)
      MessagePlugin.success('空间创建成功')
    }

    emit('success')
    visible.value = false
  } catch (error) {
    console.error('提交失败:', error)
    const message = error.response?.data?.message || error.message || '操作失败'
    MessagePlugin.error(message)
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
.icon-option {
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    margin-left: 8px;
  }
}

.user-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .user-name {
    font-size: 14px;
    color: #1f2329;
    font-weight: 500;
  }

  .user-email {
    font-size: 12px;
    color: #8a8e99;
    margin-left: 8px;
  }
}

:deep(.t-form__item) {
  margin-bottom: 20px;
}
</style>
