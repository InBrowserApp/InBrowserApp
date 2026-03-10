<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-form label-placement="top">
      <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="8">
        <n-gi>
          <n-form-item :label="t('fitMode')" :show-feedback="false">
            <n-select
              :value="fitMode"
              :options="fitModeOptions"
              @update:value="emit('update:fit-mode', $event)"
            />
          </n-form-item>
        </n-gi>

        <n-gi>
          <n-form-item :label="t('quality')" :show-feedback="false">
            <n-select
              :value="qualityPreset"
              :options="qualityOptions"
              @update:value="emit('update:quality-preset', $event)"
            />
          </n-form-item>
        </n-gi>

        <n-form-item-gi :label="t('margin')" :show-feedback="false" :span="2">
          <n-input-number
            :value="marginMm"
            :min="0"
            :max="40"
            :step="1"
            style="width: 100%"
            @update:value="handleMarginUpdate"
          >
            <template #suffix>{{ t('millimeterUnit') }}</template>
          </n-input-number>
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SelectOption } from 'naive-ui'
import { NForm, NFormItem, NFormItemGi, NGi, NGrid, NInputNumber, NSelect } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { FitMode, QualityPreset } from '../types'

defineProps<{
  fitMode: FitMode
  qualityPreset: QualityPreset
  marginMm: number
}>()

const emit = defineEmits<{
  (event: 'update:fit-mode', value: FitMode): void
  (event: 'update:quality-preset', value: QualityPreset): void
  (event: 'update:margin-mm', value: number): void
}>()

const { t } = useI18n({ useScope: 'local' })

const fitModeOptions = computed<SelectOption[]>(() => [
  { label: t('fitContain'), value: 'contain' },
  { label: t('fitCover'), value: 'cover' },
])

const qualityOptions = computed<SelectOption[]>(() => [
  { label: t('qualityBest'), value: 'best' },
  { label: t('qualityBalanced'), value: 'balanced' },
  { label: t('qualitySmall'), value: 'small' },
])

function handleMarginUpdate(value: number | null) {
  emit('update:margin-mm', Math.max(0, Number(value ?? 0)))
}
</script>

