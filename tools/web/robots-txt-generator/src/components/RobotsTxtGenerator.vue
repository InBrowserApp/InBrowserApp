<template>
  <div>
    <RobotsTxtPresetsSection :on-apply-preset="applyPreset" />
    <RobotsTxtSiteSettingsSection
      v-model:sitemaps="sitemaps"
      v-model:advanced="advanced"
      v-model:host="host"
    />
    <RobotsTxtGroupsSection v-model:groups="groups" :advanced="advanced" />
    <RobotsTxtOutputSection
      :robots-content="robotsContent"
      :has-output="hasOutput"
      :download-href="downloadHref"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import RobotsTxtGroupsSection from './RobotsTxtGroupsSection.vue'
import RobotsTxtOutputSection from './RobotsTxtOutputSection.vue'
import RobotsTxtPresetsSection from './RobotsTxtPresetsSection.vue'
import RobotsTxtSiteSettingsSection from './RobotsTxtSiteSettingsSection.vue'
import { createDefaultState, createGroup, type RobotsState } from '../robotsState'

const state = useStorage<RobotsState>('tools:robots-txt-generator:state', createDefaultState())

const sitemaps = computed({
  get: () => state.value.sitemaps,
  set: (value) => {
    state.value.sitemaps = value
  },
})

const advanced = computed({
  get: () => state.value.advanced,
  set: (value) => {
    state.value.advanced = value
  },
})

const host = computed({
  get: () => state.value.host,
  set: (value) => {
    state.value.host = value
  },
})

const groups = computed({
  get: () => state.value.groups,
  set: (value) => {
    state.value.groups = value
  },
})

const applyPreset = (preset: 'allowAll' | 'disallowAll' | 'blockAdmin') => {
  switch (preset) {
    case 'allowAll':
      state.value.groups = [createGroup({ rules: [] })]
      break
    case 'disallowAll':
      state.value.groups = [createGroup({ rules: [{ type: 'disallow', path: '/' }] })]
      break
    case 'blockAdmin':
      state.value.groups = [createGroup({ rules: [{ type: 'disallow', path: '/admin/' }] })]
      break
    default:
      break
  }
}

const buildRobotsTxt = (input: RobotsState) => {
  const sections: string[] = []

  if (input.advanced) {
    const hostValue = input.host.trim()
    if (hostValue) sections.push(`Host: ${hostValue}`)
  }

  const groupSections = input.groups
    .map((group) => {
      const lines: string[] = []
      const userAgents = group.userAgents.map((agent) => agent.trim()).filter(Boolean)
      const normalizedAgents = userAgents.length > 0 ? userAgents : ['*']

      normalizedAgents.forEach((agent) => lines.push(`User-agent: ${agent}`))

      group.rules
        .map((rule) => ({ ...rule, path: rule.path.trim() }))
        .filter((rule) => rule.path.length > 0)
        .forEach((rule) => {
          const directive = rule.type === 'allow' ? 'Allow' : 'Disallow'
          lines.push(`${directive}: ${rule.path}`)
        })

      if (
        input.advanced &&
        typeof group.crawlDelay === 'number' &&
        !Number.isNaN(group.crawlDelay)
      ) {
        lines.push(`Crawl-delay: ${group.crawlDelay}`)
      }

      return lines.join('\n')
    })
    .filter((section) => section.trim().length > 0)

  if (groupSections.length > 0) {
    sections.push(groupSections.join('\n\n'))
  }

  const sitemapLines = input.sitemaps
    .map((sitemap) => sitemap.trim())
    .filter(Boolean)
    .map((sitemap) => `Sitemap: ${sitemap}`)

  if (sitemapLines.length > 0) {
    sections.push(sitemapLines.join('\n'))
  }

  return sections.join('\n\n')
}

const robotsContent = computed(() => buildRobotsTxt(state.value))
const hasOutput = computed(() => robotsContent.value.trim().length > 0)
const downloadBlob = computed(() => {
  if (!hasOutput.value) return null
  return new Blob([robotsContent.value], { type: 'text/plain' })
})
const downloadUrl = useObjectUrl(downloadBlob)
const downloadHref = computed(() =>
  hasOutput.value ? (downloadUrl.value ?? undefined) : undefined,
)
</script>

<i18n lang="json">
{
  "en": {},
  "zh": {},
  "zh-CN": {},
  "zh-TW": {},
  "zh-HK": {},
  "es": {},
  "fr": {},
  "de": {},
  "it": {},
  "ja": {},
  "ko": {},
  "ru": {},
  "pt": {},
  "ar": {},
  "hi": {},
  "tr": {},
  "nl": {},
  "sv": {},
  "pl": {},
  "vi": {},
  "th": {},
  "id": {},
  "he": {},
  "ms": {},
  "no": {}
}
</i18n>
