import { saveTrackingLog } from '@/api/tracking'
import { v4 as uuidv4 } from 'uuid'

/**
 * 埋点SDK
 */
class TrackingSDK {
  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.pageStartTime = Date.now()
    this.pageLoadTime = null
    this.isEnabled = true

    // 监听页面加载完成
    if (document.readyState === 'complete') {
      this.onPageLoad()
    } else {
      window.addEventListener('load', () => this.onPageLoad())
    }

    // 监听页面卸载（记录停留时间）
    window.addEventListener('beforeunload', () => this.onPageUnload())
  }

  /**
   * 获取或创建会话ID
   */
  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('dcp_session_id')
    if (!sessionId) {
      sessionId = uuidv4()
      sessionStorage.setItem('dcp_session_id', sessionId)
    }
    return sessionId
  }

  /**
   * 页面加载完成
   */
  onPageLoad() {
    this.pageLoadTime = Date.now() - this.pageStartTime
  }

  /**
   * 页面卸载
   */
  onPageUnload() {
    const stayTime = Date.now() - this.pageStartTime
    // 使用 sendBeacon 确保数据发送
    this.trackPageView({
      stayTime,
      isUnload: true
    })
  }

  /**
   * 获取浏览器信息
   */
  getBrowserInfo() {
    const ua = navigator.userAgent
    let browser = 'Unknown'
    let os = 'Unknown'
    let deviceType = 'desktop'

    // 检测浏览器
    if (ua.indexOf('Firefox') > -1) {
      browser = 'Firefox'
    } else if (ua.indexOf('Chrome') > -1) {
      browser = 'Chrome'
    } else if (ua.indexOf('Safari') > -1) {
      browser = 'Safari'
    } else if (ua.indexOf('Edge') > -1) {
      browser = 'Edge'
    } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
      browser = 'IE'
    }

    // 检测操作系统
    if (ua.indexOf('Win') > -1) {
      os = 'Windows'
    } else if (ua.indexOf('Mac') > -1) {
      os = 'MacOS'
    } else if (ua.indexOf('Linux') > -1) {
      os = 'Linux'
    } else if (ua.indexOf('Android') > -1) {
      os = 'Android'
    } else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
      os = 'iOS'
    }

    // 检测设备类型
    if (ua.indexOf('Mobile') > -1 || ua.indexOf('Android') > -1 || ua.indexOf('iPhone') > -1) {
      deviceType = 'mobile'
    } else if (ua.indexOf('Tablet') > -1 || ua.indexOf('iPad') > -1) {
      deviceType = 'tablet'
    }

    return { browser, os, deviceType }
  }

  /**
   * 基础埋点方法
   */
  async track(data) {
    if (!this.isEnabled) {
      return
    }

    const { browser, os, deviceType } = this.getBrowserInfo()

    const trackingData = {
      ...data,
      sessionId: this.sessionId,
      browser,
      os,
      deviceType,
      pageUrl: window.location.href,
      pageTitle: document.title,
      pageReferrer: document.referrer || null
    }

    try {
      // 如果是页面卸载，使用 sendBeacon
      if (data.isUnload) {
        const blob = new Blob([JSON.stringify(trackingData)], { type: 'application/json' })
        navigator.sendBeacon('/api/tracking/save', blob)
      } else {
        await saveTrackingLog(trackingData)
      }
    } catch (error) {
      console.error('[Tracking] 埋点发送失败:', error)
    }
  }

  /**
   * 页面访问埋点
   */
  trackPageView(extra = {}) {
    this.track({
      eventType: 'page_view',
      eventName: `访问页面: ${document.title}`,
      eventCategory: '页面浏览',
      loadTime: this.pageLoadTime,
      ...extra
    })
  }

  /**
   * 登录埋点
   */
  trackLogin(username) {
    this.track({
      eventType: 'login',
      eventName: '用户登录',
      eventCategory: '用户行为',
      extraData: JSON.stringify({ username })
    })
  }

  /**
   * 登出埋点
   */
  trackLogout(username) {
    this.track({
      eventType: 'logout',
      eventName: '用户登出',
      eventCategory: '用户行为',
      extraData: JSON.stringify({ username })
    })
  }

  /**
   * 按钮点击埋点
   */
  trackButtonClick(buttonInfo) {
    this.track({
      eventType: 'button_click',
      eventName: `点击按钮: ${buttonInfo.text || buttonInfo.id}`,
      eventCategory: '用户交互',
      elementId: buttonInfo.id,
      elementClass: buttonInfo.className,
      elementText: buttonInfo.text,
      extraData: buttonInfo.extra ? JSON.stringify(buttonInfo.extra) : null
    })
  }

  /**
   * 表单提交埋点
   */
  trackFormSubmit(formInfo) {
    this.track({
      eventType: 'form_submit',
      eventName: `提交表单: ${formInfo.name || formInfo.id}`,
      eventCategory: '用户交互',
      elementId: formInfo.id,
      elementClass: formInfo.className,
      extraData: formInfo.extra ? JSON.stringify(formInfo.extra) : null
    })
  }

  /**
   * 文件上传埋点
   */
  trackFileUpload(fileInfo) {
    this.track({
      eventType: 'file_upload',
      eventName: `上传文件: ${fileInfo.fileName}`,
      eventCategory: '用户交互',
      extraData: JSON.stringify({
        fileName: fileInfo.fileName,
        fileSize: fileInfo.fileSize,
        fileType: fileInfo.fileType
      })
    })
  }

  /**
   * 自定义埋点
   */
  trackCustom(eventName, eventData = {}) {
    this.track({
      eventType: 'custom',
      eventName,
      eventCategory: '自定义事件',
      ...eventData
    })
  }

  /**
   * 启用埋点
   */
  enable() {
    this.isEnabled = true
  }

  /**
   * 禁用埋点
   */
  disable() {
    this.isEnabled = false
  }
}

