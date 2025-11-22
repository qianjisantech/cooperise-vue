<template>
  <div class="dashboard-page">
    <!-- 顶部欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <div class="banner-left">
          <h1 class="welcome-title">{{ greeting }}, {{ userInfo?.nickname || '用户' }}!</h1>
          <p class="welcome-date">{{ currentDate }}</p>
          <p class="welcome-desc">今天是个美好的一天,让我们高效完成工作吧!</p>
        </div>
        <div class="banner-right">
          <div class="quick-stats">
            <div class="stat-item">
              <div class="stat-value">{{ todayTasks }}</div>
              <div class="stat-label">今日待办</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">{{ completedTasks }}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">{{ projectCount }}</div>
              <div class="stat-label">进行中</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <div class="metrics-section">
      <div class="metrics-grid">
        <div
          v-for="metric in metrics"
          :key="metric.key"
          class="metric-card"
        >
          <div class="metric-header">
            <div class="metric-icon" :style="{ background: metric.iconBg }">
              <component :is="metric.icon" size="24" :style="{ color: metric.iconColor }" />
            </div>
            <div class="metric-trend" :class="{ positive: metric.trend > 0, negative: metric.trend < 0 }">
              <component :is="metric.trend > 0 ? TrendingUpIcon : TrendingDownIcon" size="16" />
              <span>{{ Math.abs(metric.trend) }}%</span>
            </div>
          </div>
          <div class="metric-body">
            <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-label">{{ metric.label }}</div>
          </div>
          <div class="metric-footer">
            <span>{{ metric.desc }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-layout">
      <!-- 左侧列 -->
      <div class="content-left">
        <!-- 快捷操作 -->
        <t-card :bordered="false" class="section-card quick-actions-card">
          <template #header>
            <div class="card-header-title">
              <AppIcon size="18" />
              <span>快捷操作</span>
            </div>
          </template>
          <div class="quick-actions-grid">
            <div
              v-for="action in quickActions"
              :key="action.path"
              class="action-item"
              @click="navigateTo(action.path)"
            >
              <div class="action-icon" :style="{ background: action.gradient }">
                <component :is="action.icon" size="20" />
              </div>
              <span class="action-label">{{ action.title }}</span>
            </div>
          </div>
        </t-card>

        <!-- 项目进度 -->
        <t-card :bordered="false" class="section-card project-progress-card">
          <template #header>
            <div class="card-header-title">
              <ViewListIcon size="18" />
              <span>项目进度</span>
            </div>
          </template>
          <div class="project-list">
            <div
              v-for="project in projects"
              :key="project.id"
              class="project-item"
            >
              <div class="project-info">
                <div class="project-name">{{ project.name }}</div>
                <div class="project-meta">{{ project.tasks }} 个任务 · {{ project.members }} 人</div>
              </div>
              <div class="project-progress">
                <t-progress
                  :percentage="project.progress"
                  :theme="project.progress >= 80 ? 'success' : project.progress >= 50 ? 'warning' : 'default'"
                  size="small"
                />
              </div>
            </div>
          </div>
        </t-card>
      </div>

      <!-- 右侧列 -->
      <div class="content-right">
        <!-- 待办事项 -->
        <t-card :bordered="false" class="section-card todo-card">
          <template #header>
            <div class="card-header-title">
              <TaskIcon size="18" />
              <span>待办事项</span>
            </div>
          </template>
          <div class="todo-list">
            <div
              v-for="todo in todos"
              :key="todo.id"
              class="todo-item"
            >
              <t-checkbox v-model="todo.completed" @change="handleTodoChange(todo)">
                <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
              </t-checkbox>
              <div class="todo-meta">
                <t-tag
                  v-if="todo.priority === 'high'"
                  theme="danger"
                  size="small"
                  variant="light"
                >
                  高优先级
                </t-tag>
                <t-tag
                  v-else-if="todo.priority === 'medium'"
                  theme="warning"
                  size="small"
                  variant="light"
                >
                  中优先级
                </t-tag>
                <span class="todo-time">{{ todo.deadline }}</span>
              </div>
            </div>
          </div>
        </t-card>

        <!-- 最近动态 -->
        <t-card :bordered="false" class="section-card activity-card">
          <template #header>
            <div class="card-header-title">
              <TimeIcon size="18" />
              <span>最近动态</span>
            </div>
          </template>
          <t-timeline>
            <t-timeline-item
              v-for="activity in activities"
              :key="activity.id"
              :dot-color="activity.color"
            >
              <div class="activity-item">
                <div class="activity-content">
                  <span class="activity-user">{{ activity.user }}</span>
                  <span class="activity-action">{{ activity.action }}</span>
                  <span class="activity-target">{{ activity.target }}</span>
                </div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </t-timeline-item>
          </t-timeline>
        </t-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import {
  DashboardIcon,
  ViewListIcon,
  TaskIcon,
  CalendarIcon,
  ChartIcon,
  UserIcon,
  TimeIcon,
  AppIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  FileIcon,
  SettingIcon
} from 'tdesign-icons-vue-next'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.userInfo)

