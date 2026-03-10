<template>
  <n-grid cols="1 s:2 l:3" responsive="screen" :x-gap="12" :y-gap="12">
    <n-gi>
      <n-card size="small">
        <n-flex vertical :size="6">
          <n-statistic :label="leftItemsLabel" :value="leftTotal" />
          <n-text depth="3">{{ leftUniqueLabel }}: {{ leftUnique }}</n-text>
        </n-flex>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card size="small">
        <n-flex vertical :size="6">
          <n-statistic :label="rightItemsLabel" :value="rightTotal" />
          <n-text depth="3">{{ rightUniqueLabel }}: {{ rightUnique }}</n-text>
        </n-flex>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card size="small">
        <n-statistic :label="commonLabel" :value="commonCount" />
      </n-card>
    </n-gi>
    <n-gi>
      <n-card size="small">
        <n-statistic :label="leftOnlyLabel" :value="leftOnlyCount" />
      </n-card>
    </n-gi>
    <n-gi>
      <n-card size="small">
        <n-statistic :label="rightOnlyLabel" :value="rightOnlyCount" />
      </n-card>
    </n-gi>
    <n-gi>
      <n-card size="small">
        <n-flex vertical :size="6">
          <n-text>{{ leftDuplicatesLabel }}: {{ leftDuplicateCount }}</n-text>
          <n-text>{{ rightDuplicatesLabel }}: {{ rightDuplicateCount }}</n-text>
        </n-flex>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NCard, NFlex, NGi, NGrid, NStatistic, NText } from 'naive-ui'

defineProps<{
  leftItemsLabel: string
  leftUniqueLabel: string
  rightItemsLabel: string
  rightUniqueLabel: string
  commonLabel: string
  leftOnlyLabel: string
  rightOnlyLabel: string
  leftDuplicatesLabel: string
  rightDuplicatesLabel: string
  leftTotal: number
  leftUnique: number
  rightTotal: number
  rightUnique: number
  commonCount: number
  leftOnlyCount: number
  rightOnlyCount: number
  leftDuplicateCount: number
  rightDuplicateCount: number
}>()
</script>
