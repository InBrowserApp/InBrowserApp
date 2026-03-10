<template>
  <section data-test="settings-section">
    <ToolSection>
      <n-flex vertical :size="12">
        <n-grid cols="1 s:2" responsive="screen" :x-gap="24" :y-gap="20">
          <n-gi>
            <n-flex vertical :size="12">
              <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
              <n-form label-placement="top">
                <n-grid :cols="24" :x-gap="12" :y-gap="12">
                  <n-gi :span="24">
                    <n-form-item :label="t('pageRanges')">
                      <n-input
                        :value="rangeInput"
                        data-test="range-input"
                        :placeholder="t('pageRangesPlaceholder')"
                        :disabled="isGenerating"
                        @update:value="emit('update:range-input', $event)"
                      />
                    </n-form-item>
                  </n-gi>

                  <n-gi :span="12">
                    <n-form-item :label="t('startNumber')">
                      <n-input-number
                        data-test="start-number-input"
                        style="width: 100%"
                        :value="startNumber"
                        :min="1"
                        :step="1"
                        :disabled="isGenerating"
                        @update:value="emit('update:start-number', $event)"
                      />
                    </n-form-item>
                  </n-gi>

                  <n-gi :span="12">
                    <n-form-item :label="t('format')">
                      <n-select
                        :value="format"
                        :options="formatOptions"
                        :disabled="isGenerating"
                        @update:value="handleFormatChange"
                      />
                    </n-form-item>
                  </n-gi>

                  <n-gi :span="12">
                    <n-form-item :label="t('position')">
                      <n-select
                        :value="position"
                        :options="positionOptions"
                        :disabled="isGenerating"
                        @update:value="handlePositionChange"
                      />
                    </n-form-item>
                  </n-gi>

                  <n-gi :span="12">
                    <n-form-item :label="t('fontFamily')">
                      <n-select
                        data-test="font-family-select"
                        :value="fontFamily"
                        :options="fontFamilyOptions"
                        :render-label="renderFontFamilyOptionLabel"
                        :disabled="isGenerating"
                        @update:value="handleFontFamilyChange"
                      />
                    </n-form-item>
                  </n-gi>

                  <n-gi :span="12">
                    <n-form-item :label="t('fontSize')">
                      <n-input-number
                        data-test="font-size-input"
                        style="width: 100%"
                        :value="fontSize"
                        :min="1"
                        :step="1"
                        :disabled="isGenerating"
                        @update:value="emit('update:font-size', $event)"
                      />
                    </n-form-item>
                  </n-gi>

                  <n-gi :span="12">
                    <n-form-item :label="t('horizontalMargin')">
                      <n-input-number
                        data-test="margin-x-input"
                        style="width: 100%"
                        :value="marginX"
                        :min="0"
                        :step="1"
                        :disabled="isGenerating"
                        @update:value="emit('update:margin-x', $event)"
                      />
                    </n-form-item>
                  </n-gi>

                  <n-gi :span="12">
                    <n-form-item :label="t('verticalMargin')">
                      <n-input-number
                        data-test="margin-y-input"
                        style="width: 100%"
                        :value="marginY"
                        :min="0"
                        :step="1"
                        :disabled="isGenerating"
                        @update:value="emit('update:margin-y', $event)"
                      />
                    </n-form-item>
                  </n-gi>
                </n-grid>
              </n-form>
            </n-flex>
          </n-gi>

          <n-gi>
            <PDFPageNumberPreview
              :file="file"
              :range-input="rangeInput"
              :range-error-code="rangeErrorCode"
              :start-number="startNumber"
              :format="format"
              :font-family="fontFamily"
              :position="position"
              :font-size="fontSize"
              :margin-x="marginX"
              :margin-y="marginY"
              :page-count="pageCount"
            />
          </n-gi>
        </n-grid>

        <PDFPageNumberRangeErrorAlert :range-error-code="rangeErrorCode" />
      </n-flex>
    </ToolSection>
  </section>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SelectOption } from 'naive-ui'
