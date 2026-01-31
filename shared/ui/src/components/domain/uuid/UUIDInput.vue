<template>
  <n-input
    v-model:value="uuidRef"
    :placeholder="placeholder ?? uuidv4()"
    :status="validated ? undefined : 'error'"
  >
    <template v-if="showRandom ?? true" #suffix>
      <n-icon style="cursor: pointer" :component="RefreshOutline" @click="uuidRef = uuidv4()" />
    </template>
  </n-input>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { NInput, NIcon } from 'naive-ui'
import RefreshOutline from '@vicons/ionicons5/RefreshOutline'
import { v4 as uuidv4, validate } from 'uuid'

const props = defineProps<{
  showRandom?: boolean
  showError?: boolean
  placeholder?: string
  emitOnInvalid?: boolean
}>()
const uuidModel = defineModel<string | undefined>('uuid')

const uuidRef = ref(uuidModel.value)

const validated = computed(() => {
  return uuidRef.value ? validate(uuidRef.value) : false
})

watch(
  () => uuidRef.value,
  (uuid?: string) => {
    if (uuid && validate(uuid)) {
      uuidModel.value = uuid
    } else if (props.emitOnInvalid) {
      uuidModel.value = uuid
    }
  },
)

watch(uuidModel, (uuid) => {
  uuidRef.value = uuid
})
</script>
