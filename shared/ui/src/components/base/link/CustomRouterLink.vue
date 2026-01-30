<template>
  <router-link
    v-slot="{ navigate, href }"
    v-bind="props"
    :to="localizedPath"
    @mouseenter.passive="prefetch"
    @touchstart.passive="prefetch"
  >
    <slot :navigate="navigate" :href="href" :prefetch="prefetch" />
  </router-link>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import { usePrefetchView } from './use-prefetch-view'
import { useLocalizedPath } from './use-localized-path'
import type { RouterLinkProps } from 'vue-router'

const props = defineProps<RouterLinkProps>()

const to = toRef(props, 'to')

const { localizedPath } = useLocalizedPath(to)
const { prefetch } = usePrefetchView(to)
</script>
