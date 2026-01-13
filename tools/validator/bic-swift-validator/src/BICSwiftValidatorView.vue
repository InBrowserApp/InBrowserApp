<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <BICSwiftInput v-model="bic" :validation-result="validationResult" />
    <BICSwiftResult v-if="bic.length > 0" :validation-result="validationResult" />
    <WhatIsBICSwiftValidator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import BICSwiftInput from './components/BICSwiftInput.vue'
import BICSwiftResult from './components/BICSwiftResult.vue'
import WhatIsBICSwiftValidator from './components/WhatIsBICSwiftValidator.vue'
import { validateBIC } from './data/bic'

const bic = useStorage('tools:bic-swift-validator:bic', 'DEUTDEFF')

const validationResult = computed(() => validateBIC(bic.value))
</script>
