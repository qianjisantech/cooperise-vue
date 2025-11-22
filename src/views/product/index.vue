<template>
  <div class="product-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-left">
        <div class="logo" @click="goHome">
          <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="url(#logo-gradient-product)"/>
            <path d="M14 12 L14 36" stroke="white" stroke-width="3" stroke-linecap="round"/>
            <path d="M14 12 C14 12, 28 12, 28 24 C28 36, 14 36, 14 36" stroke="white" stroke-width="3" stroke-linecap="round" fill="none"/>
            <circle cx="20" cy="18" r="1.5" fill="white" opacity="0.9"/>
            <line x1="23" y1="18" x2="30" y2="18" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>
            <circle cx="20" cy="24" r="1.5" fill="white" opacity="0.9"/>
            <line x1="23" y1="24" x2="28" y2="24" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>
            <circle cx="20" cy="30" r="1.5" fill="white" opacity="0.9"/>
            <line x1="23" y1="30" x2="30" y2="30" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>
            <path d="M33 14 L35 16 L39 11" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.95"/>
            <defs>
              <linearGradient id="logo-gradient-product" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0052D9"/>
                <stop offset="50%" stop-color="#0066FF"/>
                <stop offset="100%" stop-color="#0080FF"/>
              </linearGradient>
            </defs>
          </svg>
          <span class="logo-text">Diego</span>
        </div>
      </div>
      <div class="nav-center">
        <a
          v-for="item in navTabs"
          :key="item.key"
          href="#"
          class="nav-link"
          :class="{ active: activeTab === item.key }"
          @click.prevent="activeTab = item.key"
        >
          {{ item.label }}
        </a>
      </div>
      <div class="nav-right">
        <a href="#" class="login-link" @click.prevent="handleLogin">登录</a>
        <t-button theme="primary" class="try-button" @click="handleLogin">立即体验</t-button>
      </div>
    </div>

    <!-- Tab 内容区域 -->
    <div class="tab-content">
      <!-- 产品介绍 -->
      <div v-show="activeTab === 'product'" class="tab-pane product-intro">
        <!-- 背景装饰插画 -->
        <div class="bg-illustration">
          <!-- 左侧插画 -->
          <svg class="illustration-left" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 背景圆 -->
            <circle cx="100" cy="150" r="80" fill="url(#productGradient1)" opacity="0.1"/>
            <!-- 文档图标 -->
            <rect x="60" y="100" width="80" height="100" rx="8" fill="#FFF" stroke="#0052D9" stroke-width="2"/>
            <line x1="70" y1="120" x2="130" y2="120" stroke="#0052D9" stroke-width="2"/>
            <line x1="70" y1="140" x2="120" y2="140" stroke="#4CAF50" stroke-width="2"/>
            <line x1="70" y1="160" x2="125" y2="160" stroke="#FF9800" stroke-width="2"/>
            <!-- 对勾 -->
            <circle cx="150" cy="120" r="15" fill="#4CAF50"/>
            <path d="M 145 120 L 148 124 L 155 116" stroke="#FFF" stroke-width="2" stroke-linecap="round" fill="none"/>
            <defs>
              <linearGradient id="productGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0052D9"/>
                <stop offset="100%" stop-color="#00BCD4"/>
              </linearGradient>
            </defs>
          </svg>

          <!-- 右侧插画 -->
          <svg class="illustration-right" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 背景圆 -->
            <circle cx="100" cy="150" r="70" fill="url(#productGradient2)" opacity="0.1"/>
            <!-- 看板 -->
            <rect x="50" y="80" width="100" height="140" rx="8" fill="#FFF" stroke="#4CAF50" stroke-width="2"/>
            <!-- 任务卡片 -->
            <rect x="60" y="100" width="80" height="25" rx="4" fill="#E3F2FD"/>
            <rect x="60" y="135" width="80" height="25" rx="4" fill="#FFF3E0"/>
            <rect x="60" y="170" width="80" height="25" rx="4" fill="#E8F5E9"/>
            <!-- 星星 -->
            <path d="M 40 200 L 43 208 L 52 209 L 46 215 L 48 224 L 40 219 L 32 224 L 34 215 L 28 209 L 37 208 Z" fill="#FFC107"/>
            <defs>
              <linearGradient id="productGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4CAF50"/>
                <stop offset="100%" stop-color="#8BC34A"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="hero-section">
          <div class="title-wrapper">
            <!-- 左侧装饰 -->
            <svg class="title-decoration title-decoration-left" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="30" fill="url(#titleGradient1)" opacity="0.15"/>
              <path d="M 30 40 L 35 45 L 50 30" stroke="#0052D9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              <defs>
                <linearGradient id="titleGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#0052D9"/>
                  <stop offset="100%" stop-color="#00BCD4"/>
                </linearGradient>
              </defs>
            </svg>

            <h1 class="main-title">简单好用的<br />需求管控系统</h1>

            <!-- 右侧装饰 -->
            <svg class="title-decoration title-decoration-right" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="30" fill="url(#titleGradient2)" opacity="0.15"/>
              <path d="M 35 50 L 40 30 L 45 50 L 42 52 L 42 58 L 38 58 L 38 52 Z" fill="#4CAF50"/>
              <circle cx="40" cy="40" r="3" fill="#FFF"/>
              <defs>
                <linearGradient id="titleGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#4CAF50"/>
                  <stop offset="100%" stop-color="#8BC34A"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="subtitle-group">
            <p class="subtitle">千机伞数字化协作平台</p>
            <p class="description">为你提供项目管理、任务协同等解决方案</p>
          </div>
          <div class="form-section">
            <t-input
              v-model="email"
              placeholder="请输入邮箱"
              size="large"
              class="email-input"
            />
            <t-button theme="primary" size="large" class="submit-button" @click="handleSubmit">
              立即使用
            </t-button>
          </div>
        </div>

        <!-- 功能特性 -->
        <div class="features-section">
          <h2 class="section-title">核心功能</h2>
          <div class="features-grid">
            <div v-for="feature in features" :key="feature.title" class="feature-card">
              <div class="feature-icon" :style="{ background: feature.color }">
                <component :is="feature.icon" size="32" />
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-desc">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用手册 -->
      <div v-show="activeTab === 'manual'" class="tab-pane manual-content">
        <!-- 背景装饰插画 -->
        <div class="bg-illustration">
          <!-- 左侧插画 -->
          <svg class="illustration-left" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 背景圆 -->
            <circle cx="100" cy="150" r="75" fill="url(#manualGradient1)" opacity="0.1"/>
            <!-- 书本 -->
            <rect x="60" y="100" width="80" height="100" rx="6" fill="#FFF" stroke="#0052D9" stroke-width="2"/>
            <line x1="100" y1="100" x2="100" y2="200" stroke="#E0E0E0" stroke-width="2"/>
            <line x1="70" y1="120" x2="90" y2="120" stroke="#0052D9" stroke-width="1.5"/>
            <line x1="70" y1="135" x2="90" y2="135" stroke="#4CAF50" stroke-width="1.5"/>
            <line x1="110" y1="120" x2="130" y2="120" stroke="#0052D9" stroke-width="1.5"/>
            <line x1="110" y1="135" x2="130" y2="135" stroke="#4CAF50" stroke-width="1.5"/>
            <!-- 火箭 -->
            <path d="M 160 80 L 170 60 L 180 80 L 175 85 L 175 95 L 165 95 L 165 85 Z" fill="#FF9800"/>
            <circle cx="170" cy="75" r="3" fill="#FFF"/>
            <defs>
              <linearGradient id="manualGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0052D9"/>
                <stop offset="100%" stop-color="#00BCD4"/>
              </linearGradient>
            </defs>
          </svg>

          <!-- 右侧插画 -->
          <svg class="illustration-right" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 背景圆 -->
            <circle cx="100" cy="150" r="70" fill="url(#manualGradient2)" opacity="0.1"/>
            <!-- 齿轮 -->
            <circle cx="100" cy="150" r="30" fill="#4CAF50"/>
            <circle cx="100" cy="150" r="18" fill="#FFF"/>
            <rect x="94" y="120" width="12" height="10" rx="2" fill="#4CAF50"/>
            <rect x="94" y="170" width="12" height="10" rx="2" fill="#4CAF50"/>
            <rect x="120" y="144" width="10" height="12" rx="2" fill="#4CAF50"/>
            <rect x="70" y="144" width="10" height="12" rx="2" fill="#4CAF50"/>
            <!-- 灯泡 -->
            <circle cx="50" cy="100" r="15" fill="#FFC107" opacity="0.9"/>
            <rect x="47" y="115" width="6" height="8" rx="2" fill="#FFC107"/>
            <defs>
              <linearGradient id="manualGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4CAF50"/>
                <stop offset="100%" stop-color="#8BC34A"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="manual-container">
          <p class="page-subtitle">快速上手 Diego 项目管理平台</p>

          <!-- 快速开始 -->
          <div class="manual-section">
            <h2 class="manual-section-title">
              <component :is="RocketIcon" size="24" />
              快速开始
            </h2>
            <div class="steps-grid">
              <div v-for="(step, index) in quickStartSteps" :key="index" class="step-card">
                <div class="step-number">{{ index + 1 }}</div>
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-desc">{{ step.description }}</p>
              </div>
            </div>
          </div>

          <!-- 功能指南 -->
          <div class="manual-section">
            <h2 class="manual-section-title">
              <component :is="BookIcon" size="24" />
              功能指南
            </h2>
            <div class="guide-list">
              <div v-for="guide in functionGuides" :key="guide.title" class="guide-item">
                <div class="guide-icon">
                  <component :is="guide.icon" size="24" />
                </div>
                <div class="guide-content">
                  <h3 class="guide-title">{{ guide.title }}</h3>
                  <p class="guide-desc">{{ guide.description }}</p>
                  <ul class="guide-points">
                    <li v-for="(point, idx) in guide.points" :key="idx">{{ point }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 常见问题 -->
          <div class="manual-section">
            <h2 class="manual-section-title">
              <component :is="HelpCircleIcon" size="24" />
              常见问题
            </h2>
            <div class="faq-list">
              <div v-for="(faq, index) in faqs" :key="index" class="faq-item" @click="toggleFaq(index)">
                <div class="faq-question">
                  <span>{{ faq.question }}</span>
                  <component :is="ChevronDownIcon" size="20" :class="{ rotated: faq.expanded }" />
                </div>
                <div v-show="faq.expanded" class="faq-answer">{{ faq.answer }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 关于我们 -->
      <div v-show="activeTab === 'about'" class="tab-pane about-content">
        <!-- 背景装饰插画 -->
        <div class="bg-illustration">
          <!-- 左侧插画 -->
          <svg class="illustration-left" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 背景圆 -->
            <circle cx="100" cy="150" r="75" fill="url(#aboutGradient1)" opacity="0.1"/>
            <!-- 团队人物1 -->
            <circle cx="80" cy="130" r="20" fill="#FFF3E0"/>
            <path d="M 75 125 Q 80 115 85 125" fill="#2C3E50"/>
            <path d="M 80 150 Q 80 170 80 180" stroke="#0052D9" stroke-width="5" stroke-linecap="round"/>
            <!-- 团队人物2 -->
            <circle cx="120" cy="130" r="20" fill="#FFF3E0"/>
            <path d="M 115 125 Q 120 115 125 125" fill="#5D4037"/>
            <path d="M 120 150 Q 120 170 120 180" stroke="#4CAF50" stroke-width="5" stroke-linecap="round"/>
            <!-- 爱心 -->
            <path d="M 100 100 L 105 95 Q 110 90 115 95 Q 120 90 125 95 L 130 100 L 100 125 L 70 100 L 75 95 Q 80 90 85 95 Q 90 90 95 95 Z" fill="#FF9800" opacity="0.8"/>
            <defs>
              <linearGradient id="aboutGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0052D9"/>
                <stop offset="100%" stop-color="#00BCD4"/>
              </linearGradient>
            </defs>
          </svg>

          <!-- 右侧插画 -->
          <svg class="illustration-right" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 背景圆 -->
            <circle cx="100" cy="150" r="70" fill="url(#aboutGradient2)" opacity="0.1"/>
            <!-- 目标靶心 -->
            <circle cx="100" cy="150" r="40" fill="none" stroke="#0052D9" stroke-width="2"/>
            <circle cx="100" cy="150" r="28" fill="none" stroke="#4CAF50" stroke-width="2"/>
            <circle cx="100" cy="150" r="16" fill="none" stroke="#FF9800" stroke-width="2"/>
            <circle cx="100" cy="150" r="6" fill="#FFC107"/>
            <!-- 奖杯 -->
            <path d="M 50 90 L 55 85 L 55 80 L 65 80 L 65 85 L 70 90 L 65 95 L 60 95 L 60 105 L 58 105 L 58 110 L 62 110 L 57 110 L 57 105 L 55 105 L 55 95 L 50 95 Z" fill="#FFC107"/>
            <defs>
              <linearGradient id="aboutGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4CAF50"/>
                <stop offset="100%" stop-color="#8BC34A"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="about-container">
          <p class="page-subtitle">专注于为团队提供高效的协作工具</p>

          <!-- 公司简介 -->
          <div class="about-section intro-section">
            <div class="intro-text">
              <h2 class="about-section-title">我们的使命</h2>
              <p class="intro-paragraph">
                Diego(数字化协作平台)致力于为现代团队提供简单、高效的项目管理和协作解决方案。我们相信,
                通过优秀的工具和流程,可以让团队专注于创造价值,而不是被繁琐的管理流程所困扰。
              </p>
              <p class="intro-paragraph">
                我们的产品涵盖了项目管理、任务协同、需求跟踪、进度看板等多个功能模块,
                帮助团队更好地规划、执行和交付项目。
              </p>
            </div>
            <div class="intro-image">
              <div class="image-placeholder">
                <component :is="UserCircleIcon" size="120" />
              </div>
            </div>
          </div>

          <!-- 核心价值 -->
          <div class="about-section values-section">
            <h2 class="about-section-title">核心价值观</h2>
            <div class="values-grid">
              <div v-for="value in coreValues" :key="value.title" class="value-card">
                <div class="value-icon" :style="{ background: value.color }">
                  <component :is="value.icon" size="28" />
                </div>
                <h3 class="value-title">{{ value.title }}</h3>
                <p class="value-desc">{{ value.description }}</p>
              </div>
            </div>
          </div>

          <!-- 团队介绍 -->
          <div class="about-section team-section">
            <h2 class="about-section-title">核心团队</h2>
            <div class="team-grid">
              <div v-for="member in teamMembers" :key="member.name" class="team-card">
                <div class="member-avatar">
                  <component :is="UserIcon" size="48" />
                </div>
                <h3 class="member-name">{{ member.name }}</h3>
                <p class="member-role">{{ member.role }}</p>
                <p class="member-bio">{{ member.bio }}</p>
              </div>
            </div>
          </div>

          <!-- 联系方式 -->
          <div class="about-section contact-section">
            <h2 class="about-section-title">联系我们</h2>
            <div class="contact-grid">
              <div v-for="contact in contactInfo" :key="contact.type" class="contact-card">
                <div class="contact-icon">
                  <component :is="contact.icon" size="24" />
                </div>
                <div class="contact-info">
                  <div class="contact-label">{{ contact.label }}</div>
                  <div class="contact-value">{{ contact.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="page-footer">
      <div class="footer-content">
        <div class="footer-left">
          <span>© 2024 Diego. All rights reserved.</span>
        </div>
        <div class="footer-right">
          <a href="#">隐私政策</a>
          <a href="#">服务条款</a>
          <a href="#">帮助中心</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import {
  DashboardIcon,
  ViewListIcon,
  TaskIcon,
  CalendarIcon,
  ChartIcon,
  UserIcon,
  UserCircleIcon,
  RocketIcon,
  BookIcon,
  HelpCircleIcon,
  ChevronDownIcon,
  MailIcon,
  CallIcon,
  LocationIcon,
  HeartIcon,
  ThunderstormIcon,
  LockOnIcon,
  FlagIcon
} from 'tdesign-icons-vue-next'

const router = useRouter()
const activeTab = ref('product')
const email = ref('')

const navTabs = [
  { key: 'product', label: '产品' },
  { key: 'manual', label: '使用手册' },
  { key: 'about', label: '关于我们' }
]

// 产品功能特性
const features = [
  {
    icon: DashboardIcon,
    title: '项目看板',
    description: '直观的看板视图,实时掌握项目进度',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    icon: TaskIcon,
    title: '任务管理',
    description: '灵活的任务分配和跟踪机制',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    icon: CalendarIcon,
    title: '日历视图',
    description: '时间线视图,合理安排工作计划',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    icon: ChartIcon,
    title: '数据分析',
    description: '多维度数据报表,辅助决策',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    icon: ViewListIcon,
    title: '多视图展示',
    description: '列表、看板、甘特图等多种视图',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    icon: UserCircleIcon,
    title: '团队协作',
    description: '实时协同,提升团队效率',
    color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  }
]

// 快速开始步骤
const quickStartSteps = [
  {
    title: '注册账号',
    description: '使用邮箱快速注册,30秒即可完成'
  },
  {
    title: '创建空间',
    description: '为你的团队或项目创建工作空间'
  },
  {
    title: '邀请成员',
    description: '邀请团队成员加入协作'
  },
  {
    title: '开始使用',
    description: '创建项目,添加任务,开启高效协作'
  }
]

// 功能指南
const functionGuides = [
  {
    icon: DashboardIcon,
    title: '空间管理',
    description: '空间是团队协作的基础单元',
    points: [
      '创建空间并设置基本信息',
      '添加团队成员并分配角色',
      '配置空间权限和访问控制',
      '自定义空间工作流程'
    ]
  },
  {
    icon: TaskIcon,
    title: '事项管理',
    description: '灵活管理任务、需求、Bug等各类事项',
    points: [
      '创建事项并设置优先级',
      '分配经办人和设置截止日期',
      '添加描述、附件和评论',
      '跟踪事项状态和进度'
    ]
  },
  {
    icon: ViewListIcon,
    title: '视图配置',
    description: '自定义视图以不同角度查看数据',
    points: [
      '创建个人或团队视图',
      '设置筛选条件和排序规则',
      '选择列表、看板或日历模式',
      '保存常用视图快速访问'
    ]
  },
  {
    icon: ChartIcon,
    title: '数据统计',
    description: '实时了解项目进展和团队效率',
    points: [
      '查看项目完成度和进度',
      '分析团队工作负载',
      '追踪里程碑和关键指标',
      '导出数据报表'
    ]
  }
]

// 常见问题
const faqs = reactive([
  {
    question: '如何创建新的项目空间?',
    answer: '点击左侧导航栏的"空间"菜单,然后点击"创建空间"按钮,填写空间名称和描述即可。创建后可以邀请团队成员加入。',
    expanded: false
  },
  {
    question: '如何邀请团队成员?',
    answer: '进入空间设置页面,点击"成员管理",然后点击"添加成员"按钮,输入成员的邮箱地址并分配角色即可发送邀请。',
    expanded: false
  },
  {
    question: '支持哪些事项类型?',
    answer: '系统支持任务、Bug、需求、线上问题等多种事项类型。您可以根据团队需求自定义事项类型和字段。',
    expanded: false
  },
  {
    question: '如何设置数据权限?',
    answer: '系统采用空间级别的数据权限控制,只有空间成员才能查看该空间的数据。管理员可以在空间设置中配置更细粒度的权限。',
    expanded: false
  },
  {
    question: '是否支持移动端访问?',
    answer: '是的,我们的平台采用响应式设计,支持在手机和平板等移动设备上使用,提供一致的用户体验。',
    expanded: false
  }
])

// 核心价值观
const coreValues = [
  {
    icon: HeartIcon,
    title: '用户至上',
    description: '始终将用户需求放在首位,持续优化产品体验',
    color: '#ffebee'
  },
  {
    icon: ThunderstormIcon,
    title: '高效简洁',
    description: '追求简单易用,让团队更专注于核心工作',
    color: '#fff3e0'
  },
  {
    icon: LockOnIcon,
    title: '安全可靠',
    description: '保障数据安全,提供稳定可靠的服务',
    color: '#e8f5e9'
  },
  {
    icon: FlagIcon,
    title: '持续创新',
    description: '不断探索新技术,为用户创造更多价值',
    color: '#e3f2fd'
  }
]

// 团队成员
const teamMembers = [
  {
    name: '张三',
    role: '产品负责人',
    bio: '10年产品经验,专注于企业协作工具'
  },
  {
    name: '李四',
    role: '技术负责人',
    bio: '资深全栈工程师,架构设计专家'
  },
  {
    name: '王五',
    role: '设计负责人',
    bio: 'UX/UI设计师,注重用户体验细节'
  },
  {
    name: '赵六',
    role: '运营负责人',
    bio: '擅长用户增长和社区运营'
  }
]

// 联系方式
const contactInfo = [
  {
    icon: MailIcon,
    label: '邮箱',
    type: 'email',
    value: 'contact@diego.com'
  },
  {
    icon: CallIcon,
    label: '电话',
    type: 'phone',
    value: '400-123-4567'
  },
  {
    icon: LocationIcon,
    label: '地址',
    type: 'address',
    value: '北京市朝阳区xxx大厦xx层'
  }
]

const goHome = () => {
  router.push('/')
}

const handleLogin = () => {
  router.push('/login')
}

const handleSubmit = () => {
  if (!email.value) {
    MessagePlugin.warning('请输入邮箱')
    return
  }

  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailReg.test(email.value)) {
    MessagePlugin.warning('请输入正确的邮箱')
    return
  }

  MessagePlugin.success('提交成功!')
  router.push('/login')
}

const toggleFaq = (index) => {
  faqs[index].expanded = !faqs[index].expanded
}
</script>

<style scoped lang="scss">
.product-page {
  min-height: 100vh;
  background: #f5f7fa;
}

// 背景装饰插画
.bg-illustration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;

  .illustration-left {
    position: absolute;
    left: 1%;
    top: 50%;
    transform: translateY(-50%) scale(0.8);
    width: 140px;
    height: 200px;
    opacity: 0.6;
    animation: float 6s ease-in-out infinite;
  }

  .illustration-right {
    position: absolute;
    right: 1%;
    top: 50%;
    transform: translateY(-50%) scale(0.8);
    width: 140px;
    height: 200px;
    opacity: 0.6;
    animation: float 6s ease-in-out infinite;
    animation-delay: 3s;
  }
}

// 背景装饰元素
.bg-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

// ============ 产品页装饰 - 只在空白边缘 ============
// 角落渐变球 - 淡雅清新色调
.corner-gradient {
  position: absolute;
  border-radius: 50%;
  opacity: 0.35;
  filter: blur(70px);
  animation: gentle-pulse 15s infinite ease-in-out;

  &.gradient-top-right {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle,
      rgba(173, 216, 230, 0.6) 0%,
      rgba(135, 206, 250, 0.3) 50%,
      transparent 100%
    );
    top: -150px;
    right: -150px;
  }

  &.gradient-bottom-left {
    width: 380px;
    height: 380px;
    background: radial-gradient(circle,
      rgba(152, 251, 152, 0.5) 0%,
      rgba(144, 238, 144, 0.3) 50%,
      transparent 100%
    );
    bottom: -120px;
    left: -120px;
    animation-delay: 7.5s;
  }

  &.gradient-top-left {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle,
      rgba(255, 218, 185, 0.5) 0%,
      rgba(255, 228, 196, 0.3) 50%,
      transparent 100%
    );
    top: -100px;
    left: -100px;
    animation-delay: 4s;
  }
}

