<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <OpenGraphMetaGenerator />
    <WhatIsOpenGraphMetaGenerator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import OpenGraphMetaGenerator from './components/OpenGraphMetaGenerator.vue'
import WhatIsOpenGraphMetaGenerator from './components/WhatIsOpenGraphMetaGenerator.vue'
</script>
