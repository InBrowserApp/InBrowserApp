<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Base16Decoder />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import Base16Decoder from './components/Base16Decoder.vue'
</script>
