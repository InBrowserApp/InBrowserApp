<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <JsonPathTester />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import JsonPathTester from './components/JsonPathTester.vue'
</script>
