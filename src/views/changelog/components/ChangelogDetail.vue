<template>
  <div class="changelog-detail">
    <div v-if="loading" class="loading-state">
      <t-loading text="加载中..." size="large" />
    </div>

    <div v-else-if="changelogData" class="changelog-content">
      <!-- 头部信息 -->
      <div class="changelog-header">
        <div class="version-badge">{{ changelogData.version }}</div>
        <h1 class="changelog-title">{{ changelogData.title }}</h1>
        <div class="changelog-meta">
          <t-icon name="time" size="16px" />
          <span>发布时间：{{ changelogData.date }}</span>
        </div>
      </div>

      <!-- 更新内容 -->
      <div class="changelog-body">
        <!-- 新增功能 -->
        <div v-if="changelogData.featuresContent" class="changelog-section">
          <h2 class="section-title">
            <t-icon name="add-circle" size="20px" />
            <span>新增功能</span>
          </h2>
          <div class="rich-content" v-html="changelogData.featuresContent"></div>
        </div>

        <!-- 优化改进 -->
        <div v-if="changelogData.improvementsContent" class="changelog-section">
          <h2 class="section-title">
            <t-icon name="check-circle" size="20px" />
            <span>优化改进</span>
          </h2>
          <div class="rich-content" v-html="changelogData.improvementsContent"></div>
        </div>

        <!-- 问题修复 -->
        <div v-if="changelogData.bugfixesContent" class="changelog-section">
          <h2 class="section-title">
            <t-icon name="error-circle" size="20px" />
            <span>问题修复</span>
          </h2>
          <div class="rich-content" v-html="changelogData.bugfixesContent"></div>
        </div>

        <!-- 旧版本兼容：如果没有新字段但有旧的 sections -->
        <div v-for="(section, index) in changelogData.sections" :key="index" class="changelog-section">
          <h2 class="section-title">
            <t-icon :name="section.icon" size="20px" />
            <span>{{ section.title }}</span>
          </h2>
          <ul class="section-list">
            <li v-for="(item, idx) in section.items" :key="idx" class="section-item">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <t-icon name="file-search" size="48px" />
      <p>未找到该发布日志</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { getChangelogById } from '@/api/changelog.js'

const route = useRoute()
const loading = ref(false)
const changelogData = ref(null)

// 解析 changelog 数据
const parseChangelogData = (data) => {
  if (!data) return null

  // 新版本：使用分类的富文本字段
  if (data.featuresContent || data.improvementsContent || data.bugfixesContent) {
    return {
      id: data.id,
      version: data.version,
      title: data.title,
      date: data.publishDate || data.createTime,
      featuresContent: data.featuresContent,
      improvementsContent: data.improvementsContent,
      bugfixesContent: data.bugfixesContent,
      sections: [] // 新版本不使用 sections
    }
  }

  // 旧版本兼容：解析 content JSON 字符串
  const sections = []
  let contentData = {}
  let isPlainText = false

  if (data.content) {
    try {
      const content = typeof data.content === 'string' ? data.content.trim() : data.content

      // 检查是否是 JSON 格式（以 { 或 [ 开头）
      if (typeof content === 'string' && (content.startsWith('{') || content.startsWith('['))) {
        contentData = JSON.parse(content)
      } else if (typeof content === 'object') {
        contentData = content
      } else {
        // 纯文本内容
        isPlainText = true
        contentData = { plainText: content }
      }
    } catch (error) {
      // JSON 解析失败，作为纯文本处理
      console.warn('Content is not valid JSON, treating as plain text')
      isPlainText = true
      contentData = { plainText: data.content }
    }
  }

  // 如果是纯文本，创建一个通用的内容区块
  if (isPlainText && contentData.plainText) {
    sections.push({
      title: '更新内容',
      icon: 'file-paste',
      items: contentData.plainText.split('\n').filter(line => line.trim())
    })
  } else {
    // 新增功能
    const features = contentData.features || data.features || []
    if (features.length > 0) {
      sections.push({
        title: '新增功能',
        icon: 'add-circle',
        items: features
      })
    }

    // 优化改进
    const improvements = contentData.improvements || data.improvements || []
    if (improvements.length > 0) {
      sections.push({
        title: '优化改进',
        icon: 'check-circle',
        items: improvements
      })
    }

    // 问题修复
    const bugfixes = contentData.bugfixes || data.bugfixes || []
    if (bugfixes.length > 0) {
      sections.push({
        title: '问题修复',
        icon: 'error-circle',
        items: bugfixes
      })
    }
  }

  return {
    id: data.id,
    version: data.version,
    title: data.title,
    date: data.publishDate || data.createTime,
    sections
  }
}

