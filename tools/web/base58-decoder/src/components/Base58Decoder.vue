<template>
  <Base58OptionsSection v-model:value="alphabetKey" />
  <Base58InputSection v-model:value="textOrFile" />
  <Base58OutputSection
    :preview-text="previewText"
    :is-truncated="isTruncated"
    :decoded-text="decodedText"
    :decoded-bytes="decodedBytes"
    :download-url="downloadUrl"
    :download-name="downloadName"
    :error="error"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import Base58InputSection from './Base58InputSection.vue'
import Base58OptionsSection from './Base58OptionsSection.vue'
import Base58OutputSection from './Base58OutputSection.vue'
import { BASE58_ALPHABETS, type Base58AlphabetKey, decodeBase58 } from '@utils/base58'

const { t } = useI18n()

const storedText = useStorage('tools:base58-decoder:text', 'StV1DL6CwTryKyV')
const alphabetKey = useStorage<Base58AlphabetKey>('tools:base58-decoder:alphabet', 'bitcoin')
const alphabet = computed(() => BASE58_ALPHABETS[alphabetKey.value])
const textOrFile = ref<string | File>(storedText.value)
const decodedBytes = ref<Uint8Array | null>(null)
const decodedText = ref('')
const error = ref('')

watch(textOrFile, (value) => {
  if (typeof value === 'string') {
    storedText.value = value
  }
})

watch(storedText, (value) => {
  if (typeof textOrFile.value === 'string') {
    textOrFile.value = value
  }
})

let requestId = 0
watch(
  [textOrFile, alphabetKey],
  async ([value]) => {
    const currentId = (requestId += 1)
    error.value = ''
    decodedBytes.value = null
    decodedText.value = ''

    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      return
    }

    let content = ''
    try {
      content = typeof value === 'string' ? value : await value.text()
    } catch {
      if (currentId !== requestId) return
      error.value = t('read-failed')
      return
    }

    if (currentId !== requestId) return

    try {
      const bytes = decodeBase58(content, { alphabet: alphabet.value })
      decodedBytes.value = bytes
      decodedText.value = new TextDecoder().decode(bytes)
    } catch {
      decodedBytes.value = null
      decodedText.value = ''
      error.value = t('invalid-base58')
    }
  },
  { immediate: true },
)

const previewText = computed(() => {
  if (!decodedText.value) return ''
  if (decodedText.value.length <= 2000) return decodedText.value
  return decodedText.value.slice(0, 2000) + '...'
})

const isTruncated = computed(() => decodedText.value.length > 2000)

const downloadBlob = computed(() => {
  if (!decodedBytes.value) return null
  const bytes = decodedBytes.value
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer
  return new Blob([buffer], { type: 'application/octet-stream' })
})
const downloadUrl = useObjectUrl(downloadBlob)

const downloadName = computed(() => {
  const input = textOrFile.value
  if (typeof input === 'string') return 'decoded.bin'

  const fileName = input?.name ?? 'decoded'
  const baseName = fileName.replace(/\.[^/.]+$/, '')
  return `${baseName || 'decoded'}.bin`
})
</script>

<i18n lang="json">
{
  "en": {
    "invalid-base58": "Invalid Base58 text",
    "read-failed": "Failed to read file"
  },
  "zh": {
    "invalid-base58": "无效的 Base58 文本",
    "read-failed": "读取文件失败"
  },
  "zh-CN": {
    "invalid-base58": "无效的 Base58 文本",
    "read-failed": "读取文件失败"
  },
  "zh-TW": {
    "invalid-base58": "無效的 Base58 文字",
    "read-failed": "讀取檔案失敗"
  },
  "zh-HK": {
    "invalid-base58": "無效的 Base58 文字",
    "read-failed": "讀取檔案失敗"
  },
  "es": {
    "invalid-base58": "Texto Base58 inválido",
    "read-failed": "No se pudo leer el archivo"
  },
  "fr": {
    "invalid-base58": "Texte Base58 invalide",
    "read-failed": "Échec de la lecture du fichier"
  },
  "de": {
    "invalid-base58": "Ungültiger Base58-Text",
    "read-failed": "Datei konnte nicht gelesen werden"
  },
  "it": {
    "invalid-base58": "Testo Base58 non valido",
    "read-failed": "Impossibile leggere il file"
  },
  "ja": {
    "invalid-base58": "無効なBase58テキスト",
    "read-failed": "ファイルの読み取りに失敗しました"
  },
  "ko": {
    "invalid-base58": "유효하지 않은 Base58 텍스트",
    "read-failed": "파일 읽기에 실패했습니다"
  },
  "ru": {
    "invalid-base58": "Неверный текст Base58",
    "read-failed": "Не удалось прочитать файл"
  },
  "pt": {
    "invalid-base58": "Texto Base58 inválido",
    "read-failed": "Falha ao ler o arquivo"
  },
  "ar": {
    "invalid-base58": "نص Base58 غير صالح",
    "read-failed": "فشل في قراءة الملف"
  },
  "hi": {
    "invalid-base58": "अमान्य Base58 पाठ",
    "read-failed": "फ़ाइल पढ़ने में विफल"
  },
  "tr": {
    "invalid-base58": "Geçersiz Base58 metni",
    "read-failed": "Dosya okunamadı"
  },
  "nl": {
    "invalid-base58": "Ongeldige Base58-tekst",
    "read-failed": "Bestand kon niet worden gelezen"
  },
  "sv": {
    "invalid-base58": "Ogiltig Base58-text",
    "read-failed": "Kunde inte läsa filen"
  },
  "pl": {
    "invalid-base58": "Nieprawidłowy tekst Base58",
    "read-failed": "Nie udało się odczytać pliku"
  },
  "vi": {
    "invalid-base58": "Văn bản Base58 không hợp lệ",
    "read-failed": "Không thể đọc tệp"
  },
  "th": {
    "invalid-base58": "ข้อความ Base58 ไม่ถูกต้อง",
    "read-failed": "อ่านไฟล์ไม่สำเร็จ"
  },
  "id": {
    "invalid-base58": "Teks Base58 tidak valid",
    "read-failed": "Gagal membaca file"
  },
  "he": {
    "invalid-base58": "טקסט Base58 לא תקין",
    "read-failed": "קריאת הקובץ נכשלה"
  },
  "ms": {
    "invalid-base58": "Teks Base58 tidak sah",
    "read-failed": "Gagal membaca fail"
  },
  "no": {
    "invalid-base58": "Ugyldig Base58-tekst",
    "read-failed": "Kunne ikke lese filen"
  }
}
</i18n>
