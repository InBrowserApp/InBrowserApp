<template>
  <ToolSection>
    <n-text depth="3">{{ t('note') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NText } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "note": "Runs locally in your browser. No uploads."
  },
  "zh": {
    "note": "所有操作均在本地浏览器完成，不会上传文件。"
  },
  "zh-CN": {
    "note": "所有操作均在本地浏览器完成，不会上传文件。"
  },
  "zh-TW": {
    "note": "所有操作都在本機瀏覽器完成，不會上傳檔案。"
  },
  "zh-HK": {
    "note": "所有操作都在本機瀏覽器完成，不會上傳檔案。"
  },
  "es": {
    "note": "Se ejecuta localmente en tu navegador. Sin subidas."
  },
  "fr": {
    "note": "Fonctionne localement dans votre navigateur. Aucun envoi."
  },
  "de": {
    "note": "Läuft lokal in Ihrem Browser. Keine Uploads."
  },
  "it": {
    "note": "Funziona localmente nel browser. Nessun upload."
  },
  "ja": {
    "note": "処理はブラウザ内で完結します。アップロードは行いません。"
  },
  "ko": {
    "note": "브라우저에서 로컬로 실행됩니다. 업로드 없음."
  },
  "ru": {
    "note": "Работает локально в вашем браузере. Без загрузок."
  },
  "pt": {
    "note": "Executa localmente no seu navegador. Sem envios."
  },
  "ar": {
    "note": "يعمل محليًا في المتصفح. لا يوجد رفع للملفات."
  },
  "hi": {
    "note": "सब कुछ आपके ब्राउज़र में स्थानीय रूप से चलता है। अपलोड नहीं होता।"
  },
  "tr": {
    "note": "Tarayıcınızda yerel olarak çalışır. Yükleme yok."
  },
  "nl": {
    "note": "Werkt lokaal in je browser. Geen uploads."
  },
  "sv": {
    "note": "Körs lokalt i din webbläsare. Inga uppladdningar."
  },
  "pl": {
    "note": "Działa lokalnie w Twojej przeglądarce. Brak przesyłania."
  },
  "vi": {
    "note": "Chạy cục bộ trong trình duyệt. Không tải lên."
  },
  "th": {
    "note": "ทำงานในเบราว์เซอร์ของคุณแบบโลคัล ไม่มีการอัปโหลด"
  },
  "id": {
    "note": "Berjalan secara lokal di browser Anda. Tidak ada unggahan."
  },
  "he": {
    "note": "פועל מקומית בדפדפן שלך. ללא העלאות."
  },
  "ms": {
    "note": "Berjalan secara tempatan dalam pelayar anda. Tiada muat naik."
  },
  "no": {
    "note": "Kjører lokalt i nettleseren din. Ingen opplastinger."
  }
}
</i18n>
