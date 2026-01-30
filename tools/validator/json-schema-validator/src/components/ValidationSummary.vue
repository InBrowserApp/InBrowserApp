<template>
  <n-descriptions :column="1" bordered label-placement="left">
    <n-descriptions-item :label="t('statusLabel')">
      <n-tag :type="statusTagType" size="small">{{ statusValue }}</n-tag>
    </n-descriptions-item>
    <n-descriptions-item :label="t('draftLabel')">
      <n-flex align="center" :size="8">
        <n-text code>{{ draftValue }}</n-text>
        <n-tag v-if="draftHint" type="info" size="small">{{ draftHint }}</n-tag>
      </n-flex>
    </n-descriptions-item>
    <n-descriptions-item :label="t('errorsLabel')">
      <n-flex align="center" :size="8">
        <n-text>{{ errorsCount }}</n-text>
        <CopyToClipboardButton v-if="errorsCount > 0" :content="errorsJson" />
      </n-flex>
    </n-descriptions-item>
  </n-descriptions>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDescriptions, NDescriptionsItem, NFlex, NTag, NText } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

type TagType = 'default' | 'success' | 'warning' | 'error' | 'info'

type StatusType = 'success' | 'error' | 'info'

type ValidationState = 'empty' | 'schema-error' | 'validated'

const props = defineProps<{
  state: ValidationState
  valid: boolean
  statusType: StatusType
  draftValue: string
  draftDetected: boolean
  errorsCount: number
  errorsJson: string
}>()

const { t } = useI18n()

const statusTagType = computed<TagType>(() => {
  if (props.statusType === 'info') return 'info'
  if (props.statusType === 'error') return 'error'
  return 'success'
})

const statusValue = computed(() => {
  if (props.state === 'validated') {
    return props.valid ? t('statusValid') : t('statusInvalid')
  }
  if (props.state === 'schema-error') {
    return t('statusSchemaError')
  }
  return t('statusPending')
})

const draftHint = computed(() => {
  if (!props.draftValue || props.draftValue === '-') return ''
  return props.draftDetected ? t('draftDetected') : t('draftDefault')
})
</script>

