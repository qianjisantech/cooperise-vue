<template>
  <div class="gantt-container">
    <t-card class="gantt-card">
      <div class="gantt-header">
        <h3 class="gantt-title">人员排期看板</h3>
        <div class="gantt-actions">
          <t-select
            v-model="selectedMonth"
            :options="monthOptions"
            placeholder="选择月份"
            style="width: 150px;"
          />
          <t-button theme="default" size="medium" @click="handleToday">
            <template #icon>
              <t-icon name="calendar" />
            </template>
            今天
          </t-button>
          <t-button theme="primary" size="medium" @click="handleExport">
            <template #icon>
              <t-icon name="download" />
            </template>
            导出
          </t-button>
        </div>
      </div>

      <div class="gantt-content">
        <div class="gantt-main">
          <!-- 时间轴 -->
          <div class="timeline-header">
            <div class="member-column header-cell">成员</div>
            <div class="dates-row">
              <div
                v-for="date in dateRange"
                :key="date.date"
                :class="['date-cell', { 'is-today': date.isToday, 'is-weekend': date.isWeekend }]"
              >
                <div class="date-day">{{ date.day }}</div>
                <div class="date-weekday">{{ date.weekday }}</div>
              </div>
            </div>
          </div>

          <!-- 人员排期 -->
          <div class="schedule-body">
            <div
              v-for="member in filteredMembers"
              :key="member.id"
              class="schedule-row"
            >
              <div class="member-column">
                <t-avatar size="32px">{{ member.name.charAt(0) }}</t-avatar>
                <div class="member-info">
                  <div class="member-name">{{ member.name }}</div>
                  <div class="member-role">{{ member.role }}</div>
                </div>
              </div>
              <div class="schedule-timeline">
                <div
                  v-for="task in member.tasks"
                  :key="task.id"
                  :class="['task-bar', `task-priority-${task.priority}`]"
                  :style="getTaskStyle(task)"
                  @click="handleTaskClick(task)"
                >
                  <span class="task-name">{{ task.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 人员勾选列表 -->
        <div class="member-filter">
          <div class="filter-header">人员筛选</div>
          <div class="filter-list">
            <div
              v-for="member in memberSchedules"
              :key="member.id"
              class="filter-item"
            >
              <t-checkbox v-model="member.selected">
                <template #default>
                  <div class="filter-member">
                    <t-avatar size="24px">{{ member.name.charAt(0) }}</t-avatar>
                    <div class="filter-info">
                      <div class="filter-name">{{ member.name }}</div>
                      <div class="filter-role">{{ member.role }}</div>
                    </div>
                  </div>
                </template>
              </t-checkbox>
            </div>
          </div>
        </div>
      </div>
    </t-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

// 获取当前年月
const today = new Date()
const currentYear = today.getFullYear()
const currentMonth = today.getMonth() + 1
const selectedMonth = ref(`${currentYear}-${String(currentMonth).padStart(2, '0')}`)

// 生成月份选项（前后各3个月）
const monthOptions = computed(() => {
  const options = []
  for (let i = -3; i <= 3; i++) {
    const date = new Date(currentYear, currentMonth - 1 + i, 1)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    options.push({
      label: `${year}年${month}月`,
      value: `${year}-${String(month).padStart(2, '0')}`
    })
  }
  return options
})

// 生成日期范围（根据选中的月份）
const dateRange = computed(() => {
  const dates = []
  const [year, month] = selectedMonth.value.split('-').map(Number)

  // 获取当月天数
  const daysInMonth = new Date(year, month, 0).getDate()

  const todayDate = today.getDate()
  const todayMonth = today.getMonth() + 1
  const todayYear = today.getFullYear()

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month - 1, i)
    const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const isToday = i === todayDate && month === todayMonth && year === todayYear

    dates.push({
      date: i,
      day: i,
      weekday,
      isWeekend,
      isToday
    })
  }
  return dates
})

// 人员排期数据
const memberSchedules = ref([
  {
    id: 1,
    name: '张三',
    role: '前端开发',
    selected: true,
    tasks: [
      { id: 1, name: '登录模块开发', start: 1, duration: 5, priority: 'high' },
      { id: 2, name: 'UI优化', start: 7, duration: 3, priority: 'medium' }
    ]
  },
  {
    id: 2,
    name: '李四',
    role: '后端开发',
    selected: true,
    tasks: [
      { id: 3, name: 'API接口开发', start: 2, duration: 7, priority: 'high' },
      { id: 4, name: '数据库优化', start: 10, duration: 4, priority: 'medium' }
    ]
  },
  {
    id: 3,
    name: '王五',
    role: 'UI设计师',
    selected: true,
    tasks: [
      { id: 5, name: '首页设计稿', start: 1, duration: 4, priority: 'medium' },
      { id: 6, name: '组件库设计', start: 6, duration: 6, priority: 'low' }
    ]
  },
  {
    id: 4,
    name: '赵六',
    role: '测试工程师',
    selected: true,
    tasks: [
      { id: 7, name: '功能测试', start: 8, duration: 5, priority: 'high' },
      { id: 8, name: '性能测试', start: 14, duration: 3, priority: 'medium' }
    ]
  },
  {
    id: 5,
    name: '孙七',
    role: '产品经理',
    selected: true,
    tasks: [
      { id: 9, name: '需求评审', start: 1, duration: 2, priority: 'high' },
      { id: 10, name: '产品规划', start: 4, duration: 8, priority: 'medium' }
    ]
  }
])

