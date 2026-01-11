<template>
  <div class="self-enterprises-shell">
    <div class="center-card-wrapper create-visible">
      <div class="brand">
        <AppLogo :clickable="false" />
      </div>
      <t-card class="enterprise-card" shadow="always">
        <div class="card-body">
          <div class="create-form no-panel">
            <div class="form-row form-top">
              <div class="create-title">输入团队或企业名称</div>
            </div>

            <div class="form-row">
              <label class="field-label">企业名称</label>
              <t-input v-model="form.company_name" placeholder="企业名称" />
            </div>

            <div class="form-row">
              <label class="field-label">请选择行业</label>
              <t-cascader
                v-model="industryValues"
                :options="industryOptions"
                placeholder="请选择行业"
                clearable
                @change="onIndustryChange"
              />
            </div>

            <div class="form-row">
              <label class="field-label">公司规模</label>
              <t-select v-model="form.company_size" :options="[{label:'1 ~ 10 人',value:'1-10'},{label:'11 ~ 50 人',value:'11-50'},{label:'50 人以上',value:'50+'}]" />
            </div>

            <div class="form-row form-actions">
              <div class="actions-left">
                <t-button theme="default" variant="outline" @click="cancelCreateForm">返回</t-button>
              </div>
              <div class="actions-right">
                <t-button theme="primary" :loading="submitting" @click="submitCreate">完成创建</t-button>
              </div>
            </div>
          </div>
        </div>
      </t-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { createCompany as apiCreateCompany } from '@/api/company.js'
import AppLogo from '@/components/AppLogo.vue'

const router = useRouter()
const submitting = ref(false)
const form = ref({
  company_name: '',
  company_code: '',
  industry: '',
  company_size: '1-10'
})
const industryValues = ref([])
const industryOptions = ref([
  {
    label: '互联网/信息技术',
    value: 'internet',
    children: [
      { label: '计算机软件', value: 'internet_software' },
      { label: '硬件设施服务', value: 'internet_hardware_service' },
      { label: '电子商务', value: 'internet_ecommerce' },
      { label: '移动互联网', value: 'internet_mobile' },
      { label: '社交/媒体', value: 'internet_social' },
      { label: '搜索/广告', value: 'internet_ad' }
    ]
  },
  {
    label: '教育/培训',
    value: 'education',
    children: [
      { label: '学前教育', value: 'education_preschool' },
      { label: 'K12教育', value: 'education_k12' },
      { label: '职业培训', value: 'education_vocational' },
      { label: '在线教育', value: 'education_online' }
    ]
  },
  {
    label: '制造业',
    value: 'manufacturing',
    children: [
      { label: '电子制造', value: 'manufacturing_electronics' },
      { label: '机械/重工', value: 'manufacturing_heavy' },
      { label: '家电/数码', value: 'manufacturing_appliances' },
      { label: '工业零部件', value: 'manufacturing_parts' }
    ]
  },
  {
    label: '贸易/批发/零售',
    value: 'trade',
    children: [
      { label: '批发', value: 'trade_wholesale' },
      { label: '零售/商超', value: 'trade_retail' },
      { label: '跨境电商', value: 'trade_crossborder' }
    ]
  },
  {
    label: '房地产/建筑',
    value: 'real_estate',
    children: [
      { label: '房地产开发', value: 'real_estate_develop' },
      { label: '建筑设计', value: 'construction_design' },
      { label: '建材', value: 'construction_material' }
    ]
  },
  {
    label: '金融',
    value: 'finance',
    children: [
      { label: '银行', value: 'finance_bank' },
      { label: '保险', value: 'finance_insurance' },
      { label: '证券/投资', value: 'finance_securities' },
      { label: '基金/理财', value: 'finance_fund' }
    ]
  },
  {
    label: '物流/运输/仓储',
    value: 'logistics',
    children: [
      { label: '快递/同城配送', value: 'logistics_express' },
      { label: '供应链/仓储', value: 'logistics_warehouse' },
      { label: '货运/运输', value: 'logistics_transport' }
    ]
  },
  {
    label: '餐饮/酒店/旅游',
    value: 'hospitality',
    children: [
      { label: '餐饮', value: 'hospitality_catering' },
      { label: '酒店/住宿', value: 'hospitality_hotel' },
      { label: '旅游/景区', value: 'hospitality_travel' }
    ]
  },
  {
    label: '医疗/健康',
    value: 'health',
    children: [
      { label: '医疗机构', value: 'health_medical' },
      { label: '医疗器械', value: 'health_device' },
      { label: '医药/制药', value: 'health_pharma' }
    ]
  },
  {
    label: '传媒/娱乐/文体',
    value: 'media',
    children: [
      { label: '影视/娱乐', value: 'media_film' },
      { label: '游戏', value: 'media_game' },
      { label: '新闻/出版', value: 'media_news' }
    ]
  },
  {
    label: '能源/环境/农业',
    value: 'energy',
    children: [
      { label: '新能源', value: 'energy_new' },
      { label: '传统能源', value: 'energy_traditional' },
      { label: '农业', value: 'agriculture' }
    ]
  },
  {
    label: '企业服务/软件/咨询',
    value: 'enterprise_service',
    children: [
      { label: '咨询/顾问', value: 'service_consulting' },
      { label: '人力资源', value: 'service_hr' },
      { label: '财务/法务', value: 'service_finance' }
    ]
  }
])

