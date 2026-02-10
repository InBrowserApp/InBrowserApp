<template>
  <ToolSectionHeader>{{ t('config-header') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" :x-gap="12" :y-gap="12">
      <n-gi>
        <n-form-item :label="t('password')" :show-feedback="false">
          <n-input
            v-model:value="password"
            type="password"
            show-password-on="click"
            :input-props="{ autocomplete: 'off' }"
          />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item :label="t('algorithm')" :show-feedback="false">
          <n-select v-model:value="algorithm" :options="ALGORITHM_OPTIONS" />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item
          :label="t('iterations')"
          :validation-status="iterationsStatus"
          :show-feedback="false"
        >
          <n-input-number
            v-model:value="iterations"
            :min="iterationsMin"
            :max="iterationsMax"
            :step="1"
            :precision="0"
            style="width: 100%"
          />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item
          :label="t('memory-size')"
          :validation-status="memoryStatus"
          :show-feedback="false"
        >
          <n-input-number
            v-model:value="memorySize"
            :min="memoryMin"
            :max="memoryMax"
            :step="8"
            :precision="0"
            style="width: 100%"
          />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item
          :label="t('parallelism')"
          :validation-status="parallelismStatus"
          :show-feedback="false"
        >
          <n-input-number
            v-model:value="parallelism"
            :min="parallelismMin"
            :max="parallelismMax"
            :step="1"
            :precision="0"
            style="width: 100%"
          />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item
          :label="t('hash-length')"
          :validation-status="hashLengthStatus"
          :show-feedback="false"
        >
          <n-input-number
            v-model:value="hashLength"
            :min="hashLengthMin"
            :max="hashLengthMax"
            :step="1"
            :precision="0"
            style="width: 100%"
          />
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-form-item :label="t('salt')" :validation-status="saltStatus" :show-feedback="false">
          <n-input v-model:value="salt" />
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-button secondary @click="emit('generate-salt')">{{ t('generate-salt') }}</n-button>
      </n-gi>
      <n-gi :span="2">
        <n-form-item :label="t('secret')" :show-feedback="false">
          <n-input
            v-model:value="secret"
            type="password"
            show-password-on="click"
            :input-props="{ autocomplete: 'off' }"
          />
        </n-form-item>
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NFormItem, NGi, NGrid, NInput, NInputNumber, NSelect } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { ALGORITHM_OPTIONS } from '../types'
import type { Argon2Algorithm } from '../types'

const props = defineProps<{
  iterationsMin: number
  iterationsMax: number
  memoryMin: number
  memoryMax: number
  parallelismMin: number
  parallelismMax: number
  hashLengthMin: number
  hashLengthMax: number
  iterationsValid: boolean
  memoryValid: boolean
  parallelismValid: boolean
  hashLengthValid: boolean
  memoryDependencyValid: boolean
  saltErrorType: '' | 'required' | 'base64'
}>()

const emit = defineEmits<{
  'generate-salt': []
}>()

const password = defineModel<string>('password', { required: true })
const secret = defineModel<string>('secret', { required: true })
const algorithm = defineModel<Argon2Algorithm>('algorithm', { required: true })
const iterations = defineModel<number | null>('iterations', { required: true })
const memorySize = defineModel<number | null>('memorySize', { required: true })
const parallelism = defineModel<number | null>('parallelism', { required: true })
const hashLength = defineModel<number | null>('hashLength', { required: true })
const salt = defineModel<string>('salt', { required: true })

const { t } = useI18n()

const iterationsStatus = computed(() => (props.iterationsValid ? undefined : 'error'))
const parallelismStatus = computed(() => (props.parallelismValid ? undefined : 'error'))
const hashLengthStatus = computed(() => (props.hashLengthValid ? undefined : 'error'))
const memoryStatus = computed(() =>
  props.memoryValid && props.memoryDependencyValid ? undefined : 'error',
)
const saltStatus = computed(() => (props.saltErrorType ? 'error' : undefined))
</script>

<i18n lang="json">
{
  "en": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "zh": {
    "config-header": "配置",
    "password": "密码",
    "algorithm": "算法",
    "iterations": "迭代次数",
    "memory-size": "内存大小 (KiB)",
    "parallelism": "并行度",
    "hash-length": "哈希长度（字节）",
    "salt": "盐值",
    "secret": "密钥（可选）",
    "generate-salt": "生成随机盐值"
  },
  "zh-CN": {
    "config-header": "配置",
    "password": "密码",
    "algorithm": "算法",
    "iterations": "迭代次数",
    "memory-size": "内存大小 (KiB)",
    "parallelism": "并行度",
    "hash-length": "哈希长度（字节）",
    "salt": "盐值",
    "secret": "密钥（可选）",
    "generate-salt": "生成随机盐值"
  },
  "zh-TW": {
    "config-header": "設定",
    "password": "密碼",
    "algorithm": "演算法",
    "iterations": "迭代次數",
    "memory-size": "記憶體大小 (KiB)",
    "parallelism": "平行度",
    "hash-length": "雜湊長度（位元組）",
    "salt": "鹽值",
    "secret": "密鑰（可選）",
    "generate-salt": "產生隨機鹽值"
  },
  "zh-HK": {
    "config-header": "設定",
    "password": "密碼",
    "algorithm": "演算法",
    "iterations": "迭代次數",
    "memory-size": "記憶體大小 (KiB)",
    "parallelism": "平行度",
    "hash-length": "雜湊長度（位元組）",
    "salt": "鹽值",
    "secret": "密鑰（可選）",
    "generate-salt": "產生隨機鹽值"
  },
  "es": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "fr": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "de": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "it": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "ja": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "ko": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "ru": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "pt": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "ar": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "hi": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "tr": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "nl": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "sv": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "pl": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "vi": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "th": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "id": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "he": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "ms": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "no": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  }
}
</i18n>