// 加载发布日志数据
const loadChangelogData = async () => {
  const id = route.query.id
  if (!id) {
    MessagePlugin.error('缺少日志ID')
    return
  }

  loading.value = true

  try {
    const res = await getChangelogById(id)
    if (res.success) {
      changelogData.value = parseChangelogData(res.data)
      if (!changelogData.value) {
        MessagePlugin.error('未找到该发布日志')
      }
    } else {
      MessagePlugin.error(res.message || '获取发布日志失败')
      changelogData.value = null
    }
  } catch (error) {
    console.error('获取发布日志失败:', error)
    MessagePlugin.error('获取发布日志失败')
    changelogData.value = null
  } finally {
    loading.value = false
  }
}

// 监听路由变化（包括 id 和时间戳参数）
watch([() => route.query.id, () => route.query.t], () => {
  if (route.query.id) {
    loadChangelogData()
  }
})

onMounted(() => {
  loadChangelogData()
})
</script>

<style scoped lang="scss">
.changelog-detail {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow-y: auto;

  .loading-state,
  .empty-state {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: #646a73;

    .t-icon {
      color: #bbb;
    }

    p {
      font-size: 14px;
      margin: 0;
    }
  }

  .changelog-content {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 24px 40px 40px;

    .changelog-header {
      background: #fff;
      border-radius: 8px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);

      .version-badge {
        display: inline-block;
        padding: 6px 16px;
        background: linear-gradient(135deg, #0052d9 0%, #3e7dff 100%);
        color: #fff;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 16px;
      }

      .changelog-title {
        font-size: 28px;
        font-weight: 600;
        color: #1f2329;
        margin: 0 0 16px 0;
        line-height: 1.4;
      }

      .changelog-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #646a73;
        font-size: 14px;

        .t-icon {
          color: #646a73;
        }
      }
    }

    .changelog-body {
      background: #fff;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);

      .changelog-section {
        margin-bottom: 32px;

        &:last-child {
          margin-bottom: 0;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: 600;
          color: #1f2329;
          margin: 0 0 16px 0;
          padding-bottom: 12px;
          border-bottom: 2px solid #e7e7e7;

          .t-icon {
            color: #0052d9;
          }
        }

        // 富文本内容样式
        .rich-content {
          padding: 16px 0;
          line-height: 1.8;
          color: #1f2329;

          :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
            margin: 16px 0 12px 0;
            font-weight: 600;
            line-height: 1.4;
          }

          :deep(p) {
            margin: 8px 0;
          }

          :deep(ul), :deep(ol) {
            padding-left: 24px;
            margin: 12px 0;

            li {
              margin: 6px 0;
            }
          }

          :deep(blockquote) {
            margin: 12px 0;
            padding: 12px 16px;
            background: #f5f7fa;
            border-left: 4px solid #0052d9;
            color: #646a73;
          }

          :deep(code) {
            padding: 2px 6px;
            background: #f5f7fa;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
          }

          :deep(pre) {
            margin: 12px 0;
            padding: 16px;
            background: #f5f7fa;
            border-radius: 6px;
            overflow-x: auto;

            code {
              padding: 0;
              background: transparent;
            }
          }

          :deep(a) {
            color: #0052d9;
            text-decoration: none;

            &:hover {
              text-decoration: underline;
            }
          }

          :deep(img) {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 12px 0;
          }

          :deep(table) {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;

            th, td {
              padding: 8px 12px;
              border: 1px solid #e7e7e7;
              text-align: left;
            }

            th {
              background: #f5f7fa;
              font-weight: 600;
            }
          }
        }

        .section-list {
          list-style: none;
          padding: 0;
          margin: 0;

          .section-item {
            position: relative;
            padding-left: 24px;
            margin-bottom: 12px;
            font-size: 15px;
            line-height: 1.6;
            color: #1f2329;

            &::before {
              content: '';
              position: absolute;
              left: 8px;
              top: 10px;
              width: 6px;
              height: 6px;
              background: #0052d9;
              border-radius: 50%;
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }
}
</style>
