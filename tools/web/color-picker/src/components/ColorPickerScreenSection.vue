<template>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex align="center" justify="space-between" :wrap="true" class="section-row">
        <div class="section-copy">
          <div class="section-title">{{ t('screenTitle') }}</div>
          <div class="section-subtitle">{{ t('screenDescription') }}</div>
        </div>
        <n-button type="primary" :disabled="!isEyeDropperSupported" @click="onPick">
          <template #icon>
            <n-icon>
              <EyedropperIcon />
            </n-icon>
          </template>
          {{ t('screenButton') }}
        </n-button>
      </n-flex>
      <n-alert v-if="!isEyeDropperSupported" type="warning" :show-icon="false">
        {{ t('screenUnsupported') }}
      </n-alert>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NAlert, NButton, NFlex, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import EyedropperIcon from '@vicons/fluent/Eyedropper24Filled'
import { ToolSection } from '@shared/ui/tool'

defineProps<{
  isEyeDropperSupported: boolean
}>()

const emit = defineEmits<{
  (event: 'pick'): void
}>()

const { t } = useI18n()

function onPick() {
  emit('pick')
}
</script>

<style scoped>
.section-row {
  gap: 16px;
}

.section-copy {
  max-width: 520px;
}

.section-title {
  font-weight: 600;
  font-size: 16px;
}

.section-subtitle {
  font-size: 13px;
  color: var(--n-text-color-3);
}
</style>

