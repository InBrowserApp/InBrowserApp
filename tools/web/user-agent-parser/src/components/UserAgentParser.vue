<template>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :show-feedback="false">
        <template #label>
          <div
            style="display: flex; align-items: center; justify-content: space-between; width: 100%"
          >
            <span>{{ t('input-label') }}</span>
            <n-button text :disabled="!canUseCurrent" @click="useCurrentUserAgent">
              <template #icon>
                <n-icon :component="GlobePerson20Regular" />
              </template>
              {{ t('use-current') }}
            </n-button>
          </div>
        </template>
        <n-input
          v-model:value="userAgent"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 14 }"
          :placeholder="t('input-placeholder')"
          :status="inputStatus"
        />
        <template v-if="inputError" #feedback>
          <n-text type="error">{{ t('input-error') }}</n-text>
        </template>
      </n-form-item-gi>

      <n-form-item-gi :show-feedback="false">
        <template #label>
          <n-flex align="center" justify="space-between" style="width: 100%">
            <span>{{ t('json-output') }}</span>
            <CopyToClipboardButton v-if="hasOutput" :content="renderedJson" />
          </n-flex>
        </template>
        <n-card v-if="hasOutput" size="small">
          <n-code :code="renderedJson" language="json" :hljs="hljs" word-wrap />
        </n-card>
        <n-empty v-else :description="t('empty-state')" />
      </n-form-item-gi>
    </n-grid>
  </ToolSection>

  <ToolSection>
    <ToolSectionHeader>{{ t('parsed-details') }}</ToolSectionHeader>
    <n-empty v-if="!hasOutput" :description="t('empty-state')" />
    <n-grid v-else cols="1 s:2 l:3" responsive="screen" :x-gap="12" :y-gap="12">
      <ParsedSection :title="t('browser')" :items="browserItems" />
      <ParsedSection :title="t('os')" :items="osItems" />
      <ParsedSection :title="t('engine')" :items="engineItems" />
      <ParsedSection :title="t('device')" :items="deviceItems" />
      <ParsedSection :title="t('cpu')" :items="cpuItems" />
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import UAParser from 'ua-parser-js'
import {
  NButton,
  NCard,
  NCode,
  NEmpty,
  NFlex,
  NFormItemGi,
  NGrid,
  NIcon,
  NInput,
  NText,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import hljs from 'highlight.js/lib/core'
import jsonLang from 'highlight.js/lib/languages/json'
import ParsedSection from './ParsedSection.vue'
import { GlobePerson20Regular } from '@shared/icons/fluent'

hljs.registerLanguage('json', jsonLang)

const { t } = useI18n()

const defaultUserAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
const userAgent = useStorage('tools:user-agent-parser:input', defaultUserAgent)

const canUseCurrent = computed(() => typeof navigator !== 'undefined')
const hasInput = computed(() => userAgent.value.trim().length > 0)
const inputError = computed(() => !hasInput.value)
const inputStatus = computed(() => (inputError.value ? 'error' : undefined))

const parsedResult = computed(() => {
  if (!hasInput.value) return null
  const parser = new UAParser(userAgent.value)
  return parser.getResult()
})

const normalizedResult = computed(() => {
  if (!parsedResult.value) return null
  const { browser, engine, os, device, cpu, ua } = parsedResult.value
  return {
    ua: ua || userAgent.value,
    browser,
    os,
    engine,
    device,
    cpu,
  }
})

const hasOutput = computed(() => Boolean(normalizedResult.value))
const renderedJson = computed(() =>
  normalizedResult.value ? JSON.stringify(normalizedResult.value, null, 2) : '',
)

const formatValue = (value?: string | number | null) => {
  if (value === undefined || value === null || value === '') {
    return t('unknown')
  }
  return String(value)
}

const browserItems = computed(() => [
  { label: t('name'), value: formatValue(parsedResult.value?.browser?.name) },
  { label: t('version'), value: formatValue(parsedResult.value?.browser?.version) },
  { label: t('major'), value: formatValue(parsedResult.value?.browser?.major) },
])

const osItems = computed(() => [
  { label: t('name'), value: formatValue(parsedResult.value?.os?.name) },
  { label: t('version'), value: formatValue(parsedResult.value?.os?.version) },
])

const engineItems = computed(() => [
  { label: t('name'), value: formatValue(parsedResult.value?.engine?.name) },
  { label: t('version'), value: formatValue(parsedResult.value?.engine?.version) },
])

const deviceItems = computed(() => [
  { label: t('type'), value: formatValue(parsedResult.value?.device?.type) },
  { label: t('vendor'), value: formatValue(parsedResult.value?.device?.vendor) },
  { label: t('model'), value: formatValue(parsedResult.value?.device?.model) },
])

const cpuItems = computed(() => [
  { label: t('architecture'), value: formatValue(parsedResult.value?.cpu?.architecture) },
])

function useCurrentUserAgent() {
  if (typeof navigator === 'undefined') return
  userAgent.value = navigator.userAgent
}
</script>

<i18n lang="json">
{
  "en": {
    "use-current": "Use my user agent",
    "clear": "Clear",
    "input-label": "User Agent",
    "input-placeholder": "Paste a user agent string here...",
    "input-error": "Enter a user agent string to parse.",
    "json-output": "JSON Output",
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
    "use-current": "使用我的用户代理",
    "clear": "清空",
    "input-label": "用户代理（User-Agent）",
    "input-placeholder": "在此粘贴 User-Agent 字符串...",
    "input-error": "请输入要解析的 User-Agent 字符串。",
    "json-output": "JSON 输出",
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
    "use-current": "使用我的用户代理",
    "clear": "清空",
    "input-label": "用户代理（User-Agent）",
    "input-placeholder": "在此粘贴 User-Agent 字符串...",
    "input-error": "请输入要解析的 User-Agent 字符串。",
    "json-output": "JSON 输出",
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
    "use-current": "使用我的使用者代理",
    "clear": "清除",
    "input-label": "使用者代理（User-Agent）",
    "input-placeholder": "在此貼上 User-Agent 字串...",
    "input-error": "請輸入要解析的 User-Agent 字串。",
    "json-output": "JSON 輸出",
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
    "use-current": "使用我的使用者代理",
    "clear": "清除",
    "input-label": "使用者代理（User-Agent）",
    "input-placeholder": "在此貼上 User-Agent 字串...",
    "input-error": "請輸入要解析的 User-Agent 字串。",
    "json-output": "JSON 輸出",
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
    "use-current": "Usar mi user agent",
    "clear": "Limpiar",
    "input-label": "User Agent",
    "input-placeholder": "Pega una cadena de user agent aquí...",
    "input-error": "Introduce una cadena de user agent para analizar.",
    "json-output": "Salida JSON",
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
    "use-current": "Utiliser mon user agent",
    "clear": "Effacer",
    "input-label": "User Agent",
    "input-placeholder": "Collez une chaîne User-Agent ici...",
    "input-error": "Saisissez une chaîne User-Agent à analyser.",
    "json-output": "Sortie JSON",
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
    "use-current": "Meinen User Agent verwenden",
    "clear": "Leeren",
    "input-label": "User Agent",
    "input-placeholder": "User-Agent-String hier einfügen...",
    "input-error": "Gib einen User-Agent-String zum Parsen ein.",
    "json-output": "JSON-Ausgabe",
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
    "use-current": "Usa il mio user agent",
    "clear": "Cancella",
    "input-label": "User Agent",
    "input-placeholder": "Incolla qui una stringa User-Agent...",
    "input-error": "Inserisci una stringa User-Agent da analizzare.",
    "json-output": "Output JSON",
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
    "use-current": "現在のユーザーエージェントを使用",
    "clear": "クリア",
    "input-label": "ユーザーエージェント（User-Agent）",
    "input-placeholder": "User-Agent 文字列をここに貼り付け...",
    "input-error": "解析する User-Agent 文字列を入力してください。",
    "json-output": "JSON 出力",
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
    "use-current": "내 사용자 에이전트 사용",
    "clear": "지우기",
    "input-label": "사용자 에이전트",
    "input-placeholder": "User-Agent 문자열을 여기에 붙여넣기...",
    "input-error": "파싱할 User-Agent 문자열을 입력하세요.",
    "json-output": "JSON 출력",
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
    "use-current": "Использовать мой user agent",
    "clear": "Очистить",
    "input-label": "User Agent",
    "input-placeholder": "Вставьте строку User-Agent здесь...",
    "input-error": "Введите строку User-Agent для разбора.",
    "json-output": "Вывод JSON",
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
    "use-current": "Usar meu user agent",
    "clear": "Limpar",
    "input-label": "User Agent",
    "input-placeholder": "Cole uma string User-Agent aqui...",
    "input-error": "Insira uma string User-Agent para analisar.",
    "json-output": "Saída JSON",
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
    "use-current": "استخدم وكيل المستخدم الخاص بي",
    "clear": "مسح",
    "input-label": "وكيل المستخدم",
    "input-placeholder": "الصق سلسلة User-Agent هنا...",
    "input-error": "أدخل سلسلة User-Agent لتحليلها.",
    "json-output": "مخرجات JSON",
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
    "use-current": "मेरा User-Agent उपयोग करें",
    "clear": "साफ़ करें",
    "input-label": "User-Agent",
    "input-placeholder": "User-Agent स्ट्रिंग यहाँ पेस्ट करें...",
    "input-error": "विश्लेषण के लिए User-Agent स्ट्रिंग दर्ज करें।",
    "json-output": "JSON आउटपुट",
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
    "use-current": "Kendi user agent'ımı kullan",
    "clear": "Temizle",
    "input-label": "User Agent",
    "input-placeholder": "User-Agent dizesini buraya yapıştırın...",
    "input-error": "Ayrıştırmak için bir User-Agent dizesi girin.",
    "json-output": "JSON çıktısı",
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
    "use-current": "Gebruik mijn user agent",
    "clear": "Wissen",
    "input-label": "User Agent",
    "input-placeholder": "Plak hier een User-Agent-string...",
    "input-error": "Voer een User-Agent-string in om te parseren.",
    "json-output": "JSON-uitvoer",
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
    "use-current": "Använd min user agent",
    "clear": "Rensa",
    "input-label": "User Agent",
    "input-placeholder": "Klistra in en User-Agent-sträng här...",
    "input-error": "Ange en User-Agent-sträng att tolka.",
    "json-output": "JSON-utdata",
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
    "use-current": "Użyj mojego user agenta",
    "clear": "Wyczyść",
    "input-label": "User Agent",
    "input-placeholder": "Wklej tutaj ciąg User-Agent...",
    "input-error": "Wprowadź ciąg User-Agent do analizy.",
    "json-output": "Wyjście JSON",
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
    "use-current": "Dùng User-Agent của tôi",
    "clear": "Xóa",
    "input-label": "User Agent",
    "input-placeholder": "Dán chuỗi User-Agent vào đây...",
    "input-error": "Nhập chuỗi User-Agent để phân tích.",
    "json-output": "Kết quả JSON",
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
    "use-current": "ใช้ User-Agent ของฉัน",
    "clear": "ล้าง",
    "input-label": "User Agent",
    "input-placeholder": "วางสตริง User-Agent ที่นี่...",
    "input-error": "กรุณากรอกสตริง User-Agent เพื่อวิเคราะห์",
    "json-output": "เอาต์พุต JSON",
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
    "use-current": "Gunakan user agent saya",
    "clear": "Bersihkan",
    "input-label": "User Agent",
    "input-placeholder": "Tempel string User-Agent di sini...",
    "input-error": "Masukkan string User-Agent untuk dianalisis.",
    "json-output": "Keluaran JSON",
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
    "use-current": "השתמש ב‑User-Agent שלי",
    "clear": "נקה",
    "input-label": "User-Agent",
    "input-placeholder": "הדביקו כאן מחרוזת User-Agent...",
    "input-error": "הזינו מחרוזת User-Agent לניתוח.",
    "json-output": "פלט JSON",
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
    "use-current": "Gunakan user agent saya",
    "clear": "Kosongkan",
    "input-label": "User Agent",
    "input-placeholder": "Tampal rentetan User-Agent di sini...",
    "input-error": "Masukkan rentetan User-Agent untuk dianalisis.",
    "json-output": "Output JSON",
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
    "use-current": "Bruk min user agent",
    "clear": "Tøm",
    "input-label": "User Agent",
    "input-placeholder": "Lim inn en User-Agent-streng her...",
    "input-error": "Skriv inn en User-Agent-streng for å analysere.",
    "json-output": "JSON-utdata",
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
