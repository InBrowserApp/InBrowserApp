<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <DiceSimulator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import DiceSimulator from './components/DiceSimulator.vue'
</script>
