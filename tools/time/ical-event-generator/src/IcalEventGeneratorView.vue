<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <IcalEventGenerator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import IcalEventGenerator from './components/IcalEventGenerator.vue'
</script>
