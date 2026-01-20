<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <n-form label-placement="left" label-width="120">
      <n-form-item :label="t('colorCount')">
        <n-flex align="center" :size="12" wrap>
          <n-slider
            v-model:value="options.colorCount"
            :min="3"
            :max="12"
            :step="1"
            :disabled="isLoading"
            style="width: 180px"
          />
          <n-input-number
            v-model:value="options.colorCount"
            :min="3"
            :max="12"
            size="small"
            :disabled="isLoading"
          />
        </n-flex>
      </n-form-item>
      <n-form-item :label="t('quality')">
        <n-radio-group v-model:value="options.quality" size="small" :disabled="isLoading">
          <n-radio-button value="fast">{{ t('fast') }}</n-radio-button>
          <n-radio-button value="balanced">{{ t('balanced') }}</n-radio-button>
          <n-radio-button value="precise">{{ t('precise') }}</n-radio-button>
        </n-radio-group>
      </n-form-item>
      <n-form-item :label="t('sortBy')">
        <n-select v-model:value="options.sortBy" :options="sortOptions" :disabled="isLoading" />
      </n-form-item>
      <n-form-item :label="t('ignoreTransparent')">
        <n-switch v-model:value="options.ignoreTransparent" :disabled="isLoading" />
      </n-form-item>
    </n-form>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NForm,
  NFormItem,
  NSlider,
  NInputNumber,
  NRadioGroup,
  NRadioButton,
  NSelect,
  NSwitch,
  NFlex,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { PaletteOptions } from '../types'

const { t } = useI18n()

const options = defineModel<PaletteOptions>('options', { required: true })

defineProps<{
  isLoading: boolean
}>()

const sortOptions = computed(() => [
  { label: t('sortDominance'), value: 'dominance' },
  { label: t('sortHue'), value: 'hue' },
  { label: t('sortLightness'), value: 'lightness' },
])
</script>

