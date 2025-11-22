<template>
  <div class="space-settings-drawer">
    <t-loading v-if="loading" text="加载中..." size="large" />

    <div v-else class="drawer-content">
      <t-tabs v-model="activeTab" placement="top">
        <!-- 成员管理 -->
        <t-tab-panel value="members" label="成员管理">
          <div class="tab-content">
            <div class="members-section">
              <div class="section-header">
                <h3>空间成员</h3>
                <t-button theme="primary" size="small" @click="handleAddMember">
                  <template #icon>
                    <t-icon name="add" />
                  </template>
                  添加成员
                </t-button>
              </div>
              <t-table
                :data="memberList"
                :columns="memberColumns"
                :loading="membersLoading"
                row-key="id"
                stripe
                hover
                max-height="400"
              >
                <template #role="{ row }">
                  <t-tag :theme="getRoleTheme(row.role)">{{ getRoleLabel(row.role) }}</t-tag>
                </template>
                <template #operation="{ row }">
                  <t-space>
                    <t-button theme="primary" variant="text" size="small" @click="handleEditMember(row)">
                      编辑
                    </t-button>
                    <t-button
                      theme="danger"
                      variant="text"
                      size="small"
                      :disabled="row.role === 'admin'"
                      @click="handleRemoveMember(row)"
                    >
                      移除
                    </t-button>
                  </t-space>
                </template>
              </t-table>

              <!-- 分页 -->
              <div class="pagination-container">
                <t-pagination
                  v-model="memberPagination.current"
                  v-model:page-size="memberPagination.pageSize"
                  :total="memberPagination.total"
                  :page-size-options="[10, 20, 50]"
                  show-page-size
                  show-jumper
                  @change="handleMemberPageChange"
                  @page-size-change="handleMemberPageSizeChange"
                />
              </div>
            </div>
          </div>
        </t-tab-panel>

      </t-tabs>
    </div>

    <!-- 添加成员对话框 -->
    <t-dialog
      v-model:visible="showAddMemberDialog"
      header="添加成员"
      width="500px"
      :on-confirm="handleSaveMember"
      :on-cancel="() => showAddMemberDialog = false"
    >
      <div class="add-member-form">
        <t-form label-width="80px">
          <t-form-item label="选择用户" required>
            <t-select
              v-model="newMember.userId"
              :options="userOptions"
              placeholder="请选择用户"
              filterable
              @change="handleUserChange"
            />
          </t-form-item>
          <t-form-item label="用户名">
            <t-input v-model="newMember.username" disabled placeholder="选择用户后自动填充" />
          </t-form-item>
          <t-form-item label="用户编码">
            <t-input v-model="newMember.userCode" disabled placeholder="选择用户后自动填充" />
          </t-form-item>
          <t-form-item label="角色" required>
            <t-select
              v-model="newMember.role"
              :options="roleOptions"
              placeholder="请选择角色"
            />
          </t-form-item>
        </t-form>
      </div>
    </t-dialog>

    <!-- 编辑成员对话框 -->
    <t-dialog
      v-model:visible="showEditMemberDialog"
      header="编辑成员"
      width="500px"
      :on-confirm="handleSaveEdit"
      :on-cancel="() => showEditMemberDialog = false"
    >
      <div class="edit-member-form">
        <t-form label-width="80px">
          <t-form-item label="用户名">
            <t-input v-model="editingMember.username" disabled />
          </t-form-item>
          <t-form-item label="用户编码">
            <t-input v-model="editingMember.nickname" disabled />
          </t-form-item>
          <t-form-item label="角色" required>
            <t-select
              v-model="editingMember.role"
              :options="roleOptions"
              :disabled="editingMember.originalRole === 'admin'"
              placeholder="请选择角色"
            />
          </t-form-item>
          <t-form-item v-if="editingMember.originalRole === 'admin'">
            <div style="color: #e34d59; font-size: 12px;">
              <t-icon name="info-circle" /> 管理员角色不可修改，空间必须至少有一个管理员
            </div>
          </t-form-item>
        </t-form>
      </div>
    </t-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import { getSpaceMemberPage, getAvailableUsers, addSpaceMember, updateSpaceMember, deleteSpaceMember } from '@/api/space.js'

const props = defineProps({
  spaceId: {
    type: Number,
    required: true
  }
})

const loading = ref(false)
const activeTab = ref('members')

// 成员列表
const memberList = ref([])
const membersLoading = ref(false)

// 成员分页
const memberPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0
})

// 成员表格列
const memberColumns = [
  { colKey: 'username', title: '用户名', width: 150 },
  { colKey: 'nickname', title: '用户编码', width: 150 },
  { colKey: 'email', title: '邮箱', width: 200 },
  { colKey: 'role', title: '角色', width: 120 },
  { colKey: 'joinTime', title: '加入时间', width: 180 },
  { colKey: 'operation', title: '操作', width: 150 }
]

// 加载成员列表
const loadMembers = async () => {
  membersLoading.value = true
  try {
    const params = {
      spaceId: props.spaceId,
      current: memberPagination.value.current,
      pageSize: memberPagination.value.pageSize
    }

    const res = await getSpaceMemberPage(params)
    if (res.success) {
      memberList.value = res.data.records || res.data.list || []
      memberPagination.value.total = res.data.total || 0
    } else {
      MessagePlugin.error(res.message || '获取成员列表失败')
    }
  } catch (error) {
    console.error('加载成员列表失败:', error)
    MessagePlugin.error('加载成员列表失败')
  } finally {
    membersLoading.value = false
  }
}

