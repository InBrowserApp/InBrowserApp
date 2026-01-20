<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <RobotsTxtGenerator />
    <WhatIsRobotsTxtGenerator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import RobotsTxtGenerator from './components/RobotsTxtGenerator.vue'
import WhatIsRobotsTxtGenerator from './components/WhatIsRobotsTxtGenerator.vue'
</script>
