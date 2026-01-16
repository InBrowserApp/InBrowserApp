<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <UnicodeInvisibleCharacterChecker />
    <WhatIsUnicodeInvisibleCharacters />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import UnicodeInvisibleCharacterChecker from './components/UnicodeInvisibleCharacterChecker.vue'
import WhatIsUnicodeInvisibleCharacters from './components/WhatIsUnicodeInvisibleCharacters.vue'
</script>
