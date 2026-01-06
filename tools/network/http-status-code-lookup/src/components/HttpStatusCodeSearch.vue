<template>
  <NFlex vertical :size="16">
    <NInput
      :value="search"
      :placeholder="t('searchPlaceholder')"
      clearable
      @update:value="$emit('update:search', $event)"
    >
      <template #prefix>
        <NIcon :component="SearchIcon" />
      </template>
    </NInput>
    <NRadioGroup :value="category" @update:value="$emit('update:category', $event)">
      <NRadioButton value="all">{{ t('all') }}</NRadioButton>
      <NRadioButton value="common">{{ t('common') }}</NRadioButton>
      <NRadioButton value="informational">
        <NIcon
          :component="getCategoryIcon('informational')"
          style="margin-right: 4px; vertical-align: -0.15em"
        />
        {{ t('informational') }}
      </NRadioButton>
      <NRadioButton value="success">
        <NIcon
          :component="getCategoryIcon('success')"
          style="margin-right: 4px; vertical-align: -0.15em"
        />
        {{ t('success') }}
      </NRadioButton>
      <NRadioButton value="redirection">
        <NIcon
          :component="getCategoryIcon('redirection')"
          style="margin-right: 4px; vertical-align: -0.15em"
        />
        {{ t('redirection') }}
      </NRadioButton>
      <NRadioButton value="client-error">
        <NIcon
          :component="getCategoryIcon('client-error')"
          style="margin-right: 4px; vertical-align: -0.15em"
        />
        {{ t('clientError') }}
      </NRadioButton>
      <NRadioButton value="server-error">
        <NIcon
          :component="getCategoryIcon('server-error')"
          style="margin-right: 4px; vertical-align: -0.15em"
        />
        {{ t('serverError') }}
      </NRadioButton>
    </NRadioGroup>
  </NFlex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex, NInput, NIcon, NRadioGroup, NRadioButton } from 'naive-ui'
import {
  Search20Regular as SearchIcon,
  Info12Regular,
  CheckmarkCircle16Regular,
  ArrowForward16Regular,
  ErrorCircle16Regular,
  DismissCircle16Regular,
} from '@shared/icons/fluent'

defineProps<{
  search: string
  category: string
}>()

defineEmits<{
  'update:search': [value: string]
  'update:category': [value: string]
}>()

