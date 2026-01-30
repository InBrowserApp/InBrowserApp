<template>
  <GeneralInfoHeader />
  <n-grid x-gap="30" :cols="4">
    <GeneralInfoBasics :options="options" />
    <GeneralInfoThemeColors :options="options" />
    <GeneralInfoPaths :options="options" />
    <GeneralInfoDisplay :options="options" />
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid } from 'naive-ui'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import { useVModel } from '@vueuse/core'
import GeneralInfoHeader from './GeneralInfoHeader.vue'
import GeneralInfoBasics from './GeneralInfoBasics.vue'
import GeneralInfoThemeColors from './GeneralInfoThemeColors.vue'
import GeneralInfoPaths from './GeneralInfoPaths.vue'
import GeneralInfoDisplay from './GeneralInfoDisplay.vue'

const props = defineProps<{ options: GeneralInfoOptions }>()

const emit = defineEmits<{
  'update:options': [GeneralInfoOptions]
}>()

const options = useVModel(props, 'options', emit)
</script>
