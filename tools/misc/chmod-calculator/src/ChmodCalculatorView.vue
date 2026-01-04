<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ChmodCalculator />
    <WhatIsChmod />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import ChmodCalculator from './components/ChmodCalculator.vue'
import WhatIsChmod from './components/WhatIsChmod.vue'
</script>
