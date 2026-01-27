<template>
  <ToolSectionHeader>{{ t('settings') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="10">
      <n-flex align="center" :size="8" class="setting-row">
        <n-text depth="3">{{ t('systemAudio') }}</n-text>
        <n-switch
          :value="includeSystemAudio"
          :disabled="settingsDisabled"
          @update:value="emit('update:includeSystemAudio', $event)"
        />
      </n-flex>
      <n-flex align="center" :size="8" class="setting-row">
        <n-text depth="3">{{ t('microphone') }}</n-text>
        <n-switch
          :value="includeMicrophone"
          :disabled="settingsDisabled || !isMicSupported"
          @update:value="emit('update:includeMicrophone', $event)"
        />
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex, NSwitch, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  includeSystemAudio: boolean
  includeMicrophone: boolean
  settingsDisabled: boolean
  isMicSupported: boolean
}>()

const emit = defineEmits<{
  'update:includeSystemAudio': [boolean]
  'update:includeMicrophone': [boolean]
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<style scoped>
.setting-row {
  justify-content: space-between;
}
</style>

<i18n lang="json">
{
  "en": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "zh": {
    "settings": "设置",
    "systemAudio": "系统声音",
    "microphone": "麦克风"
  },
  "zh-CN": {
    "settings": "设置",
    "systemAudio": "系统声音",
    "microphone": "麦克风"
  },
  "zh-TW": {
    "settings": "設定",
    "systemAudio": "系統聲音",
    "microphone": "麥克風"
  },
  "zh-HK": {
    "settings": "設定",
    "systemAudio": "系統聲音",
    "microphone": "麥克風"
  },
  "es": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "fr": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "de": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "it": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "ja": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "ko": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "ru": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "pt": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "ar": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "hi": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "tr": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "nl": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "sv": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "pl": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "vi": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "th": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "id": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "he": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "ms": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  },
  "no": {
    "settings": "Settings",
    "systemAudio": "System audio",
    "microphone": "Microphone"
  }
}
</i18n>
