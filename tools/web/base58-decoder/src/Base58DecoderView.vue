<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Base58Decoder />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import Base58Decoder from './components/Base58Decoder.vue'
</script>
