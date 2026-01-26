<template>
  <n-flex vertical :size="16">
    <n-card embedded class="summary-card">
      <n-flex justify="space-between" align="center" :size="12">
        <div>
          <n-text depth="3">{{ t('total') }}</n-text>
          <div class="total-value" data-testid="total-value">
            {{ hasResults ? total : '--' }}
          </div>
        </div>
        <n-flex vertical :size="4" align="end">
          <n-text depth="3">{{ t('dice') }}</n-text>
          <n-tag type="info">{{ t('diceSummary', { count, faces }) }}</n-tag>
          <n-text v-if="rollLabel" depth="3">{{ rollLabel }}</n-text>
        </n-flex>
      </n-flex>
    </n-card>

    <n-card embedded class="results-card">
      <n-text depth="3">{{ t('resultsList') }}</n-text>
      <n-input
        v-if="hasResults"
        type="textarea"
        :value="resultsListText"
        readonly
        :rows="5"
        data-testid="results-text"
        class="results-input"
      />
      <n-text v-else depth="3" data-testid="results-empty">{{ t('empty') }}</n-text>
    </n-card>

    <n-card embedded>
      <n-text depth="3">{{ t('exports') }}</n-text>
      <n-grid cols="1 m:3" responsive="screen" :x-gap="12" :y-gap="12" class="export-grid">
        <n-gi>
          <n-card embedded class="export-card">
            <n-flex align="center" :size="8">
              <n-icon :component="DocumentIcon" />
              <n-text>{{ t('textExport') }}</n-text>
            </n-flex>
            <n-flex wrap :size="8" class="export-actions">
              <CopyToClipboardButton :content="resultsText" :disabled="!hasResults" />
              <n-button
                tag="a"
                tertiary
                :href="textUrl ?? undefined"
                :download="textFilename"
                :disabled="!hasResults"
                data-testid="download-text"
              >
                <template #icon>
                  <n-icon :component="DownloadIcon" />
                </template>
                {{ t('download') }}
              </n-button>
            </n-flex>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card embedded class="export-card">
            <n-flex align="center" :size="8">
              <n-icon :component="ImageIcon" />
              <n-text>{{ t('stageImage') }}</n-text>
            </n-flex>
            <n-flex wrap :size="8" class="export-actions">
              <n-button
                :disabled="!stageImageBlob || !supportsImageCopy"
                @click="copyImage(stageImageBlob, 'stage')"
                data-testid="copy-stage"
              >
                <template #icon>
                  <n-icon :component="CopyIcon" />
                </template>
                {{ t('copy') }}
              </n-button>
              <n-button
                tag="a"
                tertiary
                :href="stageImageUrl ?? undefined"
                :download="stageImageFilename"
                :disabled="!stageImageUrl"
                data-testid="download-stage"
              >
                <template #icon>
                  <n-icon :component="DownloadIcon" />
                </template>
                {{ t('download') }}
              </n-button>
            </n-flex>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card embedded class="export-card">
            <n-flex align="center" :size="8">
              <n-icon :component="ImageIcon" />
              <n-text>{{ t('resultsImage') }}</n-text>
            </n-flex>
            <n-flex wrap :size="8" class="export-actions">
              <n-button
                :disabled="!resultsImageBlob || !supportsImageCopy"
                @click="copyImage(resultsImageBlob, 'results')"
                data-testid="copy-results-image"
              >
                <template #icon>
                  <n-icon :component="CopyIcon" />
                </template>
                {{ t('copy') }}
              </n-button>
              <n-button
                tag="a"
                tertiary
                :href="resultsImageUrl ?? undefined"
                :download="resultsImageFilename"
                :disabled="!resultsImageUrl"
                data-testid="download-results-image"
              >
                <template #icon>
                  <n-icon :component="DownloadIcon" />
                </template>
                {{ t('download') }}
              </n-button>
            </n-flex>
          </n-card>
        </n-gi>
      </n-grid>
      <n-text v-if="!supportsImageCopy" depth="3" class="copy-hint">
        {{ t('copyNotSupported') }}
      </n-text>
    </n-card>
  </n-flex>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NButton, NCard, NFlex, NGi, NGrid, NIcon, NInput, NTag, NText, useMessage } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import CopyIcon from '@vicons/fluent/Copy24Regular'
import DownloadIcon from '@vicons/fluent/ArrowDownload16Regular'
import ImageIcon from '@vicons/fluent/Image24Regular'
import DocumentIcon from '@vicons/fluent/Document16Regular'

const { t, locale } = useI18n()
const message = useMessage()

const props = defineProps<{
  results: number[]
  faces: number
  count: number
  total: number
  rollTime: string | null
  stageImageBlob: Blob | null
  stageImageUrl: string | null
}>()

