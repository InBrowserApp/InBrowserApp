<template>
  <n-grid cols="1" :y-gap="12">
    <n-form-item-gi :label="t('backgroundType')" :show-feedback="false">
      <n-select v-model:value="backgroundType" :options="backgroundTypeOptions" size="small" />
    </n-form-item-gi>
    <n-form-item-gi
      v-if="backgroundType === 'preset'"
      :label="t('backgroundPreset')"
      :show-feedback="false"
    >
      <n-select
        v-model:value="backgroundPresetId"
        :options="backgroundPresetOptions"
        size="small"
      />
    </n-form-item-gi>
    <n-form-item-gi
      v-if="backgroundType === 'solid'"
      :label="t('backgroundColor')"
      :show-feedback="false"
    >
      <n-color-picker v-model:value="backgroundColor" :modes="['hex']" size="small" />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NColorPicker, NFormItemGi, NGrid, NSelect } from 'naive-ui'
import { backgroundPresets } from '../utils/themes'

type BackgroundType = 'preset' | 'solid' | 'transparent' | 'none'

const backgroundType = defineModel<BackgroundType>('backgroundType', { required: true })
const backgroundPresetId = defineModel<string>('backgroundPresetId', { required: true })
const backgroundColor = defineModel<string>('backgroundColor', { required: true })

const { t } = useI18n()

const backgroundTypeOptions = computed(() => [
  { label: t('backgroundPreset'), value: 'preset' },
  { label: t('backgroundSolid'), value: 'solid' },
  { label: t('backgroundTransparent'), value: 'transparent' },
  { label: t('backgroundNone'), value: 'none' },
])