// 边缘浮动圆点 - 淡雅清新色调
.edge-dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 12px currentColor;
  animation: dot-float 20s infinite ease-in-out;

  &.dot-1 {
    top: 20%;
    left: 3%;
    background: radial-gradient(circle, rgba(173, 216, 230, 0.9), rgba(173, 216, 230, 0.3));
    animation-delay: 0s;
  }

  &.dot-2 {
    top: 45%;
    left: 2%;
    background: radial-gradient(circle, rgba(152, 251, 152, 0.9), rgba(152, 251, 152, 0.3));
    animation-delay: 5s;
  }

  &.dot-3 {
    top: 25%;
    right: 3%;
    background: radial-gradient(circle, rgba(176, 224, 230, 0.9), rgba(176, 224, 230, 0.3));
    animation-delay: 10s;
  }

  &.dot-4 {
    top: 60%;
    right: 2%;
    background: radial-gradient(circle, rgba(221, 160, 221, 0.9), rgba(221, 160, 221, 0.3));
    animation-delay: 15s;
  }

  &.dot-5 {
    bottom: 30%;
    left: 4%;
    background: radial-gradient(circle, rgba(255, 218, 185, 0.9), rgba(255, 218, 185, 0.3));
    animation-delay: 3s;
  }

  &.dot-6 {
    bottom: 40%;
    right: 3%;
    background: radial-gradient(circle, rgba(144, 238, 144, 0.9), rgba(144, 238, 144, 0.3));
    animation-delay: 12s;
  }
}

