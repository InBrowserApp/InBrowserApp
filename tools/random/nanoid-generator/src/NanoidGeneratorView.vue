<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <NanoidGenerator />
    <WhatIsNanoid />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import NanoidGenerator from './components/NanoidGenerator.vue'
import WhatIsNanoid from './components/WhatIsNanoid.vue'
</script>
