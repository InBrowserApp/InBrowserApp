<template>
  <CommonPresets @select="updateFromNumeric" />

  <NumericInput
    :model-value="numericInput"
    :is-valid="isValidNumericInput"
    @update:model-value="updateFromNumeric"
  />

  <SymbolicInput
    :model-value="symbolicInput"
    :is-valid="isValidSymbolicInput"
    @update:model-value="updateFromSymbolic"
  />

  <PermissionMatrix :permissions="permissions" @update="handleMatrixUpdate" />

  <ChmodCommand :command="chmodCommand" />
</template>

<script setup lang="ts">
import CommonPresets from './CommonPresets.vue'
import NumericInput from './NumericInput.vue'
import SymbolicInput from './SymbolicInput.vue'
import PermissionMatrix from './PermissionMatrix.vue'
import ChmodCommand from './ChmodCommand.vue'
import { useChmodState } from '../composables/useChmodState'

const {
  numericInput,
  symbolicInput,
  permissions,
  isValidNumericInput,
  isValidSymbolicInput,
  chmodCommand,
  updateFromNumeric,
  updateFromSymbolic,
  updateFromMatrix: handleMatrixUpdate,
} = useChmodState()
</script>