// 侧边装饰线 - 淡雅清新色调
.side-line {
  position: absolute;
  height: 2px;
  opacity: 0.7;
  box-shadow: 0 0 10px currentColor;
  animation: line-fade 8s infinite ease-in-out;

  &.line-1 {
    width: 120px;
    top: 15%;
    right: 5%;
    background: linear-gradient(90deg, transparent, rgba(173, 216, 230, 0.7), transparent);
    transform: rotate(30deg);
    animation-delay: 0s;
  }

  &.line-2 {
    width: 100px;
    bottom: 25%;
    left: 4%;
    background: linear-gradient(90deg, transparent, rgba(152, 251, 152, 0.7), transparent);
    transform: rotate(-25deg);
    animation-delay: 4s;
  }

  &.line-3 {
    width: 140px;
    top: 50%;
    right: 3%;
    background: linear-gradient(90deg, transparent, rgba(221, 160, 221, 0.7), transparent);
    transform: rotate(45deg);
    animation-delay: 2s;
  }
}

// 边角光圈 - 更清新的色调
.corner-circle {
  position: absolute;
  border-radius: 50%;
  border: 2px solid;
  box-shadow:
    0 0 20px currentColor,
    inset 0 0 20px currentColor;
  animation: circle-breathe 10s infinite ease-in-out;

  &.circle-1 {
    width: 150px;
    height: 150px;
    top: 8%;
    left: 5%;
    border-color: rgba(135, 206, 250, 0.5);
    animation-delay: 0s;
  }

  &.circle-2 {
    width: 130px;
    height: 130px;
    bottom: 12%;
    right: 6%;
    border-color: rgba(152, 251, 152, 0.5);
    animation-delay: 5s;
  }

  &.circle-3 {
    width: 120px;
    height: 120px;
    top: 70%;
    left: 4%;
    border-color: rgba(255, 250, 205, 0.6);
    animation-delay: 7s;
  }
}

