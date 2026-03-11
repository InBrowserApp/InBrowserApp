<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <TotpGenerator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import TotpGenerator from './components/TotpGenerator.vue'
</script>
