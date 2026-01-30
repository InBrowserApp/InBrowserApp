<template>
  <PasswordStrengthWarningAlert :warnings="analysis.warnings" />
  <PasswordStrengthSuggestionAlert :suggestions="analysis.suggestions" />
</template>

<script setup lang="ts">
import type { StrengthReport } from '../utils'
import PasswordStrengthSuggestionAlert from './PasswordStrengthSuggestionAlert.vue'
import PasswordStrengthWarningAlert from './PasswordStrengthWarningAlert.vue'

defineProps<{
  analysis: StrengthReport
}>()
</script>
