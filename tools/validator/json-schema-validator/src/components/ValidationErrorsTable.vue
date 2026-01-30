<template>
  <div v-if="errors.length" class="errors-table">
    <n-text depth="3">{{ errorsTitle }}</n-text>
    <n-data-table :columns="columns" :data="errors" :bordered="false" size="small" />
  </div>

  <n-text v-else-if="statusType === 'success'" depth="3">{{ t('noErrors') }}</n-text>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { NDataTable, NText } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { JsonSchemaValidationError } from '@utils/json-schema'

const props = defineProps<{
  errors: JsonSchemaValidationError[]
  statusType: 'success' | 'error' | 'info'
}>()

const { t } = useI18n()

const errorsCount = computed(() => props.errors.length)

const errorsTitle = computed(() =>
  errorsCount.value > 0
    ? t('errorsTitleWithCount', { count: errorsCount.value })
    : t('errorsTitle'),
)

const columns = computed<DataTableColumns<JsonSchemaValidationError>>(() => [
  {
    title: t('errorsColumnPath'),
    key: 'instancePath',
    render(row) {
      return h(NText, { code: true }, () => row.instancePath || '/')
    },
  },
  {
    title: t('errorsColumnMessage'),
    key: 'message',
  },
  {
    title: t('errorsColumnKeyword'),
    key: 'keyword',
  },
])
</script>