// 边缘小星星 - 淡雅色彩
.tiny-star {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  animation: star-twinkle 3s infinite ease-in-out;

  &.star-1 {
    top: 10%;
    right: 8%;
    background: radial-gradient(circle, rgba(173, 216, 230, 0.9), rgba(173, 216, 230, 0.3));
    box-shadow: 0 0 10px rgba(173, 216, 230, 0.7);
    animation-delay: 0s;
  }

  &.star-2 {
    top: 55%;
    left: 6%;
    background: radial-gradient(circle, rgba(152, 251, 152, 0.9), rgba(152, 251, 152, 0.3));
    box-shadow: 0 0 10px rgba(152, 251, 152, 0.7);
    animation-delay: 1s;
  }

  &.star-3 {
    bottom: 20%;
    right: 10%;
    background: radial-gradient(circle, rgba(221, 160, 221, 0.9), rgba(221, 160, 221, 0.3));
    box-shadow: 0 0 10px rgba(221, 160, 221, 0.7);
    animation-delay: 2s;
  }

  &.star-4 {
    top: 80%;
    right: 7%;
    background: radial-gradient(circle, rgba(255, 218, 185, 0.9), rgba(255, 218, 185, 0.3));
    box-shadow: 0 0 10px rgba(255, 218, 185, 0.7);
    animation-delay: 1.5s;
  }
}

// ============ 使用手册页装饰 - 只在空白边缘 ============
// 角落渐变 - 淡雅清新色调
.manual-gradient {
  position: absolute;
  border-radius: 50%;
  opacity: 0.32;
  filter: blur(65px);
  animation: gentle-pulse 16s infinite ease-in-out;

  &.gradient-tl {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(135, 206, 235, 0.5), rgba(135, 206, 235, 0.3), transparent);
    top: -120px;
    left: -120px;
  }

  &.gradient-tr {
    width: 370px;
    height: 370px;
    background: radial-gradient(circle, rgba(144, 238, 144, 0.5), rgba(144, 238, 144, 0.3), transparent);
    top: -100px;
    right: -100px;
    animation-delay: 5s;
  }

  &.gradient-bl {
    width: 340px;
    height: 340px;
    background: radial-gradient(circle, rgba(176, 224, 230, 0.5), rgba(176, 224, 230, 0.3), transparent);
    bottom: -110px;
    left: -110px;
    animation-delay: 10s;
  }
}

