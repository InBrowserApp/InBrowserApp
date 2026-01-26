<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ScreenRecorderController />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import ScreenRecorderController from './components/ScreenRecorderController.vue'
</script>
