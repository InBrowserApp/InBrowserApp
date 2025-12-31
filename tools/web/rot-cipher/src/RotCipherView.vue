<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <RotConverter />
    <WhatIsRot />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import RotConverter from './components/RotConverter.vue'
import WhatIsRot from './components/WhatIsRot.vue'
</script>