<i18n lang="json">
{
  "en": {
    "title": "Layout",
    "fitMode": "Fit mode",
    "fitContain": "Fit entire image",
    "fitCover": "Fill page",
    "quality": "Compression",
    "qualityBest": "Best quality",
    "qualityBalanced": "Balanced",
    "qualitySmall": "Small file",
    "margin": "Margin",
    "millimeterUnit": "mm"
  },
  "zh": {
    "title": "布局",
    "fitMode": "适配方式",
    "fitContain": "完整显示图片",
    "fitCover": "铺满页面",
    "quality": "压缩",
    "qualityBest": "最佳质量",
    "qualityBalanced": "平衡",
    "qualitySmall": "小文件",
    "margin": "边距",
    "millimeterUnit": "毫米"
  },
  "zh-CN": {
    "title": "布局",
    "fitMode": "适配方式",
    "fitContain": "完整显示图片",
    "fitCover": "铺满页面",
    "quality": "压缩",
    "qualityBest": "最佳质量",
    "qualityBalanced": "平衡",
    "qualitySmall": "小文件",
    "margin": "边距",
    "millimeterUnit": "毫米"
  },
  "zh-TW": {
    "title": "版面",
    "fitMode": "適配方式",
    "fitContain": "完整顯示圖片",
    "fitCover": "鋪滿頁面",
    "quality": "壓縮",
    "qualityBest": "最佳品質",
    "qualityBalanced": "平衡",
    "qualitySmall": "小檔案",
    "margin": "邊距",
    "millimeterUnit": "毫米"
  },
  "zh-HK": {
    "title": "版面",
    "fitMode": "適配方式",
    "fitContain": "完整顯示圖片",
    "fitCover": "鋪滿頁面",
    "quality": "壓縮",
    "qualityBest": "最佳品質",
    "qualityBalanced": "平衡",
    "qualitySmall": "小檔案",
    "margin": "邊距",
    "millimeterUnit": "毫米"
  },
  "es": {
    "title": "Diseño",
    "fitMode": "Ajuste",
    "fitContain": "Mostrar imagen completa",
    "fitCover": "Llenar página",
    "quality": "Compresión",
    "qualityBest": "Mejor calidad",
    "qualityBalanced": "Equilibrado",
    "qualitySmall": "Archivo pequeño",
    "margin": "Margen",
    "millimeterUnit": "mm"
  },
  "fr": {
    "title": "Mise en page",
    "fitMode": "Mode d’ajustement",
    "fitContain": "Afficher l’image entière",
    "fitCover": "Remplir la page",
    "quality": "Compression",
    "qualityBest": "Qualité maximale",
    "qualityBalanced": "Équilibré",
    "qualitySmall": "Fichier léger",
    "margin": "Marge",
    "millimeterUnit": "mm"
  },
  "de": {
    "title": "Layout",
    "fitMode": "Anpassung",
    "fitContain": "Ganzes Bild einpassen",
    "fitCover": "Seite füllen",
    "quality": "Komprimierung",
    "qualityBest": "Beste Qualität",
    "qualityBalanced": "Ausgewogen",
    "qualitySmall": "Kleine Datei",
    "margin": "Rand",
    "millimeterUnit": "mm"
  },
  "it": {
    "title": "Layout",
    "fitMode": "Adattamento",
    "fitContain": "Mostra tutta l’immagine",
    "fitCover": "Riempi pagina",
    "quality": "Compressione",
    "qualityBest": "Qualità migliore",
    "qualityBalanced": "Bilanciato",
    "qualitySmall": "File piccolo",
    "margin": "Margine",
    "millimeterUnit": "mm"
  },
  "ja": {
    "title": "レイアウト",
    "fitMode": "配置方法",
    "fitContain": "画像全体を収める",
    "fitCover": "ページいっぱいにする",
    "quality": "圧縮",
    "qualityBest": "高画質",
    "qualityBalanced": "バランス",
    "qualitySmall": "小さいファイル",
    "margin": "余白",
    "millimeterUnit": "mm"
  },
  "ko": {
    "title": "레이아웃",
    "fitMode": "맞춤 방식",
    "fitContain": "이미지 전체 표시",
    "fitCover": "페이지 채우기",
    "quality": "압축",
    "qualityBest": "최고 품질",
    "qualityBalanced": "균형",
    "qualitySmall": "작은 파일",
    "margin": "여백",
    "millimeterUnit": "mm"
  },
  "ru": {
    "title": "Макет",
    "fitMode": "Режим размещения",
    "fitContain": "Показать изображение целиком",
    "fitCover": "Заполнить страницу",
    "quality": "Сжатие",
    "qualityBest": "Лучшее качество",
    "qualityBalanced": "Сбалансировано",
    "qualitySmall": "Маленький файл",
    "margin": "Поле",
    "millimeterUnit": "мм"
  },
  "pt": {
    "title": "Layout",
    "fitMode": "Ajuste",
    "fitContain": "Mostrar a imagem inteira",
    "fitCover": "Preencher a página",
    "quality": "Compressão",
    "qualityBest": "Melhor qualidade",
    "qualityBalanced": "Equilibrado",
    "qualitySmall": "Arquivo pequeno",
    "margin": "Margem",
    "millimeterUnit": "mm"
  },
  "ar": {
    "title": "التخطيط",
    "fitMode": "وضع الملاءمة",
    "fitContain": "إظهار الصورة كاملة",
    "fitCover": "ملء الصفحة",
    "quality": "الضغط",
    "qualityBest": "أفضل جودة",
    "qualityBalanced": "متوازن",
    "qualitySmall": "ملف صغير",
    "margin": "الهامش",
    "millimeterUnit": "مم"
  },
  "hi": {
    "title": "लेआउट",
    "fitMode": "फिट मोड",
    "fitContain": "पूरी इमेज दिखाएँ",
    "fitCover": "पेज भरें",
    "quality": "संपीड़न",
    "qualityBest": "सर्वोत्तम गुणवत्ता",
    "qualityBalanced": "संतुलित",
    "qualitySmall": "छोटी फ़ाइल",
    "margin": "मार्जिन",
    "millimeterUnit": "मिमी"
  },
  "tr": {
    "title": "Yerleşim",
    "fitMode": "Sığdırma modu",
    "fitContain": "Görselin tamamını sığdır",
    "fitCover": "Sayfayı doldur",
    "quality": "Sıkıştırma",
    "qualityBest": "En iyi kalite",
    "qualityBalanced": "Dengeli",
    "qualitySmall": "Küçük dosya",
    "margin": "Kenar boşluğu",
    "millimeterUnit": "mm"
  },
  "nl": {
    "title": "Lay-out",
    "fitMode": "Passende modus",
    "fitContain": "Hele afbeelding tonen",
    "fitCover": "Pagina vullen",
    "quality": "Compressie",
    "qualityBest": "Beste kwaliteit",
    "qualityBalanced": "Gebalanceerd",
    "qualitySmall": "Klein bestand",
    "margin": "Marge",
    "millimeterUnit": "mm"
  },
  "sv": {
    "title": "Layout",
    "fitMode": "Anpassning",
    "fitContain": "Visa hela bilden",
    "fitCover": "Fyll sidan",
    "quality": "Komprimering",
    "qualityBest": "Bästa kvalitet",
    "qualityBalanced": "Balanserad",
    "qualitySmall": "Liten fil",
    "margin": "Marginal",
    "millimeterUnit": "mm"
  },
  "pl": {
    "title": "Układ",
    "fitMode": "Tryb dopasowania",
    "fitContain": "Pokaż cały obraz",
    "fitCover": "Wypełnij stronę",
    "quality": "Kompresja",
    "qualityBest": "Najlepsza jakość",
    "qualityBalanced": "Zrównoważona",
    "qualitySmall": "Mały plik",
    "margin": "Margines",
    "millimeterUnit": "mm"
  },
  "vi": {
    "title": "Bố cục",
    "fitMode": "Chế độ vừa trang",
    "fitContain": "Hiển thị toàn bộ ảnh",
    "fitCover": "Lấp đầy trang",
    "quality": "Nén",
    "qualityBest": "Chất lượng cao nhất",
    "qualityBalanced": "Cân bằng",
    "qualitySmall": "Tệp nhỏ",
    "margin": "Lề",
    "millimeterUnit": "mm"
  },
  "th": {
    "title": "เลย์เอาต์",
    "fitMode": "โหมดจัดวาง",
    "fitContain": "แสดงภาพเต็ม",
    "fitCover": "เติมเต็มหน้า",
    "quality": "การบีบอัด",
    "qualityBest": "คุณภาพดีที่สุด",
    "qualityBalanced": "สมดุล",
    "qualitySmall": "ไฟล์เล็ก",
    "margin": "ระยะขอบ",
    "millimeterUnit": "มม."
  },
  "id": {
    "title": "Tata letak",
    "fitMode": "Mode penyesuaian",
    "fitContain": "Tampilkan seluruh gambar",
    "fitCover": "Penuhi halaman",
    "quality": "Kompresi",
    "qualityBest": "Kualitas terbaik",
    "qualityBalanced": "Seimbang",
    "qualitySmall": "File kecil",
    "margin": "Margin",
    "millimeterUnit": "mm"
  },
  "he": {
    "title": "פריסה",
    "fitMode": "מצב התאמה",
    "fitContain": "הצג את כל התמונה",
    "fitCover": "מלא את העמוד",
    "quality": "דחיסה",
    "qualityBest": "האיכות הטובה ביותר",
    "qualityBalanced": "מאוזן",
    "qualitySmall": "קובץ קטן",
    "margin": "שוליים",
    "millimeterUnit": "מ״מ"
  },
  "ms": {
    "title": "Susun atur",
    "fitMode": "Mod muat",
    "fitContain": "Papar keseluruhan imej",
    "fitCover": "Penuhi halaman",
    "quality": "Pemampatan",
    "qualityBest": "Kualiti terbaik",
    "qualityBalanced": "Seimbang",
    "qualitySmall": "Fail kecil",
    "margin": "Jidar",
    "millimeterUnit": "mm"
  },
  "no": {
    "title": "Oppsett",
    "fitMode": "Tilpasning",
    "fitContain": "Vis hele bildet",
    "fitCover": "Fyll siden",
    "quality": "Komprimering",
    "qualityBest": "Beste kvalitet",
    "qualityBalanced": "Balansert",
    "qualitySmall": "Liten fil",
    "margin": "Marg",
    "millimeterUnit": "mm"
  }
}
</i18n>
