<template>
  <div>
    <!-- 分隔线 -->
    <div v-if="item.type === 'divider'" class="menu-divider"></div>

    <!-- 菜单项 -->
    <div
      v-else
      class="secondary-menu-item"
      :class="{
        'is-active': isActive,
        'has-actions': hasActions,
        'no-click': item.actions,
        'is-indent': item.indent,
        'is-double-indent': item.doubleIndent,
        'is-folder': item.type === 'folder'
      }"
      @click="$emit('click', item)"
    >
      <t-icon v-if="item.icon" :name="item.icon" size="16px" />
      <span class="item-label">{{ item.label }}</span>

      <!-- 我的视图-右侧操作按钮 -->
      <div v-if="item.actions" class="item-actions" @click.stop>
        <t-icon
          name="search"
          size="16px"
          class="action-icon"
          @click="$emit('search')"
        />
        <t-dropdown
          :min-column-width="120"
          trigger="click"
        >
          <t-icon
            name="add"
            size="16px"
            class="action-icon"
          />
          <t-dropdown-menu>
            <t-dropdown-item @click="$emit('create-view')">
              新建视图
            </t-dropdown-item>
            <t-dropdown-item @click="$emit('create-folder')">
              新建视图分组
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
      </div>

      <!-- 文件夹-右侧操作按钮 -->
      <div v-if="item.showFolderActions" class="item-actions" @click.stop>
        <t-dropdown :min-column-width="120" trigger="click">
          <t-icon
            name="ellipsis"
            size="16px"
            class="action-icon"
          />
          <t-dropdown-menu>
            <t-dropdown-item @click="$emit('create-view-in-folder', item.folderData)">
              <t-icon name="add" size="14px" style="margin-right: 4px" />
              新建视图
            </t-dropdown-item>
            <t-dropdown-item @click="$emit('edit-folder', item.folderData)">
              <t-icon name="edit" size="14px" style="margin-right: 4px" />
              重命名
            </t-dropdown-item>
            <t-dropdown-item @click="$emit('delete-folder', item.folderData)">
              <t-icon name="delete" size="14px" style="margin-right: 4px" />
              删除
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
      </div>

      <!-- 视图-右侧操作按钮 -->
      <div v-if="item.showViewActions" class="item-actions" @click.stop>
        <t-dropdown :min-column-width="120" trigger="click">
          <t-icon
            name="ellipsis"
            size="16px"
            class="action-icon"
          />
          <t-dropdown-menu>
            <t-dropdown-item @click="$emit('edit-view', item.viewData)">
              <t-icon name="edit" size="14px" style="margin-right: 4px" />
              重命名
            </t-dropdown-item>
            <t-dropdown-item @click="$emit('delete-view', item.viewData)">
              <t-icon name="delete" size="14px" style="margin-right: 4px" />
              删除
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
      </div>

      <!-- 全部日志-右侧新增按钮 -->
      <div v-if="item.showAddAction" class="item-actions" @click.stop>
        <t-icon
          v-permission="'changelog:add'"
          name="add"
          size="16px"
          class="action-icon"
          @click="$emit('add-changelog')"
        />
      </div>

      <!-- 发布日志-右侧编辑/删除按钮 -->
      <div v-if="item.showLogActions" class="item-actions" @click.stop>
        <t-icon
          v-permission="'changelog:edit'"
          name="edit"
          size="16px"
          class="action-icon"
          @click="$emit('edit-changelog', item.logData)"
        />
        <t-icon
          v-permission="'changelog:delete'"
          name="delete"
          size="16px"
          class="action-icon action-icon-danger"
          @click="$emit('delete-changelog', item.logData)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'click',
  'search',
  'create-view',
  'create-folder',
  'create-view-in-folder',
  'edit-folder',
  'delete-folder',
  'edit-view',
  'delete-view',
  'add-changelog',
  'edit-changelog',
  'delete-changelog'
])

const hasActions = computed(() => {
  return props.item.actions ||
         props.item.showAddAction ||
         props.item.showLogActions ||
         props.item.showFolderActions ||
         props.item.showViewActions
})
</script>

<style scoped lang="scss">
.menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 8px 12px;
}

.secondary-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 6px;
  margin: 2px 8px;
  color: rgba(255, 255, 255, 0.85);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.95);

    .item-actions {
      opacity: 1;
    }
  }

  &.is-active {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    font-weight: 500;
  }

  &.no-click {
    cursor: default;
  }

  &.is-indent {
    padding-left: 28px;
  }

  &.is-double-indent {
    padding-left: 44px;
  }

  &.is-folder {
    font-weight: 500;
  }

  .t-icon {
    flex-shrink: 0;
    color: currentColor;
    opacity: 0.8;
  }

  .item-label {
    flex: 1;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.2s;

    .action-icon {
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 1);
      }

      &.action-icon-danger:hover {
        background: rgba(227, 77, 89, 0.2);
        color: #e34d59;
      }
    }
  }

  &.has-actions .item-actions {
    opacity: 1;
  }
}
</style>
