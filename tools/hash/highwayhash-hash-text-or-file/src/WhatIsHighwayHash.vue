<template>
  <DescriptionMarkdown
    :title="t('what-is-highwayhash')"
    :description="t('what-is-highwayhash-description-markdown')"
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
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "zh": {
    "what-is-highwayhash": "什么是 HighwayHash？",
    "what-is-highwayhash-description-markdown": "HighwayHash 是 Google 设计的一种高速有密钥哈希函数。它使用 256 位密钥，并可输出 64 位、128 位或 256 位结果。适用于高吞吐的有密钥完整性场景，但不属于密码哈希算法。"
  },
  "zh-CN": {
    "what-is-highwayhash": "什么是 HighwayHash？",
    "what-is-highwayhash-description-markdown": "HighwayHash 是 Google 设计的一种高速有密钥哈希函数。它使用 256 位密钥，并可输出 64 位、128 位或 256 位结果。适用于高吞吐的有密钥完整性场景，但不属于密码哈希算法。"
  },
  "zh-TW": {
    "what-is-highwayhash": "什麼是 HighwayHash？",
    "what-is-highwayhash-description-markdown": "HighwayHash 是 Google 設計的一種高速有金鑰雜湊函式。它使用 256 位元金鑰，並可輸出 64 位元、128 位元或 256 位元結果。適用於高吞吐的有金鑰完整性情境，但不屬於密碼雜湊演算法。"
  },
  "zh-HK": {
    "what-is-highwayhash": "什麼是 HighwayHash？",
    "what-is-highwayhash-description-markdown": "HighwayHash 是 Google 設計的一種高速有金鑰雜湊函式。它使用 256 位元金鑰，並可輸出 64 位元、128 位元或 256 位元結果。適用於高吞吐的有金鑰完整性情境，但不屬於密碼雜湊演算法。"
  },
  "es": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "fr": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "de": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "it": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "ja": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "ko": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "ru": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "pt": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "ar": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "hi": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "tr": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "nl": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "sv": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "pl": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "vi": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "th": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "id": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "he": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "ms": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  },
  "no": {
    "what-is-highwayhash": "What is HighwayHash?",
    "what-is-highwayhash-description-markdown": "HighwayHash is a fast keyed hash function designed by Google. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit outputs. It is useful for high-throughput keyed integrity workflows, but it is not a password hashing algorithm."
  }
}
</i18n>
