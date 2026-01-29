import { computed, onMounted, ref, type Ref } from 'vue'
import { useStorage } from '@vueuse/core'
import type { AlertStatusType, DisplayFont, FontGroup, LocalFontData } from '../components/types'

type LocalFontBookLabels = {
  libraryTitle: string
  filterStyleAll: string
  filterStyleRegular: string
  filterStyleItalic: string
  sortFamily: string
  sortName: string
  sortStyle: string
  formatFontCount: (count: number) => string
  statusUnsupported: string
  statusDenied: string
  statusBlocked: string
  statusError: string
}

type QueryLocalFonts = (options?: { postscriptNames?: string[] }) => Promise<LocalFontData[]>

type LoadErrorType = 'not-allowed' | 'security' | 'unknown' | null

export function useLocalFontBook(labels: Ref<LocalFontBookLabels>) {
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
  const previewFontSize = 36
  const previewLineHeight = 1.4
  const darkBackground = useStorage('tools:local-font-book:dark-preview', false)
  const activeFontId = useStorage('tools:local-font-book:active-font', '')

  const isSupported = computed(() => typeof window !== 'undefined' && 'queryLocalFonts' in window)

  const styleOptions = computed(() => [
    { label: labels.value.filterStyleAll, value: 'all' },
    { label: labels.value.filterStyleRegular, value: 'regular' },
    { label: labels.value.filterStyleItalic, value: 'italic' },
  ])

  const sortOptions = computed(() => [
    { label: labels.value.sortFamily, value: 'family' },
    { label: labels.value.sortName, value: 'name' },
    { label: labels.value.sortStyle, value: 'style' },
  ])

  const normalizedFonts = computed<DisplayFont[]>(() =>
    fonts.value.map((font, index) => normalizeFont(font, index)),
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
          return toSortableText(a.displayName).localeCompare(toSortableText(b.displayName))
        case 'style':
          return toSortableText(a.displayStyle).localeCompare(toSortableText(b.displayStyle))
        case 'family':
        default:
          return toSortableText(a.displayFamily).localeCompare(toSortableText(b.displayFamily))
      }
    })

    return sorted
  })

  const displayGroups = computed<FontGroup[]>(() => {
    if (!groupByFamily.value) {
      if (!filteredFonts.value.length) {
        return []
      }
      return [
        {
          id: 'all-fonts',
          label: '',
          items: filteredFonts.value,
        },
      ]
    }

    const groups = new Map<string, DisplayFont[]>()
    for (const font of filteredFonts.value) {
      const family = font.displayFamily
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
    normalizedFonts.value.find((font) => font.id === activeFontId.value),
  )

  const fontCountLabel = computed(() => {
    if (!fonts.value.length) return ''
    return labels.value.formatFontCount(fonts.value.length)
  })

  const statusMessage = computed(() => {
    if (!isSupported.value) return labels.value.statusUnsupported
    if (loadError.value === 'security') return labels.value.statusBlocked
    if (loadError.value === 'not-allowed' || permissionState.value === 'denied') {
      return labels.value.statusDenied
    }
    if (loadError.value === 'unknown') return labels.value.statusError
    return ''
  })

  const statusType = computed<AlertStatusType>(() => {
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
    const family = getFontFamily(activeFont.value)
    if (!family) return {}
    const weight = getFontWeight(activeFont.value.style)
    return {
      fontFamily: wrapFontFamily(family),
      fontStyle: isItalicStyle(activeFont.value.style) ? 'italic' : 'normal',
      ...(weight && weight !== 400 ? { fontWeight: weight } : {}),
      fontSize: `${previewFontSize}px`,
      lineHeight: String(previewLineHeight),
    }
  })

  const cssSnippet = computed(() => {
    if (!activeFont.value) return ''
    const family = getFontFamily(activeFont.value)
    if (!family) return ''
    const style = isItalicStyle(activeFont.value.style) ? 'italic' : 'normal'
    const weight = getFontWeight(activeFont.value.style)
    const lines = [`font-family: ${wrapFontFamily(family)};`]
    if (style !== 'normal') lines.push(`font-style: ${style};`)
    if (weight && weight !== 400) lines.push(`font-weight: ${weight};`)
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

    const queryLocalFonts = (window as Window & { queryLocalFonts?: QueryLocalFonts })
      .queryLocalFonts
    if (!queryLocalFonts) {
      loadError.value = 'security'
      return
    }

    isLoading.value = true
    try {
      const availableFonts = await queryLocalFonts()
      fonts.value = availableFonts
      const normalized = normalizedFonts.value
      if (!normalized.find((font) => font.id === activeFontId.value)) {
        activeFontId.value = normalized[0]?.id ?? ''
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

  function setActiveFont(fontId: string) {
    activeFontId.value = fontId
  }

  function normalizeFont(font: LocalFontData, index: number): DisplayFont {
    const family = toText(font.family)
    const fullName = toText(font.fullName)
    const postscriptName = toText(font.postscriptName)
    const style = toText(font.style)
    const displayName = fullName || family || postscriptName || '--'
    const displayFamily = family || fullName || postscriptName || '--'
    const displayStyle = style || '--'
    const id = postscriptName || buildFallbackId([fullName, family, style], index)
    const searchKey = `${displayFamily} ${displayName} ${postscriptName}`.toLowerCase()
    return {
      family,
      fullName,
      postscriptName,
      style,
      id,
      displayName,
      displayFamily,
      displayStyle,
      searchKey,
    }
  }

  function buildFallbackId(parts: string[], index: number) {
    const base = parts.filter(Boolean).join('|')
    return base ? `${base}-${index}` : `font-${index}`
  }

  function getFontFamily(font: DisplayFont) {
    return font.family || font.fullName || font.postscriptName
  }

  function fontCardStyle(font: DisplayFont) {
    const family = getFontFamily(font)
    if (!family) return {}
    return { fontFamily: wrapFontFamily(family) }
  }

  function toText(value: unknown) {
    return typeof value === 'string' ? value.trim() : ''
  }

  function toSortableText(value: unknown) {
    return toText(value)
  }

  function isItalicStyle(style: string) {
    return /italic|oblique/i.test(style)
  }

  function getFontWeight(style: string) {
    const normalized = style.toLowerCase()
    const numericMatch = normalized.match(/(^|\D)([1-9]00)(\D|$)/)
    if (numericMatch) return Number(numericMatch[2])
    if (/(^|\b)(thin|hairline)\b/.test(normalized)) return 100
    if (/(extra[-\s]?light|ultra[-\s]?light)/.test(normalized)) return 200
    if (/\blight\b/.test(normalized)) return 300
    if (/\bbook\b/.test(normalized)) return 350
    if (/(^|\b)(regular|normal|roman)\b/.test(normalized)) return 400
    if (/\bmedium\b/.test(normalized)) return 500
    if (/(semi[-\s]?bold|demi[-\s]?bold)/.test(normalized)) return 600
    if (/(extra[-\s]?bold|ultra[-\s]?bold)/.test(normalized)) return 800
    if (/\bbold\b/.test(normalized)) return 700
    if (/(extra[-\s]?black|ultra[-\s]?black)/.test(normalized)) return 950
    if (/(^|\b)(black|heavy)\b/.test(normalized)) return 900
    return null
  }

  function wrapFontFamily(family: string) {
    const escaped = family.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    return `"${escaped}"`
  }

  return {
    isSupported,
    isLoading,
    permissionState,
    statusMessage,
    statusType,
    styleOptions,
    sortOptions,
    fontCountLabel,
    displayGroups,
    normalizedFonts,
    activeFont,
    previewStyle,
    cssSnippet,
    searchQuery,
    filterStyle,
    sortBy,
    groupByFamily,
    sampleText,
    darkBackground,
    activeFontId,
    fontCardStyle,
    loadFonts,
    setActiveFont,
  }
}
