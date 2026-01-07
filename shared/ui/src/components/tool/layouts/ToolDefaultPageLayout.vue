<template>
  <div>
    <n-flex align="center" justify="space-between" :wrap="false">
      <slot name="title" :t="t">
        <ToolTitle style="margin: 0">{{ t('name') }}</ToolTitle>
      </slot>

      <ToolReportIssueButton />
    </n-flex>

    <AirplaneModeEnabledAlert v-if="!info.features.includes('offline')" />

    <slot name="description">
      <ToolDescription>{{ t('description') }}</ToolDescription>
    </slot>

    <slot />

    <slot name="related-tools">
      <RelatedTools :tool="info" v-if="!hideRelatedTools" />
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import RelatedTools from '../grid/RelatedTools.vue'
import ToolTitle from './ToolTitle.vue'
import ToolDescription from './ToolDescription.vue'
import type { ToolInfo } from '@shared/tools'
import { useHead } from '@unhead/vue'
import AirplaneModeEnabledAlert from '../airplane/AirplaneModeEnabledAlert.vue'
import { NFlex } from 'naive-ui'
import ToolReportIssueButton from './ToolReportIssueButton.vue'

const props = defineProps<{
  info: Pick<ToolInfo, 'meta' | 'toolID' | 'tags' | 'features'>
  hideRelatedTools?: boolean
}>()

const { t } = useI18n({
  messages: props.info.meta,
})

useHead({
  title: t('name') + ' - InBrowser.App',
  meta: [
    {
      name: 'description',
      content: t('description'),
    },
  ],
})
</script>
