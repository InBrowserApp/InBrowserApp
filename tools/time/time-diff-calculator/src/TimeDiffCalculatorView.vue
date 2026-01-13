<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <TimeDiffCalculator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import TimeDiffCalculator from './components/TimeDiffCalculator.vue'
</script>
