<template>
  <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="16">
      <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
        <n-form-item-gi :label="t('count')" :show-feedback="false">
          <n-input-number v-model:value="count" :min="1" :max="maxCount" style="width: 100%" />
        </n-form-item-gi>
        <n-form-item-gi :label="t('timestampMode')" :show-feedback="false">
          <n-radio-group v-model:value="timestampMode">
            <n-flex :size="12">
              <n-radio value="now">{{ t('timestampNow') }}</n-radio>
              <n-radio value="custom">{{ t('timestampCustom') }}</n-radio>
            </n-flex>
          </n-radio-group>
        </n-form-item-gi>
      </n-grid>

      <template v-if="timestampMode === 'custom'">
        <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
          <n-form-item-gi :label="t('customDateTime')" :show-feedback="false">
            <n-date-picker v-model:value="customDateMs" type="datetime" style="width: 100%" />
          </n-form-item-gi>
          <n-form-item-gi :label="t('customUnixSeconds')" :show-feedback="false">
            <n-input-number
              v-model:value="customUnixSeconds"
              :min="minUnixSeconds"
              :max="maxUnixSeconds"
              :step="1"
              style="width: 100%"
            />
          </n-form-item-gi>
        </n-grid>

        <n-flex align="center" :size="12">
          <n-button size="small" secondary @click="setNow">
            <template #icon>
              <n-icon :component="ClockIcon" />
            </template>
            {{ t('setNow') }}
          </n-button>
          <n-text depth="3">{{ t('ksuidEpoch') }}</n-text>
        </n-flex>

        <n-alert v-if="timestampError" type="error">
          {{ timestampError }}
        </n-alert>
      </template>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-input
        :value="output"
        class="monospace-output"
        type="textarea"
        readonly
        :autosize="{ minRows: 4, maxRows: 12 }"
        :placeholder="t('placeholder')"
      />
      <n-flex>
        <CopyToClipboardButton :content="output" />
        <RegenerateButton @click="regenerate" />
      </n-flex>
      <n-text v-if="output" depth="3">
        {{ t('generatedAt', { seconds: generatedAtUnixSeconds }) }}
      </n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import {
  NAlert,
  NButton,
  NDatePicker,
  NFlex,
  NFormItemGi,
  NGrid,
  NIcon,
  NInput,
  NInputNumber,
  NRadio,
  NRadioGroup,
  NText,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, RegenerateButton } from '@shared/ui/base'
import { Clock16Regular as ClockIcon } from '@shared/icons/fluent'
import {
  generateKsuid,
  isValidKsuidUnixSeconds,
  KSUID_EPOCH_SECONDS,
  MAX_KSUID_TIMESTAMP,
} from '../utils/ksuid'

const { t } = useI18n()

const maxCount = 100
const minUnixSeconds = KSUID_EPOCH_SECONDS
const maxUnixSeconds = KSUID_EPOCH_SECONDS + MAX_KSUID_TIMESTAMP

const count = useStorage<number | null>('tools:ksuid-generator:count', 5)
const timestampMode = useStorage<'now' | 'custom'>('tools:ksuid-generator:timestamp-mode', 'now')
const customUnixSeconds = useStorage<number | null>(
  'tools:ksuid-generator:custom-unix-seconds',
  Math.floor(Date.now() / 1000),
)

const customDateMs = computed<number | null>({
  get: () => {
    if (typeof customUnixSeconds.value !== 'number' || !Number.isFinite(customUnixSeconds.value)) {
      return null
    }
    return customUnixSeconds.value * 1000
  },
  set: (value: number | null) => {
    if (value === null) return
    customUnixSeconds.value = Math.floor(value / 1000)
  },
})

const timestampError = computed(() => {
  if (timestampMode.value !== 'custom') return ''
  if (typeof customUnixSeconds.value !== 'number' || !Number.isFinite(customUnixSeconds.value)) {
    return t('timestampInvalid')
  }
  if (customUnixSeconds.value < minUnixSeconds || customUnixSeconds.value > maxUnixSeconds) {
    return t('timestampOutOfRange', { min: minUnixSeconds, max: maxUnixSeconds })
  }
  return ''
})

const generatedIds = ref<string[]>([])
const generatedAtUnixSeconds = ref<number>(Math.floor(Date.now() / 1000))

function normalizeCount(value: number | null | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1
  return Math.min(Math.max(Math.floor(value), 1), maxCount)
}

