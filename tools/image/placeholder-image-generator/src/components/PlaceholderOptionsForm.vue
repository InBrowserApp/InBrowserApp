<template>
  <n-grid cols="1 s:2 m:3" responsive="screen" :x-gap="20" :y-gap="20">
    <!-- Presets -->
    <n-form-item-gi :label="t('preset')" :show-feedback="false">
      <n-select
        :value="currentPresetIndex"
        :options="presetOptions"
        :placeholder="t('preset-placeholder')"
        clearable
        @update:value="applyPreset"
      />
    </n-form-item-gi>

    <!-- Width -->
    <n-form-item-gi :label="t('width')" :show-feedback="false">
      <n-input-number
        :value="width"
        :min="1"
        :max="4096"
        :step="1"
        style="width: 100%"
        @update:value="(v) => $emit('update:width', v ?? 800)"
      />
    </n-form-item-gi>

    <!-- Height -->
    <n-form-item-gi :label="t('height')" :show-feedback="false">
      <n-input-number
        :value="height"
        :min="1"
        :max="4096"
        :step="1"
        style="width: 100%"
        @update:value="(v) => $emit('update:height', v ?? 600)"
      />
    </n-form-item-gi>

    <!-- Background Type -->
    <n-form-item-gi :label="t('bg-type')" :show-feedback="false" span="1 s:2 m:3">
      <n-radio-group :value="bgType" @update:value="(v) => $emit('update:bgType', v)">
        <n-radio-button value="solid">{{ t('solid') }}</n-radio-button>
        <n-radio-button value="linear-gradient">{{ t('linear-gradient') }}</n-radio-button>
        <n-radio-button value="radial-gradient">{{ t('radial-gradient') }}</n-radio-button>
      </n-radio-group>
    </n-form-item-gi>

    <!-- Solid Color -->
    <n-form-item-gi v-if="bgType === 'solid'" :label="t('bg-color')" :show-feedback="false">
      <n-color-picker
        :value="bgColor"
        :modes="['hex']"
        :show-alpha="true"
        @update:value="(v) => $emit('update:bgColor', v)"
      />
    </n-form-item-gi>

    <!-- Gradient Colors -->
    <template v-if="bgType !== 'solid'">
      <n-form-item-gi :label="t('gradient-color-1')" :show-feedback="false">
        <n-color-picker
          :value="gradientColor1"
          :modes="['hex']"
          :show-alpha="true"
          @update:value="(v) => $emit('update:gradientColor1', v)"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('gradient-color-2')" :show-feedback="false">
        <n-color-picker
          :value="gradientColor2"
          :modes="['hex']"
          :show-alpha="true"
          @update:value="(v) => $emit('update:gradientColor2', v)"
        />
      </n-form-item-gi>
    </template>

    <!-- Gradient Angle (linear only) -->
    <n-form-item-gi
      v-if="bgType === 'linear-gradient'"
      :label="t('gradient-angle')"
      :show-feedback="false"
    >
      <n-slider
        :value="gradientAngle"
        :min="0"
        :max="360"
        :step="1"
        :format-tooltip="(v) => `${v}°`"
        @update:value="(v) => $emit('update:gradientAngle', v)"
      />
    </n-form-item-gi>

    <!-- Text Color -->
    <n-form-item-gi :label="t('text-color')" :show-feedback="false">
      <n-color-picker
        :value="textColor"
        :modes="['hex']"
        :show-alpha="true"
        @update:value="(v) => $emit('update:textColor', v)"
      />
    </n-form-item-gi>

    <!-- Custom Text -->
    <n-form-item-gi :label="t('custom-text')" :show-feedback="false" span="1 s:2">
      <n-input
        :value="customText"
        :placeholder="`${width} × ${height}`"
        clearable
        @update:value="(v) => $emit('update:customText', v ?? '')"
      />
    </n-form-item-gi>

    <!-- Font Size -->
    <n-form-item-gi :label="t('font-size')" :show-feedback="false">
      <n-input-number
        :value="fontSize"
        :min="0"
        :max="500"
        :step="1"
        :placeholder="t('auto')"
        style="width: 100%"
        clearable
        @update:value="(v) => $emit('update:fontSize', v ?? 0)"
      />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NGrid,
  NFormItemGi,
  NInputNumber,
  NInput,
  NSelect,
  NColorPicker,
  NSlider,
  NRadioGroup,
  NRadioButton,
} from 'naive-ui'

