<template>
  <ToolSectionHeader>{{ t('resultsTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-tabs v-model:value="activeTab" type="line" animated>
      <n-tab-pane name="variables" :tab="t('variablesTab')">
        <n-text v-if="entries.length === 0" depth="3">{{ t('resultsEmpty') }}</n-text>
        <template v-else>
          <n-alert v-if="maskValues" type="info" :bordered="false" style="margin-bottom: 12px">
            {{ t('maskedHint') }}
          </n-alert>
          <div class="table-scroll">
            <n-table striped size="small">
              <thead>
                <tr>
                  <th>{{ t('line') }}</th>
                  <th>{{ t('key') }}</th>
                  <th>{{ t('value') }}</th>
                  <th>{{ t('status') }}</th>
                  <th>{{ t('quote') }}</th>
                  <th>{{ t('exportLabel') }}</th>
                  <th>{{ t('comment') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry in entries" :key="`${entry.line}-${entry.key}`">
                  <td>{{ entry.line }}</td>
                  <td>{{ entry.key }}</td>
                  <td class="monospace-cell">{{ formatValue(entry.value) }}</td>
                  <td>
                    <n-tag :type="entry.active ? 'success' : 'warning'" size="small">
                      {{ entry.active ? t('activeStatus') : t('ignoredStatus') }}
                    </n-tag>
                  </td>
                  <td>{{ quoteLabel(entry.quote) }}</td>
                  <td>{{ entry.export ? t('yes') : t('no') }}</td>
                  <td>{{ entry.inlineComment ?? '—' }}</td>
                </tr>
              </tbody>
            </n-table>
          </div>
        </template>
      </n-tab-pane>

      <n-tab-pane name="json" :tab="t('jsonTab')">
        <n-space vertical :size="12">
          <n-alert v-if="maskValues" type="info" :bordered="false">
            {{ t('maskedHint') }}
          </n-alert>
          <n-alert v-if="duplicateCount > 0" type="warning" :bordered="false">
            {{ t('jsonDuplicateNote', { strategy: strategyLabel }) }}
          </n-alert>
          <n-flex align="center" :size="8">
            <CopyToClipboardButton :content="jsonOutput" />
            <n-button
              tag="a"
              text
              :href="downloadJsonUrl ?? undefined"
              :download="downloadJsonName"
              :disabled="!jsonOutput"
            >
              {{ t('downloadJson') }}
            </n-button>
          </n-flex>
          <n-input
            type="textarea"
            :value="jsonOutput"
            :placeholder="t('resultsEmpty')"
            readonly
            :autosize="{ minRows: 8, maxRows: 20 }"
            class="monospace-output"
          />
        </n-space>
      </n-tab-pane>

      <n-tab-pane name="normalized" :tab="t('normalizedTab')">
        <n-space vertical :size="12">
          <n-alert v-if="maskValues" type="info" :bordered="false">
            {{ t('maskedHint') }}
          </n-alert>
          <n-alert type="info" :bordered="false">{{ t('normalizedHint') }}</n-alert>
          <n-flex align="center" :size="8">
            <CopyToClipboardButton :content="normalizedOutput" />
            <n-button
              tag="a"
              text
              :href="downloadEnvUrl ?? undefined"
              :download="downloadEnvName"
              :disabled="!normalizedOutput"
            >
              {{ t('downloadEnv') }}
            </n-button>
          </n-flex>
          <n-input
            type="textarea"
            :value="normalizedOutput"
            :placeholder="t('resultsEmpty')"
            readonly
            :autosize="{ minRows: 8, maxRows: 20 }"
            class="monospace-output"
          />
        </n-space>
      </n-tab-pane>
    </n-tabs>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NAlert,
  NButton,
  NFlex,
  NInput,
  NSpace,
  NTabPane,
  NTable,
  NTabs,
  NTag,
  NText,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { DotenvDuplicateStrategy, DotenvEntry } from '@utils/dotenv'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { messages } from './locale/dotenv-parser-messages'
import { formatDisplayValue, getQuoteLabel, getStrategyLabel } from './dotenv-display'

const props = defineProps<{
  entries: DotenvEntry[]
  duplicateCount: number
  duplicateStrategy: DotenvDuplicateStrategy
  maskValues: boolean
  jsonOutput: string
  normalizedOutput: string
  downloadJsonUrl: string | null | undefined
  downloadJsonName: string
  downloadEnvUrl: string | null | undefined
  downloadEnvName: string
}>()

const activeTab = defineModel<'variables' | 'json' | 'normalized'>('activeTab', {
  required: true,
})

const { t } = useI18n({ messages })

const strategyLabel = computed(() => getStrategyLabel(t, props.duplicateStrategy))

function formatValue(value: string): string {
  return formatDisplayValue(value, props.maskValues)
}

function quoteLabel(quote: DotenvEntry['quote']): string {
  return getQuoteLabel(t, quote)
}
</script>

<style scoped>
.table-scroll {
  overflow-x: auto;
}

.monospace-cell,
.monospace-output :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>
