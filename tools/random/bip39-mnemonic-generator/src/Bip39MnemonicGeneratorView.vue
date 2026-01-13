<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Bip39MnemonicGenerator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import Bip39MnemonicGenerator from './components/Bip39MnemonicGenerator.vue'
</script>