const onIndustryChange = (val) => {
  const values = Array.isArray(val) ? val : [val]
  form.value.industry = values.length ? values.join('|') : ''
}

const cancelCreateForm = () => {
  router.push('/self/enterprise')
}

const submitCreate = async () => {
  if (!form.value.company_name) {
    await MessagePlugin.warning('请输入企业名称')
    return
  }
  submitting.value = true
  try {
    const payload = {
      company_name: form.value.company_name,
      company_code: form.value.company_code || undefined,
      industry: form.value.industry || undefined,
      company_size: form.value.company_size || undefined
    }
    const res = await apiCreateCompany(payload)
    if (res && (res.success || res.code === 200)) {
      await MessagePlugin.success('创建成功')
      router.push('/workspace')
    } else {
      await MessagePlugin.error(res?.message || '创建失败')
    }
  } catch (error) {
    console.error('创建企业失败:', error)
    await MessagePlugin.error('创建企业失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* reuse compact create form styles */
.self-enterprises-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #f7fbff 0%, #eef7ff 100%);
  padding: 40px 20px;
  font-family: "Google Sans", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #202124;
}
.center-card-wrapper.create-visible {
  transform: translateY(0) !important;
  width: 422px;
  margin: 0 auto;
}
.brand { text-align: center; margin-bottom: 18px; margin-top: -44px; }
.brand :deep(.app-logo) {
  transform-origin: center;
  transform: scale(0.67);
}
.enterprise-card {
  border-radius: 32px;
  padding: 8px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(60,64,67,0.08), 0 1px 10px rgba(60,64,67,0.04);
  border: 1px solid rgba(60,64,67,0.06);
  width: 422px;
  height: 600px;
  min-width: 422px;
  min-height: 600px;
  overflow: hidden;
  z-index: 10;
}
.create-form {
  display:flex;
  flex-direction:column;
  gap:12px;
  padding:12px;
  max-width:360px;
  margin:0 auto;
}
.form-row { display:flex; flex-direction:column; gap:6px; }
.form-actions { display:flex; gap:8px; justify-content:space-between; margin-top:8px; align-items:center; }
.form-row.form-actions {
  /* Ensure actions row is horizontal and buttons aligned */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.form-actions :deep(.t-button) { padding:8px 16px; height:40px; border-radius:4px; }

/* Material-like input styles */
.create-form :deep(.t-input__wrap),
.create-form :deep(.t-select__wrap),
.create-form :deep(.t-cascader__wrap) {
  height: 44px;
  border-radius: 8px;
  border: 1px solid rgba(60,64,67,0.08);
  background: #ffffff;
  padding: 0 12px;
  box-shadow: none;
}
.create-form :deep(.t-input__inner),
.create-form :deep(.t-select__inner),
.create-form :deep(.t-cascader__inner) {
  height: 44px;
  line-height: 44px;
  padding: 0;
}
.create-form :deep(.t-form__message) {
  color: #d93025;
  font-size: 12px;
  margin-top: 4px;
}
.form-actions :deep(.t-button--primary) {
  background: #1a73e8;
  border: none;
  color: #fff;
  border-radius: 8px;
  padding: 10px 18px;
}
.form-actions :deep(.t-button--default) {
  background: #fff;
  border: 1px solid rgba(60,64,67,0.08);
  color: #202124;
  border-radius: 8px;
  padding: 10px 18px;
}
</style>


