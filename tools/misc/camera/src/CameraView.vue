<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CameraController />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import CameraController from './components/CameraController.vue'
</script>
