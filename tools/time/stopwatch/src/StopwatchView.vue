<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <StopwatchTimer />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import StopwatchTimer from './components/StopwatchTimer.vue'
</script>
