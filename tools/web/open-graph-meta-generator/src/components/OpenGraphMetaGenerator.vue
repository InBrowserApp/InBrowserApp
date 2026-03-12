<template>
  <n-grid cols="1 l:2" responsive="screen" :x-gap="24" :y-gap="24">
    <n-gi>
      <ToolSectionHeader>{{ t('presetsTitle') }}</ToolSectionHeader>
      <ToolSection>
        <n-flex vertical :size="12">
          <n-flex :size="8" wrap>
            <n-button
              v-for="presetOption in presetOptions"
              :key="presetOption.value"
              :type="state.preset === presetOption.value ? 'primary' : 'default'"
              secondary
              size="small"
              :data-testid="`preset-${presetOption.value}`"
              @click="applyPreset(presetOption.value)"
            >
              {{ presetOption.label }}
            </n-button>
          </n-flex>
          <n-text depth="3">{{ t('presetsHint') }}</n-text>
        </n-flex>
      </ToolSection>
      <OgMetaBasicSection v-model:basic="state.basic" />
      <OgMetaOpenGraphSection v-model:open-graph="state.openGraph" />
      <OgMetaTwitterSection v-model:twitter="state.twitter" />
      <OgMetaAdvancedSection
        v-model:article="state.article"
        v-model:show-advanced="state.showAdvanced"
      />
    </n-gi>

    <n-gi>
      <div class="sticky-column">
        <ToolSectionHeader>{{ t('diagnosticsTitle') }}</ToolSectionHeader>
        <ToolSection>
          <n-flex vertical :size="8">
            <n-alert
              v-for="diagnostic in diagnostics"
              :key="diagnostic.id"
              :type="alertTypeMap[diagnostic.level]"
              :show-icon="true"
              :title="severityLabelMap[diagnostic.level]"
              :data-testid="`diagnostic-${diagnostic.level}`"
            >
              {{ diagnostic.message }}
            </n-alert>
            <n-text v-if="diagnostics.length === 0" depth="3">{{ t('diagnosticsEmpty') }}</n-text>
          </n-flex>
        </ToolSection>

        <OgMetaPreviewSection :preview="previewModel" />
        <OgMetaOutputSection :html-content="htmlContent" />
      </div>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { NAlert, NButton, NFlex, NGi, NGrid, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import OgMetaAdvancedSection from './OgMetaAdvancedSection.vue'
import OgMetaBasicSection from './OgMetaBasicSection.vue'
import OgMetaOpenGraphSection from './OgMetaOpenGraphSection.vue'
import OgMetaPreviewSection from './OgMetaPreviewSection.vue'
import OgMetaOutputSection from './OgMetaOutputSection.vue'
import OgMetaTwitterSection from './OgMetaTwitterSection.vue'
import { buildMetaHtml, buildPreviewModel } from '../meta'
import { messages } from '../locale/messages'
import {
  createDefaultState,
  createPresetState,
  type OgPreset,
  type OgMetaGeneratorState,
} from '../state'
import { validateMeta } from '../validateMeta'

const { t } = useI18n({ useScope: 'local', messages })

const state = useStorage<OgMetaGeneratorState>(
  'tools:open-graph-meta-generator:state',
  createDefaultState(),
)

const presetOptions = computed(() => [
  { label: t('presetWebsite'), value: 'website' as const },
  { label: t('presetArticle'), value: 'article' as const },
  { label: t('presetProduct'), value: 'product' as const },
  { label: t('presetMinimal'), value: 'minimal' as const },
])

const alertTypeMap = {
  error: 'error',
  warning: 'warning',
  info: 'info',
} as const

const severityLabelMap = computed(() => ({
  error: t('severityError'),
  warning: t('severityWarning'),
  info: t('severityInfo'),
}))

const diagnostics = computed(() => validateMeta(state.value))
const previewModel = computed(() => buildPreviewModel(state.value))
const htmlContent = computed(() => buildMetaHtml(state.value))

const applyPreset = (preset: OgPreset) => {
  state.value = createPresetState(preset)
}
</script>

<style scoped>
.sticky-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (min-width: 1024px) {
  .sticky-column {
    position: sticky;
    top: 20px;
  }
}
</style>
