<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <TimeZoneConverter />
    <WhatIsTimeZone />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import TimeZoneConverter from './components/TimeZoneConverter.vue'
import WhatIsTimeZone from './components/WhatIsTimeZone.vue'
</script>
