<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ResidentIdInput v-model="residentId" :validation-result="validationResult" />
    <ResidentIdResult v-if="residentId.length > 0" :validation-result="validationResult" />
    <WhatIsPRCResidentIdValidator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import ResidentIdInput from './components/ResidentIdInput.vue'
import ResidentIdResult from './components/ResidentIdResult.vue'
import WhatIsPRCResidentIdValidator from './components/WhatIsPRCResidentIdValidator.vue'
import { validateResidentId } from './data/residentId'

const residentId = useStorage('tools:prc-id-validator:resident-id', '')

const validationResult = computed(() => validateResidentId(residentId.value))
</script>