// 过滤显示的人员（只显示勾选的）
const filteredMembers = computed(() => {
  return memberSchedules.value.filter(member => member.selected)
})

// 计算任务条的样式
const getTaskStyle = (task) => {
  const cellWidth = 40 // 每个日期单元格宽度
  const left = (task.start - 1) * cellWidth
  const width = task.duration * cellWidth - 4 // 减去margin

  return {
    left: `${left}px`,
    width: `${width}px`
  }
}

const handleToday = () => {
  // 重置到当前月份
  selectedMonth.value = `${currentYear}-${String(currentMonth).padStart(2, '0')}`
  MessagePlugin.success('已跳转到今天')
}

const handleExport = () => {
  MessagePlugin.info('导出功能开发中')
}

const handleTaskClick = (task) => {
  MessagePlugin.info(`查看任务：${task.name}`)
}
</script>

<style scoped lang="scss">
.gantt-container {
  .gantt-card {
    :deep(.t-card__body) {
      padding: 24px;
    }

    .gantt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;

      .gantt-title {
        font-size: 18px;
        font-weight: 600;
        color: #1f2329;
        margin: 0;
      }

      .gantt-actions {
        display: flex;
        gap: 12px;
        align-items: center;
      }
    }

    .gantt-content {
      display: flex;
      border: 1px solid #e7e7e7;
      border-radius: 6px;
      background: #fff;
      overflow: hidden;

      .gantt-main {
        flex: 1;
        overflow-x: auto;
        min-width: 0;
      }

      .timeline-header {
        display: flex;
        border-bottom: 2px solid #e7e7e7;
        background: #f5f7fa;
        position: sticky;
        top: 0;
        z-index: 10;

        .member-column {
          width: 180px;
          min-width: 180px;
          padding: 12px 16px;
          border-right: 1px solid #e7e7e7;
          font-weight: 600;
          color: #1f2329;
          display: flex;
          align-items: center;

          &.header-cell {
            justify-content: center;
          }
        }

        .dates-row {
          display: flex;
          flex: 1;

          .date-cell {
            width: 40px;
            min-width: 40px;
            padding: 8px 4px;
            text-align: center;
            border-right: 1px solid #e7e7e7;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              background: #e3f0ff;
            }

            &.is-today {
              background: #e3f0ff;
              border-left: 2px solid #0052d9;
              border-right: 2px solid #0052d9;

              .date-day {
                color: #0052d9;
                font-weight: 600;
              }

              .date-weekday {
                color: #0052d9;
              }
            }

            &.is-weekend {
              background: #fafafa;

              .date-weekday {
                color: #e34d59;
              }
            }

            .date-day {
              font-size: 14px;
              font-weight: 500;
              color: #1f2329;
              margin-bottom: 4px;
            }

            .date-weekday {
              font-size: 12px;
              color: #8f959e;
            }
          }
        }
      }

      .schedule-body {
        .schedule-row {
          display: flex;
          border-bottom: 1px solid #e7e7e7;
          transition: all 0.3s;

          &:hover {
            background: #fafafa;
          }

          &:last-child {
            border-bottom: none;
          }

          .member-column {
            width: 180px;
            min-width: 180px;
            padding: 16px;
            border-right: 1px solid #e7e7e7;
            display: flex;
            align-items: center;
            gap: 12px;

            .member-info {
              flex: 1;

              .member-name {
                font-size: 14px;
                font-weight: 500;
                color: #1f2329;
                margin-bottom: 4px;
              }

              .member-role {
                font-size: 12px;
                color: #8f959e;
              }
            }
          }

          .schedule-timeline {
            flex: 1;
            position: relative;
            height: 64px;
            background: linear-gradient(
              to right,
              transparent 0%,
              transparent calc(100% - 1px),
              #e7e7e7 calc(100% - 1px),
              #e7e7e7 100%
            );
            background-size: 40px 100%;

            .task-bar {
              position: absolute;
              top: 12px;
              height: 40px;
              border-radius: 4px;
              padding: 0 8px;
              display: flex;
              align-items: center;
              cursor: pointer;
              transition: all 0.3s;
              margin: 0 2px;

              &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }

              .task-name {
                font-size: 12px;
                color: #fff;
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              &.task-priority-high {
                background: linear-gradient(135deg, #e34d59 0%, #d93546 100%);
              }

              &.task-priority-medium {
                background: linear-gradient(135deg, #ff9900 0%, #e68a00 100%);
              }

              &.task-priority-low {
                background: linear-gradient(135deg, #00a870 0%, #008f5e 100%);
              }
            }
          }
        }
      }

      .member-filter {
        width: 240px;
        min-width: 240px;
        border-left: 1px solid #e7e7e7;
        background: #fafafa;
        display: flex;
        flex-direction: column;

        .filter-header {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          color: #1f2329;
          border-bottom: 1px solid #e7e7e7;
          background: #f5f7fa;
        }

        .filter-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px;

          .filter-item {
            margin-bottom: 8px;

            :deep(.t-checkbox) {
              width: 100%;
              padding: 8px;
              border-radius: 4px;
              transition: all 0.3s;

              &:hover {
                background: #f5f7fa;
              }
            }

            .filter-member {
              display: flex;
              align-items: center;
              gap: 8px;
              width: 100%;

              .filter-info {
                flex: 1;
                min-width: 0;

                .filter-name {
                  font-size: 14px;
                  font-weight: 500;
                  color: #1f2329;
                  margin-bottom: 2px;
                }

                .filter-role {
                  font-size: 12px;
                  color: #8f959e;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
