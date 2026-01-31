<template>
  <ToolSectionHeader>{{ t('uploadTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="8">
      <PDFUpload @upload-file="handleUpload" />
      <n-text depth="3">{{ t('localNote') }}</n-text>
    </n-flex>
  </ToolSection>

  <ToolSection v-if="isLoading && !pdfInfo">
    <n-flex align="center" :size="8">
      <n-spin size="small" />
      <n-text>{{ t('loading') }}</n-text>
    </n-flex>
  </ToolSection>

  <PDFInfoResults v-if="pdfInfo" :info="pdfInfo" :loading="isLoading" />

  <ToolSection v-if="errorMessage">
    <n-alert type="error" :title="t('errorTitle')">
      {{ errorMessage }}
    </n-alert>
  </ToolSection>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NFlex, NSpin, NText } from 'naive-ui'
import { PDFUpload } from '@shared/ui/domain/pdf'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import PDFInfoResults from './PDFInfoResults.vue'
import { extractPdfInfo } from '../utils/extractPdfInfo'
import type { PdfInfo } from '../utils/extractPdfInfo'

const { t } = useI18n()

const pdfFile = ref<File | null>(null)
const pdfInfo = ref<PdfInfo | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')

const handleUpload = (file: File) => {
  pdfFile.value = file
}

watch(pdfFile, async (file) => {
  pdfInfo.value = null
  errorMessage.value = ''

  if (!file) return

  isLoading.value = true
  try {
    pdfInfo.value = await extractPdfInfo(file)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('parseFailed')
  } finally {
    isLoading.value = false
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loading": "Reading PDF information...",
    "errorTitle": "Error",
    "parseFailed": "Failed to read PDF information."
  },
  "zh": {
    "uploadTitle": "上传 PDF",
    "localNote": "在浏览器本地处理，不会上传文件。",
    "loading": "正在读取 PDF 信息...",
    "errorTitle": "错误",
    "parseFailed": "读取 PDF 信息失败。"
  },
  "zh-CN": {
    "uploadTitle": "上传 PDF",
    "localNote": "在浏览器本地处理，不会上传文件。",
    "loading": "正在读取 PDF 信息...",
    "errorTitle": "错误",
    "parseFailed": "读取 PDF 信息失败。"
  },
  "zh-TW": {
    "uploadTitle": "上傳 PDF",
    "localNote": "在瀏覽器本機處理，不會上傳檔案。",
    "loading": "正在讀取 PDF 資訊...",
    "errorTitle": "錯誤",
    "parseFailed": "讀取 PDF 資訊失敗。"
  },
  "zh-HK": {
    "uploadTitle": "上傳 PDF",
    "localNote": "在瀏覽器本機處理，不會上傳檔案。",
    "loading": "正在讀取 PDF 資訊...",
    "errorTitle": "錯誤",
    "parseFailed": "讀取 PDF 資訊失敗。"
  },
  "es": {
    "uploadTitle": "Subir PDF",
    "localNote": "Se ejecuta localmente en tu navegador. No se suben archivos.",
    "loading": "Leyendo información del PDF...",
    "errorTitle": "Error",
    "parseFailed": "No se pudo leer la información del PDF."
  },
  "fr": {
    "uploadTitle": "Importer un PDF",
    "localNote": "Exécution locale dans votre navigateur. Aucun envoi de fichier.",
    "loading": "Lecture des informations PDF...",
    "errorTitle": "Erreur",
    "parseFailed": "Impossible de lire les informations du PDF."
  },
  "de": {
    "uploadTitle": "PDF hochladen",
    "localNote": "Läuft lokal im Browser. Keine Uploads.",
    "loading": "PDF-Informationen werden gelesen...",
    "errorTitle": "Fehler",
    "parseFailed": "PDF-Informationen konnten nicht gelesen werden."
  },
  "it": {
    "uploadTitle": "Carica PDF",
    "localNote": "Esecuzione locale nel browser. Nessun caricamento.",
    "loading": "Lettura delle informazioni del PDF...",
    "errorTitle": "Errore",
    "parseFailed": "Impossibile leggere le informazioni del PDF."
  },
  "ja": {
    "uploadTitle": "PDF をアップロード",
    "localNote": "ブラウザ内でローカル実行されます。アップロードされません。",
    "loading": "PDF 情報を読み取っています...",
    "errorTitle": "エラー",
    "parseFailed": "PDF 情報の読み取りに失敗しました。"
  },
  "ko": {
    "uploadTitle": "PDF 업로드",
    "localNote": "브라우저에서 로컬로 처리됩니다. 업로드되지 않습니다.",
    "loading": "PDF 정보를 읽는 중...",
    "errorTitle": "오류",
    "parseFailed": "PDF 정보를 읽지 못했습니다."
  },
  "ru": {
    "uploadTitle": "Загрузить PDF",
    "localNote": "Выполняется локально в браузере. Файлы не загружаются.",
    "loading": "Чтение информации PDF...",
    "errorTitle": "Ошибка",
    "parseFailed": "Не удалось прочитать информацию PDF."
  },
  "pt": {
    "uploadTitle": "Enviar PDF",
    "localNote": "Executa localmente no navegador. Nenhum upload.",
    "loading": "Lendo informações do PDF...",
    "errorTitle": "Erro",
    "parseFailed": "Não foi possível ler as informações do PDF."
  },
  "ar": {
    "uploadTitle": "رفع PDF",
    "localNote": "يعمل محليًا في المتصفح. لا يتم رفع الملفات.",
    "loading": "جارٍ قراءة معلومات PDF...",
    "errorTitle": "خطأ",
    "parseFailed": "تعذر قراءة معلومات PDF."
  },
  "hi": {
    "uploadTitle": "PDF अपलोड करें",
    "localNote": "यह ब्राउज़र में लोकल रूप से चलता है। कोई अपलोड नहीं होता।",
    "loading": "PDF जानकारी पढ़ी जा रही है...",
    "errorTitle": "त्रुटि",
    "parseFailed": "PDF जानकारी पढ़ी नहीं जा सकी।"
  },
  "tr": {
    "uploadTitle": "PDF yükle",
    "localNote": "Tarayıcıda yerel olarak çalışır. Yükleme yapılmaz.",
    "loading": "PDF bilgileri okunuyor...",
    "errorTitle": "Hata",
    "parseFailed": "PDF bilgileri okunamadı."
  },
  "nl": {
    "uploadTitle": "PDF uploaden",
    "localNote": "Draait lokaal in je browser. Geen uploads.",
    "loading": "PDF-informatie wordt gelezen...",
    "errorTitle": "Fout",
    "parseFailed": "PDF-informatie kon niet worden gelezen."
  },
  "sv": {
    "uploadTitle": "Ladda upp PDF",
    "localNote": "Körs lokalt i webbläsaren. Inga uppladdningar.",
    "loading": "Läser PDF-information...",
    "errorTitle": "Fel",
    "parseFailed": "Kunde inte läsa PDF-information."
  },
  "pl": {
    "uploadTitle": "Prześlij PDF",
    "localNote": "Działa lokalnie w przeglądarce. Brak wysyłania plików.",
    "loading": "Odczytywanie informacji PDF...",
    "errorTitle": "Błąd",
    "parseFailed": "Nie udało się odczytać informacji PDF."
  },
  "vi": {
    "uploadTitle": "Tải lên PDF",
    "localNote": "Chạy cục bộ trong trình duyệt. Không tải lên.",
    "loading": "Đang đọc thông tin PDF...",
    "errorTitle": "Lỗi",
    "parseFailed": "Không thể đọc thông tin PDF."
  },
  "th": {
    "uploadTitle": "อัปโหลด PDF",
    "localNote": "ทำงานในเบราว์เซอร์แบบโลคัล ไม่มีการอัปโหลดไฟล์",
    "loading": "กำลังอ่านข้อมูล PDF...",
    "errorTitle": "ข้อผิดพลาด",
    "parseFailed": "ไม่สามารถอ่านข้อมูล PDF ได้"
  },
  "id": {
    "uploadTitle": "Unggah PDF",
    "localNote": "Berjalan secara lokal di browser. Tidak ada unggahan.",
    "loading": "Membaca informasi PDF...",
    "errorTitle": "Kesalahan",
    "parseFailed": "Gagal membaca informasi PDF."
  },
  "he": {
    "uploadTitle": "העלה PDF",
    "localNote": "רץ מקומית בדפדפן. ללא העלאות.",
    "loading": "קורא מידע PDF...",
    "errorTitle": "שגיאה",
    "parseFailed": "נכשלה קריאת מידע ה-PDF."
  },
  "ms": {
    "uploadTitle": "Muat naik PDF",
    "localNote": "Berjalan secara lokal dalam pelayar. Tiada muat naik.",
    "loading": "Membaca maklumat PDF...",
    "errorTitle": "Ralat",
    "parseFailed": "Gagal membaca maklumat PDF."
  },
  "no": {
    "uploadTitle": "Last opp PDF",
    "localNote": "Kjører lokalt i nettleseren. Ingen opplastinger.",
    "loading": "Leser PDF-informasjon...",
    "errorTitle": "Feil",
    "parseFailed": "Kunne ikke lese PDF-informasjon."
  }
}
</i18n>
