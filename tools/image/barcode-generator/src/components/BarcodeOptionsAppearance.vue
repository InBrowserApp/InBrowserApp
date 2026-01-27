<template>
  <n-form-item-gi :label="t('display-value')" :show-feedback="false">
    <n-switch v-model:value="displayValue" />
  </n-form-item-gi>

  <n-form-item-gi :label="t('text-align')" :show-feedback="false">
    <n-select v-model:value="textAlign" :options="textAlignOptions" />
  </n-form-item-gi>

  <n-form-item-gi :label="t('text-position')" :show-feedback="false">
    <n-select v-model:value="textPosition" :options="textPositionOptions" />
  </n-form-item-gi>

  <n-form-item-gi :label="t('font-size')" :show-feedback="false">
    <n-slider v-model:value="fontSize" :min="8" :max="48" :step="1" />
  </n-form-item-gi>

  <n-form-item-gi :label="t('line-color')" :show-feedback="false">
    <n-color-picker v-model:value="lineColor" :modes="['hex']" size="small" />
  </n-form-item-gi>

  <n-form-item-gi :label="t('background')" :show-feedback="false">
    <n-color-picker v-model:value="background" :modes="['hex']" size="small" />
  </n-form-item-gi>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NColorPicker, NFormItemGi, NSelect, NSlider, NSwitch } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const displayValue = defineModel<boolean>('display-value', { required: true })
const textAlign = defineModel<'left' | 'center' | 'right'>('text-align', { required: true })
const textPosition = defineModel<'top' | 'bottom'>('text-position', { required: true })
const fontSize = defineModel<number>('font-size', { required: true })
const lineColor = defineModel<string>('line-color', { required: true })
const background = defineModel<string>('background', { required: true })

const { t } = useI18n({ useScope: 'local' })

const textAlignOptions = computed(() => [
  { label: t('left'), value: 'left' },
  { label: t('center'), value: 'center' },
  { label: t('right'), value: 'right' },
])

const textPositionOptions = computed(() => [
  { label: t('top'), value: 'top' },
  { label: t('bottom'), value: 'bottom' },
])
</script>