const { t } = useI18n()

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'informational':
      return Info12Regular
    case 'success':
      return CheckmarkCircle16Regular
    case 'redirection':
      return ArrowForward16Regular
    case 'client-error':
      return ErrorCircle16Regular
    case 'server-error':
      return DismissCircle16Regular
    default:
      return Info12Regular
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "searchPlaceholder": "Search by status code, name, or description...",
    "all": "All",
    "common": "Common",
    "informational": "Informational (1xx)",
    "success": "Success (2xx)",
    "redirection": "Redirection (3xx)",
    "clientError": "Client Error (4xx)",
    "serverError": "Server Error (5xx)"
  },
  "zh": {
    "searchPlaceholder": "按状态码、名称或描述搜索...",
    "all": "全部",
    "common": "常用",
    "informational": "信息性 (1xx)",
    "success": "成功 (2xx)",
    "redirection": "重定向 (3xx)",
    "clientError": "客户端错误 (4xx)",
    "serverError": "服务器错误 (5xx)"
  },
  "zh-CN": {
    "searchPlaceholder": "按状态码、名称或描述搜索...",
    "all": "全部",
    "common": "常用",
    "informational": "信息性 (1xx)",
    "success": "成功 (2xx)",
    "redirection": "重定向 (3xx)",
    "clientError": "客户端错误 (4xx)",
    "serverError": "服务器错误 (5xx)"
  },
  "zh-TW": {
    "searchPlaceholder": "按狀態碼、名稱或描述搜尋...",
    "all": "全部",
    "common": "常用",
    "informational": "資訊性 (1xx)",
    "success": "成功 (2xx)",
    "redirection": "重新導向 (3xx)",
    "clientError": "用戶端錯誤 (4xx)",
    "serverError": "伺服器錯誤 (5xx)"
  },
  "zh-HK": {
    "searchPlaceholder": "按狀態碼、名稱或描述搜尋...",
    "all": "全部",
    "common": "常用",
    "informational": "資訊性 (1xx)",
    "success": "成功 (2xx)",
    "redirection": "重新導向 (3xx)",
    "clientError": "客戶端錯誤 (4xx)",
    "serverError": "伺服器錯誤 (5xx)"
  },
  "es": {
    "searchPlaceholder": "Buscar por codigo de estado, nombre o descripcion...",
    "all": "Todos",
    "common": "Comunes",
    "informational": "Informativo (1xx)",
    "success": "Exito (2xx)",
    "redirection": "Redireccion (3xx)",
    "clientError": "Error del Cliente (4xx)",
    "serverError": "Error del Servidor (5xx)"
  },
  "fr": {
    "searchPlaceholder": "Rechercher par code de statut, nom ou description...",
    "all": "Tous",
    "common": "Courants",
    "informational": "Informationnel (1xx)",
    "success": "Succes (2xx)",
    "redirection": "Redirection (3xx)",
    "clientError": "Erreur Client (4xx)",
    "serverError": "Erreur Serveur (5xx)"
  },
  "de": {
    "searchPlaceholder": "Nach Statuscode, Name oder Beschreibung suchen...",
    "all": "Alle",
    "common": "Haufig",
    "informational": "Informationell (1xx)",
    "success": "Erfolg (2xx)",
    "redirection": "Weiterleitung (3xx)",
    "clientError": "Client-Fehler (4xx)",
    "serverError": "Server-Fehler (5xx)"
  },
  "it": {
    "searchPlaceholder": "Cerca per codice di stato, nome o descrizione...",
    "all": "Tutti",
    "common": "Comuni",
    "informational": "Informativo (1xx)",
    "success": "Successo (2xx)",
    "redirection": "Reindirizzamento (3xx)",
    "clientError": "Errore Client (4xx)",
    "serverError": "Errore Server (5xx)"
  },
  "ja": {
    "searchPlaceholder": "ステータスコード、名前、または説明で検索...",
    "all": "すべて",
    "common": "一般的",
    "informational": "情報 (1xx)",
    "success": "成功 (2xx)",
    "redirection": "リダイレクト (3xx)",
    "clientError": "クライアントエラー (4xx)",
    "serverError": "サーバーエラー (5xx)"
  },
  "ko": {
    "searchPlaceholder": "상태 코드, 이름 또는 설명으로 검색...",
    "all": "전체",
    "common": "일반",
    "informational": "정보성 (1xx)",
    "success": "성공 (2xx)",
    "redirection": "리디렉션 (3xx)",
    "clientError": "클라이언트 오류 (4xx)",
    "serverError": "서버 오류 (5xx)"
  },
  "ru": {
    "searchPlaceholder": "Поиск по коду состояния, названию или описанию...",
    "all": "Все",
    "common": "Популярные",
    "informational": "Информационные (1xx)",
    "success": "Успех (2xx)",
    "redirection": "Перенаправление (3xx)",
    "clientError": "Ошибка Клиента (4xx)",
    "serverError": "Ошибка Сервера (5xx)"
  },
  "pt": {
    "searchPlaceholder": "Pesquisar por codigo de status, nome ou descricao...",
    "all": "Todos",
    "common": "Comuns",
    "informational": "Informativo (1xx)",
    "success": "Sucesso (2xx)",
    "redirection": "Redirecionamento (3xx)",
    "clientError": "Erro do Cliente (4xx)",
    "serverError": "Erro do Servidor (5xx)"
  },
  "ar": {
    "searchPlaceholder": "البحث برمز الحالة او الاسم او الوصف...",
    "all": "الكل",
    "common": "شائعة",
    "informational": "معلوماتي (1xx)",
    "success": "نجاح (2xx)",
    "redirection": "اعادة توجيه (3xx)",
    "clientError": "خطأ العميل (4xx)",
    "serverError": "خطأ الخادم (5xx)"
  },
  "hi": {
    "searchPlaceholder": "स्थिति कोड, नाम या विवरण से खोजें...",
    "all": "सभी",
    "common": "सामान्य",
    "informational": "सूचनात्मक (1xx)",
    "success": "सफलता (2xx)",
    "redirection": "पुनर्निर्देशन (3xx)",
    "clientError": "क्लाइंट त्रुटि (4xx)",
    "serverError": "सर्वर त्रुटि (5xx)"
  },
  "tr": {
    "searchPlaceholder": "Durum kodu, ad veya aciklama ile ara...",
    "all": "Tumü",
    "common": "Yaygin",
    "informational": "Bilgilendirici (1xx)",
    "success": "Basarili (2xx)",
    "redirection": "Yonlendirme (3xx)",
    "clientError": "Istekci Hatasi (4xx)",
    "serverError": "Sunucu Hatasi (5xx)"
  },
  "nl": {
    "searchPlaceholder": "Zoeken op statuscode, naam of beschrijving...",
    "all": "Alle",
    "common": "Algemeen",
    "informational": "Informatief (1xx)",
    "success": "Succesvol (2xx)",
    "redirection": "Omleiding (3xx)",
    "clientError": "Clientfout (4xx)",
    "serverError": "Serverfout (5xx)"
  },
  "sv": {
    "searchPlaceholder": "Sok efter statuskod, namn eller beskrivning...",
    "all": "Alla",
    "common": "Vanliga",
    "informational": "Informativ (1xx)",
    "success": "Framgangsrik (2xx)",
    "redirection": "Omdirigering (3xx)",
    "clientError": "Klientfel (4xx)",
    "serverError": "Serverfel (5xx)"
  },
  "pl": {
    "searchPlaceholder": "Szukaj po kodzie statusu, nazwie lub opisie...",
    "all": "Wszystkie",
    "common": "Popularne",
    "informational": "Informacyjny (1xx)",
    "success": "Sukces (2xx)",
    "redirection": "Przekierowanie (3xx)",
    "clientError": "Blad Klienta (4xx)",
    "serverError": "Blad Serwera (5xx)"
  },
  "vi": {
    "searchPlaceholder": "Tim kiem theo ma trang thai, ten hoac mo ta...",
    "all": "Tat ca",
    "common": "Pho bien",
    "informational": "Thong tin (1xx)",
    "success": "Thanh cong (2xx)",
    "redirection": "Chuyen huong (3xx)",
    "clientError": "Loi May Khach (4xx)",
    "serverError": "Loi May Chu (5xx)"
  },
  "th": {
    "searchPlaceholder": "ค้นหาตามรหัสสถานะ ชื่อ หรือคำอธิบาย...",
    "all": "ทั้งหมด",
    "common": "ทั่วไป",
    "informational": "ข้อมูล (1xx)",
    "success": "สำเร็จ (2xx)",
    "redirection": "เปลี่ยนเส้นทาง (3xx)",
    "clientError": "ข้อผิดพลาดของไคลเอนต์ (4xx)",
    "serverError": "ข้อผิดพลาดของเซิร์ฟเวอร์ (5xx)"
  },
  "id": {
    "searchPlaceholder": "Cari berdasarkan kode status, nama atau deskripsi...",
    "all": "Semua",
    "common": "Umum",
    "informational": "Informasional (1xx)",
    "success": "Berhasil (2xx)",
    "redirection": "Pengalihan (3xx)",
    "clientError": "Kesalahan Klien (4xx)",
    "serverError": "Kesalahan Server (5xx)"
  },
  "he": {
    "searchPlaceholder": "חפש לפי קוד סטטוס, שם או תיאור...",
    "all": "הכל",
    "common": "נפוצים",
    "informational": "מידע (1xx)",
    "success": "הצלחה (2xx)",
    "redirection": "הפניה מחדש (3xx)",
    "clientError": "שגיאת לקוח (4xx)",
    "serverError": "שגיאת שרת (5xx)"
  },
  "ms": {
    "searchPlaceholder": "Cari mengikut kod status, nama atau penerangan...",
    "all": "Semua",
    "common": "Biasa",
    "informational": "Maklumat (1xx)",
    "success": "Berjaya (2xx)",
    "redirection": "Ubah hala (3xx)",
    "clientError": "Ralat Pelanggan (4xx)",
    "serverError": "Ralat Pelayan (5xx)"
  },
  "no": {
    "searchPlaceholder": "Sok etter statuskode, navn eller beskrivelse...",
    "all": "Alle",
    "common": "Vanlige",
    "informational": "Informativ (1xx)",
    "success": "Vellykket (2xx)",
    "redirection": "Omdirigering (3xx)",
    "clientError": "Klientfeil (4xx)",
    "serverError": "Serverfeil (5xx)"
  }
}
</i18n>
