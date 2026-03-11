<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <RobotsTxtTester />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import RobotsTxtTester from './components/RobotsTxtTester.vue'
</script>