// 侧边圆点 - 淡雅清新色调
.manual-dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 12px currentColor;
  animation: dot-float 18s infinite ease-in-out;

  &.dot-1 {
    top: 18%;
    left: 3%;
    background: radial-gradient(circle, rgba(135, 206, 235, 0.9), rgba(135, 206, 235, 0.3));
  }

  &.dot-2 {
    top: 42%;
    left: 2%;
    background: radial-gradient(circle, rgba(144, 238, 144, 0.9), rgba(144, 238, 144, 0.3));
    animation-delay: 4s;
  }

  &.dot-3 {
    top: 68%;
    left: 3%;
    background: radial-gradient(circle, rgba(176, 224, 230, 0.9), rgba(176, 224, 230, 0.3));
    animation-delay: 8s;
  }

  &.dot-4 {
    top: 30%;
    right: 2%;
    background: radial-gradient(circle, rgba(173, 216, 230, 0.9), rgba(173, 216, 230, 0.3));
    animation-delay: 12s;
  }

  &.dot-5 {
    bottom: 25%;
    right: 3%;
    background: radial-gradient(circle, rgba(152, 251, 152, 0.9), rgba(152, 251, 152, 0.3));
    animation-delay: 6s;
  }
}

// 边缘线条 - 淡雅清新色调
.manual-line {
  position: absolute;
  height: 2px;
  opacity: 0.7;
  box-shadow: 0 0 10px currentColor;
  animation: line-fade 9s infinite ease-in-out;

  &.line-1 {
    width: 110px;
    top: 22%;
    right: 4%;
    background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.7), transparent);
    transform: rotate(35deg);
  }

  &.line-2 {
    width: 95px;
    bottom: 35%;
    left: 4%;
    background: linear-gradient(90deg, transparent, rgba(144, 238, 144, 0.7), transparent);
    transform: rotate(-30deg);
    animation-delay: 3s;
  }

  &.line-3 {
    width: 125px;
    top: 65%;
    right: 3%;
    background: linear-gradient(90deg, transparent, rgba(176, 224, 230, 0.7), transparent);
    transform: rotate(40deg);
    animation-delay: 6s;
  }
}

// 角落光圈 - 更清新的色调
.manual-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid;
  box-shadow: 0 0 20px currentColor, inset 0 0 20px currentColor;
  animation: circle-breathe 11s infinite ease-in-out;

  &.ring-1 {
    width: 140px;
    height: 140px;
    top: 10%;
    left: 5%;
    border-color: rgba(175, 238, 238, 0.5);
  }

  &.ring-2 {
    width: 125px;
    height: 125px;
    bottom: 15%;
    right: 6%;
    border-color: rgba(152, 251, 152, 0.5);
    animation-delay: 5s;
  }

  &.ring-3 {
    width: 110px;
    height: 110px;
    top: 75%;
    left: 4%;
    border-color: rgba(224, 255, 255, 0.6);
    animation-delay: 8s;
  }
}

// 小装饰元素 - 淡雅色彩
.manual-deco {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: star-twinkle 3.5s infinite ease-in-out;

  &.deco-1 {
    top: 12%;
    right: 9%;
    background: radial-gradient(circle, rgba(135, 206, 235, 0.9), rgba(135, 206, 235, 0.3));
    box-shadow: 0 0 10px rgba(135, 206, 235, 0.7);
    animation-delay: 0s;
  }

  &.deco-2 {
    top: 58%;
    left: 7%;
    background: radial-gradient(circle, rgba(144, 238, 144, 0.9), rgba(144, 238, 144, 0.3));
    box-shadow: 0 0 10px rgba(144, 238, 144, 0.7);
    animation-delay: 1.2s;
  }

  &.deco-3 {
    bottom: 22%;
    right: 11%;
    background: radial-gradient(circle, rgba(173, 216, 230, 0.9), rgba(173, 216, 230, 0.3));
    box-shadow: 0 0 10px rgba(173, 216, 230, 0.7);
    animation-delay: 2.4s;
  }
}

// ============ 关于我们页装饰 - 只在空白边缘 ============
// 角落渐变 - 淡雅清新色调
.about-gradient {
  position: absolute;
  border-radius: 50%;
  opacity: 0.35;
  filter: blur(68px);
  animation: gentle-pulse 17s infinite ease-in-out;

  &.gradient-tr {
    width: 380px;
    height: 380px;
    background: radial-gradient(circle, rgba(221, 160, 221, 0.6), rgba(221, 160, 221, 0.3), transparent);
    top: -130px;
    right: -130px;
  }

  &.gradient-bl {
    width: 360px;
    height: 360px;
    background: radial-gradient(circle, rgba(255, 182, 193, 0.5), rgba(255, 182, 193, 0.3), transparent);
    bottom: -115px;
    left: -115px;
    animation-delay: 6s;
  }

  &.gradient-br {
    width: 340px;
    height: 340px;
    background: radial-gradient(circle, rgba(176, 224, 230, 0.5), rgba(176, 224, 230, 0.3), transparent);
    bottom: -105px;
    right: -105px;
    animation-delay: 11s;
  }
}

// 侧边圆点 - 淡雅清新色调
.about-dot {
  position: absolute;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  box-shadow: 0 0 13px currentColor;
  animation: dot-float 19s infinite ease-in-out;

  &.dot-1 {
    top: 16%;
    left: 3%;
    background: radial-gradient(circle, rgba(221, 160, 221, 0.9), rgba(221, 160, 221, 0.3));
  }

  &.dot-2 {
    top: 38%;
    left: 2%;
    background: radial-gradient(circle, rgba(255, 182, 193, 0.9), rgba(255, 182, 193, 0.3));
    animation-delay: 3s;
  }

  &.dot-3 {
    top: 62%;
    left: 3%;
    background: radial-gradient(circle, rgba(176, 224, 230, 0.9), rgba(176, 224, 230, 0.3));
    animation-delay: 6s;
  }

  &.dot-4 {
    top: 28%;
    right: 2%;
    background: radial-gradient(circle, rgba(230, 230, 250, 0.9), rgba(230, 230, 250, 0.3));
    animation-delay: 9s;
  }

  &.dot-5 {
    top: 52%;
    right: 3%;
    background: radial-gradient(circle, rgba(255, 218, 185, 0.9), rgba(255, 218, 185, 0.3));
    animation-delay: 12s;
  }

  &.dot-6 {
    bottom: 30%;
    right: 2%;
    background: radial-gradient(circle, rgba(173, 216, 230, 0.9), rgba(173, 216, 230, 0.3));
    animation-delay: 15s;
  }
}

// 边缘线条 - 淡雅清新色调
.about-line {
  position: absolute;
  height: 2px;
  opacity: 0.75;
  box-shadow: 0 0 10px currentColor;
  animation: line-fade 8.5s infinite ease-in-out;

  &.line-1 {
    width: 115px;
    top: 20%;
    right: 4%;
    background: linear-gradient(90deg, transparent, rgba(221, 160, 221, 0.7), transparent);
    transform: rotate(32deg);
  }

  &.line-2 {
    width: 100px;
    bottom: 38%;
    left: 4%;
    background: linear-gradient(90deg, transparent, rgba(255, 182, 193, 0.7), transparent);
    transform: rotate(-28deg);
    animation-delay: 3s;
  }

  &.line-3 {
    width: 130px;
    top: 68%;
    right: 3%;
    background: linear-gradient(90deg, transparent, rgba(176, 224, 230, 0.7), transparent);
    transform: rotate(38deg);
    animation-delay: 5.5s;
  }
}