<i18n lang="json">
{
  "en": {
    "title": "Palette Settings",
    "colorCount": "Colors",
    "quality": "Quality",
    "fast": "Fast",
    "balanced": "Balanced",
    "precise": "Precise",
    "sortBy": "Sort by",
    "sortDominance": "Dominance",
    "sortHue": "Hue",
    "sortLightness": "Lightness",
    "ignoreTransparent": "Ignore transparency"
  },
  "zh": {
    "title": "调色板设置",
    "colorCount": "颜色数量",
    "quality": "质量",
    "fast": "快速",
    "balanced": "均衡",
    "precise": "精确",
    "sortBy": "排序",
    "sortDominance": "占比",
    "sortHue": "色相",
    "sortLightness": "明度",
    "ignoreTransparent": "忽略透明像素"
  },
  "zh-CN": {
    "title": "调色板设置",
    "colorCount": "颜色数量",
    "quality": "质量",
    "fast": "快速",
    "balanced": "均衡",
    "precise": "精确",
    "sortBy": "排序",
    "sortDominance": "占比",
    "sortHue": "色相",
    "sortLightness": "明度",
    "ignoreTransparent": "忽略透明像素"
  },
  "zh-TW": {
    "title": "調色板設定",
    "colorCount": "顏色數量",
    "quality": "品質",
    "fast": "快速",
    "balanced": "均衡",
    "precise": "精確",
    "sortBy": "排序",
    "sortDominance": "占比",
    "sortHue": "色相",
    "sortLightness": "明度",
    "ignoreTransparent": "忽略透明像素"
  },
  "zh-HK": {
    "title": "調色板設定",
    "colorCount": "顏色數量",
    "quality": "品質",
    "fast": "快速",
    "balanced": "均衡",
    "precise": "精確",
    "sortBy": "排序",
    "sortDominance": "佔比",
    "sortHue": "色相",
    "sortLightness": "明度",
    "ignoreTransparent": "忽略透明像素"
  },
  "es": {
    "title": "Ajustes de paleta",
    "colorCount": "Colores",
    "quality": "Calidad",
    "fast": "Rápido",
    "balanced": "Equilibrado",
    "precise": "Preciso",
    "sortBy": "Ordenar por",
    "sortDominance": "Dominancia",
    "sortHue": "Tono",
    "sortLightness": "Luminosidad",
    "ignoreTransparent": "Ignorar transparencia"
  },
  "fr": {
    "title": "Paramètres de palette",
    "colorCount": "Couleurs",
    "quality": "Qualité",
    "fast": "Rapide",
    "balanced": "Équilibré",
    "precise": "Précis",
    "sortBy": "Trier par",
    "sortDominance": "Dominance",
    "sortHue": "Teinte",
    "sortLightness": "Luminance",
    "ignoreTransparent": "Ignorer la transparence"
  },
  "de": {
    "title": "Paletteneinstellungen",
    "colorCount": "Farben",
    "quality": "Qualität",
    "fast": "Schnell",
    "balanced": "Ausgewogen",
    "precise": "Präzise",
    "sortBy": "Sortieren nach",
    "sortDominance": "Dominanz",
    "sortHue": "Farbton",
    "sortLightness": "Helligkeit",
    "ignoreTransparent": "Transparenz ignorieren"
  },
  "it": {
    "title": "Impostazioni palette",
    "colorCount": "Colori",
    "quality": "Qualità",
    "fast": "Veloce",
    "balanced": "Bilanciato",
    "precise": "Preciso",
    "sortBy": "Ordina per",
    "sortDominance": "Dominanza",
    "sortHue": "Tonalità",
    "sortLightness": "Luminosità",
    "ignoreTransparent": "Ignora trasparenza"
  },
  "ja": {
    "title": "パレット設定",
    "colorCount": "色数",
    "quality": "品質",
    "fast": "高速",
    "balanced": "バランス",
    "precise": "精密",
    "sortBy": "並べ替え",
    "sortDominance": "占有率",
    "sortHue": "色相",
    "sortLightness": "明度",
    "ignoreTransparent": "透明を無視"
  },
  "ko": {
    "title": "팔레트 설정",
    "colorCount": "색상 수",
    "quality": "품질",
    "fast": "빠름",
    "balanced": "균형",
    "precise": "정밀",
    "sortBy": "정렬",
    "sortDominance": "비중",
    "sortHue": "색조",
    "sortLightness": "명도",
    "ignoreTransparent": "투명 픽셀 무시"
  },
  "ru": {
    "title": "Настройки палитры",
    "colorCount": "Цвета",
    "quality": "Качество",
    "fast": "Быстро",
    "balanced": "Сбалансировано",
    "precise": "Точно",
    "sortBy": "Сортировать",
    "sortDominance": "Доминирование",
    "sortHue": "Оттенок",
    "sortLightness": "Яркость",
    "ignoreTransparent": "Игнорировать прозрачность"
  },
  "pt": {
    "title": "Configurações da paleta",
    "colorCount": "Cores",
    "quality": "Qualidade",
    "fast": "Rápido",
    "balanced": "Equilibrado",
    "precise": "Preciso",
    "sortBy": "Ordenar por",
    "sortDominance": "Dominância",
    "sortHue": "Matiz",
    "sortLightness": "Luminosidade",
    "ignoreTransparent": "Ignorar transparência"
  },
  "ar": {
    "title": "إعدادات اللوحة",
    "colorCount": "الألوان",
    "quality": "الجودة",
    "fast": "سريع",
    "balanced": "متوازن",
    "precise": "دقيق",
    "sortBy": "الترتيب حسب",
    "sortDominance": "الهيمنة",
    "sortHue": "درجة اللون",
    "sortLightness": "السطوع",
    "ignoreTransparent": "تجاهل الشفافية"
  },
  "hi": {
    "title": "पैलेट सेटिंग्स",
    "colorCount": "रंग",
    "quality": "गुणवत्ता",
    "fast": "तेज़",
    "balanced": "संतुलित",
    "precise": "सटीक",
    "sortBy": "सॉर्ट करें",
    "sortDominance": "प्रमुखता",
    "sortHue": "ह्यू",
    "sortLightness": "लाइटनेस",
    "ignoreTransparent": "पारदर्शिता अनदेखी करें"
  },
  "tr": {
    "title": "Palet ayarlari",
    "colorCount": "Renkler",
    "quality": "Kalite",
    "fast": "Hizli",
    "balanced": "Dengeli",
    "precise": "Hassas",
    "sortBy": "Siralama",
    "sortDominance": "Baskinlik",
    "sortHue": "Ton",
    "sortLightness": "Parlaklik",
    "ignoreTransparent": "Seffafligi yoksay"
  },
  "nl": {
    "title": "Paletinstellingen",
    "colorCount": "Kleuren",
    "quality": "Kwaliteit",
    "fast": "Snel",
    "balanced": "Gebalanceerd",
    "precise": "Nauwkeurig",
    "sortBy": "Sorteren op",
    "sortDominance": "Dominantie",
    "sortHue": "Tint",
    "sortLightness": "Lichtheid",
    "ignoreTransparent": "Transparantie negeren"
  },
  "sv": {
    "title": "Palettinställningar",
    "colorCount": "Färger",
    "quality": "Kvalitet",
    "fast": "Snabb",
    "balanced": "Balanserad",
    "precise": "Precis",
    "sortBy": "Sortera efter",
    "sortDominance": "Dominans",
    "sortHue": "Nyans",
    "sortLightness": "Ljushet",
    "ignoreTransparent": "Ignorera transparens"
  },
  "pl": {
    "title": "Ustawienia palety",
    "colorCount": "Kolory",
    "quality": "Jakość",
    "fast": "Szybko",
    "balanced": "Zbalansowane",
    "precise": "Dokładnie",
    "sortBy": "Sortuj według",
    "sortDominance": "Dominacja",
    "sortHue": "Odcień",
    "sortLightness": "Jasność",
    "ignoreTransparent": "Ignoruj przezroczystość"
  },
  "vi": {
    "title": "Cài đặt bảng màu",
    "colorCount": "Màu sắc",
    "quality": "Chất lượng",
    "fast": "Nhanh",
    "balanced": "Cân bằng",
    "precise": "Chính xác",
    "sortBy": "Sắp xếp theo",
    "sortDominance": "Độ trội",
    "sortHue": "Sắc độ",
    "sortLightness": "Độ sáng",
    "ignoreTransparent": "Bỏ qua độ trong suốt"
  },
  "th": {
    "title": "การตั้งค่าพาเล็ต",
    "colorCount": "สี",
    "quality": "คุณภาพ",
    "fast": "เร็ว",
    "balanced": "สมดุล",
    "precise": "แม่นยำ",
    "sortBy": "เรียงตาม",
    "sortDominance": "ความโดดเด่น",
    "sortHue": "ฮิว",
    "sortLightness": "ความสว่าง",
    "ignoreTransparent": "ละเว้นความโปร่งใส"
  },
  "id": {
    "title": "Pengaturan palet",
    "colorCount": "Warna",
    "quality": "Kualitas",
    "fast": "Cepat",
    "balanced": "Seimbang",
    "precise": "Presisi",
    "sortBy": "Urutkan berdasarkan",
    "sortDominance": "Dominansi",
    "sortHue": "Rona",
    "sortLightness": "Kecerahan",
    "ignoreTransparent": "Abaikan transparansi"
  },
  "he": {
    "title": "הגדרות פלטה",
    "colorCount": "צבעים",
    "quality": "איכות",
    "fast": "מהיר",
    "balanced": "מאוזן",
    "precise": "מדויק",
    "sortBy": "מיין לפי",
    "sortDominance": "דומיננטיות",
    "sortHue": "גוון",
    "sortLightness": "בהירות",
    "ignoreTransparent": "התעלם משקיפות"
  },
  "ms": {
    "title": "Tetapan palet",
    "colorCount": "Warna",
    "quality": "Kualiti",
    "fast": "Pantas",
    "balanced": "Seimbang",
    "precise": "Tepat",
    "sortBy": "Isih mengikut",
    "sortDominance": "Dominan",
    "sortHue": "Rona",
    "sortLightness": "Kecerahan",
    "ignoreTransparent": "Abaikan ketelusan"
  },
  "no": {
    "title": "Palettinnstillinger",
    "colorCount": "Farger",
    "quality": "Kvalitet",
    "fast": "Rask",
    "balanced": "Balansert",
    "precise": "Presis",
    "sortBy": "Sorter etter",
    "sortDominance": "Dominans",
    "sortHue": "Nyanse",
    "sortLightness": "Lyshet",
    "ignoreTransparent": "Ignorer gjennomsiktighet"
  }
}
</i18n>
