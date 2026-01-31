<template>
  <NFlex vertical :size="16">
    <NInput v-model:value="search" :placeholder="t('searchPlaceholder')" clearable>
      <template #prefix>
        <NIcon :component="SearchIcon" />
      </template>
    </NInput>
    <NRadioGroup v-model:value="category">
      <NRadioButton value="all">{{ t('all') }}</NRadioButton>
      <NRadioButton value="common">{{ t('common') }}</NRadioButton>
      <NRadioButton value="system">{{ t('system') }}</NRadioButton>
      <NRadioButton value="registered">{{ t('registered') }}</NRadioButton>
    </NRadioGroup>
  </NFlex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex, NInput, NIcon, NRadioGroup, NRadioButton } from 'naive-ui'
import SearchIcon from '@vicons/fluent/Search20Regular'

const search = defineModel<string>('search', { required: true })
const category = defineModel<string>('category', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "searchPlaceholder": "Search by port number or service name...",
    "all": "All",
    "common": "Common",
    "system": "System (0-1023)",
    "registered": "Registered (1024+)"
  },
  "zh": {
    "searchPlaceholder": "按端口号或服务名称搜索...",
    "all": "全部",
    "common": "常用",
    "system": "系统 (0-1023)",
    "registered": "注册 (1024+)"
  },
  "zh-CN": {
    "searchPlaceholder": "按端口号或服务名称搜索...",
    "all": "全部",
    "common": "常用",
    "system": "系统 (0-1023)",
    "registered": "注册 (1024+)"
  },
  "zh-TW": {
    "searchPlaceholder": "按連接埠號碼或服務名稱搜尋...",
    "all": "全部",
    "common": "常用",
    "system": "系統 (0-1023)",
    "registered": "註冊 (1024+)"
  },
  "zh-HK": {
    "searchPlaceholder": "按連接埠號碼或服務名稱搜尋...",
    "all": "全部",
    "common": "常用",
    "system": "系統 (0-1023)",
    "registered": "註冊 (1024+)"
  },
  "es": {
    "searchPlaceholder": "Buscar por numero de puerto o nombre de servicio...",
    "all": "Todos",
    "common": "Comunes",
    "system": "Sistema (0-1023)",
    "registered": "Registrados (1024+)"
  },
  "fr": {
    "searchPlaceholder": "Rechercher par numero de port ou nom de service...",
    "all": "Tous",
    "common": "Courants",
    "system": "Systeme (0-1023)",
    "registered": "Enregistres (1024+)"
  },
  "de": {
    "searchPlaceholder": "Nach Portnummer oder Dienstname suchen...",
    "all": "Alle",
    "common": "Haufig",
    "system": "System (0-1023)",
    "registered": "Registriert (1024+)"
  },
  "it": {
    "searchPlaceholder": "Cerca per numero di porta o nome del servizio...",
    "all": "Tutti",
    "common": "Comuni",
    "system": "Sistema (0-1023)",
    "registered": "Registrati (1024+)"
  },
  "ja": {
    "searchPlaceholder": "ポート番号またはサービス名で検索...",
    "all": "すべて",
    "common": "一般的",
    "system": "システム (0-1023)",
    "registered": "登録済み (1024+)"
  },
  "ko": {
    "searchPlaceholder": "포트 번호 또는 서비스 이름으로 검색...",
    "all": "전체",
    "common": "일반",
    "system": "시스템 (0-1023)",
    "registered": "등록됨 (1024+)"
  },
  "ru": {
    "searchPlaceholder": "Поиск по номеру порта или имени сервиса...",
    "all": "Все",
    "common": "Популярные",
    "system": "Системные (0-1023)",
    "registered": "Зарегистрированные (1024+)"
  },
  "pt": {
    "searchPlaceholder": "Pesquisar por numero de porta ou nome do servico...",
    "all": "Todos",
    "common": "Comuns",
    "system": "Sistema (0-1023)",
    "registered": "Registrados (1024+)"
  },
  "ar": {
    "searchPlaceholder": "البحث برقم المنفذ او اسم الخدمة...",
    "all": "الكل",
    "common": "شائعة",
    "system": "النظام (0-1023)",
    "registered": "مسجلة (1024+)"
  },
  "hi": {
    "searchPlaceholder": "पोर्ट नंबर या सेवा नाम से खोजें...",
    "all": "सभी",
    "common": "सामान्य",
    "system": "सिस्टम (0-1023)",
    "registered": "पंजीकृत (1024+)"
  },
  "tr": {
    "searchPlaceholder": "Port numarasi veya servis adina gore ara...",
    "all": "Tumü",
    "common": "Yaygin",
    "system": "Sistem (0-1023)",
    "registered": "Kayitli (1024+)"
  },
  "nl": {
    "searchPlaceholder": "Zoeken op poortnummer of servicenaam...",
    "all": "Alle",
    "common": "Algemeen",
    "system": "Systeem (0-1023)",
    "registered": "Geregistreerd (1024+)"
  },
  "sv": {
    "searchPlaceholder": "Sok efter portnummer eller tjanstnamn...",
    "all": "Alla",
    "common": "Vanliga",
    "system": "System (0-1023)",
    "registered": "Registrerade (1024+)"
  },
  "pl": {
    "searchPlaceholder": "Szukaj po numerze portu lub nazwie uslugi...",
    "all": "Wszystkie",
    "common": "Popularne",
    "system": "Systemowe (0-1023)",
    "registered": "Zarejestrowane (1024+)"
  },
  "vi": {
    "searchPlaceholder": "Tim kiem theo so cong hoac ten dich vu...",
    "all": "Tat ca",
    "common": "Pho bien",
    "system": "He thong (0-1023)",
    "registered": "Da dang ky (1024+)"
  },
  "th": {
    "searchPlaceholder": "ค้นหาตามหมายเลขพอร์ตหรือชื่อบริการ...",
    "all": "ทั้งหมด",
    "common": "ทั่วไป",
    "system": "ระบบ (0-1023)",
    "registered": "ลงทะเบียน (1024+)"
  },
  "id": {
    "searchPlaceholder": "Cari berdasarkan nomor port atau nama layanan...",
    "all": "Semua",
    "common": "Umum",
    "system": "Sistem (0-1023)",
    "registered": "Terdaftar (1024+)"
  },
  "he": {
    "searchPlaceholder": "חפש לפי מספר פורט או שם שירות...",
    "all": "הכל",
    "common": "נפוצים",
    "system": "מערכת (0-1023)",
    "registered": "רשומים (1024+)"
  },
  "ms": {
    "searchPlaceholder": "Cari mengikut nombor port atau nama perkhidmatan...",
    "all": "Semua",
    "common": "Biasa",
    "system": "Sistem (0-1023)",
    "registered": "Berdaftar (1024+)"
  },
  "no": {
    "searchPlaceholder": "Sok etter portnummer eller tjenestenavn...",
    "all": "Alle",
    "common": "Vanlige",
    "system": "System (0-1023)",
    "registered": "Registrerte (1024+)"
  }
}
</i18n>
