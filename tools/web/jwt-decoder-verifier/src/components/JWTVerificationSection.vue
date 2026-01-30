<template>
  <ToolSectionHeader v-if="secret">{{ t('status') }}</ToolSectionHeader>
  <ToolSection v-if="secret">
    <n-alert :type="statusType" :title="statusTitle" :show-icon="true">
      {{ statusDetail }}
    </n-alert>
  </ToolSection>

  <ToolSectionHeader v-if="problems.length">{{ t('problems') }}</ToolSectionHeader>
  <ToolSection v-if="problems.length">
    <ul v-if="problems.length">
      <li v-for="(p, idx) in problems" :key="idx">{{ p }}</li>
    </ul>
    <n-text v-else depth="3">{{ t('no-problems') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { verify } from 'hono/jwt'

const props = defineProps<{
  token: string
  secret: string
  alg: AlgorithmType
  decodedHeader: object | null
}>()

const allowedAlgs = [
  'HS256',
  'HS384',
  'HS512',
  'RS256',
  'RS384',
  'RS512',
  'PS256',
  'PS384',
  'PS512',
  'ES256',
  'ES384',
  'ES512',
  'EdDSA',
] as const

type AllowedAlg = (typeof allowedAlgs)[number]
type AlgorithmType = 'auto' | AllowedAlg

const { t } = useI18n()

function toAllowedAlg(value: unknown): AllowedAlg | undefined {
  return typeof value === 'string' && (allowedAlgs as readonly string[]).includes(value)
    ? (value as AllowedAlg)
    : undefined
}

const detectedAlg = computed<string | null>(() => {
  const header = props.decodedHeader as unknown
  if (header && typeof header === 'object' && 'alg' in (header as Record<string, unknown>)) {
    const a = (header as { alg?: unknown }).alg
    return typeof a === 'string' ? a : null
  }
  return null
})

const problems = ref<string[]>([])

const statusType = computed(() => {
  if (!props.token) return 'default'
  if (!props.secret) return 'default'
  return problems.value.length ? 'error' : 'success'
})

const statusTitle = computed(() => {
  if (!props.token) return t('decoded-only')
  if (!props.secret) return t('decoded-only')
  return problems.value.length ? t('failed') : t('verified')
})

const statusDetail = computed(() => {
  if (!props.token) return t('enter-token')
  if (!props.secret) return t('enter-secret')
  return problems.value.length ? problems.value[0] : t('ok')
})

watchEffect(async () => {
  problems.value = []
  if (!props.token || !props.secret) return
  try {
    const selectedAlg =
      props.alg === 'auto' ? toAllowedAlg(detectedAlg.value) : (props.alg as AllowedAlg)
    if (!selectedAlg) {
      problems.value.push(t('no-alg'))
      return
    }
    await verify(props.token, props.secret, selectedAlg)
  } catch (e: unknown) {
    problems.value.push(e instanceof Error ? e.message : String(e))
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "zh": {
    "status": "状态",
    "problems": "问题",
    "no-problems": "未发现问题",
    "decoded-only": "仅解码",
    "failed": "验证失败",
    "verified": "已验证",
    "enter-token": "请输入 JWT 令牌",
    "enter-secret": "请输入密钥进行验证",
    "ok": "签名验证通过",
    "no-alg": "未检测到算法"
  },
  "zh-CN": {
    "status": "状态",
    "problems": "问题",
    "no-problems": "未发现问题",
    "decoded-only": "仅解码",
    "failed": "验证失败",
    "verified": "已验证",
    "enter-token": "请输入 JWT 令牌",
    "enter-secret": "请输入密钥进行验证",
    "ok": "签名验证通过",
    "no-alg": "未检测到算法"
  },
  "zh-TW": {
    "status": "狀態",
    "problems": "問題",
    "no-problems": "未發現問題",
    "decoded-only": "僅解碼",
    "failed": "驗證失敗",
    "verified": "已驗證",
    "enter-token": "請輸入 JWT 權杖",
    "enter-secret": "請輸入密鑰以驗證",
    "ok": "簽章驗證通過",
    "no-alg": "未偵測到演算法"
  },
  "zh-HK": {
    "status": "狀態",
    "problems": "問題",
    "no-problems": "未發現問題",
    "decoded-only": "僅解碼",
    "failed": "驗證失敗",
    "verified": "已驗證",
    "enter-token": "請輸入 JWT 權杖",
    "enter-secret": "請輸入密鑰以驗證",
    "ok": "簽章驗證通過",
    "no-alg": "未偵測到演算法"
  },
  "es": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "fr": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "de": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "it": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "ja": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "ko": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "ru": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "pt": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "ar": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "hi": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "tr": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "nl": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "sv": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "pl": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "vi": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "th": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "id": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "he": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "ms": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  },
  "no": {
    "status": "Status",
    "problems": "Problems",
    "no-problems": "No problems detected",
    "decoded-only": "Decoded only",
    "failed": "Verification failed",
    "verified": "Verified",
    "enter-token": "Enter a JWT token",
    "enter-secret": "Enter secret to verify",
    "ok": "Signature verified",
    "no-alg": "No algorithm detected"
  }
}
</i18n>
