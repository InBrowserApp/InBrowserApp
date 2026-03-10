<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-form label-placement="top">
      <n-grid cols="1 s:2" responsive="screen" :x-gap="12">
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
    </n-form>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SelectOption } from 'naive-ui'
import { NForm, NFormItem, NGi, NGrid, NSelect } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
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
  { label: t('pageSizeA4'), value: 'a4' },
  { label: t('pageSizeLetter'), value: 'letter' },
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
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Orientation",
    "orientationAuto": "Auto",
    "orientationPortrait": "Portrait",
    "orientationLandscape": "Landscape"
  },
  "zh": {
    "title": "页面",
    "pageSize": "页面尺寸",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "方向",
    "orientationAuto": "自动",
    "orientationPortrait": "纵向",
    "orientationLandscape": "横向"
  },
  "zh-CN": {
    "title": "页面",
    "pageSize": "页面尺寸",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "方向",
    "orientationAuto": "自动",
    "orientationPortrait": "纵向",
    "orientationLandscape": "横向"
  },
  "zh-TW": {
    "title": "頁面",
    "pageSize": "頁面尺寸",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "方向",
    "orientationAuto": "自動",
    "orientationPortrait": "直向",
    "orientationLandscape": "橫向"
  },
  "zh-HK": {
    "title": "頁面",
    "pageSize": "頁面尺寸",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "方向",
    "orientationAuto": "自動",
    "orientationPortrait": "直向",
    "orientationLandscape": "橫向"
  },
  "es": {
    "title": "Página",
    "pageSize": "Tamaño de página",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Orientación",
    "orientationAuto": "Automático",
    "orientationPortrait": "Vertical",
    "orientationLandscape": "Horizontal"
  },
  "fr": {
    "title": "Page",
    "pageSize": "Taille de page",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Orientation",
    "orientationAuto": "Auto",
    "orientationPortrait": "Portrait",
    "orientationLandscape": "Paysage"
  },
  "de": {
    "title": "Seite",
    "pageSize": "Seitengröße",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Ausrichtung",
    "orientationAuto": "Automatisch",
    "orientationPortrait": "Hochformat",
    "orientationLandscape": "Querformat"
  },
  "it": {
    "title": "Pagina",
    "pageSize": "Dimensione pagina",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Orientamento",
    "orientationAuto": "Automatico",
    "orientationPortrait": "Verticale",
    "orientationLandscape": "Orizzontale"
  },
  "ja": {
    "title": "ページ",
    "pageSize": "ページサイズ",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "向き",
    "orientationAuto": "自動",
    "orientationPortrait": "縦向き",
    "orientationLandscape": "横向き"
  },
  "ko": {
    "title": "페이지",
    "pageSize": "페이지 크기",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "방향",
    "orientationAuto": "자동",
    "orientationPortrait": "세로",
    "orientationLandscape": "가로"
  },
  "ru": {
    "title": "Страница",
    "pageSize": "Размер страницы",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Ориентация",
    "orientationAuto": "Авто",
    "orientationPortrait": "Книжная",
    "orientationLandscape": "Альбомная"
  },
  "pt": {
    "title": "Página",
    "pageSize": "Tamanho da página",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Orientação",
    "orientationAuto": "Automático",
    "orientationPortrait": "Retrato",
    "orientationLandscape": "Paisagem"
  },
  "ar": {
    "title": "الصفحة",
    "pageSize": "حجم الصفحة",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "الاتجاه",
    "orientationAuto": "تلقائي",
    "orientationPortrait": "عمودي",
    "orientationLandscape": "أفقي"
  },
  "hi": {
    "title": "पेज",
    "pageSize": "पेज आकार",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "ओरिएंटेशन",
    "orientationAuto": "स्वचालित",
    "orientationPortrait": "पोर्ट्रेट",
    "orientationLandscape": "लैंडस्केप"
  },
  "tr": {
    "title": "Sayfa",
    "pageSize": "Sayfa boyutu",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Yön",
    "orientationAuto": "Otomatik",
    "orientationPortrait": "Dikey",
    "orientationLandscape": "Yatay"
  },
  "nl": {
    "title": "Pagina",
    "pageSize": "Paginagrootte",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Oriëntatie",
    "orientationAuto": "Automatisch",
    "orientationPortrait": "Staand",
    "orientationLandscape": "Liggend"
  },
  "sv": {
    "title": "Sida",
    "pageSize": "Sidstorlek",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Orientering",
    "orientationAuto": "Automatisk",
    "orientationPortrait": "Stående",
    "orientationLandscape": "Liggande"
  },
  "pl": {
    "title": "Strona",
    "pageSize": "Rozmiar strony",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Orientacja",
    "orientationAuto": "Automatycznie",
    "orientationPortrait": "Pionowa",
    "orientationLandscape": "Pozioma"
  },
  "vi": {
    "title": "Trang",
    "pageSize": "Kích thước trang",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Hướng",
    "orientationAuto": "Tự động",
    "orientationPortrait": "Dọc",
    "orientationLandscape": "Ngang"
  },
  "th": {
    "title": "หน้า",
    "pageSize": "ขนาดหน้า",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "แนวหน้า",
    "orientationAuto": "อัตโนมัติ",
    "orientationPortrait": "แนวตั้ง",
    "orientationLandscape": "แนวนอน"
  },
  "id": {
    "title": "Halaman",
    "pageSize": "Ukuran halaman",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Orientasi",
    "orientationAuto": "Otomatis",
    "orientationPortrait": "Potret",
    "orientationLandscape": "Lanskap"
  },
  "he": {
    "title": "עמוד",
    "pageSize": "גודל עמוד",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "כיוון",
    "orientationAuto": "אוטומטי",
    "orientationPortrait": "לאורך",
    "orientationLandscape": "לרוחב"
  },
  "ms": {
    "title": "Halaman",
    "pageSize": "Saiz halaman",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Orientasi",
    "orientationAuto": "Auto",
    "orientationPortrait": "Potret",
    "orientationLandscape": "Landskap"
  },
  "no": {
    "title": "Side",
    "pageSize": "Sidestørrelse",
    "pageSizeA4": "A4",
    "pageSizeLetter": "Letter",
    "pageOrientation": "Orientering",
    "orientationAuto": "Automatisk",
    "orientationPortrait": "Stående",
    "orientationLandscape": "Liggende"
  }
}
</i18n>
