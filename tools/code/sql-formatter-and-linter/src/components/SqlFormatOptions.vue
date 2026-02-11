<template>
  <n-grid cols="1 s:2 m:3" responsive="screen" :x-gap="12" :y-gap="12">
    <n-form-item-gi :label="t('dialect')" :show-feedback="false">
      <n-select v-model:value="dialect" :options="dialectOptions" size="small" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('tab-width')" :show-feedback="false">
      <n-input-number v-model:value="tabWidth" :min="1" :max="8" size="small" style="width: 100%" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('use-tabs')" :show-feedback="false">
      <n-switch v-model:value="useTabs" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('lines-between-queries')" :show-feedback="false">
      <n-input-number
        v-model:value="linesBetweenQueries"
        :min="1"
        :max="5"
        size="small"
        style="width: 100%"
      />
    </n-form-item-gi>

    <n-form-item-gi :label="t('expression-width')" :show-feedback="false">
      <n-input-number
        v-model:value="expressionWidth"
        :min="20"
        :max="200"
        size="small"
        style="width: 100%"
      />
    </n-form-item-gi>

    <n-form-item-gi :label="t('keyword-case')" :show-feedback="false">
      <n-select v-model:value="keywordCase" :options="caseOptions" size="small" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('data-type-case')" :show-feedback="false">
      <n-select v-model:value="dataTypeCase" :options="caseOptions" size="small" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('function-case')" :show-feedback="false">
      <n-select v-model:value="functionCase" :options="caseOptions" size="small" />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NGrid, NInputNumber, NSelect, NSwitch } from 'naive-ui'
import { dialectLabels, sqlDialects } from '../sqlDialects'
import type { SqlDialect } from '../sqlDialects'
import type { SqlCaseStyle } from '../sqlLint'

const dialect = defineModel<SqlDialect>('dialect', { required: true })
const tabWidth = defineModel<number>('tabWidth', { required: true })
const useTabs = defineModel<boolean>('useTabs', { required: true })
const linesBetweenQueries = defineModel<number>('linesBetweenQueries', { required: true })
const expressionWidth = defineModel<number>('expressionWidth', { required: true })
const keywordCase = defineModel<SqlCaseStyle>('keywordCase', { required: true })
const dataTypeCase = defineModel<SqlCaseStyle>('dataTypeCase', { required: true })
const functionCase = defineModel<SqlCaseStyle>('functionCase', { required: true })

const { t } = useI18n({ useScope: 'local' })

const dialectOptions = computed(() =>
  sqlDialects.map((key) => ({
    label: dialectLabels[key],
    value: key,
  })),
)

const caseOptions = computed(() => [
  { label: t('preserve'), value: 'preserve' },
  { label: t('upper'), value: 'upper' },
  { label: t('lower'), value: 'lower' },
])
</script>

<i18n lang="json">
{
  "en": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "zh": {
    "dialect": "SQL 方言",
    "tab-width": "缩进宽度",
    "use-tabs": "使用 Tab 缩进",
    "lines-between-queries": "语句间空行",
    "expression-width": "表达式换行宽度",
    "keyword-case": "关键字大小写",
    "data-type-case": "数据类型大小写",
    "function-case": "函数名大小写",
    "preserve": "保持原样",
    "upper": "大写",
    "lower": "小写"
  },
  "zh-CN": {
    "dialect": "SQL 方言",
    "tab-width": "缩进宽度",
    "use-tabs": "使用 Tab 缩进",
    "lines-between-queries": "语句间空行",
    "expression-width": "表达式换行宽度",
    "keyword-case": "关键字大小写",
    "data-type-case": "数据类型大小写",
    "function-case": "函数名大小写",
    "preserve": "保持原样",
    "upper": "大写",
    "lower": "小写"
  },
  "zh-TW": {
    "dialect": "SQL 方言",
    "tab-width": "縮排寬度",
    "use-tabs": "使用 Tab 縮排",
    "lines-between-queries": "語句間空行",
    "expression-width": "表達式換行寬度",
    "keyword-case": "關鍵字大小寫",
    "data-type-case": "資料型別大小寫",
    "function-case": "函式名稱大小寫",
    "preserve": "保留原樣",
    "upper": "大寫",
    "lower": "小寫"
  },
  "zh-HK": {
    "dialect": "SQL 方言",
    "tab-width": "縮排寬度",
    "use-tabs": "使用 Tab 縮排",
    "lines-between-queries": "語句間空行",
    "expression-width": "表達式換行寬度",
    "keyword-case": "關鍵字大小寫",
    "data-type-case": "資料型別大小寫",
    "function-case": "函式名稱大小寫",
    "preserve": "保留原樣",
    "upper": "大寫",
    "lower": "小寫"
  },
  "es": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "fr": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "de": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "it": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "ja": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "ko": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "ru": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "pt": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "ar": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "hi": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "tr": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "nl": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "sv": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "pl": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "vi": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "th": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "id": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "he": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "ms": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  },
  "no": {
    "dialect": "Dialect",
    "tab-width": "Tab width",
    "use-tabs": "Use tabs",
    "lines-between-queries": "Lines between queries",
    "expression-width": "Expression width",
    "keyword-case": "Keyword case",
    "data-type-case": "Data type case",
    "function-case": "Function case",
    "preserve": "Preserve",
    "upper": "UPPER",
    "lower": "lower"
  }
}
</i18n>
