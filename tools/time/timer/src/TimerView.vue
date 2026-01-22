<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CountdownTimer />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import CountdownTimer from './components/CountdownTimer.vue'
</script>
