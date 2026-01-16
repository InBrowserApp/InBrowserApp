<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <UnicodeInvisibleCharacterChecker />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import UnicodeInvisibleCharacterChecker from './components/UnicodeInvisibleCharacterChecker.vue'
</script>