// 角落圆环 - 更清新的色调
.about-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid;
  box-shadow: 0 0 20px currentColor, inset 0 0 20px currentColor;
  animation: circle-breathe 10.5s infinite ease-in-out;

  &.ring-1 {
    width: 145px;
    height: 145px;
    top: 9%;
    left: 5%;
    border-color: rgba(255, 240, 245, 0.6);
  }

  &.ring-2 {
    width: 128px;
    height: 128px;
    bottom: 14%;
    right: 6%;
    border-color: rgba(255, 228, 225, 0.6);
    animation-delay: 5s;
  }

  &.ring-3 {
    width: 115px;
    height: 115px;
    top: 72%;
    left: 4%;
    border-color: rgba(240, 248, 255, 0.6);
    animation-delay: 7.5s;
  }
}

// 星光点缀 - 淡雅色彩
.about-star {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  animation: star-twinkle 3.2s infinite ease-in-out;

  &.star-1 {
    top: 11%;
    right: 9%;
    background: radial-gradient(circle, rgba(221, 160, 221, 0.9), rgba(221, 160, 221, 0.3));
    box-shadow: 0 0 12px rgba(221, 160, 221, 0.7);
  }

  &.star-2 {
    top: 45%;
    left: 7%;
    background: radial-gradient(circle, rgba(255, 182, 193, 0.9), rgba(255, 182, 193, 0.3));
    box-shadow: 0 0 12px rgba(255, 182, 193, 0.7);
    animation-delay: 0.8s;
  }

  &.star-3 {
    top: 78%;
    right: 8%;
    background: radial-gradient(circle, rgba(176, 224, 230, 0.9), rgba(176, 224, 230, 0.3));
    box-shadow: 0 0 12px rgba(176, 224, 230, 0.7);
    animation-delay: 1.6s;
  }

  &.star-4 {
    bottom: 18%;
    left: 6%;
    background: radial-gradient(circle, rgba(255, 218, 185, 0.9), rgba(255, 218, 185, 0.3));
    box-shadow: 0 0 12px rgba(255, 218, 185, 0.7);
    animation-delay: 2.4s;
  }

  &.star-5 {
    top: 32%;
    right: 11%;
    background: radial-gradient(circle, rgba(230, 230, 250, 0.9), rgba(230, 230, 250, 0.3));
    box-shadow: 0 0 12px rgba(230, 230, 250, 0.7);
    animation-delay: 1.2s;
  }
}

// ============ 旧样式保留 (暂时不删除) ============
// 动态波浪
.animated-wave {
  position: absolute;
  width: 100%;
  height: 250px;
  opacity: 0.15;
  animation: wave-move 10s infinite ease-in-out;

  &.wave-1 {
    top: 0;
    background: linear-gradient(180deg,
      rgba(0, 82, 217, 0.3) 0%,
      rgba(0, 82, 217, 0.1) 50%,
      transparent 100%
    );
    clip-path: polygon(
      0 0, 100% 0,
      100% 40%, 90% 45%, 80% 50%, 70% 55%, 60% 50%, 50% 45%, 40% 40%, 30% 45%, 20% 50%, 10% 45%,
      0 40%
    );
    animation-delay: 0s;
  }

  &.wave-2 {
    top: 30%;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(0, 168, 112, 0.15) 50%,
      transparent 100%
    );
    clip-path: polygon(
      0 50%, 10% 45%, 20% 50%, 30% 55%, 40% 60%, 50% 55%, 60% 50%, 70% 45%, 80% 50%, 90% 55%, 100% 50%,
      100% 100%, 0 100%
    );
    animation-delay: 3s;
  }

  &.wave-3 {
    bottom: 0;
    background: linear-gradient(0deg,
      rgba(79, 172, 254, 0.3) 0%,
      rgba(79, 172, 254, 0.1) 50%,
      transparent 100%
    );
    clip-path: polygon(
      0 100%, 10% 95%, 20% 90%, 30% 85%, 40% 90%, 50% 95%, 60% 90%, 70% 85%, 80% 90%, 90% 95%, 100% 100%,
      100% 60%, 0 60%
    );
    animation-delay: 6s;
  }
}

// 3D网格
.grid-3d {
  position: absolute;
  width: 400px;
  height: 400px;
  background-image:
    linear-gradient(rgba(0, 82, 217, 0.4) 2px, transparent 2px),
    linear-gradient(90deg, rgba(0, 82, 217, 0.4) 2px, transparent 2px),
    linear-gradient(rgba(0, 82, 217, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 82, 217, 0.2) 1px, transparent 1px);
  background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
  opacity: 0.3;
  transform-style: preserve-3d;
  animation: grid-rotate 20s infinite linear;

  &.grid-1 {
    top: 10%;
    right: -50px;
    transform: perspective(1000px) rotateY(-20deg);
  }

  &.grid-2 {
    bottom: 10%;
    left: -50px;
    transform: perspective(1000px) rotateY(20deg);
  }
}

// 科技线条
.tech-lines {
  position: absolute;
  width: 300px;
  height: 2px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(0, 82, 217, 0.8) 50%,
      transparent 100%
    );
    animation: line-scan 4s infinite ease-in-out;
  }

  &::before {
    width: 100%;
    top: 0;
  }

  &::after {
    width: 80%;
    top: 20px;
    animation-delay: 1s;
  }

  &.lines-1 {
    top: 25%;
    left: 10%;
    transform: rotate(15deg);
  }

  &.lines-2 {
    bottom: 30%;
    right: 15%;
    transform: rotate(-20deg);
  }
}

// 脉冲圆点
.pulse-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 82, 217, 0.8) 0%, rgba(0, 82, 217, 0.3) 70%);
  animation: pulse-glow 3s infinite ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: inherit;
    animation: ripple 3s infinite ease-out;
  }

  &.dot-1 {
    top: 15%;
    left: 20%;
    animation-delay: 0s;
  }

  &.dot-2 {
    top: 40%;
    right: 25%;
    background: radial-gradient(circle, rgba(0, 168, 112, 0.8) 0%, rgba(0, 168, 112, 0.3) 70%);
    animation-delay: 1s;
  }

  &.dot-3 {
    bottom: 30%;
    left: 30%;
    background: radial-gradient(circle, rgba(79, 172, 254, 0.8) 0%, rgba(79, 172, 254, 0.3) 70%);
    animation-delay: 2s;
  }

  &.dot-4 {
    bottom: 15%;
    right: 20%;
    background: radial-gradient(circle, rgba(67, 233, 123, 0.8) 0%, rgba(67, 233, 123, 0.3) 70%);
    animation-delay: 0.5s;
  }
}

