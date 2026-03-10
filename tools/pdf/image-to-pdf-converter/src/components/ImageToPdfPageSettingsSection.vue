<template>
  <n-grid :aria-label="t('title')" cols="1 s:2" responsive="screen" :x-gap="12">
    <n-gi>
      <n-form-item :label="t('pageSize')" :show-feedback="false">
        <n-select
          :value="pageSize"
          :options="pageSizeOptions"
          @update:value="emit('update:page-size', $event)"
        />
      </n-form-item>
    </n-gi>

    <n-gi>
      <n-form-item :label="t('pageOrientation')" :show-feedback="false">
        <n-select
          :value="pageOrientation"
          :options="orientationOptions"
          @update:value="emit('update:page-orientation', $event)"
        />
      </n-form-item>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SelectOption } from 'naive-ui'
import { NFormItem, NGi, NGrid, NSelect } from 'naive-ui'
import type { PageOrientation, PageSizePreset } from '../types'

defineProps<{
  pageSize: PageSizePreset
  pageOrientation: PageOrientation
}>()

const emit = defineEmits<{
  (event: 'update:page-size', value: PageSizePreset): void
  (event: 'update:page-orientation', value: PageOrientation): void
}>()

const { t } = useI18n({ useScope: 'local' })

const pageSizeOptions = computed<SelectOption[]>(() => [
  { label: t('pageSizeA3'), value: 'a3' },
  { label: t('pageSizeA4'), value: 'a4' },
  { label: t('pageSizeA5'), value: 'a5' },
  { label: t('pageSizeB5'), value: 'b5' },
  { label: t('pageSizeLetter'), value: 'letter' },
  { label: t('pageSizeLegal'), value: 'legal' },
  { label: t('pageSizeTabloid'), value: 'tabloid' },
])

const orientationOptions = computed<SelectOption[]>(() => [
  { label: t('orientationAuto'), value: 'auto' },
  { label: t('orientationPortrait'), value: 'portrait' },
  { label: t('orientationLandscape'), value: 'landscape' },
])
</script>

