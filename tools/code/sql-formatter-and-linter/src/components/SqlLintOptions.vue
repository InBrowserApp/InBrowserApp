<template>
  <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
    <n-form-item-gi :label="t('no-select-star')" :show-feedback="false">
      <n-switch v-model:value="checkSelectStar" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('unsafe-update-delete')" :show-feedback="false">
      <n-switch v-model:value="checkUnsafeMutation" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('require-semicolon')" :show-feedback="false">
      <n-switch v-model:value="requireSemicolon" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('max-line-length')" :show-feedback="false">
      <n-input-number
        v-model:value="maxLineLength"
        :min="20"
        :max="300"
        size="small"
        style="width: 100%"
      />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NGrid, NInputNumber, NSwitch } from 'naive-ui'

const checkSelectStar = defineModel<boolean>('checkSelectStar', { required: true })
const checkUnsafeMutation = defineModel<boolean>('checkUnsafeMutation', { required: true })
const requireSemicolon = defineModel<boolean>('requireSemicolon', { required: true })
const maxLineLength = defineModel<number>('maxLineLength', { required: true })

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "zh": {
    "no-select-star": "检查 SELECT *",
    "unsafe-update-delete": "检查无 WHERE 的 UPDATE/DELETE",
    "require-semicolon": "检查语句分号",
    "max-line-length": "最大行长度"
  },
  "zh-CN": {
    "no-select-star": "检查 SELECT *",
    "unsafe-update-delete": "检查无 WHERE 的 UPDATE/DELETE",
    "require-semicolon": "检查语句分号",
    "max-line-length": "最大行长度"
  },
  "zh-TW": {
    "no-select-star": "檢查 SELECT *",
    "unsafe-update-delete": "檢查無 WHERE 的 UPDATE/DELETE",
    "require-semicolon": "檢查語句分號",
    "max-line-length": "最大行長度"
  },
  "zh-HK": {
    "no-select-star": "檢查 SELECT *",
    "unsafe-update-delete": "檢查無 WHERE 的 UPDATE/DELETE",
    "require-semicolon": "檢查語句分號",
    "max-line-length": "最大行長度"
  },
  "es": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "fr": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "de": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "it": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "ja": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "ko": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "ru": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "pt": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "ar": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "hi": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "tr": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "nl": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "sv": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "pl": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "vi": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "th": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "id": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "he": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "ms": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "no": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  }
}
</i18n>
