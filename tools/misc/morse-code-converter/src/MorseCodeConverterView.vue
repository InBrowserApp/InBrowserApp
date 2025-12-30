<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <MorseConverter />
    <WhatIsMorseCode />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import MorseConverter from './components/MorseConverter.vue'
import WhatIsMorseCode from './components/WhatIsMorseCode.vue'
</script>