const backgroundPresetOptions = computed(() =>
  backgroundPresets.map((preset) => ({
    // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
    label: t(preset.labelKey),
    value: preset.id,
  })),
)
</script>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys -->
<i18n lang="json">
{
  "en": {
    "backgroundType": "Background",
    "backgroundPreset": "Gradient",
    "backgroundSolid": "Solid color",
    "backgroundTransparent": "Transparent",
    "backgroundColor": "Background color",
    "background.aurora": "Aurora",
    "background.sunset": "Sunset",
    "background.ocean": "Ocean",
    "background.ember": "Ember",
    "background.noir": "Noir",
    "backgroundNone": "None"
  },
  "zh": {
    "backgroundType": "背景",
    "backgroundPreset": "渐变",
    "backgroundSolid": "纯色",
    "backgroundTransparent": "透明",
    "backgroundColor": "背景颜色",
    "background.aurora": "极光",
    "background.sunset": "日落",
    "background.ocean": "海岸",
    "background.ember": "余烬",
    "background.noir": "暗影",
    "backgroundNone": "无"
  },
  "zh-CN": {
    "backgroundType": "背景",
    "backgroundPreset": "渐变",
    "backgroundSolid": "纯色",
    "backgroundTransparent": "透明",
    "backgroundColor": "背景颜色",
    "background.aurora": "极光",
    "background.sunset": "日落",
    "background.ocean": "海岸",
    "background.ember": "余烬",
    "background.noir": "暗影",
    "backgroundNone": "无"
  },
  "zh-TW": {
    "backgroundType": "背景",
    "backgroundPreset": "漸層",
    "backgroundSolid": "純色",
    "backgroundTransparent": "透明",
    "backgroundColor": "背景顏色",
    "background.aurora": "極光",
    "background.sunset": "日落",
    "background.ocean": "海岸",
    "background.ember": "餘燼",
    "background.noir": "暗影",
    "backgroundNone": "無"
  },
  "zh-HK": {
    "backgroundType": "背景",
    "backgroundPreset": "漸層",
    "backgroundSolid": "純色",
    "backgroundTransparent": "透明",
    "backgroundColor": "背景顏色",
    "background.aurora": "極光",
    "background.sunset": "日落",
    "background.ocean": "海岸",
    "background.ember": "餘燼",
    "background.noir": "暗影",
    "backgroundNone": "無"
  },
  "es": {
    "backgroundType": "Fondo",
    "backgroundPreset": "Degradado",
    "backgroundSolid": "Color sólido",
    "backgroundTransparent": "Transparente",
    "backgroundColor": "Color de fondo",
    "background.aurora": "Aurora",
    "background.sunset": "Atardecer",
    "background.ocean": "Océano",
    "background.ember": "Ascua",
    "background.noir": "Noir",
    "backgroundNone": "None"
  },
  "fr": {
    "backgroundType": "Arrière-plan",
    "backgroundPreset": "Dégradé",
    "backgroundSolid": "Couleur unie",
    "backgroundTransparent": "Transparent",
    "backgroundColor": "Couleur de fond",
    "background.aurora": "Aurore",
    "background.sunset": "Coucher de soleil",
    "background.ocean": "Océan",
    "background.ember": "Braise",
    "background.noir": "Noir",
    "backgroundNone": "None"
  },
  "de": {
    "backgroundType": "Hintergrund",
    "backgroundPreset": "Verlauf",
    "backgroundSolid": "Einfarbig",
    "backgroundTransparent": "Transparent",
    "backgroundColor": "Hintergrundfarbe",
    "background.aurora": "Aurora",
    "background.sunset": "Sonnenuntergang",
    "background.ocean": "Ozean",
    "background.ember": "Glut",
    "background.noir": "Noir",
    "backgroundNone": "None"
  },
  "it": {
    "backgroundType": "Sfondo",
    "backgroundPreset": "Gradiente",
    "backgroundSolid": "Colore pieno",
    "backgroundTransparent": "Trasparente",
    "backgroundColor": "Colore di sfondo",
    "background.aurora": "Aurora",
    "background.sunset": "Tramonto",
    "background.ocean": "Oceano",
    "background.ember": "Brace",
    "background.noir": "Noir",
    "backgroundNone": "None"
  },
  "ja": {
    "backgroundType": "背景",
    "backgroundPreset": "グラデーション",
    "backgroundSolid": "単色",
    "backgroundTransparent": "透明",
    "backgroundColor": "背景色",
    "background.aurora": "オーロラ",
    "background.sunset": "サンセット",
    "background.ocean": "オーシャン",
    "background.ember": "アンバー",
    "background.noir": "ノワール",
    "backgroundNone": "None"
  },
  "ko": {
    "backgroundType": "배경",
    "backgroundPreset": "그라디언트",
    "backgroundSolid": "단색",
    "backgroundTransparent": "투명",
    "backgroundColor": "배경색",
    "background.aurora": "오로라",
    "background.sunset": "선셋",
    "background.ocean": "오션",
    "background.ember": "엠버",
    "background.noir": "누아르",
    "backgroundNone": "None"
  },
  "ru": {
    "backgroundType": "Фон",
    "backgroundPreset": "Градиент",
    "backgroundSolid": "Сплошной цвет",
    "backgroundTransparent": "Прозрачный",
    "backgroundColor": "Цвет фона",
    "background.aurora": "Аврора",
    "background.sunset": "Закат",
    "background.ocean": "Океан",
    "background.ember": "Уголь",
    "background.noir": "Нуар",
    "backgroundNone": "None"
  },
  "pt": {
    "backgroundType": "Fundo",
    "backgroundPreset": "Gradiente",
    "backgroundSolid": "Cor sólida",
    "backgroundTransparent": "Transparente",
    "backgroundColor": "Cor de fundo",
    "background.aurora": "Aurora",
    "background.sunset": "Pôr do sol",
    "background.ocean": "Oceano",
    "background.ember": "Brasa",
    "background.noir": "Noir",
    "backgroundNone": "None"
  },
  "ar": {
    "backgroundType": "الخلفية",
    "backgroundPreset": "تدرج",
    "backgroundSolid": "لون ثابت",
    "backgroundTransparent": "شفاف",
    "backgroundColor": "لون الخلفية",
    "background.aurora": "شفق",
    "background.sunset": "غروب",
    "background.ocean": "محيط",
    "background.ember": "جمر",
    "background.noir": "نوار",
    "backgroundNone": "None"
  },
  "hi": {
    "backgroundType": "पृष्ठभूमि",
    "backgroundPreset": "ग्रेडिएंट",
    "backgroundSolid": "एकरंगी",
    "backgroundTransparent": "पारदर्शी",
    "backgroundColor": "पृष्ठभूमि रंग",
    "background.aurora": "ऑरोरा",
    "background.sunset": "सनसेट",
    "background.ocean": "ओशन",
    "background.ember": "एंबर",
    "background.noir": "नोयर",
    "backgroundNone": "None"
  },
  "tr": {
    "backgroundType": "Arka plan",
    "backgroundPreset": "Gradyan",
    "backgroundSolid": "Düz renk",
    "backgroundTransparent": "Şeffaf",
    "backgroundColor": "Arka plan rengi",
    "background.aurora": "Aurora",
    "background.sunset": "Gün batımı",
    "background.ocean": "Okyanus",
    "background.ember": "Kızıl",
    "background.noir": "Noir",
    "backgroundNone": "None"
  },
  "nl": {
    "backgroundType": "Achtergrond",
    "backgroundPreset": "Verloop",
    "backgroundSolid": "Effen kleur",
    "backgroundTransparent": "Transparant",
    "backgroundColor": "Achtergrondkleur",
    "background.aurora": "Aurora",
    "background.sunset": "Zonsondergang",
    "background.ocean": "Oceaan",
    "background.ember": "Gloed",
    "background.noir": "Noir",
    "backgroundNone": "None"
  },
  "sv": {
    "backgroundType": "Bakgrund",
    "backgroundPreset": "Gradient",
    "backgroundSolid": "Enfärgad",
    "backgroundTransparent": "Transparent",
    "backgroundColor": "Bakgrundsfärg",
    "background.aurora": "Aurora",
    "background.sunset": "Solnedgång",
    "background.ocean": "Hav",
    "background.ember": "Glöd",
    "background.noir": "Noir",
    "backgroundNone": "None"
  },
  "pl": {
    "backgroundType": "Tło",
    "backgroundPreset": "Gradient",
    "backgroundSolid": "Jednolity kolor",
    "backgroundTransparent": "Przezroczyste",
    "backgroundColor": "Kolor tła",
    "background.aurora": "Zorza",
    "background.sunset": "Zachód",
    "background.ocean": "Ocean",
    "background.ember": "Żar",
    "background.noir": "Noir",
    "backgroundNone": "None"
  },
  "vi": {
    "backgroundType": "Nền",
    "backgroundPreset": "Chuyển sắc",
    "backgroundSolid": "Màu đơn",
    "backgroundTransparent": "Trong suốt",
    "backgroundColor": "Màu nền",
    "background.aurora": "Cực quang",
    "background.sunset": "Hoàng hôn",
    "background.ocean": "Đại dương",
    "background.ember": "Tàn lửa",
    "background.noir": "Noir",
    "backgroundNone": "None"
  },
  "th": {
    "backgroundType": "พื้นหลัง",
    "backgroundPreset": "ไล่สี",
    "backgroundSolid": "สีทึบ",
    "backgroundTransparent": "โปร่งใส",
    "backgroundColor": "สีพื้นหลัง",
    "background.aurora": "ออโรรา",
    "background.sunset": "พระอาทิตย์ตก",
    "background.ocean": "มหาสมุทร",
    "background.ember": "ถ่านแดง",
    "background.noir": "นัวร์",
    "backgroundNone": "None"
  },
  "id": {
    "backgroundType": "Latar",
    "backgroundPreset": "Gradien",
    "backgroundSolid": "Warna solid",
    "backgroundTransparent": "Transparan",
    "backgroundColor": "Warna latar",
    "background.aurora": "Aurora",
    "background.sunset": "Sunset",
    "background.ocean": "Laut",
    "background.ember": "Bara",
    "background.noir": "Noir",
    "backgroundNone": "None"
  },
  "he": {
    "backgroundType": "רקע",
    "backgroundPreset": "גרדיאנט",
    "backgroundSolid": "צבע אחיד",
    "backgroundTransparent": "שקוף",
    "backgroundColor": "צבע רקע",
    "background.aurora": "אורורה",
    "background.sunset": "שקיעה",
    "background.ocean": "אוקיינוס",
    "background.ember": "גחלת",
    "background.noir": "נואר",
    "backgroundNone": "None"
  },
  "ms": {
    "backgroundType": "Latar belakang",
    "backgroundPreset": "Gradien",
    "backgroundSolid": "Warna pepejal",
    "backgroundTransparent": "Lutsinar",
    "backgroundColor": "Warna latar",
    "background.aurora": "Aurora",
    "background.sunset": "Matahari terbenam",
    "background.ocean": "Lautan",
    "background.ember": "Bara",
    "background.noir": "Noir",
    "backgroundNone": "None"
  },
  "no": {
    "backgroundType": "Bakgrunn",
    "backgroundPreset": "Gradient",
    "backgroundSolid": "Heldekkende farge",
    "backgroundTransparent": "Gjennomsiktig",
    "backgroundColor": "Bakgrunnsfarge",
    "background.aurora": "Aurora",
    "background.sunset": "Solnedgang",
    "background.ocean": "Hav",
    "background.ember": "Glør",
    "background.noir": "Noir",
    "backgroundNone": "None"
  }
}
</i18n>
