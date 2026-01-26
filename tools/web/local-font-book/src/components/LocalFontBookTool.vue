<template>
  <ToolSectionHeader>{{ t('library-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 l:2" :x-gap="24" :y-gap="24" responsive="screen">
      <n-gi>
        <LocalFontBookLibraryCard
          :title="t('library-title')"
          :is-supported="isSupported"
          :is-loading="isLoading"
          :status-message="statusMessage"
          :status-type="statusType"
          :style-options="styleOptions"
          :sort-options="sortOptions"
          :font-count-label="fontCountLabel"
          :display-groups="displayGroups"
          :active-font-id="activeFontId"
          :font-card-style="fontCardStyle"
          v-model:search-query="searchQuery"
          v-model:filter-style="filterStyle"
          v-model:sort-by="sortBy"
          v-model:group-by-family="groupByFamily"
          @load-fonts="loadFonts"
          @select-font="setActiveFont"
        />
      </n-gi>

      <n-gi>
        <div class="card-stack">
          <LocalFontBookPreviewCard
            :active-font="activeFont"
            :preview-style="previewStyle"
            :css-snippet="cssSnippet"
            v-model:sample-text="sampleText"
            v-model:font-size="fontSize"
            v-model:line-height="lineHeight"
            v-model:dark-background="darkBackground"
          />
          <LocalFontBookDetailsCard :active-font="activeFont" />
        </div>
      </n-gi>
    </n-grid>
  </ToolSection>

  <LocalFontBookWhatIs />
</template>

<script setup lang="ts">
import type { AlertType } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { NGi, NGrid } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import LocalFontBookDetailsCard from './LocalFontBookDetailsCard.vue'
import LocalFontBookLibraryCard from './LocalFontBookLibraryCard.vue'
import LocalFontBookPreviewCard from './LocalFontBookPreviewCard.vue'
import LocalFontBookWhatIs from './LocalFontBookWhatIs.vue'
import type { DisplayFont, FontGroup, LocalFontData } from './types'

type QueryLocalFonts = (options?: { postscriptNames?: string[] }) => Promise<LocalFontData[]>

type LoadErrorType = 'not-allowed' | 'security' | 'unknown' | null

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
const activeFontId = useStorage('tools:local-font-book:active-font', '')

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

const statusType = computed<AlertType>(() => {
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
  return {
    fontFamily: family,
    fontStyle: isItalicStyle(activeFont.value.style) ? 'italic' : 'normal',
    fontSize: `${fontSize.value}px`,
    lineHeight: String(lineHeight.value),
  }
})

const cssSnippet = computed(() => {
  if (!activeFont.value) return ''
  const family = getFontFamily(activeFont.value)
  if (!family) return ''
  const style = isItalicStyle(activeFont.value.style) ? 'italic' : 'normal'
  const lines = [`font-family: ${wrapFontFamily(family)};`]
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

function wrapFontFamily(family: string) {
  const escaped = family.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  return `"${escaped}"`
}
</script>

<style scoped>
.card-stack {
  display: grid;
  gap: 16px;
}
</style>

<i18n lang="json">
{
  "en": {
    "library-title": "Font library",
    "filter-style-all": "All styles",
    "filter-style-regular": "Regular",
    "filter-style-italic": "Italic/Oblique",
    "sort-family": "Family",
    "sort-name": "Name",
    "sort-style": "Style",
    "font-count": "{count} fonts",
    "status-unsupported": "Your browser does not support Local Font Access.",
    "status-denied": "Permission denied. Allow local-fonts to list fonts.",
    "status-blocked": "Access blocked by permissions policy or insecure context.",
    "status-error": "Unable to load fonts. Try again."
  },
  "zh": {
    "library-title": "字体库",
    "filter-style-all": "全部样式",
    "filter-style-regular": "常规",
    "filter-style-italic": "斜体/倾斜",
    "sort-family": "家族",
    "sort-name": "名称",
    "sort-style": "样式",
    "font-count": "{count} 个字体",
    "status-unsupported": "当前浏览器不支持 Local Font Access。",
    "status-denied": "权限被拒绝，请允许 local-fonts 访问。",
    "status-blocked": "被权限策略或非安全上下文阻止。",
    "status-error": "字体加载失败，请重试。"
  },
  "zh-CN": {
    "library-title": "字体库",
    "filter-style-all": "全部样式",
    "filter-style-regular": "常规",
    "filter-style-italic": "斜体/倾斜",
    "sort-family": "家族",
    "sort-name": "名称",
    "sort-style": "样式",
    "font-count": "{count} 个字体",
    "status-unsupported": "当前浏览器不支持 Local Font Access。",
    "status-denied": "权限被拒绝，请允许 local-fonts 访问。",
    "status-blocked": "被权限策略或非安全上下文阻止。",
    "status-error": "字体加载失败，请重试。"
  },
  "zh-TW": {
    "library-title": "字型庫",
    "filter-style-all": "全部樣式",
    "filter-style-regular": "一般",
    "filter-style-italic": "斜體/傾斜",
    "sort-family": "家族",
    "sort-name": "名稱",
    "sort-style": "樣式",
    "font-count": "{count} 個字型",
    "status-unsupported": "目前瀏覽器不支援 Local Font Access。",
    "status-denied": "已拒絕權限，請允許 local-fonts 存取。",
    "status-blocked": "被權限策略或非安全環境阻擋。",
    "status-error": "字型載入失敗，請重試。"
  },
  "zh-HK": {
    "library-title": "字體庫",
    "filter-style-all": "全部樣式",
    "filter-style-regular": "一般",
    "filter-style-italic": "斜體/傾斜",
    "sort-family": "家族",
    "sort-name": "名稱",
    "sort-style": "樣式",
    "font-count": "{count} 款字體",
    "status-unsupported": "目前瀏覽器不支援 Local Font Access。",
    "status-denied": "已拒絕權限，請允許 local-fonts 存取。",
    "status-blocked": "被權限政策或非安全環境阻擋。",
    "status-error": "字體載入失敗，請重試。"
  },
  "es": {
    "library-title": "Biblioteca de fuentes",
    "filter-style-all": "Todos los estilos",
    "filter-style-regular": "Regular",
    "filter-style-italic": "Cursiva/Oblicua",
    "sort-family": "Familia",
    "sort-name": "Nombre",
    "sort-style": "Estilo",
    "font-count": "{count} fuentes",
    "status-unsupported": "Tu navegador no admite Local Font Access.",
    "status-denied": "Permiso denegado. Permite local-fonts para listar fuentes.",
    "status-blocked": "Acceso bloqueado por política de permisos o contexto inseguro.",
    "status-error": "No se pudieron cargar las fuentes. Inténtalo de nuevo."
  },
  "fr": {
    "library-title": "Bibliothèque de polices",
    "filter-style-all": "Tous les styles",
    "filter-style-regular": "Normal",
    "filter-style-italic": "Italique/Oblique",
    "sort-family": "Famille",
    "sort-name": "Nom",
    "sort-style": "Style",
    "font-count": "{count} polices",
    "status-unsupported": "Votre navigateur ne prend pas en charge Local Font Access.",
    "status-denied": "Autorisation refusée. Autorisez local-fonts pour lister les polices.",
    "status-blocked": "Accès bloqué par une politique de permissions ou un contexte non sécurisé.",
    "status-error": "Impossible de charger les polices. Réessayez."
  },
  "de": {
    "library-title": "Schriftbibliothek",
    "filter-style-all": "Alle Stile",
    "filter-style-regular": "Normal",
    "filter-style-italic": "Kursiv/Schräg",
    "sort-family": "Familie",
    "sort-name": "Name",
    "sort-style": "Stil",
    "font-count": "{count} Schriften",
    "status-unsupported": "Ihr Browser unterstützt Local Font Access nicht.",
    "status-denied": "Berechtigung verweigert. Erlauben Sie local-fonts, um Schriften zu listen.",
    "status-blocked": "Zugriff durch Berechtigungsrichtlinie oder unsicheren Kontext blockiert.",
    "status-error": "Schriften konnten nicht geladen werden. Versuchen Sie es erneut."
  },
  "it": {
    "library-title": "Libreria di font",
    "filter-style-all": "Tutti gli stili",
    "filter-style-regular": "Regolare",
    "filter-style-italic": "Corsivo/Obliquo",
    "sort-family": "Famiglia",
    "sort-name": "Nome",
    "sort-style": "Stile",
    "font-count": "{count} font",
    "status-unsupported": "Il tuo browser non supporta Local Font Access.",
    "status-denied": "Permesso negato. Consenti local-fonts per elencare i font.",
    "status-blocked": "Accesso bloccato da policy o contesto non sicuro.",
    "status-error": "Impossibile caricare i font. Riprova."
  },
  "ja": {
    "library-title": "フォントライブラリ",
    "filter-style-all": "すべてのスタイル",
    "filter-style-regular": "標準",
    "filter-style-italic": "イタリック/オブリーク",
    "sort-family": "ファミリー",
    "sort-name": "名称",
    "sort-style": "スタイル",
    "font-count": "{count} フォント",
    "status-unsupported": "このブラウザーは Local Font Access に対応していません。",
    "status-denied": "権限が拒否されました。local-fonts を許可してください。",
    "status-blocked": "権限ポリシーまたは非安全コンテキストによりブロックされています。",
    "status-error": "フォントを読み込めませんでした。再試行してください。"
  },
  "ko": {
    "library-title": "폰트 라이브러리",
    "filter-style-all": "모든 스타일",
    "filter-style-regular": "일반",
    "filter-style-italic": "이탤릭/오블리크",
    "sort-family": "패밀리",
    "sort-name": "이름",
    "sort-style": "스타일",
    "font-count": "{count}개 폰트",
    "status-unsupported": "이 브라우저는 Local Font Access를 지원하지 않습니다.",
    "status-denied": "권한이 거부되었습니다. local-fonts 권한을 허용하세요.",
    "status-blocked": "권한 정책 또는 비보안 컨텍스트로 인해 차단되었습니다.",
    "status-error": "폰트를 불러올 수 없습니다. 다시 시도하세요."
  },
  "ru": {
    "library-title": "Библиотека шрифтов",
    "filter-style-all": "Все стили",
    "filter-style-regular": "Обычный",
    "filter-style-italic": "Курсив/наклон",
    "sort-family": "Семейство",
    "sort-name": "Название",
    "sort-style": "Стиль",
    "font-count": "{count} шрифтов",
    "status-unsupported": "Ваш браузер не поддерживает Local Font Access.",
    "status-denied": "Доступ запрещён. Разрешите local-fonts для списка шрифтов.",
    "status-blocked": "Доступ заблокирован политикой разрешений или небезопасным контекстом.",
    "status-error": "Не удалось загрузить шрифты. Повторите попытку."
  },
  "pt": {
    "library-title": "Biblioteca de fontes",
    "filter-style-all": "Todos os estilos",
    "filter-style-regular": "Regular",
    "filter-style-italic": "Itálico/Oblíquo",
    "sort-family": "Família",
    "sort-name": "Nome",
    "sort-style": "Estilo",
    "font-count": "{count} fontes",
    "status-unsupported": "Seu navegador não oferece suporte ao Local Font Access.",
    "status-denied": "Permissão negada. Permita local-fonts para listar fontes.",
    "status-blocked": "Acesso bloqueado por política de permissões ou contexto inseguro.",
    "status-error": "Não foi possível carregar as fontes. Tente novamente."
  },
  "ar": {
    "library-title": "مكتبة الخطوط",
    "filter-style-all": "كل الأنماط",
    "filter-style-regular": "عادي",
    "filter-style-italic": "مائل/مائل مائل",
    "sort-family": "العائلة",
    "sort-name": "الاسم",
    "sort-style": "النمط",
    "font-count": "{count} خط",
    "status-unsupported": "متصفحك لا يدعم Local Font Access.",
    "status-denied": "تم رفض الإذن. اسمح لـ local-fonts لعرض الخطوط.",
    "status-blocked": "تم حظر الوصول بسبب سياسة الأذونات أو سياق غير آمن.",
    "status-error": "تعذر تحميل الخطوط. حاول مرة أخرى."
  },
  "hi": {
    "library-title": "फ़ॉन्ट लाइब्रेरी",
    "filter-style-all": "सभी स्टाइल",
    "filter-style-regular": "रेगुलर",
    "filter-style-italic": "इटैलिक/ओब्लिक",
    "sort-family": "फ़ैमिली",
    "sort-name": "नाम",
    "sort-style": "स्टाइल",
    "font-count": "{count} फ़ॉन्ट",
    "status-unsupported": "आपका ब्राउज़र Local Font Access को सपोर्ट नहीं करता।",
    "status-denied": "अनुमति अस्वीकृत। local-fonts की अनुमति दें।",
    "status-blocked": "अनुमति नीति या असुरक्षित संदर्भ से एक्सेस ब्लॉक है।",
    "status-error": "फ़ॉन्ट लोड नहीं हो पाए। फिर से प्रयास करें।"
  },
  "tr": {
    "library-title": "Yazı tipi kitaplığı",
    "filter-style-all": "Tüm stiller",
    "filter-style-regular": "Normal",
    "filter-style-italic": "İtalik/Oblik",
    "sort-family": "Aile",
    "sort-name": "Ad",
    "sort-style": "Stil",
    "font-count": "{count} yazı tipi",
    "status-unsupported": "Tarayıcınız Local Font Access'i desteklemiyor.",
    "status-denied": "İzin reddedildi. Yazı tiplerini listelemek için local-fonts izni verin.",
    "status-blocked": "Erişim, izin politikası veya güvensiz bağlam nedeniyle engellendi.",
    "status-error": "Yazı tipleri yüklenemedi. Tekrar deneyin."
  },
  "nl": {
    "library-title": "Lettertypebibliotheek",
    "filter-style-all": "Alle stijlen",
    "filter-style-regular": "Normaal",
    "filter-style-italic": "Cursief/Schuin",
    "sort-family": "Familie",
    "sort-name": "Naam",
    "sort-style": "Stijl",
    "font-count": "{count} lettertypen",
    "status-unsupported": "Je browser ondersteunt Local Font Access niet.",
    "status-denied": "Toestemming geweigerd. Sta local-fonts toe om lettertypen te tonen.",
    "status-blocked": "Toegang geblokkeerd door permissions policy of onveilige context.",
    "status-error": "Kan lettertypen niet laden. Probeer opnieuw."
  },
  "sv": {
    "library-title": "Typsnittsbibliotek",
    "filter-style-all": "Alla stilar",
    "filter-style-regular": "Normal",
    "filter-style-italic": "Kursiv/Oblik",
    "sort-family": "Familj",
    "sort-name": "Namn",
    "sort-style": "Stil",
    "font-count": "{count} typsnitt",
    "status-unsupported": "Din webbläsare stöder inte Local Font Access.",
    "status-denied": "Åtkomst nekad. Tillåt local-fonts för att lista typsnitt.",
    "status-blocked": "Åtkomst blockerad av policy eller osäker kontext.",
    "status-error": "Kunde inte ladda typsnitt. Försök igen."
  },
  "pl": {
    "library-title": "Biblioteka fontów",
    "filter-style-all": "Wszystkie style",
    "filter-style-regular": "Regular",
    "filter-style-italic": "Kursywa/pochylony",
    "sort-family": "Rodzina",
    "sort-name": "Nazwa",
    "sort-style": "Styl",
    "font-count": "{count} fontów",
    "status-unsupported": "Twoja przeglądarka nie obsługuje Local Font Access.",
    "status-denied": "Odmowa dostępu. Zezwól local-fonts, aby wyświetlać fonty.",
    "status-blocked": "Dostęp zablokowany przez politykę uprawnień lub niezabezpieczony kontekst.",
    "status-error": "Nie udało się wczytać fontów. Spróbuj ponownie."
  },
  "vi": {
    "library-title": "Thư viện phông chữ",
    "filter-style-all": "Tất cả kiểu",
    "filter-style-regular": "Thường",
    "filter-style-italic": "Nghiêng/Oblique",
    "sort-family": "Họ",
    "sort-name": "Tên",
    "sort-style": "Kiểu",
    "font-count": "{count} phông chữ",
    "status-unsupported": "Trình duyệt của bạn không hỗ trợ Local Font Access.",
    "status-denied": "Đã từ chối quyền. Hãy cho phép local-fonts để liệt kê phông chữ.",
    "status-blocked": "Bị chặn bởi chính sách quyền hoặc ngữ cảnh không an toàn.",
    "status-error": "Không thể tải phông chữ. Hãy thử lại."
  },
  "th": {
    "library-title": "คลังฟอนต์",
    "filter-style-all": "ทุกสไตล์",
    "filter-style-regular": "ปกติ",
    "filter-style-italic": "ตัวเอียง/เอียง",
    "sort-family": "ตระกูล",
    "sort-name": "ชื่อ",
    "sort-style": "สไตล์",
    "font-count": "{count} ฟอนต์",
    "status-unsupported": "เบราว์เซอร์ของคุณไม่รองรับ Local Font Access",
    "status-denied": "ปฏิเสธสิทธิ์ กรุณาอนุญาต local-fonts เพื่อแสดงฟอนต์",
    "status-blocked": "ถูกบล็อกด้วยนโยบายสิทธิ์หรือบริบทไม่ปลอดภัย",
    "status-error": "ไม่สามารถโหลดฟอนต์ได้ ลองอีกครั้ง"
  },
  "id": {
    "library-title": "Pustaka font",
    "filter-style-all": "Semua gaya",
    "filter-style-regular": "Reguler",
    "filter-style-italic": "Miring/Oblique",
    "sort-family": "Keluarga",
    "sort-name": "Nama",
    "sort-style": "Gaya",
    "font-count": "{count} font",
    "status-unsupported": "Browser Anda tidak mendukung Local Font Access.",
    "status-denied": "Izin ditolak. Izinkan local-fonts untuk menampilkan font.",
    "status-blocked": "Akses diblokir oleh kebijakan izin atau konteks tidak aman.",
    "status-error": "Tidak dapat memuat font. Coba lagi."
  },
  "he": {
    "library-title": "ספריית גופנים",
    "filter-style-all": "כל הסגנונות",
    "filter-style-regular": "רגיל",
    "filter-style-italic": "נטוי/אלכסוני",
    "sort-family": "משפחה",
    "sort-name": "שם",
    "sort-style": "סגנון",
    "font-count": "{count} גופנים",
    "status-unsupported": "הדפדפן שלך אינו תומך ב-Local Font Access.",
    "status-denied": "ההרשאה נדחתה. אפשר local-fonts להצגת גופנים.",
    "status-blocked": "הגישה נחסמה על ידי מדיניות הרשאות או הקשר לא מאובטח.",
    "status-error": "לא ניתן לטעון גופנים. נסה שוב."
  },
  "ms": {
    "library-title": "Perpustakaan fon",
    "filter-style-all": "Semua gaya",
    "filter-style-regular": "Biasa",
    "filter-style-italic": "Italik/Oblik",
    "sort-family": "Keluarga",
    "sort-name": "Nama",
    "sort-style": "Gaya",
    "font-count": "{count} fon",
    "status-unsupported": "Pelayar anda tidak menyokong Local Font Access.",
    "status-denied": "Kebenaran ditolak. Benarkan local-fonts untuk senarai fon.",
    "status-blocked": "Akses disekat oleh polisi kebenaran atau konteks tidak selamat.",
    "status-error": "Tidak dapat memuat fon. Cuba lagi."
  },
  "no": {
    "library-title": "Fontbibliotek",
    "filter-style-all": "Alle stiler",
    "filter-style-regular": "Normal",
    "filter-style-italic": "Kursiv/Oblik",
    "sort-family": "Familie",
    "sort-name": "Navn",
    "sort-style": "Stil",
    "font-count": "{count} fonter",
    "status-unsupported": "Nettleseren din støtter ikke Local Font Access.",
    "status-denied": "Tillatelse avslått. Tillat local-fonts for å liste fonter.",
    "status-blocked": "Tilgang blokkert av tillatelsespolicy eller usikker kontekst.",
    "status-error": "Kunne ikke laste fonter. Prøv igjen."
  }
}
</i18n>
