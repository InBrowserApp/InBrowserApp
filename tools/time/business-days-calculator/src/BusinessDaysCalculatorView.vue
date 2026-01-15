<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <BusinessDaysCalculator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import BusinessDaysCalculator from './components/BusinessDaysCalculator.vue'
</script>
