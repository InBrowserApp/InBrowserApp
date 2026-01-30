<template>
  <component :is="activeComponent" :code="code" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HttpStatusCodeDescription1xx from './HttpStatusCodeDescription1xx.vue'
import HttpStatusCodeDescription2xx from './HttpStatusCodeDescription2xx.vue'
import HttpStatusCodeDescription3xx from './HttpStatusCodeDescription3xx.vue'
import HttpStatusCodeDescription4xxA from './HttpStatusCodeDescription4xxA.vue'
import HttpStatusCodeDescription4xxB from './HttpStatusCodeDescription4xxB.vue'
import HttpStatusCodeDescription4xxC from './HttpStatusCodeDescription4xxC.vue'
import HttpStatusCodeDescription5xx from './HttpStatusCodeDescription5xx.vue'

const props = defineProps<{
  code: number
}>()

const activeComponent = computed(() => {
  if (props.code >= 100 && props.code < 200) return HttpStatusCodeDescription1xx
  if (props.code >= 200 && props.code < 300) return HttpStatusCodeDescription2xx
  if (props.code >= 300 && props.code < 400) return HttpStatusCodeDescription3xx
  if (props.code >= 400 && props.code < 410) return HttpStatusCodeDescription4xxA
  if (props.code >= 410 && props.code < 418) return HttpStatusCodeDescription4xxB
  if (props.code >= 418 && props.code < 500) return HttpStatusCodeDescription4xxC
  return HttpStatusCodeDescription5xx
})
</script>
