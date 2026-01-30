<template>
  <div class="text-or-file-input">
    <n-form-item
      v-if="!selectedFile && wrapWithFormItem"
      :label="label ?? t('please-input-text')"
      :show-feedback="showFeedback"
      :feedback="feedback"
      :validation-status="validationStatus"
    >
      <n-input
        v-model:value="textValue"
        type="textarea"
        :placeholder="placeholder ?? t('enter-text-placeholder')"
        :autosize="{ minRows: 3, maxRows: 8 }"
        :status="status"
        @input="onTextInput"
      />
    </n-form-item>
    <n-input
      v-else-if="!selectedFile"
      v-model:value="textValue"
      type="textarea"
      :placeholder="placeholder ?? t('enter-text-placeholder')"
      :autosize="{ minRows: 3, maxRows: 8 }"
      :status="status"
      @input="onTextInput"
    />

    <n-divider v-if="!selectedFile && !textValue">{{ t('or') }}</n-divider>
    <n-upload
      v-if="!textValue"
      :show-file-list="false"
      :accept="accept"
      @before-upload="beforeUpload"
    >
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="48" :depth="3">
            <DocumentOutline />
          </n-icon>
        </div>
        <n-text style="font-size: 16px">
          {{ selectedFile ? selectedFile.name : t('click-or-drag-to-upload') }}
        </n-text>
        <n-text
          v-if="selectedFile"
          depth="3"
          style="font-size: 12px; display: block; margin-top: 4px"
        >
          {{ formatFileSize(selectedFile.size) }}
        </n-text>
      </n-upload-dragger>
    </n-upload>

    <div v-if="selectedFile" class="file-actions">
      <n-button type="error" size="small" @click="clearFile">
        {{ t('clear-file') }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  NInput,
  NFormItem,
  NUpload,
  NUploadDragger,
  NIcon,
  NText,
  NDivider,
  NButton,
} from 'naive-ui'
import DocumentOutline from '@vicons/ionicons5/DocumentOutline'
import type { UploadFileInfo } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  value: string | File
  accept?: string
  placeholder?: string
  label?: string
  status?: 'success' | 'error'
  validationStatus?: 'success' | 'error'
  feedback?: string
  showFeedback?: boolean
  wrapWithFormItem?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*',
  placeholder: undefined,
  label: undefined,
  status: undefined,
  validationStatus: undefined,
  feedback: undefined,
  showFeedback: false,
  wrapWithFormItem: true,
})

const emit = defineEmits<{
  'update:value': [value: string | File]
}>()

const textValue = ref<string>('')
const selectedFile = ref<File | null>(null)

// Initialize values based on prop
watch(
  () => props.value,
  (newValue) => {
    if (typeof newValue === 'string') {
      textValue.value = newValue
      selectedFile.value = null
    } else if (newValue instanceof File) {
      selectedFile.value = newValue
      textValue.value = ''
    }
  },
  { immediate: true },
)

const currentValue = computed(() => {
  if (selectedFile.value) {
    return selectedFile.value
  }
  return textValue.value
})

function onTextInput() {
  if (textValue.value) {
    selectedFile.value = null
  }
  emit('update:value', currentValue.value)
}

async function beforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  if (data.file.file) {
    selectedFile.value = data.file.file
    textValue.value = ''
    emit('update:value', data.file.file)
  }
  return false // Prevent default upload
}

function clearFile() {
  selectedFile.value = null
  emit('update:value', textValue.value)
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.text-or-file-input {
  width: 100%;
}

.file-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}
</style>

