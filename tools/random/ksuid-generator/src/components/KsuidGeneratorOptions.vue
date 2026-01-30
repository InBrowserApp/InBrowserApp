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
          <n-button size="small" secondary @click="emit('set-now')">
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
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NButton,
  NDatePicker,
  NFlex,
  NFormItemGi,
  NGrid,
  NIcon,
  NInputNumber,
  NRadio,
  NRadioGroup,
  NText,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ClockIcon from '@vicons/fluent/Clock16Regular'

type TimestampMode = 'now' | 'custom'

defineProps<{
  maxCount: number
  minUnixSeconds: number
  maxUnixSeconds: number
  timestampError: string
}>()

const emit = defineEmits<{ (event: 'set-now'): void }>()
const count = defineModel<number | null>('count', { required: true })
const timestampMode = defineModel<TimestampMode>('timestampMode', { required: true })
const customDateMs = defineModel<number | null>('customDateMs', { required: true })
const customUnixSeconds = defineModel<number | null>('customUnixSeconds', { required: true })

const { t } = useI18n()
</script>

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
    "ksuidEpoch": "KSUID epoch: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "KSUID 基准时间：2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "KSUID 基准时间：2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "KSUID 基準時間：2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "KSUID 基準時間：2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "Época KSUID: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "Époque KSUID : 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "KSUID-Epoche: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "Epoca KSUID: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "KSUID エポック: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "KSUID 기준 시각: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "Эпоха KSUID: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "Época KSUID: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "حقبة KSUID: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "KSUID युग: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "KSUID dönemi: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "KSUID-epoch: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "KSUID-epok: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "Epoka KSUID: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "Mốc KSUID: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "ยุค KSUID: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "Epoch KSUID: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "אפוק KSUID: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "Epok KSUID: 2014-05-13T16:53:20Z"
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
    "ksuidEpoch": "KSUID-epoke: 2014-05-13T16:53:20Z"
  }
}
</i18n>
