<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CreditCardInput v-model="cardNumber" :validation-result="validationResult" />
    <CreditCardResult v-if="cardNumber.length > 0" :validation-result="validationResult" />
    <WhatIsCreditCardValidator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import CreditCardInput from './components/CreditCardInput.vue'
import CreditCardResult from './components/CreditCardResult.vue'
import WhatIsCreditCardValidator from './components/WhatIsCreditCardValidator.vue'
import { validateCardNumber } from './data/cardBrands'

const cardNumber = useStorage('tools:credit-card-validator:card-number', '')

const validationResult = computed(() => validateCardNumber(cardNumber.value))
</script>