<i18n lang="json">
{
  "en": {
    "please-input-text": "Please input text",
    "enter-text-placeholder": "Enter your text here...",
    "or": "OR",
    "click-or-drag-to-upload": "Click or drag to upload file",
    "clear-file": "Clear file"
  },
  "zh": {
    "please-input-text": "请输入文本",
    "enter-text-placeholder": "在此输入您的文本...",
    "or": "或",
    "click-or-drag-to-upload": "点击或拖拽上传文件",
    "clear-file": "清除文件"
  },
  "zh-CN": {
    "please-input-text": "请输入文本",
    "enter-text-placeholder": "在此输入您的文本...",
    "or": "或",
    "click-or-drag-to-upload": "点击或拖拽上传文件",
    "clear-file": "清除文件"
  },
  "zh-TW": {
    "please-input-text": "請輸入文字",
    "enter-text-placeholder": "在此輸入您的文字...",
    "or": "或",
    "click-or-drag-to-upload": "點擊或拖拽上傳檔案",
    "clear-file": "清除檔案"
  },
  "zh-HK": {
    "please-input-text": "請輸入文字",
    "enter-text-placeholder": "在此輸入您的文字...",
    "or": "或",
    "click-or-drag-to-upload": "點擊或拖拽上傳檔案",
    "clear-file": "清除檔案"
  },
  "es": {
    "please-input-text": "Por favor ingrese texto",
    "enter-text-placeholder": "Ingrese su texto aquí...",
    "or": "O",
    "click-or-drag-to-upload": "Haz clic o arrastra para subir archivo",
    "clear-file": "Limpiar archivo"
  },
  "fr": {
    "please-input-text": "Veuillez saisir le texte",
    "enter-text-placeholder": "Entrez votre texte ici...",
    "or": "OU",
    "click-or-drag-to-upload": "Cliquez ou glissez pour télécharger le fichier",
    "clear-file": "Effacer le fichier"
  },
  "de": {
    "please-input-text": "Bitte Text eingeben",
    "enter-text-placeholder": "Geben Sie hier Ihren Text ein...",
    "or": "ODER",
    "click-or-drag-to-upload": "Klicken oder ziehen Sie, um eine Datei hochzuladen",
    "clear-file": "Datei löschen"
  },
  "it": {
    "please-input-text": "Si prega di inserire il testo",
    "enter-text-placeholder": "Inserisci il tuo testo qui...",
    "or": "O",
    "click-or-drag-to-upload": "Clicca o trascina per caricare il file",
    "clear-file": "Cancella file"
  },
  "ja": {
    "please-input-text": "テキストを入力してください",
    "enter-text-placeholder": "ここにテキストを入力してください...",
    "or": "または",
    "click-or-drag-to-upload": "クリックまたはドラッグしてファイルをアップロード",
    "clear-file": "ファイルをクリア"
  },
  "ko": {
    "please-input-text": "텍스트를 입력해주세요",
    "enter-text-placeholder": "여기에 텍스트를 입력하세요...",
    "or": "또는",
    "click-or-drag-to-upload": "클릭하거나 드래그하여 파일 업로드",
    "clear-file": "파일 지우기"
  },
  "ru": {
    "please-input-text": "Пожалуйста, введите текст",
    "enter-text-placeholder": "Введите ваш текст здесь...",
    "or": "ИЛИ",
    "click-or-drag-to-upload": "Нажмите или перетащите для загрузки файла",
    "clear-file": "Очистить файл"
  },
  "pt": {
    "please-input-text": "Por favor, digite o texto",
    "enter-text-placeholder": "Digite seu texto aqui...",
    "or": "OU",
    "click-or-drag-to-upload": "Clique ou arraste para enviar arquivo",
    "clear-file": "Limpar arquivo"
  },
  "ar": {
    "please-input-text": "يرجى إدخال النص",
    "enter-text-placeholder": "أدخل النص هنا...",
    "or": "أو",
    "click-or-drag-to-upload": "انقر أو اسحب لرفع الملف",
    "clear-file": "مسح الملف"
  },
  "hi": {
    "please-input-text": "कृपया टेक्स्ट दर्ज करें",
    "enter-text-placeholder": "यहाँ अपना टेक्स्ट दर्ज करें...",
    "or": "या",
    "click-or-drag-to-upload": "फ़ाइल अपलोड करने के लिए क्लिक करें या खींचें",
    "clear-file": "फ़ाइल साफ़ करें"
  },
  "tr": {
    "please-input-text": "Lütfen metin girin",
    "enter-text-placeholder": "Metninizi buraya girin...",
    "or": "VEYA",
    "click-or-drag-to-upload": "Dosya yüklemek için tıklayın veya sürükleyin",
    "clear-file": "Dosyayı temizle"
  },
  "nl": {
    "please-input-text": "Voer alstublieft tekst in",
    "enter-text-placeholder": "Voer hier uw tekst in...",
    "or": "OF",
    "click-or-drag-to-upload": "Klik of sleep om bestand te uploaden",
    "clear-file": "Bestand wissen"
  },
  "sv": {
    "please-input-text": "Vänligen ange text",
    "enter-text-placeholder": "Ange din text här...",
    "or": "ELLER",
    "click-or-drag-to-upload": "Klicka eller dra för att ladda upp fil",
    "clear-file": "Rensa fil"
  },
  "pl": {
    "please-input-text": "Proszę wprowadzić tekst",
    "enter-text-placeholder": "Wprowadź swój tekst tutaj...",
    "or": "LUB",
    "click-or-drag-to-upload": "Kliknij lub przeciągnij, aby przesłać plik",
    "clear-file": "Wyczyść plik"
  },
  "vi": {
    "please-input-text": "Vui lòng nhập văn bản",
    "enter-text-placeholder": "Nhập văn bản của bạn ở đây...",
    "or": "HOẶC",
    "click-or-drag-to-upload": "Nhấp hoặc kéo để tải lên tập tin",
    "clear-file": "Xóa tập tin"
  },
  "th": {
    "please-input-text": "โปรดป้อนข้อความ",
    "enter-text-placeholder": "ป้อนข้อความของคุณที่นี่...",
    "or": "หรือ",
    "click-or-drag-to-upload": "คลิกหรือลากเพื่ออัปโหลดไฟล์",
    "clear-file": "ล้างไฟล์"
  },
  "id": {
    "please-input-text": "Silakan masukkan teks",
    "enter-text-placeholder": "Masukkan teks Anda di sini...",
    "or": "ATAU",
    "click-or-drag-to-upload": "Klik atau seret untuk mengunggah file",
    "clear-file": "Hapus file"
  },
  "he": {
    "please-input-text": "אנא הזן טקסט",
    "enter-text-placeholder": "הזן את הטקסט שלך כאן...",
    "or": "או",
    "click-or-drag-to-upload": "לחץ או גרור כדי להעלות קובץ",
    "clear-file": "נקה קובץ"
  },
  "ms": {
    "please-input-text": "Sila masukkan teks",
    "enter-text-placeholder": "Masukkan teks anda di sini...",
    "or": "ATAU",
    "click-or-drag-to-upload": "Klik atau seret untuk muat naik fail",
    "clear-file": "Kosongkan fail"
  },
  "no": {
    "please-input-text": "Vennligst skriv inn tekst",
    "enter-text-placeholder": "Skriv inn teksten din her...",
    "or": "ELLER",
    "click-or-drag-to-upload": "Klikk eller dra for å laste opp fil",
    "clear-file": "Tøm fil"
  }
}
</i18n>