// 处理分页变化
const handleMemberPageChange = (pageInfo) => {
  memberPagination.value.current = pageInfo.current
  loadMembers()
}

// 处理每页条数变化
const handleMemberPageSizeChange = (size) => {
  memberPagination.value.pageSize = size
  memberPagination.value.current = 1
  loadMembers()
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

// 获取角色主题
const getRoleTheme = (role) => {
  const themes = {
    owner: 'danger',
    admin: 'warning',
    member: 'primary'
  }
  return themes[role] || 'default'
}

// 获取角色标签
const getRoleLabel = (role) => {
  const labels = {
    owner: '拥有者',
    admin: '管理员',
    member: '成员'
  }
  return labels[role] || role
}

// 添加成员相关
const showAddMemberDialog = ref(false)
const availableUsers = ref([])
const newMember = ref({
  userId: null,
  username: '',
  userCode: '',
  role: 'member'
})

// 编辑成员相关
const showEditMemberDialog = ref(false)
const editingMember = ref({
  id: null,
  username: '',
  nickname: '',
  role: '',
  originalRole: '' // 保存原始角色，用于判断是否为管理员
})

// 用户选项（用于下拉框）
const userOptions = computed(() => {
  return availableUsers.value.map(user => ({
    label: user.username,
    value: user.id,
    userData: user
  }))
})

// 角色选项
const roleOptions = [
  { label: '成员', value: 'member' },
  { label: '管理员', value: 'admin' }
]

// 添加成员
const handleAddMember = async () => {
  try {
    // 加载可添加的用户列表
    const res = await getAvailableUsers(props.spaceId)
    if (res.success) {
      availableUsers.value = res.data || []
      if (availableUsers.value.length === 0) {
        MessagePlugin.warning('暂无可添加的用户')
        return
      }
      // 重置表单
      newMember.value = {
        userId: null,
        username: '',
        userCode: '',
        role: 'member'
      }
      showAddMemberDialog.value = true
    } else {
      MessagePlugin.error(res.message || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    MessagePlugin.error('获取用户列表失败')
  }
}

// 用户选择变化
const handleUserChange = (userId) => {
  const user = availableUsers.value.find(u => u.id === userId)
  if (user) {
    newMember.value.username = user.username
    newMember.value.userCode = user.userCode
  }
}

// 保存新成员
const handleSaveMember = async () => {
  if (!newMember.value.userId) {
    MessagePlugin.warning('请选择用户')
    return
  }
  if (!newMember.value.role) {
    MessagePlugin.warning('请选择角色')
    return
  }

  try {
    const data = {
      spaceId: props.spaceId,
      userId: newMember.value.userId,
      role: newMember.value.role
    }

    const res = await addSpaceMember(data)
    if (res.success) {
      MessagePlugin.success('添加成员成功')
      showAddMemberDialog.value = false
      // 重新加载成员列表
      loadMembers()
    } else {
      MessagePlugin.error(res.message || '添加成员失败')
    }
  } catch (error) {
    console.error('添加成员失败:', error)
    MessagePlugin.error('添加成员失败')
  }
}

// 编辑成员
const handleEditMember = (member) => {
  editingMember.value = {
    id: member.id,
    username: member.username,
    nickname: member.nickname || member.userCode,
    role: member.role,
    originalRole: member.role // 保存原始角色
  }
  showEditMemberDialog.value = true
}

// 保存编辑
const handleSaveEdit = async () => {
  if (!editingMember.value.role) {
    MessagePlugin.warning('请选择角色')
    return
  }

  try {
    const data = {
      role: editingMember.value.role
    }

    const res = await updateSpaceMember(editingMember.value.id, data)
    if (res.success) {
      MessagePlugin.success('更新成员角色成功')
      showEditMemberDialog.value = false
      // 重新加载成员列表
      loadMembers()
    } else {
      MessagePlugin.error(res.message || '更新成员失败')
    }
  } catch (error) {
    console.error('更新成员失败:', error)
    MessagePlugin.error('更新成员失败')
  }
}

// 移除成员
const handleRemoveMember = (member) => {
  const confirmDialog = DialogPlugin.confirm({
    header: '确认移除成员',
    body: `确定要将 ${member.username}（${member.nickname || member.email}）移除出空间吗？`,
    theme: 'warning',
    onConfirm: async () => {
      try {
        const res = await deleteSpaceMember(member.id)
        if (res.success) {
          MessagePlugin.success('移除成员成功')
          // 重新加载成员列表
          loadMembers()
        } else {
          MessagePlugin.error(res.message || '移除成员失败')
        }
      } catch (error) {
        console.error('移除成员失败:', error)
        MessagePlugin.error('移除成员失败')
      }
      confirmDialog.hide()
    },
    onCancel: () => {
      confirmDialog.hide()
    }
  })
}

// 组件挂载时加载数据
onMounted(() => {
  loadMembers()
})
</script>

<style scoped lang="scss">
.space-settings-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;

  .drawer-content {
    flex: 1;
    overflow: hidden;

    .tab-content {
      padding: 24px 0;

      .members-section {
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1f2329;
            margin: 0;
          }
        }

        .pagination-container {
          margin-top: 16px;
          display: flex;
          justify-content: center;
        }
      }
    }
  }

  .add-member-form,
  .edit-member-form {
    padding: 20px 0;
  }
}
</style>