import { NFlex, NForm, NFormItem, NGi, NGrid, NInput, NInputNumber, NSelect } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { PageNumberFontFamily, PageNumberFormat, PageNumberPosition } from '../types'
import { resolvePreviewFontFamily } from '../utils/page-number-font'
import PDFPageNumberPreview from './PDFPageNumberPreview.vue'
import PDFPageNumberRangeErrorAlert from './PDFPageNumberRangeErrorAlert.vue'
import { resolvePageNumberOptionLabels } from './page-number-option-labels'

defineProps<{
  file: File | null
  pageCount: number
  isGenerating: boolean
  rangeInput: string
  startNumber: number
  format: PageNumberFormat
  fontFamily: PageNumberFontFamily
  position: PageNumberPosition
  fontSize: number
  marginX: number
  marginY: number
  rangeErrorCode: string
}>()

const emit = defineEmits<{
  (event: 'update:range-input', value: string): void
  (event: 'update:start-number', value: number | null): void
  (event: 'update:format', value: PageNumberFormat): void
  (event: 'update:font-family', value: PageNumberFontFamily): void
  (event: 'update:position', value: PageNumberPosition): void
  (event: 'update:font-size', value: number | null): void
  (event: 'update:margin-x', value: number | null): void
  (event: 'update:margin-y', value: number | null): void
}>()

const { t, locale } = useI18n({ useScope: 'local' })

const optionLabels = computed(() => resolvePageNumberOptionLabels(locale.value))

const formatOptions = computed<Array<{ label: string; value: PageNumberFormat }>>(() => [
  { label: `# ${optionLabels.value.formatSimple} (n)`, value: 'n' },
  { label: `# ${optionLabels.value.formatWithTotal} (n/total)`, value: 'n-total' },
])

type FontFamilyOption = {
  label: string
  value: PageNumberFontFamily
  previewFontFamily: string
}

const fontFamilyOptions = computed<FontFamilyOption[]>(() => [
  {
    label: `${t('fontFamilySerif')} (Times Roman)`,
    value: 'serif',
    previewFontFamily: resolvePreviewFontFamily('serif'),
  },
  {
    label: `${t('fontFamilySans')} (Helvetica)`,
    value: 'sans-serif',
    previewFontFamily: resolvePreviewFontFamily('sans-serif'),
  },
])

const positionOptions = computed<Array<{ label: string; value: PageNumberPosition }>>(() => [
  { label: `↖ ${optionLabels.value.topLeft}`, value: 'top-left' },
  { label: `↑ ${optionLabels.value.topCenter}`, value: 'top-center' },
  { label: `↗ ${optionLabels.value.topRight}`, value: 'top-right' },
  { label: `↙ ${optionLabels.value.bottomLeft}`, value: 'bottom-left' },
  { label: `↓ ${optionLabels.value.bottomCenter}`, value: 'bottom-center' },
  { label: `↘ ${optionLabels.value.bottomRight}`, value: 'bottom-right' },
])

const handleFormatChange = (value: string): void => {
  emit('update:format', value as PageNumberFormat)
}

const renderFontFamilyOptionLabel = (option: SelectOption): ReturnType<typeof h> => {
  const item = option as FontFamilyOption
  return h(
    'span',
    {
      style: {
        fontFamily: item.previewFontFamily,
      },
    },
    item.label,
  )
}

const handleFontFamilyChange = (value: string): void => {
  emit('update:font-family', value as PageNumberFontFamily)
}

const handlePositionChange = (value: string): void => {
  emit('update:position', value as PageNumberPosition)
}
</script>

