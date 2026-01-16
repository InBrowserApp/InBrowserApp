<template>
  <DescriptionMarkdown
    :title="t('what-is-nanoid')"
    :description="t('what-is-nanoid-description-markdown')"
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
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "zh": {
    "what-is-nanoid": "什么是 NanoID？",
    "what-is-nanoid-description-markdown": "NanoID 是一种小巧、URL 安全的唯一 ID 生成器，适用于现代 Web 应用。标准 NanoID 长度为 21，使用 64 个字符的字母表，约有 126 位随机性。\n\n**要点：**\n- **URL 安全**：使用 A-Z、a-z、0-9、- 和 _。\n- **可自定义**：可根据约束调整长度与字符集。\n- **安全随机**：在浏览器中使用加密随机数。"
  },
  "zh-CN": {
    "what-is-nanoid": "什么是 NanoID？",
    "what-is-nanoid-description-markdown": "NanoID 是一种小巧、URL 安全的唯一 ID 生成器，适用于现代 Web 应用。标准 NanoID 长度为 21，使用 64 个字符的字母表，约有 126 位随机性。\n\n**要点：**\n- **URL 安全**：使用 A-Z、a-z、0-9、- 和 _。\n- **可自定义**：可根据约束调整长度与字符集。\n- **安全随机**：在浏览器中使用加密随机数。"
  },
  "zh-TW": {
    "what-is-nanoid": "什麼是 NanoID？",
    "what-is-nanoid-description-markdown": "NanoID 是一種小巧、URL 安全的唯一 ID 產生器，適用於現代 Web 應用。標準 NanoID 長度為 21，使用 64 個字元的字母表，約有 126 位隨機性。\n\n**要點：**\n- **URL 安全**：使用 A-Z、a-z、0-9、- 和 _。\n- **可自訂**：可依約束調整長度與字元集。\n- **安全隨機**：在瀏覽器中使用加密隨機數。"
  },
  "zh-HK": {
    "what-is-nanoid": "什麼是 NanoID？",
    "what-is-nanoid-description-markdown": "NanoID 是一種小巧、URL 安全的唯一 ID 產生器，適用於現代 Web 應用。標準 NanoID 長度為 21，使用 64 個字元的字母表，約有 126 位隨機性。\n\n**要點：**\n- **URL 安全**：使用 A-Z、a-z、0-9、- 和 _。\n- **可自訂**：可依約束調整長度與字元集。\n- **安全隨機**：在瀏覽器中使用加密隨機數。"
  },
  "es": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "fr": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "de": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "it": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "ja": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "ko": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "ru": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "pt": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "ar": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "hi": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "tr": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "nl": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "sv": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "pl": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "vi": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "th": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "id": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "he": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "ms": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  },
  "no": {
    "what-is-nanoid": "What is NanoID?",
    "what-is-nanoid-description-markdown": "NanoID is a tiny, URL-safe unique ID generator designed for modern web apps. A standard NanoID is 21 characters long and uses a 64-character alphabet, providing about 126 bits of randomness.\n\n**Key points:**\n- **URL-safe**: uses A-Z, a-z, 0-9, - and _.\n- **Customizable**: adjust length and alphabet to match constraints.\n- **Secure randomness**: uses cryptographic random values in the browser."
  }
}
</i18n>