// ============ 关于我们页装饰 ============
// 流体斑点 - 更大更生动
.fluid-blob {
  position: absolute;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  opacity: 0.15;
  filter: blur(40px);
  animation: fluid-morph 20s infinite ease-in-out;

  &.blob-1 {
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    top: -200px;
    right: -200px;
    animation-delay: 0s;
  }

  &.blob-2 {
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    bottom: -150px;
    left: -150px;
    animation-delay: 5s;
  }

  &.blob-3 {
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    top: 35%;
    left: 45%;
    animation-delay: 10s;
  }

  &.blob-4 {
    width: 450px;
    height: 450px;
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    bottom: 25%;
    right: 15%;
    animation-delay: 15s;
  }
}

// 星光粒子
.star-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  box-shadow:
    0 0 10px rgba(255, 255, 255, 0.8),
    0 0 20px rgba(102, 126, 234, 0.6),
    0 0 30px rgba(79, 172, 254, 0.4);
  animation: twinkle 3s infinite ease-in-out;

  &.star-1 {
    top: 15%;
    left: 20%;
    animation-delay: 0s;
  }

  &.star-2 {
    top: 35%;
    right: 15%;
    animation-delay: 0.6s;
  }

  &.star-3 {
    bottom: 30%;
    left: 25%;
    animation-delay: 1.2s;
  }

  &.star-4 {
    bottom: 15%;
    right: 30%;
    animation-delay: 1.8s;
  }

  &.star-5 {
    top: 50%;
    left: 50%;
    animation-delay: 2.4s;
  }
}

// 能量环
.energy-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid;
  box-shadow: 0 0 20px currentColor, inset 0 0 20px currentColor;
  animation: energy-pulse 5s infinite ease-in-out;

  &.ring-1 {
    width: 400px;
    height: 400px;
    border-color: rgba(102, 126, 234, 0.3);
    top: 20%;
    left: 15%;
    animation-delay: 0s;
  }

  &.ring-2 {
    width: 350px;
    height: 350px;
    border-color: rgba(79, 172, 254, 0.3);
    bottom: 20%;
    right: 20%;
    animation-delay: 2.5s;
  }
}

// 渐变光晕
.gradient-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: glow-pulse 8s infinite ease-in-out;

  &.glow-1 {
    background: radial-gradient(circle, rgba(102, 126, 234, 0.6) 0%, transparent 70%);
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  &.glow-2 {
    background: radial-gradient(circle, rgba(240, 147, 251, 0.6) 0%, transparent 70%);
    top: 50%;
    right: 10%;
    animation-delay: 2.5s;
  }

  &.glow-3 {
    background: radial-gradient(circle, rgba(79, 172, 254, 0.6) 0%, transparent 70%);
    bottom: 15%;
    left: 40%;
    animation-delay: 5s;
  }
}

// 顶部导航
.top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 48px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .nav-left {
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);

        .logo-text {
          color: #0052D9;
        }
      }

      .logo-text {
        font-size: 20px;
        font-weight: 700;
        color: #1f2329;
        transition: color 0.3s ease;
      }
    }
  }

  .nav-center {
    display: flex;
    gap: 32px;

    .nav-link {
      font-size: 15px;
      font-weight: 500;
      color: #666;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        color: #0052d9;
        background: rgba(0, 82, 217, 0.05);
      }

      &.active {
        color: #0052d9;
        background: rgba(0, 82, 217, 0.1);
      }
    }
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .login-link {
      font-size: 14px;
      color: #666;
      text-decoration: none;
      transition: color 0.3s;

      &:hover {
        color: #0052d9;
      }
    }

    .try-button {
      padding: 8px 24px;
      font-weight: 500;
    }
  }
}

// Tab 内容区域
.tab-content {
  min-height: calc(100vh - 120px);
}

.tab-pane {
  position: relative;
  animation: fadeIn 0.3s ease-in-out;
}

// 产品介绍
.product-intro {
  position: relative;
  min-height: 600px;

  .hero-section {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 80px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-bottom: 32px;
  }

  .title-decoration {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    opacity: 0.8;
    animation: float 4s ease-in-out infinite;

    &.title-decoration-left {
      animation-delay: 0s;
    }

    &.title-decoration-right {
      animation-delay: 2s;
    }
  }

  .main-title {
    font-size: 56px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.2;
    margin: 0;
  }

  .subtitle-group {
    margin-bottom: 48px;

    .subtitle {
      font-size: 20px;
      color: #333;
      margin-bottom: 12px;
      font-weight: 500;
    }

    .description {
      font-size: 16px;
      color: #666;
    }
  }

  .form-section {
    display: flex;
    justify-content: center;
    gap: 16px;
    max-width: 500px;
    margin: 0 auto;

    .email-input {
      flex: 1;
    }
  }

  .features-section {
    position: relative;
    z-index: 1;
    padding: 80px 48px;
    max-width: 1200px;
    margin: 0 auto;

    .section-title {
      font-size: 32px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 48px;
      color: #1f2329;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
    }

    .feature-card {
      padding: 36px 28px;
      background: white;
      border-radius: 16px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 32px rgba(0, 82, 217, 0.12);
        border-color: rgba(0, 82, 217, 0.15);
      }

      .feature-icon {
        width: 56px;
        height: 56px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        margin-bottom: 24px;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }
      }

      &:hover .feature-icon::before {
        opacity: 1;
      }

      .feature-title {
        font-size: 20px;
        font-weight: 600;
        color: #1f2329;
        margin-bottom: 14px;
        line-height: 1.3;
      }

      .feature-desc {
        font-size: 15px;
        color: #646a73;
        line-height: 1.7;
      }
    }
  }
}

// 使用手册
.manual-content {
  position: relative;
  min-height: 600px;

  .manual-container {
    position: relative;
    z-index: 1;
    max-width: 1000px;
    margin: 0 auto;
    padding: 48px 24px;
  }

  .page-title {
    font-size: 40px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 12px;
    color: #1f2329;
  }

  .page-subtitle {
    font-size: 16px;
    text-align: center;
    color: #8a8e99;
    margin-bottom: 48px;
  }

  .manual-section {
    margin-bottom: 64px;
  }

  .manual-section-title {
    font-size: 28px;
    font-weight: 600;
    color: #1f2329;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 24px;
  }

  .step-card {
    padding: 28px 24px;
    background: white;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    text-align: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 82, 217, 0.1);
      border-color: rgba(0, 82, 217, 0.12);
    }

    .step-number {
      width: 52px;
      height: 52px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #0052D9 0%, #00BCD4 100%);
      color: white;
      font-size: 24px;
      font-weight: 700;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 82, 217, 0.25);
    }

    .step-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2329;
      margin-bottom: 10px;
      line-height: 1.3;
    }

    .step-desc {
      font-size: 14px;
      color: #646a73;
      line-height: 1.7;
    }
  }

  .guide-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .guide-item {
    padding: 32px;
    background: white;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    display: flex;
    gap: 24px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:hover {
      transform: translateX(4px);
      box-shadow: 0 8px 24px rgba(0, 82, 217, 0.08);
      border-color: rgba(0, 82, 217, 0.12);
    }

    .guide-icon {
      width: 56px;
      height: 56px;
      flex-shrink: 0;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .guide-content {
      flex: 1;
    }

    .guide-title {
      font-size: 20px;
      font-weight: 600;
      color: #1f2329;
      margin-bottom: 8px;
    }

    .guide-desc {
      font-size: 14px;
      color: #8a8e99;
      margin-bottom: 16px;
    }

    .guide-points {
      list-style: none;
      padding: 0;

      li {
        font-size: 14px;
        color: #666;
        padding: 8px 0;
        padding-left: 24px;
        position: relative;

        &::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #00a870;
          font-weight: 600;
        }
      }
    }
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .faq-item {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .faq-question {
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      color: #1f2329;

      svg {
        transition: transform 0.3s;

        &.rotated {
          transform: rotate(180deg);
        }
      }
    }

    .faq-answer {
      padding: 0 24px 20px;
      font-size: 14px;
      color: #666;
      line-height: 1.8;
      animation: slideDown 0.3s ease;
    }
  }
}

