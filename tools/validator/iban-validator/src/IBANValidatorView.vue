<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <IBANInput v-model="iban" :validation-result="validationResult" />
    <IBANResult v-if="iban.length > 0" :validation-result="validationResult" />
    <WhatIsIBANValidator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import IBANInput from './components/IBANInput.vue'
import IBANResult from './components/IBANResult.vue'
import WhatIsIBANValidator from './components/WhatIsIBANValidator.vue'
import { validateIBAN } from './data/iban'

const iban = useStorage('tools:iban-validator:iban', 'GB29 NWBK 6016 1331 9268 19')

const validationResult = computed(() => validateIBAN(iban.value))
</script>
