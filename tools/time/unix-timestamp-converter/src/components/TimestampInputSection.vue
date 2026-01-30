<template>
  <div>
    <ToolSectionHeader>{{ t('unix-timestamp') }}</ToolSectionHeader>
    <ToolSection>
      <n-input
        v-model:value="timestamp"
        type="text"
        :placeholder="t('timestamp-placeholder')"
        :status="isValid ? undefined : 'error'"
      />
    </ToolSection>
    <ToolSection>
      <n-flex justify="space-between" align="center">
        <n-flex :size="12">
          <CopyToClipboardButton :content="timestamp" />
          <n-button text @click="emit('set-now')">
            <template #icon>
              <n-icon :component="ClockIcon" />
            </template>
            {{ t('now') }}
          </n-button>
        </n-flex>
        <template v-if="!isValid">
          <n-text type="error">{{ t('invalid-timestamp') }}</n-text>
        </template>
      </n-flex>
    </ToolSection>
  </div>
</template>

<script setup lang="ts">
import { NInput, NFlex, NText, NButton, NIcon } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'
import ClockIcon from '@vicons/fluent/Clock16Regular'

const { t } = useI18n()

const timestamp = defineModel<string>('timestamp', { required: true })

defineProps<{ isValid: boolean }>()

const emit = defineEmits<{ (event: 'set-now'): void }>()
</script>

<i18n lang="json">
{
  "en": {
    "unix-timestamp": "Unix Timestamp",
    "timestamp-placeholder": "Enter Unix timestamp...",
    "invalid-timestamp": "Invalid timestamp",
    "now": "Now"
  },
  "zh": {
    "unix-timestamp": "Unix 时间戳",
    "timestamp-placeholder": "输入 Unix 时间戳...",
    "invalid-timestamp": "无效的时间戳",
    "now": "现在"
  },
  "zh-CN": {
    "unix-timestamp": "Unix 时间戳",
    "timestamp-placeholder": "输入 Unix 时间戳...",
    "invalid-timestamp": "无效的时间戳",
    "now": "现在"
  },
  "zh-TW": {
    "unix-timestamp": "Unix 時間戳記",
    "timestamp-placeholder": "輸入 Unix 時間戳記...",
    "invalid-timestamp": "無效的時間戳記",
    "now": "現在"
  },
  "zh-HK": {
    "unix-timestamp": "Unix 時間戳記",
    "timestamp-placeholder": "輸入 Unix 時間戳記...",
    "invalid-timestamp": "無效的時間戳記",
    "now": "現在"
  },
  "es": {
    "unix-timestamp": "Marca de Tiempo Unix",
    "timestamp-placeholder": "Ingrese marca de tiempo Unix...",
    "invalid-timestamp": "Marca de tiempo inválida",
    "now": "Ahora"
  },
  "fr": {
    "unix-timestamp": "Timestamp Unix",
    "timestamp-placeholder": "Entrez le timestamp Unix...",
    "invalid-timestamp": "Timestamp invalide",
    "now": "Maintenant"
  },
  "de": {
    "unix-timestamp": "Unix-Zeitstempel",
    "timestamp-placeholder": "Unix-Zeitstempel eingeben...",
    "invalid-timestamp": "Ungültiger Zeitstempel",
    "now": "Jetzt"
  },
  "it": {
    "unix-timestamp": "Timestamp Unix",
    "timestamp-placeholder": "Inserisci timestamp Unix...",
    "invalid-timestamp": "Timestamp non valido",
    "now": "Adesso"
  },
  "ja": {
    "unix-timestamp": "Unixタイムスタンプ",
    "timestamp-placeholder": "Unixタイムスタンプを入力...",
    "invalid-timestamp": "無効なタイムスタンプ",
    "now": "現在"
  },
  "ko": {
    "unix-timestamp": "Unix 타임스탬프",
    "timestamp-placeholder": "Unix 타임스탬프 입력...",
    "invalid-timestamp": "유효하지 않은 타임스탬프",
    "now": "현재"
  },
  "ru": {
    "unix-timestamp": "Unix-метка времени",
    "timestamp-placeholder": "Введите Unix-метку времени...",
    "invalid-timestamp": "Недопустимая метка времени",
    "now": "Сейчас"
  },
  "pt": {
    "unix-timestamp": "Timestamp Unix",
    "timestamp-placeholder": "Digite o timestamp Unix...",
    "invalid-timestamp": "Timestamp inválido",
    "now": "Agora"
  },
  "ar": {
    "unix-timestamp": "الطابع الزمني Unix",
    "timestamp-placeholder": "أدخل الطابع الزمني Unix...",
    "invalid-timestamp": "طابع زمني غير صالح",
    "now": "الآن"
  },
  "hi": {
    "unix-timestamp": "Unix टाइमस्टैम्प",
    "timestamp-placeholder": "Unix टाइमस्टैम्प दर्ज करें...",
    "invalid-timestamp": "अमान्य टाइमस्टैम्प",
    "now": "अभी"
  },
  "tr": {
    "unix-timestamp": "Unix Zaman Damgası",
    "timestamp-placeholder": "Unix zaman damgası girin...",
    "invalid-timestamp": "Geçersiz zaman damgası",
    "now": "Şimdi"
  },
  "nl": {
    "unix-timestamp": "Unix Tijdstempel",
    "timestamp-placeholder": "Voer Unix tijdstempel in...",
    "invalid-timestamp": "Ongeldige tijdstempel",
    "now": "Nu"
  },
  "sv": {
    "unix-timestamp": "Unix Tidsstämpel",
    "timestamp-placeholder": "Ange Unix tidsstämpel...",
    "invalid-timestamp": "Ogiltig tidsstämpel",
    "now": "Nu"
  },
  "pl": {
    "unix-timestamp": "Znacznik Czasu Unix",
    "timestamp-placeholder": "Wprowadź znacznik czasu Unix...",
    "invalid-timestamp": "Nieprawidłowy znacznik czasu",
    "now": "Teraz"
  },
  "vi": {
    "unix-timestamp": "Dấu Thời Gian Unix",
    "timestamp-placeholder": "Nhập dấu thời gian Unix...",
    "invalid-timestamp": "Dấu thời gian không hợp lệ",
    "now": "Bây giờ"
  },
  "th": {
    "unix-timestamp": "Unix Timestamp",
    "timestamp-placeholder": "ป้อน Unix timestamp...",
    "invalid-timestamp": "Timestamp ไม่ถูกต้อง",
    "now": "ตอนนี้"
  },
  "id": {
    "unix-timestamp": "Timestamp Unix",
    "timestamp-placeholder": "Masukkan timestamp Unix...",
    "invalid-timestamp": "Timestamp tidak valid",
    "now": "Sekarang"
  },
  "he": {
    "unix-timestamp": "חותמת זמן Unix",
    "timestamp-placeholder": "הזן חותמת זמן Unix...",
    "invalid-timestamp": "חותמת זמן לא תקינה",
    "now": "עכשיו"
  },
  "ms": {
    "unix-timestamp": "Cap Masa Unix",
    "timestamp-placeholder": "Masukkan cap masa Unix...",
    "invalid-timestamp": "Cap masa tidak sah",
    "now": "Sekarang"
  },
  "no": {
    "unix-timestamp": "Unix Tidsstempel",
    "timestamp-placeholder": "Skriv inn Unix tidsstempel...",
    "invalid-timestamp": "Ugyldig tidsstempel",
    "now": "Nå"
  }
}
</i18n>
