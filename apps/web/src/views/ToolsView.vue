<template>
  <div class="tools-heading">
    <ToolTitle class="tools-heading-title">{{ t('title') }}</ToolTitle>
    <span v-if="toolsCount !== undefined" class="tools-heading-count">
      {{ t('count', { count: toolsCount }) }}
    </span>
  </div>
  <ToolSection>
    <n-input
      v-model:value="searchQuery"
      clearable
      class="tools-filter-input"
      :aria-label="t('title')"
      :placeholder="t('searchPlaceholder')"
      :loading="searching"
      @focus="warmup"
      @mouseenter="warmup"
      @touchstart="warmup"
      @blur="syncRouteQueryImmediately"
      @keyup.enter="syncRouteQueryImmediately"
    />
    <n-empty v-if="showEmpty" class="tools-empty" :description="t('emptyDescription')" />
    <ToolsGrid v-else :tools="tools" />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { ToolsGrid, ToolTitle, ToolSection } from '@shared/ui/tool'
import { computedAsync } from '@vueuse/core'
import { useToolsSearchWorker } from '../composables/useToolsSearchWorker'
import { createDebouncedFn } from '../composables/createDebouncedFn'
import { NEmpty, NInput } from 'naive-ui'
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const allTools = computedAsync(async () => {
  const { tools } = await import('@registry/tools')
  return tools
}, undefined)

const normalizeQuery = (
  query: LocationQueryValue | LocationQueryValue[] | null | undefined,
): string => {
  if (Array.isArray(query)) {
    return query[0] ?? ''
  }
  return query ?? ''
}

const routeQuery = computed(() => normalizeQuery(route.query.query))
const searchQuery = ref(routeQuery.value)
const hasSearchQuery = computed(() => !!searchQuery.value.trim())

const syncRouteQuery = (value: string): void => {
  if (value === routeQuery.value) {
    return
  }

  const query = { ...route.query }
  if (value) {
    query.query = value
  } else {
    delete query.query
  }
  router.replace({ query })
}

const debouncedSyncRouteQuery = createDebouncedFn(syncRouteQuery, 400)

const syncRouteQueryImmediately = (): void => {
  debouncedSyncRouteQuery.cancel()
  syncRouteQuery(searchQuery.value)
}

const { toolsResults, searching, warmup } = useToolsSearchWorker({
  tools: allTools,
  query: searchQuery,
  lazy: true,
  immediateFirstSearch: true,
})

watch(routeQuery, (value) => {
  if (value !== searchQuery.value) {
    debouncedSyncRouteQuery.cancel()
    searchQuery.value = value
  }
})

watch(
  searchQuery,
  (value) => {
    if (value.trim()) {
      warmup()
    }

    if (value === routeQuery.value) {
      return
    }

    debouncedSyncRouteQuery(value)
  },
  { immediate: true },
)

const tools = computed(() => {
  const sourceTools = allTools.value
  if (sourceTools === undefined) {
    return undefined
  }

  if (!hasSearchQuery.value) {
    return sourceTools
  }

  return toolsResults.value ?? []
})
const toolsCount = computed(() => tools.value?.length)
const showEmpty = computed(
  () => !searching.value && tools.value !== undefined && tools.value.length === 0,
)

onBeforeUnmount(() => {
  debouncedSyncRouteQuery.cancel()
})

useHead({
  title: t('title') + ' - InBrowser.App',
  meta: [{ name: 'description', content: t('description') }],
})
</script>

