<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <RobotsTxtGenerator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import RobotsTxtGenerator from './components/RobotsTxtGenerator.vue'
</script>
