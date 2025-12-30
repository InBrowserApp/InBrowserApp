<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <UnicodeConverter />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import UnicodeConverter from './components/UnicodeConverter.vue'
</script>