<i18n lang="json">
{
  "en": {
    "title": "All Tools",
    "description": "Explore and use our collection of powerful tools that run entirely in your browser - no server required. All tools are free, secure, and work offline once loaded.",
    "count": "Total tools: {count}",
    "searchPlaceholder": "Search for tools...",
    "emptyDescription": "No tools found"
  },
  "zh": {
    "title": "所有工具",
    "description": "探索和使用我们强大的工具集合，所有工具完全在浏览器中运行 - 无需服务器。所有工具都是免费的、安全的，加载后即可离线使用。",
    "count": "共 {count} 个工具",
    "searchPlaceholder": "搜索工具...",
    "emptyDescription": "未找到工具"
  },
  "zh-CN": {
    "title": "所有工具",
    "description": "探索和使用我们强大的工具集合，所有工具完全在浏览器中运行 - 无需服务器。所有工具都是免费的、安全的，加载后即可离线使用。",
    "count": "共 {count} 个工具",
    "searchPlaceholder": "搜索工具...",
    "emptyDescription": "未找到工具"
  },
  "zh-TW": {
    "title": "所有工具",
    "description": "探索和使用我們強大的工具集合，所有工具完全在瀏覽器中運行 - 無需伺服器。所有工具都是免費的、安全的，載入後即可離線使用。",
    "count": "共 {count} 個工具",
    "searchPlaceholder": "搜尋工具...",
    "emptyDescription": "找不到工具"
  },
  "zh-HK": {
    "title": "所有工具",
    "description": "探索和使用我們強大的工具集合，所有工具完全在瀏覽器中運行 - 無需伺服器。所有工具都是免費的、安全的，載入後即可離線使用。",
    "count": "共 {count} 個工具",
    "searchPlaceholder": "搜尋工具...",
    "emptyDescription": "找不到工具"
  },
  "es": {
    "title": "Todas las herramientas",
    "description": "Explora y usa nuestra colección de potentes herramientas que se ejecutan completamente en tu navegador - sin necesidad de servidor. Todas las herramientas son gratuitas, seguras y funcionan sin conexión una vez cargadas.",
    "count": "Total de herramientas: {count}",
    "searchPlaceholder": "Buscar herramientas...",
    "emptyDescription": "No se encontraron herramientas"
  },
  "fr": {
    "title": "Tous les outils",
    "description": "Explorez et utilisez notre collection d'outils puissants qui fonctionnent entièrement dans votre navigateur - sans serveur requis. Tous les outils sont gratuits, sécurisés et fonctionnent hors ligne une fois chargés.",
    "count": "Total d'outils : {count}",
    "searchPlaceholder": "Rechercher des outils...",
    "emptyDescription": "Aucun outil trouvé"
  },
  "de": {
    "title": "Alle Werkzeuge",
    "description": "Entdecken und nutzen Sie unsere Sammlung leistungsstarker Tools, die vollständig in Ihrem Browser laufen - ohne Server erforderlich. Alle Tools sind kostenlos, sicher und funktionieren offline, sobald sie geladen sind.",
    "count": "Werkzeuge gesamt: {count}",
    "searchPlaceholder": "Tools suchen...",
    "emptyDescription": "Keine Werkzeuge gefunden"
  },
  "it": {
    "title": "Tutti gli strumenti",
    "description": "Esplora e utilizza la nostra collezione di potenti strumenti che funzionano interamente nel tuo browser - nessun server richiesto. Tutti gli strumenti sono gratuiti, sicuri e funzionano offline una volta caricati.",
    "count": "Totale strumenti: {count}",
    "searchPlaceholder": "Cerca strumenti...",
    "emptyDescription": "Nessuno strumento trovato"
  },
  "ja": {
    "title": "すべてのツール",
    "description": "サーバー不要で、ブラウザ内で完全に動作する強力なツールのコレクションを探索して使用できます。すべてのツールは無料で安全、ロード後はオフラインでも使用可能です。",
    "count": "ツール数: {count}",
    "searchPlaceholder": "ツールを検索...",
    "emptyDescription": "ツールが見つかりません"
  },
  "ko": {
    "title": "모든 도구",
    "description": "서버 없이 브라우저에서 완전히 실행되는 강력한 도구 모음을 탐색하고 사용하세요. 모든 도구는 무료이며 안전하고, 로드 후에는 오프라인에서도 작동합니다.",
    "count": "도구 수: {count}",
    "searchPlaceholder": "도구 검색...",
    "emptyDescription": "도구를 찾을 수 없습니다"
  },
  "ru": {
    "title": "Все инструменты",
    "description": "Исследуйте и используйте нашу коллекцию мощных инструментов, которые работают полностью в вашем браузере - без необходимости сервера. Все инструменты бесплатны, безопасны и работают офлайн после загрузки.",
    "count": "Всего инструментов: {count}",
    "searchPlaceholder": "Поиск инструментов...",
    "emptyDescription": "Инструменты не найдены"
  },
  "pt": {
    "title": "Todas as ferramentas",
    "description": "Explore e use nossa coleção de ferramentas poderosas que funcionam inteiramente no seu navegador - sem necessidade de servidor. Todas as ferramentas são gratuitas, seguras e funcionam offline após o carregamento.",
    "count": "Total de ferramentas: {count}",
    "searchPlaceholder": "Pesquisar ferramentas...",
    "emptyDescription": "Nenhuma ferramenta encontrada"
  },
  "ar": {
    "title": "جميع الأدوات",
    "description": "استكشف واستخدم مجموعتنا من الأدوات القوية التي تعمل بالكامل في متصفحك - بدون الحاجة إلى خادم. جميع الأدوات مجانية وآمنة وتعمل دون اتصال بالإنترنت بمجرد تحميلها.",
    "count": "إجمالي الأدوات: {count}",
    "searchPlaceholder": "البحث عن الأدوات...",
    "emptyDescription": "لم يتم العثور على أدوات"
  },
  "hi": {
    "title": "सभी उपकरण",
    "description": "हमारे शक्तिशाली उपकरणों के संग्रह का अन्वेषण करें जो पूरी तरह से आपके ब्राउज़र में चलते हैं - सर्वर की आवश्यकता नहीं। सभी उपकरण मुफ्त, सुरक्षित हैं और लोड होने के बाद ऑफ़लाइन काम करते हैं।",
    "count": "कुल उपकरण: {count}",
    "searchPlaceholder": "उपकरण खोजें...",
    "emptyDescription": "कोई उपकरण नहीं मिला"
  },
  "tr": {
    "title": "Tüm Araçlar",
    "description": "Tamamen tarayıcınızda çalışan güçlü araçlar koleksiyonumuzu keşfedin ve kullanın - sunucu gerekmez. Tüm araçlar ücretsiz, güvenli ve yüklendikten sonra çevrimdışı çalışır.",
    "count": "Toplam araç: {count}",
    "searchPlaceholder": "Araçları ara...",
    "emptyDescription": "Araç bulunamadı"
  },
  "nl": {
    "title": "Alle tools",
    "description": "Verken en gebruik onze collectie krachtige tools die volledig in uw browser werken - geen server nodig. Alle tools zijn gratis, veilig en werken offline zodra ze zijn geladen.",
    "count": "Totaal aantal tools: {count}",
    "searchPlaceholder": "Zoek naar tools...",
    "emptyDescription": "Geen tools gevonden"
  },
  "sv": {
    "title": "Alla verktyg",
    "description": "Utforska och använd vår samling kraftfulla verktyg som körs helt i din webbläsare - ingen server krävs. Alla verktyg är gratis, säkra och fungerar offline när de har laddats.",
    "count": "Totalt antal verktyg: {count}",
    "searchPlaceholder": "Sök verktyg...",
    "emptyDescription": "Inga verktyg hittades"
  },
  "pl": {
    "title": "Wszystkie narzędzia",
    "description": "Odkryj i korzystaj z naszej kolekcji potężnych narzędzi, które działają w całości w Twojej przeglądarce - bez potrzeby serwera. Wszystkie narzędzia są darmowe, bezpieczne i działają offline po załadowaniu.",
    "count": "Liczba narzędzi: {count}",
    "searchPlaceholder": "Szukaj narzędzi...",
    "emptyDescription": "Nie znaleziono narzędzi"
  },
  "vi": {
    "title": "Tất cả công cụ",
    "description": "Khám phá và sử dụng bộ sưu tập công cụ mạnh mẽ của chúng tôi hoạt động hoàn toàn trong trình duyệt của bạn - không cần máy chủ. Tất cả các công cụ đều miễn phí, an toàn và hoạt động ngoại tuyến sau khi tải.",
    "count": "Tổng số công cụ: {count}",
    "searchPlaceholder": "Tìm kiếm công cụ...",
    "emptyDescription": "Không tìm thấy công cụ"
  },
  "th": {
    "title": "เครื่องมือทั้งหมด",
    "description": "สำรวจและใช้คอลเลกชันเครื่องมืออันทรงพลังของเราที่ทำงานทั้งหมดในเบราว์เซอร์ของคุณ - ไม่ต้องใช้เซิร์ฟเวอร์ เครื่องมือทั้งหมดฟรี ปลอดภัย และทำงานแบบออฟไลน์ได้เมื่อโหลดแล้ว",
    "count": "จำนวนเครื่องมือทั้งหมด: {count}",
    "searchPlaceholder": "ค้นหาเครื่องมือ...",
    "emptyDescription": "ไม่พบเครื่องมือ"
  },
  "id": {
    "title": "Semua Alat",
    "description": "Jelajahi dan gunakan koleksi alat kami yang kuat yang berjalan sepenuhnya di browser Anda - tanpa memerlukan server. Semua alat gratis, aman, dan berfungsi offline setelah dimuat.",
    "count": "Jumlah alat: {count}",
    "searchPlaceholder": "Cari alat...",
    "emptyDescription": "Tidak ada alat yang ditemukan"
  },
  "he": {
    "title": "כל הכלים",
    "description": "גלה והשתמש באוסף הכלים החזקים שלנו הפועלים לחלוטין בדפדפן שלך - ללא צורך בשרת. כל הכלים חינמיים, מאובטחים ופועלים במצב לא מקוון לאחר טעינה.",
    "count": "סהכ כלים: {count}",
    "searchPlaceholder": "חפש כלים...",
    "emptyDescription": "לא נמצאו כלים"
  },
  "ms": {
    "title": "Semua Alat",
    "description": "Terokai dan gunakan koleksi alat berkuasa kami yang berjalan sepenuhnya dalam pelayar anda - tanpa memerlukan pelayan. Semua alat adalah percuma, selamat dan berfungsi secara luar talian selepas dimuatkan.",
    "count": "Jumlah alat: {count}",
    "searchPlaceholder": "Cari alat...",
    "emptyDescription": "Tiada alat ditemui"
  },
  "no": {
    "title": "Alle verktøy",
    "description": "Utforsk og bruk vår samling kraftige verktøy som kjører helt i nettleseren din - ingen server kreves. Alle verktøy er gratis, sikre og fungerer offline når de er lastet.",
    "count": "Antall verktøy: {count}",
    "searchPlaceholder": "Søk etter verktøy...",
    "emptyDescription": "Ingen verktøy funnet"
  }
}
</i18n>

<style scoped>
.tools-heading {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  width: 100%;
  column-gap: 12px;
  row-gap: 6px;
}

.tools-heading-title {
  margin: 0;
}

.tools-heading-count {
  margin-left: auto;
  color: var(--n-text-color-3);
  font-size: 0.875rem;
  white-space: nowrap;
}

.tools-filter-input {
  margin-bottom: 12px;
}

.tools-empty {
  margin-block: 36px;
}
</style>
