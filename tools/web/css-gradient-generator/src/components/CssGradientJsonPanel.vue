<template>
  <n-card class="panel">
    <div class="panel__header">
      <div>
        <div class="panel__title">{{ t('jsonTitle') }}</div>
        <div class="panel__subtitle">{{ t('jsonSubtitle') }}</div>
      </div>
    </div>
    <n-flex vertical :size="12">
      <n-input
        :value="serializedConfig"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6 }"
        readonly
        data-testid="json-output"
      />
      <n-flex :size="8" :wrap="true">
        <CopyToClipboardButton :content="serializedConfig">
          <template #label>{{ t('copyJson') }}</template>
        </CopyToClipboardButton>
        <n-button
          tag="a"
          text
          :href="jsonUrl ?? undefined"
          download="gradient.json"
          :disabled="!jsonUrl"
          data-testid="download-json"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('downloadJson') }}
        </n-button>
      </n-flex>
      <n-input
        v-model:value="jsonInputModel"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 6 }"
        :placeholder="t('jsonPlaceholder')"
        data-testid="json-input"
      />
      <n-button type="primary" data-testid="load-json" @click="handleLoadJson">
        <template #icon>
          <n-icon :component="DocumentArrowUp20Regular" />
        </template>
        {{ t('loadJson') }}
      </n-button>
      <n-alert
        v-if="showError"
        type="warning"
        :show-icon="false"
        class="panel__alert"
        data-testid="json-error"
      >
        {{ t('invalidJson') }}
      </n-alert>
    </n-flex>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NAlert, NButton, NCard, NFlex, NIcon, NInput } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import DocumentArrowUp20Regular from '@vicons/fluent/DocumentArrowUp20Regular'

const { t } = useI18n()

const props = defineProps<{
  serializedConfig: string
  jsonInput: string
  jsonUrl?: string
  showError: boolean
}>()

const emit = defineEmits<{
  (event: 'update:jsonInput', value: string): void
  (event: 'load-json'): void
}>()

const jsonInputModel = computed({
  get: () => props.jsonInput,
  set: (value: string) => emit('update:jsonInput', value),
})

function handleLoadJson() {
  emit('load-json')
}
</script>

