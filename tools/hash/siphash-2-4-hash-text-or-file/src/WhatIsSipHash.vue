<template>
  <DescriptionMarkdown
    :title="t('what-is-siphash')"
    :description="t('what-is-siphash-description-markdown')"
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
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "zh": {
    "what-is-siphash": "什么是 SipHash-2-4？",
    "what-is-siphash-description-markdown": "SipHash-2-4 是一种快速的有密钥哈希函数，旨在保护哈希表免受哈希洪泛攻击。它使用 128 位（16 字节）密钥并输出 64 位（8 字节）哈希值，通常显示为 16 个十六进制字符。\n\n**主要特征：**\n- **有密钥**：需要 128 位密钥\n- **确定性**：相同输入与密钥得到相同哈希\n- **非加密**：不用于通用密码学场景\n- **短输入快速**：适合哈希表与字典\n- **抗 DoS**：缓解哈希洪泛攻击\n\n**常见用途：**\n- 哈希表与字典\n- 服务端哈希洪泛防护\n- 缓存键与分片\n- 快速有密钥校验（非安全用途）"
  },
  "zh-CN": {
    "what-is-siphash": "什么是 SipHash-2-4？",
    "what-is-siphash-description-markdown": "SipHash-2-4 是一种快速的有密钥哈希函数，旨在保护哈希表免受哈希洪泛攻击。它使用 128 位（16 字节）密钥并输出 64 位（8 字节）哈希值，通常显示为 16 个十六进制字符。\n\n**主要特征：**\n- **有密钥**：需要 128 位密钥\n- **确定性**：相同输入与密钥得到相同哈希\n- **非加密**：不用于通用密码学场景\n- **短输入快速**：适合哈希表与字典\n- **抗 DoS**：缓解哈希洪泛攻击\n\n**常见用途：**\n- 哈希表与字典\n- 服务端哈希洪泛防护\n- 缓存键与分片\n- 快速有密钥校验（非安全用途）"
  },
  "zh-TW": {
    "what-is-siphash": "什麼是 SipHash-2-4？",
    "what-is-siphash-description-markdown": "SipHash-2-4 是一種快速的有金鑰雜湊函式，旨在保護雜湊表免受雜湊洪泛攻擊。它使用 128 位元（16 位元組）金鑰並輸出 64 位元（8 位元組）雜湊值，通常顯示為 16 個十六進位字元。\n\n**主要特徵：**\n- **有金鑰**：需要 128 位元金鑰\n- **確定性**：相同輸入與金鑰得到相同雜湊\n- **非加密**：不適用於一般密碼學\n- **短輸入快速**：適合雜湊表與字典\n- **抗 DoS**：緩解雜湊洪泛攻擊\n\n**常見用途：**\n- 雜湊表與字典\n- 伺服器端雜湊洪泛防護\n- 快取鍵與分片\n- 快速有金鑰校驗（非安全用途）"
  },
  "zh-HK": {
    "what-is-siphash": "什麼是 SipHash-2-4？",
    "what-is-siphash-description-markdown": "SipHash-2-4 是一種快速的有金鑰雜湊函式，旨在保護雜湊表免受雜湊洪泛攻擊。它使用 128 位元（16 位元組）金鑰並輸出 64 位元（8 位元組）雜湊值，通常顯示為 16 個十六進位字元。\n\n**主要特徵：**\n- **有金鑰**：需要 128 位元金鑰\n- **確定性**：相同輸入與金鑰得到相同雜湊\n- **非加密**：不適用於一般密碼學\n- **短輸入快速**：適合雜湊表與字典\n- **抗 DoS**：緩解雜湊洪泛攻擊\n\n**常見用途：**\n- 雜湊表與字典\n- 伺服器端雜湊洪泛防護\n- 快取鍵與分片\n- 快速有金鑰校驗（非安全用途）"
  },
  "es": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "fr": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "de": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "it": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "ja": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "ko": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "ru": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "pt": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "ar": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "hi": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "tr": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "nl": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "sv": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "pl": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "vi": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "th": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "id": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "he": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "ms": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  },
  "no": {
    "what-is-siphash": "What is SipHash-2-4?",
    "what-is-siphash-description-markdown": "SipHash-2-4 is a fast keyed hash function designed to protect hash tables against hash-flooding attacks. It uses a 128-bit (16-byte) secret key and produces a 64-bit (8-byte) output, typically shown as a 16-character hexadecimal string.\n\n**Key characteristics:**\n- **Keyed**: Requires a secret 128-bit key\n- **Deterministic**: Same input and key produce the same hash\n- **Non-cryptographic**: Not intended for general-purpose cryptography\n- **Fast on short inputs**: Optimized for hash tables\n- **DoS-resistant**: Mitigates hash-flooding attacks\n\n**Common uses:**\n- Hash tables and dictionaries\n- Hash-flooding protection in servers\n- Cache keys and sharding\n- Fast keyed checksums (non-security)"
  }
}
</i18n>