const { t } = useI18n()

const props = defineProps<{
  width: number
  height: number
  bgType: 'solid' | 'linear-gradient' | 'radial-gradient'
  bgColor: string
  gradientColor1: string
  gradientColor2: string
  gradientAngle: number
  textColor: string
  customText: string
  fontSize: number
}>()

const emit = defineEmits<{
  'update:width': [value: number]
  'update:height': [value: number]
  'update:bgType': [value: 'solid' | 'linear-gradient' | 'radial-gradient']
  'update:bgColor': [value: string]
  'update:gradientColor1': [value: string]
  'update:gradientColor2': [value: string]
  'update:gradientAngle': [value: number]
  'update:textColor': [value: string]
  'update:customText': [value: string]
  'update:fontSize': [value: number]
}>()

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
  presets.map((p, i) => ({
    label: p.label,
    value: i,
  })),
)

const currentPresetIndex = computed(() => {
  const index = presets.findIndex((p) => p.width === props.width && p.height === props.height)
  return index === -1 ? null : index
})

function applyPreset(index: number | null) {
  if (index === null) return
  const preset = presets[index]
  if (!preset) return
  emit('update:width', preset.width)
  emit('update:height', preset.height)
}
</script>

<i18n lang="json">
{
  "en": {
    "preset": "Preset",
    "preset-placeholder": "Select a preset size",
    "width": "Width (px)",
    "height": "Height (px)",
    "bg-type": "Background Type",
    "solid": "Solid",
    "linear-gradient": "Linear Gradient",
    "radial-gradient": "Radial Gradient",
    "bg-color": "Background Color",
    "gradient-color-1": "Gradient Color 1",
    "gradient-color-2": "Gradient Color 2",
    "gradient-angle": "Gradient Angle",
    "text-color": "Text Color",
    "custom-text": "Custom Text",
    "font-size": "Font Size (px)",
    "auto": "Auto"
  },
  "zh": {
    "preset": "预设",
    "preset-placeholder": "选择预设尺寸",
    "width": "宽度 (px)",
    "height": "高度 (px)",
    "bg-type": "背景类型",
    "solid": "纯色",
    "linear-gradient": "线性渐变",
    "radial-gradient": "径向渐变",
    "bg-color": "背景颜色",
    "gradient-color-1": "渐变颜色 1",
    "gradient-color-2": "渐变颜色 2",
    "gradient-angle": "渐变角度",
    "text-color": "文字颜色",
    "custom-text": "自定义文字",
    "font-size": "字体大小 (px)",
    "auto": "自动"
  },
  "zh-CN": {
    "preset": "预设",
    "preset-placeholder": "选择预设尺寸",
    "width": "宽度 (px)",
    "height": "高度 (px)",
    "bg-type": "背景类型",
    "solid": "纯色",
    "linear-gradient": "线性渐变",
    "radial-gradient": "径向渐变",
    "bg-color": "背景颜色",
    "gradient-color-1": "渐变颜色 1",
    "gradient-color-2": "渐变颜色 2",
    "gradient-angle": "渐变角度",
    "text-color": "文字颜色",
    "custom-text": "自定义文字",
    "font-size": "字体大小 (px)",
    "auto": "自动"
  },
  "zh-TW": {
    "preset": "預設",
    "preset-placeholder": "選擇預設尺寸",
    "width": "寬度 (px)",
    "height": "高度 (px)",
    "bg-type": "背景類型",
    "solid": "純色",
    "linear-gradient": "線性漸層",
    "radial-gradient": "徑向漸層",
    "bg-color": "背景顏色",
    "gradient-color-1": "漸層顏色 1",
    "gradient-color-2": "漸層顏色 2",
    "gradient-angle": "漸層角度",
    "text-color": "文字顏色",
    "custom-text": "自訂文字",
    "font-size": "字體大小 (px)",
    "auto": "自動"
  },
  "zh-HK": {
    "preset": "預設",
    "preset-placeholder": "選擇預設尺寸",
    "width": "寬度 (px)",
    "height": "高度 (px)",
    "bg-type": "背景類型",
    "solid": "純色",
    "linear-gradient": "線性漸變",
    "radial-gradient": "徑向漸變",
    "bg-color": "背景顏色",
    "gradient-color-1": "漸變顏色 1",
    "gradient-color-2": "漸變顏色 2",
    "gradient-angle": "漸變角度",
    "text-color": "文字顏色",
    "custom-text": "自訂文字",
    "font-size": "字體大小 (px)",
    "auto": "自動"
  },
  "es": {
    "preset": "Preajuste",
    "preset-placeholder": "Seleccionar un tamaño preajustado",
    "width": "Ancho (px)",
    "height": "Alto (px)",
    "bg-type": "Tipo de fondo",
    "solid": "Sólido",
    "linear-gradient": "Degradado lineal",
    "radial-gradient": "Degradado radial",
    "bg-color": "Color de fondo",
    "gradient-color-1": "Color de degradado 1",
    "gradient-color-2": "Color de degradado 2",
    "gradient-angle": "Ángulo del degradado",
    "text-color": "Color del texto",
    "custom-text": "Texto personalizado",
    "font-size": "Tamaño de fuente (px)",
    "auto": "Automático"
  },
  "fr": {
    "preset": "Prédéfini",
    "preset-placeholder": "Sélectionner une taille prédéfinie",
    "width": "Largeur (px)",
    "height": "Hauteur (px)",
    "bg-type": "Type de fond",
    "solid": "Uni",
    "linear-gradient": "Dégradé linéaire",
    "radial-gradient": "Dégradé radial",
    "bg-color": "Couleur de fond",
    "gradient-color-1": "Couleur de dégradé 1",
    "gradient-color-2": "Couleur de dégradé 2",
    "gradient-angle": "Angle du dégradé",
    "text-color": "Couleur du texte",
    "custom-text": "Texte personnalisé",
    "font-size": "Taille de police (px)",
    "auto": "Auto"
  },
  "de": {
    "preset": "Voreinstellung",
    "preset-placeholder": "Voreingestellte Größe wählen",
    "width": "Breite (px)",
    "height": "Höhe (px)",
    "bg-type": "Hintergrundtyp",
    "solid": "Einfarbig",
    "linear-gradient": "Linearer Verlauf",
    "radial-gradient": "Radialer Verlauf",
    "bg-color": "Hintergrundfarbe",
    "gradient-color-1": "Verlaufsfarbe 1",
    "gradient-color-2": "Verlaufsfarbe 2",
    "gradient-angle": "Verlaufswinkel",
    "text-color": "Textfarbe",
    "custom-text": "Benutzerdefinierter Text",
    "font-size": "Schriftgröße (px)",
    "auto": "Auto"
  },
  "it": {
    "preset": "Preimpostazione",
    "preset-placeholder": "Seleziona una dimensione preimpostata",
    "width": "Larghezza (px)",
    "height": "Altezza (px)",
    "bg-type": "Tipo di sfondo",
    "solid": "Solido",
    "linear-gradient": "Gradiente lineare",
    "radial-gradient": "Gradiente radiale",
    "bg-color": "Colore di sfondo",
    "gradient-color-1": "Colore gradiente 1",
    "gradient-color-2": "Colore gradiente 2",
    "gradient-angle": "Angolo del gradiente",
    "text-color": "Colore del testo",
    "custom-text": "Testo personalizzato",
    "font-size": "Dimensione carattere (px)",
    "auto": "Auto"
  },
  "ja": {
    "preset": "プリセット",
    "preset-placeholder": "プリセットサイズを選択",
    "width": "幅 (px)",
    "height": "高さ (px)",
    "bg-type": "背景タイプ",
    "solid": "単色",
    "linear-gradient": "線形グラデーション",
    "radial-gradient": "放射状グラデーション",
    "bg-color": "背景色",
    "gradient-color-1": "グラデーション色 1",
    "gradient-color-2": "グラデーション色 2",
    "gradient-angle": "グラデーション角度",
    "text-color": "テキスト色",
    "custom-text": "カスタムテキスト",
    "font-size": "フォントサイズ (px)",
    "auto": "自動"
  },
  "ko": {
    "preset": "프리셋",
    "preset-placeholder": "프리셋 크기 선택",
    "width": "너비 (px)",
    "height": "높이 (px)",
    "bg-type": "배경 유형",
    "solid": "단색",
    "linear-gradient": "선형 그라데이션",
    "radial-gradient": "방사형 그라데이션",
    "bg-color": "배경색",
    "gradient-color-1": "그라데이션 색상 1",
    "gradient-color-2": "그라데이션 색상 2",
    "gradient-angle": "그라데이션 각도",
    "text-color": "텍스트 색상",
    "custom-text": "사용자 정의 텍스트",
    "font-size": "글꼴 크기 (px)",
    "auto": "자동"
  },
  "ru": {
    "preset": "Пресет",
    "preset-placeholder": "Выберите предустановленный размер",
    "width": "Ширина (px)",
    "height": "Высота (px)",
    "bg-type": "Тип фона",
    "solid": "Сплошной",
    "linear-gradient": "Линейный градиент",
    "radial-gradient": "Радиальный градиент",
    "bg-color": "Цвет фона",
    "gradient-color-1": "Цвет градиента 1",
    "gradient-color-2": "Цвет градиента 2",
    "gradient-angle": "Угол градиента",
    "text-color": "Цвет текста",
    "custom-text": "Пользовательский текст",
    "font-size": "Размер шрифта (px)",
    "auto": "Авто"
  },
  "pt": {
    "preset": "Predefinição",
    "preset-placeholder": "Selecionar tamanho predefinido",
    "width": "Largura (px)",
    "height": "Altura (px)",
    "bg-type": "Tipo de fundo",
    "solid": "Sólido",
    "linear-gradient": "Gradiente linear",
    "radial-gradient": "Gradiente radial",
    "bg-color": "Cor de fundo",
    "gradient-color-1": "Cor do gradiente 1",
    "gradient-color-2": "Cor do gradiente 2",
    "gradient-angle": "Ângulo do gradiente",
    "text-color": "Cor do texto",
    "custom-text": "Texto personalizado",
    "font-size": "Tamanho da fonte (px)",
    "auto": "Auto"
  },
  "ar": {
    "preset": "إعداد مسبق",
    "preset-placeholder": "اختر حجمًا مسبقًا",
    "width": "العرض (px)",
    "height": "الارتفاع (px)",
    "bg-type": "نوع الخلفية",
    "solid": "صلب",
    "linear-gradient": "تدرج خطي",
    "radial-gradient": "تدرج شعاعي",
    "bg-color": "لون الخلفية",
    "gradient-color-1": "لون التدرج 1",
    "gradient-color-2": "لون التدرج 2",
    "gradient-angle": "زاوية التدرج",
    "text-color": "لون النص",
    "custom-text": "نص مخصص",
    "font-size": "حجم الخط (px)",
    "auto": "تلقائي"
  },
  "hi": {
    "preset": "प्रीसेट",
    "preset-placeholder": "प्रीसेट आकार चुनें",
    "width": "चौड़ाई (px)",
    "height": "ऊंचाई (px)",
    "bg-type": "पृष्ठभूमि प्रकार",
    "solid": "ठोस",
    "linear-gradient": "रैखिक ग्रेडिएंट",
    "radial-gradient": "रेडियल ग्रेडिएंट",
    "bg-color": "पृष्ठभूमि रंग",
    "gradient-color-1": "ग्रेडिएंट रंग 1",
    "gradient-color-2": "ग्रेडिएंट रंग 2",
    "gradient-angle": "ग्रेडिएंट कोण",
    "text-color": "टेक्स्ट रंग",
    "custom-text": "कस्टम टेक्स्ट",
    "font-size": "फ़ॉन्ट आकार (px)",
    "auto": "स्वचालित"
  },
  "tr": {
    "preset": "Ön ayar",
    "preset-placeholder": "Ön ayarlı boyut seçin",
    "width": "Genişlik (px)",
    "height": "Yükseklik (px)",
    "bg-type": "Arka plan türü",
    "solid": "Düz",
    "linear-gradient": "Doğrusal degrade",
    "radial-gradient": "Radyal degrade",
    "bg-color": "Arka plan rengi",
    "gradient-color-1": "Degrade rengi 1",
    "gradient-color-2": "Degrade rengi 2",
    "gradient-angle": "Degrade açısı",
    "text-color": "Metin rengi",
    "custom-text": "Özel metin",
    "font-size": "Yazı tipi boyutu (px)",
    "auto": "Otomatik"
  },
  "nl": {
    "preset": "Voorinstelling",
    "preset-placeholder": "Selecteer een vooringestelde grootte",
    "width": "Breedte (px)",
    "height": "Hoogte (px)",
    "bg-type": "Achtergrondtype",
    "solid": "Effen",
    "linear-gradient": "Lineair verloop",
    "radial-gradient": "Radiaal verloop",
    "bg-color": "Achtergrondkleur",
    "gradient-color-1": "Verloopkleur 1",
    "gradient-color-2": "Verloopkleur 2",
    "gradient-angle": "Verloophoek",
    "text-color": "Tekstkleur",
    "custom-text": "Aangepaste tekst",
    "font-size": "Lettergrootte (px)",
    "auto": "Auto"
  },
  "sv": {
    "preset": "Förinställning",
    "preset-placeholder": "Välj en förinställd storlek",
    "width": "Bredd (px)",
    "height": "Höjd (px)",
    "bg-type": "Bakgrundstyp",
    "solid": "Enfärgad",
    "linear-gradient": "Linjär gradient",
    "radial-gradient": "Radiell gradient",
    "bg-color": "Bakgrundsfärg",
    "gradient-color-1": "Gradientfärg 1",
    "gradient-color-2": "Gradientfärg 2",
    "gradient-angle": "Gradientvinkel",
    "text-color": "Textfärg",
    "custom-text": "Anpassad text",
    "font-size": "Teckenstorlek (px)",
    "auto": "Auto"
  },
  "pl": {
    "preset": "Preset",
    "preset-placeholder": "Wybierz rozmiar predefiniowany",
    "width": "Szerokość (px)",
    "height": "Wysokość (px)",
    "bg-type": "Typ tła",
    "solid": "Jednolity",
    "linear-gradient": "Gradient liniowy",
    "radial-gradient": "Gradient radialny",
    "bg-color": "Kolor tła",
    "gradient-color-1": "Kolor gradientu 1",
    "gradient-color-2": "Kolor gradientu 2",
    "gradient-angle": "Kąt gradientu",
    "text-color": "Kolor tekstu",
    "custom-text": "Własny tekst",
    "font-size": "Rozmiar czcionki (px)",
    "auto": "Auto"
  },
  "vi": {
    "preset": "Cài đặt sẵn",
    "preset-placeholder": "Chọn kích thước cài đặt sẵn",
    "width": "Chiều rộng (px)",
    "height": "Chiều cao (px)",
    "bg-type": "Loại nền",
    "solid": "Màu đặc",
    "linear-gradient": "Gradient tuyến tính",
    "radial-gradient": "Gradient xuyên tâm",
    "bg-color": "Màu nền",
    "gradient-color-1": "Màu gradient 1",
    "gradient-color-2": "Màu gradient 2",
    "gradient-angle": "Góc gradient",
    "text-color": "Màu chữ",
    "custom-text": "Văn bản tùy chỉnh",
    "font-size": "Cỡ chữ (px)",
    "auto": "Tự động"
  },
  "th": {
    "preset": "ค่าที่ตั้งไว้ล่วงหน้า",
    "preset-placeholder": "เลือกขนาดที่ตั้งไว้ล่วงหน้า",
    "width": "ความกว้าง (px)",
    "height": "ความสูง (px)",
    "bg-type": "ประเภทพื้นหลัง",
    "solid": "สีเดียว",
    "linear-gradient": "การไล่ระดับสีเชิงเส้น",
    "radial-gradient": "การไล่ระดับสีแบบรัศมี",
    "bg-color": "สีพื้นหลัง",
    "gradient-color-1": "สีไล่ระดับ 1",
    "gradient-color-2": "สีไล่ระดับ 2",
    "gradient-angle": "มุมการไล่ระดับ",
    "text-color": "สีข้อความ",
    "custom-text": "ข้อความที่กำหนดเอง",
    "font-size": "ขนาดตัวอักษร (px)",
    "auto": "อัตโนมัติ"
  },
  "id": {
    "preset": "Preset",
    "preset-placeholder": "Pilih ukuran preset",
    "width": "Lebar (px)",
    "height": "Tinggi (px)",
    "bg-type": "Jenis latar belakang",
    "solid": "Solid",
    "linear-gradient": "Gradien linier",
    "radial-gradient": "Gradien radial",
    "bg-color": "Warna latar belakang",
    "gradient-color-1": "Warna gradien 1",
    "gradient-color-2": "Warna gradien 2",
    "gradient-angle": "Sudut gradien",
    "text-color": "Warna teks",
    "custom-text": "Teks kustom",
    "font-size": "Ukuran font (px)",
    "auto": "Otomatis"
  },
  "he": {
    "preset": "הגדרה קבועה מראש",
    "preset-placeholder": "בחר גודל קבוע מראש",
    "width": "רוחב (px)",
    "height": "גובה (px)",
    "bg-type": "סוג רקע",
    "solid": "אחיד",
    "linear-gradient": "מעבר צבע ליניארי",
    "radial-gradient": "מעבר צבע רדיאלי",
    "bg-color": "צבע רקע",
    "gradient-color-1": "צבע מעבר 1",
    "gradient-color-2": "צבע מעבר 2",
    "gradient-angle": "זווית מעבר",
    "text-color": "צבע טקסט",
    "custom-text": "טקסט מותאם אישית",
    "font-size": "גודל גופן (px)",
    "auto": "אוטומטי"
  },
  "ms": {
    "preset": "Pratetap",
    "preset-placeholder": "Pilih saiz pratetap",
    "width": "Lebar (px)",
    "height": "Tinggi (px)",
    "bg-type": "Jenis latar belakang",
    "solid": "Pepejal",
    "linear-gradient": "Kecerunan linear",
    "radial-gradient": "Kecerunan jejari",
    "bg-color": "Warna latar belakang",
    "gradient-color-1": "Warna kecerunan 1",
    "gradient-color-2": "Warna kecerunan 2",
    "gradient-angle": "Sudut kecerunan",
    "text-color": "Warna teks",
    "custom-text": "Teks tersuai",
    "font-size": "Saiz fon (px)",
    "auto": "Auto"
  },
  "no": {
    "preset": "Forhåndsinnstilling",
    "preset-placeholder": "Velg en forhåndsinnstilt størrelse",
    "width": "Bredde (px)",
    "height": "Høyde (px)",
    "bg-type": "Bakgrunnstype",
    "solid": "Ensfarget",
    "linear-gradient": "Lineær gradient",
    "radial-gradient": "Radiell gradient",
    "bg-color": "Bakgrunnsfarge",
    "gradient-color-1": "Gradientfarge 1",
    "gradient-color-2": "Gradientfarge 2",
    "gradient-angle": "Gradientvinkel",
    "text-color": "Tekstfarge",
    "custom-text": "Egendefinert tekst",
    "font-size": "Skriftstørrelse (px)",
    "auto": "Auto"
  }
}
</i18n>