<i18n lang="json">
{
  "en": {
    "display-value": "Display value",
    "text-align": "Text align",
    "text-position": "Text position",
    "font-size": "Font size",
    "line-color": "Line color",
    "background": "Background",
    "left": "Left",
    "center": "Center",
    "right": "Right",
    "top": "Top",
    "bottom": "Bottom"
  },
  "zh": {
    "display-value": "显示文字",
    "text-align": "文字对齐",
    "text-position": "文字位置",
    "font-size": "字体大小",
    "line-color": "线条颜色",
    "background": "背景色",
    "left": "左",
    "center": "中",
    "right": "右",
    "top": "上",
    "bottom": "下"
  },
  "zh-CN": {
    "display-value": "显示文字",
    "text-align": "文字对齐",
    "text-position": "文字位置",
    "font-size": "字体大小",
    "line-color": "线条颜色",
    "background": "背景色",
    "left": "左",
    "center": "中",
    "right": "右",
    "top": "上",
    "bottom": "下"
  },
  "zh-TW": {
    "display-value": "顯示文字",
    "text-align": "文字對齊",
    "text-position": "文字位置",
    "font-size": "字體大小",
    "line-color": "線條顏色",
    "background": "背景色",
    "left": "左",
    "center": "中",
    "right": "右",
    "top": "上",
    "bottom": "下"
  },
  "zh-HK": {
    "display-value": "顯示文字",
    "text-align": "文字對齊",
    "text-position": "文字位置",
    "font-size": "字體大小",
    "line-color": "線條顏色",
    "background": "背景色",
    "left": "左",
    "center": "中",
    "right": "右",
    "top": "上",
    "bottom": "下"
  },
  "es": {
    "display-value": "Mostrar valor",
    "text-align": "Alineación",
    "text-position": "Posición del texto",
    "font-size": "Tamaño de fuente",
    "line-color": "Color de línea",
    "background": "Fondo",
    "left": "Izquierda",
    "center": "Centro",
    "right": "Derecha",
    "top": "Arriba",
    "bottom": "Abajo"
  },
  "fr": {
    "display-value": "Afficher la valeur",
    "text-align": "Alignement",
    "text-position": "Position du texte",
    "font-size": "Taille de police",
    "line-color": "Couleur des lignes",
    "background": "Arrière-plan",
    "left": "Gauche",
    "center": "Centre",
    "right": "Droite",
    "top": "Haut",
    "bottom": "Bas"
  },
  "de": {
    "display-value": "Wert anzeigen",
    "text-align": "Textausrichtung",
    "text-position": "Textposition",
    "font-size": "Schriftgröße",
    "line-color": "Linienfarbe",
    "background": "Hintergrund",
    "left": "Links",
    "center": "Mitte",
    "right": "Rechts",
    "top": "Oben",
    "bottom": "Unten"
  },
  "it": {
    "display-value": "Mostra valore",
    "text-align": "Allineamento",
    "text-position": "Posizione del testo",
    "font-size": "Dimensione carattere",
    "line-color": "Colore linee",
    "background": "Sfondo",
    "left": "Sinistra",
    "center": "Centro",
    "right": "Destra",
    "top": "Alto",
    "bottom": "Basso"
  },
  "ja": {
    "display-value": "値を表示",
    "text-align": "配置",
    "text-position": "テキスト位置",
    "font-size": "フォントサイズ",
    "line-color": "線の色",
    "background": "背景",
    "left": "左",
    "center": "中央",
    "right": "右",
    "top": "上",
    "bottom": "下"
  },
  "ko": {
    "display-value": "값 표시",
    "text-align": "정렬",
    "text-position": "텍스트 위치",
    "font-size": "글꼴 크기",
    "line-color": "선 색상",
    "background": "배경",
    "left": "왼쪽",
    "center": "가운데",
    "right": "오른쪽",
    "top": "위",
    "bottom": "아래"
  },
  "ru": {
    "display-value": "Показывать значение",
    "text-align": "Выравнивание",
    "text-position": "Положение текста",
    "font-size": "Размер шрифта",
    "line-color": "Цвет линий",
    "background": "Фон",
    "left": "Слева",
    "center": "По центру",
    "right": "Справа",
    "top": "Сверху",
    "bottom": "Снизу"
  },
  "pt": {
    "display-value": "Exibir valor",
    "text-align": "Alinhamento",
    "text-position": "Posição do texto",
    "font-size": "Tamanho da fonte",
    "line-color": "Cor das linhas",
    "background": "Fundo",
    "left": "Esquerda",
    "center": "Centro",
    "right": "Direita",
    "top": "Topo",
    "bottom": "Inferior"
  },
  "ar": {
    "display-value": "عرض القيمة",
    "text-align": "محاذاة النص",
    "text-position": "موضع النص",
    "font-size": "حجم الخط",
    "line-color": "لون الخطوط",
    "background": "الخلفية",
    "left": "يسار",
    "center": "وسط",
    "right": "يمين",
    "top": "أعلى",
    "bottom": "أسفل"
  },
  "hi": {
    "display-value": "मान दिखाएं",
    "text-align": "टेक्स्ट एलाइन",
    "text-position": "टेक्स्ट स्थिति",
    "font-size": "फ़ॉन्ट आकार",
    "line-color": "लाइन रंग",
    "background": "पृष्ठभूमि",
    "left": "बाएँ",
    "center": "मध्य",
    "right": "दाएँ",
    "top": "ऊपर",
    "bottom": "नीचे"
  },
  "tr": {
    "display-value": "Değeri göster",
    "text-align": "Hizalama",
    "text-position": "Metin konumu",
    "font-size": "Yazı tipi boyutu",
    "line-color": "Çizgi rengi",
    "background": "Arka plan",
    "left": "Sol",
    "center": "Orta",
    "right": "Sağ",
    "top": "Üst",
    "bottom": "Alt"
  },
  "nl": {
    "display-value": "Waarde weergeven",
    "text-align": "Uitlijning",
    "text-position": "Tekstpositie",
    "font-size": "Lettergrootte",
    "line-color": "Lijnkleur",
    "background": "Achtergrond",
    "left": "Links",
    "center": "Midden",
    "right": "Rechts",
    "top": "Boven",
    "bottom": "Onder"
  },
  "sv": {
    "display-value": "Visa värde",
    "text-align": "Justering",
    "text-position": "Textposition",
    "font-size": "Teckenstorlek",
    "line-color": "Linjefärg",
    "background": "Bakgrund",
    "left": "Vänster",
    "center": "Mitten",
    "right": "Höger",
    "top": "Topp",
    "bottom": "Botten"
  },
  "pl": {
    "display-value": "Pokaż wartość",
    "text-align": "Wyrównanie",
    "text-position": "Pozycja tekstu",
    "font-size": "Rozmiar czcionki",
    "line-color": "Kolor linii",
    "background": "Tło",
    "left": "Lewo",
    "center": "Środek",
    "right": "Prawo",
    "top": "Góra",
    "bottom": "Dół"
  },
  "vi": {
    "display-value": "Hiển thị giá trị",
    "text-align": "Căn chỉnh",
    "text-position": "Vị trí văn bản",
    "font-size": "Cỡ chữ",
    "line-color": "Màu đường",
    "background": "Nền",
    "left": "Trái",
    "center": "Giữa",
    "right": "Phải",
    "top": "Trên",
    "bottom": "Dưới"
  },
  "th": {
    "display-value": "แสดงค่า",
    "text-align": "การจัดตำแหน่ง",
    "text-position": "ตำแหน่งข้อความ",
    "font-size": "ขนาดแบบอักษร",
    "line-color": "สีเส้น",
    "background": "พื้นหลัง",
    "left": "ซ้าย",
    "center": "กลาง",
    "right": "ขวา",
    "top": "บน",
    "bottom": "ล่าง"
  },
  "id": {
    "display-value": "Tampilkan nilai",
    "text-align": "Perataan",
    "text-position": "Posisi teks",
    "font-size": "Ukuran font",
    "line-color": "Warna garis",
    "background": "Latar belakang",
    "left": "Kiri",
    "center": "Tengah",
    "right": "Kanan",
    "top": "Atas",
    "bottom": "Bawah"
  },
  "he": {
    "display-value": "הצג ערך",
    "text-align": "יישור",
    "text-position": "מיקום טקסט",
    "font-size": "גודל גופן",
    "line-color": "צבע קווים",
    "background": "רקע",
    "left": "שמאל",
    "center": "מרכז",
    "right": "ימין",
    "top": "למעלה",
    "bottom": "למטה"
  },
  "ms": {
    "display-value": "Papar nilai",
    "text-align": "Jajaran",
    "text-position": "Kedudukan teks",
    "font-size": "Saiz fon",
    "line-color": "Warna garisan",
    "background": "Latar belakang",
    "left": "Kiri",
    "center": "Tengah",
    "right": "Kanan",
    "top": "Atas",
    "bottom": "Bawah"
  },
  "no": {
    "display-value": "Vis verdi",
    "text-align": "Justering",
    "text-position": "Tekstposisjon",
    "font-size": "Skriftstørrelse",
    "line-color": "Linjefarge",
    "background": "Bakgrunn",
    "left": "Venstre",
    "center": "Midten",
    "right": "Høyre",
    "top": "Topp",
    "bottom": "Bunn"
  }
}
</i18n>
