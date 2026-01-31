<template>
  <n-data-table bordered :columns="columns" :data="data" />
</template>

<script lang="ts" setup>
import { NDataTable } from 'naive-ui'
import type { DNSJSONResponse } from '@utils/dns'
import { computed, h } from 'vue'
import { DNSRecordTypes } from '@utils/dns'
import DNSResultData from './DNSResultData.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  result: DNSJSONResponse
}>()

const { t } = useI18n()

interface DataRow {
  name: string
  type: number
  TTL: number
  data: string
}

const columns = computed(() => [
  {
    title: t('name'),
    key: 'name',
  },
  {
    title: t('type'),
    key: 'type',
    render: (row: DataRow) => h('span', DNSRecordTypes?.[row.type] ?? t('unknown')),
  },
  {
    title: t('ttl'),
    key: 'TTL',
  },
  {
    title: t('data'),
    key: 'data',
    render: (row: DataRow) => h(DNSResultData, { data: row.data }),
  },
])

const data = computed<DataRow[]>(() => {
  return (props.result?.Answer ?? []).map((answer) => ({
    name: answer.name,
    type: answer.type,
    TTL: answer.TTL,
    data: answer.data,
  }))
})
</script>

<i18n lang="json">
{
  "en": {
    "name": "Name",
    "type": "Type",
    "ttl": "TTL",
    "data": "Data",
    "unknown": "Unknown"
  },
  "zh": {
    "name": "名称",
    "type": "类型",
    "ttl": "TTL",
    "data": "数据",
    "unknown": "未知"
  },
  "zh-CN": {
    "name": "名称",
    "type": "类型",
    "ttl": "TTL",
    "data": "数据",
    "unknown": "未知"
  },
  "zh-TW": {
    "name": "名稱",
    "type": "類型",
    "ttl": "TTL",
    "data": "資料",
    "unknown": "未知"
  },
  "zh-HK": {
    "name": "名稱",
    "type": "類型",
    "ttl": "TTL",
    "data": "資料",
    "unknown": "未知"
  },
  "es": {
    "name": "Nombre",
    "type": "Tipo",
    "ttl": "TTL",
    "data": "Datos",
    "unknown": "Desconocido"
  },
  "fr": {
    "name": "Nom",
    "type": "Type",
    "ttl": "TTL",
    "data": "Données",
    "unknown": "Inconnu"
  },
  "de": {
    "name": "Name",
    "type": "Typ",
    "ttl": "TTL",
    "data": "Daten",
    "unknown": "Unbekannt"
  },
  "it": {
    "name": "Nome",
    "type": "Tipo",
    "ttl": "TTL",
    "data": "Dati",
    "unknown": "Sconosciuto"
  },
  "ja": {
    "name": "名前",
    "type": "タイプ",
    "ttl": "TTL",
    "data": "データ",
    "unknown": "不明"
  },
  "ko": {
    "name": "이름",
    "type": "유형",
    "ttl": "TTL",
    "data": "데이터",
    "unknown": "알 수 없음"
  },
  "ru": {
    "name": "Имя",
    "type": "Тип",
    "ttl": "TTL",
    "data": "Данные",
    "unknown": "Неизвестно"
  },
  "pt": {
    "name": "Nome",
    "type": "Tipo",
    "ttl": "TTL",
    "data": "Dados",
    "unknown": "Desconhecido"
  },
  "ar": {
    "name": "الاسم",
    "type": "النوع",
    "ttl": "TTL",
    "data": "البيانات",
    "unknown": "غير معروف"
  },
  "hi": {
    "name": "नाम",
    "type": "प्रकार",
    "ttl": "TTL",
    "data": "डेटा",
    "unknown": "अज्ञात"
  },
  "tr": {
    "name": "Ad",
    "type": "Tür",
    "ttl": "TTL",
    "data": "Veri",
    "unknown": "Bilinmeyen"
  },
  "nl": {
    "name": "Naam",
    "type": "Type",
    "ttl": "TTL",
    "data": "Gegevens",
    "unknown": "Onbekend"
  },
  "sv": {
    "name": "Namn",
    "type": "Typ",
    "ttl": "TTL",
    "data": "Data",
    "unknown": "Okänd"
  },
  "pl": {
    "name": "Nazwa",
    "type": "Typ",
    "ttl": "TTL",
    "data": "Dane",
    "unknown": "Nieznany"
  },
  "vi": {
    "name": "Tên",
    "type": "Loại",
    "ttl": "TTL",
    "data": "Dữ liệu",
    "unknown": "Không xác định"
  },
  "th": {
    "name": "ชื่อ",
    "type": "ประเภท",
    "ttl": "TTL",
    "data": "ข้อมูล",
    "unknown": "ไม่ทราบ"
  },
  "id": {
    "name": "Nama",
    "type": "Jenis",
    "ttl": "TTL",
    "data": "Data",
    "unknown": "Tidak diketahui"
  },
  "he": {
    "name": "שם",
    "type": "סוג",
    "ttl": "TTL",
    "data": "נתונים",
    "unknown": "לא ידוע"
  },
  "ms": {
    "name": "Nama",
    "type": "Jenis",
    "ttl": "TTL",
    "data": "Data",
    "unknown": "Tidak diketahui"
  },
  "no": {
    "name": "Navn",
    "type": "Type",
    "ttl": "TTL",
    "data": "Data",
    "unknown": "Ukjent"
  }
}
</i18n>
