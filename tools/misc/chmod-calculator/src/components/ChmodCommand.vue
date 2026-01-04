<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex align="center">
      <n-text code style="font-size: 1.1rem">{{ command }}</n-text>
      <CopyToClipboardButton :content="command" />
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  command: string
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "Chmod Command"
  },
  "zh": {
    "title": "Chmod 命令"
  },
  "zh-CN": {
    "title": "Chmod 命令"
  },
  "zh-TW": {
    "title": "Chmod 指令"
  },
  "zh-HK": {
    "title": "Chmod 指令"
  },
  "es": {
    "title": "Comando Chmod"
  },
  "fr": {
    "title": "Commande Chmod"
  },
  "de": {
    "title": "Chmod-Befehl"
  },
  "it": {
    "title": "Comando Chmod"
  },
  "ja": {
    "title": "Chmod コマンド"
  },
  "ko": {
    "title": "Chmod 명령어"
  },
  "ru": {
    "title": "Команда Chmod"
  },
  "pt": {
    "title": "Comando Chmod"
  },
  "ar": {
    "title": "أمر Chmod"
  },
  "hi": {
    "title": "Chmod कमांड"
  },
  "tr": {
    "title": "Chmod Komutu"
  },
  "nl": {
    "title": "Chmod-opdracht"
  },
  "sv": {
    "title": "Chmod-kommando"
  },
  "pl": {
    "title": "Polecenie Chmod"
  },
  "vi": {
    "title": "Lệnh Chmod"
  },
  "th": {
    "title": "คำสั่ง Chmod"
  },
  "id": {
    "title": "Perintah Chmod"
  },
  "he": {
    "title": "פקודת Chmod"
  },
  "ms": {
    "title": "Perintah Chmod"
  },
  "no": {
    "title": "Chmod-kommando"
  }
}
</i18n>
