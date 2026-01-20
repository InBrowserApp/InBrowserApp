<template>
  <n-input-group>
    <n-input :placeholder="t('placeholder')" v-model:value="value" @keydown.enter="goToIPInfo" />
    <n-button
      ghost
      @click="goToIPInfo"
      tag="a"
      v-bind="{
        ...(href && { href: href }),
      }"
      :disabled="ipDomain === ''"
    >
      <template #icon>
        <n-icon>
          <Search16Filled />
        </n-icon>
      </template>
    </n-button>
  </n-input-group>
</template>

<script setup lang="ts">
import { NInput, NButton, NInputGroup, NIcon } from 'naive-ui'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Search16Filled from '@vicons/fluent/Search16Filled'
const router = useRouter()
const { t } = useI18n()

const value = ref('')

const ipDomain = computed(() => {
  if (value.value.startsWith('http://') || value.value.startsWith('https://')) {
    const url = new URL(value.value)
    return url.hostname
  }

  return value.value.trim()
})

const goToIPInfo = () => {
  if (ipDomain.value === '') {
    return
  }

  router.push(`/tools/ip-info-lookup/${ipDomain.value}`)
}

const href = computed(() => {
  if (value.value === '') return undefined

  return `/tools/ip-info-lookup/${ipDomain.value}`
})
</script>

<i18n lang="json">
{
  "en": {
    "placeholder": "IPv4 / IPv6 / Domain / URL"
  },
  "zh": {
    "placeholder": "IPv4 / IPv6 / 域名 / URL"
  },
  "zh-CN": {
    "placeholder": "IPv4 / IPv6 / 域名 / URL"
  },
  "zh-TW": {
    "placeholder": "IPv4 / IPv6 / 域名 / URL"
  },
  "zh-HK": {
    "placeholder": "IPv4 / IPv6 / 域名 / URL"
  },
  "es": {
    "placeholder": "IPv4 / IPv6 / Dominio / URL"
  },
  "fr": {
    "placeholder": "IPv4 / IPv6 / Domaine / URL"
  },
  "de": {
    "placeholder": "IPv4 / IPv6 / Domain / URL"
  },
  "it": {
    "placeholder": "IPv4 / IPv6 / Dominio / URL"
  },
  "ja": {
    "placeholder": "IPv4 / IPv6 / ドメイン / URL"
  },
  "ko": {
    "placeholder": "IPv4 / IPv6 / 도메인 / URL"
  },
  "ru": {
    "placeholder": "IPv4 / IPv6 / Домен / URL"
  },
  "pt": {
    "placeholder": "IPv4 / IPv6 / Domínio / URL"
  },
  "ar": {
    "placeholder": "IPv4 / IPv6 / نطاق / URL"
  },
  "hi": {
    "placeholder": "IPv4 / IPv6 / डोमेन / URL"
  },
  "tr": {
    "placeholder": "IPv4 / IPv6 / Alan Adı / URL"
  },
  "nl": {
    "placeholder": "IPv4 / IPv6 / Domein / URL"
  },
  "sv": {
    "placeholder": "IPv4 / IPv6 / Domän / URL"
  },
  "pl": {
    "placeholder": "IPv4 / IPv6 / Domena / URL"
  },
  "vi": {
    "placeholder": "IPv4 / IPv6 / Tên miền / URL"
  },
  "th": {
    "placeholder": "IPv4 / IPv6 / โดเมน / URL"
  },
  "id": {
    "placeholder": "IPv4 / IPv6 / Domain / URL"
  },
  "he": {
    "placeholder": "IPv4 / IPv6 / דומיין / URL"
  },
  "ms": {
    "placeholder": "IPv4 / IPv6 / Domain / URL"
  },
  "no": {
    "placeholder": "IPv4 / IPv6 / Domene / URL"
  }
}
</i18n>
