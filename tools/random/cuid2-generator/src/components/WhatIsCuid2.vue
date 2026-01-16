<template>
  <DescriptionMarkdown
    :title="t('what-is-cuid2')"
    :description="t('what-is-cuid2-description-markdown')"
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
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "zh": {
    "what-is-cuid2": "什么是 CUID2？",
    "what-is-cuid2-description-markdown": "CUID2 是一种面向水平扩展和安全性的低碰撞 ID。它组合时间、会话计数器、随机熵和主机指纹，并使用 SHA-3 哈希，生成小写 base36 标识符。\n\n**要点：**\n- **安全且低碰撞**：多重熵源经 SHA-3 哈希。\n- **URL 友好**：仅包含 a-z 和 0-9，且以字母开头。\n- **可调长度**：2-32 位，默认 24。"
  },
  "zh-CN": {
    "what-is-cuid2": "什么是 CUID2？",
    "what-is-cuid2-description-markdown": "CUID2 是一种面向水平扩展和安全性的低碰撞 ID。它组合时间、会话计数器、随机熵和主机指纹，并使用 SHA-3 哈希，生成小写 base36 标识符。\n\n**要点：**\n- **安全且低碰撞**：多重熵源经 SHA-3 哈希。\n- **URL 友好**：仅包含 a-z 和 0-9，且以字母开头。\n- **可调长度**：2-32 位，默认 24。"
  },
  "zh-TW": {
    "what-is-cuid2": "什麼是 CUID2？",
    "what-is-cuid2-description-markdown": "CUID2 是一種面向水平擴展與安全性的低碰撞 ID。它組合時間、會話計數器、隨機熵與主機指紋，並使用 SHA-3 雜湊，產生小寫 base36 識別碼。\n\n**要點：**\n- **安全且低碰撞**：多重熵來源經 SHA-3 雜湊。\n- **URL 友好**：僅包含 a-z 與 0-9，且以字母開頭。\n- **可調長度**：2-32 位，預設 24。"
  },
  "zh-HK": {
    "what-is-cuid2": "什麼是 CUID2？",
    "what-is-cuid2-description-markdown": "CUID2 是一種面向水平擴展與安全性的低碰撞 ID。它組合時間、會話計數器、隨機熵與主機指紋，並使用 SHA-3 雜湊，產生小寫 base36 識別碼。\n\n**要點：**\n- **安全且低碰撞**：多重熵來源經 SHA-3 雜湊。\n- **URL 友好**：僅包含 a-z 與 0-9，且以字母開頭。\n- **可調長度**：2-32 位，預設 24。"
  },
  "es": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "fr": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "de": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "it": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "ja": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "ko": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "ru": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "pt": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "ar": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "hi": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "tr": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "nl": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "sv": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "pl": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "vi": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "th": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "id": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "he": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "ms": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  },
  "no": {
    "what-is-cuid2": "What is CUID2?",
    "what-is-cuid2-description-markdown": "CUID2 is a collision-resistant ID optimized for horizontal scaling and security. It combines time, a session counter, random entropy, and a host fingerprint, then hashes the result with SHA-3 to produce a lowercase base36 identifier.\n\n**Key points:**\n- **Secure and collision resistant**: multiple entropy sources hashed with SHA-3.\n- **URL-friendly**: uses only a-z and 0-9, starting with a letter.\n- **Configurable length**: 2-32 characters, default 24."
  }
}
</i18n>
