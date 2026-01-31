<template>
  <n-tooltip>
    <template #trigger>
      <n-button
        tag="a"
        href="https://github.com/InBrowserApp/inbrowser.app"
        target="_blank"
        rel="noopener noreferrer"
        quaternary
        circle
        aria-label="GitHub"
      >
        <template #icon>
          <n-icon>
            <Icon />
          </n-icon>
        </template>
      </n-button>
    </template>
    <span>GitHub</span>
  </n-tooltip>
</template>

<script lang="ts" setup>
import { NIcon, NButton, NTooltip } from 'naive-ui'
import Icon from '@vicons/ionicons5/LogoGithub'
</script>
