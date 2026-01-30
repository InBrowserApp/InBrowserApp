<template>
  <ToolSectionHeader>{{ t('summary-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-alert v-if="patternError" type="error" :show-icon="true">
        {{ patternError }}
      </n-alert>
      <n-flex v-else align="center" :size="12" wrap>
        <n-text v-if="showSummaryCounts">{{ t('matches-count', { count: matchesCount }) }}</n-text>
        <n-text v-if="showSummaryCounts">{{ t('groups-count', { count: groupsCount }) }}</n-text>
        <n-text v-if="!showSummaryCounts" depth="3">{{ t('summary-empty') }}</n-text>
      </n-flex>
      <n-text v-if="zeroLengthCount" depth="3" class="hint">
        {{ t('zero-length-note', { count: zeroLengthCount }) }}
      </n-text>
      <n-divider />
      <n-tabs v-model:value="activeTab" type="segment" animated>
        <n-tab-pane name="preview" :tab="t('preview-title')">
          <n-card size="small" class="preview-card">
            <n-scrollbar class="preview-scroll">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-if="previewText" class="preview-text" v-html="previewHtml" />
              <n-text v-else depth="3">{{ t('preview-empty') }}</n-text>
            </n-scrollbar>
          </n-card>
          <n-text v-if="previewTruncated" depth="3" class="hint">
            {{ t('preview-truncated', { count: previewLimit }) }}
          </n-text>
        </n-tab-pane>
        <n-tab-pane name="matches" :tab="t('matches-title')">
          <n-text v-if="!showSummaryCounts" depth="3">{{ t('summary-empty') }}</n-text>
          <template v-else>
            <n-text v-if="!matchesCount" depth="3">{{ t('matches-empty') }}</n-text>
            <n-text v-if="matchesTruncated && matchesCount" depth="3" class="hint">
              {{ t('matches-truncated', { count: matchLimit }) }}
            </n-text>
            <n-scrollbar v-if="matchesCount" class="matches-scroll">
              <div
                v-for="(match, index) in matches"
                :key="`${match.index}-${index}`"
                class="match-item"
              >
                <n-flex align="center" :size="8" wrap>
                  <n-tag size="small" type="info">#{{ index + 1 }}</n-tag>
                  <n-text depth="3">
                    {{ t('match-range', { start: match.index, end: match.end }) }}
                  </n-text>
                </n-flex>
                <n-text class="match-text" code>{{ match.match || t('match-empty') }}</n-text>
                <div v-if="match.groups.length" class="group-row">
                  <n-text depth="3">{{ t('groups-label') }}</n-text>
                  <n-flex :size="6" wrap>
                    <n-tag
                      v-for="(group, groupIndex) in match.groups"
                      :key="groupIndex"
                      size="small"
                    >
                      {{ group || t('match-empty') }}
                    </n-tag>
                  </n-flex>
                </div>
                <div v-if="Object.keys(match.namedGroups).length" class="group-row">
                  <n-text depth="3">{{ t('named-groups-label') }}</n-text>
                  <n-flex :size="6" wrap>
                    <n-tag v-for="(value, name) in match.namedGroups" :key="name" size="small">
                      {{ name }}={{ value || t('match-empty') }}
                    </n-tag>
                  </n-flex>
                </div>
              </div>
            </n-scrollbar>
          </template>
        </n-tab-pane>
        <n-tab-pane name="replace" :tab="t('replace-output-title')">
          <n-input
            :value="replaceOutput"
            type="textarea"
            :placeholder="t('replace-output-placeholder')"
            :autosize="{ minRows: 4, maxRows: 10 }"
            readonly
          />
          <n-flex align="center" :size="8" class="replace-actions">
            <CopyToClipboardButton :content="replaceOutput" />
          </n-flex>
        </n-tab-pane>
      </n-tabs>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import {
  NAlert,
  NCard,
  NDivider,
  NFlex,
  NInput,
  NScrollbar,
  NTabPane,
  NTabs,
  NTag,
  NText,
} from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { messages } from './locale/regex-tester-replacer-messages'
import type { RegexMatch } from '../utils'

const { t } = useI18n({ messages })

const {
  patternError,
  showSummaryCounts,
  matchesCount,
  groupsCount,
  zeroLengthCount,
  previewText,
  previewHtml,
  previewTruncated,
  previewLimit,
  matchesTruncated,
  matchLimit,
  matches,
  replaceOutput,
} = defineProps<{
  patternError: string
  showSummaryCounts: boolean
  matchesCount: number
  groupsCount: number
  zeroLengthCount: number
  previewText: string
  previewHtml: string
  previewTruncated: boolean
  previewLimit: number
  matchesTruncated: boolean
  matchLimit: number
  matches: RegexMatch[]
  replaceOutput: string
}>()

const activeTab = defineModel<'preview' | 'matches' | 'replace'>('activeTab', { required: true })
</script>

<style scoped>
.hint {
  display: block;
  margin-top: 8px;
}

.preview-card {
  background-color: var(--n-color);
}

.preview-scroll {
  max-height: 240px;
}

.preview-text {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--n-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
}

.preview-match {
  background-color: rgba(255, 208, 77, 0.35);
  border-radius: 2px;
  padding: 0 1px;
}

.match-item {
  padding: 12px 0;
  border-bottom: 1px dashed var(--n-border-color);
}

.match-item:last-child {
  border-bottom: none;
}

.match-text {
  display: block;
  margin-top: 6px;
}

.group-row {
  margin-top: 6px;
}

.matches-scroll {
  max-height: 360px;
}

.replace-actions {
  margin-top: 8px;
}
</style>
