<template>
  <n-flex vertical :size="6">
    <n-text strong>{{ t('rangeLabel') }}</n-text>
    <n-input
      :value="rangeInput"
      :placeholder="t('rangePlaceholder')"
      clearable
      @update:value="emit('update:range-input', $event)"
    />
  </n-flex>

  <n-flex :size="8" wrap>
    <n-button tertiary @click="emit('select-all')">{{ t('selectAll') }}</n-button>
    <n-button tertiary @click="emit('select-odd')">{{ t('selectOdd') }}</n-button>
    <n-button tertiary @click="emit('select-even')">{{ t('selectEven') }}</n-button>
    <n-button tertiary @click="emit('clear-selection')">{{ t('clear') }}</n-button>
  </n-flex>

  <n-alert type="info" :bordered="false">
    {{ t('selectedSummary', { selectedCount, pageCount }) }}
  </n-alert>

  <n-alert v-if="rangeErrorMessage" type="error" :title="rangeErrorMessage" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NAlert, NButton, NFlex, NInput, NText } from 'naive-ui'

defineProps<{
  pageCount: number
  selectedCount: number
  rangeInput: string
  rangeErrorMessage: string
}>()

const emit = defineEmits<{
  (event: 'update:range-input', value: string): void
  (event: 'select-all'): void
  (event: 'select-odd'): void
  (event: 'select-even'): void
  (event: 'clear-selection'): void
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "rangeLabel": "Page ranges",
    "rangePlaceholder": "Examples: 1-3,5,8-10",
    "selectAll": "All",
    "selectOdd": "Odd",
    "selectEven": "Even",
    "clear": "Clear",
    "selectedSummary": "Selected {selectedCount} / {pageCount} pages."
  },
  "zh": {
    "rangeLabel": "页面范围",
    "rangePlaceholder": "示例：1-3,5,8-10",
    "selectAll": "全部",
    "selectOdd": "奇数页",
    "selectEven": "偶数页",
    "clear": "清空",
    "selectedSummary": "已选择 {selectedCount} / {pageCount} 页。"
  },
  "zh-CN": {
    "rangeLabel": "页面范围",
    "rangePlaceholder": "示例：1-3,5,8-10",
    "selectAll": "全部",
    "selectOdd": "奇数页",
    "selectEven": "偶数页",
    "clear": "清空",
    "selectedSummary": "已选择 {selectedCount} / {pageCount} 页。"
  },
  "zh-TW": {
    "rangeLabel": "頁面範圍",
    "rangePlaceholder": "範例：1-3,5,8-10",
    "selectAll": "全部",
    "selectOdd": "奇數頁",
    "selectEven": "偶數頁",
    "clear": "清除",
    "selectedSummary": "已選擇 {selectedCount} / {pageCount} 頁。"
  },
  "zh-HK": {
    "rangeLabel": "頁面範圍",
    "rangePlaceholder": "範例：1-3,5,8-10",
    "selectAll": "全部",
    "selectOdd": "奇數頁",
    "selectEven": "偶數頁",
    "clear": "清除",
    "selectedSummary": "已選擇 {selectedCount} / {pageCount} 頁。"
  },
  "es": {
    "rangeLabel": "Rangos de páginas",
    "rangePlaceholder": "Ejemplos: 1-3,5,8-10",
    "selectAll": "Todo",
    "selectOdd": "Impares",
    "selectEven": "Pares",
    "clear": "Limpiar",
    "selectedSummary": "Seleccionadas {selectedCount} / {pageCount} páginas."
  },
  "fr": {
    "rangeLabel": "Plages de pages",
    "rangePlaceholder": "Exemples : 1-3,5,8-10",
    "selectAll": "Tout",
    "selectOdd": "Impaires",
    "selectEven": "Paires",
    "clear": "Effacer",
    "selectedSummary": "{selectedCount} / {pageCount} pages sélectionnées."
  },
  "de": {
    "rangeLabel": "Seitenbereiche",
    "rangePlaceholder": "Beispiele: 1-3,5,8-10",
    "selectAll": "Alle",
    "selectOdd": "Ungerade",
    "selectEven": "Gerade",
    "clear": "Löschen",
    "selectedSummary": "{selectedCount} / {pageCount} Seiten ausgewählt."
  },
  "it": {
    "rangeLabel": "Intervalli di pagine",
    "rangePlaceholder": "Esempi: 1-3,5,8-10",
    "selectAll": "Tutte",
    "selectOdd": "Dispari",
    "selectEven": "Pari",
    "clear": "Cancella",
    "selectedSummary": "{selectedCount} / {pageCount} pagine selezionate."
  },
  "ja": {
    "rangeLabel": "ページ範囲",
    "rangePlaceholder": "例: 1-3,5,8-10",
    "selectAll": "すべて",
    "selectOdd": "奇数",
    "selectEven": "偶数",
    "clear": "クリア",
    "selectedSummary": "{selectedCount} / {pageCount} ページを選択中。"
  },
  "ko": {
    "rangeLabel": "페이지 범위",
    "rangePlaceholder": "예: 1-3,5,8-10",
    "selectAll": "전체",
    "selectOdd": "홀수",
    "selectEven": "짝수",
    "clear": "지우기",
    "selectedSummary": "{selectedCount} / {pageCount}페이지 선택됨."
  },
  "ru": {
    "rangeLabel": "Диапазоны страниц",
    "rangePlaceholder": "Примеры: 1-3,5,8-10",
    "selectAll": "Все",
    "selectOdd": "Нечетные",
    "selectEven": "Четные",
    "clear": "Очистить",
    "selectedSummary": "Выбрано страниц: {selectedCount} / {pageCount}."
  },
  "pt": {
    "rangeLabel": "Intervalos de páginas",
    "rangePlaceholder": "Exemplos: 1-3,5,8-10",
    "selectAll": "Todas",
    "selectOdd": "Ímpares",
    "selectEven": "Pares",
    "clear": "Limpar",
    "selectedSummary": "Selecionadas {selectedCount} / {pageCount} páginas."
  },
  "ar": {
    "rangeLabel": "نطاق الصفحات",
    "rangePlaceholder": "أمثلة: 1-3,5,8-10",
    "selectAll": "الكل",
    "selectOdd": "فردي",
    "selectEven": "زوجي",
    "clear": "مسح",
    "selectedSummary": "تم تحديد {selectedCount} / {pageCount} صفحة."
  },
  "hi": {
    "rangeLabel": "पेज रेंज",
    "rangePlaceholder": "उदाहरण: 1-3,5,8-10",
    "selectAll": "सभी",
    "selectOdd": "विषम",
    "selectEven": "सम",
    "clear": "साफ़ करें",
    "selectedSummary": "{selectedCount} / {pageCount} पेज चुने गए।"
  },
  "tr": {
    "rangeLabel": "Sayfa aralıkları",
    "rangePlaceholder": "Örnekler: 1-3,5,8-10",
    "selectAll": "Tümü",
    "selectOdd": "Tek",
    "selectEven": "Çift",
    "clear": "Temizle",
    "selectedSummary": "{selectedCount} / {pageCount} sayfa seçildi."
  },
  "nl": {
    "rangeLabel": "Paginabereiken",
    "rangePlaceholder": "Voorbeelden: 1-3,5,8-10",
    "selectAll": "Alles",
    "selectOdd": "Oneven",
    "selectEven": "Even",
    "clear": "Wissen",
    "selectedSummary": "{selectedCount} / {pageCount} pagina's geselecteerd."
  },
  "sv": {
    "rangeLabel": "Sidintervall",
    "rangePlaceholder": "Exempel: 1-3,5,8-10",
    "selectAll": "Alla",
    "selectOdd": "Udda",
    "selectEven": "Jämna",
    "clear": "Rensa",
    "selectedSummary": "{selectedCount} / {pageCount} sidor valda."
  },
  "pl": {
    "rangeLabel": "Zakresy stron",
    "rangePlaceholder": "Przykłady: 1-3,5,8-10",
    "selectAll": "Wszystkie",
    "selectOdd": "Nieparzyste",
    "selectEven": "Parzyste",
    "clear": "Wyczyść",
    "selectedSummary": "Wybrano {selectedCount} / {pageCount} stron."
  },
  "vi": {
    "rangeLabel": "Dải trang",
    "rangePlaceholder": "Ví dụ: 1-3,5,8-10",
    "selectAll": "Tất cả",
    "selectOdd": "Lẻ",
    "selectEven": "Chẵn",
    "clear": "Xóa",
    "selectedSummary": "Đã chọn {selectedCount} / {pageCount} trang."
  },
  "th": {
    "rangeLabel": "ช่วงหน้า",
    "rangePlaceholder": "ตัวอย่าง: 1-3,5,8-10",
    "selectAll": "ทั้งหมด",
    "selectOdd": "เลขคี่",
    "selectEven": "เลขคู่",
    "clear": "ล้าง",
    "selectedSummary": "เลือกแล้ว {selectedCount} / {pageCount} หน้า"
  },
  "id": {
    "rangeLabel": "Rentang halaman",
    "rangePlaceholder": "Contoh: 1-3,5,8-10",
    "selectAll": "Semua",
    "selectOdd": "Ganjil",
    "selectEven": "Genap",
    "clear": "Hapus",
    "selectedSummary": "Dipilih {selectedCount} / {pageCount} halaman."
  },
  "he": {
    "rangeLabel": "טווחי עמודים",
    "rangePlaceholder": "דוגמאות: 1-3,5,8-10",
    "selectAll": "הכול",
    "selectOdd": "אי-זוגיים",
    "selectEven": "זוגיים",
    "clear": "נקה",
    "selectedSummary": "נבחרו {selectedCount} / {pageCount} עמודים."
  },
  "ms": {
    "rangeLabel": "Julat halaman",
    "rangePlaceholder": "Contoh: 1-3,5,8-10",
    "selectAll": "Semua",
    "selectOdd": "Ganjil",
    "selectEven": "Genap",
    "clear": "Kosongkan",
    "selectedSummary": "{selectedCount} / {pageCount} halaman dipilih."
  },
  "no": {
    "rangeLabel": "Sideintervaller",
    "rangePlaceholder": "Eksempler: 1-3,5,8-10",
    "selectAll": "Alle",
    "selectOdd": "Oddetall",
    "selectEven": "Partall",
    "clear": "Tøm",
    "selectedSummary": "Valgt {selectedCount} / {pageCount} sider."
  }
}
</i18n>
