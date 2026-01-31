<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :title="t('importUrlTitle')"
    :style="modalStyle"
    :segmented="modalSegmented"
    :bordered="false"
    size="large"
    :mask-closable="false"
  >
    <n-space vertical size="small">
      <n-alert type="warning" :bordered="false">
        {{ t('importUrlWarning') }}
      </n-alert>
      <n-form-item
        :label="t('importUrlLabel')"
        :show-feedback="Boolean(importUrlError)"
        :validation-status="importUrlStatus"
      >
        <n-input
          class="monospace-input"
          :value="importUrl"
          :placeholder="t('importUrlPlaceholder')"
          :status="importUrlStatus"
          :disabled="isImporting"
          @update:value="onUpdateInput"
          @keydown.enter="onEnter"
        />
        <template v-if="importUrlError" #feedback>
          <n-text type="error">{{ importUrlError }}</n-text>
        </template>
      </n-form-item>
    </n-space>
    <template #footer>
      <n-flex justify="end" :wrap="false">
        <n-button :disabled="isImporting" @click="onClose">
          {{ t('importUrlCancel') }}
        </n-button>
        <n-button type="primary" :loading="isImporting" @click="onConfirm">
          {{ t('importUrlConfirm') }}
        </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NAlert, NButton, NFlex, NFormItem, NInput, NModal, NSpace, NText } from 'naive-ui'

defineProps<{
  importUrl: string
  importUrlError: string
  importUrlStatus?: 'error' | 'success'
  isImporting: boolean
  onUpdateInput: (value: string) => void
  onEnter: (event: KeyboardEvent) => void
  onClose: () => void
  onConfirm: () => void
}>()

const show = defineModel<boolean>('show', { required: true })

const { t } = useI18n({ useScope: 'local' })

const modalStyle = { width: '520px' }
const modalSegmented = { content: 'soft', footer: 'soft' } as const
</script>

