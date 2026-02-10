<template>
  <DescriptionMarkdown
    :title="t('what-is-scrypt')"
    :description="t('what-is-scrypt-description')"
  />
</template>

<script setup lang="ts">
import { DescriptionMarkdown } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "what-is-scrypt": "What is scrypt?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "zh": {
    "what-is-scrypt": "什么是 scrypt？",
    "what-is-scrypt-description": "scrypt 是一种内存困难型密码密钥派生函数（KDF），旨在让大规模暴力破解在 CPU 和内存成本上都变得更高。\n\n**要点：**\n- 主要参数为 N（成本因子）、r（块大小）和 p（并行度）\n- 需要较高内存，有助于提高 GPU/ASIC 破解成本\n- 基于密码 + 盐生成确定性的派生密钥\n\n**最佳实践：**\n- 每个密码都使用唯一且随机的盐\n- 在可接受性能范围内尽量提高 N/r/p 参数\n- 将参数与派生结果一同保存，便于后续验证"
  },
  "zh-CN": {
    "what-is-scrypt": "什么是 scrypt？",
    "what-is-scrypt-description": "scrypt 是一种内存困难型密码密钥派生函数（KDF），旨在让大规模暴力破解在 CPU 和内存成本上都变得更高。\n\n**要点：**\n- 主要参数为 N（成本因子）、r（块大小）和 p（并行度）\n- 需要较高内存，有助于提高 GPU/ASIC 破解成本\n- 基于密码 + 盐生成确定性的派生密钥\n\n**最佳实践：**\n- 每个密码都使用唯一且随机的盐\n- 在可接受性能范围内尽量提高 N/r/p 参数\n- 将参数与派生结果一同保存，便于后续验证"
  },
  "zh-TW": {
    "what-is-scrypt": "什麼是 scrypt？",
    "what-is-scrypt-description": "scrypt 是一種記憶體困難型密碼金鑰派生函式（KDF），旨在讓大規模暴力破解在 CPU 與記憶體成本上都更高。\n\n**要點：**\n- 主要參數為 N（成本因子）、r（區塊大小）與 p（並行度）\n- 需要較高記憶體，有助於提高 GPU/ASIC 破解成本\n- 基於密碼 + 鹽產生可重現的派生金鑰\n\n**最佳實務：**\n- 每個密碼都使用唯一且隨機的鹽\n- 在可接受效能範圍內盡量提高 N/r/p 參數\n- 將參數與派生結果一併保存，便於後續驗證"
  },
  "zh-HK": {
    "what-is-scrypt": "什麼是 scrypt？",
    "what-is-scrypt-description": "scrypt 是一種記憶體困難型密碼金鑰派生函式（KDF），旨在讓大規模暴力破解在 CPU 與記憶體成本上都更高。\n\n**要點：**\n- 主要參數為 N（成本因子）、r（區塊大小）與 p（並行度）\n- 需要較高記憶體，有助於提高 GPU/ASIC 破解成本\n- 基於密碼 + 鹽產生可重現的派生金鑰\n\n**最佳實務：**\n- 每個密碼都使用唯一且隨機的鹽\n- 在可接受效能範圍內盡量提高 N/r/p 參數\n- 將參數與派生結果一併保存，便於後續驗證"
  },
  "es": {
    "what-is-scrypt": "¿Qué es scrypt?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "fr": {
    "what-is-scrypt": "Qu'est-ce que scrypt ?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "de": {
    "what-is-scrypt": "Was ist scrypt?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "it": {
    "what-is-scrypt": "Cos'è scrypt?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "ja": {
    "what-is-scrypt": "scrypt とは？",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "ko": {
    "what-is-scrypt": "scrypt란?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "ru": {
    "what-is-scrypt": "Что такое scrypt?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "pt": {
    "what-is-scrypt": "O que é scrypt?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "ar": {
    "what-is-scrypt": "ما هو scrypt؟",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "hi": {
    "what-is-scrypt": "scrypt क्या है?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "tr": {
    "what-is-scrypt": "scrypt nedir?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "nl": {
    "what-is-scrypt": "Wat is scrypt?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "sv": {
    "what-is-scrypt": "Vad är scrypt?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "pl": {
    "what-is-scrypt": "Czym jest scrypt?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "vi": {
    "what-is-scrypt": "scrypt là gì?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "th": {
    "what-is-scrypt": "scrypt คืออะไร?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "id": {
    "what-is-scrypt": "Apa itu scrypt?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "he": {
    "what-is-scrypt": "מה זה scrypt?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "ms": {
    "what-is-scrypt": "Apakah scrypt?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  },
  "no": {
    "what-is-scrypt": "Hva er scrypt?",
    "what-is-scrypt-description": "scrypt is a memory-hard password-based key derivation function (KDF) designed to make brute-force attacks expensive in both CPU and memory.\n\n**Key points:**\n- Uses N (cost factor), r (block size), and p (parallelism)\n- Higher settings increase memory and compute cost\n- Produces deterministic derived keys from password + salt\n\n**Best practices:**\n- Use a unique random salt per password\n- Tune N/r/p to match your security and performance budget\n- Store parameters with the derived key for verification"
  }
}
</i18n>
