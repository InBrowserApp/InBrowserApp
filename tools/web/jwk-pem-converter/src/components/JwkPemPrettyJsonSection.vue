<template>
  <ToolSection>
    <n-flex align="center" justify="space-between" class="wide-form-item">
      <n-text>{{ t('prettyJson') }}</n-text>
      <n-switch v-model:value="prettyJsonModel" />
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NSwitch, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'

const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const prettyJsonModel = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})
</script>

<style scoped>
.wide-form-item {
  width: 100%;
}
</style>

<i18n lang="json">
{
  "en": {
    "prettyJson": "Pretty JSON"
  },
  "zh": {
    "prettyJson": "美化 JSON"
  },
  "zh-CN": {
    "prettyJson": "美化 JSON"
  },
  "zh-TW": {
    "prettyJson": "美化 JSON"
  },
  "zh-HK": {
    "prettyJson": "美化 JSON"
  },
  "es": {
    "prettyJson": "JSON formateado"
  },
  "fr": {
    "prettyJson": "JSON formaté"
  },
  "de": {
    "prettyJson": "JSON formatiert"
  },
  "it": {
    "prettyJson": "JSON formattato"
  },
  "ja": {
    "prettyJson": "整形 JSON"
  },
  "ko": {
    "prettyJson": "예쁜 JSON"
  },
  "ru": {
    "prettyJson": "Форматированный JSON"
  },
  "pt": {
    "prettyJson": "JSON formatado"
  },
  "ar": {
    "prettyJson": "JSON منسق"
  },
  "hi": {
    "prettyJson": "सजाया हुआ JSON"
  },
  "tr": {
    "prettyJson": "Biçimli JSON"
  },
  "nl": {
    "prettyJson": "Opmaak JSON"
  },
  "sv": {
    "prettyJson": "Formaterad JSON"
  },
  "pl": {
    "prettyJson": "Sformatowany JSON"
  },
  "vi": {
    "prettyJson": "JSON đẹp"
  },
  "th": {
    "prettyJson": "JSON จัดรูปแบบ"
  },
  "id": {
    "prettyJson": "JSON rapi"
  },
  "he": {
    "prettyJson": "JSON מעוצב"
  },
  "ms": {
    "prettyJson": "JSON cantik"
  },
  "no": {
    "prettyJson": "Formatert JSON"
  }
}
</i18n>
