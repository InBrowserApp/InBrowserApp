<template>
  <ToolSectionHeader>{{ t('upload-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <template v-if="!archiveFile">
        <n-upload
          :accept="acceptedFormats"
          :default-upload="false"
          :show-file-list="false"
          @before-upload="handleBeforeUpload"
        >
          <n-upload-dragger>
            <n-flex vertical align="center" :size="8" style="padding: 12px 8px">
              <n-icon :component="FolderZip16Regular" size="40" :depth="3" />
              <n-text strong>{{ t('upload-hint') }}</n-text>
              <n-text depth="3">{{ t('supported-formats') }}</n-text>
            </n-flex>
          </n-upload-dragger>
        </n-upload>
      </template>

      <template v-else>
        <n-flex justify="space-between" align="center" :size="12">
          <n-flex vertical :size="4">
            <n-flex align="center" :size="8">
              <n-icon :component="FolderZip16Regular" />
              <n-text strong>{{ archiveFile.name }}</n-text>
            </n-flex>
            <n-text depth="3">{{ archiveSizeSummary }}</n-text>
          </n-flex>

          <n-button text @click="onChooseAnotherArchive">
            <template #icon>
              <n-icon :component="ArrowUpload16Regular" />
            </template>
            {{ t('select-new-file') }}
          </n-button>
        </n-flex>
      </template>

      <n-text v-if="!archiveFile" depth="3">{{ t('local-note') }}</n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NFlex, NIcon, NText, NUpload, NUploadDragger } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import ArrowUpload16Regular from '@vicons/fluent/ArrowUpload16Regular'
import FolderZip16Regular from '@vicons/fluent/FolderZip16Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

type UploadBeforeHandler = (data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) => boolean | void | Promise<boolean | void>

defineProps<{
  archiveFile: File | null
  archiveSizeSummary: string
  acceptedFormats: string
  handleBeforeUpload: UploadBeforeHandler
  onChooseAnotherArchive: () => void | Promise<void>
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "upload-title": "Upload archive",
    "upload-hint": "Click or drag to upload an archive file",
    "supported-formats": "Supported formats: ZIP, TAR, GZ, TGZ",
    "select-new-file": "Choose another archive",
    "local-note": "Runs locally in your browser. No uploads."
  },
  "zh": {
    "upload-title": "上传压缩包",
    "upload-hint": "点击或拖拽上传压缩文件",
    "supported-formats": "支持格式：ZIP、TAR、GZ、TGZ",
    "select-new-file": "选择其他压缩包",
    "local-note": "仅在浏览器本地运行，不会上传文件。"
  },
  "zh-CN": {
    "upload-title": "上传压缩包",
    "upload-hint": "点击或拖拽上传压缩文件",
    "supported-formats": "支持格式：ZIP、TAR、GZ、TGZ",
    "select-new-file": "选择其他压缩包",
    "local-note": "仅在浏览器本地运行，不会上传文件。"
  },
  "zh-TW": {
    "upload-title": "上傳壓縮檔",
    "upload-hint": "點擊或拖曳上傳壓縮檔案",
    "supported-formats": "支援格式：ZIP、TAR、GZ、TGZ",
    "select-new-file": "選擇其他壓縮檔",
    "local-note": "僅在瀏覽器本機執行，不會上傳檔案。"
  },
  "zh-HK": {
    "upload-title": "上傳壓縮檔",
    "upload-hint": "點擊或拖曳上傳壓縮檔案",
    "supported-formats": "支援格式：ZIP、TAR、GZ、TGZ",
    "select-new-file": "選擇其他壓縮檔",
    "local-note": "僅在瀏覽器本機執行，不會上傳檔案。"
  },
  "es": {
    "upload-title": "Subir archivo comprimido",
    "upload-hint": "Haz clic o arrastra para subir un archivo comprimido",
    "supported-formats": "Formatos compatibles: ZIP, TAR, GZ, TGZ",
    "select-new-file": "Elegir otro archivo",
    "local-note": "Se ejecuta localmente en tu navegador. No se sube nada."
  },
  "fr": {
    "upload-title": "Importer une archive",
    "upload-hint": "Cliquez ou glissez pour importer une archive",
    "supported-formats": "Formats pris en charge : ZIP, TAR, GZ, TGZ",
    "select-new-file": "Choisir une autre archive",
    "local-note": "Fonctionne localement dans le navigateur. Aucun envoi."
  },
  "de": {
    "upload-title": "Archiv hochladen",
    "upload-hint": "Klicken oder ziehen, um ein Archiv hochzuladen",
    "supported-formats": "Unterstützte Formate: ZIP, TAR, GZ, TGZ",
    "select-new-file": "Anderes Archiv wählen",
    "local-note": "Läuft lokal im Browser. Keine Uploads."
  },
  "it": {
    "upload-title": "Carica archivio",
    "upload-hint": "Clicca o trascina per caricare un archivio",
    "supported-formats": "Formati supportati: ZIP, TAR, GZ, TGZ",
    "select-new-file": "Scegli un altro archivio",
    "local-note": "Funziona localmente nel browser. Nessun upload."
  },
  "pt": {
    "upload-title": "Enviar arquivo compactado",
    "upload-hint": "Clique ou arraste para enviar um arquivo compactado",
    "supported-formats": "Formatos suportados: ZIP, TAR, GZ, TGZ",
    "select-new-file": "Escolher outro arquivo",
    "local-note": "Executa localmente no navegador. Sem uploads."
  },
  "ru": {
    "upload-title": "Загрузить архив",
    "upload-hint": "Нажмите или перетащите, чтобы загрузить архив",
    "supported-formats": "Поддерживаемые форматы: ZIP, TAR, GZ, TGZ",
    "select-new-file": "Выбрать другой архив",
    "local-note": "Работает локально в браузере. Без загрузки на сервер."
  },
  "tr": {
    "upload-title": "Arşiv yükle",
    "upload-hint": "Arşiv yüklemek için tıklayın veya sürükleyin",
    "supported-formats": "Desteklenen biçimler: ZIP, TAR, GZ, TGZ",
    "select-new-file": "Başka arşiv seç",
    "local-note": "Tarayıcıda yerel çalışır. Yükleme yapılmaz."
  },
  "nl": {
    "upload-title": "Archief uploaden",
    "upload-hint": "Klik of sleep om een archiefbestand te uploaden",
    "supported-formats": "Ondersteunde formaten: ZIP, TAR, GZ, TGZ",
    "select-new-file": "Ander archief kiezen",
    "local-note": "Draait lokaal in je browser. Geen uploads."
  },
  "sv": {
    "upload-title": "Ladda upp arkiv",
    "upload-hint": "Klicka eller dra för att ladda upp ett arkiv",
    "supported-formats": "Format som stöds: ZIP, TAR, GZ, TGZ",
    "select-new-file": "Välj ett annat arkiv",
    "local-note": "Körs lokalt i webbläsaren. Inga uppladdningar."
  },
  "pl": {
    "upload-title": "Prześlij archiwum",
    "upload-hint": "Kliknij lub przeciągnij, aby przesłać archiwum",
    "supported-formats": "Obsługiwane formaty: ZIP, TAR, GZ, TGZ",
    "select-new-file": "Wybierz inne archiwum",
    "local-note": "Działa lokalnie w przeglądarce. Bez wysyłania plików."
  },
  "no": {
    "upload-title": "Last opp arkiv",
    "upload-hint": "Klikk eller dra for å laste opp et arkiv",
    "supported-formats": "Støttede formater: ZIP, TAR, GZ, TGZ",
    "select-new-file": "Velg et annet arkiv",
    "local-note": "Kjører lokalt i nettleseren. Ingen opplastinger."
  },
  "ja": {
    "upload-title": "アーカイブをアップロード",
    "upload-hint": "クリックまたはドラッグしてアーカイブをアップロード",
    "supported-formats": "対応形式: ZIP, TAR, GZ, TGZ",
    "select-new-file": "別のアーカイブを選択",
    "local-note": "ブラウザ内でローカル実行されます。アップロードは行いません。"
  },
  "ko": {
    "upload-title": "압축 파일 업로드",
    "upload-hint": "클릭하거나 드래그해서 압축 파일 업로드",
    "supported-formats": "지원 형식: ZIP, TAR, GZ, TGZ",
    "select-new-file": "다른 압축 파일 선택",
    "local-note": "브라우저에서 로컬로 실행됩니다. 업로드하지 않습니다."
  },
  "ar": {
    "upload-title": "رفع الأرشيف",
    "upload-hint": "انقر أو اسحب لرفع ملف أرشيف",
    "supported-formats": "الصيغ المدعومة: ZIP، TAR، GZ، TGZ",
    "select-new-file": "اختر أرشيفًا آخر",
    "local-note": "يعمل محليًا داخل المتصفح. بدون رفع للخادم."
  },
  "hi": {
    "upload-title": "आर्काइव अपलोड करें",
    "upload-hint": "आर्काइव फ़ाइल अपलोड करने के लिए क्लिक या ड्रैग करें",
    "supported-formats": "समर्थित फ़ॉर्मेट: ZIP, TAR, GZ, TGZ",
    "select-new-file": "दूसरा आर्काइव चुनें",
    "local-note": "यह ब्राउज़र में लोकली चलता है। कोई अपलोड नहीं।"
  },
  "vi": {
    "upload-title": "Tải lên tệp nén",
    "upload-hint": "Nhấp hoặc kéo thả để tải lên tệp nén",
    "supported-formats": "Định dạng hỗ trợ: ZIP, TAR, GZ, TGZ",
    "select-new-file": "Chọn tệp nén khác",
    "local-note": "Chạy cục bộ trên trình duyệt. Không tải dữ liệu lên mạng."
  },
  "th": {
    "upload-title": "อัปโหลดไฟล์บีบอัด",
    "upload-hint": "คลิกหรือลากเพื่ออัปโหลดไฟล์บีบอัด",
    "supported-formats": "รูปแบบที่รองรับ: ZIP, TAR, GZ, TGZ",
    "select-new-file": "เลือกไฟล์บีบอัดอื่น",
    "local-note": "ทำงานในเบราว์เซอร์แบบเครื่องของคุณเท่านั้น ไม่มีการอัปโหลด"
  },
  "id": {
    "upload-title": "Unggah arsip",
    "upload-hint": "Klik atau seret untuk mengunggah file arsip",
    "supported-formats": "Format didukung: ZIP, TAR, GZ, TGZ",
    "select-new-file": "Pilih arsip lain",
    "local-note": "Berjalan lokal di browser. Tidak ada unggahan ke server."
  },
  "he": {
    "upload-title": "העלאת ארכיון",
    "upload-hint": "לחץ או גרור כדי להעלות קובץ ארכיון",
    "supported-formats": "פורמטים נתמכים: ZIP, TAR, GZ, TGZ",
    "select-new-file": "בחר ארכיון אחר",
    "local-note": "פועל מקומית בדפדפן. ללא העלאה לשרת."
  },
  "ms": {
    "upload-title": "Muat naik arkib",
    "upload-hint": "Klik atau seret untuk memuat naik fail arkib",
    "supported-formats": "Format disokong: ZIP, TAR, GZ, TGZ",
    "select-new-file": "Pilih arkib lain",
    "local-note": "Berjalan secara setempat dalam pelayar. Tiada muat naik."
  }
}
</i18n>