<i18n lang="json">
{
  "en": {
    "title": "Page",
    "pageSize": "Page size",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Orientation",
    "orientationAuto": "Auto",
    "orientationPortrait": "Portrait",
    "orientationLandscape": "Landscape"
  },
  "zh": {
    "title": "页面",
    "pageSize": "页面尺寸",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "方向",
    "orientationAuto": "自动",
    "orientationPortrait": "纵向",
    "orientationLandscape": "横向"
  },
  "zh-CN": {
    "title": "页面",
    "pageSize": "页面尺寸",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "方向",
    "orientationAuto": "自动",
    "orientationPortrait": "纵向",
    "orientationLandscape": "横向"
  },
  "zh-TW": {
    "title": "頁面",
    "pageSize": "頁面尺寸",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "方向",
    "orientationAuto": "自動",
    "orientationPortrait": "直向",
    "orientationLandscape": "橫向"
  },
  "zh-HK": {
    "title": "頁面",
    "pageSize": "頁面尺寸",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "方向",
    "orientationAuto": "自動",
    "orientationPortrait": "直向",
    "orientationLandscape": "橫向"
  },
  "es": {
    "title": "Página",
    "pageSize": "Tamaño de página",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Orientación",
    "orientationAuto": "Automático",
    "orientationPortrait": "Vertical",
    "orientationLandscape": "Horizontal"
  },
  "fr": {
    "title": "Page",
    "pageSize": "Taille de page",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Orientation",
    "orientationAuto": "Auto",
    "orientationPortrait": "Portrait",
    "orientationLandscape": "Paysage"
  },
  "de": {
    "title": "Seite",
    "pageSize": "Seitengröße",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Ausrichtung",
    "orientationAuto": "Automatisch",
    "orientationPortrait": "Hochformat",
    "orientationLandscape": "Querformat"
  },
  "it": {
    "title": "Pagina",
    "pageSize": "Dimensione pagina",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Orientamento",
    "orientationAuto": "Automatico",
    "orientationPortrait": "Verticale",
    "orientationLandscape": "Orizzontale"
  },
  "ja": {
    "title": "ページ",
    "pageSize": "ページサイズ",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "向き",
    "orientationAuto": "自動",
    "orientationPortrait": "縦向き",
    "orientationLandscape": "横向き"
  },
  "ko": {
    "title": "페이지",
    "pageSize": "페이지 크기",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "방향",
    "orientationAuto": "자동",
    "orientationPortrait": "세로",
    "orientationLandscape": "가로"
  },
  "ru": {
    "title": "Страница",
    "pageSize": "Размер страницы",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Ориентация",
    "orientationAuto": "Авто",
    "orientationPortrait": "Книжная",
    "orientationLandscape": "Альбомная"
  },
  "pt": {
    "title": "Página",
    "pageSize": "Tamanho da página",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Orientação",
    "orientationAuto": "Automático",
    "orientationPortrait": "Retrato",
    "orientationLandscape": "Paisagem"
  },
  "ar": {
    "title": "الصفحة",
    "pageSize": "حجم الصفحة",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "الاتجاه",
    "orientationAuto": "تلقائي",
    "orientationPortrait": "عمودي",
    "orientationLandscape": "أفقي"
  },
  "hi": {
    "title": "पेज",
    "pageSize": "पेज आकार",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "ओरिएंटेशन",
    "orientationAuto": "स्वचालित",
    "orientationPortrait": "पोर्ट्रेट",
    "orientationLandscape": "लैंडस्केप"
  },
  "tr": {
    "title": "Sayfa",
    "pageSize": "Sayfa boyutu",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Yön",
    "orientationAuto": "Otomatik",
    "orientationPortrait": "Dikey",
    "orientationLandscape": "Yatay"
  },
  "nl": {
    "title": "Pagina",
    "pageSize": "Paginagrootte",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Oriëntatie",
    "orientationAuto": "Automatisch",
    "orientationPortrait": "Staand",
    "orientationLandscape": "Liggend"
  },
  "sv": {
    "title": "Sida",
    "pageSize": "Sidstorlek",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Orientering",
    "orientationAuto": "Automatisk",
    "orientationPortrait": "Stående",
    "orientationLandscape": "Liggande"
  },
  "pl": {
    "title": "Strona",
    "pageSize": "Rozmiar strony",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Orientacja",
    "orientationAuto": "Automatycznie",
    "orientationPortrait": "Pionowa",
    "orientationLandscape": "Pozioma"
  },
  "vi": {
    "title": "Trang",
    "pageSize": "Kích thước trang",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Hướng",
    "orientationAuto": "Tự động",
    "orientationPortrait": "Dọc",
    "orientationLandscape": "Ngang"
  },
  "th": {
    "title": "หน้า",
    "pageSize": "ขนาดหน้า",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "แนวกระดาษ",
    "orientationAuto": "อัตโนมัติ",
    "orientationPortrait": "แนวตั้ง",
    "orientationLandscape": "แนวนอน"
  },
  "id": {
    "title": "Halaman",
    "pageSize": "Ukuran halaman",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Orientasi",
    "orientationAuto": "Otomatis",
    "orientationPortrait": "Potret",
    "orientationLandscape": "Lanskap"
  },
  "he": {
    "title": "עמוד",
    "pageSize": "גודל עמוד",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "כיוון",
    "orientationAuto": "אוטומטי",
    "orientationPortrait": "לאורך",
    "orientationLandscape": "לרוחב"
  },
  "ms": {
    "title": "Halaman",
    "pageSize": "Saiz halaman",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Orientasi",
    "orientationAuto": "Automatik",
    "orientationPortrait": "Potret",
    "orientationLandscape": "Lanskap"
  },
  "no": {
    "title": "Side",
    "pageSize": "Sidestørrelse",
    "pageSizeA3": "A3",
    "pageSizeA4": "A4",
    "pageSizeA5": "A5",
    "pageSizeB5": "B5",
    "pageSizeLetter": "Letter",
    "pageSizeLegal": "Legal",
    "pageSizeTabloid": "Tabloid",
    "pageOrientation": "Retning",
    "orientationAuto": "Automatisk",
    "orientationPortrait": "Portrett",
    "orientationLandscape": "Landskap"
  }
}
</i18n>
