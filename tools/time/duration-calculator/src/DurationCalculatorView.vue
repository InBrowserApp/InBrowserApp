<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <DurationCalculator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import DurationCalculator from './components/DurationCalculator.vue'
</script>
