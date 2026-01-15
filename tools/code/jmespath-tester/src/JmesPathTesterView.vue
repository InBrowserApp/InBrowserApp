<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <JmesPathTester />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import JmesPathTester from './components/JmesPathTester.vue'
</script>
