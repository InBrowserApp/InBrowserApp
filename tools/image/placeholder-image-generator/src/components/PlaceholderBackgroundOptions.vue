<template>
  <n-grid cols="1" :y-gap="12">
    <n-form-item-gi :label="t('bg-type')" :show-feedback="false">
      <n-radio-group v-model:value="bgType">
        <n-radio-button value="solid">{{ t('solid') }}</n-radio-button>
        <n-radio-button value="linear-gradient">{{ t('linear-gradient') }}</n-radio-button>
        <n-radio-button value="radial-gradient">{{ t('radial-gradient') }}</n-radio-button>
      </n-radio-group>
    </n-form-item-gi>

    <n-form-item-gi v-if="bgType === 'solid'" :label="t('bg-color')" :show-feedback="false">
      <n-color-picker v-model:value="bgColor" :modes="['hex']" :show-alpha="true" />
    </n-form-item-gi>

    <template v-if="bgType !== 'solid'">
      <n-form-item-gi :label="t('gradient-color-1')" :show-feedback="false">
        <n-color-picker v-model:value="gradientColor1" :modes="['hex']" :show-alpha="true" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('gradient-color-2')" :show-feedback="false">
        <n-color-picker v-model:value="gradientColor2" :modes="['hex']" :show-alpha="true" />
      </n-form-item-gi>
    </template>

    <n-form-item-gi
      v-if="bgType === 'linear-gradient'"
      :label="t('gradient-angle')"
      :show-feedback="false"
    >
      <n-slider
        v-model:value="gradientAngle"
        :min="0"
        :max="360"
        :step="1"
        :format-tooltip="(v) => `${v}°`"
      />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NColorPicker, NFormItemGi, NGrid, NRadioButton, NRadioGroup, NSlider } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const bgType = defineModel<'solid' | 'linear-gradient' | 'radial-gradient'>('bg-type', {
  required: true,
})
const bgColor = defineModel<string>('bg-color', { required: true })
const gradientColor1 = defineModel<string>('gradient-color1', { required: true })
const gradientColor2 = defineModel<string>('gradient-color2', { required: true })
const gradientAngle = defineModel<number>('gradient-angle', { required: true })

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "bg-type": "Background Type",
    "solid": "Solid",
    "linear-gradient": "Linear Gradient",
    "radial-gradient": "Radial Gradient",
    "bg-color": "Background Color",
    "gradient-color-1": "Gradient Color 1",
    "gradient-color-2": "Gradient Color 2",
    "gradient-angle": "Gradient Angle"
  },
  "zh": {
    "bg-type": "背景类型",
    "solid": "纯色",
    "linear-gradient": "线性渐变",
    "radial-gradient": "径向渐变",
    "bg-color": "背景颜色",
    "gradient-color-1": "渐变颜色 1",
    "gradient-color-2": "渐变颜色 2",
    "gradient-angle": "渐变角度"
  },
  "zh-CN": {
    "bg-type": "背景类型",
    "solid": "纯色",
    "linear-gradient": "线性渐变",
    "radial-gradient": "径向渐变",
    "bg-color": "背景颜色",
    "gradient-color-1": "渐变颜色 1",
    "gradient-color-2": "渐变颜色 2",
    "gradient-angle": "渐变角度"
  },
  "zh-TW": {
    "bg-type": "背景類型",
    "solid": "純色",
    "linear-gradient": "線性漸層",
    "radial-gradient": "徑向漸層",
    "bg-color": "背景顏色",
    "gradient-color-1": "漸層顏色 1",
    "gradient-color-2": "漸層顏色 2",
    "gradient-angle": "漸層角度"
  },
  "zh-HK": {
    "bg-type": "背景類型",
    "solid": "純色",
    "linear-gradient": "線性漸變",
    "radial-gradient": "徑向漸變",
    "bg-color": "背景顏色",
    "gradient-color-1": "漸變顏色 1",
    "gradient-color-2": "漸變顏色 2",
    "gradient-angle": "漸變角度"
  },
  "es": {
    "bg-type": "Tipo de fondo",
    "solid": "Sólido",
    "linear-gradient": "Degradado lineal",
    "radial-gradient": "Degradado radial",
    "bg-color": "Color de fondo",
    "gradient-color-1": "Color de degradado 1",
    "gradient-color-2": "Color de degradado 2",
    "gradient-angle": "Ángulo del degradado"
  },
  "fr": {
    "bg-type": "Type de fond",
    "solid": "Uni",
    "linear-gradient": "Dégradé linéaire",
    "radial-gradient": "Dégradé radial",
    "bg-color": "Couleur de fond",
    "gradient-color-1": "Couleur de dégradé 1",
    "gradient-color-2": "Couleur de dégradé 2",
    "gradient-angle": "Angle du dégradé"
  },
  "de": {
    "bg-type": "Hintergrundtyp",
    "solid": "Einfarbig",
    "linear-gradient": "Linearer Verlauf",
    "radial-gradient": "Radialer Verlauf",
    "bg-color": "Hintergrundfarbe",
    "gradient-color-1": "Verlaufsfarbe 1",
    "gradient-color-2": "Verlaufsfarbe 2",
    "gradient-angle": "Verlaufswinkel"
  },
  "it": {
    "bg-type": "Tipo di sfondo",
    "solid": "Solido",
    "linear-gradient": "Gradiente lineare",
    "radial-gradient": "Gradiente radiale",
    "bg-color": "Colore di sfondo",
    "gradient-color-1": "Colore gradiente 1",
    "gradient-color-2": "Colore gradiente 2",
    "gradient-angle": "Angolo del gradiente"
  },
  "ja": {
    "bg-type": "背景タイプ",
    "solid": "単色",
    "linear-gradient": "線形グラデーション",
    "radial-gradient": "放射状グラデーション",
    "bg-color": "背景色",
    "gradient-color-1": "グラデーション色 1",
    "gradient-color-2": "グラデーション色 2",
    "gradient-angle": "グラデーション角度"
  },
  "ko": {
    "bg-type": "배경 유형",
    "solid": "단색",
    "linear-gradient": "선형 그라데이션",
    "radial-gradient": "방사형 그라데이션",
    "bg-color": "배경색",
    "gradient-color-1": "그라데이션 색상 1",
    "gradient-color-2": "그라데이션 색상 2",
    "gradient-angle": "그라데이션 각도"
  },
  "ru": {
    "bg-type": "Тип фона",
    "solid": "Сплошной",
    "linear-gradient": "Линейный градиент",
    "radial-gradient": "Радиальный градиент",
    "bg-color": "Цвет фона",
    "gradient-color-1": "Цвет градиента 1",
    "gradient-color-2": "Цвет градиента 2",
    "gradient-angle": "Угол градиента"
  },
  "pt": {
    "bg-type": "Tipo de fundo",
    "solid": "Sólido",
    "linear-gradient": "Gradiente linear",
    "radial-gradient": "Gradiente radial",
    "bg-color": "Cor de fundo",
    "gradient-color-1": "Cor do gradiente 1",
    "gradient-color-2": "Cor do gradiente 2",
    "gradient-angle": "Ângulo do gradiente"
  },
  "ar": {
    "bg-type": "نوع الخلفية",
    "solid": "صلب",
    "linear-gradient": "تدرج خطي",
    "radial-gradient": "تدرج شعاعي",
    "bg-color": "لون الخلفية",
    "gradient-color-1": "لون التدرج 1",
    "gradient-color-2": "لون التدرج 2",
    "gradient-angle": "زاوية التدرج"
  },
  "hi": {
    "bg-type": "पृष्ठभूमि प्रकार",
    "solid": "ठोस",
    "linear-gradient": "रैखिक ग्रेडिएंट",
    "radial-gradient": "रेडियल ग्रेडिएंट",
    "bg-color": "पृष्ठभूमि रंग",
    "gradient-color-1": "ग्रेडिएंट रंग 1",
    "gradient-color-2": "ग्रेडिएंट रंग 2",
    "gradient-angle": "ग्रेडिएंट कोण"
  },
  "tr": {
    "bg-type": "Arka plan türü",
    "solid": "Düz",
    "linear-gradient": "Doğrusal degrade",
    "radial-gradient": "Radyal degrade",
    "bg-color": "Arka plan rengi",
    "gradient-color-1": "Degrade rengi 1",
    "gradient-color-2": "Degrade rengi 2",
    "gradient-angle": "Degrade açısı"
  },
  "nl": {
    "bg-type": "Achtergrondtype",
    "solid": "Effen",
    "linear-gradient": "Lineair verloop",
    "radial-gradient": "Radiaal verloop",
    "bg-color": "Achtergrondkleur",
    "gradient-color-1": "Verloopkleur 1",
    "gradient-color-2": "Verloopkleur 2",
    "gradient-angle": "Verloophoek"
  },
  "sv": {
    "bg-type": "Bakgrundstyp",
    "solid": "Enfärgad",
    "linear-gradient": "Linjär gradient",
    "radial-gradient": "Radiell gradient",
    "bg-color": "Bakgrundsfärg",
    "gradient-color-1": "Gradientfärg 1",
    "gradient-color-2": "Gradientfärg 2",
    "gradient-angle": "Gradientvinkel"
  },
  "pl": {
    "bg-type": "Typ tła",
    "solid": "Jednolity",
    "linear-gradient": "Gradient liniowy",
    "radial-gradient": "Gradient radialny",
    "bg-color": "Kolor tła",
    "gradient-color-1": "Kolor gradientu 1",
    "gradient-color-2": "Kolor gradientu 2",
    "gradient-angle": "Kąt gradientu"
  },
  "vi": {
    "bg-type": "Loại nền",
    "solid": "Màu đặc",
    "linear-gradient": "Gradient tuyến tính",
    "radial-gradient": "Gradient xuyên tâm",
    "bg-color": "Màu nền",
    "gradient-color-1": "Màu gradient 1",
    "gradient-color-2": "Màu gradient 2",
    "gradient-angle": "Góc gradient"
  },
  "th": {
    "bg-type": "ประเภทพื้นหลัง",
    "solid": "สีเดียว",
    "linear-gradient": "การไล่ระดับสีเชิงเส้น",
    "radial-gradient": "การไล่ระดับสีแบบรัศมี",
    "bg-color": "สีพื้นหลัง",
    "gradient-color-1": "สีไล่ระดับ 1",
    "gradient-color-2": "สีไล่ระดับ 2",
    "gradient-angle": "มุมการไล่ระดับ"
  },
  "id": {
    "bg-type": "Jenis latar belakang",
    "solid": "Solid",
    "linear-gradient": "Gradien linier",
    "radial-gradient": "Gradien radial",
    "bg-color": "Warna latar belakang",
    "gradient-color-1": "Warna gradien 1",
    "gradient-color-2": "Warna gradien 2",
    "gradient-angle": "Sudut gradien"
  },
  "he": {
    "bg-type": "סוג רקע",
    "solid": "אחיד",
    "linear-gradient": "מעבר צבע ליניארי",
    "radial-gradient": "מעבר צבע רדיאלי",
    "bg-color": "צבע רקע",
    "gradient-color-1": "צבע מעבר 1",
    "gradient-color-2": "צבע מעבר 2",
    "gradient-angle": "זווית מעבר"
  },
  "ms": {
    "bg-type": "Jenis latar belakang",
    "solid": "Pepejal",
    "linear-gradient": "Kecerunan linear",
    "radial-gradient": "Kecerunan jejari",
    "bg-color": "Warna latar belakang",
    "gradient-color-1": "Warna kecerunan 1",
    "gradient-color-2": "Warna kecerunan 2",
    "gradient-angle": "Sudut kecerunan"
  },
  "no": {
    "bg-type": "Bakgrunnstype",
    "solid": "Ensfarget",
    "linear-gradient": "Lineær gradient",
    "radial-gradient": "Radiell gradient",
    "bg-color": "Bakgrunnsfarge",
    "gradient-color-1": "Gradientfarge 1",
    "gradient-color-2": "Gradientfarge 2",
    "gradient-angle": "Gradientvinkel"
  }
}
</i18n>
