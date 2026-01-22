<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <RadioTimecodeController />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import RadioTimecodeController from './components/RadioTimecodeController.vue'
</script>
