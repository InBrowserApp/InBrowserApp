<template>
  <n-alert v-if="!issues.length" type="success" :bordered="false">{{ t('no-issues') }}</n-alert>

  <div v-else class="lint-result">
    <n-text depth="3">
      {{ t('summary') }}: {{ t('errors') }} {{ counts.error }}, {{ t('warnings') }}
      {{ counts.warning }}, {{ t('info') }} {{ counts.info }}
    </n-text>

    <n-table :bordered="false" size="small">
      <thead>
        <tr>
          <th>{{ t('severity') }}</th>
          <th>{{ t('code') }}</th>
          <th>{{ t('location') }}</th>
          <th>{{ t('message') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="issue in issues"
          :key="`${issue.code}:${issue.line}:${issue.column}:${issue.message}`"
        >
          <td>
            <n-tag size="small" :bordered="false" :type="severityTypeMap[issue.severity]">
              {{ severityLabelMap[issue.severity] }}
            </n-tag>
          </td>
          <td>
            <n-text code>{{ issue.code }}</n-text>
          </td>
          <td>
            <n-text code>{{ issue.line }}:{{ issue.column }}</n-text>
          </td>
          <td>{{ issue.message }}</td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NTable, NTag, NText } from 'naive-ui'
import type { SqlLintIssue } from '../sqlLint'

const props = defineProps<{
  issues: SqlLintIssue[]
}>()

const { t } = useI18n({ useScope: 'local' })

const counts = computed(() => {
  const count = {
    error: 0,
    warning: 0,
    info: 0,
  }

  for (const issue of props.issues) {
    count[issue.severity] += 1
  }

  return count
})

const severityTypeMap: Record<SqlLintIssue['severity'], 'error' | 'warning' | 'info'> = {
  error: 'error',
  warning: 'warning',
  info: 'info',
}

const severityLabelMap = computed<Record<SqlLintIssue['severity'], string>>(() => ({
  error: t('errors'),
  warning: t('warnings'),
  info: t('info'),
}))
</script>

<style scoped>
.lint-result {
  display: grid;
  gap: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "zh": {
    "summary": "汇总",
    "errors": "错误",
    "warnings": "警告",
    "info": "提示",
    "no-issues": "未发现 lint 问题。",
    "severity": "级别",
    "code": "规则",
    "location": "位置",
    "message": "信息"
  },
  "zh-CN": {
    "summary": "汇总",
    "errors": "错误",
    "warnings": "警告",
    "info": "提示",
    "no-issues": "未发现 lint 问题。",
    "severity": "级别",
    "code": "规则",
    "location": "位置",
    "message": "信息"
  },
  "zh-TW": {
    "summary": "摘要",
    "errors": "錯誤",
    "warnings": "警告",
    "info": "資訊",
    "no-issues": "未發現 lint 問題。",
    "severity": "等級",
    "code": "規則",
    "location": "位置",
    "message": "訊息"
  },
  "zh-HK": {
    "summary": "摘要",
    "errors": "錯誤",
    "warnings": "警告",
    "info": "資訊",
    "no-issues": "未發現 lint 問題。",
    "severity": "等級",
    "code": "規則",
    "location": "位置",
    "message": "訊息"
  },
  "es": {
    "summary": "Resumen",
    "errors": "Errores",
    "warnings": "Advertencias",
    "info": "Información",
    "no-issues": "No se encontraron problemas de lint.",
    "severity": "Severidad",
    "code": "Código",
    "location": "Ubicación",
    "message": "Mensaje"
  },
  "fr": {
    "summary": "Résumé",
    "errors": "Erreurs",
    "warnings": "Avertissements",
    "info": "Info",
    "no-issues": "Aucun problème de lint détecté.",
    "severity": "Gravité",
    "code": "Code",
    "location": "Emplacement",
    "message": "Message"
  },
  "de": {
    "summary": "Zusammenfassung",
    "errors": "Fehler",
    "warnings": "Warnungen",
    "info": "Info",
    "no-issues": "Keine Lint-Probleme gefunden.",
    "severity": "Schweregrad",
    "code": "Code",
    "location": "Position",
    "message": "Meldung"
  },
  "it": {
    "summary": "Riepilogo",
    "errors": "Errori",
    "warnings": "Avvisi",
    "info": "Info",
    "no-issues": "Nessun problema lint trovato.",
    "severity": "Gravità",
    "code": "Codice",
    "location": "Posizione",
    "message": "Messaggio"
  },
  "ja": {
    "summary": "概要",
    "errors": "エラー",
    "warnings": "警告",
    "info": "情報",
    "no-issues": "lint の問題は見つかりませんでした。",
    "severity": "重要度",
    "code": "コード",
    "location": "位置",
    "message": "メッセージ"
  },
  "ko": {
    "summary": "요약",
    "errors": "오류",
    "warnings": "경고",
    "info": "정보",
    "no-issues": "lint 문제가 없습니다.",
    "severity": "심각도",
    "code": "코드",
    "location": "위치",
    "message": "메시지"
  },
  "ru": {
    "summary": "Сводка",
    "errors": "Ошибки",
    "warnings": "Предупреждения",
    "info": "Инфо",
    "no-issues": "Проблем lint не найдено.",
    "severity": "Серьезность",
    "code": "Код",
    "location": "Позиция",
    "message": "Сообщение"
  },
  "pt": {
    "summary": "Resumo",
    "errors": "Erros",
    "warnings": "Avisos",
    "info": "Informações",
    "no-issues": "Nenhum problema de lint encontrado.",
    "severity": "Severidade",
    "code": "Código",
    "location": "Localização",
    "message": "Mensagem"
  },
  "ar": {
    "summary": "الملخص",
    "errors": "أخطاء",
    "warnings": "تحذيرات",
    "info": "معلومات",
    "no-issues": "لم يتم العثور على مشكلات تدقيق.",
    "severity": "الخطورة",
    "code": "الرمز",
    "location": "الموقع",
    "message": "الرسالة"
  },
  "hi": {
    "summary": "सारांश",
    "errors": "त्रुटियाँ",
    "warnings": "चेतावनियाँ",
    "info": "जानकारी",
    "no-issues": "कोई लिंट समस्या नहीं मिली।",
    "severity": "गंभीरता",
    "code": "कोड",
    "location": "स्थान",
    "message": "संदेश"
  },
  "tr": {
    "summary": "Özet",
    "errors": "Hatalar",
    "warnings": "Uyarılar",
    "info": "Bilgi",
    "no-issues": "Lint sorunu bulunamadı.",
    "severity": "Önem Derecesi",
    "code": "Kod",
    "location": "Konum",
    "message": "Mesaj"
  },
  "nl": {
    "summary": "Overzicht",
    "errors": "Fouten",
    "warnings": "Waarschuwingen",
    "info": "Info",
    "no-issues": "Geen lint-problemen gevonden.",
    "severity": "Ernst",
    "code": "Code",
    "location": "Locatie",
    "message": "Bericht"
  },
  "sv": {
    "summary": "Sammanfattning",
    "errors": "Fel",
    "warnings": "Varningar",
    "info": "Info",
    "no-issues": "Inga lint-problem hittades.",
    "severity": "Allvarlighetsgrad",
    "code": "Kod",
    "location": "Plats",
    "message": "Meddelande"
  },
  "pl": {
    "summary": "Podsumowanie",
    "errors": "Błędy",
    "warnings": "Ostrzeżenia",
    "info": "Informacje",
    "no-issues": "Nie znaleziono problemów lint.",
    "severity": "Poziom",
    "code": "Kod",
    "location": "Lokalizacja",
    "message": "Komunikat"
  },
  "vi": {
    "summary": "Tóm tắt",
    "errors": "Lỗi",
    "warnings": "Cảnh báo",
    "info": "Thông tin",
    "no-issues": "Không tìm thấy vấn đề lint.",
    "severity": "Mức độ",
    "code": "Mã",
    "location": "Vị trí",
    "message": "Thông điệp"
  },
  "th": {
    "summary": "สรุป",
    "errors": "ข้อผิดพลาด",
    "warnings": "คำเตือน",
    "info": "ข้อมูล",
    "no-issues": "ไม่พบปัญหา lint",
    "severity": "ความรุนแรง",
    "code": "โค้ด",
    "location": "ตำแหน่ง",
    "message": "ข้อความ"
  },
  "id": {
    "summary": "Ringkasan",
    "errors": "Error",
    "warnings": "Peringatan",
    "info": "Info",
    "no-issues": "Tidak ada masalah lint ditemukan.",
    "severity": "Tingkat Keparahan",
    "code": "Kode",
    "location": "Lokasi",
    "message": "Pesan"
  },
  "he": {
    "summary": "סיכום",
    "errors": "שגיאות",
    "warnings": "אזהרות",
    "info": "מידע",
    "no-issues": "לא נמצאו בעיות lint.",
    "severity": "חומרה",
    "code": "קוד",
    "location": "מיקום",
    "message": "הודעה"
  },
  "ms": {
    "summary": "Ringkasan",
    "errors": "Ralat",
    "warnings": "Amaran",
    "info": "Info",
    "no-issues": "Tiada isu lint ditemui.",
    "severity": "Keterukan",
    "code": "Kod",
    "location": "Lokasi",
    "message": "Mesej"
  },
  "no": {
    "summary": "Sammendrag",
    "errors": "Feil",
    "warnings": "Advarsler",
    "info": "Info",
    "no-issues": "Ingen lint-problemer funnet.",
    "severity": "Alvorlighetsgrad",
    "code": "Kode",
    "location": "Plassering",
    "message": "Melding"
  }
}
</i18n>
