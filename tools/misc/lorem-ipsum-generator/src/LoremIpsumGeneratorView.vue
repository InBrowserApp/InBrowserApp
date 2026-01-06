<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <LoremIpsumGenerator />
    <WhatIsLoremIpsum />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import LoremIpsumGenerator from './components/LoremIpsumGenerator.vue'
import WhatIsLoremIpsum from './components/WhatIsLoremIpsum.vue'
</script>
