<template>
  <!-- eslint-disable @intlify/vue-i18n/no-missing-keys -->
  <CustomRouterLink v-if="!props.tool.external" :to="path" class="tool-link">
    <n-thing>
      <template v-if="showIcon" #avatar>
        <n-avatar>
          <n-icon :component="props.tool.icon" />
        </n-avatar>
      </template>
      <template #header>
        {{ t('name') }}
      </template>
      <template #description>
        {{ t('description') }}
      </template>
    </n-thing>
  </CustomRouterLink>
  <a v-else :href="path" class="tool-link">
    <n-thing>
      <template v-if="showIcon" #avatar>
        <n-avatar>
          <n-icon :component="props.tool.icon" />
        </n-avatar>
      </template>
      <template v-if="props.tool.thirdParty" #header-extra>
        <n-tag :bordered="false" size="small">
          {{ t('thirdParty') }}
        </n-tag>
      </template>

      <template #header>
        {{ t('name') }}
      </template>
      <template #description>
        {{ t('description') }}
      </template>
    </n-thing>
  </a>
  <!-- eslint-enable @intlify/vue-i18n/no-missing-keys -->
</template>

<script setup lang="ts">
import { NThing, NAvatar, NIcon, useThemeVars, NTag } from 'naive-ui'
import type { ToolInfo } from '@shared/tools'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CustomRouterLink } from '../../base'

const props = defineProps<{
  tool: ToolInfo
  showIcon?: boolean
}>()

const path = computed(() => props.tool.path)
const themeVars = useThemeVars()

const { t } = useI18n({
  messages: props.tool.meta,
})
</script>

<i18n lang="json">
{
  "en": {
    "thirdParty": "Third Party"
  },
  "zh": {
    "thirdParty": "第三方"
  },
  "zh-CN": {
    "thirdParty": "第三方"
  },
  "zh-TW": {
    "thirdParty": "第三方"
  },
  "zh-HK": {
    "thirdParty": "第三方"
  },
  "es": {
    "thirdParty": "Terceros"
  },
  "fr": {
    "thirdParty": "Tiers"
  },
  "de": {
    "thirdParty": "Drittanbieter"
  },
  "it": {
    "thirdParty": "Terze parti"
  },
  "ja": {
    "thirdParty": "サードパーティ"
  },
  "ko": {
    "thirdParty": "서드파티"
  },
  "ru": {
    "thirdParty": "Третья сторона"
  },
  "pt": {
    "thirdParty": "Terceiros"
  },
  "ar": {
    "thirdParty": "طرف ثالث"
  },
  "hi": {
    "thirdParty": "तृतीय पक्ष"
  },
  "tr": {
    "thirdParty": "Üçüncü Taraf"
  },
  "nl": {
    "thirdParty": "Derde partij"
  },
  "sv": {
    "thirdParty": "Tredje part"
  },
  "pl": {
    "thirdParty": "Strona trzecia"
  },
  "vi": {
    "thirdParty": "Bên thứ ba"
  },
  "th": {
    "thirdParty": "บุคคลภายนอก"
  },
  "id": {
    "thirdParty": "Pihak ketiga"
  },
  "he": {
    "thirdParty": "צד שלישי"
  },
  "ms": {
    "thirdParty": "Pihak ketiga"
  },
  "no": {
    "thirdParty": "Tredjepart"
  }
}
</i18n>

<style scoped>
.tool-link {
  text-decoration: none;
  color: inherit;
  display: block;
  font-size: 1.2em;
  border-radius: 10px;
  padding: 15px;
  transition: background 0.2s v-bind('themeVars.cubicBezierEaseInOut');
}

.tool-link:hover {
  background: v-bind('themeVars.hoverColor');
}
</style>
