<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <EmailInput v-model="email" :validation-result="validationResult" />
    <EmailResult v-if="email.length > 0" :validation-result="validationResult" />
    <WhatIsEmailValidator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import EmailInput from './components/EmailInput.vue'
import EmailResult from './components/EmailResult.vue'
import WhatIsEmailValidator from './components/WhatIsEmailValidator.vue'
import { validateEmail } from './data/email'

const email = useStorage('tools:email-validator:email', 'hello@example.com')

const validationResult = computed(() => validateEmail(email.value))
</script>
