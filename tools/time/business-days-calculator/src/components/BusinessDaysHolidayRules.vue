<template>
  <n-form-item :label="t('holidays')" :show-feedback="holidayInvalidCount > 0">
    <n-input
      v-model:value="holidayList"
      type="textarea"
      :placeholder="t('holiday-placeholder')"
      :autosize="{ minRows: 3, maxRows: 6 }"
      :status="holidayStatus"
    />
    <template v-if="holidayInvalidCount" #feedback>
      <n-text type="error">{{ t('invalid-holidays', { count: holidayInvalidCount }) }}</n-text>
    </template>
  </n-form-item>
  <n-text depth="3">{{ t('holiday-hint') }}</n-text>
  <n-text depth="3">{{ t('holiday-note') }}</n-text>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFormItem, NInput, NText } from 'naive-ui'

const holidayList = defineModel<string>('holidayList', { required: true })

defineProps<{
  holidayInvalidCount: number
  holidayStatus?: 'error' | 'success'
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "holidays": "Holidays",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), one per line",
    "holiday-hint": "Optional. Holidays on weekdays are excluded.",
    "holiday-note": "Weekend holidays are already excluded by weekend settings.",
    "invalid-holidays": "Invalid entries: {count}"
  },
  "zh": {
    "holidays": "节假日",
    "holiday-placeholder": "例如：2026-01-15（YYYY-MM-DD），每行一个",
    "holiday-hint": "可选。工作日中的节假日将被排除。",
    "holiday-note": "周末节假日已由周末设置排除。",
    "invalid-holidays": "无效条目：{count}"
  },
  "zh-CN": {
    "holidays": "节假日",
    "holiday-placeholder": "例如：2026-01-15（YYYY-MM-DD），每行一个",
    "holiday-hint": "可选。工作日中的节假日将被排除。",
    "holiday-note": "周末节假日已由周末设置排除。",
    "invalid-holidays": "无效条目：{count}"
  },
  "zh-TW": {
    "holidays": "節假日",
    "holiday-placeholder": "例如：2026-01-15（YYYY-MM-DD），每行一個",
    "holiday-hint": "可選。工作日中的節假日將被排除。",
    "holiday-note": "週末節假日已由週末設定排除。",
    "invalid-holidays": "無效項目：{count}"
  },
  "zh-HK": {
    "holidays": "節假日",
    "holiday-placeholder": "例如：2026-01-15（YYYY-MM-DD），每行一個",
    "holiday-hint": "可選。工作日中的節假日將被排除。",
    "holiday-note": "週末節假日已由週末設定排除。",
    "invalid-holidays": "無效項目：{count}"
  },
  "es": {
    "holidays": "Festivos",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), uno por línea",
    "holiday-hint": "Opcional. Los festivos en días laborables se excluyen.",
    "holiday-note": "Los festivos en fin de semana ya se excluyen por la configuración de fines de semana.",
    "invalid-holidays": "Entradas inválidas: {count}"
  },
  "fr": {
    "holidays": "Jours fériés",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), un par ligne",
    "holiday-hint": "Optionnel. Les jours fériés en semaine sont exclus.",
    "holiday-note": "Les jours fériés le week-end sont déjà exclus par les réglages des week-ends.",
    "invalid-holidays": "Entrées invalides : {count}"
  },
  "de": {
    "holidays": "Feiertage",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), eine pro Zeile",
    "holiday-hint": "Optional. Feiertage an Werktagen werden ausgeschlossen.",
    "holiday-note": "Feiertage am Wochenende sind durch die Wochenendeinstellungen bereits ausgeschlossen.",
    "invalid-holidays": "Ungültige Einträge: {count}"
  },
  "it": {
    "holidays": "Festività",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), uno per riga",
    "holiday-hint": "Opzionale. Le festività nei giorni lavorativi sono escluse.",
    "holiday-note": "Le festività nel weekend sono già escluse dalle impostazioni del weekend.",
    "invalid-holidays": "Voci non valide: {count}"
  },
  "ja": {
    "holidays": "祝日",
    "holiday-placeholder": "2026-01-15（YYYY-MM-DD）、1行に1件",
    "holiday-hint": "任意。平日の祝日は除外されます。",
    "holiday-note": "週末の祝日は週末設定で既に除外されます。",
    "invalid-holidays": "無効な項目: {count}"
  },
  "ko": {
    "holidays": "공휴일",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), 한 줄에 하나",
    "holiday-hint": "선택 사항. 평일 공휴일은 제외됩니다.",
    "holiday-note": "주말 공휴일은 주말 설정으로 이미 제외됩니다.",
    "invalid-holidays": "잘못된 항목: {count}"
  },
  "ru": {
    "holidays": "Праздники",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), по одному в строке",
    "holiday-hint": "Необязательно. Праздники в будни исключаются.",
    "holiday-note": "Праздники в выходные уже исключены настройками выходных.",
    "invalid-holidays": "Недействительные записи: {count}"
  },
  "pt": {
    "holidays": "Feriados",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), um por linha",
    "holiday-hint": "Opcional. Feriados em dias úteis são excluídos.",
    "holiday-note": "Feriados no fim de semana já são excluídos pelas configurações de fim de semana.",
    "invalid-holidays": "Entradas inválidas: {count}"
  },
  "ar": {
    "holidays": "العطلات",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD)، واحد لكل سطر",
    "holiday-hint": "اختياري. يتم استبعاد العطلات في أيام العمل.",
    "holiday-note": "عطلات نهاية الأسبوع مستبعدة بالفعل عبر إعدادات نهاية الأسبوع.",
    "invalid-holidays": "إدخالات غير صالحة: {count}"
  },
  "hi": {
    "holidays": "छुट्टियां",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), प्रति पंक्ति एक",
    "holiday-hint": "वैकल्पिक। कार्यदिवस की छुट्टियां शामिल नहीं होंगी।",
    "holiday-note": "सप्ताहांत की छुट्टियां पहले से ही सप्ताहांत सेटिंग से हटाई जाती हैं।",
    "invalid-holidays": "अमान्य प्रविष्टियां: {count}"
  },
  "tr": {
    "holidays": "Tatiller",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), satır başına bir",
    "holiday-hint": "İsteğe bağlı. Hafta içi tatiller hariç tutulur.",
    "holiday-note": "Hafta sonu tatilleri hafta sonu ayarlarıyla zaten hariç tutulur.",
    "invalid-holidays": "Geçersiz girdiler: {count}"
  },
  "nl": {
    "holidays": "Feestdagen",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), één per regel",
    "holiday-hint": "Optioneel. Feestdagen op werkdagen worden uitgesloten.",
    "holiday-note": "Feestdagen in het weekend zijn al uitgesloten via de weekendinstellingen.",
    "invalid-holidays": "Ongeldige items: {count}"
  },
  "sv": {
    "holidays": "Helgdagar",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), en per rad",
    "holiday-hint": "Valfritt. Helgdagar på vardagar utesluts.",
    "holiday-note": "Helgdagar på helger är redan uteslutna via helginställningar.",
    "invalid-holidays": "Ogiltiga poster: {count}"
  },
  "pl": {
    "holidays": "Święta",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), po jednym na linię",
    "holiday-hint": "Opcjonalnie. Święta w dni robocze są wykluczane.",
    "holiday-note": "Święta w weekendy są już wykluczone przez ustawienia weekendu.",
    "invalid-holidays": "Nieprawidłowe wpisy: {count}"
  },
  "vi": {
    "holidays": "Ngày lễ",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), mỗi dòng một ngày",
    "holiday-hint": "Tùy chọn. Ngày lễ rơi vào ngày làm việc sẽ bị loại trừ.",
    "holiday-note": "Ngày lễ vào cuối tuần đã được loại trừ bởi thiết lập cuối tuần.",
    "invalid-holidays": "Mục không hợp lệ: {count}"
  },
  "th": {
    "holidays": "วันหยุด",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), หนึ่งรายการต่อบรรทัด",
    "holiday-hint": "ไม่บังคับ วันหยุดที่ตรงกับวันทำงานจะถูกตัดออก",
    "holiday-note": "วันหยุดที่ตรงกับวันสุดสัปดาห์ถูกตัดออกแล้วตามการตั้งค่าวันสุดสัปดาห์",
    "invalid-holidays": "รายการไม่ถูกต้อง: {count}"
  },
  "id": {
    "holidays": "Hari libur",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), satu per baris",
    "holiday-hint": "Opsional. Hari libur pada hari kerja dikecualikan.",
    "holiday-note": "Hari libur pada akhir pekan sudah dikecualikan oleh pengaturan akhir pekan.",
    "invalid-holidays": "Entri tidak valid: {count}"
  },
  "he": {
    "holidays": "חגים",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), אחד בכל שורה",
    "holiday-hint": "אופציונלי. חגים בימי עבודה יוחרגו.",
    "holiday-note": "חגים בסוף שבוע כבר מוחרגים באמצעות הגדרות סוף שבוע.",
    "invalid-holidays": "רשומות לא תקינות: {count}"
  },
  "ms": {
    "holidays": "Cuti umum",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), satu setiap baris",
    "holiday-hint": "Pilihan. Cuti pada hari bekerja dikecualikan.",
    "holiday-note": "Cuti hujung minggu sudah dikecualikan oleh tetapan hujung minggu.",
    "invalid-holidays": "Entri tidak sah: {count}"
  },
  "no": {
    "holidays": "Fridager",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), en per linje",
    "holiday-hint": "Valgfritt. Fridager på hverdager ekskluderes.",
    "holiday-note": "Fridager i helger er allerede ekskludert av helgeinnstillingene.",
    "invalid-holidays": "Ugyldige oppføringer: {count}"
  }
}
</i18n>
