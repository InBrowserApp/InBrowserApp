<template>
  <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex align="center" justify="space-between" :size="12">
      <n-text depth="3">{{ t('output') }}</n-text>
      <n-flex align="center" :size="8">
        <CopyToClipboardButton v-if="icsContent" :content="icsContent" />
        <n-button text tag="a" :href="icsHref" download="event.ics" :disabled="!icsHref">
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download-ics') }}
        </n-button>
      </n-flex>
    </n-flex>

    <n-text v-if="outputErrorMessage" type="error" style="margin-top: 8px">
      {{ outputErrorMessage }}
    </n-text>
    <n-text v-else-if="!icsContent" depth="3" style="margin-top: 8px">
      {{ t('output-empty') }}
    </n-text>

    <n-card size="small" style="margin-top: 12px">
      <n-input
        :value="icsContent"
        type="textarea"
        readonly
        :autosize="{ minRows: 10, maxRows: 24 }"
      />
    </n-card>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NCard, NFlex, NIcon, NInput, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'

type OutputErrorKey = 'invalid-date-time' | 'invalid-date' | 'end-before-start'

const props = defineProps<{
  icsContent: string
  icsHref?: string
  outputErrorKey?: OutputErrorKey
}>()

const { t } = useI18n()

const outputErrorMessages = computed<Record<OutputErrorKey, string>>(() => ({
  'invalid-date-time': t('invalid-date-time'),
  'invalid-date': t('invalid-date'),
  'end-before-start': t('end-before-start'),
}))

const outputErrorMessage = computed(() =>
  props.outputErrorKey ? outputErrorMessages.value[props.outputErrorKey] : '',
)
</script>