// 问候语
const greeting = ref('')
const currentDate = ref('')

// 统计数据
const todayTasks = ref(12)
const completedTasks = ref(8)
const projectCount = ref(5)

// 更新时间和问候语
const updateTimeAndGreeting = () => {
  const now = new Date()
  const hours = now.getHours()

  if (hours < 12) {
    greeting.value = '早上好'
  } else if (hours < 18) {
    greeting.value = '下午好'
  } else {
    greeting.value = '晚上好'
  }

  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

// 数据指标
const metrics = ref([
  {
    key: 'total-tasks',
    label: '总任务数',
    value: 156,
    trend: 12,
    desc: '较上周',
    icon: TaskIcon,
    iconBg: '#E8F4FD',
    iconColor: '#0052D9'
  },
  {
    key: 'in-progress',
    label: '进行中',
    value: 45,
    trend: -5,
    desc: '较上周',
    icon: ChartIcon,
    iconBg: '#FFF4E8',
    iconColor: '#E37318'
  },
  {
    key: 'team-members',
    label: '团队成员',
    value: 28,
    trend: 8,
    desc: '较上月',
    icon: UserIcon,
    iconBg: '#E8F8F2',
    iconColor: '#00A870'
  },
  {
    key: 'projects',
    label: '活跃项目',
    value: 12,
    trend: 3,
    desc: '较上月',
    icon: ViewListIcon,
    iconBg: '#F3E8FF',
    iconColor: '#834EC2'
  }
])

// 快捷操作
const quickActions = ref([
  {
    title: '创建任务',
    path: '/task/create',
    icon: TaskIcon,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: '我的事项',
    path: '/workspace/issue',
    icon: ViewListIcon,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    title: '日历视图',
    path: '/view/calendar',
    icon: CalendarIcon,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    title: '团队管理',
    path: '/team',
    icon: UserIcon,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    title: '数据报表',
    path: '/reports',
    icon: ChartIcon,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    title: '系统设置',
    path: '/settings',
    icon: SettingIcon,
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  }
])

// 项目进度
const projects = ref([
  {
    id: 1,
    name: 'DCP 项目管理平台',
    progress: 75,
    tasks: 45,
    members: 8
  },
  {
    id: 2,
    name: '移动端应用开发',
    progress: 60,
    tasks: 32,
    members: 5
  },
  {
    id: 3,
    name: '数据分析系统',
    progress: 45,
    tasks: 28,
    members: 6
  },
  {
    id: 4,
    name: '用户管理模块',
    progress: 90,
    tasks: 15,
    members: 4
  }
])

// 待办事项
const todos = ref([
  {
    id: 1,
    title: '完成需求文档评审',
    completed: false,
    priority: 'high',
    deadline: '今天 18:00'
  },
  {
    id: 2,
    title: '更新项目进度报告',
    completed: false,
    priority: 'medium',
    deadline: '明天 12:00'
  },
  {
    id: 3,
    title: '参加团队周会',
    completed: true,
    priority: 'medium',
    deadline: '今天 14:00'
  },
  {
    id: 4,
    title: '代码审查 - 用户模块',
    completed: false,
    priority: 'high',
    deadline: '今天 16:00'
  },
  {
    id: 5,
    title: '优化数据库查询性能',
    completed: true,
    priority: 'low',
    deadline: '昨天'
  }
])

// 最近动态
const activities = ref([
  {
    id: 1,
    user: '张三',
    action: '完成了任务',
    target: '登录页面优化',
    time: '5分钟前',
    color: '#0052D9'
  },
  {
    id: 2,
    user: '李四',
    action: '评论了',
    target: '需求文档 v2.0',
    time: '15分钟前',
    color: '#00A870'
  },
  {
    id: 3,
    user: '王五',
    action: '创建了',
    target: '新项目 - 移动端开发',
    time: '1小时前',
    color: '#E37318'
  },
  {
    id: 4,
    user: '赵六',
    action: '上传了',
    target: '设计稿 - 首页改版.fig',
    time: '2小时前',
    color: '#834EC2'
  },
  {
    id: 5,
    user: '钱七',
    action: '分配了任务',
    target: 'API接口开发',
    time: '3小时前',
    color: '#0052D9'
  }
])

// 导航
const navigateTo = (path) => {
  router.push(path)
}

// 处理待办事项变更
const handleTodoChange = (todo) => {
  console.log('Todo changed:', todo)
}

onMounted(() => {
  updateTimeAndGreeting()
  setInterval(updateTimeAndGreeting, 60000)
})
</script>

<style scoped lang="scss">
.dashboard-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

// 欢迎横幅
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.banner-left {
  flex: 1;
}

.welcome-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.welcome-date {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 8px 0;
}

.welcome-desc {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

.banner-right {
  .quick-stats {
    display: flex;
    align-items: center;
    gap: 24px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    padding: 24px 32px;
    border-radius: 12px;
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 600;
    line-height: 1;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 14px;
    opacity: 0.9;
  }

  .stat-divider {
    width: 1px;
    height: 40px;
    background: rgba(255, 255, 255, 0.3);
  }
}

// 数据指标
.metrics-section {
  margin-bottom: 24px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;

  &.positive {
    color: #00a870;
  }

  &.negative {
    color: #e34d59;
  }
}

.metric-body {
  margin-bottom: 12px;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
  color: #1f2329;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 14px;
  color: #8a8e99;
}

.metric-footer {
  font-size: 12px;
  color: #bbbfc4;
}

// 内容布局
.content-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

.section-card {
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  :deep(.t-card__header) {
    padding: 20px;
    border-bottom: 1px solid #e7e7e7;
  }

  :deep(.t-card__body) {
    padding: 20px;
  }
}

.card-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
}

// 快捷操作
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f5f7fa;
    transform: translateY(-2px);
  }
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.action-label {
  font-size: 14px;
  color: #1f2329;
  text-align: center;
}

