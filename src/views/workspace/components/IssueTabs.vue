<template>
  <t-tabs v-model="localActiveTab" class="detail-tabs">
    <!-- 评论 -->
    <t-tab-panel value="comments" label="评论">
      <div class="tab-content comments-section">
        <div class="comment-input">
          <t-textarea
            :model-value="newComment"
            @update:model-value="emit('update:newComment', $event)"
            placeholder="添加评论..."
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
          <div class="comment-actions">
            <t-button theme="primary" size="small" @click="emit('add-comment')">
              添加评论
            </t-button>
          </div>
        </div>
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <t-avatar size="32px">{{ comment.author.charAt(0) }}</t-avatar>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </t-tab-panel>

    <!-- 附件 -->
    <t-tab-panel value="attachments" label="附件">
      <div class="tab-content attachments-section">
        <div class="attachments-list">
          <div v-for="file in attachments" :key="file.id" class="attachment-item">
            <t-icon name="file" size="20px" />
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ file.size }}</span>
            <t-button theme="default" variant="text" size="small">下载</t-button>
          </div>
        </div>
      </div>
    </t-tab-panel>

    <!-- 子任务 -->
    <t-tab-panel value="subtasks" label="子任务">
      <div class="tab-content subtasks-section">
        <div class="subtask-input">
          <t-input
            :model-value="newSubtask"
            @update:model-value="emit('update:newSubtask', $event)"
            placeholder="添加子任务..."
            @keyup.enter="emit('add-subtask')"
          >
            <template #suffix-icon>
              <t-icon name="add" @click="emit('add-subtask')" style="cursor: pointer;" />
            </template>
          </t-input>
        </div>
        <div class="subtasks-list">
          <div v-for="subtask in subtasks" :key="subtask.id" class="subtask-item">
            <t-checkbox v-model="subtask.completed" />
            <span :class="['subtask-text', { completed: subtask.completed }]">
              {{ subtask.title }}
            </span>
            <t-button theme="default" variant="text" size="small">
              <t-icon name="delete" />
            </t-button>
          </div>
        </div>
      </div>
    </t-tab-panel>

    <!-- 操作日志 -->
    <t-tab-panel value="activity" label="操作日志">
      <div class="tab-content activity-section">
        <div class="activity-list">
          <div v-for="activity in activities" :key="activity.id" class="activity-item">
            <t-avatar size="24px">{{ activity.user.charAt(0) }}</t-avatar>
            <div class="activity-content">
              <div class="activity-text">
                <span class="activity-user">{{ activity.user }}</span>
                <span class="activity-action">{{ activity.action }}</span>
                <!-- 显示 from 和 to 值变化 -->
                <span v-if="activity.from !== undefined || activity.to !== undefined" class="activity-change">
                  <span v-if="activity.from !== undefined && activity.from !== null && activity.from !== ''" class="from-value">
                    <t-tag size="small" variant="outline">{{ activity.from }}</t-tag>
                  </span>
                  <span v-if="activity.from !== undefined || activity.to !== undefined" class="arrow">→</span>
                  <span v-if="activity.to !== undefined && activity.to !== null && activity.to !== ''" class="to-value">
                    <t-tag size="small" theme="primary" variant="outline">{{ activity.to }}</t-tag>
                  </span>
                </span>
              </div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </t-tab-panel>
  </t-tabs>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'comments'
  },
  newComment: {
    type: String,
    default: ''
  },
  comments: {
    type: Array,
    default: () => []
  },
  attachments: {
    type: Array,
    default: () => []
  },
  newSubtask: {
    type: String,
    default: ''
  },
  subtasks: {
    type: Array,
    default: () => []
  },
  activities: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'update:activeTab',
  'update:newComment',
  'update:newSubtask',
  'add-comment',
  'add-subtask'
])

const localActiveTab = computed({
  get: () => props.activeTab,
  set: (val) => emit('update:activeTab', val)
})
</script>

<style scoped lang="scss">
.detail-tabs {
  :deep(.t-tabs__nav) {
    border-bottom: 1px solid #e7e7e7;
  }

  .tab-content {
    padding: 20px 0;
  }

  .comments-section {
    .comment-input {
      margin-bottom: 24px;

      .comment-actions {
        margin-top: 12px;
        display: flex;
        justify-content: flex-end;
      }
    }

    .comments-list {
      .comment-item {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .comment-content {
          flex: 1;

          .comment-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;

            .comment-author {
              font-size: 14px;
              font-weight: 500;
              color: #1f2329;
            }

            .comment-time {
              font-size: 12px;
              color: #8f959e;
            }
          }

          .comment-text {
            font-size: 14px;
            color: #646a73;
            line-height: 1.6;
          }
        }
      }
    }
  }

  .attachments-section {
    .attachments-list {
      margin-top: 16px;

      .attachment-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 4px;
        border: 1px solid #e7e7e7;
        margin-bottom: 8px;

        &:hover {
          background: #f5f7fa;
        }

        .file-name {
          flex: 1;
          font-size: 14px;
          color: #1f2329;
        }

        .file-size {
          font-size: 12px;
          color: #8f959e;
        }
      }
    }
  }

  .subtasks-section {
    .subtask-input {
      margin-bottom: 16px;
    }

    .subtasks-list {
      .subtask-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 4px;
        border: 1px solid #e7e7e7;
        margin-bottom: 8px;

        &:hover {
          background: #f5f7fa;
        }

        .subtask-text {
          flex: 1;
          font-size: 14px;
          color: #1f2329;

          &.completed {
            text-decoration: line-through;
            color: #8f959e;
          }
        }
      }
    }
  }

  .activity-section {
    .activity-list {
      .activity-item {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;

        .activity-content {
          flex: 1;

          .activity-text {
            font-size: 14px;
            color: #646a73;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;

            .activity-user {
              font-weight: 500;
              color: #1f2329;
            }

            .activity-action {
              margin-left: 0;
            }

            .activity-change {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              margin-left: 4px;

              .arrow {
                color: #8f959e;
                font-size: 14px;
              }

              .from-value,
              .to-value {
                display: inline-flex;
                align-items: center;
              }
            }
          }

          .activity-time {
            font-size: 12px;
            color: #8f959e;
          }
        }
      }
    }
  }
}
</style>
