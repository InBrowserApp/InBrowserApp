<template>
  <ToolSection>
    <n-flex vertical :size="12">
      <input
        ref="fileInputRef"
        class="hidden-file-input"
        type="file"
        accept="application/pdf,.pdf"
        @change="handleFileInputChange"
      />

      <n-flex :size="12" align="center">
        <n-button
          data-test="choose-file-button"
          :loading="isLoadingDocument"
          @click="triggerFileDialog"
        >
          <template #icon>
            <n-icon>
              <DocumentArrowUp20Regular />
            </n-icon>
          </template>
          {{ file ? t('replaceFile') : t('chooseFile') }}
        </n-button>
        <n-button v-if="file" data-test="clear-file-button" tertiary @click="emit('clear-file')">
          <template #icon>
            <n-icon>
              <Delete16Regular />
            </n-icon>
          </template>
          {{ t('clearFile') }}
        </n-button>
      </n-flex>

      <n-text depth="3">{{ t('privacyHint') }}</n-text>

      <n-flex v-if="file" vertical :size="4" data-test="file-meta">
        <n-text>{{ t('fileNameLine', { name: file.name }) }}</n-text>
        <n-text>{{ t('pageCountLine', { pages: pageCount }) }}</n-text>
      </n-flex>

      <n-alert v-if="fileErrorMessage" type="error" :title="fileErrorMessage" />
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NButton, NFlex, NIcon, NText } from 'naive-ui'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import DocumentArrowUp20Regular from '@vicons/fluent/DocumentArrowUp20Regular'
import { PDF_ERROR } from '../pdf-errors'
import { ToolSection } from '@shared/ui/tool'

const props = defineProps<{
  file: File | null
  pageCount: number
  isLoadingDocument: boolean
  fileErrorCode: string
}>()

const emit = defineEmits<{
  (event: 'upload', file: File): void
  (event: 'clear-file'): void
}>()

const { t } = useI18n({ useScope: 'local' })
const fileInputRef = ref<HTMLInputElement | null>(null)

const fileErrorMessage = computed(() => {
  if (!props.fileErrorCode) {
    return ''
  }

  if (props.fileErrorCode === PDF_ERROR.Encrypted) {
    return t('encryptedError')
  }

  return t('invalidError')
})

const triggerFileDialog = (): void => {
  fileInputRef.value?.click()
}

const handleFileInputChange = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]

  if (!selectedFile) {
    return
  }

  emit('upload', selectedFile)
  target.value = ''
}
</script>

<style scoped>
.hidden-file-input {
  display: none;
}
</style>

