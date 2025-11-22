<template>
  <div class="login-container">
    <!-- 主内容区 -->
    <div class="login-wrapper">
      <!-- 左侧品牌区 -->
      <div class="login-brand">
        <div class="brand-content">
          <!-- Logo和标题 -->
          <div class="brand-header">
            <div class="logo">
              <div class="logo-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="8" fill="url(#logo-gradient)"/>
                  <path d="M12 14H28M12 20H24M12 26H28" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                  <defs>
                    <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40">
                      <stop offset="0%" stop-color="#667eea"/>
                      <stop offset="100%" stop-color="#764ba2"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="logo-text">
                <h1>需求管理平台</h1>
                <p>DCP - Demand Control Platform</p>
              </div>
            </div>
          </div>

          <!-- 主视觉特性 -->
          <div class="brand-features">
            <h2>高效协作，敏捷交付</h2>
            <p class="brand-desc">为团队打造的现代化需求管理工具，让项目管理更简单</p>

            <div class="feature-list">
              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="feature-content">
                  <h3>多视图管理</h3>
                  <p>看板、甘特图、日历等多种视图</p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                    <path d="M23 21V19C23 17.9391 22.5786 16.9217 21.8284 16.1716C21.0783 15.4214 20.0609 15 19 15C18.5 15 18 15.1 17.5 15.3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="feature-content">
                  <h3>团队协作</h3>
                  <p>实时同步，高效沟通</p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="feature-content">
                  <h3>数据安全</h3>
                  <p>企业级安全保障</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部装饰 -->
          <div class="brand-decoration">
            <div class="decoration-dot"></div>
            <div class="decoration-dot"></div>
            <div class="decoration-dot"></div>
          </div>
        </div>
      </div>

      <!-- 右侧登录区 -->
      <div class="login-panel">
        <div class="login-card">
          <div class="login-header">
            <h2>欢迎回来</h2>
            <p>登录您的账号以继续使用</p>
          </div>

          <!-- Tab切换 -->
          <t-tabs v-model="activeTab" class="login-tabs">
            <t-tab-panel value="account" label="账号登录">
              <t-form
                ref="loginFormRef"
                :data="loginForm"
                :rules="loginRules"
                class="login-form"
                label-width="0"
              >
                <t-form-item name="username">
                  <t-input
                    v-model="loginForm.username"
                    placeholder="请输入邮箱"
                    size="large"
                  >
                    <template #prefix-icon>
                      <t-icon name="user" />
                    </template>
                  </t-input>
                </t-form-item>

                <t-form-item name="password">
                  <t-input
                    v-model="loginForm.password"
                    type="password"
                    placeholder="请输入密码"
                    size="large"
                  >
                    <template #prefix-icon>
                      <t-icon name="lock-on" />
                    </template>
                  </t-input>
                </t-form-item>

                <div class="form-options">
                  <t-checkbox v-model="loginForm.remember">记住我</t-checkbox>
                  <t-link theme="primary" hover="color" size="small">忘记密码？</t-link>
                </div>

                <t-button
                  theme="primary"
                  size="large"
                  :loading="loading"
                  block
                  @click="handleLogin"
                  class="login-btn"
                >
                  登录
                </t-button>
              </t-form>
            </t-tab-panel>

            <t-tab-panel value="register" label="邮箱注册">
              <t-form
                ref="registerFormRef"
                :data="registerForm"
                :rules="registerRules"
                class="login-form"
                label-width="0"
              >
                <t-form-item name="email">
                  <t-input
                    v-model="registerForm.email"
                    placeholder="请输入邮箱"
                    size="large"
                  >
                    <template #prefix-icon>
                      <t-icon name="mail" />
                    </template>
                  </t-input>
                </t-form-item>

                <t-form-item name="code">
                  <t-input
                    v-model="registerForm.code"
                    placeholder="请输入邮箱验证码"
                    size="large"
                  >
                    <template #prefix-icon>
                      <t-icon name="secured" />
                    </template>
                    <template #suffix>
                      <t-button
                        theme="primary"
                        variant="text"
                        size="small"
                        :disabled="registerCountdown > 0"
                        @click="sendEmailCode"
                      >
                        {{ registerCountdown > 0 ? `${registerCountdown}s` : '获取验证码' }}
                      </t-button>
                    </template>
                  </t-input>
                </t-form-item>

                <t-form-item name="password">
                  <t-input
                    v-model="registerForm.password"
                    type="password"
                    placeholder="请输入密码"
                    size="large"
                  >
                    <template #prefix-icon>
                      <t-icon name="lock-on" />
                    </template>
                  </t-input>
                </t-form-item>

                <t-form-item name="confirmPassword">
                  <t-input
                    v-model="registerForm.confirmPassword"
                    type="password"
                    placeholder="请再次输入密码"
                    size="large"
                  >
                    <template #prefix-icon>
                      <t-icon name="lock-on" />
                    </template>
                  </t-input>
                </t-form-item>

                <t-button
                  theme="primary"
                  size="large"
                  :loading="registerLoading"
                  block
                  class="login-btn"
                  @click="handleRegister"
                >
                  注册
                </t-button>
              </t-form>
            </t-tab-panel>
          </t-tabs>

          <!-- 注册提示 -->
          <div class="login-footer">
            <span class="footer-text">没有账号？</span>
            <t-link theme="primary" hover="color" @click="goToRegister">立即注册</t-link>
          </div>

          <!-- 底部链接 -->
          <div class="login-links">
            <t-link theme="default" hover="color" size="small">帮助中心</t-link>
            <span class="separator">·</span>
            <t-link theme="default" hover="color" size="small">隐私政策</t-link>
            <span class="separator">·</span>
            <t-link theme="default" hover="color" size="small">服务条款</t-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { useUserStore } from '@/store/user.js'
import { sendVerificationCode, register } from '@/api/auth.js'
import tracking from '@/utils/tracking'

const router = useRouter()
const route = useRoute()
const authStore = useUserStore()

const activeTab = ref('account')
const loginFormRef = ref(null)
const registerFormRef = ref(null)
const loading = ref(false)
const registerLoading = ref(false)
const registerCountdown = ref(0)

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

const registerForm = reactive({
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const registerRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (val) => val === registerForm.password,
      message: '两次输入的密码不一致',
      trigger: 'blur'
    }
  ]
}

