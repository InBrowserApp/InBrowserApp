<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <VATInput v-model="vat" :validation-result="validationResult" />
    <VATResult v-if="vat.length > 0" :validation-result="validationResult" />
    <WhatIsVATValidator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import VATInput from './components/VATInput.vue'
import VATResult from './components/VATResult.vue'
import WhatIsVATValidator from './components/WhatIsVATValidator.vue'
import { validateVAT } from './data/vat'

const vat = useStorage('tools:vat-validator:vat', 'BE 0123 4567 49')

const validationResult = computed(() => validateVAT(vat.value))
</script>