<i18n lang="json">
{
  "en": {
    "chooseFile": "Upload PDF",
    "replaceFile": "Upload a new one",
    "clearFile": "Clear",
    "privacyHint": "Files are processed locally in your browser.",
    "fileNameLine": "File name: {name}",
    "pageCountLine": "Page count: {pages}",
    "encryptedError": "Encrypted PDF detected. Please remove the owner password first.",
    "invalidError": "Failed to read PDF file. Please upload a valid PDF."
  },
  "zh": {
    "chooseFile": "上传 PDF",
    "replaceFile": "上传新的文件",
    "clearFile": "清空",
    "privacyHint": "文件仅在浏览器本地处理。",
    "fileNameLine": "文件名: {name}",
    "pageCountLine": "页数: {pages}",
    "encryptedError": "检测到加密 PDF，请先移除权限密码。",
    "invalidError": "读取 PDF 文件失败，请上传有效的 PDF。"
  },
  "zh-CN": {
    "chooseFile": "上传 PDF",
    "replaceFile": "上传新的文件",
    "clearFile": "清空",
    "privacyHint": "文件仅在浏览器本地处理。",
    "fileNameLine": "文件名: {name}",
    "pageCountLine": "页数: {pages}",
    "encryptedError": "检测到加密 PDF，请先移除权限密码。",
    "invalidError": "读取 PDF 文件失败，请上传有效的 PDF。"
  },
  "zh-TW": {
    "chooseFile": "上傳 PDF",
    "replaceFile": "上傳新的檔案",
    "clearFile": "清除",
    "privacyHint": "檔案僅在瀏覽器本機處理。",
    "fileNameLine": "檔案名稱: {name}",
    "pageCountLine": "頁數: {pages}",
    "encryptedError": "偵測到加密 PDF，請先移除權限密碼。",
    "invalidError": "讀取 PDF 檔案失敗，請上傳有效的 PDF。"
  },
  "zh-HK": {
    "chooseFile": "上傳 PDF",
    "replaceFile": "上傳新的檔案",
    "clearFile": "清除",
    "privacyHint": "檔案僅在瀏覽器本機處理。",
    "fileNameLine": "檔案名稱: {name}",
    "pageCountLine": "頁數: {pages}",
    "encryptedError": "偵測到加密 PDF，請先移除權限密碼。",
    "invalidError": "讀取 PDF 檔案失敗，請上傳有效的 PDF。"
  },
  "es": {
    "chooseFile": "Subir PDF",
    "replaceFile": "Subir otro archivo",
    "clearFile": "Limpiar",
    "privacyHint": "Los archivos se procesan localmente en tu navegador.",
    "fileNameLine": "Nombre del archivo: {name}",
    "pageCountLine": "Número de páginas: {pages}",
    "encryptedError": "Se detectó un PDF cifrado. Quita primero la contraseña de propietario.",
    "invalidError": "No se pudo leer el PDF. Sube un archivo PDF válido."
  },
  "fr": {
    "chooseFile": "Importer un PDF",
    "replaceFile": "Importer un nouveau fichier",
    "clearFile": "Effacer",
    "privacyHint": "Les fichiers sont traités localement dans votre navigateur.",
    "fileNameLine": "Nom du fichier: {name}",
    "pageCountLine": "Nombre de pages: {pages}",
    "encryptedError": "PDF chiffré détecté. Supprimez d'abord le mot de passe propriétaire.",
    "invalidError": "Échec de lecture du PDF. Veuillez importer un PDF valide."
  },
  "de": {
    "chooseFile": "PDF hochladen",
    "replaceFile": "Neue Datei hochladen",
    "clearFile": "Löschen",
    "privacyHint": "Dateien werden lokal in Ihrem Browser verarbeitet.",
    "fileNameLine": "Dateiname: {name}",
    "pageCountLine": "Seitenzahl: {pages}",
    "encryptedError": "Verschlüsseltes PDF erkannt. Entfernen Sie zuerst das Besitzerpasswort.",
    "invalidError": "PDF-Datei konnte nicht gelesen werden. Bitte laden Sie ein gültiges PDF hoch."
  },
  "it": {
    "chooseFile": "Carica PDF",
    "replaceFile": "Carica un nuovo file",
    "clearFile": "Cancella",
    "privacyHint": "I file vengono elaborati localmente nel browser.",
    "fileNameLine": "Nome file: {name}",
    "pageCountLine": "Numero di pagine: {pages}",
    "encryptedError": "Rilevato PDF crittografato. Rimuovi prima la password proprietario.",
    "invalidError": "Impossibile leggere il PDF. Carica un file PDF valido."
  },
  "ja": {
    "chooseFile": "PDF をアップロード",
    "replaceFile": "新しいファイルをアップロード",
    "clearFile": "クリア",
    "privacyHint": "ファイルはブラウザ内でローカル処理されます。",
    "fileNameLine": "ファイル名: {name}",
    "pageCountLine": "ページ数: {pages}",
    "encryptedError": "暗号化された PDF が検出されました。先に権限パスワードを解除してください。",
    "invalidError": "PDF の読み込みに失敗しました。有効な PDF をアップロードしてください。"
  },
  "ko": {
    "chooseFile": "PDF 업로드",
    "replaceFile": "새 파일 업로드",
    "clearFile": "지우기",
    "privacyHint": "파일은 브라우저에서 로컬로 처리됩니다.",
    "fileNameLine": "파일 이름: {name}",
    "pageCountLine": "페이지 수: {pages}",
    "encryptedError": "암호화된 PDF가 감지되었습니다. 먼저 권한 비밀번호를 제거하세요.",
    "invalidError": "PDF 파일을 읽지 못했습니다. 올바른 PDF를 업로드하세요."
  },
  "ru": {
    "chooseFile": "Загрузить PDF",
    "replaceFile": "Загрузить новый файл",
    "clearFile": "Очистить",
    "privacyHint": "Файлы обрабатываются локально в вашем браузере.",
    "fileNameLine": "Имя файла: {name}",
    "pageCountLine": "Количество страниц: {pages}",
    "encryptedError": "Обнаружен зашифрованный PDF. Сначала удалите пароль владельца.",
    "invalidError": "Не удалось прочитать PDF. Загрузите корректный PDF-файл."
  },
  "pt": {
    "chooseFile": "Enviar PDF",
    "replaceFile": "Enviar outro arquivo",
    "clearFile": "Limpar",
    "privacyHint": "Os arquivos são processados localmente no navegador.",
    "fileNameLine": "Nome do arquivo: {name}",
    "pageCountLine": "Número de páginas: {pages}",
    "encryptedError": "PDF criptografado detectado. Remova primeiro a senha do proprietário.",
    "invalidError": "Falha ao ler o arquivo PDF. Envie um PDF válido."
  },
  "ar": {
    "chooseFile": "رفع PDF",
    "replaceFile": "رفع ملف جديد",
    "clearFile": "مسح",
    "privacyHint": "تتم معالجة الملفات محليًا داخل المتصفح.",
    "fileNameLine": "اسم الملف: {name}",
    "pageCountLine": "عدد الصفحات: {pages}",
    "encryptedError": "تم اكتشاف PDF مشفر. الرجاء إزالة كلمة مرور المالك أولاً.",
    "invalidError": "تعذر قراءة ملف PDF. الرجاء رفع ملف PDF صالح."
  },
  "hi": {
    "chooseFile": "PDF अपलोड करें",
    "replaceFile": "नई फ़ाइल अपलोड करें",
    "clearFile": "साफ़ करें",
    "privacyHint": "फ़ाइलें आपके ब्राउज़र में लोकल रूप से प्रोसेस होती हैं।",
    "fileNameLine": "फ़ाइल नाम: {name}",
    "pageCountLine": "पृष्ठ संख्या: {pages}",
    "encryptedError": "एन्क्रिप्टेड PDF मिला। पहले ओनर पासवर्ड हटाएं।",
    "invalidError": "PDF फ़ाइल पढ़ने में विफल। कृपया वैध PDF अपलोड करें।"
  },
  "tr": {
    "chooseFile": "PDF yükle",
    "replaceFile": "Yeni bir dosya yükle",
    "clearFile": "Temizle",
    "privacyHint": "Dosyalar tarayıcınızda yerel olarak işlenir.",
    "fileNameLine": "Dosya adı: {name}",
    "pageCountLine": "Sayfa sayısı: {pages}",
    "encryptedError": "Şifreli PDF algılandı. Lütfen önce sahip parolasını kaldırın.",
    "invalidError": "PDF dosyası okunamadı. Lütfen geçerli bir PDF yükleyin."
  },
  "nl": {
    "chooseFile": "PDF uploaden",
    "replaceFile": "Nieuw bestand uploaden",
    "clearFile": "Wissen",
    "privacyHint": "Bestanden worden lokaal in je browser verwerkt.",
    "fileNameLine": "Bestandsnaam: {name}",
    "pageCountLine": "Aantal pagina's: {pages}",
    "encryptedError": "Versleutelde PDF gedetecteerd. Verwijder eerst het eigenaarswachtwoord.",
    "invalidError": "Kon PDF-bestand niet lezen. Upload een geldige PDF."
  },
  "sv": {
    "chooseFile": "Ladda upp PDF",
    "replaceFile": "Ladda upp en ny fil",
    "clearFile": "Rensa",
    "privacyHint": "Filer behandlas lokalt i din webbläsare.",
    "fileNameLine": "Filnamn: {name}",
    "pageCountLine": "Antal sidor: {pages}",
    "encryptedError": "Krypterad PDF upptäckt. Ta bort ägarlösenordet först.",
    "invalidError": "Kunde inte läsa PDF-filen. Ladda upp en giltig PDF."
  },
  "pl": {
    "chooseFile": "Prześlij PDF",
    "replaceFile": "Prześlij nowy plik",
    "clearFile": "Wyczyść",
    "privacyHint": "Pliki są przetwarzane lokalnie w przeglądarce.",
    "fileNameLine": "Nazwa pliku: {name}",
    "pageCountLine": "Liczba stron: {pages}",
    "encryptedError": "Wykryto zaszyfrowany PDF. Najpierw usuń hasło właściciela.",
    "invalidError": "Nie udało się odczytać pliku PDF. Prześlij prawidłowy PDF."
  },
  "vi": {
    "chooseFile": "Tải lên PDF",
    "replaceFile": "Tải lên tệp mới",
    "clearFile": "Xóa",
    "privacyHint": "Tệp được xử lý cục bộ trong trình duyệt của bạn.",
    "fileNameLine": "Tên tệp: {name}",
    "pageCountLine": "Số trang: {pages}",
    "encryptedError": "Phát hiện PDF được mã hóa. Vui lòng gỡ mật khẩu chủ sở hữu trước.",
    "invalidError": "Không thể đọc tệp PDF. Vui lòng tải lên PDF hợp lệ."
  },
  "th": {
    "chooseFile": "อัปโหลด PDF",
    "replaceFile": "อัปโหลดไฟล์ใหม่",
    "clearFile": "ล้าง",
    "privacyHint": "ไฟล์จะถูกประมวลผลในเบราว์เซอร์ของคุณเท่านั้น",
    "fileNameLine": "ชื่อไฟล์: {name}",
    "pageCountLine": "จำนวนหน้า: {pages}",
    "encryptedError": "ตรวจพบ PDF ที่เข้ารหัส โปรดลบรหัสผ่านเจ้าของก่อน",
    "invalidError": "ไม่สามารถอ่านไฟล์ PDF ได้ โปรดอัปโหลดไฟล์ PDF ที่ถูกต้อง"
  },
  "id": {
    "chooseFile": "Unggah PDF",
    "replaceFile": "Unggah file baru",
    "clearFile": "Hapus",
    "privacyHint": "File diproses secara lokal di browser Anda.",
    "fileNameLine": "Nama file: {name}",
    "pageCountLine": "Jumlah halaman: {pages}",
    "encryptedError": "PDF terenkripsi terdeteksi. Hapus dulu kata sandi pemilik.",
    "invalidError": "Gagal membaca file PDF. Unggah PDF yang valid."
  },
  "he": {
    "chooseFile": "העלה PDF",
    "replaceFile": "העלה קובץ חדש",
    "clearFile": "נקה",
    "privacyHint": "הקבצים מעובדים מקומית בדפדפן שלך.",
    "fileNameLine": "שם הקובץ: {name}",
    "pageCountLine": "מספר עמודים: {pages}",
    "encryptedError": "זוהה PDF מוצפן. יש להסיר תחילה את סיסמת הבעלים.",
    "invalidError": "קריאת קובץ ה-PDF נכשלה. נא להעלות PDF תקין."
  },
  "ms": {
    "chooseFile": "Muat naik PDF",
    "replaceFile": "Muat naik fail baharu",
    "clearFile": "Kosongkan",
    "privacyHint": "Fail diproses secara setempat dalam pelayar anda.",
    "fileNameLine": "Nama fail: {name}",
    "pageCountLine": "Bilangan halaman: {pages}",
    "encryptedError": "PDF disulitkan dikesan. Sila buang kata laluan pemilik dahulu.",
    "invalidError": "Gagal membaca fail PDF. Sila muat naik PDF yang sah."
  },
  "no": {
    "chooseFile": "Last opp PDF",
    "replaceFile": "Last opp en ny fil",
    "clearFile": "Tøm",
    "privacyHint": "Filer behandles lokalt i nettleseren din.",
    "fileNameLine": "Filnavn: {name}",
    "pageCountLine": "Antall sider: {pages}",
    "encryptedError": "Kryptert PDF oppdaget. Fjern eierpassordet først.",
    "invalidError": "Klarte ikke å lese PDF-filen. Last opp en gyldig PDF."
  }
}
</i18n>
