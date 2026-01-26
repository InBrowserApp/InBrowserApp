<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <AudioRecorderController />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import AudioRecorderController from './components/AudioRecorderController.vue'
</script>
