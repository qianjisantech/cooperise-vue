<template>
  <div
    class="feedback-item"
    :class="{ selected: isSelected }"
    @click="$emit('click', feedback)"
  >
    <div class="feedback-item-header">
      <div class="feedback-status">
        <t-icon
          :name="feedback.status === 'open' ? 'error-circle' : 'check-circle'"
          :class="feedback.status"
          size="18px"
        />
      </div>
      <div class="feedback-main">
        <div class="feedback-title">{{ feedback.title }}</div>
        <div class="feedback-meta">
          <span class="type-badge" :class="feedback.type">
            {{ getTypeLabel(feedback.type) }}
          </span>
          <span class="meta-text">
            #{{ feedback.id }} 由 {{ authorName }} 创建于 {{ feedback.createTime || '-' }}
          </span>
          <span
            class="comment-count"
            :class="{ 'has-comments': hasComments }"
            @click.stop="$emit('toggle-comments')"
          >
            <t-icon
              :name="showComments ? 'chevron-up' : 'chat'"
              size="14px"
            />
            <span v-if="hasComments">
              {{ commentCount }}
            </span>
            <span v-else>评论</span>
          </span>
        </div>
      </div>
      <div class="feedback-actions" @click.stop>
        <t-button
          v-if="canEdit"
          v-permission="'feedback:edit'"
          theme="primary"
          variant="outline"
          size="small"
          @click="$emit('edit')"
        >
          <template #icon>
            <t-icon name="edit" />
          </template>
          编辑
        </t-button>
        <t-button
          v-if="canDelete"
          v-permission="'feedback:delete'"
          theme="danger"
          variant="outline"
          size="small"
          @click="$emit('delete')"
        >
          <template #icon>
            <t-icon name="delete" />
          </template>
          删除
        </t-button>
        <t-button
          :theme="feedback.liked ? 'primary' : 'default'"
          :variant="feedback.liked ? 'base' : 'outline'"
          size="small"
          @click="$emit('like')"
        >
          <template #icon>
            <t-icon :name="feedback.liked ? 'thumb-up' : 'thumb-up-1'" />
          </template>
          {{ feedback.likes || 0 }}
        </t-button>
      </div>
    </div>

    <!-- 评论区域 -->
    <transition name="slide-fade">
      <div v-if="showComments" class="feedback-comments" @click.stop>
        <!-- 评论列表 -->
        <div v-if="hasComments" class="comment-list-inline">
          <div v-for="comment in feedback.feedbackComments" :key="comment.id" class="comment-item-inline">
            <div class="comment-header-inline">
              <span class="comment-author">{{ getCommentAuthor(comment) }}</span>
              <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
              <t-button
                v-if="canDeleteComment(comment)"
                v-permission="'feedback:comment:delete'"
                theme="danger"
                variant="text"
                size="small"
                @click="$emit('delete-comment', comment.id)"
              >
                删除
              </t-button>
            </div>
            <div class="comment-content-inline">{{ comment.content }}</div>
            <div v-if="comment.replyTo" class="comment-reply-to">
              回复 @{{ comment.replyTo }}
            </div>
          </div>
        </div>

        <!-- 添加评论输入框 -->
        <div class="add-comment-inline">
          <t-input
            :model-value="newCommentText"
            placeholder="写下你的评论..."
            clearable
            @update:model-value="$emit('update:new-comment-text', $event)"
            @enter="$emit('add-comment')"
          >
            <template #suffix>
              <t-button
                theme="primary"
                variant="text"
                size="small"
                :disabled="!newCommentText || !newCommentText.trim()"
                @click="$emit('add-comment')"
              >
                发表
              </t-button>
            </template>
          </t-input>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  feedback: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  showComments: {
    type: Boolean,
    default: false
  },
  newCommentText: {
    type: String,
    default: ''
  },
  canEdit: {
    type: Boolean,
    default: false
  },
  canDelete: {
    type: Boolean,
    default: false
  },
  canDeleteComment: {
    type: Function,
    default: () => false
  },
  authorName: {
    type: String,
    default: '未知用户'
  },
  getTypeLabel: {
    type: Function,
    required: true
  },
  getCommentAuthor: {
    type: Function,
    required: true
  },
  formatTime: {
    type: Function,
    required: true
  }
})

defineEmits([
  'click',
  'toggle-comments',
  'edit',
  'delete',
  'like',
  'add-comment',
  'delete-comment',
  'update:new-comment-text'
])

const hasComments = computed(() => {
  return props.feedback.feedbackComments && props.feedback.feedbackComments.length > 0
})

const commentCount = computed(() => {
  return props.feedback.feedbackComments?.length || 0
})
</script>

<style scoped lang="scss">
.feedback-item {
  background: #ffffff;
  border: 1px solid #e7e7e7;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
    transform: translateY(-1px);
  }

  &.selected {
    border-color: #667eea;
    background: #f5f7ff;
  }

  .feedback-item-header {
    display: flex;
    gap: 12px;
    align-items: flex-start;

    .feedback-status {
      flex-shrink: 0;

      .t-icon {
        &.open {
          color: #ff9800;
        }

        &.closed {
          color: #29cc85;
        }
      }
    }

    .feedback-main {
      flex: 1;
      min-width: 0;

      .feedback-title {
        font-size: 16px;
        font-weight: 600;
        color: #1f2329;
        margin-bottom: 8px;
        line-height: 1.4;
      }

      .feedback-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        font-size: 13px;
        color: #646a73;

        .type-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;

          &.bug {
            background: #fee;
            color: #e34d59;
          }

          &.feature {
            background: #e6f4ff;
            color: #0052d9;
          }

          &.improvement {
            background: #f0fdf4;
            color: #29cc85;
          }

          &.other {
            background: #f5f5f5;
            color: #646a73;
          }
        }

        .meta-text {
          color: #8f959e;
        }

        .comment-count {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: #f5f7fa;
            color: #667eea;
          }

          &.has-comments {
            color: #667eea;
          }
        }
      }
    }

    .feedback-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
  }

  .feedback-comments {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e7e7e7;

    .comment-list-inline {
      margin-bottom: 12px;

      .comment-item-inline {
        padding: 12px;
        background: #f5f7fa;
        border-radius: 6px;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }

        .comment-header-inline {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;

          .comment-author {
            font-size: 13px;
            font-weight: 600;
            color: #1f2329;
          }

          .comment-time {
            font-size: 12px;
            color: #8f959e;
          }

          .t-button {
            margin-left: auto;
          }
        }

        .comment-content-inline {
          font-size: 14px;
          color: #646a73;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .comment-reply-to {
          margin-top: 6px;
          font-size: 12px;
          color: #667eea;
        }
      }
    }

    .add-comment-inline {
      :deep(.t-input) {
        background: #ffffff;
      }
    }
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
