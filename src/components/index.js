// 导入所有组件
import QInput from './QInput/index.vue'
import QRichText from './QRichText/index.vue'
import QSelect from './QSelect/index.vue'
import QUserSelect from './QUserSelect/index.vue'
import QSearch from './QSearch/index.vue'
import QTabs from './QTabs/index.vue'
import QTab from './QTab/index.vue'
import QButton from './QButton/index.vue'

// 所有组件列表
const components = [
  QInput,
  QRichText,
  QSelect,
  QUserSelect,
  QSearch,
  QTabs,
  QTab,
  QButton
]

// 定义 install 方法,用于全局注册
const install = (app) => {
  components.forEach(component => {
    app.component(component.name || component.__name, component)
  })
}

// 导出组件库
export {
  QInput,
  QRichText,
  QSelect,
  QUserSelect,
  QSearch,
  QTabs,
  QTab,
  QButton,
  install
}

// 默认导出
export default {
  install
}
