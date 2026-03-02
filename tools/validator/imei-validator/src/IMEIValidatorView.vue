<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <IMEIInput v-model="imei" :validation-result="validationResult" />
    <IMEIResult v-if="imei.length > 0" :validation-result="validationResult" />
    <WhatIsIMEIValidator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import IMEIInput from './components/IMEIInput.vue'
import IMEIResult from './components/IMEIResult.vue'
import WhatIsIMEIValidator from './components/WhatIsIMEIValidator.vue'
import { validateIMEI } from './data/imei'

const imei = useStorage('tools:imei-validator:imei', '')

const validationResult = computed(() => validateIMEI(imei.value))
</script>
