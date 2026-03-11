<template>
  <ToolSectionHeader>{{ t('twitterTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('twitterCardLabel')" :show-feedback="false">
        <n-select
          v-model:value="twitter.card"
          :options="twitterCardOptions"
          data-testid="twitter-card"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('twitterInheritLabel')" :show-feedback="false">
        <n-switch v-model:value="twitter.inheritFromOpenGraph" data-testid="twitter-inherit" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('twitterSiteLabel')" :show-feedback="false">
        <n-input v-model:value="twitter.site" placeholder="@example" data-testid="twitter-site" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('twitterCreatorLabel')" :show-feedback="false">
        <n-input
          v-model:value="twitter.creator"
          placeholder="@author"
          data-testid="twitter-creator"
        />
      </n-form-item-gi>

      <template v-if="showTwitterOverrides">
        <n-form-item-gi :label="t('twitterOverrideTitleLabel')" :show-feedback="false" :span="2">
          <n-input v-model:value="twitter.title" data-testid="twitter-title" />
        </n-form-item-gi>
        <n-form-item-gi
          :label="t('twitterOverrideDescriptionLabel')"
          :show-feedback="false"
          :span="2"
        >
          <n-input
            v-model:value="twitter.description"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 8 }"
            data-testid="twitter-description"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="t('twitterImageLabel')" :show-feedback="false" :span="2">
          <n-input
            v-model:value="twitter.imageUrl"
            :placeholder="t('urlPlaceholder')"
            data-testid="twitter-image-url"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="t('twitterImageAltLabel')" :show-feedback="false" :span="2">
          <n-input v-model:value="twitter.imageAlt" data-testid="twitter-image-alt" />
        </n-form-item-gi>
      </template>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFormItemGi, NGrid, NInput, NSelect, NSwitch } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { twitterCardOptions, type TwitterMeta } from '../state'
import { messages } from '../locale/messages'

const { t } = useI18n({ useScope: 'local', messages })
const twitter = defineModel<TwitterMeta>('twitter', { required: true })
const showTwitterOverrides = computed(() => !twitter.value.inheritFromOpenGraph)
</script>
