<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <SlugGenerator />
    <WhatIsSlug />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import SlugGenerator from './components/SlugGenerator.vue'
import WhatIsSlug from './components/WhatIsSlug.vue'
</script>
