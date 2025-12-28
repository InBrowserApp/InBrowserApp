<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <TimestampConverter />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import TimestampConverter from './components/TimestampConverter.vue'
</script>
