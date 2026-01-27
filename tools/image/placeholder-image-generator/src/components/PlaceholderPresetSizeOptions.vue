<template>
  <n-form-item-gi :label="t('preset')" :show-feedback="false">
    <n-select
      :value="currentPresetIndex"
      :options="presetOptions"
      :placeholder="t('preset-placeholder')"
      clearable
      @update:value="applyPreset"
    />
  </n-form-item-gi>

  <n-form-item-gi :label="t('width')" :show-feedback="false">
    <n-input-number
      :value="width"
      :min="1"
      :max="4096"
      :step="1"
      style="width: 100%"
      @update:value="(v) => (width = v ?? 800)"
    />
  </n-form-item-gi>

  <n-form-item-gi :label="t('height')" :show-feedback="false">
    <n-input-number
      :value="height"
      :min="1"
      :max="4096"
      :step="1"
      style="width: 100%"
      @update:value="(v) => (height = v ?? 600)"
    />
  </n-form-item-gi>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFormItemGi, NInputNumber, NSelect } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const width = defineModel<number>('width', { required: true })
const height = defineModel<number>('height', { required: true })

const { t } = useI18n({ useScope: 'local' })

const presets = [
  { label: 'HD (1280×720)', width: 1280, height: 720 },
  { label: 'Full HD (1920×1080)', width: 1920, height: 1080 },
  { label: '4K (3840×2160)', width: 3840, height: 2160 },
  { label: 'Square (500×500)', width: 500, height: 500 },
  { label: 'Instagram Post (1080×1080)', width: 1080, height: 1080 },
  { label: 'Instagram Story (1080×1920)', width: 1080, height: 1920 },
  { label: 'Facebook Cover (820×312)', width: 820, height: 312 },
  { label: 'Twitter Header (1500×500)', width: 1500, height: 500 },
  { label: 'Thumbnail (150×150)', width: 150, height: 150 },
  { label: 'Banner (728×90)', width: 728, height: 90 },
]

const presetOptions = computed(() =>
  presets.map((preset, index) => ({
    label: preset.label,
    value: index,
  })),
)

const currentPresetIndex = computed(() => {
  const index = presets.findIndex(
    (preset) => preset.width === width.value && preset.height === height.value,
  )
  return index === -1 ? null : index
})

function applyPreset(index: number | null) {
  if (index === null) return
  const preset = presets[index]
  if (!preset) return
  width.value = preset.width
  height.value = preset.height
}
</script>

<i18n lang="json">
{
  "en": {
    "preset": "Preset",
    "preset-placeholder": "Select a preset size",
    "width": "Width (px)",
    "height": "Height (px)"
  },
  "zh": {
    "preset": "预设",
    "preset-placeholder": "选择预设尺寸",
    "width": "宽度 (px)",
    "height": "高度 (px)"
  },
  "zh-CN": {
    "preset": "预设",
    "preset-placeholder": "选择预设尺寸",
    "width": "宽度 (px)",
    "height": "高度 (px)"
  },
  "zh-TW": {
    "preset": "預設",
    "preset-placeholder": "選擇預設尺寸",
    "width": "寬度 (px)",
    "height": "高度 (px)"
  },
  "zh-HK": {
    "preset": "預設",
    "preset-placeholder": "選擇預設尺寸",
    "width": "寬度 (px)",
    "height": "高度 (px)"
  },
  "es": {
    "preset": "Preajuste",
    "preset-placeholder": "Seleccionar un tamaño preajustado",
    "width": "Ancho (px)",
    "height": "Alto (px)"
  },
  "fr": {
    "preset": "Prédéfini",
    "preset-placeholder": "Sélectionner une taille prédéfinie",
    "width": "Largeur (px)",
    "height": "Hauteur (px)"
  },
  "de": {
    "preset": "Voreinstellung",
    "preset-placeholder": "Voreingestellte Größe wählen",
    "width": "Breite (px)",
    "height": "Höhe (px)"
  },
  "it": {
    "preset": "Preimpostazione",
    "preset-placeholder": "Seleziona una dimensione preimpostata",
    "width": "Larghezza (px)",
    "height": "Altezza (px)"
  },
  "ja": {
    "preset": "プリセット",
    "preset-placeholder": "プリセットサイズを選択",
    "width": "幅 (px)",
    "height": "高さ (px)"
  },
  "ko": {
    "preset": "프리셋",
    "preset-placeholder": "프리셋 크기 선택",
    "width": "너비 (px)",
    "height": "높이 (px)"
  },
  "ru": {
    "preset": "Пресет",
    "preset-placeholder": "Выберите предустановленный размер",
    "width": "Ширина (px)",
    "height": "Высота (px)"
  },
  "pt": {
    "preset": "Predefinição",
    "preset-placeholder": "Selecionar tamanho predefinido",
    "width": "Largura (px)",
    "height": "Altura (px)"
  },
  "ar": {
    "preset": "إعداد مسبق",
    "preset-placeholder": "اختر حجمًا مسبقًا",
    "width": "العرض (px)",
    "height": "الارتفاع (px)"
  },
  "hi": {
    "preset": "प्रीसेट",
    "preset-placeholder": "प्रीसेट आकार चुनें",
    "width": "चौड़ाई (px)",
    "height": "ऊंचाई (px)"
  },
  "tr": {
    "preset": "Ön ayar",
    "preset-placeholder": "Ön ayarlı boyut seçin",
    "width": "Genişlik (px)",
    "height": "Yükseklik (px)"
  },
  "nl": {
    "preset": "Voorinstelling",
    "preset-placeholder": "Selecteer een vooringestelde grootte",
    "width": "Breedte (px)",
    "height": "Hoogte (px)"
  },
  "sv": {
    "preset": "Förinställning",
    "preset-placeholder": "Välj en förinställd storlek",
    "width": "Bredd (px)",
    "height": "Höjd (px)"
  },
  "pl": {
    "preset": "Preset",
    "preset-placeholder": "Wybierz rozmiar predefiniowany",
    "width": "Szerokość (px)",
    "height": "Wysokość (px)"
  },
  "vi": {
    "preset": "Cài đặt sẵn",
    "preset-placeholder": "Chọn kích thước cài đặt sẵn",
    "width": "Chiều rộng (px)",
    "height": "Chiều cao (px)"
  },
  "th": {
    "preset": "ค่าที่ตั้งไว้ล่วงหน้า",
    "preset-placeholder": "เลือกขนาดที่ตั้งไว้ล่วงหน้า",
    "width": "ความกว้าง (px)",
    "height": "ความสูง (px)"
  },
  "id": {
    "preset": "Preset",
    "preset-placeholder": "Pilih ukuran preset",
    "width": "Lebar (px)",
    "height": "Tinggi (px)"
  },
  "he": {
    "preset": "הגדרה קבועה מראש",
    "preset-placeholder": "בחר גודל קבוע מראש",
    "width": "רוחב (px)",
    "height": "גובה (px)"
  },
  "ms": {
    "preset": "Pratetap",
    "preset-placeholder": "Pilih saiz pratetap",
    "width": "Lebar (px)",
    "height": "Tinggi (px)"
  },
  "no": {
    "preset": "Forhåndsinnstilling",
    "preset-placeholder": "Velg en forhåndsinnstilt størrelse",
    "width": "Bredde (px)",
    "height": "Høyde (px)"
  }
}
</i18n>
