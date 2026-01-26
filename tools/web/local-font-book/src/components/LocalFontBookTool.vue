<template>
  <ToolSectionHeader>{{ t('library-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 l:2" :x-gap="24" :y-gap="24" responsive="screen">
      <n-gi>
        <n-card class="panel">
          <div class="panel__header">
            <div>
              <div class="panel__title">{{ t('library-title') }}</div>
              <div class="panel__subtitle">{{ t('library-hint') }}</div>
            </div>
            <n-button
              type="primary"
              size="small"
              :disabled="!isSupported || isLoading"
              :loading="isLoading"
              @click="loadFonts"
              data-testid="load-fonts"
            >
              <template #icon>
                <n-icon :component="ArrowDownload16Regular" />
              </template>
              {{ t('load-button') }}
            </n-button>
          </div>

          <n-alert
            v-show="statusMessage"
            :type="statusType"
            :show-icon="false"
            class="panel__alert"
            data-testid="status-message"
          >
            {{ statusMessage }}
          </n-alert>

          <n-flex align="center" :size="12" :wrap="true" class="filter-row">
            <n-input
              v-model:value="searchQuery"
              :placeholder="t('search-placeholder')"
              clearable
              data-testid="search-input"
            />
            <n-select
              v-model:value="filterStyle"
              :options="styleOptions"
              size="small"
              class="filter-control"
              data-testid="style-filter"
            />
            <n-select
              v-model:value="sortBy"
              :options="sortOptions"
              size="small"
              class="filter-control"
              data-testid="sort-by"
            />
            <n-flex align="center" :size="8">
              <n-text depth="3">{{ t('group-label') }}</n-text>
              <n-switch v-model:value="groupByFamily" size="small" data-testid="group-toggle" />
            </n-flex>
          </n-flex>

          <n-text v-show="fontCountLabel" depth="3" class="count-label">
            {{ fontCountLabel }}
          </n-text>

          <div class="font-list" data-testid="font-list">
            <template v-if="displayGroups.length">
              <div v-for="group in displayGroups" :key="group.id" class="font-group">
                <div v-if="groupByFamily" class="font-group__title">{{ group.label }}</div>
                <div class="font-group__list">
                  <button
                    v-for="font in group.items"
                    :key="font.postscriptName"
                    type="button"
                    class="font-card"
                    :class="{ 'font-card--active': font.postscriptName === activePostscriptName }"
                    :data-testid="`font-${font.postscriptName}`"
                    @click="setActiveFont(font.postscriptName)"
                  >
                    <div class="font-card__name">{{ font.fullName }}</div>
                    <div class="font-card__meta">
                      <span class="font-card__family">{{ font.family }}</span>
                      <span class="font-card__style">{{ font.style }}</span>
                    </div>
                  </button>
                </div>
              </div>
            </template>
            <n-text v-else depth="3" class="empty-text" data-testid="no-results">
              {{ t('no-results') }}
            </n-text>
          </div>
        </n-card>
      </n-gi>

      <n-gi>
        <n-card class="panel">
          <div class="panel__header">
            <div>
              <div class="panel__title">{{ t('preview-title') }}</div>
              <div class="panel__subtitle">{{ t('preview-hint') }}</div>
            </div>
            <CopyToClipboardButton :content="cssSnippet" />
          </div>

          <n-input
            v-model:value="sampleText"
            type="textarea"
            :placeholder="t('preview-placeholder')"
            :autosize="{ minRows: 3, maxRows: 5 }"
            data-testid="sample-text"
          />

          <div class="control-grid">
            <n-form-item :label="t('preview-size')">
              <n-flex align="center" :size="12" class="control-row">
                <n-slider v-model:value="fontSize" :min="12" :max="96" />
                <n-input-number v-model:value="fontSize" :min="12" :max="96" size="small" />
              </n-flex>
            </n-form-item>
            <n-form-item :label="t('preview-line-height')">
              <n-flex align="center" :size="12" class="control-row">
                <n-slider v-model:value="lineHeight" :min="1" :max="2.4" :step="0.05" />
                <n-input-number
                  v-model:value="lineHeight"
                  :min="1"
                  :max="2.4"
                  :step="0.05"
                  size="small"
                />
              </n-flex>
            </n-form-item>
          </div>

          <n-flex align="center" :size="8">
            <n-text depth="3">{{ t('preview-background') }}</n-text>
            <n-switch v-model:value="darkBackground" size="small" data-testid="background-toggle" />
          </n-flex>

          <div class="preview-surface" :class="{ 'is-dark': darkBackground }">
            <div
              v-if="activeFont"
              class="preview-text"
              :style="previewStyle"
              data-testid="preview-text"
            >
              {{ sampleText || t('preview-fallback') }}
            </div>
            <n-text v-else depth="3" data-testid="preview-empty">
              {{ t('preview-empty') }}
            </n-text>
          </div>

          <div class="details">
            <n-text strong>{{ t('details-title') }}</n-text>
            <n-ul class="details-list">
              <n-li>{{ t('details-family') }}: {{ activeFont?.family ?? '--' }}</n-li>
              <n-li>{{ t('details-full-name') }}: {{ activeFont?.fullName ?? '--' }}</n-li>
              <n-li>{{ t('details-postscript') }}: {{ activeFont?.postscriptName ?? '--' }}</n-li>
              <n-li>{{ t('details-style') }}: {{ activeFont?.style ?? '--' }}</n-li>
            </n-ul>
          </div>

          <div class="css-output">
            <n-text strong>{{ t('css-title') }}</n-text>
            <n-code :code="cssSnippet" word-wrap data-testid="css-snippet" />
          </div>
        </n-card>
      </n-gi>
    </n-grid>
  </ToolSection>

  <ToolSectionHeader>{{ t('what-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-text>{{ t('what-p1') }}</n-text>
    <n-text style="margin-top: 8px; display: block">{{ t('what-p2') }}</n-text>
    <n-text style="margin-top: 8px; display: block">{{ t('what-p3') }}</n-text>
    <n-ul style="margin-top: 12px">
      <n-li>{{ t('what-b1') }}</n-li>
      <n-li>{{ t('what-b2') }}</n-li>
      <n-li>{{ t('what-b3') }}</n-li>
    </n-ul>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  NAlert,
  NButton,
  NCard,
  NCode,
  NFlex,
  NFormItem,
  NGi,
  NGrid,
  NIcon,
  NInput,
  NInputNumber,
  NLi,
  NSelect,
  NSlider,
  NSwitch,
  NText,
  NUl,
} from 'naive-ui'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'

type LocalFontData = {
  family: string
  fullName: string
  postscriptName: string
  style: string
}

type QueryLocalFonts = (options?: { postscriptNames?: string[] }) => Promise<LocalFontData[]>

type LoadErrorType = 'not-allowed' | 'security' | 'unknown' | null

type FontGroup = {
  id: string
  label: string
  items: LocalFontData[]
}

const { t } = useI18n()

const fonts = ref<LocalFontData[]>([])
const isLoading = ref(false)
const loadError = ref<LoadErrorType>(null)
const permissionState = ref<PermissionState | 'unknown'>('unknown')

const searchQuery = useStorage('tools:local-font-book:search', '')
const filterStyle = useStorage<'all' | 'regular' | 'italic'>('tools:local-font-book:style', 'all')
const sortBy = useStorage<'family' | 'name' | 'style'>('tools:local-font-book:sort', 'family')
const groupByFamily = useStorage('tools:local-font-book:group', true)

const sampleText = useStorage(
  'tools:local-font-book:sample-text',
  'The quick brown fox jumps over the lazy dog.',
)
const fontSize = useStorage('tools:local-font-book:font-size', 36)
const lineHeight = useStorage('tools:local-font-book:line-height', 1.4)
const darkBackground = useStorage('tools:local-font-book:dark-preview', false)
const activePostscriptName = useStorage('tools:local-font-book:active-font', '')

const isSupported = computed(() => typeof window !== 'undefined' && 'queryLocalFonts' in window)

const styleOptions = computed(() => [
  { label: t('filter-style-all'), value: 'all' },
  { label: t('filter-style-regular'), value: 'regular' },
  { label: t('filter-style-italic'), value: 'italic' },
])

const sortOptions = computed(() => [
  { label: t('sort-family'), value: 'family' },
  { label: t('sort-name'), value: 'name' },
  { label: t('sort-style'), value: 'style' },
])

const normalizedFonts = computed(() =>
  fonts.value.map((font) => ({
    ...font,
    searchKey: `${font.family} ${font.fullName} ${font.postscriptName}`.toLowerCase(),
  })),
)

const filteredFonts = computed(() => {
  let items = normalizedFonts.value
  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    items = items.filter((font) => font.searchKey.includes(query))
  }

  if (filterStyle.value !== 'all') {
    const wantItalic = filterStyle.value === 'italic'
    items = items.filter((font) => isItalicStyle(font.style) === wantItalic)
  }

  const sorted = [...items]
  sorted.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.fullName.localeCompare(b.fullName)
      case 'style':
        return a.style.localeCompare(b.style)
      case 'family':
      default:
        return a.family.localeCompare(b.family)
    }
  })

  return sorted
})

const displayGroups = computed<FontGroup[]>(() => {
  if (!groupByFamily.value) {
    return [
      {
        id: 'all-fonts',
        label: '',
        items: filteredFonts.value,
      },
    ]
  }

  const groups = new Map<string, LocalFontData[]>()
  for (const font of filteredFonts.value) {
    const family = font.family
    const list = groups.get(family) ?? []
    list.push(font)
    groups.set(family, list)
  }

  return [...groups.entries()].map(([family, items]) => ({
    id: family,
    label: family,
    items,
  }))
})

const activeFont = computed(() =>
  normalizedFonts.value.find((font) => font.postscriptName === activePostscriptName.value),
)

const fontCountLabel = computed(() => {
  if (!fonts.value.length) return ''
  return t('font-count', { count: filteredFonts.value.length })
})

const statusMessage = computed(() => {
  if (!isSupported.value) return t('status-unsupported')
  if (loadError.value === 'security') return t('status-blocked')
  if (loadError.value === 'not-allowed' || permissionState.value === 'denied') {
    return t('status-denied')
  }
  if (loadError.value === 'unknown') return t('status-error')
  return ''
})

const statusType = computed(() => {
  if (!isSupported.value) return 'error'
  if (loadError.value === 'security') return 'warning'
  if (loadError.value === 'not-allowed' || permissionState.value === 'denied') {
    return 'warning'
  }
  if (loadError.value === 'unknown') return 'warning'
  return 'info'
})

const previewStyle = computed(() => {
  if (!activeFont.value) return {}
  return {
    fontFamily: activeFont.value.family,
    fontStyle: isItalicStyle(activeFont.value.style) ? 'italic' : 'normal',
    fontSize: `${fontSize.value}px`,
    lineHeight: String(lineHeight.value),
  }
})

const cssSnippet = computed(() => {
  if (!activeFont.value) return ''
  const style = isItalicStyle(activeFont.value.style) ? 'italic' : 'normal'
  const lines = [`font-family: ${wrapFontFamily(activeFont.value.family)};`]
  if (style !== 'normal') lines.push(`font-style: ${style};`)
  return lines.join('\n')
})

onMounted(async () => {
  if (!navigator.permissions?.query) return

  try {
    const status = await navigator.permissions.query({
      name: 'local-fonts' as PermissionName,
    })
    permissionState.value = status.state
  } catch {
    permissionState.value = 'unknown'
  }
})

async function loadFonts() {
  loadError.value = null
  if (!isSupported.value) {
    return
  }

  const queryLocalFonts = (window as Window & { queryLocalFonts?: QueryLocalFonts }).queryLocalFonts
  if (!queryLocalFonts) {
    loadError.value = 'security'
    return
  }

  isLoading.value = true
  try {
    const availableFonts = await queryLocalFonts()
    fonts.value = availableFonts
    if (!availableFonts.find((font) => font.postscriptName === activePostscriptName.value)) {
      activePostscriptName.value = availableFonts[0]?.postscriptName ?? ''
    }
  } catch (error) {
    const name = (error as { name?: string })?.name
    if (name === 'NotAllowedError') {
      loadError.value = 'not-allowed'
    } else if (name === 'SecurityError') {
      loadError.value = 'security'
    } else {
      loadError.value = 'unknown'
    }
  } finally {
    isLoading.value = false
  }
}

function setActiveFont(postscriptName: string) {
  activePostscriptName.value = postscriptName
}

function isItalicStyle(style: string) {
  return /italic|oblique/i.test(style)
}

function wrapFontFamily(family: string) {
  const escaped = family.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  return `"${escaped}"`
}
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.panel__title {
  font-weight: 600;
  font-size: 16px;
}

.panel__subtitle {
  color: rgba(100, 116, 139, 0.9);
  font-size: 13px;
}

.panel__alert {
  margin-top: 4px;
}

.filter-row :deep(.n-input),
.filter-row :deep(.n-select) {
  min-width: 160px;
  flex: 1;
}

.filter-control {
  min-width: 140px;
}

.count-label {
  margin-top: 4px;
}

.font-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 520px;
  overflow: auto;
  padding-right: 4px;
}

