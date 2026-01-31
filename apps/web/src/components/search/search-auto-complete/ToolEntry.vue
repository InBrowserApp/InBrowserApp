<template>
  <CustomRouterLink
    :to="{
      path: info.path,
    }"
    class="link"
  >
    <div class="search-entry">
      <div>
        <n-text strong>
          {{ t('name') }}
        </n-text>
      </div>
      <div>
        <n-text depth="3" style="font-size: 0.8em">
          {{ t('description') }}
        </n-text>
      </div>
    </div>
  </CustomRouterLink>
</template>

<script lang="ts" setup>
import { CustomRouterLink } from '@shared/ui/base'
import type { ToolInfo } from '@shared/tools'
import { useI18n } from 'vue-i18n'
import { NText } from 'naive-ui'

const props = defineProps<{
  info: ToolInfo
}>()

const { t } = useI18n({
  messages: props.info.meta,
})
</script>

<style scoped>
.search-entry {
  width: 100%;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}

.link {
  all: unset;
  cursor: pointer !important;
}
</style>