// 创建全局实例
const tracking = new TrackingSDK()

// 自动监听路由变化（Vue Router）
export function setupTrackingRouter(router) {
  let lastPageUrl = null
  let lastPageTitle = null

  router.afterEach((to, from) => {
    // 如果有上一个页面，记录停留时间
    if (lastPageUrl && from.path !== '/') {
      const stayTime = Date.now() - tracking.pageStartTime
      tracking.track({
        eventType: 'page_view',
        eventName: `访问页面: ${lastPageTitle}`,
        eventCategory: '页面浏览',
        pageUrl: lastPageUrl,
        pageTitle: lastPageTitle,
        pageReferrer: from.path || null,
        stayTime,
        loadTime: tracking.pageLoadTime
      })
    }

    // 重置页面开始时间
    tracking.pageStartTime = Date.now()
    tracking.pageLoadTime = null

    // 记录当前页面信息
    lastPageUrl = to.fullPath
    lastPageTitle = to.meta?.title || document.title

    // 等待页面加载完成，记录加载时间
    setTimeout(() => {
      tracking.pageLoadTime = Date.now() - tracking.pageStartTime
    }, 100)
  })
}

// 自动监听点击事件
export function setupTrackingClick() {
  document.addEventListener('click', (event) => {
    const target = event.target

    // 查找最近的可点击元素
    let element = target
    while (element && element !== document.body) {
      // 检查是否是按钮或带有 data-tracking 属性的元素
      if (
        element.tagName === 'BUTTON' ||
        element.getAttribute('data-tracking') === 'true'
      ) {
        const trackingName = element.getAttribute('data-tracking-name')
        if (trackingName) {
          tracking.trackButtonClick({
            id: element.id,
            className: element.className,
            text: element.textContent?.trim() || trackingName,
            extra: {
              trackingName
            }
          })
        }
        break
      }
      element = element.parentElement
    }
  })
}

export default tracking
