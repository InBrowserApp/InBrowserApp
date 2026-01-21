<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Base16Decoder />
    <WhatIsBase16 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import Base16Decoder from './components/Base16Decoder.vue'
import WhatIsBase16 from './components/WhatIsBase16.vue'
</script>
