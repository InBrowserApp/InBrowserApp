<template>
  <ToolSectionHeader>{{ t('add-subtract-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 900:2" x-gap="16" y-gap="16">
      <n-gi>
        <n-flex vertical :size="12" class="range-card">
          <n-form-item :label="t('base-date')">
            <n-date-picker v-model:value="baseDate" type="date" style="width: 100%" />
          </n-form-item>
          <n-form-item :label="t('business-days-offset')">
            <n-input-number v-model:value="dayOffset" :min="0" :precision="0" style="width: 100%" />
          </n-form-item>
          <n-flex align="center" :size="12">
            <n-switch v-model:value="includeStart" />
            <n-text>{{ t('include-start') }}</n-text>
          </n-flex>
          <n-text v-if="!hasWorkingDays" type="error">{{ t('no-working-days') }}</n-text>
        </n-flex>
      </n-gi>
      <n-gi>
        <n-flex vertical :size="12" class="result-column">
          <n-flex vertical :size="8" class="result-card">
            <n-text strong>{{ t('add') }}</n-text>
            <n-descriptions :column="1" label-placement="left" bordered>
              <n-descriptions-item :label="t('result-date')">
                <n-flex align="center" :size="8">
                  <code>{{ addDateLabel || '-' }}</code>
                  <CopyToClipboardButton v-if="addDateLabel" :content="addDateLabel" size="tiny" />
                </n-flex>
              </n-descriptions-item>
            </n-descriptions>
          </n-flex>
          <n-flex vertical :size="8" class="result-card">
            <n-text strong>{{ t('subtract') }}</n-text>
            <n-descriptions :column="1" label-placement="left" bordered>
              <n-descriptions-item :label="t('result-date')">
                <n-flex align="center" :size="8">
                  <code>{{ subtractDateLabel || '-' }}</code>
                  <CopyToClipboardButton
                    v-if="subtractDateLabel"
                    :content="subtractDateLabel"
                    size="tiny"
                  />
                </n-flex>
              </n-descriptions-item>
            </n-descriptions>
          </n-flex>
        </n-flex>
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  NDatePicker,
  NDescriptions,
  NDescriptionsItem,
  NFlex,
  NFormItem,
  NGi,
  NGrid,
  NInputNumber,
  NSwitch,
  NText,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  hasWorkingDays: boolean
  addDateLabel: string
  subtractDateLabel: string
}>()
const baseDate = defineModel<number | null>('baseDate', { required: true })
const dayOffset = defineModel<number | null>('dayOffset', { required: true })
const includeStart = defineModel<boolean>('includeStart', { required: true })

const { t } = useI18n()
</script>

<style scoped>
.range-card,
.result-card {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--n-border-color);
}

.result-column {
  width: 100%;
}
</style>

<i18n lang="json">
{
  "en": {
    "add-subtract-title": "Add/Subtract Business Days",
    "base-date": "Base date",
    "business-days-offset": "Business days",
    "include-start": "Count start date as day 1",
    "no-working-days": "No working days selected.",
    "add": "Add",
    "subtract": "Subtract",
    "result-date": "Date"
  },
  "zh": {
    "add-subtract-title": "工作日加减",
    "base-date": "基准日期",
    "business-days-offset": "工作日数",
    "include-start": "将开始日期计为第 1 天",
    "no-working-days": "未选择任何工作日。",
    "add": "加",
    "subtract": "减",
    "result-date": "日期"
  },
  "zh-CN": {
    "add-subtract-title": "工作日加减",
    "base-date": "基准日期",
    "business-days-offset": "工作日数",
    "include-start": "将开始日期计为第 1 天",
    "no-working-days": "未选择任何工作日。",
    "add": "加",
    "subtract": "减",
    "result-date": "日期"
  },
  "zh-TW": {
    "add-subtract-title": "工作日加減",
    "base-date": "基準日期",
    "business-days-offset": "工作日數",
    "include-start": "將開始日期計為第 1 天",
    "no-working-days": "未選擇任何工作日。",
    "add": "加",
    "subtract": "減",
    "result-date": "日期"
  },
  "zh-HK": {
    "add-subtract-title": "工作日加減",
    "base-date": "基準日期",
    "business-days-offset": "工作日數",
    "include-start": "將開始日期計為第 1 天",
    "no-working-days": "未選擇任何工作日。",
    "add": "加",
    "subtract": "減",
    "result-date": "日期"
  },
  "es": {
    "add-subtract-title": "Sumar/Restar días hábiles",
    "base-date": "Fecha base",
    "business-days-offset": "Días hábiles",
    "include-start": "Contar la fecha de inicio como día 1",
    "no-working-days": "No se seleccionaron días laborables.",
    "add": "Sumar",
    "subtract": "Restar",
    "result-date": "Fecha"
  },
  "fr": {
    "add-subtract-title": "Ajouter/Soustraire des jours ouvrés",
    "base-date": "Date de base",
    "business-days-offset": "Jours ouvrés",
    "include-start": "Compter la date de départ comme jour 1",
    "no-working-days": "Aucun jour ouvré sélectionné.",
    "add": "Ajouter",
    "subtract": "Soustraire",
    "result-date": "Date"
  },
  "de": {
    "add-subtract-title": "Arbeitstage hinzufügen/abziehen",
    "base-date": "Basisdatum",
    "business-days-offset": "Arbeitstage",
    "include-start": "Startdatum als Tag 1 zählen",
    "no-working-days": "Keine Arbeitstage ausgewählt.",
    "add": "Hinzufügen",
    "subtract": "Abziehen",
    "result-date": "Datum"
  },
  "it": {
    "add-subtract-title": "Aggiungi/Sottrai giorni lavorativi",
    "base-date": "Data base",
    "business-days-offset": "Giorni lavorativi",
    "include-start": "Conta la data di inizio come giorno 1",
    "no-working-days": "Nessun giorno lavorativo selezionato.",
    "add": "Aggiungi",
    "subtract": "Sottrai",
    "result-date": "Data"
  },
  "ja": {
    "add-subtract-title": "営業日の加算/減算",
    "base-date": "基準日",
    "business-days-offset": "営業日数",
    "include-start": "開始日を1日目として数える",
    "no-working-days": "営業日が選択されていません。",
    "add": "加算",
    "subtract": "減算",
    "result-date": "日付"
  },
  "ko": {
    "add-subtract-title": "영업일 더하기/빼기",
    "base-date": "기준일",
    "business-days-offset": "영업일 수",
    "include-start": "시작일을 1일차로 계산",
    "no-working-days": "근무일이 선택되지 않았습니다.",
    "add": "더하기",
    "subtract": "빼기",
    "result-date": "날짜"
  },
  "ru": {
    "add-subtract-title": "Добавить/вычесть рабочие дни",
    "base-date": "Базовая дата",
    "business-days-offset": "Рабочие дни",
    "include-start": "Считать дату начала как день 1",
    "no-working-days": "Рабочие дни не выбраны.",
    "add": "Добавить",
    "subtract": "Вычесть",
    "result-date": "Дата"
  },
  "pt": {
    "add-subtract-title": "Adicionar/Subtrair dias úteis",
    "base-date": "Data base",
    "business-days-offset": "Dias úteis",
    "include-start": "Contar a data de início como dia 1",
    "no-working-days": "Nenhum dia útil selecionado.",
    "add": "Adicionar",
    "subtract": "Subtrair",
    "result-date": "Data"
  },
  "ar": {
    "add-subtract-title": "إضافة/طرح أيام العمل",
    "base-date": "التاريخ الأساسي",
    "business-days-offset": "أيام العمل",
    "include-start": "اعتبار تاريخ البدء اليوم الأول",
    "no-working-days": "لم يتم اختيار أي أيام عمل.",
    "add": "إضافة",
    "subtract": "طرح",
    "result-date": "التاريخ"
  },
  "hi": {
    "add-subtract-title": "कार्यदिवस जोड़ें/घटाएं",
    "base-date": "आधार तिथि",
    "business-days-offset": "कार्यदिवस",
    "include-start": "आरंभ तिथि को दिन 1 मानें",
    "no-working-days": "कोई कार्यदिवस चयनित नहीं है।",
    "add": "जोड़ें",
    "subtract": "घटाएं",
    "result-date": "तिथि"
  },
  "tr": {
    "add-subtract-title": "İş günü ekle/çıkar",
    "base-date": "Temel tarih",
    "business-days-offset": "İş günleri",
    "include-start": "Başlangıç tarihini 1. gün say",
    "no-working-days": "Hiç iş günü seçilmedi.",
    "add": "Ekle",
    "subtract": "Çıkar",
    "result-date": "Tarih"
  },
  "nl": {
    "add-subtract-title": "Werkdagen optellen/aftrekken",
    "base-date": "Basisdatum",
    "business-days-offset": "Werkdagen",
    "include-start": "Startdatum als dag 1 tellen",
    "no-working-days": "Geen werkdagen geselecteerd.",
    "add": "Optellen",
    "subtract": "Aftrekken",
    "result-date": "Datum"
  },
  "sv": {
    "add-subtract-title": "Lägg till/ta bort arbetsdagar",
    "base-date": "Basdatum",
    "business-days-offset": "Arbetsdagar",
    "include-start": "Räkna startdatum som dag 1",
    "no-working-days": "Inga arbetsdagar valda.",
    "add": "Lägg till",
    "subtract": "Ta bort",
    "result-date": "Datum"
  },
  "pl": {
    "add-subtract-title": "Dodaj/odejmij dni robocze",
    "base-date": "Data bazowa",
    "business-days-offset": "Dni robocze",
    "include-start": "Licz datę początkową jako dzień 1",
    "no-working-days": "Nie wybrano dni roboczych.",
    "add": "Dodaj",
    "subtract": "Odejmij",
    "result-date": "Data"
  },
  "vi": {
    "add-subtract-title": "Cộng/Trừ ngày làm việc",
    "base-date": "Ngày cơ sở",
    "business-days-offset": "Ngày làm việc",
    "include-start": "Tính ngày bắt đầu là ngày 1",
    "no-working-days": "Chưa chọn ngày làm việc.",
    "add": "Cộng",
    "subtract": "Trừ",
    "result-date": "Ngày"
  },
  "th": {
    "add-subtract-title": "บวก/ลบวันทำงาน",
    "base-date": "วันที่อ้างอิง",
    "business-days-offset": "วันทำงาน",
    "include-start": "นับวันที่เริ่มต้นเป็นวันที่ 1",
    "no-working-days": "ยังไม่ได้เลือกวันทำงาน",
    "add": "บวก",
    "subtract": "ลบ",
    "result-date": "วันที่"
  },
  "id": {
    "add-subtract-title": "Tambah/Kurang hari kerja",
    "base-date": "Tanggal dasar",
    "business-days-offset": "Hari kerja",
    "include-start": "Hitung tanggal mulai sebagai hari ke-1",
    "no-working-days": "Tidak ada hari kerja yang dipilih.",
    "add": "Tambah",
    "subtract": "Kurangi",
    "result-date": "Tanggal"
  },
  "he": {
    "add-subtract-title": "הוספה/הפחתה של ימי עבודה",
    "base-date": "תאריך בסיס",
    "business-days-offset": "ימי עבודה",
    "include-start": "ספור את תאריך ההתחלה כיום 1",
    "no-working-days": "לא נבחרו ימי עבודה.",
    "add": "הוסף",
    "subtract": "החסר",
    "result-date": "תאריך"
  },
  "ms": {
    "add-subtract-title": "Tambah/Tolak hari bekerja",
    "base-date": "Tarikh asas",
    "business-days-offset": "Hari bekerja",
    "include-start": "Kira tarikh mula sebagai hari 1",
    "no-working-days": "Tiada hari bekerja dipilih.",
    "add": "Tambah",
    "subtract": "Tolak",
    "result-date": "Tarikh"
  },
  "no": {
    "add-subtract-title": "Legg til/trekk fra arbeidsdager",
    "base-date": "Basedato",
    "business-days-offset": "Arbeidsdager",
    "include-start": "Tell startdato som dag 1",
    "no-working-days": "Ingen arbeidsdager valgt.",
    "add": "Legg til",
    "subtract": "Trekk fra",
    "result-date": "Dato"
  }
}
</i18n>
