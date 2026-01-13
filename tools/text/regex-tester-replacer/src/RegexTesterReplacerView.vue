<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <RegexTesterReplacer />
    <WhatIsRegex />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import RegexTesterReplacer from './components/RegexTesterReplacer.vue'
import WhatIsRegex from './components/WhatIsRegex.vue'
</script>
