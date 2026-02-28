<template>
  <NavLayout>
    <RouterView :key="route.path" />
  </NavLayout>
</template>

<script lang="ts" setup>
import { RouterView, useRoute } from 'vue-router'
import { NavLayout } from '@shared/ui/layouts'

const route = useRoute()
</script>
