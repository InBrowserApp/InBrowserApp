<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="8">
      <n-upload
        accept=".pdf,application/pdf"
        :show-file-list="false"
        @before-upload="handleBeforeUpload"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <DocumentPdf24Regular />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">{{ t('dragHint') }}</n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">{{ t('localOnly') }}</n-p>
        </n-upload-dragger>
      </n-upload>

      <n-alert v-if="fileErrorMessage" type="error" :title="fileErrorMessage" />
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NFlex,
  NIcon,
  NP,
  NText,
  NUpload,
  NUploadDragger,
  useMessage,
  type UploadFileInfo,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import DocumentPdf24Regular from '@vicons/fluent/DocumentPdf24Regular'
import { isPdfFile } from '../inspect-pdf'
import { PDF_ERROR } from '../pdf-errors'

const props = defineProps<{
  fileErrorCode: string
}>()

const emit = defineEmits<{
  (event: 'upload', file: File): void
}>()

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()

const fileErrorMessage = computed(() => {
  if (!props.fileErrorCode) {
    return ''
  }

  if (props.fileErrorCode === PDF_ERROR.Encrypted) {
    return t('fileEncrypted')
  }

  if (props.fileErrorCode === PDF_ERROR.Invalid) {
    return t('fileInvalid')
  }

  return t('fileLoadFailed')
})

const handleBeforeUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  const selectedFile = data.file.file
  if (!selectedFile) {
    return false
  }

  if (!isPdfFile(selectedFile)) {
    message.error(t('onlyPdf'))
    return false
  }

  emit('upload', selectedFile)
  return false
}
</script>

