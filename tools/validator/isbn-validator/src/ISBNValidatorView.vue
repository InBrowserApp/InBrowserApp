<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ISBNInput v-model="isbn" :validation-result="validationResult" />
    <ISBNResult v-if="isbn.length > 0" :validation-result="validationResult" />
    <WhatIsISBNValidator />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import ISBNInput from './components/ISBNInput.vue'
import ISBNResult from './components/ISBNResult.vue'
import WhatIsISBNValidator from './components/WhatIsISBNValidator.vue'
import { validateISBN } from './data/isbn'

const isbn = useStorage('tools:isbn-validator:isbn', '')

const validationResult = computed(() => validateISBN(isbn.value))
</script>
