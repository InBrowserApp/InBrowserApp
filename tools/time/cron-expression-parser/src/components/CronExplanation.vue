<template>
  <ToolSectionHeader>{{ t('description') }}</ToolSectionHeader>
  <ToolSection>
    <n-text v-if="humanDescription" style="font-size: 1.1em">
      {{ humanDescription }}
    </n-text>
    <n-text v-else depth="3">{{ t('noDescription') }}</n-text>
  </ToolSection>

  <ToolSectionHeader>{{ t('fieldBreakdown') }}</ToolSectionHeader>
  <ToolSection>
    <n-data-table
      v-if="fields.length > 0"
      :columns="columns"
      :data="fields"
      :bordered="false"
      size="small"
    />
    <n-text v-else depth="3">{{ t('noFields') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDataTable, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { CronField } from '../utils/cron'

defineProps<{
  humanDescription: string
  fields: CronField[]
}>()

const { t } = useI18n()

const columns = computed(() => [
  {
    title: t('field'),
    key: 'name',
    width: 120,
  },
  {
    title: t('value'),
    key: 'value',
    width: 100,
  },
  {
    title: t('meaning'),
    key: 'description',
  },
])
</script>

<i18n lang="json">
{
  "en": {
    "description": "Description",
    "noDescription": "Enter a valid cron expression to see description",
    "fieldBreakdown": "Field Breakdown",
    "noFields": "Enter a valid cron expression to see field breakdown",
    "field": "Field",
    "value": "Value",
    "meaning": "Meaning"
  },
  "zh": {
    "description": "描述",
    "noDescription": "输入有效的 Cron 表达式以查看描述",
    "fieldBreakdown": "字段解析",
    "noFields": "输入有效的 Cron 表达式以查看字段解析",
    "field": "字段",
    "value": "值",
    "meaning": "含义"
  },
  "zh-CN": {
    "description": "描述",
    "noDescription": "输入有效的 Cron 表达式以查看描述",
    "fieldBreakdown": "字段解析",
    "noFields": "输入有效的 Cron 表达式以查看字段解析",
    "field": "字段",
    "value": "值",
    "meaning": "含义"
  },
  "zh-TW": {
    "description": "描述",
    "noDescription": "輸入有效的 Cron 表達式以查看描述",
    "fieldBreakdown": "欄位解析",
    "noFields": "輸入有效的 Cron 表達式以查看欄位解析",
    "field": "欄位",
    "value": "值",
    "meaning": "含義"
  },
  "zh-HK": {
    "description": "描述",
    "noDescription": "輸入有效的 Cron 表達式以查看描述",
    "fieldBreakdown": "欄位解析",
    "noFields": "輸入有效的 Cron 表達式以查看欄位解析",
    "field": "欄位",
    "value": "值",
    "meaning": "含義"
  },
  "es": {
    "description": "Descripción",
    "noDescription": "Ingrese una expresión cron válida para ver la descripción",
    "fieldBreakdown": "Desglose de Campos",
    "noFields": "Ingrese una expresión cron válida para ver el desglose de campos",
    "field": "Campo",
    "value": "Valor",
    "meaning": "Significado"
  },
  "fr": {
    "description": "Description",
    "noDescription": "Entrez une expression cron valide pour voir la description",
    "fieldBreakdown": "Détail des Champs",
    "noFields": "Entrez une expression cron valide pour voir le détail des champs",
    "field": "Champ",
    "value": "Valeur",
    "meaning": "Signification"
  },
  "de": {
    "description": "Beschreibung",
    "noDescription": "Geben Sie einen gültigen Cron-Ausdruck ein, um die Beschreibung zu sehen",
    "fieldBreakdown": "Feldaufschlüsselung",
    "noFields": "Geben Sie einen gültigen Cron-Ausdruck ein, um die Feldaufschlüsselung zu sehen",
    "field": "Feld",
    "value": "Wert",
    "meaning": "Bedeutung"
  },
  "it": {
    "description": "Descrizione",
    "noDescription": "Inserisci un'espressione cron valida per vedere la descrizione",
    "fieldBreakdown": "Scomposizione Campi",
    "noFields": "Inserisci un'espressione cron valida per vedere la scomposizione dei campi",
    "field": "Campo",
    "value": "Valore",
    "meaning": "Significato"
  },
  "ja": {
    "description": "説明",
    "noDescription": "説明を表示するには有効な Cron 式を入力してください",
    "fieldBreakdown": "フィールドの内訳",
    "noFields": "フィールドの内訳を表示するには有効な Cron 式を入力してください",
    "field": "フィールド",
    "value": "値",
    "meaning": "意味"
  },
  "ko": {
    "description": "설명",
    "noDescription": "설명을 보려면 유효한 Cron 표현식을 입력하세요",
    "fieldBreakdown": "필드 분석",
    "noFields": "필드 분석을 보려면 유효한 Cron 표현식을 입력하세요",
    "field": "필드",
    "value": "값",
    "meaning": "의미"
  },
  "ru": {
    "description": "Описание",
    "noDescription": "Введите действительное cron-выражение для отображения описания",
    "fieldBreakdown": "Разбор Полей",
    "noFields": "Введите действительное cron-выражение для отображения разбора полей",
    "field": "Поле",
    "value": "Значение",
    "meaning": "Значение"
  },
  "pt": {
    "description": "Descrição",
    "noDescription": "Digite uma expressão cron válida para ver a descrição",
    "fieldBreakdown": "Detalhamento dos Campos",
    "noFields": "Digite uma expressão cron válida para ver o detalhamento dos campos",
    "field": "Campo",
    "value": "Valor",
    "meaning": "Significado"
  },
  "ar": {
    "description": "الوصف",
    "noDescription": "أدخل تعبير cron صالح لعرض الوصف",
    "fieldBreakdown": "تفصيل الحقول",
    "noFields": "أدخل تعبير cron صالح لعرض تفصيل الحقول",
    "field": "الحقل",
    "value": "القيمة",
    "meaning": "المعنى"
  },
  "hi": {
    "description": "विवरण",
    "noDescription": "विवरण देखने के लिए एक वैध Cron एक्सप्रेशन दर्ज करें",
    "fieldBreakdown": "फ़ील्ड विश्लेषण",
    "noFields": "फ़ील्ड विश्लेषण देखने के लिए एक वैध Cron एक्सप्रेशन दर्ज करें",
    "field": "फ़ील्ड",
    "value": "मान",
    "meaning": "अर्थ"
  },
  "tr": {
    "description": "Açıklama",
    "noDescription": "Açıklamayı görmek için geçerli bir cron ifadesi girin",
    "fieldBreakdown": "Alan Ayrıntıları",
    "noFields": "Alan ayrıntılarını görmek için geçerli bir cron ifadesi girin",
    "field": "Alan",
    "value": "Değer",
    "meaning": "Anlam"
  },
  "nl": {
    "description": "Beschrijving",
    "noDescription": "Voer een geldige cron-expressie in om de beschrijving te zien",
    "fieldBreakdown": "Veld Uitsplitsing",
    "noFields": "Voer een geldige cron-expressie in om de veld uitsplitsing te zien",
    "field": "Veld",
    "value": "Waarde",
    "meaning": "Betekenis"
  },
  "sv": {
    "description": "Beskrivning",
    "noDescription": "Ange ett giltigt cron-uttryck för att se beskrivningen",
    "fieldBreakdown": "Fältuppdelning",
    "noFields": "Ange ett giltigt cron-uttryck för att se fältuppdelning",
    "field": "Fält",
    "value": "Värde",
    "meaning": "Betydelse"
  },
  "pl": {
    "description": "Opis",
    "noDescription": "Wprowadź prawidłowe wyrażenie cron, aby zobaczyć opis",
    "fieldBreakdown": "Podział Pól",
    "noFields": "Wprowadź prawidłowe wyrażenie cron, aby zobaczyć podział pól",
    "field": "Pole",
    "value": "Wartość",
    "meaning": "Znaczenie"
  },
  "vi": {
    "description": "Mô tả",
    "noDescription": "Nhập biểu thức cron hợp lệ để xem mô tả",
    "fieldBreakdown": "Phân Tích Trường",
    "noFields": "Nhập biểu thức cron hợp lệ để xem phân tích trường",
    "field": "Trường",
    "value": "Giá trị",
    "meaning": "Ý nghĩa"
  },
  "th": {
    "description": "คำอธิบาย",
    "noDescription": "ป้อน cron expression ที่ถูกต้องเพื่อดูคำอธิบาย",
    "fieldBreakdown": "รายละเอียดฟิลด์",
    "noFields": "ป้อน cron expression ที่ถูกต้องเพื่อดูรายละเอียดฟิลด์",
    "field": "ฟิลด์",
    "value": "ค่า",
    "meaning": "ความหมาย"
  },
  "id": {
    "description": "Deskripsi",
    "noDescription": "Masukkan ekspresi cron yang valid untuk melihat deskripsi",
    "fieldBreakdown": "Rincian Field",
    "noFields": "Masukkan ekspresi cron yang valid untuk melihat rincian field",
    "field": "Field",
    "value": "Nilai",
    "meaning": "Arti"
  },
  "he": {
    "description": "תיאור",
    "noDescription": "הזן ביטוי cron תקין כדי לראות תיאור",
    "fieldBreakdown": "פירוט שדות",
    "noFields": "הזן ביטוי cron תקין כדי לראות פירוט שדות",
    "field": "שדה",
    "value": "ערך",
    "meaning": "משמעות"
  },
  "ms": {
    "description": "Penerangan",
    "noDescription": "Masukkan ungkapan cron yang sah untuk melihat penerangan",
    "fieldBreakdown": "Pecahan Medan",
    "noFields": "Masukkan ungkapan cron yang sah untuk melihat pecahan medan",
    "field": "Medan",
    "value": "Nilai",
    "meaning": "Maksud"
  },
  "no": {
    "description": "Beskrivelse",
    "noDescription": "Skriv inn et gyldig cron-uttrykk for å se beskrivelsen",
    "fieldBreakdown": "Feltoppdelning",
    "noFields": "Skriv inn et gyldig cron-uttrykk for å se feltoppdelning",
    "field": "Felt",
    "value": "Verdi",
    "meaning": "Betydning"
  }
}
</i18n>
