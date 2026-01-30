<template>
  <NTag :type="isPrimaryOffice ? 'success' : 'info'" size="small">
    {{ isPrimaryOffice ? t('primaryOffice') : t('branchOffice') }}
  </NTag>
</template>

<script setup lang="ts">
import { NTag } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  isPrimaryOffice: boolean
}>()
</script>

<i18n lang="json">
{
  "en": {
    "primaryOffice": "Primary Office",
    "branchOffice": "Branch Office"
  },
  "zh": {
    "primaryOffice": "主行",
    "branchOffice": "分行"
  },
  "zh-CN": {
    "primaryOffice": "主行",
    "branchOffice": "分行"
  },
  "zh-TW": {
    "primaryOffice": "主行",
    "branchOffice": "分行"
  },
  "zh-HK": {
    "primaryOffice": "主行",
    "branchOffice": "分行"
  },
  "es": {
    "primaryOffice": "Oficina principal",
    "branchOffice": "Sucursal"
  },
  "fr": {
    "primaryOffice": "Siège",
    "branchOffice": "Agence"
  },
  "de": {
    "primaryOffice": "Hauptstelle",
    "branchOffice": "Filiale"
  },
  "it": {
    "primaryOffice": "Sede principale",
    "branchOffice": "Filiale"
  },
  "ja": {
    "primaryOffice": "本店",
    "branchOffice": "支店"
  },
  "ko": {
    "primaryOffice": "본점",
    "branchOffice": "지점"
  },
  "ru": {
    "primaryOffice": "Головной офис",
    "branchOffice": "Филиал"
  },
  "pt": {
    "primaryOffice": "Agência principal",
    "branchOffice": "Agência"
  },
  "ar": {
    "primaryOffice": "الفرع الرئيسي",
    "branchOffice": "فرع"
  },
  "hi": {
    "primaryOffice": "मुख्य कार्यालय",
    "branchOffice": "शाखा कार्यालय"
  },
  "tr": {
    "primaryOffice": "Merkez şube",
    "branchOffice": "Şube"
  },
  "nl": {
    "primaryOffice": "Hoofdkantoor",
    "branchOffice": "Filiaal"
  },
  "sv": {
    "primaryOffice": "Huvudkontor",
    "branchOffice": "Filial"
  },
  "pl": {
    "primaryOffice": "Siedziba główna",
    "branchOffice": "Oddział"
  },
  "vi": {
    "primaryOffice": "Trụ sở chính",
    "branchOffice": "Chi nhánh"
  },
  "th": {
    "primaryOffice": "สำนักงานใหญ่",
    "branchOffice": "สาขา"
  },
  "id": {
    "primaryOffice": "Kantor utama",
    "branchOffice": "Cabang"
  },
  "he": {
    "primaryOffice": "משרד ראשי",
    "branchOffice": "סניף"
  },
  "ms": {
    "primaryOffice": "Pejabat utama",
    "branchOffice": "Cawangan"
  },
  "no": {
    "primaryOffice": "Hovedkontor",
    "branchOffice": "Avdeling"
  }
}
</i18n>