<style scoped>
.errors-table {
  margin-top: 12px;
  display: grid;
  gap: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "errorsTitle": "Errors",
    "errorsTitleWithCount": "Errors ({count})",
    "errorsColumnPath": "Path",
    "errorsColumnMessage": "Message",
    "errorsColumnKeyword": "Keyword",
    "noErrors": "No errors"
  },
  "zh": {
    "errorsTitle": "错误",
    "errorsTitleWithCount": "错误 ({count})",
    "errorsColumnPath": "路径",
    "errorsColumnMessage": "消息",
    "errorsColumnKeyword": "关键字",
    "noErrors": "无错误"
  },
  "zh-CN": {
    "errorsTitle": "错误",
    "errorsTitleWithCount": "错误 ({count})",
    "errorsColumnPath": "路径",
    "errorsColumnMessage": "消息",
    "errorsColumnKeyword": "关键字",
    "noErrors": "无错误"
  },
  "zh-TW": {
    "errorsTitle": "錯誤",
    "errorsTitleWithCount": "錯誤 ({count})",
    "errorsColumnPath": "路徑",
    "errorsColumnMessage": "訊息",
    "errorsColumnKeyword": "關鍵字",
    "noErrors": "沒有錯誤"
  },
  "zh-HK": {
    "errorsTitle": "錯誤",
    "errorsTitleWithCount": "錯誤 ({count})",
    "errorsColumnPath": "路徑",
    "errorsColumnMessage": "訊息",
    "errorsColumnKeyword": "關鍵字",
    "noErrors": "沒有錯誤"
  },
  "es": {
    "errorsTitle": "Errores",
    "errorsTitleWithCount": "Errores ({count})",
    "errorsColumnPath": "Ruta",
    "errorsColumnMessage": "Mensaje",
    "errorsColumnKeyword": "Palabra clave",
    "noErrors": "Sin errores"
  },
  "fr": {
    "errorsTitle": "Erreurs",
    "errorsTitleWithCount": "Erreurs ({count})",
    "errorsColumnPath": "Chemin",
    "errorsColumnMessage": "Message",
    "errorsColumnKeyword": "Mot-clé",
    "noErrors": "Aucune erreur"
  },
  "de": {
    "errorsTitle": "Fehler",
    "errorsTitleWithCount": "Fehler ({count})",
    "errorsColumnPath": "Pfad",
    "errorsColumnMessage": "Nachricht",
    "errorsColumnKeyword": "Schlüsselwort",
    "noErrors": "Keine Fehler"
  },
  "it": {
    "errorsTitle": "Errori",
    "errorsTitleWithCount": "Errori ({count})",
    "errorsColumnPath": "Percorso",
    "errorsColumnMessage": "Messaggio",
    "errorsColumnKeyword": "Parola chiave",
    "noErrors": "Nessun errore"
  },
  "ja": {
    "errorsTitle": "エラー",
    "errorsTitleWithCount": "エラー ({count})",
    "errorsColumnPath": "パス",
    "errorsColumnMessage": "メッセージ",
    "errorsColumnKeyword": "キーワード",
    "noErrors": "エラーなし"
  },
  "ko": {
    "errorsTitle": "오류",
    "errorsTitleWithCount": "오류 ({count})",
    "errorsColumnPath": "경로",
    "errorsColumnMessage": "메시지",
    "errorsColumnKeyword": "키워드",
    "noErrors": "오류 없음"
  },
  "ru": {
    "errorsTitle": "Ошибки",
    "errorsTitleWithCount": "Ошибки ({count})",
    "errorsColumnPath": "Путь",
    "errorsColumnMessage": "Сообщение",
    "errorsColumnKeyword": "Ключевое слово",
    "noErrors": "Ошибок нет"
  },
  "pt": {
    "errorsTitle": "Erros",
    "errorsTitleWithCount": "Erros ({count})",
    "errorsColumnPath": "Caminho",
    "errorsColumnMessage": "Mensagem",
    "errorsColumnKeyword": "Palavra-chave",
    "noErrors": "Sem erros"
  },
  "ar": {
    "errorsTitle": "الأخطاء",
    "errorsTitleWithCount": "الأخطاء ({count})",
    "errorsColumnPath": "المسار",
    "errorsColumnMessage": "الرسالة",
    "errorsColumnKeyword": "الكلمة المفتاحية",
    "noErrors": "لا توجد أخطاء"
  },
  "hi": {
    "errorsTitle": "त्रुटियां",
    "errorsTitleWithCount": "त्रुटियां ({count})",
    "errorsColumnPath": "पथ",
    "errorsColumnMessage": "संदेश",
    "errorsColumnKeyword": "कीवर्ड",
    "noErrors": "कोई त्रुटि नहीं"
  },
  "tr": {
    "errorsTitle": "Hatalar",
    "errorsTitleWithCount": "Hatalar ({count})",
    "errorsColumnPath": "Yol",
    "errorsColumnMessage": "Mesaj",
    "errorsColumnKeyword": "Anahtar kelime",
    "noErrors": "Hata yok"
  },
  "nl": {
    "errorsTitle": "Fouten",
    "errorsTitleWithCount": "Fouten ({count})",
    "errorsColumnPath": "Pad",
    "errorsColumnMessage": "Bericht",
    "errorsColumnKeyword": "Trefwoord",
    "noErrors": "Geen fouten"
  },
  "sv": {
    "errorsTitle": "Fel",
    "errorsTitleWithCount": "Fel ({count})",
    "errorsColumnPath": "Sökväg",
    "errorsColumnMessage": "Meddelande",
    "errorsColumnKeyword": "Nyckelord",
    "noErrors": "Inga fel"
  },
  "pl": {
    "errorsTitle": "Błędy",
    "errorsTitleWithCount": "Błędy ({count})",
    "errorsColumnPath": "Ścieżka",
    "errorsColumnMessage": "Wiadomość",
    "errorsColumnKeyword": "Słowo kluczowe",
    "noErrors": "Brak błędów"
  },
  "vi": {
    "errorsTitle": "Lỗi",
    "errorsTitleWithCount": "Lỗi ({count})",
    "errorsColumnPath": "Đường dẫn",
    "errorsColumnMessage": "Thông báo",
    "errorsColumnKeyword": "Từ khóa",
    "noErrors": "Không có lỗi"
  },
  "th": {
    "errorsTitle": "ข้อผิดพลาด",
    "errorsTitleWithCount": "ข้อผิดพลาด ({count})",
    "errorsColumnPath": "เส้นทาง",
    "errorsColumnMessage": "ข้อความ",
    "errorsColumnKeyword": "คีย์เวิร์ด",
    "noErrors": "ไม่มีข้อผิดพลาด"
  },
  "id": {
    "errorsTitle": "Kesalahan",
    "errorsTitleWithCount": "Kesalahan ({count})",
    "errorsColumnPath": "Jalur",
    "errorsColumnMessage": "Pesan",
    "errorsColumnKeyword": "Kata kunci",
    "noErrors": "Tidak ada kesalahan"
  },
  "he": {
    "errorsTitle": "שגיאות",
    "errorsTitleWithCount": "שגיאות ({count})",
    "errorsColumnPath": "נתיב",
    "errorsColumnMessage": "הודעה",
    "errorsColumnKeyword": "מילת מפתח",
    "noErrors": "אין שגיאות"
  },
  "ms": {
    "errorsTitle": "Ralat",
    "errorsTitleWithCount": "Ralat ({count})",
    "errorsColumnPath": "Laluan",
    "errorsColumnMessage": "Mesej",
    "errorsColumnKeyword": "Kata kunci",
    "noErrors": "Tiada ralat"
  },
  "no": {
    "errorsTitle": "Feil",
    "errorsTitleWithCount": "Feil ({count})",
    "errorsColumnPath": "Sti",
    "errorsColumnMessage": "Melding",
    "errorsColumnKeyword": "Nøkkelord",
    "noErrors": "Ingen feil"
  }
}
</i18n>
