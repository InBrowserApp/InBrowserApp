<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Base16Encoder />
    <WhatIsBase16 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import Base16Encoder from './components/Base16Encoder.vue'
import WhatIsBase16 from './components/WhatIsBase16.vue'
</script>