const hasResults = computed(() => props.results.length > 0)

const rollLabel = computed(() => {
  if (!props.rollTime) return ''
  return new Date(props.rollTime).toLocaleString()
})

const resultsListText = computed(() => (hasResults.value ? props.results.join(', ') : ''))

const resultsText = computed(() => {
  if (!hasResults.value) return ''
  const resultsLine = props.results.join(', ')
  const lines = [
    t('textHeader'),
    t('textFaces', { faces: props.faces, count: props.count }),
    t('textTotal', { total: props.total }),
    t('textResults', { results: resultsLine }),
  ]
  if (props.rollTime) {
    lines.push(t('textTime', { time: new Date(props.rollTime).toLocaleString() }))
  }
  return lines.join('\n')
})

const textBlob = computed(() =>
  resultsText.value ? new Blob([resultsText.value], { type: 'text/plain' }) : null,
)
const textUrl = useObjectUrl(textBlob)

const stageImageFilename = computed(() => buildFilename('dice-stage', 'png'))
const resultsImageFilename = computed(() => buildFilename('dice-results', 'png'))
const textFilename = computed(() => buildFilename('dice-results', 'txt'))

const resultsImageBlob = ref<Blob | null>(null)
const resultsImageUrl = useObjectUrl(resultsImageBlob)

const supportsImageCopy = computed(() => {
  if (typeof window === 'undefined') return false
  return (
    !!navigator.clipboard &&
    typeof (window as typeof window & { ClipboardItem?: typeof ClipboardItem }).ClipboardItem !==
      'undefined'
  )
})

function buildFilename(prefix: string, ext: string) {
  const stamp = props.rollTime
    ? formatFileStamp(new Date(props.rollTime))
    : formatFileStamp(new Date())
  return `${prefix}-${stamp}.${ext}`
}

function formatFileStamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(
    date.getHours(),
  )}${pad(date.getMinutes())}${pad(date.getSeconds())}`
}

async function copyImage(blob: Blob | null, label: 'stage' | 'results') {
  if (!blob) return

  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    message.success(
      t('copySuccess', { label: label === 'stage' ? t('stageImage') : t('resultsImage') }),
    )
  } catch (error) {
    message.error(t('copyError'))
    console.error(error)
  }
}

async function updateResultsImage() {
  if (!hasResults.value) {
    resultsImageBlob.value = null
    return
  }
  const blob = await drawResultsImage()
  resultsImageBlob.value = blob
}

async function drawResultsImage(): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const width = 960
  const padding = 32
  const headerFont = '700 26px sans-serif'
  const bodyFont = '16px sans-serif'
  const lineHeight = 24

  const header = t('imageTitle')
  const sub = t('imageSubtitle', { faces: props.faces, count: props.count })
  const totalLine = t('textTotal', { total: props.total })
  const resultsLine = t('textResults', { results: props.results.join(', ') })
  const timeLine = props.rollTime
    ? t('textTime', { time: new Date(props.rollTime).toLocaleString() })
    : ''

  ctx.font = headerFont
  const headerLines = wrapText(ctx, header, width - padding * 2)
  ctx.font = bodyFont
  const bodyLines = [sub, totalLine, resultsLine]
  if (timeLine) bodyLines.push(timeLine)
  const wrappedBody = bodyLines.flatMap((line) => wrapText(ctx, line, width - padding * 2))

  const totalLines = headerLines.length + wrappedBody.length
  const height = padding * 2 + totalLines * lineHeight + 12

  canvas.width = width
  canvas.height = height

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  let cursorY = padding + lineHeight

  ctx.font = headerFont
  ctx.fillStyle = '#1f2533'
  headerLines.forEach((line) => {
    ctx.fillText(line, padding, cursorY)
    cursorY += lineHeight
  })

  ctx.font = bodyFont
  ctx.fillStyle = '#3a4153'
  wrappedBody.forEach((line) => {
    ctx.fillText(line, padding, cursorY)
    cursorY += lineHeight
  })

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (!text) return ['']
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  words.forEach((word) => {
    const testLine = current ? `${current} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = testLine
    }
  })
  if (current) lines.push(current)
  return lines
}

watch(
  [
    () => props.results,
    () => props.faces,
    () => props.count,
    () => props.total,
    () => props.rollTime,
    locale,
  ],
  () => {
    updateResultsImage()
  },
)
</script>

<style scoped>
.summary-card {
  background: linear-gradient(120deg, rgba(92, 119, 255, 0.12), rgba(146, 170, 255, 0.12));
}

.total-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
}

