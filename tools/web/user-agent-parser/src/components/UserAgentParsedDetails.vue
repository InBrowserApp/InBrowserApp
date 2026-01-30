<template>
  <ParsedDetailsSection
    :title="t('parsed-details')"
    :empty-state="t('empty-state')"
    :has-output="hasOutput"
    :sections="parsedSections"
  />
</template>

<script setup lang="ts">
import type UAParser from 'ua-parser-js'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ParsedDetailsSection from './ParsedDetailsSection.vue'

type ParsedResult = UAParser.IResult

const props = defineProps<{
  parsedResult: ParsedResult | null
}>()

const { t } = useI18n()

const hasOutput = computed(() => Boolean(props.parsedResult))

const formatValue = (value?: string | number | null) => {
  if (value === undefined || value === null || value === '') {
    return t('unknown')
  }
  return String(value)
}

const browserItems = computed(() => [
  { label: t('name'), value: formatValue(props.parsedResult?.browser?.name) },
  { label: t('version'), value: formatValue(props.parsedResult?.browser?.version) },
  { label: t('major'), value: formatValue(props.parsedResult?.browser?.major) },
])

const osItems = computed(() => [
  { label: t('name'), value: formatValue(props.parsedResult?.os?.name) },
  { label: t('version'), value: formatValue(props.parsedResult?.os?.version) },
])

const engineItems = computed(() => [
  { label: t('name'), value: formatValue(props.parsedResult?.engine?.name) },
  { label: t('version'), value: formatValue(props.parsedResult?.engine?.version) },
])

const deviceItems = computed(() => [
  { label: t('type'), value: formatValue(props.parsedResult?.device?.type) },
  { label: t('vendor'), value: formatValue(props.parsedResult?.device?.vendor) },
  { label: t('model'), value: formatValue(props.parsedResult?.device?.model) },
])

const cpuItems = computed(() => [
  { label: t('architecture'), value: formatValue(props.parsedResult?.cpu?.architecture) },
])

const parsedSections = computed(() => [
  { title: t('browser'), items: browserItems.value },
  { title: t('os'), items: osItems.value },
  { title: t('engine'), items: engineItems.value },
  { title: t('device'), items: deviceItems.value },
  { title: t('cpu'), items: cpuItems.value },
])
</script>

