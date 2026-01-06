<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <TextStatisticsContent />
    <WhatIsTextStatistics />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import TextStatisticsContent from './components/TextStatisticsContent.vue'
import WhatIsTextStatistics from './components/WhatIsTextStatistics.vue'
</script>
