<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CssBoxShadowGenerator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import CssBoxShadowGenerator from './components/CssBoxShadowGenerator.vue'
</script>
