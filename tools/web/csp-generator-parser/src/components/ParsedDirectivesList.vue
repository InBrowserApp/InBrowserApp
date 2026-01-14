<template>
  <n-empty v-if="directives.length === 0" :description="emptyLabel" />
  <n-grid v-else cols="1 s:2 l:3" responsive="screen" :x-gap="12" :y-gap="12">
    <n-gi v-for="directive in directives" :key="directive.name">
      <n-card size="small" :title="directive.name">
        <div class="value-list">
          <n-tag v-for="value in directive.values" :key="value" size="small">
            {{ value }}
          </n-tag>
          <n-text v-if="directive.values.length === 0" depth="3">
            {{ noValuesLabel }}
          </n-text>
          <span v-else class="no-values-placeholder" aria-hidden="true"></span>
        </div>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NCard, NEmpty, NGi, NGrid, NTag, NText } from 'naive-ui'
import type { CspDirective } from '../utils/csp'

defineProps<{
  directives: CspDirective[]
  emptyLabel: string
  noValuesLabel: string
}>()
</script>

<style scoped>
.value-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.no-values-placeholder {
  display: none;
}
</style>