<i18n lang="json">
{
  "en": {
    "screenTitle": "Screen Color Picker",
    "screenDescription": "Use the browser eyedropper to sample any pixel on your screen.",
    "screenButton": "Pick Screen Color",
    "screenUnsupported": "Screen color picking is not supported in this browser."
  },
  "zh": {
    "screenTitle": "屏幕取色",
    "screenDescription": "使用浏览器取色器采样屏幕上的任意像素。",
    "screenButton": "取屏幕颜色",
    "screenUnsupported": "当前浏览器不支持屏幕取色。"
  },
  "zh-CN": {
    "screenTitle": "屏幕取色",
    "screenDescription": "使用浏览器取色器采样屏幕上的任意像素。",
    "screenButton": "取屏幕颜色",
    "screenUnsupported": "当前浏览器不支持屏幕取色。"
  },
  "zh-TW": {
    "screenTitle": "螢幕取色",
    "screenDescription": "使用瀏覽器取色器取樣螢幕上的任何像素。",
    "screenButton": "取螢幕顏色",
    "screenUnsupported": "此瀏覽器不支援螢幕取色。"
  },
  "zh-HK": {
    "screenTitle": "螢幕取色",
    "screenDescription": "使用瀏覽器取色器取樣螢幕上的任何像素。",
    "screenButton": "取螢幕顏色",
    "screenUnsupported": "此瀏覽器不支援螢幕取色。"
  },
  "es": {
    "screenTitle": "Selector de color de pantalla",
    "screenDescription": "Usa la pipeta del navegador para muestrear cualquier píxel de la pantalla.",
    "screenButton": "Tomar color de pantalla",
    "screenUnsupported": "La selección de color de pantalla no es compatible con este navegador."
  },
  "fr": {
    "screenTitle": "Pipette de couleur d’écran",
    "screenDescription": "Utilisez la pipette du navigateur pour échantillonner n’importe quel pixel de l’écran.",
    "screenButton": "Prendre la couleur de l’écran",
    "screenUnsupported": "La sélection de couleur à l’écran n’est pas prise en charge dans ce navigateur."
  },
  "de": {
    "screenTitle": "Bildschirm-Farbpipette",
    "screenDescription": "Verwenden Sie die Browser-Pipette, um beliebige Pixel auf dem Bildschirm zu erfassen.",
    "screenButton": "Bildschirmfarbe wählen",
    "screenUnsupported": "Bildschirm-Farbaufnahme wird in diesem Browser nicht unterstützt."
  },
  "it": {
    "screenTitle": "Contagocce schermo",
    "screenDescription": "Usa il contagocce del browser per campionare qualsiasi pixel sullo schermo.",
    "screenButton": "Scegli colore dallo schermo",
    "screenUnsupported": "Il prelievo colore dallo schermo non è supportato in questo browser."
  },
  "ja": {
    "screenTitle": "画面カラーピッカー",
    "screenDescription": "ブラウザのスポイトで画面上の任意のピクセルをサンプルします。",
    "screenButton": "画面の色を取得",
    "screenUnsupported": "このブラウザでは画面の色取得はサポートされていません。"
  },
  "ko": {
    "screenTitle": "화면 색상 선택기",
    "screenDescription": "브라우저 스포이드를 사용해 화면의 모든 픽셀을 샘플링합니다.",
    "screenButton": "화면 색상 선택",
    "screenUnsupported": "이 브라우저는 화면 색상 선택을 지원하지 않습니다."
  },
  "ru": {
    "screenTitle": "Пипетка экрана",
    "screenDescription": "Используйте пипетку браузера, чтобы выбрать любой пиксель на экране.",
    "screenButton": "Выбрать цвет с экрана",
    "screenUnsupported": "Выбор цвета с экрана не поддерживается в этом браузере."
  },
  "pt": {
    "screenTitle": "Seletor de cor da tela",
    "screenDescription": "Use o conta-gotas do navegador para amostrar qualquer pixel da tela.",
    "screenButton": "Capturar cor da tela",
    "screenUnsupported": "A captura de cor da tela não é suportada neste navegador."
  },
  "ar": {
    "screenTitle": "منتقي ألوان الشاشة",
    "screenDescription": "استخدم القطّارة في المتصفح لالتقاط أي بكسل من الشاشة.",
    "screenButton": "التقاط لون الشاشة",
    "screenUnsupported": "التقاط ألوان الشاشة غير مدعوم في هذا المتصفح."
  },
  "hi": {
    "screenTitle": "स्क्रीन कलर पिकर",
    "screenDescription": "ब्राउज़र आईड्रॉपर से स्क्रीन पर किसी भी पिक्सेल को सैंपल करें।",
    "screenButton": "स्क्रीन रंग चुनें",
    "screenUnsupported": "इस ब्राउज़र में स्क्रीन रंग चुनना समर्थित नहीं है।"
  },
  "tr": {
    "screenTitle": "Ekran Renk Seçici",
    "screenDescription": "Tarayıcı damlalığını kullanarak ekrandaki herhangi bir pikseli örnekleyin.",
    "screenButton": "Ekran Rengi Seç",
    "screenUnsupported": "Bu tarayıcıda ekran renk seçimi desteklenmiyor."
  },
  "nl": {
    "screenTitle": "Schermkleurpipet",
    "screenDescription": "Gebruik de browserpipet om een willekeurige pixel op het scherm te samplen.",
    "screenButton": "Schermkleur kiezen",
    "screenUnsupported": "Schermkleur kiezen wordt niet ondersteund in deze browser."
  },
  "sv": {
    "screenTitle": "Skärmfärgväljare",
    "screenDescription": "Använd webbläsarens pipett för att sampla valfri pixel på skärmen.",
    "screenButton": "Välj skärmfärg",
    "screenUnsupported": "Skärmfärgväljning stöds inte i den här webbläsaren."
  },
  "pl": {
    "screenTitle": "Pipeta ekranu",
    "screenDescription": "Użyj pipety przeglądarki, aby pobrać dowolny piksel z ekranu.",
    "screenButton": "Pobierz kolor z ekranu",
    "screenUnsupported": "Pobieranie koloru z ekranu nie jest obsługiwane w tej przeglądarce."
  },
  "vi": {
    "screenTitle": "Bộ chọn màu màn hình",
    "screenDescription": "Dùng ống nhỏ giọt của trình duyệt để lấy mẫu bất kỳ pixel nào trên màn hình.",
    "screenButton": "Chọn màu màn hình",
    "screenUnsupported": "Trình duyệt này không hỗ trợ chọn màu màn hình."
  },
  "th": {
    "screenTitle": "ตัวเลือกสีจากหน้าจอ",
    "screenDescription": "ใช้หลอดดูดสีของเบราว์เซอร์เพื่อสุ่มตัวอย่างพิกเซลบนหน้าจอ",
    "screenButton": "เลือกสีจากหน้าจอ",
    "screenUnsupported": "เบราว์เซอร์นี้ไม่รองรับการเลือกสีจากหน้าจอ"
  },
  "id": {
    "screenTitle": "Pemilih warna layar",
    "screenDescription": "Gunakan eyedropper browser untuk mengambil sampel piksel di layar.",
    "screenButton": "Pilih warna layar",
    "screenUnsupported": "Pemilihan warna layar tidak didukung di browser ini."
  },
  "he": {
    "screenTitle": "בוחר צבע מהמסך",
    "screenDescription": "השתמש בטפטפת של הדפדפן כדי לדגום כל פיקסל על המסך.",
    "screenButton": "בחר צבע מהמסך",
    "screenUnsupported": "בחירת צבע מהמסך אינה נתמכת בדפדפן זה."
  },
  "ms": {
    "screenTitle": "Pemilih warna skrin",
    "screenDescription": "Gunakan eyedropper pelayar untuk mengambil sampel mana-mana piksel pada skrin.",
    "screenButton": "Pilih warna skrin",
    "screenUnsupported": "Pemilihan warna skrin tidak disokong dalam pelayar ini."
  },
  "no": {
    "screenTitle": "Skjermfargevelger",
    "screenDescription": "Bruk nettleserens pipette for å hente en piksel fra skjermen.",
    "screenButton": "Velg skjermfarge",
    "screenUnsupported": "Skjermfargevelging støttes ikke i denne nettleseren."
  }
}
</i18n>
