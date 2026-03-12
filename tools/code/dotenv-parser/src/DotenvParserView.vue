<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <DotenvParserTool />
    <WhatIsDotenv />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import DotenvParserTool from './components/DotenvParserTool.vue'
import WhatIsDotenv from './components/WhatIsDotenv.vue'
</script>
