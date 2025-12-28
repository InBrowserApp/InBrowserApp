<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Base64Converter />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import Base64Converter from './components/Base64Converter.vue'
</script>