function setNow() {
  customUnixSeconds.value = Math.floor(Date.now() / 1000)
}

function regenerate() {
  const normalizedCount = normalizeCount(count.value)
  if (count.value !== normalizedCount) {
    count.value = normalizedCount
  }

  const unixSeconds =
    timestampMode.value === 'custom' ? customUnixSeconds.value : Math.floor(Date.now() / 1000)

  if (typeof unixSeconds !== 'number' || !isValidKsuidUnixSeconds(unixSeconds)) {
    generatedIds.value = []
    return
  }

  generatedAtUnixSeconds.value = unixSeconds

  const results: string[] = []
  for (let i = 0; i < normalizedCount; i += 1) {
    results.push(generateKsuid(unixSeconds))
  }
  generatedIds.value = results
}

const output = computed(() => generatedIds.value.join('\n'))

watch([count, timestampMode, customUnixSeconds], regenerate, { immediate: true })
</script>

<style scoped>
.monospace-output :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "count": "Count",
    "timestampMode": "Timestamp Mode",
    "timestampNow": "Use current time",
    "timestampCustom": "Custom time",
    "customDateTime": "Custom Date/Time",
    "customUnixSeconds": "Custom Unix Seconds",
    "setNow": "Set to now",
    "ksuidEpoch": "KSUID epoch: 2014-05-13T16:53:20Z",
    "results": "Results",
    "placeholder": "Generated KSUIDs will appear here...",
    "timestampInvalid": "Invalid timestamp.",
    "timestampOutOfRange": "Timestamp must be between {min} and {max} (Unix seconds).",
    "generatedAt": "Generated with Unix time: {seconds}"
  },
  "zh": {
    "options": "选项",
    "count": "数量",
    "timestampMode": "时间戳模式",
    "timestampNow": "使用当前时间",
    "timestampCustom": "自定义时间",
    "customDateTime": "自定义日期/时间",
    "customUnixSeconds": "自定义 Unix 秒",
    "setNow": "设为现在",
    "ksuidEpoch": "KSUID 基准时间：2014-05-13T16:53:20Z",
    "results": "结果",
    "placeholder": "生成的 KSUID 将显示在这里...",
    "timestampInvalid": "时间戳无效。",
    "timestampOutOfRange": "时间戳必须在 {min} 到 {max} 之间（Unix 秒）。",
    "generatedAt": "生成所用 Unix 时间：{seconds}"
  },
  "zh-CN": {
    "options": "选项",
    "count": "数量",
    "timestampMode": "时间戳模式",
    "timestampNow": "使用当前时间",
    "timestampCustom": "自定义时间",
    "customDateTime": "自定义日期/时间",
    "customUnixSeconds": "自定义 Unix 秒",
    "setNow": "设为现在",
    "ksuidEpoch": "KSUID 基准时间：2014-05-13T16:53:20Z",
    "results": "结果",
    "placeholder": "生成的 KSUID 将显示在这里...",
    "timestampInvalid": "时间戳无效。",
    "timestampOutOfRange": "时间戳必须在 {min} 到 {max} 之间（Unix 秒）。",
    "generatedAt": "生成所用 Unix 时间：{seconds}"
  },
  "zh-TW": {
    "options": "選項",
    "count": "數量",
    "timestampMode": "時間戳模式",
    "timestampNow": "使用目前時間",
    "timestampCustom": "自訂時間",
    "customDateTime": "自訂日期/時間",
    "customUnixSeconds": "自訂 Unix 秒",
    "setNow": "設為現在",
    "ksuidEpoch": "KSUID 基準時間：2014-05-13T16:53:20Z",
    "results": "結果",
    "placeholder": "產生的 KSUID 會顯示在這裡...",
    "timestampInvalid": "時間戳無效。",
    "timestampOutOfRange": "時間戳必須介於 {min} 與 {max}（Unix 秒）。",
    "generatedAt": "生成所用 Unix 時間：{seconds}"
  },
  "zh-HK": {
    "options": "選項",
    "count": "數量",
    "timestampMode": "時間戳模式",
    "timestampNow": "使用目前時間",
    "timestampCustom": "自訂時間",
    "customDateTime": "自訂日期/時間",
    "customUnixSeconds": "自訂 Unix 秒",
    "setNow": "設為現在",
    "ksuidEpoch": "KSUID 基準時間：2014-05-13T16:53:20Z",
    "results": "結果",
    "placeholder": "產生的 KSUID 會顯示在這裡...",
    "timestampInvalid": "時間戳無效。",
    "timestampOutOfRange": "時間戳必須介於 {min} 與 {max}（Unix 秒）。",
    "generatedAt": "生成所用 Unix 時間：{seconds}"
  },
  "es": {
    "options": "Opciones",
    "count": "Cantidad",
    "timestampMode": "Modo de marca de tiempo",
    "timestampNow": "Usar hora actual",
    "timestampCustom": "Hora personalizada",
    "customDateTime": "Fecha/hora personalizada",
    "customUnixSeconds": "Segundos Unix personalizados",
    "setNow": "Establecer a ahora",
    "ksuidEpoch": "Época KSUID: 2014-05-13T16:53:20Z",
    "results": "Resultados",
    "placeholder": "Los KSUID generados aparecerán aquí...",
    "timestampInvalid": "Marca de tiempo no válida.",
    "timestampOutOfRange": "La marca de tiempo debe estar entre {min} y {max} (segundos Unix).",
    "generatedAt": "Generado con tiempo Unix: {seconds}"
  },
  "fr": {
    "options": "Options",
    "count": "Nombre",
    "timestampMode": "Mode d'horodatage",
    "timestampNow": "Utiliser l'heure actuelle",
    "timestampCustom": "Heure personnalisée",
    "customDateTime": "Date/heure personnalisée",
    "customUnixSeconds": "Secondes Unix personnalisées",
    "setNow": "Définir à maintenant",
    "ksuidEpoch": "Époque KSUID : 2014-05-13T16:53:20Z",
    "results": "Résultats",
    "placeholder": "Les KSUID générés apparaîtront ici...",
    "timestampInvalid": "Horodatage invalide.",
    "timestampOutOfRange": "L'horodatage doit être entre {min} et {max} (secondes Unix).",
    "generatedAt": "Généré avec l'heure Unix : {seconds}"
  },
  "de": {
    "options": "Optionen",
    "count": "Anzahl",
    "timestampMode": "Zeitstempelmodus",
    "timestampNow": "Aktuelle Zeit verwenden",
    "timestampCustom": "Benutzerdefinierte Zeit",
    "customDateTime": "Benutzerdefiniertes Datum/Uhrzeit",
    "customUnixSeconds": "Benutzerdefinierte Unix-Sekunden",
    "setNow": "Auf jetzt setzen",
    "ksuidEpoch": "KSUID-Epoche: 2014-05-13T16:53:20Z",
    "results": "Ergebnisse",
    "placeholder": "Generierte KSUIDs erscheinen hier...",
    "timestampInvalid": "Ungültiger Zeitstempel.",
    "timestampOutOfRange": "Zeitstempel muss zwischen {min} und {max} liegen (Unix-Sekunden).",
    "generatedAt": "Erzeugt mit Unix-Zeit: {seconds}"
  },
  "it": {
    "options": "Opzioni",
    "count": "Numero",
    "timestampMode": "Modalità timestamp",
    "timestampNow": "Usa ora corrente",
    "timestampCustom": "Ora personalizzata",
    "customDateTime": "Data/ora personalizzata",
    "customUnixSeconds": "Secondi Unix personalizzati",
    "setNow": "Imposta a ora",
    "ksuidEpoch": "Epoca KSUID: 2014-05-13T16:53:20Z",
    "results": "Risultati",
    "placeholder": "I KSUID generati appariranno qui...",
    "timestampInvalid": "Timestamp non valido.",
    "timestampOutOfRange": "Il timestamp deve essere tra {min} e {max} (secondi Unix).",
    "generatedAt": "Generato con tempo Unix: {seconds}"
  },
  "ja": {
    "options": "オプション",
    "count": "件数",
    "timestampMode": "タイムスタンプモード",
    "timestampNow": "現在時刻を使用",
    "timestampCustom": "カスタム時刻",
    "customDateTime": "カスタム日時",
    "customUnixSeconds": "カスタム Unix 秒",
    "setNow": "現在時刻に設定",
    "ksuidEpoch": "KSUID エポック: 2014-05-13T16:53:20Z",
    "results": "結果",
    "placeholder": "生成された KSUID がここに表示されます...",
    "timestampInvalid": "無効なタイムスタンプです。",
    "timestampOutOfRange": "タイムスタンプは {min} から {max}（Unix 秒）の間である必要があります。",
    "generatedAt": "使用した Unix 時間: {seconds}"
  },
  "ko": {
    "options": "옵션",
    "count": "개수",
    "timestampMode": "타임스탬프 모드",
    "timestampNow": "현재 시간 사용",
    "timestampCustom": "사용자 지정 시간",
    "customDateTime": "사용자 지정 날짜/시간",
    "customUnixSeconds": "사용자 지정 Unix 초",
    "setNow": "지금으로 설정",
    "ksuidEpoch": "KSUID 기준 시각: 2014-05-13T16:53:20Z",
    "results": "결과",
    "placeholder": "생성된 KSUID가 여기에 표시됩니다...",
    "timestampInvalid": "잘못된 타임스탬프입니다.",
    "timestampOutOfRange": "타임스탬프는 {min}에서 {max} 사이여야 합니다(Unix 초).",
    "generatedAt": "사용된 Unix 시간: {seconds}"
  },
  "ru": {
    "options": "Параметры",
    "count": "Количество",
    "timestampMode": "Режим временной метки",
    "timestampNow": "Использовать текущее время",
    "timestampCustom": "Пользовательское время",
    "customDateTime": "Пользовательская дата/время",
    "customUnixSeconds": "Пользовательские Unix-секунды",
    "setNow": "Установить сейчас",
    "ksuidEpoch": "Эпоха KSUID: 2014-05-13T16:53:20Z",
    "results": "Результаты",
    "placeholder": "Сгенерированные KSUID появятся здесь...",
    "timestampInvalid": "Недействительная временная метка.",
    "timestampOutOfRange": "Временная метка должна быть между {min} и {max} (Unix-секунды).",
    "generatedAt": "Сгенерировано с Unix-временем: {seconds}"
  },
  "pt": {
    "options": "Opções",
    "count": "Quantidade",
    "timestampMode": "Modo de timestamp",
    "timestampNow": "Usar hora atual",
    "timestampCustom": "Hora personalizada",
    "customDateTime": "Data/hora personalizada",
    "customUnixSeconds": "Segundos Unix personalizados",
    "setNow": "Definir para agora",
    "ksuidEpoch": "Época KSUID: 2014-05-13T16:53:20Z",
    "results": "Resultados",
    "placeholder": "Os KSUIDs gerados aparecerão aqui...",
    "timestampInvalid": "Timestamp inválido.",
    "timestampOutOfRange": "O timestamp deve estar entre {min} e {max} (segundos Unix).",
    "generatedAt": "Gerado com tempo Unix: {seconds}"
  },
  "ar": {
    "options": "الخيارات",
    "count": "العدد",
    "timestampMode": "وضع الطابع الزمني",
    "timestampNow": "استخدام الوقت الحالي",
    "timestampCustom": "وقت مخصص",
    "customDateTime": "تاريخ/وقت مخصص",
    "customUnixSeconds": "ثواني Unix مخصصة",
    "setNow": "تعيين إلى الآن",
    "ksuidEpoch": "حقبة KSUID: 2014-05-13T16:53:20Z",
    "results": "النتائج",
    "placeholder": "ستظهر KSUIDs المُولَّدة هنا...",
    "timestampInvalid": "طابع زمني غير صالح.",
    "timestampOutOfRange": "يجب أن يكون الطابع الزمني بين {min} و {max} (ثواني Unix).",
    "generatedAt": "تم الإنشاء باستخدام وقت Unix: {seconds}"
  },
  "hi": {
    "options": "विकल्प",
    "count": "संख्या",
    "timestampMode": "टाइमस्टैम्प मोड",
    "timestampNow": "वर्तमान समय उपयोग करें",
    "timestampCustom": "कस्टम समय",
    "customDateTime": "कस्टम दिनांक/समय",
    "customUnixSeconds": "कस्टम Unix सेकंड",
    "setNow": "अब सेट करें",
    "ksuidEpoch": "KSUID युग: 2014-05-13T16:53:20Z",
    "results": "परिणाम",
    "placeholder": "जनरेट किए गए KSUID यहाँ दिखेंगे...",
    "timestampInvalid": "अमान्य टाइमस्टैम्प।",
    "timestampOutOfRange": "टाइमस्टैम्प {min} और {max} (Unix सेकंड) के बीच होना चाहिए।",
    "generatedAt": "Unix समय के साथ जनरेट किया गया: {seconds}"
  },
  "tr": {
    "options": "Seçenekler",
    "count": "Adet",
    "timestampMode": "Zaman damgası modu",
    "timestampNow": "Geçerli zamanı kullan",
    "timestampCustom": "Özel zaman",
    "customDateTime": "Özel tarih/saat",
    "customUnixSeconds": "Özel Unix saniyesi",
    "setNow": "Şimdiye ayarla",
    "ksuidEpoch": "KSUID dönemi: 2014-05-13T16:53:20Z",
    "results": "Sonuçlar",
    "placeholder": "Üretilen KSUID'ler burada görünecek...",
    "timestampInvalid": "Geçersiz zaman damgası.",
    "timestampOutOfRange": "Zaman damgası {min} ile {max} arasında olmalıdır (Unix saniye).",
    "generatedAt": "Unix zamanı ile üretildi: {seconds}"
  },
  "nl": {
    "options": "Opties",
    "count": "Aantal",
    "timestampMode": "Tijdstempelmodus",
    "timestampNow": "Huidige tijd gebruiken",
    "timestampCustom": "Aangepaste tijd",
    "customDateTime": "Aangepaste datum/tijd",
    "customUnixSeconds": "Aangepaste Unix-seconden",
    "setNow": "Instellen op nu",
    "ksuidEpoch": "KSUID-epoch: 2014-05-13T16:53:20Z",
    "results": "Resultaten",
    "placeholder": "Gegenereerde KSUID's verschijnen hier...",
    "timestampInvalid": "Ongeldige tijdstempel.",
    "timestampOutOfRange": "De tijdstempel moet tussen {min} en {max} liggen (Unix-seconden).",
    "generatedAt": "Gegenereerd met Unix-tijd: {seconds}"
  },
  "sv": {
    "options": "Alternativ",
    "count": "Antal",
    "timestampMode": "Tidsstämpelläge",
    "timestampNow": "Använd aktuell tid",
    "timestampCustom": "Anpassad tid",
    "customDateTime": "Anpassat datum/tid",
    "customUnixSeconds": "Anpassade Unix-sekunder",
    "setNow": "Sätt till nu",
    "ksuidEpoch": "KSUID-epok: 2014-05-13T16:53:20Z",
    "results": "Resultat",
    "placeholder": "Genererade KSUID visas här...",
    "timestampInvalid": "Ogiltig tidsstämpel.",
    "timestampOutOfRange": "Tidsstämpeln måste vara mellan {min} och {max} (Unix-sekunder).",
    "generatedAt": "Genererad med Unix-tid: {seconds}"
  },
  "pl": {
    "options": "Opcje",
    "count": "Liczba",
    "timestampMode": "Tryb znacznika czasu",
    "timestampNow": "Użyj bieżącego czasu",
    "timestampCustom": "Czas niestandardowy",
    "customDateTime": "Niestandardowa data/godzina",
    "customUnixSeconds": "Niestandardowe sekundy Unix",
    "setNow": "Ustaw na teraz",
    "ksuidEpoch": "Epoka KSUID: 2014-05-13T16:53:20Z",
    "results": "Wyniki",
    "placeholder": "Wygenerowane KSUID pojawią się tutaj...",
    "timestampInvalid": "Nieprawidłowy znacznik czasu.",
    "timestampOutOfRange": "Znacznik czasu musi być między {min} a {max} (sekundy Unix).",
    "generatedAt": "Wygenerowano z czasem Unix: {seconds}"
  },
  "vi": {
    "options": "Tùy chọn",
    "count": "Số lượng",
    "timestampMode": "Chế độ dấu thời gian",
    "timestampNow": "Dùng thời gian hiện tại",
    "timestampCustom": "Thời gian tùy chỉnh",
    "customDateTime": "Ngày/giờ tùy chỉnh",
    "customUnixSeconds": "Giây Unix tùy chỉnh",
    "setNow": "Đặt về hiện tại",
    "ksuidEpoch": "Mốc KSUID: 2014-05-13T16:53:20Z",
    "results": "Kết quả",
    "placeholder": "KSUID tạo ra sẽ hiển thị ở đây...",
    "timestampInvalid": "Dấu thời gian không hợp lệ.",
    "timestampOutOfRange": "Dấu thời gian phải nằm giữa {min} và {max} (giây Unix).",
    "generatedAt": "Tạo với thời gian Unix: {seconds}"
  },
  "th": {
    "options": "ตัวเลือก",
    "count": "จำนวน",
    "timestampMode": "โหมดเวลา",
    "timestampNow": "ใช้เวลาปัจจุบัน",
    "timestampCustom": "กำหนดเวลาเอง",
    "customDateTime": "วันที่/เวลาแบบกำหนดเอง",
    "customUnixSeconds": "วินาที Unix แบบกำหนดเอง",
    "setNow": "ตั้งเป็นตอนนี้",
    "ksuidEpoch": "ยุค KSUID: 2014-05-13T16:53:20Z",
    "results": "ผลลัพธ์",
    "placeholder": "KSUID ที่สร้างจะปรากฏที่นี่...",
    "timestampInvalid": "เวลาไม่ถูกต้อง",
    "timestampOutOfRange": "เวลาต้องอยู่ระหว่าง {min} และ {max} (วินาที Unix)",
    "generatedAt": "สร้างด้วยเวลา Unix: {seconds}"
  },
  "id": {
    "options": "Opsi",
    "count": "Jumlah",
    "timestampMode": "Mode stempel waktu",
    "timestampNow": "Gunakan waktu saat ini",
    "timestampCustom": "Waktu khusus",
    "customDateTime": "Tanggal/waktu khusus",
    "customUnixSeconds": "Detik Unix khusus",
    "setNow": "Setel ke sekarang",
    "ksuidEpoch": "Epoch KSUID: 2014-05-13T16:53:20Z",
    "results": "Hasil",
    "placeholder": "KSUID yang dihasilkan akan muncul di sini...",
    "timestampInvalid": "Stempel waktu tidak valid.",
    "timestampOutOfRange": "Stempel waktu harus antara {min} dan {max} (detik Unix).",
    "generatedAt": "Dihasilkan dengan waktu Unix: {seconds}"
  },
  "he": {
    "options": "אפשרויות",
    "count": "כמות",
    "timestampMode": "מצב חותמת זמן",
    "timestampNow": "השתמש בזמן הנוכחי",
    "timestampCustom": "זמן מותאם אישית",
    "customDateTime": "תאריך/שעה מותאמים אישית",
    "customUnixSeconds": "שניות Unix מותאמות אישית",
    "setNow": "הגדר לעכשיו",
    "ksuidEpoch": "אפוק KSUID: 2014-05-13T16:53:20Z",
    "results": "תוצאות",
    "placeholder": "ה-KSUID שנוצרו יופיעו כאן...",
    "timestampInvalid": "חותמת זמן לא תקינה.",
    "timestampOutOfRange": "חותמת הזמן חייבת להיות בין {min} ל-{max} (שניות Unix).",
    "generatedAt": "נוצר עם זמן Unix: {seconds}"
  },
  "ms": {
    "options": "Pilihan",
    "count": "Jumlah",
    "timestampMode": "Mod cap masa",
    "timestampNow": "Gunakan masa semasa",
    "timestampCustom": "Masa tersuai",
    "customDateTime": "Tarikh/masa tersuai",
    "customUnixSeconds": "Saat Unix tersuai",
    "setNow": "Tetapkan ke sekarang",
    "ksuidEpoch": "Epok KSUID: 2014-05-13T16:53:20Z",
    "results": "Hasil",
    "placeholder": "KSUID yang dijana akan muncul di sini...",
    "timestampInvalid": "Cap masa tidak sah.",
    "timestampOutOfRange": "Cap masa mesti antara {min} dan {max} (saat Unix).",
    "generatedAt": "Dijana dengan masa Unix: {seconds}"
  },
  "no": {
    "options": "Alternativer",
    "count": "Antall",
    "timestampMode": "Tidsstempelmodus",
    "timestampNow": "Bruk nåværende tid",
    "timestampCustom": "Tilpasset tid",
    "customDateTime": "Tilpasset dato/tid",
    "customUnixSeconds": "Tilpassede Unix-sekunder",
    "setNow": "Sett til nå",
    "ksuidEpoch": "KSUID-epoke: 2014-05-13T16:53:20Z",
    "results": "Resultater",
    "placeholder": "Genererte KSUID-er vises her...",
    "timestampInvalid": "Ugyldig tidsstempel.",
    "timestampOutOfRange": "Tidsstempelet må være mellom {min} og {max} (Unix-sekunder).",
    "generatedAt": "Generert med Unix-tid: {seconds}"
  }
}
</i18n>