// 项目进度
.project-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-item {
  .project-info {
    margin-bottom: 12px;
  }

  .project-name {
    font-size: 14px;
    font-weight: 500;
    color: #1f2329;
    margin-bottom: 4px;
  }

  .project-meta {
    font-size: 12px;
    color: #8a8e99;
  }

  .project-progress {
    :deep(.t-progress__bar) {
      height: 6px;
    }
  }
}

// 待办事项
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.todo-item {
  padding: 12px;
  border-radius: 8px;
  background: #f5f7fa;
  transition: all 0.3s;

  &:hover {
    background: #ebeef5;
  }

  :deep(.t-checkbox) {
    display: flex;
    align-items: flex-start;
    width: 100%;
  }

  :deep(.t-checkbox__label) {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  span.completed {
    text-decoration: line-through;
    color: #8a8e99;
  }

  .todo-meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .todo-time {
    font-size: 12px;
    color: #8a8e99;
  }
}

// 最近动态
.activity-item {
  .activity-content {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .activity-user {
    font-weight: 500;
    color: #1f2329;
  }

  .activity-action {
    color: #8a8e99;
    margin: 0 4px;
  }

  .activity-target {
    color: #0052d9;
  }

  .activity-time {
    font-size: 12px;
    color: #bbbfc4;
  }
}

:deep(.t-timeline-item__content) {
  padding-bottom: 16px;
}

// 响应式
@media (max-width: 1200px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .banner-content {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 16px;
  }

  .welcome-banner {
    padding: 24px;
  }

  .welcome-title {
    font-size: 24px;
  }

  .quick-stats {
    width: 100%;
    justify-content: space-around;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
