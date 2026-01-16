<template>
  <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="16">
      <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="12">
        <n-form-item-gi :label="t('count')" :show-feedback="false">
          <n-input-number v-model:value="count" :min="1" :max="maxCount" style="width: 100%" />
        </n-form-item-gi>
        <n-form-item-gi :label="t('length')" :show-feedback="false">
          <n-input-number
            v-model:value="length"
            :min="minLength"
            :max="maxLength"
            style="width: 100%"
          />
        </n-form-item-gi>
      </n-grid>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-input
        :value="output"
        class="monospace-output"
        type="textarea"
        readonly
        :autosize="{ minRows: 4, maxRows: 12 }"
        :placeholder="t('placeholder')"
      />
      <n-flex>
        <CopyToClipboardButton :content="output" />
        <RegenerateButton @click="regenerate" />
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { NFlex, NFormItemGi, NGrid, NInput, NInputNumber } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, RegenerateButton } from '@shared/ui/base'
import {
  CUID2_DEFAULT_LENGTH,
  CUID2_MAX_COUNT,
  CUID2_MAX_LENGTH,
  CUID2_MIN_LENGTH,
  createCuid2Generator,
  normalizeCuid2Count,
  normalizeCuid2Length,
} from '../utils/cuid2'

const { t } = useI18n()

const maxCount = CUID2_MAX_COUNT
const minLength = CUID2_MIN_LENGTH
const maxLength = CUID2_MAX_LENGTH

const count = useStorage<number | null>('tools:cuid2-generator:count', 5)
const length = useStorage<number | null>('tools:cuid2-generator:length', CUID2_DEFAULT_LENGTH)

const generatedIds = ref<string[]>([])
const generator = ref(createCuid2Generator(CUID2_DEFAULT_LENGTH))
const generatorLength = ref(CUID2_DEFAULT_LENGTH)

function ensureGenerator(normalizedLength: number) {
  if (generatorLength.value !== normalizedLength) {
    generatorLength.value = normalizedLength
    generator.value = createCuid2Generator(normalizedLength)
  }
}

function regenerate() {
  const normalizedCount = normalizeCuid2Count(count.value)
  if (count.value !== normalizedCount) {
    count.value = normalizedCount
  }

  const normalizedLength = normalizeCuid2Length(length.value)
  if (length.value !== normalizedLength) {
    length.value = normalizedLength
  }

  ensureGenerator(normalizedLength)

  const results: string[] = []
  for (let i = 0; i < normalizedCount; i += 1) {
    results.push(generator.value())
  }
  generatedIds.value = results
}

const output = computed(() => generatedIds.value.join('\n'))

watch([count, length], regenerate, { immediate: true })
</script>

<style scoped>
.monospace-output :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "zh": {
    "options": "选项",
    "count": "数量",
    "length": "长度",
    "results": "结果",
    "placeholder": "生成的 CUID2 将显示在这里..."
  },
  "zh-CN": {
    "options": "选项",
    "count": "数量",
    "length": "长度",
    "results": "结果",
    "placeholder": "生成的 CUID2 将显示在这里..."
  },
  "zh-TW": {
    "options": "選項",
    "count": "數量",
    "length": "長度",
    "results": "結果",
    "placeholder": "產生的 CUID2 會顯示在這裡..."
  },
  "zh-HK": {
    "options": "選項",
    "count": "數量",
    "length": "長度",
    "results": "結果",
    "placeholder": "產生的 CUID2 會顯示在這裡..."
  },
  "es": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "fr": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "de": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "it": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "ja": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "ko": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "ru": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "pt": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "ar": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "hi": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "tr": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "nl": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "sv": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "pl": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "vi": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "th": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "id": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "he": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "ms": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  },
  "no": {
    "options": "Options",
    "count": "Count",
    "length": "Length",
    "results": "Results",
    "placeholder": "Generated CUID2 IDs will appear here..."
  }
}
</i18n>