.font-group__title {
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(100, 116, 139, 0.85);
  margin-bottom: 8px;
}

.font-group__list {
  display: grid;
  gap: 8px;
}

.font-card {
  text-align: left;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(248, 250, 252, 0.8);
  padding: 10px 12px;
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
  cursor: pointer;
}

.font-card__name {
  font-weight: 600;
  font-size: 14px;
}

.font-card__meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 12px;
  color: rgba(100, 116, 139, 0.9);
}

.font-card__style {
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.font-card--active {
  border-color: rgba(59, 130, 246, 0.7);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background: #ffffff;
}

.empty-text {
  padding: 12px 0;
}

.control-grid {
  display: grid;
  gap: 12px;
}

.control-row {
  width: 100%;
}

.control-row :deep(.n-slider) {
  flex: 1;
  min-width: 120px;
}

.preview-surface {
  border-radius: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.preview-surface.is-dark {
  background: linear-gradient(135deg, #0f172a, #1f2937);
  color: #f8fafc;
}

.preview-text {
  width: 100%;
}

.details {
  display: grid;
  gap: 8px;
}

.details-list {
  margin-top: 6px;
}

.css-output {
  display: grid;
  gap: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "library-title": "Font library",
    "library-hint": "Load and browse the fonts installed on your device.",
    "load-button": "Load local fonts",
    "search-placeholder": "Search by family, name, or PostScript…",
    "filter-style-all": "All styles",
    "filter-style-regular": "Regular",
    "filter-style-italic": "Italic/Oblique",
    "sort-family": "Family",
    "sort-name": "Name",
    "sort-style": "Style",
    "group-label": "Group by family",
    "font-count": "{count} fonts",
    "no-results": "No fonts match your filters.",
    "preview-title": "Preview",
    "preview-hint": "Tune the sample text and typography settings.",
    "preview-placeholder": "Type your sample text…",
    "preview-fallback": "Sample text",
    "preview-size": "Size",
    "preview-line-height": "Line height",
    "preview-background": "Dark background",
    "preview-empty": "Select a font to preview.",
    "details-title": "Font details",
    "details-family": "Family",
    "details-full-name": "Full name",
    "details-postscript": "PostScript name",
    "details-style": "Style",
    "css-title": "CSS snippet",
    "status-unsupported": "Your browser does not support Local Font Access.",
    "status-denied": "Permission denied. Allow local-fonts to list fonts.",
    "status-blocked": "Access blocked by permissions policy or insecure context.",
    "status-error": "Unable to load fonts. Try again.",
    "what-title": "What is Local Font Access?",
    "what-p1": "Local Font Access is a browser API that lists the fonts installed on your device.",
    "what-p2": "It only works in secure contexts and supported browsers, and requires user permission (local-fonts).",
    "what-p3": "The API returns FontData with family, fullName, postscriptName, and style metadata.",
    "what-b1": "Calls must be triggered by a user gesture.",
    "what-b2": "Permissions Policy can block access on some sites.",
    "what-b3": "This tool stays on-device and does not upload fonts."
  },
  "zh": {
    "library-title": "字体库",
    "library-hint": "加载并浏览设备上安装的字体。",
    "load-button": "加载本地字体",
    "search-placeholder": "按家族、名称或 PostScript 搜索…",
    "filter-style-all": "全部样式",
    "filter-style-regular": "常规",
    "filter-style-italic": "斜体/倾斜",
    "sort-family": "家族",
    "sort-name": "名称",
    "sort-style": "样式",
    "group-label": "按家族分组",
    "font-count": "{count} 个字体",
    "no-results": "没有匹配的字体。",
    "preview-title": "预览",
    "preview-hint": "调整示例文字和排版设置。",
    "preview-placeholder": "输入示例文字…",
    "preview-fallback": "示例文字",
    "preview-size": "字号",
    "preview-line-height": "行高",
    "preview-background": "深色背景",
    "preview-empty": "请选择一个字体进行预览。",
    "details-title": "字体详情",
    "details-family": "家族",
    "details-full-name": "完整名称",
    "details-postscript": "PostScript 名称",
    "details-style": "样式",
    "css-title": "CSS 代码",
    "status-unsupported": "当前浏览器不支持 Local Font Access。",
    "status-denied": "权限被拒绝，请允许 local-fonts 访问。",
    "status-blocked": "被权限策略或非安全上下文阻止。",
    "status-error": "字体加载失败，请重试。",
    "what-title": "什么是 Local Font Access？",
    "what-p1": "Local Font Access 是浏览器 API，用于列出设备上安装的字体。",
    "what-p2": "它仅在安全上下文和受支持的浏览器中可用，并需要用户权限（local-fonts）。",
    "what-p3": "API 返回的 FontData 包含 family、fullName、postscriptName、style 等信息。",
    "what-b1": "调用必须由用户交互触发。",
    "what-b2": "Permissions Policy 可能会阻止访问。",
    "what-b3": "本工具在本地运行，不会上传字体。"
  },
  "zh-CN": {
    "library-title": "字体库",
    "library-hint": "加载并浏览设备上安装的字体。",
    "load-button": "加载本地字体",
    "search-placeholder": "按家族、名称或 PostScript 搜索…",
    "filter-style-all": "全部样式",
    "filter-style-regular": "常规",
    "filter-style-italic": "斜体/倾斜",
    "sort-family": "家族",
    "sort-name": "名称",
    "sort-style": "样式",
    "group-label": "按家族分组",
    "font-count": "{count} 个字体",
    "no-results": "没有匹配的字体。",
    "preview-title": "预览",
    "preview-hint": "调整示例文字和排版设置。",
    "preview-placeholder": "输入示例文字…",
    "preview-fallback": "示例文字",
    "preview-size": "字号",
    "preview-line-height": "行高",
    "preview-background": "深色背景",
    "preview-empty": "请选择一个字体进行预览。",
    "details-title": "字体详情",
    "details-family": "家族",
    "details-full-name": "完整名称",
    "details-postscript": "PostScript 名称",
    "details-style": "样式",
    "css-title": "CSS 代码",
    "status-unsupported": "当前浏览器不支持 Local Font Access。",
    "status-denied": "权限被拒绝，请允许 local-fonts 访问。",
    "status-blocked": "被权限策略或非安全上下文阻止。",
    "status-error": "字体加载失败，请重试。",
    "what-title": "什么是 Local Font Access？",
    "what-p1": "Local Font Access 是浏览器 API，用于列出设备上安装的字体。",
    "what-p2": "它仅在安全上下文和受支持的浏览器中可用，并需要用户权限（local-fonts）。",
    "what-p3": "API 返回的 FontData 包含 family、fullName、postscriptName、style 等信息。",
    "what-b1": "调用必须由用户交互触发。",
    "what-b2": "Permissions Policy 可能会阻止访问。",
    "what-b3": "本工具在本地运行，不会上传字体。"
  },
  "zh-TW": {
    "library-title": "字型庫",
    "library-hint": "載入並瀏覽裝置上安裝的字型。",
    "load-button": "載入本機字型",
    "search-placeholder": "以家族、名稱或 PostScript 搜尋…",
    "filter-style-all": "全部樣式",
    "filter-style-regular": "一般",
    "filter-style-italic": "斜體/傾斜",
    "sort-family": "家族",
    "sort-name": "名稱",
    "sort-style": "樣式",
    "group-label": "依家族分組",
    "font-count": "{count} 個字型",
    "no-results": "找不到符合的字型。",
    "preview-title": "預覽",
    "preview-hint": "調整示例文字與排版設定。",
    "preview-placeholder": "輸入示例文字…",
    "preview-fallback": "示例文字",
    "preview-size": "字號",
    "preview-line-height": "行高",
    "preview-background": "深色背景",
    "preview-empty": "請選擇字型以預覽。",
    "details-title": "字型詳情",
    "details-family": "家族",
    "details-full-name": "完整名稱",
    "details-postscript": "PostScript 名稱",
    "details-style": "樣式",
    "css-title": "CSS 片段",
    "status-unsupported": "目前瀏覽器不支援 Local Font Access。",
    "status-denied": "已拒絕權限，請允許 local-fonts 存取。",
    "status-blocked": "被權限策略或非安全環境阻擋。",
    "status-error": "字型載入失敗，請重試。",
    "what-title": "什麼是 Local Font Access？",
    "what-p1": "Local Font Access 是瀏覽器 API，可列出裝置上安裝的字型。",
    "what-p2": "僅在安全環境與支援的瀏覽器中可用，且需要使用者權限（local-fonts）。",
    "what-p3": "API 回傳的 FontData 包含 family、fullName、postscriptName、style 等資訊。",
    "what-b1": "呼叫必須由使用者互動觸發。",
    "what-b2": "Permissions Policy 可能會阻擋存取。",
    "what-b3": "本工具僅在本機運作，不會上傳字型。"
  },
  "zh-HK": {
    "library-title": "字體庫",
    "library-hint": "載入並瀏覽裝置上安裝的字體。",
    "load-button": "載入本機字體",
    "search-placeholder": "按家族、名稱或 PostScript 搜尋…",
    "filter-style-all": "全部樣式",
    "filter-style-regular": "一般",
    "filter-style-italic": "斜體/傾斜",
    "sort-family": "家族",
    "sort-name": "名稱",
    "sort-style": "樣式",
    "group-label": "按家族分組",
    "font-count": "{count} 款字體",
    "no-results": "沒有符合的字體。",
    "preview-title": "預覽",
    "preview-hint": "調整示例文字與排版設定。",
    "preview-placeholder": "輸入示例文字…",
    "preview-fallback": "示例文字",
    "preview-size": "字號",
    "preview-line-height": "行高",
    "preview-background": "深色背景",
    "preview-empty": "請選擇字體以預覽。",
    "details-title": "字體詳情",
    "details-family": "家族",
    "details-full-name": "完整名稱",
    "details-postscript": "PostScript 名稱",
    "details-style": "樣式",
    "css-title": "CSS 片段",
    "status-unsupported": "目前瀏覽器不支援 Local Font Access。",
    "status-denied": "已拒絕權限，請允許 local-fonts 存取。",
    "status-blocked": "被權限政策或非安全環境阻擋。",
    "status-error": "字體載入失敗，請重試。",
    "what-title": "什麼是 Local Font Access？",
    "what-p1": "Local Font Access 是瀏覽器 API，可列出裝置上安裝的字體。",
    "what-p2": "僅在安全環境與支援的瀏覽器中可用，且需要使用者權限（local-fonts）。",
    "what-p3": "API 回傳的 FontData 包含 family、fullName、postscriptName、style 等資訊。",
    "what-b1": "呼叫必須由使用者互動觸發。",
    "what-b2": "Permissions Policy 可能會阻擋存取。",
    "what-b3": "本工具只在本機運作，不會上傳字體。"
  },
  "es": {
    "library-title": "Biblioteca de fuentes",
    "library-hint": "Carga y explora las fuentes instaladas en tu dispositivo.",
    "load-button": "Cargar fuentes locales",
    "search-placeholder": "Buscar por familia, nombre o PostScript…",
    "filter-style-all": "Todos los estilos",
    "filter-style-regular": "Regular",
    "filter-style-italic": "Cursiva/Oblicua",
    "sort-family": "Familia",
    "sort-name": "Nombre",
    "sort-style": "Estilo",
    "group-label": "Agrupar por familia",
    "font-count": "{count} fuentes",
    "no-results": "No hay fuentes que coincidan con tus filtros.",
    "preview-title": "Vista previa",
    "preview-hint": "Ajusta el texto y la tipografía de muestra.",
    "preview-placeholder": "Escribe tu texto de muestra…",
    "preview-fallback": "Texto de muestra",
    "preview-size": "Tamaño",
    "preview-line-height": "Altura de línea",
    "preview-background": "Fondo oscuro",
    "preview-empty": "Selecciona una fuente para previsualizar.",
    "details-title": "Detalles de la fuente",
    "details-family": "Familia",
    "details-full-name": "Nombre completo",
    "details-postscript": "Nombre PostScript",
    "details-style": "Estilo",
    "css-title": "Fragmento CSS",
    "status-unsupported": "Tu navegador no admite Local Font Access.",
    "status-denied": "Permiso denegado. Permite local-fonts para listar fuentes.",
    "status-blocked": "Acceso bloqueado por política de permisos o contexto inseguro.",
    "status-error": "No se pudieron cargar las fuentes. Inténtalo de nuevo.",
    "what-title": "¿Qué es Local Font Access?",
    "what-p1": "Local Font Access es una API del navegador que enumera las fuentes instaladas en tu dispositivo.",
    "what-p2": "Solo funciona en contextos seguros y navegadores compatibles, y requiere permiso del usuario (local-fonts).",
    "what-p3": "La API devuelve FontData con metadatos family, fullName, postscriptName y style.",
    "what-b1": "Las llamadas deben iniciarse con un gesto del usuario.",
    "what-b2": "Permissions Policy puede bloquear el acceso en algunos sitios.",
    "what-b3": "Esta herramienta se ejecuta localmente y no sube fuentes."
  },
  "fr": {
    "library-title": "Bibliothèque de polices",
    "library-hint": "Chargez et parcourez les polices installées sur votre appareil.",
    "load-button": "Charger les polices locales",
    "search-placeholder": "Rechercher par famille, nom ou PostScript…",
    "filter-style-all": "Tous les styles",
    "filter-style-regular": "Normal",
    "filter-style-italic": "Italique/Oblique",
    "sort-family": "Famille",
    "sort-name": "Nom",
    "sort-style": "Style",
    "group-label": "Regrouper par famille",
    "font-count": "{count} polices",
    "no-results": "Aucune police ne correspond à vos filtres.",
    "preview-title": "Aperçu",
    "preview-hint": "Ajustez le texte d'exemple et les réglages typographiques.",
    "preview-placeholder": "Saisissez votre texte d'exemple…",
    "preview-fallback": "Texte d'exemple",
    "preview-size": "Taille",
    "preview-line-height": "Interligne",
    "preview-background": "Fond sombre",
    "preview-empty": "Sélectionnez une police pour l'aperçu.",
    "details-title": "Détails de la police",
    "details-family": "Famille",
    "details-full-name": "Nom complet",
    "details-postscript": "Nom PostScript",
    "details-style": "Style",
    "css-title": "Extrait CSS",
    "status-unsupported": "Votre navigateur ne prend pas en charge Local Font Access.",
    "status-denied": "Autorisation refusée. Autorisez local-fonts pour lister les polices.",
    "status-blocked": "Accès bloqué par une politique de permissions ou un contexte non sécurisé.",
    "status-error": "Impossible de charger les polices. Réessayez.",
    "what-title": "Qu'est-ce que Local Font Access ?",
    "what-p1": "Local Font Access est une API du navigateur qui liste les polices installées sur votre appareil.",
    "what-p2": "Elle fonctionne uniquement en contexte sécurisé et sur des navigateurs compatibles, avec l'autorisation de l'utilisateur (local-fonts).",
    "what-p3": "L'API renvoie des FontData avec family, fullName, postscriptName et style.",
    "what-b1": "Les appels doivent être déclenchés par un geste utilisateur.",
    "what-b2": "Une Permissions Policy peut bloquer l'accès sur certains sites.",
    "what-b3": "Cet outil reste local et ne téléverse pas de polices."
  },
  "de": {
    "library-title": "Schriftbibliothek",
    "library-hint": "Laden und durchsuchen Sie die auf Ihrem Gerät installierten Schriften.",
    "load-button": "Lokale Schriften laden",
    "search-placeholder": "Nach Familie, Name oder PostScript suchen…",
    "filter-style-all": "Alle Stile",
    "filter-style-regular": "Normal",
    "filter-style-italic": "Kursiv/Schräg",
    "sort-family": "Familie",
    "sort-name": "Name",
    "sort-style": "Stil",
    "group-label": "Nach Familie gruppieren",
    "font-count": "{count} Schriften",
    "no-results": "Keine Schriften passen zu den Filtern.",
    "preview-title": "Vorschau",
    "preview-hint": "Beispieltext und Typografie einstellen.",
    "preview-placeholder": "Beispieltext eingeben…",
    "preview-fallback": "Beispieltext",
    "preview-size": "Größe",
    "preview-line-height": "Zeilenhöhe",
    "preview-background": "Dunkler Hintergrund",
    "preview-empty": "Wähle eine Schrift für die Vorschau.",
    "details-title": "Schriftdetails",
    "details-family": "Familie",
    "details-full-name": "Vollständiger Name",
    "details-postscript": "PostScript-Name",
    "details-style": "Stil",
    "css-title": "CSS-Auszug",
    "status-unsupported": "Ihr Browser unterstützt Local Font Access nicht.",
    "status-denied": "Berechtigung verweigert. Erlauben Sie local-fonts, um Schriften zu listen.",
    "status-blocked": "Zugriff durch Berechtigungsrichtlinie oder unsicheren Kontext blockiert.",
    "status-error": "Schriften konnten nicht geladen werden. Versuchen Sie es erneut.",
    "what-title": "Was ist Local Font Access?",
    "what-p1": "Local Font Access ist eine Browser-API, die lokal installierte Schriften auflistet.",
    "what-p2": "Sie funktioniert nur in sicheren Kontexten und unterstützten Browsern und erfordert Nutzerberechtigung (local-fonts).",
    "what-p3": "Die API liefert FontData mit family, fullName, postscriptName und style.",
    "what-b1": "Aufrufe müssen durch eine Nutzeraktion ausgelöst werden.",
    "what-b2": "Permissions Policy kann den Zugriff auf manchen Seiten blockieren.",
    "what-b3": "Dieses Tool bleibt lokal und lädt keine Schriften hoch."
  },
  "it": {
    "library-title": "Libreria di font",
    "library-hint": "Carica e sfoglia i font installati sul tuo dispositivo.",
    "load-button": "Carica font locali",
    "search-placeholder": "Cerca per famiglia, nome o PostScript…",
    "filter-style-all": "Tutti gli stili",
    "filter-style-regular": "Regolare",
    "filter-style-italic": "Corsivo/Obliquo",
    "sort-family": "Famiglia",
    "sort-name": "Nome",
    "sort-style": "Stile",
    "group-label": "Raggruppa per famiglia",
    "font-count": "{count} font",
    "no-results": "Nessun font corrisponde ai filtri.",
    "preview-title": "Anteprima",
    "preview-hint": "Regola il testo di esempio e la tipografia.",
    "preview-placeholder": "Scrivi il testo di esempio…",
    "preview-fallback": "Testo di esempio",
    "preview-size": "Dimensione",
    "preview-line-height": "Interlinea",
    "preview-background": "Sfondo scuro",
    "preview-empty": "Seleziona un font per l'anteprima.",
    "details-title": "Dettagli del font",
    "details-family": "Famiglia",
    "details-full-name": "Nome completo",
    "details-postscript": "Nome PostScript",
    "details-style": "Stile",
    "css-title": "Snippet CSS",
    "status-unsupported": "Il tuo browser non supporta Local Font Access.",
    "status-denied": "Permesso negato. Consenti local-fonts per elencare i font.",
    "status-blocked": "Accesso bloccato da policy o contesto non sicuro.",
    "status-error": "Impossibile caricare i font. Riprova.",
    "what-title": "Che cos'è Local Font Access?",
    "what-p1": "Local Font Access è un'API del browser che elenca i font installati sul dispositivo.",
    "what-p2": "Funziona solo in contesti sicuri e browser supportati, con permesso utente (local-fonts).",
    "what-p3": "L'API restituisce FontData con family, fullName, postscriptName e style.",
    "what-b1": "Le chiamate devono essere avviate da un gesto dell'utente.",
    "what-b2": "Permissions Policy può bloccare l'accesso su alcuni siti.",
    "what-b3": "Questo strumento resta locale e non carica font."
  },
  "ja": {
    "library-title": "フォントライブラリ",
    "library-hint": "端末にインストールされたフォントを読み込んで閲覧します。",
    "load-button": "ローカルフォントを読み込む",
    "search-placeholder": "ファミリー名、名称、PostScript で検索…",
    "filter-style-all": "すべてのスタイル",
    "filter-style-regular": "標準",
    "filter-style-italic": "イタリック/オブリーク",
    "sort-family": "ファミリー",
    "sort-name": "名称",
    "sort-style": "スタイル",
    "group-label": "ファミリーでグループ化",
    "font-count": "{count} フォント",
    "no-results": "条件に一致するフォントがありません。",
    "preview-title": "プレビュー",
    "preview-hint": "サンプル文字とタイポグラフィを調整します。",
    "preview-placeholder": "サンプル文字を入力…",
    "preview-fallback": "サンプル文字",
    "preview-size": "サイズ",
    "preview-line-height": "行の高さ",
    "preview-background": "ダーク背景",
    "preview-empty": "プレビューするフォントを選択してください。",
    "details-title": "フォント詳細",
    "details-family": "ファミリー",
    "details-full-name": "フルネーム",
    "details-postscript": "PostScript 名",
    "details-style": "スタイル",
    "css-title": "CSS スニペット",
    "status-unsupported": "このブラウザーは Local Font Access に対応していません。",
    "status-denied": "権限が拒否されました。local-fonts を許可してください。",
    "status-blocked": "権限ポリシーまたは非安全コンテキストによりブロックされています。",
    "status-error": "フォントを読み込めませんでした。再試行してください。",
    "what-title": "Local Font Access とは？",
    "what-p1": "Local Font Access は端末にインストールされたフォントを列挙するブラウザー API です。",
    "what-p2": "安全なコンテキストと対応ブラウザーでのみ動作し、ユーザー権限（local-fonts）が必要です。",
    "what-p3": "API は family、fullName、postscriptName、style を含む FontData を返します。",
    "what-b1": "呼び出しはユーザー操作で行う必要があります。",
    "what-b2": "Permissions Policy によりブロックされる場合があります。",
    "what-b3": "このツールは端末内で動作し、フォントをアップロードしません。"
  },
  "ko": {
    "library-title": "폰트 라이브러리",
    "library-hint": "기기에 설치된 폰트를 불러와 탐색합니다.",
    "load-button": "로컬 폰트 불러오기",
    "search-placeholder": "패밀리, 이름 또는 PostScript로 검색…",
    "filter-style-all": "모든 스타일",
    "filter-style-regular": "일반",
    "filter-style-italic": "이탤릭/오블리크",
    "sort-family": "패밀리",
    "sort-name": "이름",
    "sort-style": "스타일",
    "group-label": "패밀리별 그룹",
    "font-count": "{count}개 폰트",
    "no-results": "필터에 맞는 폰트가 없습니다.",
    "preview-title": "미리보기",
    "preview-hint": "샘플 텍스트와 타이포 설정을 조정하세요.",
    "preview-placeholder": "샘플 텍스트 입력…",
    "preview-fallback": "샘플 텍스트",
    "preview-size": "크기",
    "preview-line-height": "줄 높이",
    "preview-background": "어두운 배경",
    "preview-empty": "미리볼 폰트를 선택하세요.",
    "details-title": "폰트 상세",
    "details-family": "패밀리",
    "details-full-name": "전체 이름",
    "details-postscript": "PostScript 이름",
    "details-style": "스타일",
    "css-title": "CSS 스니펫",
    "status-unsupported": "이 브라우저는 Local Font Access를 지원하지 않습니다.",
    "status-denied": "권한이 거부되었습니다. local-fonts 권한을 허용하세요.",
    "status-blocked": "권한 정책 또는 비보안 컨텍스트로 인해 차단되었습니다.",
    "status-error": "폰트를 불러올 수 없습니다. 다시 시도하세요.",
    "what-title": "Local Font Access란?",
    "what-p1": "Local Font Access는 기기에 설치된 폰트를 나열하는 브라우저 API입니다.",
    "what-p2": "보안 컨텍스트와 지원 브라우저에서만 동작하며 사용자 권한(local-fonts)이 필요합니다.",
    "what-p3": "API는 family, fullName, postscriptName, style 정보를 가진 FontData를 반환합니다.",
    "what-b1": "호출은 사용자 제스처로 트리거되어야 합니다.",
    "what-b2": "Permissions Policy가 접근을 차단할 수 있습니다.",
    "what-b3": "이 도구는 로컬에서 실행되며 폰트를 업로드하지 않습니다."
  },
  "ru": {
    "library-title": "Библиотека шрифтов",
    "library-hint": "Загрузите и просматривайте шрифты, установленные на устройстве.",
    "load-button": "Загрузить локальные шрифты",
    "search-placeholder": "Поиск по семейству, имени или PostScript…",
    "filter-style-all": "Все стили",
    "filter-style-regular": "Обычный",
    "filter-style-italic": "Курсив/наклон",
    "sort-family": "Семейство",
    "sort-name": "Название",
    "sort-style": "Стиль",
    "group-label": "Группировать по семейству",
    "font-count": "{count} шрифтов",
    "no-results": "Нет шрифтов, соответствующих фильтрам.",
    "preview-title": "Предпросмотр",
    "preview-hint": "Настройте образец текста и типографику.",
    "preview-placeholder": "Введите образец текста…",
    "preview-fallback": "Образец текста",
    "preview-size": "Размер",
    "preview-line-height": "Межстрочный интервал",
    "preview-background": "Тёмный фон",
    "preview-empty": "Выберите шрифт для предпросмотра.",
    "details-title": "Детали шрифта",
    "details-family": "Семейство",
    "details-full-name": "Полное имя",
    "details-postscript": "Имя PostScript",
    "details-style": "Стиль",
    "css-title": "CSS-фрагмент",
    "status-unsupported": "Ваш браузер не поддерживает Local Font Access.",
    "status-denied": "Доступ запрещён. Разрешите local-fonts для списка шрифтов.",
    "status-blocked": "Доступ заблокирован политикой разрешений или небезопасным контекстом.",
    "status-error": "Не удалось загрузить шрифты. Повторите попытку.",
    "what-title": "Что такое Local Font Access?",
    "what-p1": "Local Font Access — это API браузера для перечисления установленных на устройстве шрифтов.",
    "what-p2": "Он работает только в безопасном контексте и поддерживаемых браузерах и требует разрешения (local-fonts).",
    "what-p3": "API возвращает FontData с полями family, fullName, postscriptName и style.",
    "what-b1": "Вызовы должны инициироваться пользовательским действием.",
    "what-b2": "Permissions Policy может блокировать доступ на некоторых сайтах.",
    "what-b3": "Этот инструмент работает локально и не загружает шрифты."
  },
  "pt": {
    "library-title": "Biblioteca de fontes",
    "library-hint": "Carregue e navegue pelas fontes instaladas no seu dispositivo.",
    "load-button": "Carregar fontes locais",
    "search-placeholder": "Pesquisar por família, nome ou PostScript…",
    "filter-style-all": "Todos os estilos",
    "filter-style-regular": "Regular",
    "filter-style-italic": "Itálico/Oblíquo",
    "sort-family": "Família",
    "sort-name": "Nome",
    "sort-style": "Estilo",
    "group-label": "Agrupar por família",
    "font-count": "{count} fontes",
    "no-results": "Nenhuma fonte corresponde aos filtros.",
    "preview-title": "Prévia",
    "preview-hint": "Ajuste o texto de amostra e a tipografia.",
    "preview-placeholder": "Digite o texto de amostra…",
    "preview-fallback": "Texto de amostra",
    "preview-size": "Tamanho",
    "preview-line-height": "Altura da linha",
    "preview-background": "Fundo escuro",
    "preview-empty": "Selecione uma fonte para pré-visualizar.",
    "details-title": "Detalhes da fonte",
    "details-family": "Família",
    "details-full-name": "Nome completo",
    "details-postscript": "Nome PostScript",
    "details-style": "Estilo",
    "css-title": "Trecho CSS",
    "status-unsupported": "Seu navegador não oferece suporte ao Local Font Access.",
    "status-denied": "Permissão negada. Permita local-fonts para listar fontes.",
    "status-blocked": "Acesso bloqueado por política de permissões ou contexto inseguro.",
    "status-error": "Não foi possível carregar as fontes. Tente novamente.",
    "what-title": "O que é Local Font Access?",
    "what-p1": "Local Font Access é uma API do navegador que lista as fontes instaladas no dispositivo.",
    "what-p2": "Funciona apenas em contextos seguros e navegadores compatíveis, com permissão do usuário (local-fonts).",
    "what-p3": "A API retorna FontData com family, fullName, postscriptName e style.",
    "what-b1": "As chamadas devem ser iniciadas por um gesto do usuário.",
    "what-b2": "Permissions Policy pode bloquear o acesso em alguns sites.",
    "what-b3": "Esta ferramenta fica no dispositivo e não envia fontes."
  },
  "ar": {
    "library-title": "مكتبة الخطوط",
    "library-hint": "حمّل وتصفح الخطوط المثبتة على جهازك.",
    "load-button": "تحميل الخطوط المحلية",
    "search-placeholder": "ابحث حسب العائلة أو الاسم أو PostScript…",
    "filter-style-all": "كل الأنماط",
    "filter-style-regular": "عادي",
    "filter-style-italic": "مائل/مائل مائل",
    "sort-family": "العائلة",
    "sort-name": "الاسم",
    "sort-style": "النمط",
    "group-label": "تجميع حسب العائلة",
    "font-count": "{count} خط",
    "no-results": "لا توجد خطوط مطابقة لمرشحاتك.",
    "preview-title": "معاينة",
    "preview-hint": "اضبط نص العينة وإعدادات الطباعة.",
    "preview-placeholder": "اكتب نص العينة…",
    "preview-fallback": "نص العينة",
    "preview-size": "الحجم",
    "preview-line-height": "ارتفاع السطر",
    "preview-background": "خلفية داكنة",
    "preview-empty": "اختر خطًا للمعاينة.",
    "details-title": "تفاصيل الخط",
    "details-family": "العائلة",
    "details-full-name": "الاسم الكامل",
    "details-postscript": "اسم PostScript",
    "details-style": "النمط",
    "css-title": "مقتطف CSS",
    "status-unsupported": "متصفحك لا يدعم Local Font Access.",
    "status-denied": "تم رفض الإذن. اسمح لـ local-fonts لعرض الخطوط.",
    "status-blocked": "تم حظر الوصول بسبب سياسة الأذونات أو سياق غير آمن.",
    "status-error": "تعذر تحميل الخطوط. حاول مرة أخرى.",
    "what-title": "ما هو Local Font Access؟",
    "what-p1": "Local Font Access هي واجهة API للمتصفح تعرض الخطوط المثبتة على جهازك.",
    "what-p2": "تعمل فقط في سياق آمن وعلى المتصفحات المدعومة وتتطلب إذن المستخدم (local-fonts).",
    "what-p3": "تعيد API كائنات FontData تتضمن family وfullName وpostscriptName وstyle.",
    "what-b1": "يجب أن تُستدعى عبر تفاعل المستخدم.",
    "what-b2": "قد تمنعها Permissions Policy في بعض المواقع.",
    "what-b3": "هذه الأداة تعمل محليًا ولا ترفع الخطوط."
  },
  "hi": {
    "library-title": "फ़ॉन्ट लाइब्रेरी",
    "library-hint": "डिवाइस पर इंस्टॉल फ़ॉन्ट्स लोड करें और ब्राउज़ करें।",
    "load-button": "लोकल फ़ॉन्ट्स लोड करें",
    "search-placeholder": "फ़ैमिली, नाम या PostScript से खोजें…",
    "filter-style-all": "सभी स्टाइल",
    "filter-style-regular": "रेगुलर",
    "filter-style-italic": "इटैलिक/ओब्लिक",
    "sort-family": "फ़ैमिली",
    "sort-name": "नाम",
    "sort-style": "स्टाइल",
    "group-label": "फ़ैमिली के अनुसार समूह",
    "font-count": "{count} फ़ॉन्ट",
    "no-results": "आपके फ़िल्टर से कोई फ़ॉन्ट मेल नहीं खाता।",
    "preview-title": "पूर्वावलोकन",
    "preview-hint": "सैंपल टेक्स्ट और टाइपोग्राफी सेटिंग्स समायोजित करें।",
    "preview-placeholder": "सैंपल टेक्स्ट लिखें…",
    "preview-fallback": "सैंपल टेक्स्ट",
    "preview-size": "आकार",
    "preview-line-height": "लाइन हाइट",
    "preview-background": "डार्क बैकग्राउंड",
    "preview-empty": "पूर्वावलोकन के लिए कोई फ़ॉन्ट चुनें।",
    "details-title": "फ़ॉन्ट विवरण",
    "details-family": "फ़ैमिली",
    "details-full-name": "पूरा नाम",
    "details-postscript": "PostScript नाम",
    "details-style": "स्टाइल",
    "css-title": "CSS स्निपेट",
    "status-unsupported": "आपका ब्राउज़र Local Font Access को सपोर्ट नहीं करता।",
    "status-denied": "अनुमति अस्वीकृत। local-fonts की अनुमति दें।",
    "status-blocked": "अनुमति नीति या असुरक्षित संदर्भ से एक्सेस ब्लॉक है।",
    "status-error": "फ़ॉन्ट लोड नहीं हो पाए। फिर से प्रयास करें।",
    "what-title": "Local Font Access क्या है?",
    "what-p1": "Local Font Access एक ब्राउज़र API है जो डिवाइस पर इंस्टॉल फ़ॉन्ट्स सूचीबद्ध करता है।",
    "what-p2": "यह केवल सुरक्षित संदर्भ और समर्थित ब्राउज़रों में काम करता है और उपयोगकर्ता अनुमति (local-fonts) मांगता है।",
    "what-p3": "API FontData लौटाता है जिसमें family, fullName, postscriptName और style होते हैं।",
    "what-b1": "कॉल यूज़र जेस्चर से शुरू होने चाहिए।",
    "what-b2": "Permissions Policy कुछ साइटों पर एक्सेस रोक सकती है।",
    "what-b3": "यह टूल लोकल पर चलता है और फ़ॉन्ट अपलोड नहीं करता।"
  },
  "tr": {
    "library-title": "Yazı tipi kitaplığı",
    "library-hint": "Cihazınıza yüklü yazı tiplerini yükleyip gezin.",
    "load-button": "Yerel yazı tiplerini yükle",
    "search-placeholder": "Aile, ad veya PostScript ile ara…",
    "filter-style-all": "Tüm stiller",
    "filter-style-regular": "Normal",
    "filter-style-italic": "İtalik/Oblik",
    "sort-family": "Aile",
    "sort-name": "Ad",
    "sort-style": "Stil",
    "group-label": "Aileye göre grupla",
    "font-count": "{count} yazı tipi",
    "no-results": "Filtrelere uyan yazı tipi yok.",
    "preview-title": "Önizleme",
    "preview-hint": "Örnek metni ve tipografi ayarlarını düzenleyin.",
    "preview-placeholder": "Örnek metin yazın…",
    "preview-fallback": "Örnek metin",
    "preview-size": "Boyut",
    "preview-line-height": "Satır yüksekliği",
    "preview-background": "Koyu arka plan",
    "preview-empty": "Önizleme için bir yazı tipi seçin.",
    "details-title": "Yazı tipi ayrıntıları",
    "details-family": "Aile",
    "details-full-name": "Tam ad",
    "details-postscript": "PostScript adı",
    "details-style": "Stil",
    "css-title": "CSS parçası",
    "status-unsupported": "Tarayıcınız Local Font Access'i desteklemiyor.",
    "status-denied": "İzin reddedildi. Yazı tiplerini listelemek için local-fonts izni verin.",
    "status-blocked": "Erişim, izin politikası veya güvensiz bağlam nedeniyle engellendi.",
    "status-error": "Yazı tipleri yüklenemedi. Tekrar deneyin.",
    "what-title": "Local Font Access nedir?",
    "what-p1": "Local Font Access, cihazda yüklü yazı tiplerini listeleyen bir tarayıcı API'sidir.",
    "what-p2": "Yalnızca güvenli bağlamlarda ve desteklenen tarayıcılarda çalışır, kullanıcı izni (local-fonts) gerekir.",
    "what-p3": "API, family, fullName, postscriptName ve style bilgilerini içeren FontData döndürür.",
    "what-b1": "Çağrılar kullanıcı etkileşimiyle tetiklenmelidir.",
    "what-b2": "Permissions Policy bazı sitelerde erişimi engelleyebilir.",
    "what-b3": "Bu araç yerelde çalışır ve font yüklemez."
  },
  "nl": {
    "library-title": "Lettertypebibliotheek",
    "library-hint": "Laad en bekijk de lettertypen die op je apparaat zijn geïnstalleerd.",
    "load-button": "Lokale lettertypen laden",
    "search-placeholder": "Zoek op familie, naam of PostScript…",
    "filter-style-all": "Alle stijlen",
    "filter-style-regular": "Normaal",
    "filter-style-italic": "Cursief/Schuin",
    "sort-family": "Familie",
    "sort-name": "Naam",
    "sort-style": "Stijl",
    "group-label": "Groeperen op familie",
    "font-count": "{count} lettertypen",
    "no-results": "Geen lettertypen die aan je filters voldoen.",
    "preview-title": "Voorbeeld",
    "preview-hint": "Pas voorbeeldtekst en typografie aan.",
    "preview-placeholder": "Typ je voorbeeldtekst…",
    "preview-fallback": "Voorbeeldtekst",
    "preview-size": "Grootte",
    "preview-line-height": "Regelhoogte",
    "preview-background": "Donkere achtergrond",
    "preview-empty": "Selecteer een lettertype om te bekijken.",
    "details-title": "Lettertypedetails",
    "details-family": "Familie",
    "details-full-name": "Volledige naam",
    "details-postscript": "PostScript-naam",
    "details-style": "Stijl",
    "css-title": "CSS-fragment",
    "status-unsupported": "Je browser ondersteunt Local Font Access niet.",
    "status-denied": "Toestemming geweigerd. Sta local-fonts toe om lettertypen te tonen.",
    "status-blocked": "Toegang geblokkeerd door permissions policy of onveilige context.",
    "status-error": "Kan lettertypen niet laden. Probeer opnieuw.",
    "what-title": "Wat is Local Font Access?",
    "what-p1": "Local Font Access is een browser-API die lokaal geïnstalleerde lettertypen opsomt.",
    "what-p2": "Werkt alleen in veilige contexten en ondersteunde browsers, met gebruikersrechten (local-fonts).",
    "what-p3": "De API retourneert FontData met family, fullName, postscriptName en style.",
    "what-b1": "Aanroepen moeten door een gebruikersactie worden gestart.",
    "what-b2": "Permissions Policy kan toegang blokkeren op sommige sites.",
    "what-b3": "Deze tool blijft lokaal en uploadt geen lettertypen."
  },
  "sv": {
    "library-title": "Typsnittsbibliotek",
    "library-hint": "Ladda och bläddra bland typsnitt som är installerade på din enhet.",
    "load-button": "Ladda lokala typsnitt",
    "search-placeholder": "Sök efter familj, namn eller PostScript…",
    "filter-style-all": "Alla stilar",
    "filter-style-regular": "Normal",
    "filter-style-italic": "Kursiv/Oblik",
    "sort-family": "Familj",
    "sort-name": "Namn",
    "sort-style": "Stil",
    "group-label": "Gruppera efter familj",
    "font-count": "{count} typsnitt",
    "no-results": "Inga typsnitt matchar dina filter.",
    "preview-title": "Förhandsvisning",
    "preview-hint": "Justera exempeltext och typografiinställningar.",
    "preview-placeholder": "Skriv exempeltext…",
    "preview-fallback": "Exempeltext",
    "preview-size": "Storlek",
    "preview-line-height": "Radavstånd",
    "preview-background": "Mörk bakgrund",
    "preview-empty": "Välj ett typsnitt för förhandsvisning.",
    "details-title": "Typsnittdetaljer",
    "details-family": "Familj",
    "details-full-name": "Fullständigt namn",
    "details-postscript": "PostScript-namn",
    "details-style": "Stil",
    "css-title": "CSS-snutt",
    "status-unsupported": "Din webbläsare stöder inte Local Font Access.",
    "status-denied": "Åtkomst nekad. Tillåt local-fonts för att lista typsnitt.",
    "status-blocked": "Åtkomst blockerad av policy eller osäker kontext.",
    "status-error": "Kunde inte ladda typsnitt. Försök igen.",
    "what-title": "Vad är Local Font Access?",
    "what-p1": "Local Font Access är ett webbläsar-API som listar typsnitt installerade på enheten.",
    "what-p2": "Det fungerar bara i säkra kontexter och stödda webbläsare, och kräver användartillstånd (local-fonts).",
    "what-p3": "API:et returnerar FontData med family, fullName, postscriptName och style.",
    "what-b1": "Anrop måste triggas av en användargest.",
    "what-b2": "Permissions Policy kan blockera åtkomst på vissa webbplatser.",
    "what-b3": "Detta verktyg körs lokalt och laddar inte upp typsnitt."
  },
  "pl": {
    "library-title": "Biblioteka fontów",
    "library-hint": "Wczytaj i przeglądaj fonty zainstalowane na urządzeniu.",
    "load-button": "Wczytaj lokalne fonty",
    "search-placeholder": "Szukaj po rodzinie, nazwie lub PostScript…",
    "filter-style-all": "Wszystkie style",
    "filter-style-regular": "Regular",
    "filter-style-italic": "Kursywa/pochylony",
    "sort-family": "Rodzina",
    "sort-name": "Nazwa",
    "sort-style": "Styl",
    "group-label": "Grupuj wg rodziny",
    "font-count": "{count} fontów",
    "no-results": "Brak fontów pasujących do filtrów.",
    "preview-title": "Podgląd",
    "preview-hint": "Dostosuj tekst próbki i ustawienia typografii.",
    "preview-placeholder": "Wpisz tekst próbki…",
    "preview-fallback": "Tekst próbki",
    "preview-size": "Rozmiar",
    "preview-line-height": "Interlinia",
    "preview-background": "Ciemne tło",
    "preview-empty": "Wybierz font do podglądu.",
    "details-title": "Szczegóły fontu",
    "details-family": "Rodzina",
    "details-full-name": "Pełna nazwa",
    "details-postscript": "Nazwa PostScript",
    "details-style": "Styl",
    "css-title": "Fragment CSS",
    "status-unsupported": "Twoja przeglądarka nie obsługuje Local Font Access.",
    "status-denied": "Odmowa dostępu. Zezwól local-fonts, aby wyświetlać fonty.",
    "status-blocked": "Dostęp zablokowany przez politykę uprawnień lub niezabezpieczony kontekst.",
    "status-error": "Nie udało się wczytać fontów. Spróbuj ponownie.",
    "what-title": "Czym jest Local Font Access?",
    "what-p1": "Local Font Access to API przeglądarki listujące fonty zainstalowane na urządzeniu.",
    "what-p2": "Działa tylko w bezpiecznych kontekstach i obsługiwanych przeglądarkach oraz wymaga zgody użytkownika (local-fonts).",
    "what-p3": "API zwraca FontData z polami family, fullName, postscriptName i style.",
    "what-b1": "Wywołania muszą być inicjowane przez użytkownika.",
    "what-b2": "Permissions Policy może blokować dostęp na niektórych stronach.",
    "what-b3": "To narzędzie działa lokalnie i nie wysyła fontów."
  },
  "vi": {
    "library-title": "Thư viện phông chữ",
    "library-hint": "Tải và duyệt các phông chữ đã cài trên thiết bị.",
    "load-button": "Tải phông chữ cục bộ",
    "search-placeholder": "Tìm theo họ, tên hoặc PostScript…",
    "filter-style-all": "Tất cả kiểu",
    "filter-style-regular": "Thường",
    "filter-style-italic": "Nghiêng/Oblique",
    "sort-family": "Họ",
    "sort-name": "Tên",
    "sort-style": "Kiểu",
    "group-label": "Nhóm theo họ",
    "font-count": "{count} phông chữ",
    "no-results": "Không có phông chữ phù hợp bộ lọc.",
    "preview-title": "Xem trước",
    "preview-hint": "Điều chỉnh văn bản mẫu và thiết lập kiểu chữ.",
    "preview-placeholder": "Nhập văn bản mẫu…",
    "preview-fallback": "Văn bản mẫu",
    "preview-size": "Cỡ chữ",
    "preview-line-height": "Khoảng cách dòng",
    "preview-background": "Nền tối",
    "preview-empty": "Chọn phông chữ để xem trước.",
    "details-title": "Chi tiết phông chữ",
    "details-family": "Họ",
    "details-full-name": "Tên đầy đủ",
    "details-postscript": "Tên PostScript",
    "details-style": "Kiểu",
    "css-title": "Đoạn CSS",
    "status-unsupported": "Trình duyệt của bạn không hỗ trợ Local Font Access.",
    "status-denied": "Đã từ chối quyền. Hãy cho phép local-fonts để liệt kê phông chữ.",
    "status-blocked": "Bị chặn bởi chính sách quyền hoặc ngữ cảnh không an toàn.",
    "status-error": "Không thể tải phông chữ. Hãy thử lại.",
    "what-title": "Local Font Access là gì?",
    "what-p1": "Local Font Access là API trình duyệt liệt kê các phông chữ cài trên thiết bị.",
    "what-p2": "Chỉ hoạt động trong ngữ cảnh an toàn và trình duyệt hỗ trợ, cần quyền người dùng (local-fonts).",
    "what-p3": "API trả về FontData với family, fullName, postscriptName và style.",
    "what-b1": "Lệnh gọi phải được kích hoạt bằng thao tác người dùng.",
    "what-b2": "Permissions Policy có thể chặn truy cập trên một số trang.",
    "what-b3": "Công cụ này chạy cục bộ và không tải phông chữ lên."
  },
  "th": {
    "library-title": "คลังฟอนต์",
    "library-hint": "โหลดและเรียกดูฟอนต์ที่ติดตั้งในอุปกรณ์ของคุณ",
    "load-button": "โหลดฟอนต์ในเครื่อง",
    "search-placeholder": "ค้นหาตามตระกูล ชื่อ หรือ PostScript…",
    "filter-style-all": "ทุกสไตล์",
    "filter-style-regular": "ปกติ",
    "filter-style-italic": "ตัวเอียง/เอียง",
    "sort-family": "ตระกูล",
    "sort-name": "ชื่อ",
    "sort-style": "สไตล์",
    "group-label": "จัดกลุ่มตามตระกูล",
    "font-count": "{count} ฟอนต์",
    "no-results": "ไม่มีฟอนต์ที่ตรงกับตัวกรอง",
    "preview-title": "พรีวิว",
    "preview-hint": "ปรับข้อความตัวอย่างและการตั้งค่าตัวพิมพ์",
    "preview-placeholder": "พิมพ์ข้อความตัวอย่าง…",
    "preview-fallback": "ข้อความตัวอย่าง",
    "preview-size": "ขนาด",
    "preview-line-height": "ระยะบรรทัด",
    "preview-background": "พื้นหลังเข้ม",
    "preview-empty": "เลือกฟอนต์เพื่อพรีวิว",
    "details-title": "รายละเอียดฟอนต์",
    "details-family": "ตระกูล",
    "details-full-name": "ชื่อเต็ม",
    "details-postscript": "ชื่อ PostScript",
    "details-style": "สไตล์",
    "css-title": "ตัวอย่าง CSS",
    "status-unsupported": "เบราว์เซอร์ของคุณไม่รองรับ Local Font Access",
    "status-denied": "ปฏิเสธสิทธิ์ กรุณาอนุญาต local-fonts เพื่อแสดงฟอนต์",
    "status-blocked": "ถูกบล็อกด้วยนโยบายสิทธิ์หรือบริบทไม่ปลอดภัย",
    "status-error": "ไม่สามารถโหลดฟอนต์ได้ ลองอีกครั้ง",
    "what-title": "Local Font Access คืออะไร?",
    "what-p1": "Local Font Access เป็น API ของเบราว์เซอร์ที่แสดงฟอนต์ที่ติดตั้งในอุปกรณ์",
    "what-p2": "ทำงานได้เฉพาะในบริบทที่ปลอดภัยและเบราว์เซอร์ที่รองรับ และต้องมีสิทธิ์ผู้ใช้ (local-fonts)",
    "what-p3": "API จะคืนค่า FontData ที่มี family, fullName, postscriptName และ style",
    "what-b1": "ต้องเรียกผ่านการโต้ตอบของผู้ใช้เท่านั้น",
    "what-b2": "Permissions Policy อาจบล็อกการเข้าถึงในบางเว็บไซต์",
    "what-b3": "เครื่องมือนี้ทำงานในเครื่องและไม่อัปโหลดฟอนต์"
  },
  "id": {
    "library-title": "Pustaka font",
    "library-hint": "Muat dan telusuri font yang terpasang di perangkat Anda.",
    "load-button": "Muat font lokal",
    "search-placeholder": "Cari berdasarkan keluarga, nama, atau PostScript…",
    "filter-style-all": "Semua gaya",
    "filter-style-regular": "Reguler",
    "filter-style-italic": "Miring/Oblique",
    "sort-family": "Keluarga",
    "sort-name": "Nama",
    "sort-style": "Gaya",
    "group-label": "Kelompokkan berdasarkan keluarga",
    "font-count": "{count} font",
    "no-results": "Tidak ada font yang cocok dengan filter.",
    "preview-title": "Pratinjau",
    "preview-hint": "Sesuaikan teks contoh dan pengaturan tipografi.",
    "preview-placeholder": "Ketik teks contoh…",
    "preview-fallback": "Teks contoh",
    "preview-size": "Ukuran",
    "preview-line-height": "Tinggi baris",
    "preview-background": "Latar gelap",
    "preview-empty": "Pilih font untuk pratinjau.",
    "details-title": "Detail font",
    "details-family": "Keluarga",
    "details-full-name": "Nama lengkap",
    "details-postscript": "Nama PostScript",
    "details-style": "Gaya",
    "css-title": "Cuplikan CSS",
    "status-unsupported": "Browser Anda tidak mendukung Local Font Access.",
    "status-denied": "Izin ditolak. Izinkan local-fonts untuk menampilkan font.",
    "status-blocked": "Akses diblokir oleh kebijakan izin atau konteks tidak aman.",
    "status-error": "Tidak dapat memuat font. Coba lagi.",
    "what-title": "Apa itu Local Font Access?",
    "what-p1": "Local Font Access adalah API browser yang menampilkan font terpasang di perangkat.",
    "what-p2": "Hanya bekerja di konteks aman dan browser yang mendukung, serta membutuhkan izin pengguna (local-fonts).",
    "what-p3": "API mengembalikan FontData dengan family, fullName, postscriptName, dan style.",
    "what-b1": "Pemanggilan harus dipicu oleh interaksi pengguna.",
    "what-b2": "Permissions Policy dapat memblokir akses di beberapa situs.",
    "what-b3": "Alat ini berjalan secara lokal dan tidak mengunggah font."
  },
  "he": {
    "library-title": "ספריית גופנים",
    "library-hint": "טען ועיין בגופנים שמותקנים במכשיר שלך.",
    "load-button": "טען גופנים מקומיים",
    "search-placeholder": "חפש לפי משפחה, שם או PostScript…",
    "filter-style-all": "כל הסגנונות",
    "filter-style-regular": "רגיל",
    "filter-style-italic": "נטוי/אלכסוני",
    "sort-family": "משפחה",
    "sort-name": "שם",
    "sort-style": "סגנון",
    "group-label": "קבץ לפי משפחה",
    "font-count": "{count} גופנים",
    "no-results": "אין גופנים שתואמים למסננים.",
    "preview-title": "תצוגה מקדימה",
    "preview-hint": "כוונן את טקסט הדוגמה והטיפוגרפיה.",
    "preview-placeholder": "הקלד טקסט לדוגמה…",
    "preview-fallback": "טקסט לדוגמה",
    "preview-size": "גודל",
    "preview-line-height": "גובה שורה",
    "preview-background": "רקע כהה",
    "preview-empty": "בחר גופן לתצוגה מקדימה.",
    "details-title": "פרטי גופן",
    "details-family": "משפחה",
    "details-full-name": "שם מלא",
    "details-postscript": "שם PostScript",
    "details-style": "סגנון",
    "css-title": "קטע CSS",
    "status-unsupported": "הדפדפן שלך אינו תומך ב-Local Font Access.",
    "status-denied": "ההרשאה נדחתה. אפשר local-fonts להצגת גופנים.",
    "status-blocked": "הגישה נחסמה על ידי מדיניות הרשאות או הקשר לא מאובטח.",
    "status-error": "לא ניתן לטעון גופנים. נסה שוב.",
    "what-title": "מה זה Local Font Access?",
    "what-p1": "Local Font Access הוא API של הדפדפן שמציג גופנים מותקנים במכשיר.",
    "what-p2": "פועל רק בהקשר מאובטח ובדפדפנים נתמכים ודורש הרשאת משתמש (local-fonts).",
    "what-p3": "ה-API מחזיר FontData עם family, fullName, postscriptName ו-style.",
    "what-b1": "יש להפעיל קריאות באמצעות מחווה של המשתמש.",
    "what-b2": "Permissions Policy יכולה לחסום גישה בחלק מהאתרים.",
    "what-b3": "הכלי פועל מקומית ולא מעלה גופנים."
  },
  "ms": {
    "library-title": "Perpustakaan fon",
    "library-hint": "Muat dan semak fon yang dipasang pada peranti anda.",
    "load-button": "Muat fon tempatan",
    "search-placeholder": "Cari mengikut keluarga, nama atau PostScript…",
    "filter-style-all": "Semua gaya",
    "filter-style-regular": "Biasa",
    "filter-style-italic": "Italik/Oblik",
    "sort-family": "Keluarga",
    "sort-name": "Nama",
    "sort-style": "Gaya",
    "group-label": "Kumpulkan mengikut keluarga",
    "font-count": "{count} fon",
    "no-results": "Tiada fon yang sepadan dengan penapis.",
    "preview-title": "Pratonton",
    "preview-hint": "Laraskan teks sampel dan tetapan tipografi.",
    "preview-placeholder": "Taip teks sampel…",
    "preview-fallback": "Teks sampel",
    "preview-size": "Saiz",
    "preview-line-height": "Ketinggian baris",
    "preview-background": "Latar gelap",
    "preview-empty": "Pilih fon untuk pratonton.",
    "details-title": "Butiran fon",
    "details-family": "Keluarga",
    "details-full-name": "Nama penuh",
    "details-postscript": "Nama PostScript",
    "details-style": "Gaya",
    "css-title": "Petikan CSS",
    "status-unsupported": "Pelayar anda tidak menyokong Local Font Access.",
    "status-denied": "Kebenaran ditolak. Benarkan local-fonts untuk senarai fon.",
    "status-blocked": "Akses disekat oleh polisi kebenaran atau konteks tidak selamat.",
    "status-error": "Tidak dapat memuat fon. Cuba lagi.",
    "what-title": "Apakah Local Font Access?",
    "what-p1": "Local Font Access ialah API pelayar untuk menyenaraikan fon yang dipasang pada peranti.",
    "what-p2": "Hanya berfungsi dalam konteks selamat dan pelayar yang disokong, serta memerlukan izin pengguna (local-fonts).",
    "what-p3": "API mengembalikan FontData dengan family, fullName, postscriptName dan style.",
    "what-b1": "Panggilan mesti dicetuskan oleh interaksi pengguna.",
    "what-b2": "Permissions Policy boleh menyekat akses di sesetengah laman.",
    "what-b3": "Alat ini berjalan secara tempatan dan tidak memuat naik fon."
  },
  "no": {
    "library-title": "Fontbibliotek",
    "library-hint": "Last inn og bla gjennom fonter som er installert på enheten.",
    "load-button": "Last inn lokale fonter",
    "search-placeholder": "Søk etter familie, navn eller PostScript…",
    "filter-style-all": "Alle stiler",
    "filter-style-regular": "Normal",
    "filter-style-italic": "Kursiv/Oblik",
    "sort-family": "Familie",
    "sort-name": "Navn",
    "sort-style": "Stil",
    "group-label": "Grupper etter familie",
    "font-count": "{count} fonter",
    "no-results": "Ingen fonter samsvarer med filtrene.",
    "preview-title": "Forhåndsvisning",
    "preview-hint": "Juster eksempeltekst og typografiske innstillinger.",
    "preview-placeholder": "Skriv eksempeltekst…",
    "preview-fallback": "Eksempeltekst",
    "preview-size": "Størrelse",
    "preview-line-height": "Linjehøyde",
    "preview-background": "Mørk bakgrunn",
    "preview-empty": "Velg en font for forhåndsvisning.",
    "details-title": "Fontdetaljer",
    "details-family": "Familie",
    "details-full-name": "Fullt navn",
    "details-postscript": "PostScript-navn",
    "details-style": "Stil",
    "css-title": "CSS-utdrag",
    "status-unsupported": "Nettleseren din støtter ikke Local Font Access.",
    "status-denied": "Tillatelse avslått. Tillat local-fonts for å liste fonter.",
    "status-blocked": "Tilgang blokkert av tillatelsespolicy eller usikker kontekst.",
    "status-error": "Kunne ikke laste fonter. Prøv igjen.",
    "what-title": "Hva er Local Font Access?",
    "what-p1": "Local Font Access er et nettleser-API som lister fonter installert på enheten.",
    "what-p2": "Det fungerer bare i sikre kontekster og støttede nettlesere, og krever bruker­tillatelse (local-fonts).",
    "what-p3": "API-et returnerer FontData med family, fullName, postscriptName og style.",
    "what-b1": "Kall må trigges av en brukerhandling.",
    "what-b2": "Permissions Policy kan blokkere tilgang på enkelte nettsteder.",
    "what-b3": "Dette verktøyet kjører lokalt og laster ikke opp fonter."
  }
}
</i18n>
