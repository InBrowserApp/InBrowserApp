<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <VINInput v-model="vin" :validation-result="validationResult" />
    <VINResult v-if="vin.length > 0" :validation-result="validationResult" />
    <WhatIsVINValidator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import VINInput from './components/VINInput.vue'
import VINResult from './components/VINResult.vue'
import WhatIsVINValidator from './components/WhatIsVINValidator.vue'
import { validateVIN } from './data/vin'

const vin = useStorage('tools:vin-validator:vin', '1M8GDM9AXKP042788')

const validationResult = computed(() => validateVIN(vin.value))
</script>