<i18n lang="json">
{
  "en": {
    "importUrlTitle": "Import from URL",
    "importUrlWarning": "This runs in your browser. The URL must allow CORS, or the request will fail.",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Cancel",
    "importUrlConfirm": "Import"
  },
  "zh": {
    "importUrlTitle": "从 URL 导入",
    "importUrlWarning": "此操作在浏览器中执行。URL 需要允许 CORS，否则请求会失败。",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "取消",
    "importUrlConfirm": "导入"
  },
  "zh-CN": {
    "importUrlTitle": "从 URL 导入",
    "importUrlWarning": "此操作在浏览器中执行。URL 需要允许 CORS，否则请求会失败。",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "取消",
    "importUrlConfirm": "导入"
  },
  "zh-TW": {
    "importUrlTitle": "從 URL 匯入",
    "importUrlWarning": "此操作在瀏覽器中執行。URL 必須允許 CORS，否則請求會失敗。",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "取消",
    "importUrlConfirm": "匯入"
  },
  "zh-HK": {
    "importUrlTitle": "從 URL 匯入",
    "importUrlWarning": "此操作在瀏覽器中執行。URL 必須允許 CORS，否則請求會失敗。",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "取消",
    "importUrlConfirm": "匯入"
  },
  "es": {
    "importUrlTitle": "Importar desde URL",
    "importUrlWarning": "Esto se ejecuta en tu navegador. La URL debe permitir CORS o la solicitud fallará.",
    "importUrlLabel": "URL de OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Cancelar",
    "importUrlConfirm": "Importar"
  },
  "fr": {
    "importUrlTitle": "Importer depuis une URL",
    "importUrlWarning": "Cela s'exécute dans votre navigateur. L'URL doit autoriser CORS, sinon la requête échouera.",
    "importUrlLabel": "URL OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Annuler",
    "importUrlConfirm": "Importer"
  },
  "de": {
    "importUrlTitle": "Von URL importieren",
    "importUrlWarning": "Dies läuft im Browser. Die URL muss CORS erlauben, sonst schlägt die Anfrage fehl.",
    "importUrlLabel": "OpenAPI-URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Abbrechen",
    "importUrlConfirm": "Importieren"
  },
  "it": {
    "importUrlTitle": "Importa da URL",
    "importUrlWarning": "Eseguito nel browser. La URL deve consentire CORS o la richiesta fallirà.",
    "importUrlLabel": "URL OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Annulla",
    "importUrlConfirm": "Importa"
  },
  "ja": {
    "importUrlTitle": "URL からインポート",
    "importUrlWarning": "ブラウザ内で実行されます。URL が CORS を許可していない場合、リクエストは失敗します。",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "キャンセル",
    "importUrlConfirm": "インポート"
  },
  "ko": {
    "importUrlTitle": "URL에서 가져오기",
    "importUrlWarning": "브라우저에서 실행됩니다. URL이 CORS를 허용하지 않으면 요청이 실패합니다.",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "취소",
    "importUrlConfirm": "가져오기"
  },
  "ru": {
    "importUrlTitle": "Импорт из URL",
    "importUrlWarning": "Выполняется в браузере. URL должен разрешать CORS, иначе запрос не пройдет.",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Отмена",
    "importUrlConfirm": "Импортировать"
  },
  "pt": {
    "importUrlTitle": "Importar de URL",
    "importUrlWarning": "Isso roda no navegador. A URL precisa permitir CORS, ou a solicitação falhará.",
    "importUrlLabel": "URL do OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Cancelar",
    "importUrlConfirm": "Importar"
  },
  "ar": {
    "importUrlTitle": "استيراد من عنوان URL",
    "importUrlWarning": "يعمل هذا في المتصفح. يجب أن يسمح عنوان URL بـ CORS وإلا سيفشل الطلب.",
    "importUrlLabel": "عنوان URL لـ OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "إلغاء",
    "importUrlConfirm": "استيراد"
  },
  "hi": {
    "importUrlTitle": "URL से आयात करें",
    "importUrlWarning": "यह ब्राउज़र में चलता है। URL को CORS की अनुमति देनी होगी, नहीं तो अनुरोध विफल होगा।",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "रद्द करें",
    "importUrlConfirm": "आयात करें"
  },
  "tr": {
    "importUrlTitle": "URL'den içe aktar",
    "importUrlWarning": "Bu işlem tarayıcıda çalışır. URL CORS'a izin vermeli, aksi halde istek başarısız olur.",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "İptal",
    "importUrlConfirm": "İçe aktar"
  },
  "nl": {
    "importUrlTitle": "Importeren via URL",
    "importUrlWarning": "Dit draait in je browser. De URL moet CORS toestaan, anders mislukt het verzoek.",
    "importUrlLabel": "OpenAPI-URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Annuleren",
    "importUrlConfirm": "Importeren"
  },
  "sv": {
    "importUrlTitle": "Importera från URL",
    "importUrlWarning": "Detta körs i webbläsaren. URL:en måste tillåta CORS, annars misslyckas begäran.",
    "importUrlLabel": "OpenAPI-URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Avbryt",
    "importUrlConfirm": "Importera"
  },
  "pl": {
    "importUrlTitle": "Importuj z URL",
    "importUrlWarning": "Działa w przeglądarce. URL musi zezwalać na CORS, inaczej żądanie się nie powiedzie.",
    "importUrlLabel": "URL OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Anuluj",
    "importUrlConfirm": "Importuj"
  },
  "vi": {
    "importUrlTitle": "Nhập từ URL",
    "importUrlWarning": "Chạy trong trình duyệt. URL phải cho phép CORS, nếu không yêu cầu sẽ thất bại.",
    "importUrlLabel": "URL OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Hủy",
    "importUrlConfirm": "Nhập"
  },
  "th": {
    "importUrlTitle": "นำเข้าจาก URL",
    "importUrlWarning": "ทำงานในเบราว์เซอร์ URL ต้องอนุญาต CORS ไม่เช่นนั้นคำขอจะล้มเหลว",
    "importUrlLabel": "OpenAPI URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "ยกเลิก",
    "importUrlConfirm": "นำเข้า"
  },
  "id": {
    "importUrlTitle": "Impor dari URL",
    "importUrlWarning": "Berjalan di browser. URL harus mengizinkan CORS, jika tidak permintaan akan gagal.",
    "importUrlLabel": "URL OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Batal",
    "importUrlConfirm": "Impor"
  },
  "he": {
    "importUrlTitle": "ייבוא מ-URL",
    "importUrlWarning": "פועל בדפדפן. ה-URL חייב לאפשר CORS אחרת הבקשה תיכשל.",
    "importUrlLabel": "כתובת URL של OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "ביטול",
    "importUrlConfirm": "ייבוא"
  },
  "ms": {
    "importUrlTitle": "Import dari URL",
    "importUrlWarning": "Berjalan dalam pelayar. URL mesti membenarkan CORS, jika tidak permintaan akan gagal.",
    "importUrlLabel": "URL OpenAPI",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Batal",
    "importUrlConfirm": "Import"
  },
  "no": {
    "importUrlTitle": "Importer fra URL",
    "importUrlWarning": "Dette kjører i nettleseren. URL-en må tillate CORS, ellers vil forespørselen mislykkes.",
    "importUrlLabel": "OpenAPI-URL",
    "importUrlPlaceholder": "https://example.com/openapi.yaml",
    "importUrlCancel": "Avbryt",
    "importUrlConfirm": "Importer"
  }
}
</i18n>
