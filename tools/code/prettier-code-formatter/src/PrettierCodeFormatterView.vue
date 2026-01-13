<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PrettierCodeFormatter />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import PrettierCodeFormatter from './components/PrettierCodeFormatter.vue'
</script>
