<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CookieParser />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import CookieParser from './components/CookieParser.vue'
</script>