<i18n lang="json">
{
  "en": {
    "output": "Output",
    "download-ics": "Download .ics",
    "output-empty": "Fill in a valid start time to generate the .ics file.",
    "invalid-date-time": "Invalid date/time",
    "invalid-date": "Invalid date",
    "end-before-start": "End must be after start"
  },
  "zh": {
    "output": "输出",
    "download-ics": "下载 .ics",
    "output-empty": "填写有效开始时间以生成 .ics 文件。",
    "invalid-date-time": "无效的日期/时间",
    "invalid-date": "无效的日期",
    "end-before-start": "结束时间必须晚于开始时间"
  },
  "zh-CN": {
    "output": "输出",
    "download-ics": "下载 .ics",
    "output-empty": "填写有效开始时间以生成 .ics 文件。",
    "invalid-date-time": "无效的日期/时间",
    "invalid-date": "无效的日期",
    "end-before-start": "结束时间必须晚于开始时间"
  },
  "zh-TW": {
    "output": "輸出",
    "download-ics": "下載 .ics",
    "output-empty": "請輸入有效的開始時間以產生 .ics 檔案。",
    "invalid-date-time": "無效的日期/時間",
    "invalid-date": "無效的日期",
    "end-before-start": "結束時間必須晚於開始時間"
  },
  "zh-HK": {
    "output": "輸出",
    "download-ics": "下載 .ics",
    "output-empty": "請輸入有效的開始時間以產生 .ics 檔案。",
    "invalid-date-time": "無效的日期/時間",
    "invalid-date": "無效的日期",
    "end-before-start": "結束時間必須晚於開始時間"
  },
  "es": {
    "output": "Salida",
    "download-ics": "Descargar .ics",
    "output-empty": "Completa una hora de inicio válida para generar el archivo .ics.",
    "invalid-date-time": "Fecha/hora inválida",
    "invalid-date": "Fecha inválida",
    "end-before-start": "El fin debe ser posterior al inicio"
  },
  "fr": {
    "output": "Sortie",
    "download-ics": "Télécharger .ics",
    "output-empty": "Saisissez une heure de début valide pour générer le fichier .ics.",
    "invalid-date-time": "Date/heure invalide",
    "invalid-date": "Date invalide",
    "end-before-start": "La fin doit être après le début"
  },
  "de": {
    "output": "Ausgabe",
    "download-ics": ".ics herunterladen",
    "output-empty": "Geben Sie eine gültige Startzeit ein, um die .ics-Datei zu erstellen.",
    "invalid-date-time": "Ungültiges Datum/Uhrzeit",
    "invalid-date": "Ungültiges Datum",
    "end-before-start": "Ende muss nach dem Start liegen"
  },
  "it": {
    "output": "Output",
    "download-ics": "Scarica .ics",
    "output-empty": "Inserisci un'ora di inizio valida per generare il file .ics.",
    "invalid-date-time": "Data/ora non valida",
    "invalid-date": "Data non valida",
    "end-before-start": "La fine deve essere successiva all'inizio"
  },
  "ja": {
    "output": "出力",
    "download-ics": ".ics をダウンロード",
    "output-empty": "有効な開始時刻を入力して .ics を生成してください。",
    "invalid-date-time": "無効な日付/時刻",
    "invalid-date": "無効な日付",
    "end-before-start": "終了は開始より後である必要があります"
  },
  "ko": {
    "output": "출력",
    "download-ics": ".ics 다운로드",
    "output-empty": "유효한 시작 시간을 입력해 .ics 파일을 생성하세요.",
    "invalid-date-time": "유효하지 않은 날짜/시간",
    "invalid-date": "유효하지 않은 날짜",
    "end-before-start": "종료는 시작 이후여야 합니다"
  },
  "ru": {
    "output": "Вывод",
    "download-ics": "Скачать .ics",
    "output-empty": "Введите корректное время начала для создания файла .ics.",
    "invalid-date-time": "Недопустимая дата/время",
    "invalid-date": "Недопустимая дата",
    "end-before-start": "Окончание должно быть после начала"
  },
  "pt": {
    "output": "Saída",
    "download-ics": "Baixar .ics",
    "output-empty": "Informe um início válido para gerar o arquivo .ics.",
    "invalid-date-time": "Data/hora inválida",
    "invalid-date": "Data inválida",
    "end-before-start": "O fim deve ser após o início"
  },
  "ar": {
    "output": "الإخراج",
    "download-ics": "تنزيل .ics",
    "output-empty": "أدخل وقت بدء صالحًا لإنشاء ملف .ics.",
    "invalid-date-time": "تاريخ/وقت غير صالح",
    "invalid-date": "تاريخ غير صالح",
    "end-before-start": "يجب أن تكون النهاية بعد البداية"
  },
  "hi": {
    "output": "आउटपुट",
    "download-ics": ".ics डाउनलोड करें",
    "output-empty": "वैध आरंभ समय भरें ताकि .ics फ़ाइल बने।",
    "invalid-date-time": "अमान्य तिथि/समय",
    "invalid-date": "अमान्य तिथि",
    "end-before-start": "समाप्ति समय शुरू के बाद होना चाहिए"
  },
  "tr": {
    "output": "Çıktı",
    "download-ics": ".ics indir",
    "output-empty": "Geçerli bir başlangıç saati girerek .ics dosyasını oluşturun.",
    "invalid-date-time": "Geçersiz tarih/saat",
    "invalid-date": "Geçersiz tarih",
    "end-before-start": "Bitiş başlangıçtan sonra olmalıdır"
  },
  "nl": {
    "output": "Uitvoer",
    "download-ics": ".ics downloaden",
    "output-empty": "Vul een geldige starttijd in om het .ics-bestand te genereren.",
    "invalid-date-time": "Ongeldige datum/tijd",
    "invalid-date": "Ongeldige datum",
    "end-before-start": "Einde moet na het begin liggen"
  },
  "sv": {
    "output": "Utdata",
    "download-ics": "Ladda ner .ics",
    "output-empty": "Fyll i en giltig starttid för att skapa .ics-filen.",
    "invalid-date-time": "Ogiltigt datum/tid",
    "invalid-date": "Ogiltigt datum",
    "end-before-start": "Slutet måste vara efter start"
  },
  "pl": {
    "output": "Wyjście",
    "download-ics": "Pobierz .ics",
    "output-empty": "Wprowadź poprawny czas rozpoczęcia, aby wygenerować plik .ics.",
    "invalid-date-time": "Nieprawidłowa data/godzina",
    "invalid-date": "Nieprawidłowa data",
    "end-before-start": "Koniec musi być po początku"
  },
  "vi": {
    "output": "Đầu ra",
    "download-ics": "Tải .ics",
    "output-empty": "Nhập thời gian bắt đầu hợp lệ để tạo tệp .ics.",
    "invalid-date-time": "Ngày/giờ không hợp lệ",
    "invalid-date": "Ngày không hợp lệ",
    "end-before-start": "Kết thúc phải sau khi bắt đầu"
  },
  "th": {
    "output": "เอาต์พุต",
    "download-ics": "ดาวน์โหลด .ics",
    "output-empty": "กรอกเวลาเริ่มต้นที่ถูกต้องเพื่อสร้างไฟล์ .ics",
    "invalid-date-time": "วันที่/เวลาไม่ถูกต้อง",
    "invalid-date": "วันที่ไม่ถูกต้อง",
    "end-before-start": "เวลาสิ้นสุดต้องหลังเวลาเริ่มต้น"
  },
  "id": {
    "output": "Output",
    "download-ics": "Unduh .ics",
    "output-empty": "Masukkan waktu mulai yang valid untuk membuat file .ics.",
    "invalid-date-time": "Tanggal/waktu tidak valid",
    "invalid-date": "Tanggal tidak valid",
    "end-before-start": "Selesai harus setelah mulai"
  },
  "he": {
    "output": "פלט",
    "download-ics": "הורד .ics",
    "output-empty": "הזן זמן התחלה תקין כדי ליצור קובץ .ics.",
    "invalid-date-time": "תאריך/שעה לא תקינים",
    "invalid-date": "תאריך לא תקין",
    "end-before-start": "הסיום חייב להיות אחרי ההתחלה"
  },
  "ms": {
    "output": "Output",
    "download-ics": "Muat turun .ics",
    "output-empty": "Masukkan masa mula yang sah untuk menjana fail .ics.",
    "invalid-date-time": "Tarikh/masa tidak sah",
    "invalid-date": "Tarikh tidak sah",
    "end-before-start": "Tamat mesti selepas mula"
  },
  "no": {
    "output": "Utdata",
    "download-ics": "Last ned .ics",
    "output-empty": "Oppgi en gyldig starttid for å generere .ics-filen.",
    "invalid-date-time": "Ugyldig dato/tid",
    "invalid-date": "Ugyldig dato",
    "end-before-start": "Slutt må være etter start"
  }
}
</i18n>
