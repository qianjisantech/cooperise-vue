<template>
  <div class="loading-example">
    <h1>组件级 Loading 示例</h1>
    <p class="description">
      本示例展示了如何在不同组件中独立显示 loading，而不是整个页面 loading
    </p>

    <div class="examples-grid">
      <!-- 示例 1: 单个区域 Loading -->
      <div class="example-card">
        <h2>示例 1: 单区域 Loading</h2>
        <t-button @click="fetchSingleSection" class="mb-3">加载数据</t-button>

        <LoadingContainer
          :loading="singleLoading.loading"
          :loading-text="singleLoading.loadingText"
          class="content-area"
        >
          <div v-if="singleData.length > 0">
            <div v-for="item in singleData" :key="item.id" class="data-item">
              {{ item.title }}
            </div>
          </div>
          <div v-else class="empty">
            点击按钮加载数据
          </div>
        </LoadingContainer>
      </div>

      <!-- 示例 2: 多区域独立 Loading -->
      <div class="example-card full-width">
        <h2>示例 2: 多区域独立 Loading</h2>
        <div class="button-group mb-3">
          <t-button @click="fetchSection('section1')" theme="primary">加载区域 1</t-button>
          <t-button @click="fetchSection('section2')" theme="success">加载区域 2</t-button>
          <t-button @click="fetchSection('section3')" theme="warning">加载区域 3</t-button>
          <t-button @click="fetchAllSections" variant="outline">同时加载全部</t-button>
        </div>

        <div class="multi-sections">
          <!-- 区域 1 -->
          <LoadingContainer
            :loading="section1Loading.loading"
            :loading-text="section1Loading.loadingText"
            class="section"
          >
            <h3>区域 1 - 事项列表</h3>
            <div v-if="section1Data.length > 0">
              <div v-for="item in section1Data" :key="item.id" class="data-item">
                <t-tag theme="primary">事项</t-tag> {{ item.title }}
              </div>
            </div>
            <div v-else class="empty">暂无数据</div>
          </LoadingContainer>

          <!-- 区域 2 -->
          <LoadingContainer
            :loading="section2Loading.loading"
            :loading-text="section2Loading.loadingText"
            class="section"
          >
            <h3>区域 2 - 反馈列表</h3>
            <div v-if="section2Data.length > 0">
              <div v-for="item in section2Data" :key="item.id" class="data-item">
                <t-tag theme="success">反馈</t-tag> {{ item.title }}
              </div>
            </div>
            <div v-else class="empty">暂无数据</div>
          </LoadingContainer>

          <!-- 区域 3 -->
          <LoadingContainer
            :loading="section3Loading.loading"
            :loading-text="section3Loading.loadingText"
            class="section"
          >
            <h3>区域 3 - 统计数据</h3>
            <div v-if="section3Data" class="stats">
              <div class="stat-item">
                <div class="stat-label">总数</div>
                <div class="stat-value">{{ section3Data.total || 0 }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">完成</div>
                <div class="stat-value">{{ section3Data.completed || 0 }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">进行中</div>
                <div class="stat-value">{{ section3Data.inProgress || 0 }}</div>
              </div>
            </div>
            <div v-else class="empty">暂无数据</div>
          </LoadingContainer>
        </div>
      </div>

      <!-- 示例 3: 使用 requestWithLoading -->
      <div class="example-card">
        <h2>示例 3: requestWithLoading</h2>
        <p class="example-desc">使用 requestWithLoading 方法直接发送请求</p>
        <t-button @click="fetchWithRequestMethod" theme="default" class="mb-3">
          加载数据
        </t-button>

        <LoadingContainer
          :loading="method1Loading.loading"
          :loading-text="method1Loading.loadingText"
          class="content-area"
        >
          <div v-if="method1Data" class="data-display">
            <pre>{{ JSON.stringify(method1Data, null, 2) }}</pre>
          </div>
          <div v-else class="empty">暂无数据</div>
        </LoadingContainer>
      </div>

      <!-- 示例 4: 使用 createApiCaller -->
      <div class="example-card">
        <h2>示例 4: createApiCaller</h2>
        <p class="example-desc">使用 createApiCaller 包装 API 函数</p>
        <t-button @click="fetchWithApiCaller" theme="default" class="mb-3">
          加载数据
        </t-button>

        <LoadingContainer
          :loading="method2Loading.loading"
          :loading-text="method2Loading.loadingText"
          class="content-area"
        >
          <div v-if="method2Data" class="data-display">
            <pre>{{ JSON.stringify(method2Data, null, 2) }}</pre>
          </div>
          <div v-else class="empty">暂无数据</div>
        </LoadingContainer>
      </div>
    </div>

    <!-- 代码示例 -->
    <div class="code-section">
      <h2>核心代码示例</h2>
      <t-tabs>
        <t-tab-panel value="1" label="方式 1: requestWithLoading">
          <pre class="code-block">{{ code1 }}</pre>
        </t-tab-panel>
        <t-tab-panel value="2" label="方式 2: createApiCaller">
          <pre class="code-block">{{ code2 }}</pre>
        </t-tab-panel>
        <t-tab-panel value="3" label="方式 3: 多区域并行">
          <pre class="code-block">{{ code3 }}</pre>
        </t-tab-panel>
      </t-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLoading } from '@/composables/useLoading'
import LoadingContainer from '@/components/LoadingContainer.vue'

// 为不同示例创建独立的 loading 状态
const singleLoading = useLoading()
const section1Loading = useLoading()
const section2Loading = useLoading()
const section3Loading = useLoading()
const method1Loading = useLoading()
const method2Loading = useLoading()

// 数据状态
const singleData = ref([])
const section1Data = ref([])
const section2Data = ref([])
const section3Data = ref(null)
const method1Data = ref(null)
const method2Data = ref(null)

// 模拟 API 调用
const mockApiCall = (delay = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          records: [
            { id: 1, title: '示例数据 1' },
            { id: 2, title: '示例数据 2' },
            { id: 3, title: '示例数据 3' }
          ],
          total: 3
        }
      })
    }, delay)
  })
}