<i18n lang="json">
{
  "en": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file."
  },
  "zh": {
    "title": "上传 PDF",
    "dragHint": "点击或拖拽添加 PDF 文件",
    "localOnly": "文件仅在浏览器本地处理。",
    "onlyPdf": "仅允许 PDF 文件。",
    "fileEncrypted": "检测到加密 PDF，请先移除权限密码。",
    "fileInvalid": "读取 PDF 文件失败，请上传有效的 PDF。",
    "fileLoadFailed": "加载 PDF 文件失败。"
  },
  "zh-CN": {
    "title": "上传 PDF",
    "dragHint": "点击或拖拽添加 PDF 文件",
    "localOnly": "文件仅在浏览器本地处理。",
    "onlyPdf": "仅允许 PDF 文件。",
    "fileEncrypted": "检测到加密 PDF，请先移除权限密码。",
    "fileInvalid": "读取 PDF 文件失败，请上传有效的 PDF。",
    "fileLoadFailed": "加载 PDF 文件失败。"
  },
  "zh-TW": {
    "title": "上傳 PDF",
    "dragHint": "點擊或拖曳新增 PDF 檔案",
    "localOnly": "檔案僅在瀏覽器本機處理。",
    "onlyPdf": "僅允許 PDF 檔案。",
    "fileEncrypted": "偵測到加密 PDF，請先移除權限密碼。",
    "fileInvalid": "讀取 PDF 檔案失敗，請上傳有效的 PDF。",
    "fileLoadFailed": "載入 PDF 檔案失敗。"
  },
  "zh-HK": {
    "title": "上傳 PDF",
    "dragHint": "點擊或拖曳新增 PDF 檔案",
    "localOnly": "檔案僅在瀏覽器本機處理。",
    "onlyPdf": "僅允許 PDF 檔案。",
    "fileEncrypted": "偵測到加密 PDF，請先移除權限密碼。",
    "fileInvalid": "讀取 PDF 檔案失敗，請上傳有效的 PDF。",
    "fileLoadFailed": "載入 PDF 檔案失敗。"
  },
  "es": {
    "title": "Subir PDF",
    "dragHint": "Haz clic o arrastra para agregar un archivo PDF",
    "localOnly": "Los archivos se procesan localmente en tu navegador.",
    "onlyPdf": "Solo se permiten archivos PDF.",
    "fileEncrypted": "Se detectó un PDF cifrado. Quita primero la contraseña de propietario.",
    "fileInvalid": "No se pudo leer el PDF. Sube un archivo PDF válido.",
    "fileLoadFailed": "No se pudo cargar el PDF."
  },
  "fr": {
    "title": "Importer un PDF",
    "dragHint": "Cliquez ou glissez pour ajouter un fichier PDF",
    "localOnly": "Les fichiers sont traités localement dans votre navigateur.",
    "onlyPdf": "Seuls les fichiers PDF sont autorisés.",
    "fileEncrypted": "PDF chiffré détecté. Supprimez d'abord le mot de passe propriétaire.",
    "fileInvalid": "Échec de lecture du PDF. Veuillez importer un PDF valide.",
    "fileLoadFailed": "Échec du chargement du PDF."
  },
  "de": {
    "title": "PDF hochladen",
    "dragHint": "Klicken oder ziehen, um eine PDF-Datei hinzuzufügen",
    "localOnly": "Dateien werden lokal in Ihrem Browser verarbeitet.",
    "onlyPdf": "Nur PDF-Dateien sind erlaubt.",
    "fileEncrypted": "Verschlüsseltes PDF erkannt. Entfernen Sie zuerst das Besitzerpasswort.",
    "fileInvalid": "PDF-Datei konnte nicht gelesen werden. Bitte laden Sie ein gültiges PDF hoch.",
    "fileLoadFailed": "PDF-Datei konnte nicht geladen werden."
  },
  "it": {
    "title": "Carica PDF",
    "dragHint": "Fai clic o trascina per aggiungere un file PDF",
    "localOnly": "I file vengono elaborati localmente nel browser.",
    "onlyPdf": "Sono consentiti solo file PDF.",
    "fileEncrypted": "Rilevato PDF crittografato. Rimuovi prima la password proprietario.",
    "fileInvalid": "Impossibile leggere il PDF. Carica un file PDF valido.",
    "fileLoadFailed": "Impossibile caricare il PDF."
  },
  "ja": {
    "title": "PDF をアップロード",
    "dragHint": "クリックまたはドラッグして PDF ファイルを追加",
    "localOnly": "ファイルはブラウザ内でローカル処理されます。",
    "onlyPdf": "PDF ファイルのみ許可されています。",
    "fileEncrypted": "暗号化された PDF が検出されました。先に権限パスワードを解除してください。",
    "fileInvalid": "PDF の読み込みに失敗しました。有効な PDF をアップロードしてください。",
    "fileLoadFailed": "PDF の読み込みに失敗しました。"
  },
  "ko": {
    "title": "PDF 업로드",
    "dragHint": "클릭하거나 드래그해 PDF 파일 추가",
    "localOnly": "파일은 브라우저에서 로컬로 처리됩니다.",
    "onlyPdf": "PDF 파일만 허용됩니다.",
    "fileEncrypted": "암호화된 PDF가 감지되었습니다. 먼저 권한 비밀번호를 제거하세요.",
    "fileInvalid": "PDF 파일을 읽지 못했습니다. 올바른 PDF를 업로드하세요.",
    "fileLoadFailed": "PDF 파일을 불러오지 못했습니다."
  },
  "ru": {
    "title": "Загрузить PDF",
    "dragHint": "Нажмите или перетащите, чтобы добавить PDF-файл",
    "localOnly": "Файлы обрабатываются локально в вашем браузере.",
    "onlyPdf": "Разрешены только PDF-файлы.",
    "fileEncrypted": "Обнаружен зашифрованный PDF. Сначала удалите пароль владельца.",
    "fileInvalid": "Не удалось прочитать PDF. Загрузите корректный PDF-файл.",
    "fileLoadFailed": "Не удалось загрузить PDF-файл."
  },
  "pt": {
    "title": "Enviar PDF",
    "dragHint": "Clique ou arraste para adicionar um arquivo PDF",
    "localOnly": "Os arquivos são processados localmente no navegador.",
    "onlyPdf": "Apenas arquivos PDF são permitidos.",
    "fileEncrypted": "PDF criptografado detectado. Remova primeiro a senha do proprietário.",
    "fileInvalid": "Falha ao ler o arquivo PDF. Envie um PDF válido.",
    "fileLoadFailed": "Falha ao carregar o arquivo PDF."
  },
  "ar": {
    "title": "رفع PDF",
    "dragHint": "انقر أو اسحب لإضافة ملف PDF",
    "localOnly": "تتم معالجة الملفات محليًا داخل المتصفح.",
    "onlyPdf": "يسمح بملفات PDF فقط.",
    "fileEncrypted": "تم اكتشاف PDF مشفر. الرجاء إزالة كلمة مرور المالك أولاً.",
    "fileInvalid": "تعذر قراءة ملف PDF. الرجاء رفع ملف PDF صالح.",
    "fileLoadFailed": "تعذر تحميل ملف PDF."
  },
  "hi": {
    "title": "PDF अपलोड करें",
    "dragHint": "PDF फ़ाइल जोड़ने के लिए क्लिक करें या खींचें",
    "localOnly": "फ़ाइलें आपके ब्राउज़र में लोकल रूप से प्रोसेस होती हैं।",
    "onlyPdf": "केवल PDF फाइलों की अनुमति है।",
    "fileEncrypted": "एन्क्रिप्टेड PDF मिला। पहले ओनर पासवर्ड हटाएं।",
    "fileInvalid": "PDF फ़ाइल पढ़ने में विफल। कृपया वैध PDF अपलोड करें।",
    "fileLoadFailed": "PDF फ़ाइल लोड करने में विफल।"
  },
  "tr": {
    "title": "PDF Yükle",
    "dragHint": "PDF dosyası eklemek için tıklayın veya sürükleyin",
    "localOnly": "Dosyalar tarayıcınızda yerel olarak işlenir.",
    "onlyPdf": "Sadece PDF dosyalarına izin verilir.",
    "fileEncrypted": "Şifreli PDF algılandı. Lütfen önce sahip parolasını kaldırın.",
    "fileInvalid": "PDF dosyası okunamadı. Lütfen geçerli bir PDF yükleyin.",
    "fileLoadFailed": "PDF dosyası yüklenemedi."
  },
  "nl": {
    "title": "PDF uploaden",
    "dragHint": "Klik of sleep om een PDF-bestand toe te voegen",
    "localOnly": "Bestanden worden lokaal in je browser verwerkt.",
    "onlyPdf": "Alleen PDF-bestanden zijn toegestaan.",
    "fileEncrypted": "Versleutelde PDF gedetecteerd. Verwijder eerst het eigenaarswachtwoord.",
    "fileInvalid": "Kon PDF-bestand niet lezen. Upload een geldige PDF.",
    "fileLoadFailed": "Kon PDF-bestand niet laden."
  },
  "sv": {
    "title": "Ladda upp PDF",
    "dragHint": "Klicka eller dra för att lägga till en PDF-fil",
    "localOnly": "Filer behandlas lokalt i din webbläsare.",
    "onlyPdf": "Endast PDF-filer tillåts.",
    "fileEncrypted": "Krypterad PDF upptäckt. Ta bort ägarlösenordet först.",
    "fileInvalid": "Kunde inte läsa PDF-filen. Ladda upp en giltig PDF.",
    "fileLoadFailed": "Kunde inte läsa in PDF-filen."
  },
  "pl": {
    "title": "Prześlij PDF",
    "dragHint": "Kliknij lub przeciągnij, aby dodać plik PDF",
    "localOnly": "Pliki są przetwarzane lokalnie w przeglądarce.",
    "onlyPdf": "Dozwolone są tylko pliki PDF.",
    "fileEncrypted": "Wykryto zaszyfrowany PDF. Najpierw usuń hasło właściciela.",
    "fileInvalid": "Nie udało się odczytać pliku PDF. Prześlij prawidłowy PDF.",
    "fileLoadFailed": "Nie udało się załadować pliku PDF."
  },
  "vi": {
    "title": "Tải lên PDF",
    "dragHint": "Nhấp hoặc kéo thả để thêm tệp PDF",
    "localOnly": "Tệp được xử lý cục bộ trong trình duyệt của bạn.",
    "onlyPdf": "Chỉ cho phép tệp PDF.",
    "fileEncrypted": "Phát hiện PDF được mã hóa. Vui lòng gỡ mật khẩu chủ sở hữu trước.",
    "fileInvalid": "Không thể đọc tệp PDF. Vui lòng tải lên PDF hợp lệ.",
    "fileLoadFailed": "Không thể tải tệp PDF."
  },
  "th": {
    "title": "อัปโหลด PDF",
    "dragHint": "คลิกหรือลากเพื่อเพิ่มไฟล์ PDF",
    "localOnly": "ไฟล์จะถูกประมวลผลในเบราว์เซอร์ของคุณเท่านั้น",
    "onlyPdf": "อนุญาตเฉพาะไฟล์ PDF เท่านั้น",
    "fileEncrypted": "ตรวจพบ PDF ที่เข้ารหัส โปรดลบรหัสผ่านเจ้าของก่อน",
    "fileInvalid": "ไม่สามารถอ่านไฟล์ PDF ได้ โปรดอัปโหลดไฟล์ PDF ที่ถูกต้อง",
    "fileLoadFailed": "ไม่สามารถโหลดไฟล์ PDF ได้"
  },
  "id": {
    "title": "Unggah PDF",
    "dragHint": "Klik atau seret untuk menambahkan file PDF",
    "localOnly": "File diproses secara lokal di browser Anda.",
    "onlyPdf": "Hanya file PDF yang diizinkan.",
    "fileEncrypted": "PDF terenkripsi terdeteksi. Hapus dulu kata sandi pemilik.",
    "fileInvalid": "Gagal membaca file PDF. Unggah PDF yang valid.",
    "fileLoadFailed": "Gagal memuat file PDF."
  },
  "he": {
    "title": "העלאת PDF",
    "dragHint": "לחץ או גרור כדי להוסיף קובץ PDF",
    "localOnly": "הקבצים מעובדים מקומית בדפדפן שלך.",
    "onlyPdf": "מותר להעלות קבצי PDF בלבד.",
    "fileEncrypted": "זוהה PDF מוצפן. יש להסיר תחילה את סיסמת הבעלים.",
    "fileInvalid": "קריאת קובץ ה-PDF נכשלה. נא להעלות PDF תקין.",
    "fileLoadFailed": "טעינת קובץ ה-PDF נכשלה."
  },
  "ms": {
    "title": "Muat Naik PDF",
    "dragHint": "Klik atau seret untuk menambah fail PDF",
    "localOnly": "Fail diproses secara setempat dalam pelayar anda.",
    "onlyPdf": "Hanya fail PDF dibenarkan.",
    "fileEncrypted": "PDF disulitkan dikesan. Sila buang kata laluan pemilik dahulu.",
    "fileInvalid": "Gagal membaca fail PDF. Sila muat naik PDF yang sah.",
    "fileLoadFailed": "Gagal memuatkan fail PDF."
  },
  "no": {
    "title": "Last opp PDF",
    "dragHint": "Klikk eller dra for å legge til en PDF-fil",
    "localOnly": "Filer behandles lokalt i nettleseren din.",
    "onlyPdf": "Kun PDF-filer er tillatt.",
    "fileEncrypted": "Kryptert PDF oppdaget. Fjern eierpassordet først.",
    "fileInvalid": "Klarte ikke å lese PDF-filen. Last opp en gyldig PDF.",
    "fileLoadFailed": "Klarte ikke å laste PDF-filen."
  }
}
</i18n>
