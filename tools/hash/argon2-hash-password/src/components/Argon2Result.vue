<template>
  <template v-if="showOutput">
    <ToolSectionHeader>{{ t('output-header') }}</ToolSectionHeader>
    <ToolSection>
      <n-form-item :label="t('output')">
        <CopyToClipboardTooltip :content="result" #="{ copy }">
          <n-text
            code
            class="argon2-result"
            :class="{ 'argon2-result-processing': evaluating }"
            @click="copy"
          >
            {{ result || '...' }}
          </n-text>
        </CopyToClipboardTooltip>
      </n-form-item>
      <CopyToClipboardButton :content="result" />
    </ToolSection>
  </template>

  <ToolSection v-if="runtimeError">
    <n-text type="error">{{ runtimeError }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import { computedAsync } from '@vueuse/core'
import { NFormItem, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, CopyToClipboardTooltip } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'
import type { Argon2Algorithm } from '../types'
import { generateArgon2Hash } from '../utils'

const props = defineProps<{
  password: string
  secret: string
  algorithm: Argon2Algorithm
  salt: string
  iterations: number
  memorySize: number
  parallelism: number
  hashLength: number
  configValid: boolean
}>()

const { t } = useI18n()
const runtimeError = ref('')
const evaluating = shallowRef(false)

const result = computedAsync<string>(
  async () => {
    const {
      password,
      secret,
      algorithm,
      salt,
      iterations,
      memorySize,
      parallelism,
      hashLength,
      configValid,
    } = props

    runtimeError.value = ''

    if (!password || !salt || !configValid) {
      return ''
    }

    try {
      return await generateArgon2Hash({
        algorithm,
        password,
        salt,
        secret,
        iterations,
        memorySize,
        parallelism,
        hashLength,
      })
    } catch {
      runtimeError.value = t('hash-failed')
      return ''
    }
  },
  '',
  evaluating,
)

const showOutput = computed(() => Boolean(props.password) && props.configValid)
</script>

<style scoped>
.argon2-result {
  cursor: pointer;
  font-size: 1.2em;
  word-break: break-all;
  transition: filter 0.3s ease-in-out;
}

.argon2-result-processing {
  cursor: not-allowed;
  filter: blur(10px);
}
</style>

<i18n lang="json">
{
  "en": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "zh": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "zh-CN": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "zh-TW": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "zh-HK": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "es": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "fr": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "de": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "it": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "ja": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "ko": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "ru": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "pt": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "ar": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "hi": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "tr": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "nl": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "sv": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "pl": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "vi": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "th": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "id": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "he": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "ms": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "no": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  }
}
</i18n>
