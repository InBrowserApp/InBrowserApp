<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <XmlFormatter />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import XmlFormatter from './components/XmlFormatter.vue'
</script>
