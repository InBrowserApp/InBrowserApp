<template>
  <n-flex vertical :size="16">
    <n-form-item :label="labels.fileName" :show-feedback="false">
      <n-input v-model:value="fileNameProxy" size="small" />
    </n-form-item>

    <n-flex align="center" :size="12" wrap>
      <n-text>{{ labels.scale }}</n-text>
      <n-radio-group v-model:value="scale" size="small">
        <n-radio-button :value="1">1x</n-radio-button>
        <n-radio-button :value="2">2x</n-radio-button>
        <n-radio-button :value="3">3x</n-radio-button>
      </n-radio-group>
    </n-flex>

    <n-flex :size="8" wrap>
      <n-button
        tag="a"
        tertiary
        :href="pngUrl ?? undefined"
        :download="pngFilename"
        :disabled="!pngUrl"
        :loading="isGenerating"
      >
        <template #icon>
          <n-icon><ImageIcon /></n-icon>
        </template>
        {{ labels.png }}
      </n-button>
      <n-button
        tag="a"
        tertiary
        :href="jpgUrl ?? undefined"
        :download="jpgFilename"
        :disabled="!jpgUrl"
        :loading="isGenerating"
      >
        <template #icon>
          <n-icon><ImageIcon /></n-icon>
        </template>
        {{ labels.jpg }}
      </n-button>
      <n-button
        tag="a"
        tertiary
        :href="webpUrl ?? undefined"
        :download="webpFilename"
        :disabled="!webpUrl"
        :loading="isGenerating"
      >
        <template #icon>
          <n-icon><ImageIcon /></n-icon>
        </template>
        {{ labels.webp }}
      </n-button>
      <n-button
        tag="a"
        tertiary
        :href="svgUrl ?? undefined"
        :download="svgFilename"
        :disabled="!svgUrl"
      >
        <template #icon>
          <n-icon><CodeIcon /></n-icon>
        </template>
        {{ labels.svg }}
      </n-button>
      <n-button
        tag="a"
        tertiary
        :href="htmlUrl ?? undefined"
        :download="htmlFilename"
        :disabled="!htmlUrl"
      >
        <template #icon>
          <n-icon><DocumentIcon /></n-icon>
        </template>
        {{ labels.html }}
      </n-button>
    </n-flex>

    <n-flex align="center" :size="8" wrap>
      <CopyToClipboardButton :content="svgMarkup" variant="tertiary" :disabled="!svgMarkup">
        <template #icon>
          <n-icon><CodeIcon /></n-icon>
        </template>
        <template #label>{{ labels.copySvg }}</template>
      </CopyToClipboardButton>
      <CopyToClipboardButton :content="htmlSnippet" variant="tertiary" :disabled="!htmlSnippet">
        <template #icon>
          <n-icon><CopyIcon /></n-icon>
        </template>
        <template #label>{{ labels.copyHtml }}</template>
      </CopyToClipboardButton>
    </n-flex>

    <n-alert v-if="error" type="error" :show-icon="false">
      {{ error }}
    </n-alert>
  </n-flex>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDebounceFn, useObjectUrl } from '@vueuse/core'
import {
  NAlert,
  NButton,
  NFlex,
  NFormItem,
  NIcon,
  NInput,
  NRadioButton,
  NRadioGroup,
  NText,
} from 'naive-ui'
import ImageIcon from '@vicons/fluent/Image24Regular'
import CodeIcon from '@vicons/fluent/Code24Regular'
import DocumentIcon from '@vicons/fluent/Document16Regular'
import CopyIcon from '@vicons/fluent/Copy24Regular'
import { CopyToClipboardButton } from '@shared/ui/base'
import { rasterizeSvg } from '../utils/raster'

const props = defineProps<{
  svgMarkup: string
  svgWidth: number
  svgHeight: number
  htmlSnippet: string
  htmlDocument: string
  jpgBackground: string
  labels: {
    fileName: string
    scale: string
    rendering: string
    png: string
    jpg: string
    webp: string
    svg: string
    html: string
    copySvg: string
    copyHtml: string
    exportError: string
  }
}>()

const scale = ref(2)
const quality = 0.92
const pngBlob = ref<Blob | null>(null)
const jpgBlob = ref<Blob | null>(null)
const webpBlob = ref<Blob | null>(null)
const isGenerating = ref(false)
const error = ref('')
let generationId = 0

const fileNameProxy = defineModel<string>('filename', { required: true })

const normalizedFileName = computed(() => {
  const baseName = fileNameProxy.value.trim() || 'code-shot'
  return baseName.replace(/[\\/<>:"|?*]+/g, '-').replace(/\s+/g, '-')
})

const svgBlob = computed(() =>
  props.svgMarkup ? new Blob([props.svgMarkup], { type: 'image/svg+xml' }) : null,
)
const htmlBlob = computed(() =>
  props.htmlDocument ? new Blob([props.htmlDocument], { type: 'text/html;charset=utf-8' }) : null,
)

const pngUrl = useObjectUrl(pngBlob)
const jpgUrl = useObjectUrl(jpgBlob)
const webpUrl = useObjectUrl(webpBlob)
const svgUrl = useObjectUrl(svgBlob)
const htmlUrl = useObjectUrl(htmlBlob)

const pngFilename = computed(() => `${normalizedFileName.value}.png`)
const jpgFilename = computed(() => `${normalizedFileName.value}.jpg`)
const webpFilename = computed(() => `${normalizedFileName.value}.webp`)
const svgFilename = computed(() => `${normalizedFileName.value}.svg`)
const htmlFilename = computed(() => `${normalizedFileName.value}.html`)

const generateRasterOutputs = useDebounceFn(async () => {
  if (!props.svgMarkup || props.svgWidth <= 0 || props.svgHeight <= 0) {
    pngBlob.value = null
    jpgBlob.value = null
    webpBlob.value = null
    return
  }

  const currentId = (generationId += 1)
  isGenerating.value = true
  error.value = ''

  try {
    const [pngResult, jpgResult, webpResult] = await Promise.all([
      rasterizeSvg({
        svg: props.svgMarkup,
        width: props.svgWidth,
        height: props.svgHeight,
        scale: scale.value,
        format: 'png',
      }),
      rasterizeSvg({
        svg: props.svgMarkup,
        width: props.svgWidth,
        height: props.svgHeight,
        scale: scale.value,
        format: 'jpeg',
        quality,
        backgroundColor: props.jpgBackground,
      }),
      rasterizeSvg({
        svg: props.svgMarkup,
        width: props.svgWidth,
        height: props.svgHeight,
        scale: scale.value,
        format: 'webp',
        quality,
      }),
    ])

    if (currentId !== generationId) return
    pngBlob.value = pngResult
    jpgBlob.value = jpgResult
    webpBlob.value = webpResult
  } catch (err) {
    if (currentId !== generationId) return
    const message =
      err instanceof Error && err.message.length > 0 ? err.message : props.labels.exportError
    error.value = message
    pngBlob.value = null
    jpgBlob.value = null
    webpBlob.value = null
  } finally {
    if (currentId === generationId) {
      isGenerating.value = false
    }
  }
}, 240)

watch(
  () => [props.svgMarkup, props.svgWidth, props.svgHeight, props.jpgBackground, scale.value],
  () => {
    generateRasterOutputs()
  },
  { immediate: true },
)
</script>