// 关于我们
.about-content {
  position: relative;
  min-height: 600px;

  .about-container {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 24px;
  }

  .page-title {
    font-size: 40px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 12px;
    color: #1f2329;
  }

  .page-subtitle {
    font-size: 16px;
    text-align: center;
    color: #8a8e99;
    margin-bottom: 64px;
  }

  .about-section {
    margin-bottom: 80px;
  }

  .about-section-title {
    font-size: 28px;
    font-weight: 600;
    color: #1f2329;
    margin-bottom: 32px;
    text-align: center;
  }

  .intro-section {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 48px;
    align-items: center;
    padding: 48px;
    background: white;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

    .intro-paragraph {
      font-size: 16px;
      line-height: 1.8;
      color: #666;
      margin-bottom: 20px;
    }

    .image-placeholder {
      width: 100%;
      aspect-ratio: 1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }

  .value-card {
    padding: 36px 28px;
    background: white;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    text-align: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 82, 217, 0.1);
      border-color: rgba(0, 82, 217, 0.12);
    }

    .value-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 24px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0052d9;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, transparent 0%, rgba(0, 82, 217, 0.1) 100%);
      }
    }

    .value-title {
      font-size: 20px;
      font-weight: 600;
      color: #1f2329;
      margin-bottom: 14px;
      line-height: 1.3;
    }

    .value-desc {
      font-size: 15px;
      color: #646a73;
      line-height: 1.7;
    }
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
  }

  .team-card {
    padding: 32px 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    text-align: center;

    .member-avatar {
      width: 80px;
      height: 80px;
      margin: 0 auto 16px;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .member-name {
      font-size: 18px;
      font-weight: 600;
      color: #1f2329;
      margin-bottom: 8px;
    }

    .member-role {
      font-size: 14px;
      color: #0052d9;
      margin-bottom: 12px;
    }

    .member-bio {
      font-size: 14px;
      color: #8a8e99;
      line-height: 1.6;
    }
  }

  .contact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .contact-card {
    padding: 28px 24px;
    background: white;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 82, 217, 0.08);
      border-color: rgba(0, 82, 217, 0.12);
    }

    .contact-icon {
      width: 52px;
      height: 52px;
      background: linear-gradient(135deg, rgba(0, 82, 217, 0.1) 0%, rgba(0, 188, 212, 0.1) 100%);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0052d9;
      flex-shrink: 0;
    }

    .contact-label {
      font-size: 13px;
      color: #8a8e99;
      margin-bottom: 6px;
      font-weight: 500;
    }

    .contact-value {
      font-size: 16px;
      font-weight: 600;
      color: #1f2329;
    }
  }
}

// 页脚
.page-footer {
  background: white;
  border-top: 1px solid #e7e7e7;
  padding: 24px 48px;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .footer-left {
      font-size: 14px;
      color: #8a8e99;
    }

    .footer-right {
      display: flex;
      gap: 24px;

      a {
        font-size: 14px;
        color: #666;
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
          color: #0052d9;
        }
      }
    }
  }
}

// ============ 动画定义 ============
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

// 产品页增强可见动画
@keyframes gentle-pulse {
  0%, 100% {
    opacity: 0.25;
    transform: scale(1);
  }
  50% {
    opacity: 0.35;
    transform: scale(1.08);
  }
}

@keyframes dot-float {
  0%, 100% {
    transform: translate(0, 0);
    opacity: 0.8;
  }
  25% {
    transform: translate(8px, -12px);
    opacity: 1;
  }
  50% {
    transform: translate(-5px, -20px);
    opacity: 0.9;
  }
  75% {
    transform: translate(10px, -15px);
    opacity: 1;
  }
}

@keyframes line-fade {
  0%, 100% {
    opacity: 0.5;
    transform: scaleX(0.8);
  }
  50% {
    opacity: 1;
    transform: scaleX(1.1);
  }
}

@keyframes circle-breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-10px);
  }
  75% {
    transform: translateY(-30px) translateX(5px);
  }
}

@keyframes morph {
  0%, 100% {
    border-radius: 50% 40% 60% 50%;
    transform: rotate(0deg) scale(1);
  }
  25% {
    border-radius: 40% 60% 50% 40%;
    transform: rotate(90deg) scale(1.05);
  }
  50% {
    border-radius: 60% 50% 40% 60%;
    transform: rotate(180deg) scale(0.95);
  }
  75% {
    border-radius: 50% 40% 60% 40%;
    transform: rotate(270deg) scale(1.02);
  }
}

// 脉冲圆环动画
@keyframes pulse-ring {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
}

// 粒子漂浮动画
@keyframes particle-float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(10px, -10px) rotate(90deg);
  }
  50% {
    transform: translate(-5px, -20px) rotate(180deg);
  }
  75% {
    transform: translate(-15px, -10px) rotate(270deg);
  }
}

// 光束滑动动画
@keyframes beam-slide {
  0% {
    transform: translateX(-100%) rotate(25deg);
    opacity: 0;
  }
  10% {
    opacity: 0.5;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    transform: translateX(200%) rotate(25deg);
    opacity: 0;
  }
}

// 波浪移动动画
@keyframes wave-move {
  0%, 100% {
    transform: translateX(0) scaleY(1);
  }
  50% {
    transform: translateX(-20px) scaleY(1.1);
  }
}

// 网格旋转动画
@keyframes grid-rotate {
  0% {
    transform: perspective(1000px) rotateY(-20deg) rotateX(0deg);
  }
  50% {
    transform: perspective(1000px) rotateY(-20deg) rotateX(10deg);
  }
  100% {
    transform: perspective(1000px) rotateY(-20deg) rotateX(0deg);
  }
}

// 线条扫描动画
@keyframes line-scan {
  0% {
    transform: scaleX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  50% {
    transform: scaleX(1);
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: scaleX(0);
    opacity: 0;
  }
}

// 脉冲发光动画
@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}

// 波纹扩散动画
@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
}

// 流体形变动画
@keyframes fluid-morph {
  0%, 100% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    transform: rotate(0deg) scale(1);
  }
  25% {
    border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
    transform: rotate(90deg) scale(1.1);
  }
  50% {
    border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
    transform: rotate(180deg) scale(0.9);
  }
  75% {
    border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
    transform: rotate(270deg) scale(1.05);
  }
}

// 闪烁动画
@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

// 能量脉冲动画
@keyframes energy-pulse {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.15) rotate(180deg);
    opacity: 0.6;
  }
}

// 光晕脉冲动画
@keyframes glow-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.4;
  }
}

// 响应式
@media (max-width: 768px) {
  .top-nav {
    padding: 12px 16px;

    .nav-center {
      display: none;
    }
  }

  .product-intro {
    .main-title {
      font-size: 36px;
    }

    .form-section {
      flex-direction: column;
      padding: 0 20px;

      .email-input,
      .submit-button {
        width: 100%;
      }
    }
  }

  .intro-section {
    grid-template-columns: 1fr !important;
  }
}
</style>