<!-- prettier-ignore -->
<i18n lang="json">
{
  "en": {"title":"Settings","pageRanges":"Page ranges","pageRangesPlaceholder":"Examples: 1-3,5,8-10","startNumber":"Start Number","format":"Output format","position":"Position","fontSize":"Font size","horizontalMargin":"Horizontal Margin","verticalMargin":"Vertical Margin","fontFamily":"Font family","fontFamilySans":"Sans serif","fontFamilySerif":"Serif"},
  "zh": {"title":"设置","pageRanges":"页面范围","pageRangesPlaceholder":"示例：1-3,5,8-10","startNumber":"起始编号","format":"输出格式","position":"位置","fontSize":"字号","horizontalMargin":"水平边距","verticalMargin":"垂直边距","fontFamily":"字体家族","fontFamilySans":"无衬线","fontFamilySerif":"衬线"},
  "zh-CN": {"title":"设置","pageRanges":"页面范围","pageRangesPlaceholder":"示例：1-3,5,8-10","startNumber":"起始编号","format":"输出格式","position":"位置","fontSize":"字号","horizontalMargin":"水平边距","verticalMargin":"垂直边距","fontFamily":"字体家族","fontFamilySans":"无衬线","fontFamilySerif":"衬线"},
  "zh-TW": {"title":"設定","pageRanges":"頁面範圍","pageRangesPlaceholder":"範例：1-3,5,8-10","startNumber":"起始編號","format":"輸出格式","position":"位置","fontSize":"字級","horizontalMargin":"水平邊距","verticalMargin":"垂直邊距","fontFamily":"字體家族","fontFamilySans":"無襯線","fontFamilySerif":"襯線"},
  "zh-HK": {"title":"設定","pageRanges":"頁面範圍","pageRangesPlaceholder":"範例：1-3,5,8-10","startNumber":"起始編號","format":"輸出格式","position":"位置","fontSize":"字級","horizontalMargin":"水平邊距","verticalMargin":"垂直邊距","fontFamily":"字體家族","fontFamilySans":"無襯線","fontFamilySerif":"襯線"},
  "es": {"title":"Configuración","pageRanges":"Rangos de páginas","pageRangesPlaceholder":"Ejemplos: 1-3,5,8-10","startNumber":"Número inicial","format":"Formato de salida","position":"Posición","fontSize":"Tamaño de fuente","horizontalMargin":"Margen horizontal","verticalMargin":"Margen vertical","fontFamily":"Familia tipográfica","fontFamilySans":"Sans serif","fontFamilySerif":"Serif"},
  "fr": {"title":"Paramètres","pageRanges":"Plages de pages","pageRangesPlaceholder":"Exemples : 1-3,5,8-10","startNumber":"Numéro de départ","format":"Format de sortie","position":"Position","fontSize":"Taille de police","horizontalMargin":"Marge horizontale","verticalMargin":"Marge verticale","fontFamily":"Famille de police","fontFamilySans":"Sans serif","fontFamilySerif":"Serif"},
  "de": {"title":"Einstellungen","pageRanges":"Seitenbereiche","pageRangesPlaceholder":"Beispiele: 1-3,5,8-10","startNumber":"Startnummer","format":"Ausgabeformat","position":"Position","fontSize":"Schriftgröße","horizontalMargin":"Horizontaler Rand","verticalMargin":"Vertikaler Rand","fontFamily":"Schriftfamilie","fontFamilySans":"Sans Serif","fontFamilySerif":"Serif"},
  "it": {"title":"Impostazioni","pageRanges":"Intervalli di pagine","pageRangesPlaceholder":"Esempi: 1-3,5,8-10","startNumber":"Numero iniziale","format":"Formato di output","position":"Posizione","fontSize":"Dimensione font","horizontalMargin":"Margine orizzontale","verticalMargin":"Margine verticale","fontFamily":"Famiglia di caratteri","fontFamilySans":"Sans serif","fontFamilySerif":"Serif"},
  "ja": {"title":"設定","pageRanges":"ページ範囲","pageRangesPlaceholder":"例: 1-3,5,8-10","startNumber":"開始番号","format":"出力形式","position":"位置","fontSize":"フォントサイズ","horizontalMargin":"水平余白","verticalMargin":"垂直余白","fontFamily":"フォントファミリー","fontFamilySans":"サンセリフ","fontFamilySerif":"セリフ"},
  "ko": {"title":"설정","pageRanges":"페이지 범위","pageRangesPlaceholder":"예: 1-3,5,8-10","startNumber":"시작 번호","format":"출력 형식","position":"위치","fontSize":"글꼴 크기","horizontalMargin":"가로 여백","verticalMargin":"세로 여백","fontFamily":"글꼴 계열","fontFamilySans":"산세리프","fontFamilySerif":"세리프"},
  "ru": {"title":"Настройки","pageRanges":"Диапазоны страниц","pageRangesPlaceholder":"Примеры: 1-3,5,8-10","startNumber":"Начальный номер","format":"Формат вывода","position":"Позиция","fontSize":"Размер шрифта","horizontalMargin":"Горизонтальный отступ","verticalMargin":"Вертикальный отступ","fontFamily":"Семейство шрифта","fontFamilySans":"Без засечек","fontFamilySerif":"С засечками"},
  "pt": {"title":"Configurações","pageRanges":"Intervalos de páginas","pageRangesPlaceholder":"Exemplos: 1-3,5,8-10","startNumber":"Número inicial","format":"Formato de saída","position":"Posição","fontSize":"Tamanho da fonte","horizontalMargin":"Margem horizontal","verticalMargin":"Margem vertical","fontFamily":"Família da fonte","fontFamilySans":"Sem serifa","fontFamilySerif":"Com serifa"},
  "ar": {"title":"الإعدادات","pageRanges":"نطاق الصفحات","pageRangesPlaceholder":"أمثلة: 1-3,5,8-10","startNumber":"رقم البداية","format":"تنسيق الإخراج","position":"الموضع","fontSize":"حجم الخط","horizontalMargin":"الهامش الأفقي","verticalMargin":"الهامش العمودي","fontFamily":"عائلة الخط","fontFamilySans":"Sans serif","fontFamilySerif":"Serif"},
  "hi": {"title":"सेटिंग्स","pageRanges":"पेज रेंज","pageRangesPlaceholder":"उदाहरण: 1-3,5,8-10","startNumber":"प्रारंभिक संख्या","format":"आउटपुट प्रारूप","position":"स्थिति","fontSize":"फ़ॉन्ट आकार","horizontalMargin":"क्षैतिज मार्जिन","verticalMargin":"ऊर्ध्वाधर मार्जिन","fontFamily":"फ़ॉन्ट परिवार","fontFamilySans":"सैन्स-सेरिफ़","fontFamilySerif":"सेरिफ़"},
  "tr": {"title":"Ayarlar","pageRanges":"Sayfa aralıkları","pageRangesPlaceholder":"Örnekler: 1-3,5,8-10","startNumber":"Başlangıç numarası","format":"Çıkış formatı","position":"Konum","fontSize":"Yazı tipi boyutu","horizontalMargin":"Yatay kenar boşluğu","verticalMargin":"Dikey kenar boşluğu","fontFamily":"Yazı tipi ailesi","fontFamilySans":"Sans serif","fontFamilySerif":"Serif"},
  "nl": {"title":"Instellingen","pageRanges":"Paginabereiken","pageRangesPlaceholder":"Voorbeelden: 1-3,5,8-10","startNumber":"Startnummer","format":"Uitvoerformaat","position":"Positie","fontSize":"Lettergrootte","horizontalMargin":"Horizontale marge","verticalMargin":"Verticale marge","fontFamily":"Lettertypefamilie","fontFamilySans":"Sans serif","fontFamilySerif":"Serif"},
  "sv": {"title":"Inställningar","pageRanges":"Sidintervall","pageRangesPlaceholder":"Exempel: 1-3,5,8-10","startNumber":"Startnummer","format":"Utdataformat","position":"Position","fontSize":"Teckenstorlek","horizontalMargin":"Horisontell marginal","verticalMargin":"Vertikal marginal","fontFamily":"Typsnittsfamilj","fontFamilySans":"Sans serif","fontFamilySerif":"Serif"},
  "pl": {"title":"Ustawienia","pageRanges":"Zakresy stron","pageRangesPlaceholder":"Przykłady: 1-3,5,8-10","startNumber":"Numer początkowy","format":"Format wyjściowy","position":"Pozycja","fontSize":"Rozmiar czcionki","horizontalMargin":"Margines poziomy","verticalMargin":"Margines pionowy","fontFamily":"Rodzina czcionek","fontFamilySans":"Bezszeryfowa","fontFamilySerif":"Szeryfowa"},
  "vi": {"title":"Cài đặt","pageRanges":"Dải trang","pageRangesPlaceholder":"Ví dụ: 1-3,5,8-10","startNumber":"Số bắt đầu","format":"Định dạng đầu ra","position":"Vị trí","fontSize":"Cỡ chữ","horizontalMargin":"Lề ngang","verticalMargin":"Lề dọc","fontFamily":"Họ phông chữ","fontFamilySans":"Không chân","fontFamilySerif":"Có chân"},
  "th": {"title":"การตั้งค่า","pageRanges":"ช่วงหน้า","pageRangesPlaceholder":"ตัวอย่าง: 1-3,5,8-10","startNumber":"เลขเริ่มต้น","format":"รูปแบบผลลัพธ์","position":"ตำแหน่ง","fontSize":"ขนาดตัวอักษร","horizontalMargin":"ระยะขอบแนวนอน","verticalMargin":"ระยะขอบแนวตั้ง","fontFamily":"ตระกูลแบบอักษร","fontFamilySans":"ไม่มีเชิง","fontFamilySerif":"มีเชิง"},
  "id": {"title":"Pengaturan","pageRanges":"Rentang halaman","pageRangesPlaceholder":"Contoh: 1-3,5,8-10","startNumber":"Nomor awal","format":"Format output","position":"Posisi","fontSize":"Ukuran font","horizontalMargin":"Margin horizontal","verticalMargin":"Margin vertikal","fontFamily":"Keluarga font","fontFamilySans":"Sans serif","fontFamilySerif":"Serif"},
  "he": {"title":"הגדרות","pageRanges":"טווחי עמודים","pageRangesPlaceholder":"דוגמאות: 1-3,5,8-10","startNumber":"מספר התחלה","format":"פורמט פלט","position":"מיקום","fontSize":"גודל גופן","horizontalMargin":"שוליים אופקיים","verticalMargin":"שוליים אנכיים","fontFamily":"משפחת גופן","fontFamilySans":"ללא סריף","fontFamilySerif":"סריף"},
  "ms": {"title":"Tetapan","pageRanges":"Julat halaman","pageRangesPlaceholder":"Contoh: 1-3,5,8-10","startNumber":"Nombor mula","format":"Format output","position":"Kedudukan","fontSize":"Saiz fon","horizontalMargin":"Jidar mendatar","verticalMargin":"Jidar menegak","fontFamily":"Keluarga fon","fontFamilySans":"Sans serif","fontFamilySerif":"Serif"},
  "no": {"title":"Innstillinger","pageRanges":"Sideintervaller","pageRangesPlaceholder":"Eksempler: 1-3,5,8-10","startNumber":"Startnummer","format":"Utdataformat","position":"Posisjon","fontSize":"Skriftstørrelse","horizontalMargin":"Horisontal marg","verticalMargin":"Vertikal marg","fontFamily":"Skriftfamilie","fontFamilySans":"Sans serif","fontFamilySerif":"Serif"}
}
</i18n>