const mockStatsCall = (delay = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          total: 100,
          completed: 65,
          inProgress: 25,
          pending: 10
        }
      })
    }, delay)
  })
}

// 示例 1: 单个区域加载
const fetchSingleSection = async () => {
  try {
    const result = await singleLoading.requestWithLoading(
      {
        url: '/mock/api/data',
        method: 'get'
      },
      '正在加载数据...'
    )
    // 使用模拟数据
    const mockResult = await mockApiCall()
    singleData.value = mockResult.data.records
  } catch (error) {
    console.error('加载失败:', error)
  }
}

// 示例 2: 多区域独立加载
const fetchSection = async (section) => {
  const loadingMap = {
    section1: section1Loading,
    section2: section2Loading,
    section3: section3Loading
  }

  const dataMap = {
    section1: section1Data,
    section2: section2Data,
    section3: section3Data
  }

  const textMap = {
    section1: '正在加载事项列表...',
    section2: '正在加载反馈列表...',
    section3: '正在加载统计数据...'
  }

  const loading = loadingMap[section]
  const dataRef = dataMap[section]
  const text = textMap[section]

  try {
    loading.showLoading(text)

    if (section === 'section3') {
      const result = await mockStatsCall()
      dataRef.value = result.data
    } else {
      const result = await mockApiCall()
      dataRef.value = result.data.records
    }
  } catch (error) {
    console.error(`加载 ${section} 失败:`, error)
  } finally {
    loading.hideLoading()
  }
}

// 同时加载所有区域
const fetchAllSections = async () => {
  await Promise.all([
    fetchSection('section1'),
    fetchSection('section2'),
    fetchSection('section3')
  ])
}

// 示例 3: 使用 requestWithLoading
const fetchWithRequestMethod = async () => {
  try {
    // 实际项目中这里会调用真实的 API
    // const result = await method1Loading.requestWithLoading({
    //   url: '/api/data',
    //   method: 'get'
    // }, '正在加载数据...')

    // 使用模拟数据演示
    method1Loading.showLoading('正在加载数据...')
    const result = await mockApiCall()
    method1Data.value = result.data
    method1Loading.hideLoading()
  } catch (error) {
    console.error('加载失败:', error)
    method1Loading.hideLoading()
  }
}

// 示例 4: 使用 createApiCaller
const fetchWithApiCaller = async () => {
  try {
    const apiCaller = method2Loading.createApiCaller()

    // 实际项目中这里会调用 API 函数
    // const result = await apiCaller(
    //   () => getIssueList({ pageNum: 1, pageSize: 10 }),
    //   '正在加载事项列表...'
    // )

    // 使用模拟数据演示
    const result = await apiCaller(
      () => mockApiCall(),
      '正在加载事项列表...'
    )

    method2Data.value = result.data
  } catch (error) {
    console.error('加载失败:', error)
  }
}

// 代码示例
const code1 = `const loading = useLoading()

const fetchData = async () => {
  const result = await loading.requestWithLoading({
    url: '/workspace/issue/page',
    method: 'post',
    data: { pageNum: 1, pageSize: 20 }
  }, '正在加载事项列表...')

  issues.value = result.data.records
}`

const code2 = `const loading = useLoading()
const apiCaller = loading.createApiCaller()

const fetchData = async () => {
  const result = await apiCaller(
    () => getIssueList({ pageNum: 1, pageSize: 20 }),
    '正在加载事项列表...'
  )

  issues.value = result.data.records
}`

const code3 = `const section1Loading = useLoading()
const section2Loading = useLoading()
const section3Loading = useLoading()

// 并行加载多个区域
await Promise.all([
  section1Loading.requestWithLoading({
    url: '/api/issues',
    method: 'get'
  }, '正在加载事项...'),

  section2Loading.requestWithLoading({
    url: '/api/feedbacks',
    method: 'get'
  }, '正在加载反馈...'),

  section3Loading.requestWithLoading({
    url: '/api/stats',
    method: 'get'
  }, '正在加载统计...')
])`
</script>

<style scoped>
.loading-example {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  font-size: 28px;
  margin-bottom: 12px;
  color: #333;
}

.description {
  color: #666;
  margin-bottom: 32px;
  font-size: 16px;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.example-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.example-card.full-width {
  grid-column: 1 / -1;
}

.example-card h2 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #333;
}

.example-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.mb-3 {
  margin-bottom: 16px;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.content-area {
  min-height: 150px;
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

.multi-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.section {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  min-height: 200px;
}

.section h3 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #333;
}

.data-item {
  padding: 8px 12px;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
}

.empty {
  color: #999;
  text-align: center;
  padding: 32px;
  font-size: 14px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-item {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.data-display {
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  max-height: 300px;
  overflow: auto;
}

.data-display pre {
  margin: 0;
  font-size: 12px;
  color: #333;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.code-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.code-section h2 {
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
}

.code-block {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  font-size: 13px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .loading-example {
    background: #1a1a1a;
  }

  h1, h2, h3 {
    color: #fff;
  }

  .description, .example-desc {
    color: #aaa;
  }

  .example-card, .code-section {
    background: #2a2a2a;
    border-color: #404040;
  }

  .content-area, .section, .code-block {
    background: #1f1f1f;
  }

  .data-item, .stat-item, .data-display {
    background: #2a2a2a;
    color: #ddd;
  }
}
</style>
