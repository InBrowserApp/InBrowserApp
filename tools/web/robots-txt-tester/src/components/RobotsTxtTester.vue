<template>
  <n-flex vertical :size="16">
    <RobotsTxtInputs
      v-model="robotsText"
      :example-value="defaultRobotsText"
      :group-count="parsed.groups.length"
      :sitemap-count="sitemapCount"
      :warning-count="parsed.warnings.length"
      :other-directive-count="otherDirectiveCount"
    />

    <RobotsTxtScenarioSection v-model:user-agent="userAgent" v-model:target="target" />

    <RobotsTxtResultSection
      :pending="isPending"
      :target-error="targetError"
      :result="matchResult"
      :warnings="parsed.warnings"
      :metadata="parsed.metadata"
    />

    <WhatIsRobotsTxtTester />
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import RobotsTxtInputs from './RobotsTxtInputs.vue'
import RobotsTxtScenarioSection from './RobotsTxtScenarioSection.vue'
import RobotsTxtResultSection from './RobotsTxtResultSection.vue'
import WhatIsRobotsTxtTester from './WhatIsRobotsTxtTester.vue'
import { parseRobotsTxt } from '../utils/parseRobotsTxt'
import { matchRobotsTxt, normalizeRobotsTarget } from '../utils/matchRobotsTxt'

const defaultRobotsText = `User-agent: *
Disallow: /private/
Allow: /private/public/

Sitemap: https://example.com/sitemap.xml`

const robotsText = useStorage('tools:robots-txt-tester:robots', defaultRobotsText)
const userAgent = useStorage('tools:robots-txt-tester:user-agent', 'Googlebot')
const target = useStorage(
  'tools:robots-txt-tester:target',
  'https://example.com/private/public/report.html',
)

const parsed = computed(() => parseRobotsTxt(robotsText.value))

const targetState = computed(() => normalizeRobotsTarget(target.value))

const isPending = computed(
  () => !robotsText.value.trim() || !userAgent.value.trim() || !target.value.trim(),
)

const targetError = computed(() => {
  if (isPending.value || targetState.value.ok) return ''
  return targetState.value.message
})

const matchResult = computed(() => {
  if (isPending.value || !targetState.value.ok) {
    return null
  }

  return matchRobotsTxt(parsed.value, userAgent.value, targetState.value.normalizedPath)
})

const sitemapCount = computed(
  () => parsed.value.metadata.filter((entry) => entry.directive === 'sitemap').length,
)

const otherDirectiveCount = computed(
  () => parsed.value.metadata.filter((entry) => entry.directive !== 'sitemap').length,
)
</script>
