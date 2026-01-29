<template>
  <div>
    <DataUriInputSection v-model:data-uri="dataUri" :show-error="parseError" />

    <template v-if="parsed && decodedBlob">
      <DataUriDetailsSection
        :mime-type="parsed.mimeType"
        :is-base64="parsed.isBase64"
        :size="decodedBlob.size"
      />
      <DataUriFileNameSection v-model:file-name="fileName" />
      <DataUriDownloadSection :download-url="downloadUrl" :download-name="downloadName" />
      <DataUriPreviewSection
        :preview-kind="previewKind"
        :preview-url="previewUrl"
        :text-preview="textPreview"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import mime from 'mime'
import DataUriDetailsSection from './DataUriDetailsSection.vue'
import DataUriDownloadSection from './DataUriDownloadSection.vue'
import DataUriFileNameSection from './DataUriFileNameSection.vue'
import DataUriInputSection from './DataUriInputSection.vue'
import DataUriPreviewSection from './DataUriPreviewSection.vue'

type ParsedDataUri = {
  mimeType: string
  isBase64: boolean
  data: string
}

const dataUri = ref<string>('')
const fileName = ref<string>('')
const parsed = ref<ParsedDataUri | null>(null)
const decodedBlob = ref<Blob | null>(null)
const textPreview = ref<string>('')
const parseError = ref(false)
const previewUrl = ref<string>('')
const downloadUrl = useObjectUrl(decodedBlob)
const downloadName = computed(() => {
  const name = fileName.value.trim()
  return name || buildFileName(parsed.value?.mimeType || '')
})

const previewKind = computed<'image' | 'audio' | 'video' | 'text' | null>(() => {
  if (!parsed.value) return null
  const mime = parsed.value.mimeType.split(';')[0]?.trim().toLowerCase()
  if (!mime) return null
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('audio/')) return 'audio'
  if (mime.startsWith('video/')) return 'video'
  if (
    mime.startsWith('text/') ||
    mime.includes('json') ||
    mime.includes('xml') ||
    mime.includes('svg')
  ) {
    return 'text'
  }
  return null
})

watch(dataUri, () => parseAndDecode(), { immediate: true })

watch([decodedBlob, previewKind], ([blob, kind]) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = ''

  if (blob && (kind === 'image' || kind === 'audio' || kind === 'video')) {
    previewUrl.value = URL.createObjectURL(blob)
  }
})

watch(parsed, (value) => {
  if (!value) {
    if (!dataUri.value.trim()) {
      fileName.value = ''
    }
    return
  }
  const currentName = fileName.value.trim()
  if (!currentName) {
    fileName.value = buildFileName(value.mimeType)
    return
  }

  const suggestedExt = extensionForMime(value.mimeType)
  if (!suggestedExt) return

  const currentExt = extractExtension(currentName)
  if (currentExt && currentExt.toLowerCase() === suggestedExt.toLowerCase()) {
    return
  }

  const dotIndex = currentName.lastIndexOf('.')
  const baseName = dotIndex > 0 ? currentName.slice(0, dotIndex) : currentName
  fileName.value = `${baseName || 'data'}.${suggestedExt}`
})

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

function parseAndDecode() {
  parseError.value = false
  parsed.value = null
  decodedBlob.value = null
  textPreview.value = ''

  const input = dataUri.value.trim()
  if (!input) return

  try {
    const parsedResult = parseDataUri(input)
    parsed.value = parsedResult
    const decoded = decodeData(parsedResult)
    decodedBlob.value = decoded.blob
    textPreview.value = decoded.textPreview
  } catch {
    parseError.value = true
  }
}

function parseDataUri(value: string): ParsedDataUri {
  if (!value.startsWith('data:')) {
    throw new Error('invalid-data-uri')
  }

  const commaIndex = value.indexOf(',')
  if (commaIndex === -1) {
    throw new Error('invalid-data-uri')
  }

  const meta = value.slice(5, commaIndex)
  const data = value.slice(commaIndex + 1)

  const metaParts = meta.split(';')
  const rest = metaParts.slice(1)
  let rawMime = metaParts[0] || ''
  let isBase64 = rest.some((part) => part.toLowerCase() === 'base64')
  if (rawMime.toLowerCase() === 'base64') {
    rawMime = ''
    isBase64 = true
  }
  const params = rest.filter((part) => part && part.toLowerCase() !== 'base64')

  const hasMime = rawMime !== ''
  let mimeType = hasMime ? rawMime : 'text/plain'

  const hasCharset = params.some((param) => param.toLowerCase().startsWith('charset='))
  if (!hasMime && !hasCharset) {
    params.unshift('charset=US-ASCII')
  }

  if (params.length > 0) {
    mimeType = `${mimeType};${params.join(';')}`
  }

  return {
    mimeType,
    isBase64,
    data,
  }
}

function decodeData(parsedValue: ParsedDataUri) {
  const bytes = parsedValue.isBase64
    ? base64ToBytes(parsedValue.data)
    : new TextEncoder().encode(decodeURIComponent(parsedValue.data))

  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: parsedValue.mimeType })

  let text = ''
  if (previewKind.value === 'text') {
    text = new TextDecoder().decode(bytes)
    if (text.length > 2000) {
      text = text.slice(0, 2000) + '...'
    }
  }

  return { blob, textPreview: text }
}

function base64ToBytes(base64: string): Uint8Array {
  const normalized = base64.replace(/\s+/g, '')
  const binary = atob(normalized)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function buildFileName(mimeType: string): string {
  const baseMime = mimeType.split(';')[0]?.trim().toLowerCase() ?? ''
  const ext = extensionForMime(baseMime)
  return ext ? `data.${ext}` : 'data.bin'
}

function extensionForMime(mimeType: string): string | null {
  const normalized = mimeType.split(';')[0]?.trim().toLowerCase() ?? ''
  if (!normalized) return null

  const inferred = mime.getExtension(normalized)
  if (inferred) {
    return inferred
  }

  const fallback: Record<string, string> = {
    'text/plain': 'txt',
    'text/html': 'html',
    'text/css': 'css',
    'application/json': 'json',
    'application/pdf': 'pdf',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'video/mp4': 'mp4',
  }
  return fallback[normalized] ?? null
}

function extractExtension(name: string): string {
  const trimmed = name.trim()
  const dotIndex = trimmed.lastIndexOf('.')
  if (dotIndex <= 0 || dotIndex === trimmed.length - 1) return ''
  return trimmed.slice(dotIndex + 1)
}
</script>

<i18n lang="json">
{
  "en": {},
  "zh": {},
  "zh-CN": {},
  "zh-TW": {},
  "zh-HK": {},
  "es": {},
  "fr": {},
  "de": {},
  "it": {},
  "ja": {},
  "ko": {},
  "ru": {},
  "pt": {},
  "ar": {},
  "hi": {},
  "tr": {},
  "nl": {},
  "sv": {},
  "pl": {},
  "vi": {},
  "th": {},
  "id": {},
  "he": {},
  "ms": {},
  "no": {}
}
</i18n>
