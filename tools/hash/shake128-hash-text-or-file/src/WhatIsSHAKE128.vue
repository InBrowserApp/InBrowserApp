<template>
  <DescriptionMarkdown
    :title="t('what-is-shake128')"
    :description="t('what-is-shake128-description-markdown')"
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
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "zh": {
    "what-is-shake128": "什么是 SHAKE128 (FIPS 202)？",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) 是 SHA-3 家族中的可扩展输出函数（XOF）。与固定长度哈希不同，SHAKE128 可以输出任意位数；其安全强度为 128 位。它由 NIST 在 FIPS 202 中标准化，并基于 Keccak 海绵结构。\n\n**主要特征：**\n- **XOF 输出**：可生成可变长度摘要\n- **确定性**：相同输入与长度产生相同输出\n- **海绵结构**：基于 Keccak\n- **强安全性**：128 位安全强度\n- **灵活**：适合需要可调输出长度的场景\n\n**常见用途：**\n- 可变长度的加密摘要\n- 密钥派生与协议哈希\n- 校验和与数据完整性"
  },
  "zh-CN": {
    "what-is-shake128": "什么是 SHAKE128 (FIPS 202)？",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) 是 SHA-3 家族中的可扩展输出函数（XOF）。与固定长度哈希不同，SHAKE128 可以输出任意位数；其安全强度为 128 位。它由 NIST 在 FIPS 202 中标准化，并基于 Keccak 海绵结构。\n\n**主要特征：**\n- **XOF 输出**：可生成可变长度摘要\n- **确定性**：相同输入与长度产生相同输出\n- **海绵结构**：基于 Keccak\n- **强安全性**：128 位安全强度\n- **灵活**：适合需要可调输出长度的场景\n\n**常见用途：**\n- 可变长度的加密摘要\n- 密钥派生与协议哈希\n- 校验和与数据完整性"
  },
  "zh-TW": {
    "what-is-shake128": "什麼是 SHAKE128 (FIPS 202)？",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) 是 SHA-3 家族中的可擴展輸出函數（XOF）。與固定長度雜湊不同，SHAKE128 可以輸出任意位數；其安全強度為 128 位元。它由 NIST 在 FIPS 202 中標準化，並基於 Keccak 海綿結構。\n\n**主要特徵：**\n- **XOF 輸出**：可產生可變長度摘要\n- **確定性**：相同輸入與長度產生相同輸出\n- **海綿結構**：基於 Keccak\n- **強安全性**：128 位元安全強度\n- **彈性**：適合需要可調輸出長度的場景\n\n**常見用途：**\n- 可變長度的加密摘要\n- 金鑰派生與協定雜湊\n- 校驗和與資料完整性"
  },
  "zh-HK": {
    "what-is-shake128": "什麼是 SHAKE128 (FIPS 202)？",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) 是 SHA-3 家族中的可擴展輸出函數（XOF）。與固定長度雜湊不同，SHAKE128 可以輸出任意位數；其安全強度為 128 位元。它由 NIST 在 FIPS 202 中標準化，並基於 Keccak 海綿結構。\n\n**主要特徵：**\n- **XOF 輸出**：可產生可變長度摘要\n- **確定性**：相同輸入與長度產生相同輸出\n- **海綿結構**：基於 Keccak\n- **強安全性**：128 位元安全強度\n- **彈性**：適合需要可調輸出長度的場景\n\n**常見用途：**\n- 可變長度的加密摘要\n- 金鑰派生與協定雜湊\n- 校驗和與資料完整性"
  },
  "es": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "fr": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "de": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "it": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "ja": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "ko": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "ru": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "pt": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "ar": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "hi": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "tr": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "nl": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "sv": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "pl": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "vi": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "th": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "id": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "he": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "ms": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  },
  "no": {
    "what-is-shake128": "What is SHAKE128 (FIPS 202)?",
    "what-is-shake128-description-markdown": "SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE128 can output any number of bits; its security strength is 128 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.\n\n**Key characteristics:**\n- **XOF output**: Produce variable-length digests\n- **Deterministic**: Same input always yields the same output for the same length\n- **Sponge construction**: Built on Keccak\n- **Strong security**: 128-bit security strength\n- **Flexible**: Useful when you need more (or less) output than fixed-size hashes\n\n**Common uses:**\n- Variable-length cryptographic digests\n- Key-derivation and protocol hashing\n- Checksums and data integrity workflows"
  }
}
</i18n>
