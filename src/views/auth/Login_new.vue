<template>
  <div class="login-container">
    <!-- 顶部导航 -->
    <div class="login-header">
      <div class="header-content">
        <div class="logo">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="8" fill="url(#logo-gradient)"/>
            <path d="M12 14H28M12 20H24M12 26H28" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <defs>
              <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stop-color="#0052D9"/>
                <stop offset="100%" stop-color="#0052D9"/>
              </linearGradient>
            </defs>
          </svg>
          <span class="logo-text">需求管理平台</span>
        </div>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="login-main">
      <div class="login-box">
        <!-- 登录卡片 -->
        <div class="login-card">
          <!-- Tab切换 -->
          <t-tabs v-model="activeTab" class="login-tabs" size="large">
            <!-- 登录Tab -->
            <t-tab-panel value="login" label="登录">
              <div class="tab-content">
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
                      placeholder="邮箱"
                      size="large"
                      clearable
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
                      clearable
                    >
                      <template #prefix-icon>
                        <t-icon name="lock-on" />
                      </template>
                    </t-input>
                  </t-form-item>

                  <div class="form-options">
                    <t-checkbox v-model="loginForm.remember">记住我</t-checkbox>
                    <t-link theme="primary" hover="color">忘记密码？</t-link>
                  </div>

                  <t-button
                    theme="primary"
                    size="large"
                    :loading="loading"
                    block
                    @click="handleLogin"
                    class="submit-btn"
                  >
                    登录
                  </t-button>
                </t-form>
              </div>
            </t-tab-panel>

            <!-- 注册Tab -->
            <t-tab-panel value="register" label="注册">
              <div class="tab-content">
                <t-form
                  ref="registerFormRef"
                  :data="registerForm"
                  :rules="registerRules"
                  class="register-form"
                  label-width="0"
                >
                  <t-form-item name="email">
                    <t-input
                      v-model="registerForm.email"
                      placeholder="请输入邮箱"
                      size="large"
                      clearable
                    >
                      <template #prefix-icon>
                        <t-icon name="mail" />
                      </template>
                    </t-input>
                  </t-form-item>

                  <t-form-item name="code">
                    <t-input
                      v-model="registerForm.code"
                      placeholder="请输入验证码"
                      size="large"
                      maxlength="6"
                      clearable
                    >
                      <template #prefix-icon>
                        <t-icon name="secured" />
                      </template>
                      <template #suffix>
                        <t-button
                          variant="text"
                          :disabled="registerCountdown > 0"
                          @click="sendEmailCode"
                          class="code-btn"
                        >
                          {{ registerCountdown > 0 ? `${registerCountdown}s后重发` : '获取验证码' }}
                        </t-button>
                      </template>
                    </t-input>
                  </t-form-item>

                  <t-form-item name="password">
                    <t-input
                      v-model="registerForm.password"
                      type="password"
                      placeholder="请设置密码（6-20位）"
                      size="large"
                      clearable
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
                      clearable
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
                    class="submit-btn"
                    @click="handleRegister"
                  >
                    注册
                  </t-button>
                </t-form>
              </div>
            </t-tab-panel>
          </t-tabs>

          <!-- 底部链接 -->
          <div class="card-footer">
            <t-link theme="default" hover="color" size="small">用户协议</t-link>
            <span class="separator">|</span>
            <t-link theme="default" hover="color" size="small">隐私政策</t-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部版权 -->
    <div class="login-footer">
      <div class="footer-content">
        <p>© 2024 需求管理平台 DCP. All Rights Reserved.</p>
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

const activeTab = ref('login')
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
  username: [{ required: true, message: '请输入邮箱/手机号', trigger: 'blur' }],
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
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    { max: 20, message: '密码长度不能超过20位', trigger: 'blur' }
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

  const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  if (!emailRegex.test(registerForm.email)) {
    MessagePlugin.warning('请输入正确的邮箱格式')
    return
  }

  try {
    const res = await sendVerificationCode({ email: registerForm.email })
    if (res.success || res.code === 200) {
      MessagePlugin.success('验证码已发送，请查收邮箱')

      // 开始倒计时
      registerCountdown.value = 60
      const timer = setInterval(() => {
        registerCountdown.value--
        if (registerCountdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    } else {
      MessagePlugin.error(res.message || '发送失败')
    }
  } catch (error) {
    MessagePlugin.error('发送验证码失败')
  }
}

// 注册
const handleRegister = async () => {
  const valid = await registerFormRef.value.validate()
  if (!valid) return

  registerLoading.value = true
  try {
    const res = await register({
      email: registerForm.email,
      code: registerForm.code,
      password: registerForm.password
    })

    if (res.success || res.code === 200) {
      MessagePlugin.success('注册成功，请登录')
      activeTab.value = 'login'
      // 清空注册表单
      registerForm.email = ''
      registerForm.code = ''
      registerForm.password = ''
      registerForm.confirmPassword = ''
    } else {
      MessagePlugin.error(res.message || '注册失败')
    }
  } catch (error) {
    MessagePlugin.error(error.message || '注册失败')
  } finally {
    registerLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8edf3 100%);

  // 顶部导航
  .login-header {
    height: 64px;
    background: #fff;
    border-bottom: 1px solid #e7e7e7;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    .header-content {
      max-width: 1200px;
      height: 100%;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;

      .logo {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;

        svg {
          flex-shrink: 0;
        }

        .logo-text {
          font-size: 18px;
          font-weight: 600;
          color: #000;
        }
      }
    }
  }

  // 主体内容
  .login-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;

    .login-box {
      width: 100%;
      max-width: 400px;

      .login-card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        padding: 40px;

        .login-tabs {
          :deep(.t-tabs__nav-container) {
            margin-bottom: 32px;
          }

          :deep(.t-tabs__nav) {
            width: 100%;
            justify-content: center;
          }

          :deep(.t-tabs__nav-item) {
            font-size: 16px;
            font-weight: 500;
            padding: 12px 40px;
          }

          :deep(.t-tabs__nav-item-wrapper) {
            justify-content: center;
          }

          .tab-content {
            .login-form,
            .register-form {
              :deep(.t-form-item) {
                margin-bottom: 20px;
              }

              :deep(.t-input) {
                height: 48px;

                input {
                  font-size: 14px;
                }
              }

              .form-options {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;

                :deep(.t-checkbox) {
                  font-size: 14px;
                  color: #646a73;
                }

                :deep(.t-link) {
                  font-size: 14px;
                }
              }

              .code-btn {
                white-space: nowrap;
                padding: 0 8px;
                font-size: 13px;
                color: #0052d9;

                &:disabled {
                  color: #bbb;
                }
              }

              .submit-btn {
                height: 48px;
                font-size: 16px;
                font-weight: 500;
                margin-top: 8px;
              }
            }
          }
        }

        .card-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e7e7e7;
          text-align: center;

          :deep(.t-link) {
            font-size: 13px;
            color: #646a73;
          }

          .separator {
            margin: 0 12px;
            color: #dcdcdc;
          }
        }
      }
    }
  }

  // 底部版权
  .login-footer {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;

    .footer-content {
      text-align: center;

      p {
        margin: 0;
        font-size: 13px;
        color: #646a73;
      }
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .login-container {
    .login-main {
      padding: 20px 16px;

      .login-box {
        max-width: 100%;

        .login-card {
          padding: 24px;
        }
      }
    }
  }
}
</style>
