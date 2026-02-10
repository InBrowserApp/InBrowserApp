<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSectionHeader>
      {{ t('input-header') }}
    </ToolSectionHeader>
    <ToolSection>
      <n-form-item :label="t('password-to-verify')">
        <n-input
          v-model:value="passwordToVerify"
          :placeholder="t('password-to-verify')"
          type="password"
          show-password-on="click"
          :input-props="{ autocomplete: 'off' }"
        />
      </n-form-item>
      <n-form-item :label="t('argon2-hash-to-verify')">
        <n-input
          v-model:value="argon2HashToVerify"
          :placeholder="t('argon2-hash-to-verify')"
          type="password"
          show-password-on="click"
          :input-props="{ autocomplete: 'off' }"
        />
      </n-form-item>
      <n-form-item :label="t('secret-to-verify')">
        <n-input
          v-model:value="secretToVerify"
          :placeholder="t('secret-to-verify')"
          type="password"
          show-password-on="click"
          :input-props="{ autocomplete: 'off' }"
        />
      </n-form-item>
    </ToolSection>

    <ToolSectionHeader>
      {{ t('result-header') }}
    </ToolSectionHeader>
    <ToolSection>
      <n-text
        class="argon2-verifier-result"
        :class="{ 'argon2-verifier-result-processing': processing }"
      >
        <n-flex align="center" gap="1em">
          <n-icon
            :component="status === 'verified' ? CheckmarkCircle12Filled : DismissCircle12Filled"
            class="argon2-verifier-result-icon"
          />
          <span>
            {{ statusText }}
          </span>
        </n-flex>
      </n-text>
    </ToolSection>

    <WhatIsArgon2 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import CheckmarkCircle12Filled from '@vicons/fluent/CheckmarkCircle12Filled'
import DismissCircle12Filled from '@vicons/fluent/DismissCircle12Filled'
import { computed, shallowRef, ref } from 'vue'
import { computedAsync } from '@vueuse/core'
import { NFlex, NFormItem, NIcon, NInput, NText } from 'naive-ui'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { argon2Verify } from 'hash-wasm'
import WhatIsArgon2 from './WhatIsArgon2.vue'

const { t } = useI18n()

const passwordToVerify = ref('')
const argon2HashToVerify = ref('')
const secretToVerify = ref('')

const processing = shallowRef(false)

const status = computedAsync<'idle' | 'verified' | 'not-verified' | 'invalid-hash'>(
  async () => {
    const password = passwordToVerify.value
    const hash = argon2HashToVerify.value
    const secret = secretToVerify.value

    if (!password || !hash) {
      return 'idle'
    }

    try {
      const verified = await argon2Verify({
        password,
        hash,
        secret: secret || undefined,
      })

      return verified ? 'verified' : 'not-verified'
    } catch {
      return 'invalid-hash'
    }
  },
  'idle',
  processing,
)

const statusText = computed(() => {
  switch (status.value) {
    case 'verified':
      return t('status-verified')
    case 'not-verified':
      return t('status-not-verified')
    case 'invalid-hash':
      return t('status-invalid-hash')
    default:
      return t('status-idle')
  }
})
</script>

<style scoped>
.argon2-verifier-result {
  font-size: 1.2em;
  word-break: break-all;
  transition: filter 0.3s ease-in-out;
}

.argon2-verifier-result-processing {
  cursor: not-allowed;
  filter: blur(10px);
}

.argon2-verifier-result-icon {
  font-size: 1.2em;
}
</style>

<i18n lang="json">
{
  "en": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "zh": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "zh-CN": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "zh-TW": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "zh-HK": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "es": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "fr": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "de": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "it": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "ja": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "ko": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "ru": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "pt": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "ar": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "hi": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "tr": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "nl": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "sv": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "pl": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "vi": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "th": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "id": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "he": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "ms": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "no": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  }
}
</i18n>
