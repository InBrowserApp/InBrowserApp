<template>
  <GeneralInfoHeader />
  <n-grid x-gap="30" :cols="4">
    <n-gi>
      <GeneralInfoBasics :options="options" />
    </n-gi>
    <n-gi>
      <GeneralInfoThemeColors :options="options" />
    </n-gi>
    <n-gi>
      <GeneralInfoPaths :options="options" />
    </n-gi>
    <n-gi>
      <GeneralInfoDisplay :options="options" />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGi } from 'naive-ui'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import GeneralInfoHeader from './GeneralInfoHeader.vue'
import GeneralInfoBasics from './GeneralInfoBasics.vue'
import GeneralInfoThemeColors from './GeneralInfoThemeColors.vue'
import GeneralInfoPaths from './GeneralInfoPaths.vue'
import GeneralInfoDisplay from './GeneralInfoDisplay.vue'

const options = defineModel<GeneralInfoOptions>('options', { required: true })
</script>