.results-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.results-input :deep(textarea) {
  font-family: 'Courier New', monospace;
}

.export-grid {
  margin-top: 12px;
}

.export-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.export-actions {
  margin-top: 6px;
}

.copy-hint {
  margin-top: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "zh": {
    "total": "总和",
    "dice": "骰子",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "结果",
    "empty": "暂无结果，点击开始投掷。",
    "exports": "导出",
    "textExport": "结果文本",
    "stageImage": "3D 画面",
    "resultsImage": "结果图片",
    "download": "下载",
    "copy": "复制",
    "copyNotSupported": "当前浏览器不支持复制图片。",
    "copySuccess": "已复制 {label}",
    "copyError": "复制图片失败",
    "imageTitle": "骰子投掷结果",
    "imageSubtitle": "{count} 颗骰子 · d{faces}",
    "textHeader": "骰子投掷结果",
    "textFaces": "骰子：{count} × d{faces}",
    "textTotal": "总和：{total}",
    "textResults": "结果：{results}",
    "textTime": "时间：{time}"
  },
  "zh-CN": {
    "total": "总和",
    "dice": "骰子",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "结果",
    "empty": "暂无结果，点击开始投掷。",
    "exports": "导出",
    "textExport": "结果文本",
    "stageImage": "3D 画面",
    "resultsImage": "结果图片",
    "download": "下载",
    "copy": "复制",
    "copyNotSupported": "当前浏览器不支持复制图片。",
    "copySuccess": "已复制 {label}",
    "copyError": "复制图片失败",
    "imageTitle": "骰子投掷结果",
    "imageSubtitle": "{count} 颗骰子 · d{faces}",
    "textHeader": "骰子投掷结果",
    "textFaces": "骰子：{count} × d{faces}",
    "textTotal": "总和：{total}",
    "textResults": "结果：{results}",
    "textTime": "时间：{time}"
  },
  "zh-TW": {
    "total": "總和",
    "dice": "骰子",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "結果",
    "empty": "尚無結果，請開始擲骰。",
    "exports": "匯出",
    "textExport": "結果文字",
    "stageImage": "3D 畫面",
    "resultsImage": "結果圖片",
    "download": "下載",
    "copy": "複製",
    "copyNotSupported": "目前瀏覽器不支援複製圖片。",
    "copySuccess": "已複製 {label}",
    "copyError": "複製圖片失敗",
    "imageTitle": "骰子擲出結果",
    "imageSubtitle": "{count} 顆骰子 · d{faces}",
    "textHeader": "骰子擲出結果",
    "textFaces": "骰子：{count} × d{faces}",
    "textTotal": "總和：{total}",
    "textResults": "結果：{results}",
    "textTime": "時間：{time}"
  },
  "zh-HK": {
    "total": "總和",
    "dice": "骰子",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "結果",
    "empty": "尚無結果，請開始擲骰。",
    "exports": "匯出",
    "textExport": "結果文字",
    "stageImage": "3D 畫面",
    "resultsImage": "結果圖片",
    "download": "下載",
    "copy": "複製",
    "copyNotSupported": "目前瀏覽器不支援複製圖片。",
    "copySuccess": "已複製 {label}",
    "copyError": "複製圖片失敗",
    "imageTitle": "骰子擲出結果",
    "imageSubtitle": "{count} 顆骰子 · d{faces}",
    "textHeader": "骰子擲出結果",
    "textFaces": "骰子：{count} × d{faces}",
    "textTotal": "總和：{total}",
    "textResults": "結果：{results}",
    "textTime": "時間：{time}"
  },
  "es": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "fr": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "de": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "it": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "ja": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "ko": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "ru": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "pt": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "ar": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "hi": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "tr": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "nl": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "sv": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "pl": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "vi": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "th": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "id": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "he": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "ms": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  },
  "no": {
    "total": "Total",
    "dice": "Dice",
    "diceSummary": "{count} × d{faces}",
    "resultsList": "Results",
    "empty": "No results yet. Roll the dice to begin.",
    "exports": "Exports",
    "textExport": "Results Text",
    "stageImage": "3D Stage Image",
    "resultsImage": "Results Image",
    "download": "Download",
    "copy": "Copy",
    "copyNotSupported": "Image copy is not supported in this browser.",
    "copySuccess": "Copied {label} to clipboard",
    "copyError": "Failed to copy image",
    "imageTitle": "Dice Roll Results",
    "imageSubtitle": "{count} dice · d{faces}",
    "textHeader": "Dice Roll Results",
    "textFaces": "Dice: {count} × d{faces}",
    "textTotal": "Total: {total}",
    "textResults": "Results: {results}",
    "textTime": "Time: {time}"
  }
}
</i18n>
