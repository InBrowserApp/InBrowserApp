<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Bip39MnemonicGenerator />
    <WhatIsBip39 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import Bip39MnemonicGenerator from './components/Bip39MnemonicGenerator.vue'
import WhatIsBip39 from './components/WhatIsBip39.vue'
</script>