<i18n lang="json">
{
  "en": {
    "statusLabel": "Status",
    "statusValid": "Valid",
    "statusInvalid": "Invalid",
    "statusPending": "Waiting for inputs",
    "statusSchemaError": "Schema error",
    "draftLabel": "Schema Draft",
    "draftDetected": "from $schema",
    "draftDefault": "default",
    "errorsLabel": "Errors"
  },
  "zh": {
    "statusLabel": "状态",
    "statusValid": "有效",
    "statusInvalid": "无效",
    "statusPending": "等待输入",
    "statusSchemaError": "Schema 错误",
    "draftLabel": "Schema 草案",
    "draftDetected": "来自 $schema",
    "draftDefault": "默认",
    "errorsLabel": "错误"
  },
  "zh-CN": {
    "statusLabel": "状态",
    "statusValid": "有效",
    "statusInvalid": "无效",
    "statusPending": "等待输入",
    "statusSchemaError": "Schema 错误",
    "draftLabel": "Schema 草案",
    "draftDetected": "来自 $schema",
    "draftDefault": "默认",
    "errorsLabel": "错误"
  },
  "zh-TW": {
    "statusLabel": "狀態",
    "statusValid": "有效",
    "statusInvalid": "無效",
    "statusPending": "等待輸入",
    "statusSchemaError": "Schema 錯誤",
    "draftLabel": "Schema 草案",
    "draftDetected": "來自 $schema",
    "draftDefault": "預設",
    "errorsLabel": "錯誤"
  },
  "zh-HK": {
    "statusLabel": "狀態",
    "statusValid": "有效",
    "statusInvalid": "無效",
    "statusPending": "等待輸入",
    "statusSchemaError": "Schema 錯誤",
    "draftLabel": "Schema 草案",
    "draftDetected": "來自 $schema",
    "draftDefault": "預設",
    "errorsLabel": "錯誤"
  },
  "es": {
    "statusLabel": "Estado",
    "statusValid": "Válido",
    "statusInvalid": "No válido",
    "statusPending": "Esperando entradas",
    "statusSchemaError": "Error de esquema",
    "draftLabel": "Borrador del esquema",
    "draftDetected": "desde $schema",
    "draftDefault": "predeterminado",
    "errorsLabel": "Errores"
  },
  "fr": {
    "statusLabel": "Statut",
    "statusValid": "Valide",
    "statusInvalid": "Invalide",
    "statusPending": "En attente des entrées",
    "statusSchemaError": "Erreur de schéma",
    "draftLabel": "Version du schéma",
    "draftDetected": "depuis $schema",
    "draftDefault": "par défaut",
    "errorsLabel": "Erreurs"
  },
  "de": {
    "statusLabel": "Status",
    "statusValid": "Gültig",
    "statusInvalid": "Ungültig",
    "statusPending": "Warten auf Eingaben",
    "statusSchemaError": "Schemafehler",
    "draftLabel": "Schema-Entwurf",
    "draftDetected": "aus $schema",
    "draftDefault": "Standard",
    "errorsLabel": "Fehler"
  },
  "it": {
    "statusLabel": "Stato",
    "statusValid": "Valido",
    "statusInvalid": "Non valido",
    "statusPending": "In attesa di input",
    "statusSchemaError": "Errore schema",
    "draftLabel": "Bozza schema",
    "draftDetected": "da $schema",
    "draftDefault": "predefinito",
    "errorsLabel": "Errori"
  },
  "ja": {
    "statusLabel": "ステータス",
    "statusValid": "有効",
    "statusInvalid": "無効",
    "statusPending": "入力待ち",
    "statusSchemaError": "Schema エラー",
    "draftLabel": "Schema ドラフト",
    "draftDetected": "$schema から",
    "draftDefault": "既定",
    "errorsLabel": "エラー"
  },
  "ko": {
    "statusLabel": "상태",
    "statusValid": "유효함",
    "statusInvalid": "유효하지 않음",
    "statusPending": "입력 대기",
    "statusSchemaError": "스키마 오류",
    "draftLabel": "스키마 초안",
    "draftDetected": "$schema 기준",
    "draftDefault": "기본",
    "errorsLabel": "오류"
  },
  "ru": {
    "statusLabel": "Статус",
    "statusValid": "Действительно",
    "statusInvalid": "Недействительно",
    "statusPending": "Ожидание ввода",
    "statusSchemaError": "Ошибка схемы",
    "draftLabel": "Версия схемы",
    "draftDetected": "из $schema",
    "draftDefault": "по умолчанию",
    "errorsLabel": "Ошибки"
  },
  "pt": {
    "statusLabel": "Status",
    "statusValid": "Válido",
    "statusInvalid": "Inválido",
    "statusPending": "Aguardando entradas",
    "statusSchemaError": "Erro de esquema",
    "draftLabel": "Rascunho do esquema",
    "draftDetected": "de $schema",
    "draftDefault": "padrão",
    "errorsLabel": "Erros"
  },
  "ar": {
    "statusLabel": "الحالة",
    "statusValid": "صالح",
    "statusInvalid": "غير صالح",
    "statusPending": "في انتظار الإدخال",
    "statusSchemaError": "خطأ في المخطط",
    "draftLabel": "مسودة المخطط",
    "draftDetected": "من $schema",
    "draftDefault": "افتراضي",
    "errorsLabel": "الأخطاء"
  },
  "hi": {
    "statusLabel": "स्थिति",
    "statusValid": "मान्य",
    "statusInvalid": "अमान्य",
    "statusPending": "इनपुट का इंतज़ार",
    "statusSchemaError": "स्कीमा त्रुटि",
    "draftLabel": "स्कीमा ड्राफ्ट",
    "draftDetected": "$schema से",
    "draftDefault": "डिफ़ॉल्ट",
    "errorsLabel": "त्रुटियां"
  },
  "tr": {
    "statusLabel": "Durum",
    "statusValid": "Geçerli",
    "statusInvalid": "Geçersiz",
    "statusPending": "Girdi bekleniyor",
    "statusSchemaError": "Şema hatası",
    "draftLabel": "Şema taslağı",
    "draftDetected": "$schema'dan",
    "draftDefault": "varsayılan",
    "errorsLabel": "Hatalar"
  },
  "nl": {
    "statusLabel": "Status",
    "statusValid": "Geldig",
    "statusInvalid": "Ongeldig",
    "statusPending": "Wachten op invoer",
    "statusSchemaError": "Schemafout",
    "draftLabel": "Schema-versie",
    "draftDetected": "van $schema",
    "draftDefault": "standaard",
    "errorsLabel": "Fouten"
  },
  "sv": {
    "statusLabel": "Status",
    "statusValid": "Giltig",
    "statusInvalid": "Ogiltig",
    "statusPending": "Väntar på inmatning",
    "statusSchemaError": "Schemafel",
    "draftLabel": "Schemautkast",
    "draftDetected": "från $schema",
    "draftDefault": "standard",
    "errorsLabel": "Fel"
  },
  "pl": {
    "statusLabel": "Status",
    "statusValid": "Poprawny",
    "statusInvalid": "Niepoprawny",
    "statusPending": "Oczekiwanie na dane",
    "statusSchemaError": "Błąd schematu",
    "draftLabel": "Wersja schematu",
    "draftDetected": "z $schema",
    "draftDefault": "domyślnie",
    "errorsLabel": "Błędy"
  },
  "vi": {
    "statusLabel": "Trạng thái",
    "statusValid": "Hợp lệ",
    "statusInvalid": "Không hợp lệ",
    "statusPending": "Đang chờ dữ liệu",
    "statusSchemaError": "Lỗi schema",
    "draftLabel": "Bản nháp schema",
    "draftDetected": "từ $schema",
    "draftDefault": "mặc định",
    "errorsLabel": "Lỗi"
  },
  "th": {
    "statusLabel": "สถานะ",
    "statusValid": "ถูกต้อง",
    "statusInvalid": "ไม่ถูกต้อง",
    "statusPending": "รอข้อมูล",
    "statusSchemaError": "ข้อผิดพลาดของสคีมา",
    "draftLabel": "ฉบับร่างสคีมา",
    "draftDetected": "จาก $schema",
    "draftDefault": "ค่าเริ่มต้น",
    "errorsLabel": "ข้อผิดพลาด"
  },
  "id": {
    "statusLabel": "Status",
    "statusValid": "Valid",
    "statusInvalid": "Tidak valid",
    "statusPending": "Menunggu input",
    "statusSchemaError": "Kesalahan skema",
    "draftLabel": "Draf skema",
    "draftDetected": "dari $schema",
    "draftDefault": "default",
    "errorsLabel": "Kesalahan"
  },
  "he": {
    "statusLabel": "סטטוס",
    "statusValid": "תקין",
    "statusInvalid": "לא תקין",
    "statusPending": "ממתין לקלט",
    "statusSchemaError": "שגיאת סכימה",
    "draftLabel": "טיוטת סכימה",
    "draftDetected": "מ־$schema",
    "draftDefault": "ברירת מחדל",
    "errorsLabel": "שגיאות"
  },
  "ms": {
    "statusLabel": "Status",
    "statusValid": "Sah",
    "statusInvalid": "Tidak sah",
    "statusPending": "Menunggu input",
    "statusSchemaError": "Ralat skema",
    "draftLabel": "Draf skema",
    "draftDetected": "daripada $schema",
    "draftDefault": "lalai",
    "errorsLabel": "Ralat"
  },
  "no": {
    "statusLabel": "Status",
    "statusValid": "Gyldig",
    "statusInvalid": "Ugyldig",
    "statusPending": "Venter på inndata",
    "statusSchemaError": "Skjemafeil",
    "draftLabel": "Skjemautkast",
    "draftDetected": "fra $schema",
    "draftDefault": "standard",
    "errorsLabel": "Feil"
  }
}
</i18n>
