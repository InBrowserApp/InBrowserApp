<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Base32Decoder />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import Base32Decoder from './components/Base32Decoder.vue'
</script>
