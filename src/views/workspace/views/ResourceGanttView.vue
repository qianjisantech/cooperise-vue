<template>
  <div class="resource-gantt-view">
    <div class="view-header">
      <div class="header-left">
        <h3>{{ viewData?.name || '人员排期甘特图' }}</h3>
        <!-- 图例 -->
        <div class="legend">
          <div class="legend-item">
            <div class="legend-bar workload-low"></div>
            <span>空闲 (0-50%)</span>
          </div>
          <div class="legend-item">
            <div class="legend-bar workload-medium"></div>
            <span>正常 (50-80%)</span>
          </div>
          <div class="legend-item">
            <div class="legend-bar workload-high"></div>
            <span>繁忙 (80-100%)</span>
          </div>
          <div class="legend-item">
            <div class="legend-bar workload-over"></div>
            <span>超负荷 (&gt;100%)</span>
          </div>
        </div>
      </div>
      <div class="view-actions">
        <t-button-group>
          <t-button
            size="small"
            :variant="timeScale === 'day' ? 'base' : 'outline'"
            @click="timeScale = 'day'"
          >
            日
          </t-button>
          <t-button
            size="small"
            :variant="timeScale === 'week' ? 'base' : 'outline'"
            @click="timeScale = 'week'"
          >
            周
          </t-button>
          <t-button
            size="small"
            :variant="timeScale === 'month' ? 'base' : 'outline'"
            @click="timeScale = 'month'"
          >
            月
          </t-button>
        </t-button-group>
        <t-button theme="default" size="small" @click="handleToday">
          今天
        </t-button>
        <t-button theme="primary" size="small" @click="handleAssignTask">
          <template #icon><t-icon name="add" /></template>
          分配任务
        </t-button>
      </div>
    </div>

    <div class="gantt-content">
      <div class="gantt-container">
        <!-- 左侧人员列表 -->
        <div class="resource-list">
          <div class="resource-list-header">
            <div class="column resource-name">成员</div>
            <div class="column workload">工作负荷</div>
            <div class="column task-count">任务数</div>
          </div>
          <div class="resource-list-body">
            <div
              v-for="resource in resources"
              :key="resource.id"
              class="resource-row"
            >
              <div class="column resource-name">
                <t-avatar size="32px">{{ resource.name.charAt(0) }}</t-avatar>
                <div class="resource-info">
                  <span class="name">{{ resource.name }}</span>
                  <span class="role">{{ resource.role }}</span>
                </div>
              </div>
              <div class="column workload">
                <div class="workload-bar">
                  <div
                    class="workload-fill"
                    :class="getWorkloadClass(resource.workload)"
                    :style="{ width: Math.min(resource.workload, 100) + '%' }"
                  ></div>
                  <span class="workload-text">{{ resource.workload }}%</span>
                </div>
              </div>
              <div class="column task-count">{{ resource.tasks.length }}</div>
            </div>
          </div>
        </div>

        <!-- 右侧时间轴和甘特图 -->
        <div class="gantt-chart">
          <div class="timeline-header">
            <div
              v-for="date in timelineDates"
              :key="date.key"
              class="timeline-cell"
              :class="{ today: date.isToday, weekend: date.isWeekend }"
            >
              <div class="date-label">{{ date.label }}</div>
              <div class="day-label">{{ date.day }}</div>
            </div>
          </div>
          <div class="gantt-bars">
            <div v-for="resource in resources" :key="resource.id" class="bar-row">
              <div
                v-for="task in resource.tasks"
                :key="task.id"
                class="gantt-bar"
                :style="getBarStyle(task)"
                @click="handleTaskClick(task)"
              >
                <div class="bar-content" :class="`priority-${task.priority}`">
                  <span class="bar-text">{{ task.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const props = defineProps({
  viewData: {
    type: Object,
    default: null
  },
  viewId: {
    type: String,
    required: true
  }
})

const timeScale = ref('day')

// 人员资源数据
const resources = ref([
  {
    id: 'user1',
    name: 'Admin',
    role: '项目经理',
    workload: 85,
    tasks: [
      {
        id: 't1',
        name: '技术方案评审',
        startDate: '2024-12-10',
        endDate: '2024-12-12',
        priority: 'high'
      },
      {
        id: 't2',
        name: '项目进度跟踪',
        startDate: '2024-12-15',
        endDate: '2024-12-20',
        priority: 'medium'
      },
      {
        id: 't3',
        name: '需求变更评估',
        startDate: '2024-12-22',
        endDate: '2024-12-25',
        priority: 'high'
      }
    ]
  },
  {
    id: 'user2',
    name: 'Tester1',
    role: '前端开发',
    workload: 120,
    tasks: [
      {
        id: 't4',
        name: '登录页面开发',
        startDate: '2024-12-10',
        endDate: '2024-12-15',
        priority: 'high'
      },
      {
        id: 't5',
        name: '用户中心UI',
        startDate: '2024-12-16',
        endDate: '2024-12-20',
        priority: 'medium'
      },
      {
        id: 't6',
        name: '数据看板开发',
        startDate: '2024-12-21',
        endDate: '2024-12-28',
        priority: 'high'
      }
    ]
  },
  {
    id: 'user3',
    name: 'Tester2',
    role: '后端开发',
    workload: 75,
    tasks: [
      {
        id: 't7',
        name: '用户认证接口',
        startDate: '2024-12-11',
        endDate: '2024-12-16',
        priority: 'high'
      },
      {
        id: 't8',
        name: '数据统计API',
        startDate: '2024-12-18',
        endDate: '2024-12-23',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'user4',
    name: 'Developer1',
    role: '测试工程师',
    workload: 45,
    tasks: [
      {
        id: 't9',
        name: '功能测试用例编写',
        startDate: '2024-12-20',
        endDate: '2024-12-25',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'user5',
    name: 'Developer2',
    role: 'UI设计师',
    workload: 60,
    tasks: [
      {
        id: 't10',
        name: '界面原型设计',
        startDate: '2024-12-10',
        endDate: '2024-12-14',
        priority: 'high'
      },
      {
        id: 't11',
        name: '视觉规范制定',
        startDate: '2024-12-16',
        endDate: '2024-12-19',
        priority: 'low'
      }
    ]
  }
])

// 生成时间轴日期
const timelineDates = computed(() => {
  const dates = []
  const today = new Date()
  const startDate = new Date('2024-12-10')

  for (let i = 0; i < 25; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)

    const isToday = currentDate.toDateString() === today.toDateString()
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6

    dates.push({
      key: currentDate.toISOString(),
      label: `${currentDate.getMonth() + 1}月`,
      day: currentDate.getDate(),
      isToday,
      isWeekend
    })
  }

  return dates
})

// 计算甘特条的样式
const getBarStyle = (task) => {
  const startDate = new Date('2024-12-10')
  const taskStart = new Date(task.startDate)
  const taskEnd = new Date(task.endDate)

  const dayWidth = 60
  const startOffset = Math.floor((taskStart - startDate) / (1000 * 60 * 60 * 24))
  const duration = Math.floor((taskEnd - taskStart) / (1000 * 60 * 60 * 24)) + 1

  return {
    left: `${startOffset * dayWidth}px`,
    width: `${duration * dayWidth - 4}px`
  }
}

// 获取工作负荷样式类
const getWorkloadClass = (workload) => {
  if (workload > 100) return 'over'
  if (workload >= 80) return 'high'
  if (workload >= 50) return 'medium'
  return 'low'
}

const handleToday = () => {
  MessagePlugin.success('跳转到今天')
}

const handleAssignTask = () => {
  MessagePlugin.info('分配任务')
}

const handleTaskClick = (task) => {
  MessagePlugin.info(`查看任务: ${task.name}`)
}
</script>

<style scoped lang="scss">
.resource-gantt-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;

  .view-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid #e7e7e7;

    .header-left {
      display: flex;
      align-items: center;
      gap: 24px;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #1f2329;
      }

      .legend {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 8px 16px;
        background: #f5f5f5;
        border-radius: 6px;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #646a73;

          .legend-bar {
            width: 32px;
            height: 14px;
            border-radius: 3px;

            &.workload-low {
              background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
            }

            &.workload-medium {
              background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
            }

            &.workload-high {
              background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
            }

            &.workload-over {
              background: linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%);
            }
          }
        }
      }
    }

    .view-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }

  .gantt-content {
    flex: 1;
    overflow: hidden;
    display: flex;

    .gantt-container {
      display: flex;
      width: 100%;
      height: 100%;

      // 左侧人员列表
      .resource-list {
        flex-shrink: 0;
        width: 320px;
        border-right: 1px solid #e7e7e7;
        display: flex;
        flex-direction: column;
        background: #fafafa;

        .resource-list-header {
          display: flex;
          align-items: center;
          height: 60px;
          border-bottom: 2px solid #e7e7e7;
          background: #f5f5f5;
          font-weight: 600;
          font-size: 13px;
          color: #646a73;

          .column {
            padding: 0 12px;

            &.resource-name {
              flex: 1;
            }

            &.workload {
              width: 120px;
            }

            &.task-count {
              width: 60px;
              text-align: center;
            }
          }
        }

        .resource-list-body {
          flex: 1;
          overflow-y: auto;

          .resource-row {
            display: flex;
            align-items: center;
            min-height: 70px;
            padding: 10px 0;
            border-bottom: 1px solid #e7e7e7;
            background: #fff;
            transition: background 0.2s;

            &:hover {
              background: #f5f7fa;
            }

            .column {
              padding: 0 12px;
              display: flex;
              align-items: center;

              &.resource-name {
                flex: 1;
                gap: 12px;

                .resource-info {
                  display: flex;
                  flex-direction: column;
                  gap: 4px;

                  .name {
                    font-size: 14px;
                    font-weight: 500;
                    color: #1f2329;
                  }

                  .role {
                    font-size: 12px;
                    color: #646a73;
                  }
                }
              }

              &.workload {
                width: 120px;

                .workload-bar {
                  position: relative;
                  width: 100%;
                  height: 20px;
                  background: #f0f0f0;
                  border-radius: 10px;
                  overflow: hidden;

                  .workload-fill {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    border-radius: 10px;
                    transition: width 0.3s;

                    &.low {
                      background: linear-gradient(90deg, #52c41a 0%, #73d13d 100%);
                    }

                    &.medium {
                      background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%);
                    }

                    &.high {
                      background: linear-gradient(90deg, #fa8c16 0%, #ffa940 100%);
                    }

                    &.over {
                      background: linear-gradient(90deg, #f5222d 0%, #ff4d4f 100%);
                    }
                  }

                  .workload-text {
                    position: absolute;
                    width: 100%;
                    text-align: center;
                    font-size: 11px;
                    font-weight: 600;
                    color: #1f2329;
                    line-height: 20px;
                  }
                }
              }

              &.task-count {
                width: 60px;
                justify-content: center;
                font-size: 14px;
                font-weight: 600;
                color: #0052d9;
              }
            }
          }
        }
      }

      // 右侧甘特图
      .gantt-chart {
        flex: 1;
        overflow-x: auto;
        overflow-y: auto;
        position: relative;

        .timeline-header {
          display: flex;
          height: 60px;
          border-bottom: 2px solid #e7e7e7;
          background: #f5f5f5;
          position: sticky;
          top: 0;
          z-index: 10;

          .timeline-cell {
            flex-shrink: 0;
            width: 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-right: 1px solid #e7e7e7;
            font-size: 12px;
            color: #646a73;

            &.today {
              background: #e8f4ff;
              color: #0052d9;
              font-weight: 600;
            }

            &.weekend {
              background: #fafafa;
              color: #bbb;
            }

            .date-label {
              font-size: 11px;
              margin-bottom: 4px;
            }

            .day-label {
              font-size: 14px;
              font-weight: 600;
            }
          }
        }

        .gantt-bars {
          position: relative;
          min-height: 100%;

          .bar-row {
            min-height: 70px;
            border-bottom: 1px solid #e7e7e7;
            position: relative;

            &::before {
              content: '';
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              background: repeating-linear-gradient(
                to right,
                transparent,
                transparent 59px,
                #e7e7e7 59px,
                #e7e7e7 60px
              );
              pointer-events: none;
            }

            .gantt-bar {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              height: 32px;
              cursor: pointer;
              z-index: 1;

              .bar-content {
                height: 100%;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 12px;
                transition: all 0.2s;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

                &:hover {
                  transform: scale(1.02);
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }

                &.priority-high {
                  background: linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%);
                }

                &.priority-medium {
                  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
                }

                &.priority-low {
                  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
                }

                .bar-text {
                  font-size: 12px;
                  color: #fff;
                  font-weight: 500;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
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