<i18n lang="json">
{
  "en": {
    "parsed-details": "Parsed Details",
    "empty-state": "Paste a user agent string to see parsed details.",
    "unknown": "Unknown",
    "browser": "Browser",
    "os": "Operating System",
    "engine": "Engine",
    "device": "Device",
    "cpu": "CPU",
    "name": "Name",
    "version": "Version",
    "major": "Major",
    "type": "Type",
    "vendor": "Vendor",
    "model": "Model",
    "architecture": "Architecture"
  },
  "zh": {
    "parsed-details": "解析结果",
    "empty-state": "粘贴 User-Agent 字符串以查看解析结果。",
    "unknown": "未知",
    "browser": "浏览器",
    "os": "操作系统",
    "engine": "引擎",
    "device": "设备",
    "cpu": "CPU",
    "name": "名称",
    "version": "版本",
    "major": "主版本",
    "type": "类型",
    "vendor": "厂商",
    "model": "型号",
    "architecture": "架构"
  },
  "zh-CN": {
    "parsed-details": "解析结果",
    "empty-state": "粘贴 User-Agent 字符串以查看解析结果。",
    "unknown": "未知",
    "browser": "浏览器",
    "os": "操作系统",
    "engine": "引擎",
    "device": "设备",
    "cpu": "CPU",
    "name": "名称",
    "version": "版本",
    "major": "主版本",
    "type": "类型",
    "vendor": "厂商",
    "model": "型号",
    "architecture": "架构"
  },
  "zh-TW": {
    "parsed-details": "解析結果",
    "empty-state": "貼上 User-Agent 字串以查看解析結果。",
    "unknown": "未知",
    "browser": "瀏覽器",
    "os": "作業系統",
    "engine": "引擎",
    "device": "裝置",
    "cpu": "CPU",
    "name": "名稱",
    "version": "版本",
    "major": "主版本",
    "type": "類型",
    "vendor": "廠商",
    "model": "型號",
    "architecture": "架構"
  },
  "zh-HK": {
    "parsed-details": "解析結果",
    "empty-state": "貼上 User-Agent 字串以查看解析結果。",
    "unknown": "未知",
    "browser": "瀏覽器",
    "os": "作業系統",
    "engine": "引擎",
    "device": "裝置",
    "cpu": "CPU",
    "name": "名稱",
    "version": "版本",
    "major": "主版本",
    "type": "類型",
    "vendor": "廠商",
    "model": "型號",
    "architecture": "架構"
  },
  "es": {
    "parsed-details": "Detalles analizados",
    "empty-state": "Pega una cadena de user agent para ver los detalles.",
    "unknown": "Desconocido",
    "browser": "Navegador",
    "os": "Sistema operativo",
    "engine": "Motor",
    "device": "Dispositivo",
    "cpu": "CPU",
    "name": "Nombre",
    "version": "Versión",
    "major": "Versión principal",
    "type": "Tipo",
    "vendor": "Fabricante",
    "model": "Modelo",
    "architecture": "Arquitectura"
  },
  "fr": {
    "parsed-details": "Détails analysés",
    "empty-state": "Collez une chaîne User-Agent pour voir les détails.",
    "unknown": "Inconnu",
    "browser": "Navigateur",
    "os": "Système d’exploitation",
    "engine": "Moteur",
    "device": "Appareil",
    "cpu": "CPU",
    "name": "Nom",
    "version": "Version",
    "major": "Version majeure",
    "type": "Type",
    "vendor": "Fabricant",
    "model": "Modèle",
    "architecture": "Architecture"
  },
  "de": {
    "parsed-details": "Analyse-Details",
    "empty-state": "Füge einen User-Agent-String ein, um Details zu sehen.",
    "unknown": "Unbekannt",
    "browser": "Browser",
    "os": "Betriebssystem",
    "engine": "Engine",
    "device": "Gerät",
    "cpu": "CPU",
    "name": "Name",
    "version": "Version",
    "major": "Hauptversion",
    "type": "Typ",
    "vendor": "Hersteller",
    "model": "Modell",
    "architecture": "Architektur"
  },
  "it": {
    "parsed-details": "Dettagli analizzati",
    "empty-state": "Incolla una stringa User-Agent per vedere i dettagli.",
    "unknown": "Sconosciuto",
    "browser": "Browser",
    "os": "Sistema operativo",
    "engine": "Motore",
    "device": "Dispositivo",
    "cpu": "CPU",
    "name": "Nome",
    "version": "Versione",
    "major": "Versione principale",
    "type": "Tipo",
    "vendor": "Produttore",
    "model": "Modello",
    "architecture": "Architettura"
  },
  "ja": {
    "parsed-details": "解析結果",
    "empty-state": "User-Agent 文字列を貼り付けて解析結果を表示します。",
    "unknown": "不明",
    "browser": "ブラウザ",
    "os": "オペレーティングシステム",
    "engine": "エンジン",
    "device": "デバイス",
    "cpu": "CPU",
    "name": "名称",
    "version": "バージョン",
    "major": "メジャー",
    "type": "種類",
    "vendor": "ベンダー",
    "model": "モデル",
    "architecture": "アーキテクチャ"
  },
  "ko": {
    "parsed-details": "파싱된 상세",
    "empty-state": "User-Agent 문자열을 붙여넣어 결과를 확인하세요.",
    "unknown": "알 수 없음",
    "browser": "브라우저",
    "os": "운영체제",
    "engine": "엔진",
    "device": "디바이스",
    "cpu": "CPU",
    "name": "이름",
    "version": "버전",
    "major": "메이저",
    "type": "유형",
    "vendor": "제조사",
    "model": "모델",
    "architecture": "아키텍처"
  },
  "ru": {
    "parsed-details": "Результаты разбора",
    "empty-state": "Вставьте строку User-Agent, чтобы увидеть результаты.",
    "unknown": "Неизвестно",
    "browser": "Браузер",
    "os": "Операционная система",
    "engine": "Движок",
    "device": "Устройство",
    "cpu": "CPU",
    "name": "Имя",
    "version": "Версия",
    "major": "Основная версия",
    "type": "Тип",
    "vendor": "Производитель",
    "model": "Модель",
    "architecture": "Архитектура"
  },
  "pt": {
    "parsed-details": "Detalhes analisados",
    "empty-state": "Cole uma string User-Agent para ver os detalhes.",
    "unknown": "Desconhecido",
    "browser": "Navegador",
    "os": "Sistema operacional",
    "engine": "Motor",
    "device": "Dispositivo",
    "cpu": "CPU",
    "name": "Nome",
    "version": "Versão",
    "major": "Versão principal",
    "type": "Tipo",
    "vendor": "Fabricante",
    "model": "Modelo",
    "architecture": "Arquitetura"
  },
  "ar": {
    "parsed-details": "التفاصيل المُحللة",
    "empty-state": "الصق سلسلة User-Agent لعرض التفاصيل.",
    "unknown": "غير معروف",
    "browser": "المتصفح",
    "os": "نظام التشغيل",
    "engine": "المحرك",
    "device": "الجهاز",
    "cpu": "CPU",
    "name": "الاسم",
    "version": "الإصدار",
    "major": "الإصدار الرئيسي",
    "type": "النوع",
    "vendor": "الشركة المصنعة",
    "model": "الطراز",
    "architecture": "البنية"
  },
  "hi": {
    "parsed-details": "पार्स विवरण",
    "empty-state": "परिणाम देखने के लिए User-Agent स्ट्रिंग पेस्ट करें।",
    "unknown": "अज्ञात",
    "browser": "ब्राउज़र",
    "os": "ऑपरेटिंग सिस्टम",
    "engine": "इंजन",
    "device": "डिवाइस",
    "cpu": "CPU",
    "name": "नाम",
    "version": "संस्करण",
    "major": "मुख्य संस्करण",
    "type": "प्रकार",
    "vendor": "निर्माता",
    "model": "मॉडल",
    "architecture": "आर्किटेक्चर"
  },
  "tr": {
    "parsed-details": "Ayrıştırma ayrıntıları",
    "empty-state": "Ayrıntıları görmek için bir User-Agent dizesi yapıştırın.",
    "unknown": "Bilinmiyor",
    "browser": "Tarayıcı",
    "os": "İşletim sistemi",
    "engine": "Motor",
    "device": "Cihaz",
    "cpu": "CPU",
    "name": "Ad",
    "version": "Sürüm",
    "major": "Ana sürüm",
    "type": "Tür",
    "vendor": "Üretici",
    "model": "Model",
    "architecture": "Mimari"
  },
  "nl": {
    "parsed-details": "Geparseerde details",
    "empty-state": "Plak een User-Agent-string om details te zien.",
    "unknown": "Onbekend",
    "browser": "Browser",
    "os": "Besturingssysteem",
    "engine": "Engine",
    "device": "Apparaat",
    "cpu": "CPU",
    "name": "Naam",
    "version": "Versie",
    "major": "Hoofdversie",
    "type": "Type",
    "vendor": "Fabrikant",
    "model": "Model",
    "architecture": "Architectuur"
  },
  "sv": {
    "parsed-details": "Tolkningsdetaljer",
    "empty-state": "Klistra in en User-Agent-sträng för att se detaljer.",
    "unknown": "Okänd",
    "browser": "Webbläsare",
    "os": "Operativsystem",
    "engine": "Motor",
    "device": "Enhet",
    "cpu": "CPU",
    "name": "Namn",
    "version": "Version",
    "major": "Huvudversion",
    "type": "Typ",
    "vendor": "Tillverkare",
    "model": "Modell",
    "architecture": "Arkitektur"
  },
  "pl": {
    "parsed-details": "Szczegóły analizy",
    "empty-state": "Wklej ciąg User-Agent, aby zobaczyć szczegóły.",
    "unknown": "Nieznane",
    "browser": "Przeglądarka",
    "os": "System operacyjny",
    "engine": "Silnik",
    "device": "Urządzenie",
    "cpu": "CPU",
    "name": "Nazwa",
    "version": "Wersja",
    "major": "Wersja główna",
    "type": "Typ",
    "vendor": "Producent",
    "model": "Model",
    "architecture": "Architektura"
  },
  "vi": {
    "parsed-details": "Chi tiết phân tích",
    "empty-state": "Dán chuỗi User-Agent để xem chi tiết.",
    "unknown": "Không rõ",
    "browser": "Trình duyệt",
    "os": "Hệ điều hành",
    "engine": "Engine",
    "device": "Thiết bị",
    "cpu": "CPU",
    "name": "Tên",
    "version": "Phiên bản",
    "major": "Phiên bản chính",
    "type": "Loại",
    "vendor": "Nhà sản xuất",
    "model": "Mẫu",
    "architecture": "Kiến trúc"
  },
  "th": {
    "parsed-details": "รายละเอียดที่แยกได้",
    "empty-state": "วางสตริง User-Agent เพื่อดูรายละเอียด",
    "unknown": "ไม่ทราบ",
    "browser": "เบราว์เซอร์",
    "os": "ระบบปฏิบัติการ",
    "engine": "เอนจิน",
    "device": "อุปกรณ์",
    "cpu": "CPU",
    "name": "ชื่อ",
    "version": "เวอร์ชัน",
    "major": "เวอร์ชันหลัก",
    "type": "ประเภท",
    "vendor": "ผู้ผลิต",
    "model": "รุ่น",
    "architecture": "สถาปัตยกรรม"
  },
  "id": {
    "parsed-details": "Detail hasil",
    "empty-state": "Tempel string User-Agent untuk melihat detail.",
    "unknown": "Tidak diketahui",
    "browser": "Peramban",
    "os": "Sistem operasi",
    "engine": "Mesin",
    "device": "Perangkat",
    "cpu": "CPU",
    "name": "Nama",
    "version": "Versi",
    "major": "Versi utama",
    "type": "Tipe",
    "vendor": "Vendor",
    "model": "Model",
    "architecture": "Arsitektur"
  },
  "he": {
    "parsed-details": "פרטים מפורשים",
    "empty-state": "הדביקו מחרוזת User-Agent כדי לראות פרטים.",
    "unknown": "לא ידוע",
    "browser": "דפדפן",
    "os": "מערכת הפעלה",
    "engine": "מנוע",
    "device": "מכשיר",
    "cpu": "CPU",
    "name": "שם",
    "version": "גרסה",
    "major": "גרסה עיקרית",
    "type": "סוג",
    "vendor": "ספק",
    "model": "דגם",
    "architecture": "ארכיטקטורה"
  },
  "ms": {
    "parsed-details": "Butiran dihuraikan",
    "empty-state": "Tampal rentetan User-Agent untuk melihat butiran.",
    "unknown": "Tidak diketahui",
    "browser": "Pelayar",
    "os": "Sistem operasi",
    "engine": "Enjin",
    "device": "Peranti",
    "cpu": "CPU",
    "name": "Nama",
    "version": "Versi",
    "major": "Versi utama",
    "type": "Jenis",
    "vendor": "Pengeluar",
    "model": "Model",
    "architecture": "Seni bina"
  },
  "no": {
    "parsed-details": "Analyserte detaljer",
    "empty-state": "Lim inn en User-Agent-streng for å se detaljer.",
    "unknown": "Ukjent",
    "browser": "Nettleser",
    "os": "Operativsystem",
    "engine": "Motor",
    "device": "Enhet",
    "cpu": "CPU",
    "name": "Navn",
    "version": "Versjon",
    "major": "Hovedversjon",
    "type": "Type",
    "vendor": "Produsent",
    "model": "Modell",
    "architecture": "Arkitektur"
  }
}
</i18n>
