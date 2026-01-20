<template>
  <n-input
    v-model:value="addressRef"
    :placeholder="props.address"
    :status="validated ? undefined : 'error'"
  >
    <template #suffix>
      <n-icon
        style="cursor: pointer"
        :component="RefreshOutline"
        @click="addressRef = randomMACAddress()"
      />
    </template>
  </n-input>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { NInput, NIcon } from 'naive-ui'
import validator from 'validator'
import RefreshOutline from '@vicons/ionicons5/RefreshOutline'
import { randomMACAddress } from '@utils/mac-address'

const props = defineProps<{
  address: string
}>()

const emit = defineEmits<{
  (event: 'update:address', address: string): void
}>()

const addressRef = ref(props.address)

const validated = computed(() => {
  return validator.isMACAddress(addressRef.value)
})

watch(
  () => addressRef.value,
  (address: string) => {
    if (validated.value) {
      emit('update:address', address)
    }
  },
)
</script>