<i18n lang="json">
{
  "en": {
    "jsonTitle": "Config JSON",
    "jsonSubtitle": "Export or paste a gradient setup.",
    "copyJson": "Copy JSON",
    "downloadJson": "Download JSON",
    "jsonPlaceholder": "Paste JSON to load a gradient...",
    "loadJson": "Load JSON",
    "invalidJson": "Invalid gradient JSON."
  },
  "zh": {
    "jsonTitle": "配置 JSON",
    "jsonSubtitle": "导出或粘贴渐变配置。",
    "copyJson": "复制 JSON",
    "downloadJson": "下载 JSON",
    "jsonPlaceholder": "粘贴 JSON 以加载渐变...",
    "loadJson": "加载 JSON",
    "invalidJson": "无效的渐变 JSON。"
  },
  "zh-CN": {
    "jsonTitle": "配置 JSON",
    "jsonSubtitle": "导出或粘贴渐变配置。",
    "copyJson": "复制 JSON",
    "downloadJson": "下载 JSON",
    "jsonPlaceholder": "粘贴 JSON 以加载渐变...",
    "loadJson": "加载 JSON",
    "invalidJson": "无效的渐变 JSON。"
  },
  "zh-TW": {
    "jsonTitle": "設定 JSON",
    "jsonSubtitle": "匯出或貼上漸層設定。",
    "copyJson": "複製 JSON",
    "downloadJson": "下載 JSON",
    "jsonPlaceholder": "貼上 JSON 以載入漸層...",
    "loadJson": "載入 JSON",
    "invalidJson": "無效的漸層 JSON。"
  },
  "zh-HK": {
    "jsonTitle": "設定 JSON",
    "jsonSubtitle": "匯出或貼上漸層設定。",
    "copyJson": "複製 JSON",
    "downloadJson": "下載 JSON",
    "jsonPlaceholder": "貼上 JSON 以載入漸層...",
    "loadJson": "載入 JSON",
    "invalidJson": "無效的漸層 JSON。"
  },
  "es": {
    "jsonTitle": "JSON de configuración",
    "jsonSubtitle": "Exporta o pega una configuración de gradiente.",
    "copyJson": "Copiar JSON",
    "downloadJson": "Descargar JSON",
    "jsonPlaceholder": "Pega JSON para cargar un gradiente...",
    "loadJson": "Cargar JSON",
    "invalidJson": "JSON de gradiente inválido."
  },
  "fr": {
    "jsonTitle": "JSON de configuration",
    "jsonSubtitle": "Exportez ou collez une configuration de dégradé.",
    "copyJson": "Copier le JSON",
    "downloadJson": "Télécharger le JSON",
    "jsonPlaceholder": "Collez du JSON pour charger un dégradé...",
    "loadJson": "Charger le JSON",
    "invalidJson": "JSON de dégradé invalide."
  },
  "de": {
    "jsonTitle": "Konfig-JSON",
    "jsonSubtitle": "Exportieren oder einfügen, um ein Setup zu laden.",
    "copyJson": "JSON kopieren",
    "downloadJson": "JSON herunterladen",
    "jsonPlaceholder": "JSON einfügen, um einen Verlauf zu laden...",
    "loadJson": "JSON laden",
    "invalidJson": "Ungültiges Verlaufs-JSON."
  },
  "it": {
    "jsonTitle": "JSON di configurazione",
    "jsonSubtitle": "Esporta o incolla una configurazione.",
    "copyJson": "Copia JSON",
    "downloadJson": "Scarica JSON",
    "jsonPlaceholder": "Incolla JSON per caricare un gradiente...",
    "loadJson": "Carica JSON",
    "invalidJson": "JSON del gradiente non valido."
  },
  "ja": {
    "jsonTitle": "設定 JSON",
    "jsonSubtitle": "設定をエクスポートまたは貼り付け。",
    "copyJson": "JSON をコピー",
    "downloadJson": "JSON をダウンロード",
    "jsonPlaceholder": "JSON を貼り付けてグラデーションを読み込み...",
    "loadJson": "JSON を読み込む",
    "invalidJson": "無効なグラデーション JSON です。"
  },
  "ko": {
    "jsonTitle": "설정 JSON",
    "jsonSubtitle": "설정을 내보내거나 붙여넣어 불러오세요.",
    "copyJson": "JSON 복사",
    "downloadJson": "JSON 다운로드",
    "jsonPlaceholder": "JSON을 붙여넣어 그라디언트를 불러오기...",
    "loadJson": "JSON 불러오기",
    "invalidJson": "잘못된 그라디언트 JSON입니다."
  },
  "ru": {
    "jsonTitle": "JSON конфигурации",
    "jsonSubtitle": "Экспортируйте или вставьте конфигурацию.",
    "copyJson": "Копировать JSON",
    "downloadJson": "Скачать JSON",
    "jsonPlaceholder": "Вставьте JSON, чтобы загрузить градиент...",
    "loadJson": "Загрузить JSON",
    "invalidJson": "Неверный JSON градиента."
  },
  "pt": {
    "jsonTitle": "JSON de configuração",
    "jsonSubtitle": "Exporte ou cole uma configuração.",
    "copyJson": "Copiar JSON",
    "downloadJson": "Baixar JSON",
    "jsonPlaceholder": "Cole JSON para carregar um gradiente...",
    "loadJson": "Carregar JSON",
    "invalidJson": "JSON de gradiente inválido."
  },
  "ar": {
    "jsonTitle": "JSON للإعداد",
    "jsonSubtitle": "صدّر أو الصق إعداد التدرج.",
    "copyJson": "نسخ JSON",
    "downloadJson": "تنزيل JSON",
    "jsonPlaceholder": "الصق JSON لتحميل التدرج...",
    "loadJson": "تحميل JSON",
    "invalidJson": "JSON غير صالح للتدرج."
  },
  "hi": {
    "jsonTitle": "कॉन्फ़िग JSON",
    "jsonSubtitle": "कॉन्फ़िग निर्यात या पेस्ट करें।",
    "copyJson": "JSON कॉपी करें",
    "downloadJson": "JSON डाउनलोड करें",
    "jsonPlaceholder": "ग्रेडिएंट लोड करने के लिए JSON पेस्ट करें...",
    "loadJson": "JSON लोड करें",
    "invalidJson": "अमान्य ग्रेडिएंट JSON।"
  },
  "tr": {
    "jsonTitle": "JSON yapılandırması",
    "jsonSubtitle": "Yapılandırmayı dışa aktarın veya yapıştırın.",
    "copyJson": "JSON kopyala",
    "downloadJson": "JSON indir",
    "jsonPlaceholder": "Gradyan yüklemek için JSON yapıştırın...",
    "loadJson": "JSON yükle",
    "invalidJson": "Geçersiz gradyan JSON'u."
  },
  "nl": {
    "jsonTitle": "Configuratie-JSON",
    "jsonSubtitle": "Exporteer of plak een configuratie.",
    "copyJson": "JSON kopiëren",
    "downloadJson": "JSON downloaden",
    "jsonPlaceholder": "Plak JSON om een gradient te laden...",
    "loadJson": "JSON laden",
    "invalidJson": "Ongeldige gradient-JSON."
  },
  "sv": {
    "jsonTitle": "Konfigurations-JSON",
    "jsonSubtitle": "Exportera eller klistra in en konfiguration.",
    "copyJson": "Kopiera JSON",
    "downloadJson": "Ladda ner JSON",
    "jsonPlaceholder": "Klistra in JSON för att ladda en gradient...",
    "loadJson": "Ladda JSON",
    "invalidJson": "Ogiltig gradient-JSON."
  },
  "pl": {
    "jsonTitle": "JSON konfiguracji",
    "jsonSubtitle": "Eksportuj lub wklej konfigurację.",
    "copyJson": "Kopiuj JSON",
    "downloadJson": "Pobierz JSON",
    "jsonPlaceholder": "Wklej JSON, aby wczytać gradient...",
    "loadJson": "Wczytaj JSON",
    "invalidJson": "Nieprawidłowy JSON gradientu."
  },
  "vi": {
    "jsonTitle": "JSON cấu hình",
    "jsonSubtitle": "Xuất hoặc dán cấu hình gradient.",
    "copyJson": "Sao chép JSON",
    "downloadJson": "Tải JSON",
    "jsonPlaceholder": "Dán JSON để tải gradient...",
    "loadJson": "Tải JSON",
    "invalidJson": "JSON gradient không hợp lệ."
  },
  "th": {
    "jsonTitle": "JSON การตั้งค่า",
    "jsonSubtitle": "ส่งออกหรือวางการตั้งค่าไล่สี",
    "copyJson": "คัดลอก JSON",
    "downloadJson": "ดาวน์โหลด JSON",
    "jsonPlaceholder": "วาง JSON เพื่อโหลดไล่สี...",
    "loadJson": "โหลด JSON",
    "invalidJson": "JSON ไล่สีไม่ถูกต้อง"
  },
  "id": {
    "jsonTitle": "JSON konfigurasi",
    "jsonSubtitle": "Ekspor atau tempel konfigurasi.",
    "copyJson": "Salin JSON",
    "downloadJson": "Unduh JSON",
    "jsonPlaceholder": "Tempel JSON untuk memuat gradien...",
    "loadJson": "Muat JSON",
    "invalidJson": "JSON gradien tidak valid."
  },
  "he": {
    "jsonTitle": "JSON תצורה",
    "jsonSubtitle": "ייצאו או הדביקו תצורה.",
    "copyJson": "העתק JSON",
    "downloadJson": "הורד JSON",
    "jsonPlaceholder": "הדביקו JSON כדי לטעון גרדיאנט...",
    "loadJson": "טען JSON",
    "invalidJson": "JSON גרדיאנט לא תקין."
  },
  "ms": {
    "jsonTitle": "JSON konfigurasi",
    "jsonSubtitle": "Eksport atau tampal konfigurasi.",
    "copyJson": "Salin JSON",
    "downloadJson": "Muat turun JSON",
    "jsonPlaceholder": "Tampal JSON untuk memuat gradien...",
    "loadJson": "Muat JSON",
    "invalidJson": "JSON gradien tidak sah."
  },
  "no": {
    "jsonTitle": "JSON-konfigurasjon",
    "jsonSubtitle": "Eksporter eller lim inn konfigurasjon.",
    "copyJson": "Kopier JSON",
    "downloadJson": "Last ned JSON",
    "jsonPlaceholder": "Lim inn JSON for å laste en gradient...",
    "loadJson": "Last JSON",
    "invalidJson": "Ugyldig gradient-JSON."
  }
}
</i18n>
