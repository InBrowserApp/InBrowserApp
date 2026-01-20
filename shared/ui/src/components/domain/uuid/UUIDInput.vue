<template>
  <n-input
    v-model:value="uuidRef"
    :placeholder="placeholder ?? uuidv4()"
    :status="validated ? undefined : 'error'"
  >
    <template #suffix v-if="showRandom ?? true">
      <n-icon style="cursor: pointer" :component="RefreshOutline" @click="uuidRef = uuidv4()" />
    </template>
  </n-input>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRef } from 'vue'

import { NInput, NIcon } from 'naive-ui'
import RefreshOutline from '@vicons/ionicons5/RefreshOutline'
import { v4 as uuidv4, validate } from 'uuid'

type UUID = `${string}-${string}-${string}-${string}-${string}`

const props = defineProps<{
  uuid?: string
  showRandom?: boolean
  showError?: boolean
  placeholder?: string
  emitOnInvalid?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:uuid', uuid: UUID): void
}>()

const uuidRef = ref(props.uuid)
const uuidOuterRef = toRef(props, 'uuid')

const validated = computed(() => {
  return uuidRef.value ? validate(uuidRef.value) : false
})

watch(
  () => uuidRef.value,
  (uuid?: string) => {
    if (uuid && validate(uuid)) {
      emit('update:uuid', uuid as UUID)
    } else if (props.emitOnInvalid) {
      emit('update:uuid', uuid as UUID)
    }
  },
)

watch(uuidOuterRef, (uuid) => {
  uuidRef.value = uuid
})
</script>