const handleLogin = async () => {
  const valid = await loginFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await authStore.login({
      username: loginForm.username,
      password: loginForm.password,
      remember: loginForm.remember
    })

    // 登录成功埋点
    tracking.trackLogin(loginForm.username)

    MessagePlugin.success('登录成功')

    // 获取重定向地址，如果没有则跳转到首页
    // 跳转到首页，让路由守卫处理动态路由加载
    const redirect = route.query.redirect || '/home'
    router.push(redirect)
  } catch (error) {
    MessagePlugin.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

// 发送邮箱验证码
const sendEmailCode = async () => {
  if (!registerForm.email) {
    MessagePlugin.warning('请输入邮箱')
    return
  }

  // 验证邮箱格式
  const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  if (!emailRegex.test(registerForm.email)) {
    MessagePlugin.warning('请输入正确的邮箱格式')
    return
  }

  try {
    await sendVerificationCode(registerForm.email)
    MessagePlugin.success('验证码已发送至您的邮箱')

    // 启动倒计时
    registerCountdown.value = 60
    const timer = setInterval(() => {
      registerCountdown.value--
      if (registerCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    MessagePlugin.error(error.message || '发送验证码失败')
  }
}

// 处理注册
const handleRegister = async () => {
  const valid = await registerFormRef.value?.validate()
  if (!valid) return

  registerLoading.value = true
  try {
    await register({
      email: registerForm.email,
      code: registerForm.code,
      password: registerForm.password
    })

    MessagePlugin.success('注册成功，即将跳转到登录页面')

    // 2秒后切换到登录tab
    setTimeout(() => {
      activeTab.value = 'account'
      // 清空注册表单
      registerForm.email = ''
      registerForm.code = ''
      registerForm.password = ''
      registerForm.confirmPassword = ''
    }, 2000)
  } catch (error) {
    MessagePlugin.error(error.message || '注册失败')
  } finally {
    registerLoading.value = false
  }
}

const goToRegister = () => {
  activeTab.value = 'register'
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  background: #f8f9fa;

  .login-wrapper {
    display: flex;
    width: 100%;
    min-height: 100vh;

    // 左侧品牌区 - 参考 Linear, Notion 的设计
    .login-brand {
      flex: 1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      // 背景装饰网格
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        background-size: 50px 50px;
        opacity: 0.5;
      }

      .brand-content {
        position: relative;
        z-index: 1;
        max-width: 600px;
        padding: 60px;
        color: #fff;

        .brand-header {
          margin-bottom: 60px;

          .logo {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 48px;

            .logo-icon {
              flex-shrink: 0;
              filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
            }

            .logo-text {
              h1 {
                font-size: 32px;
                font-weight: 700;
                margin: 0 0 4px 0;
                letter-spacing: -0.5px;
              }

              p {
                font-size: 14px;
                opacity: 0.85;
                margin: 0;
                font-weight: 400;
                letter-spacing: 0.5px;
              }
            }
          }
        }

        .brand-features {
          h2 {
            font-size: 36px;
            font-weight: 700;
            margin: 0 0 16px 0;
            line-height: 1.2;
            letter-spacing: -0.8px;
          }

          .brand-desc {
            font-size: 18px;
            opacity: 0.9;
            margin: 0 0 48px 0;
            line-height: 1.6;
          }

          .feature-list {
            display: flex;
            flex-direction: column;
            gap: 24px;

            .feature-item {
              display: flex;
              gap: 16px;
              padding: 20px;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              border-radius: 12px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              transition: all 0.3s ease;

              &:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: translateX(8px);
              }

              .feature-icon {
                flex-shrink: 0;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 10px;
                color: #fff;
              }

              .feature-content {
                flex: 1;

                h3 {
                  font-size: 16px;
                  font-weight: 600;
                  margin: 0 0 4px 0;
                }

                p {
                  font-size: 14px;
                  opacity: 0.85;
                  margin: 0;
                }
              }
            }
          }
        }

        .brand-decoration {
          position: absolute;
          bottom: 60px;
          left: 60px;
          display: flex;
          gap: 8px;

          .decoration-dot {
            width: 8px;
            height: 8px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;

            &:nth-child(2) {
              animation-delay: 0.3s;
            }

            &:nth-child(3) {
              animation-delay: 0.6s;
            }
          }
        }
      }
    }

    // 右侧登录面板 - 参考飞书、Jira的简洁设计
    .login-panel {
      width: 480px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;

      .login-card {
        width: 100%;
        max-width: 380px;

        .login-header {
          margin-bottom: 32px;

          h2 {
            font-size: 28px;
            font-weight: 700;
            color: #1f2329;
            margin: 0 0 8px 0;
            letter-spacing: -0.5px;
          }

          p {
            font-size: 14px;
            color: #8a8e99;
            margin: 0;
          }
        }

        .login-tabs {
          :deep(.t-tabs__nav) {
            margin-bottom: 32px;
          }

          :deep(.t-tab-panel) {
            padding: 0;
          }

          :deep(.t-tabs__nav-item) {
            font-weight: 500;
          }
        }

        .login-form {
          :deep(.t-form__item) {
            margin-bottom: 20px;
          }

          :deep(.t-input) {
            border-radius: 8px;
            border-color: #e7e7e7;
            transition: all 0.3s ease;
            height: 48px;

            &:hover {
              border-color: #667eea;
            }

            &.t-is-focused {
              border-color: #667eea;
              box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
          }

          .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            font-size: 14px;
          }

          .login-btn {
            margin-bottom: 24px;
            font-weight: 600;
            height: 48px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.3s ease;
            letter-spacing: 0.5px;

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
            }

            &:active {
              transform: translateY(0);
            }
          }
        }

        .login-footer {
          text-align: center;
          padding: 24px 0;
          border-top: 1px solid #f0f0f0;
          font-size: 14px;

          .footer-text {
            color: #8a8e99;
            margin-right: 8px;
          }
        }

        .login-links {
          text-align: center;
          font-size: 13px;
          color: #8a8e99;
          padding-top: 16px;

          .separator {
            margin: 0 8px;
            color: #d9d9d9;
          }

          :deep(.t-link) {
            color: #8a8e99;

            &:hover {
              color: #667eea;
            }
          }
        }
      }
    }
  }

  // 响应式适配
  @media (max-width: 1200px) {
    .login-wrapper {
      .login-brand {
        .brand-content {
          padding: 40px;

          .brand-features {
            h2 {
              font-size: 32px;
            }

            .brand-desc {
              font-size: 16px;
            }
          }
        }
      }
    }
  }

  @media (max-width: 1024px) {
    .login-wrapper {
      flex-direction: column-reverse;

      .login-brand {
        min-height: 40vh;

        .brand-content {
          padding: 40px;

          .brand-header {
            margin-bottom: 40px;

            .logo {
              margin-bottom: 32px;

              .logo-text {
                h1 {
                  font-size: 24px;
                }
              }
            }
          }

          .brand-features {
            h2 {
              font-size: 28px;
            }

            .brand-desc {
              font-size: 14px;
              margin-bottom: 32px;
            }

            .feature-list {
              gap: 16px;

              .feature-item {
                padding: 16px;

                .feature-icon {
                  width: 40px;
                  height: 40px;
                }
              }
            }
          }

          .brand-decoration {
            bottom: 40px;
            left: 40px;
          }
        }
      }

      .login-panel {
        width: 100%;
        min-height: 60vh;
      }
    }
  }

  @media (max-width: 768px) {
    .login-wrapper {
      .login-brand {
        min-height: 35vh;

        .brand-content {
          padding: 24px;

          .brand-header {
            margin-bottom: 24px;

            .logo {
              margin-bottom: 24px;

              .logo-text {
                h1 {
                  font-size: 20px;
                }

                p {
                  font-size: 12px;
                }
              }
            }
          }

          .brand-features {
            h2 {
              font-size: 24px;
            }

            .brand-desc {
              font-size: 13px;
              margin-bottom: 24px;
            }

            .feature-list {
              gap: 12px;

              .feature-item {
                .feature-icon {
                  width: 36px;
                  height: 36px;

                  svg {
                    width: 20px;
                    height: 20px;
                  }
                }

                .feature-content {
                  h3 {
                    font-size: 14px;
                  }

                  p {
                    font-size: 12px;
                  }
                }
              }
            }
          }

          .brand-decoration {
            display: none;
          }
        }
      }

      .login-panel {
        padding: 24px;

        .login-card {
          .login-header {
            h2 {
              font-size: 24px;
            }
          }
        }
      }
    }
  }
}

// 动画
@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}
</style>
