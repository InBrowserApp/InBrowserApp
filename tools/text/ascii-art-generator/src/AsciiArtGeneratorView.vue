<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <AsciiArtGenerator />
    <WhatIsAsciiArt />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import AsciiArtGenerator from './components/AsciiArtGenerator.vue'
import WhatIsAsciiArt from './components/WhatIsAsciiArt.vue'
</script>
