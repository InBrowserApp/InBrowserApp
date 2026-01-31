<template>
  <NDescriptionsItem :label="t('status')">
    <ResidentIdStatusTag :is-valid="validationResult.isValid" />
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('region')">
    <ResidentIdRegionDisplay
      :province-name="validationResult.provinceName"
      :city-name="validationResult.cityName"
      :area-name="validationResult.areaName"
    />
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('regionCode')">
    <ResidentIdCopyableValue :value="validationResult.regionCode" />
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('regionStatus')">
    <ResidentIdRegionStatusTag :is-region-valid="validationResult.isRegionValid" />
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('province')">
    <ResidentIdTextValue :value="validationResult.provinceName" />
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('city')">
    <ResidentIdTextValue :value="validationResult.cityName" />
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('district')">
    <ResidentIdTextValue :value="validationResult.areaName" />
  </NDescriptionsItem>
</template>

<script setup lang="ts">
import { NDescriptionsItem } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { ResidentIdValidationResult } from '../data/residentId'
import ResidentIdCopyableValue from './ResidentIdCopyableValue.vue'
import ResidentIdRegionDisplay from './ResidentIdRegionDisplay.vue'
import ResidentIdRegionStatusTag from './ResidentIdRegionStatusTag.vue'
import ResidentIdStatusTag from './ResidentIdStatusTag.vue'
import ResidentIdTextValue from './ResidentIdTextValue.vue'

defineProps<{
  validationResult: ResidentIdValidationResult
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "status": "Status",
    "region": "Region",
    "regionCode": "Region Code",
    "regionStatus": "Region Status",
    "province": "Province",
    "city": "City",
    "district": "District/County"
  },
  "zh": {
    "status": "状态",
    "region": "地区",
    "regionCode": "地区代码",
    "regionStatus": "地区状态",
    "province": "省份",
    "city": "城市",
    "district": "区县"
  },
  "zh-CN": {
    "status": "状态",
    "region": "地区",
    "regionCode": "地区代码",
    "regionStatus": "地区状态",
    "province": "省份",
    "city": "城市",
    "district": "区县"
  },
  "zh-TW": {
    "status": "狀態",
    "region": "地區",
    "regionCode": "地區代碼",
    "regionStatus": "地區狀態",
    "province": "省份",
    "city": "城市",
    "district": "區縣"
  },
  "zh-HK": {
    "status": "狀態",
    "region": "地區",
    "regionCode": "地區代碼",
    "regionStatus": "地區狀態",
    "province": "省份",
    "city": "城市",
    "district": "區縣"
  },
  "es": {
    "status": "Estado",
    "region": "Región",
    "regionCode": "Código de región",
    "regionStatus": "Estado de la región",
    "province": "Provincia",
    "city": "Ciudad",
    "district": "Distrito/Condado"
  },
  "fr": {
    "status": "Statut",
    "region": "Région",
    "regionCode": "Code de région",
    "regionStatus": "Statut de la région",
    "province": "Province",
    "city": "Ville",
    "district": "District/Comté"
  },
  "de": {
    "status": "Status",
    "region": "Region",
    "regionCode": "Regionscode",
    "regionStatus": "Regionsstatus",
    "province": "Provinz",
    "city": "Stadt",
    "district": "Bezirk/Landkreis"
  },
  "it": {
    "status": "Stato",
    "region": "Regione",
    "regionCode": "Codice regione",
    "regionStatus": "Stato della regione",
    "province": "Provincia",
    "city": "Città",
    "district": "Distretto/Contea"
  },
  "ja": {
    "status": "状態",
    "region": "地域",
    "regionCode": "地域コード",
    "regionStatus": "地域の状態",
    "province": "省",
    "city": "市",
    "district": "区/県"
  },
  "ko": {
    "status": "상태",
    "region": "지역",
    "regionCode": "지역 코드",
    "regionStatus": "지역 상태",
    "province": "성/주",
    "city": "도시",
    "district": "구/군"
  },
  "ru": {
    "status": "Статус",
    "region": "Регион",
    "regionCode": "Код региона",
    "regionStatus": "Статус региона",
    "province": "Провинция",
    "city": "Город",
    "district": "Район/округ"
  },
  "pt": {
    "status": "Status",
    "region": "Região",
    "regionCode": "Código da região",
    "regionStatus": "Status da região",
    "province": "Província",
    "city": "Cidade",
    "district": "Distrito/Condado"
  },
  "ar": {
    "status": "الحالة",
    "region": "المنطقة",
    "regionCode": "رمز المنطقة",
    "regionStatus": "حالة المنطقة",
    "province": "المقاطعة",
    "city": "المدينة",
    "district": "الحي/المقاطعة"
  },
  "hi": {
    "status": "स्थिति",
    "region": "क्षेत्र",
    "regionCode": "क्षेत्र कोड",
    "regionStatus": "क्षेत्र की स्थिति",
    "province": "प्रांत",
    "city": "शहर",
    "district": "जिला"
  },
  "tr": {
    "status": "Durum",
    "region": "Bölge",
    "regionCode": "Bölge Kodu",
    "regionStatus": "Bölge Durumu",
    "province": "Eyalet",
    "city": "Şehir",
    "district": "İlçe"
  },
  "nl": {
    "status": "Status",
    "region": "Regio",
    "regionCode": "Regiocode",
    "regionStatus": "Regiostatus",
    "province": "Provincie",
    "city": "Stad",
    "district": "District/County"
  },
  "sv": {
    "status": "Status",
    "region": "Region",
    "regionCode": "Regionskod",
    "regionStatus": "Regionsstatus",
    "province": "Provins",
    "city": "Stad",
    "district": "Distrikt/Kommun"
  },
  "pl": {
    "status": "Status",
    "region": "Region",
    "regionCode": "Kod regionu",
    "regionStatus": "Status regionu",
    "province": "Województwo",
    "city": "Miasto",
    "district": "Powiat"
  },
  "vi": {
    "status": "Trạng thái",
    "region": "Khu vực",
    "regionCode": "Mã khu vực",
    "regionStatus": "Trạng thái khu vực",
    "province": "Tỉnh",
    "city": "Thành phố",
    "district": "Quận/Huyện"
  },
  "th": {
    "status": "สถานะ",
    "region": "ภูมิภาค",
    "regionCode": "รหัสภูมิภาค",
    "regionStatus": "สถานะภูมิภาค",
    "province": "จังหวัด",
    "city": "เมือง",
    "district": "อำเภอ/เขต"
  },
  "id": {
    "status": "Status",
    "region": "Wilayah",
    "regionCode": "Kode wilayah",
    "regionStatus": "Status wilayah",
    "province": "Provinsi",
    "city": "Kota",
    "district": "Distrik/Kabupaten"
  },
  "he": {
    "status": "סטטוס",
    "region": "אזור",
    "regionCode": "קוד אזור",
    "regionStatus": "סטטוס אזור",
    "province": "מחוז",
    "city": "עיר",
    "district": "נפה/מחוז"
  },
  "ms": {
    "status": "Status",
    "region": "Wilayah",
    "regionCode": "Kod wilayah",
    "regionStatus": "Status wilayah",
    "province": "Wilayah/Negeri",
    "city": "Bandar",
    "district": "Daerah"
  },
  "no": {
    "status": "Status",
    "region": "Region",
    "regionCode": "Regionskode",
    "regionStatus": "Regionsstatus",
    "province": "Provins",
    "city": "By",
    "district": "Distrikt/Kommune"
  }
}
</i18n>
