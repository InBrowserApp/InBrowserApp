<template>
  <DescriptionMarkdown
    :title="t('what-is-xxhash')"
    :description="t('what-is-xxhash-description-markdown')"
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
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "zh": {
    "what-is-xxhash": "什么是 xxHash (XXH3 128)？",
    "what-is-xxhash-description-markdown": "XXH3 是现代的 xxHash 算法，专为极高速度和优秀分布性而设计。XXH3 128 输出 128 位（16 字节）哈希值，通常显示为 32 个字符的十六进制字符串。它是非加密哈希，并支持可选种子以实现可复现的哈希结果。\n\n**主要特征：**\n- **极快速度**：针对大数据输入优化\n- **确定性**：相同输入与种子产生相同哈希\n- **非加密**：不适用于安全用途\n- **良好分布**：适合哈希表与索引\n- **可加种子**：可选种子用于区分哈希输出\n\n**常见用途：**\n- 哈希表和数据结构\n- 文件完整性校验（非安全）\n- 数据去重与分块\n- 缓存键与数据库索引\n- 高吞吐数据流水线"
  },
  "zh-CN": {
    "what-is-xxhash": "什么是 xxHash (XXH3 128)？",
    "what-is-xxhash-description-markdown": "XXH3 是现代的 xxHash 算法，专为极高速度和优秀分布性而设计。XXH3 128 输出 128 位（16 字节）哈希值，通常显示为 32 个字符的十六进制字符串。它是非加密哈希，并支持可选种子以实现可复现的哈希结果。\n\n**主要特征：**\n- **极快速度**：针对大数据输入优化\n- **确定性**：相同输入与种子产生相同哈希\n- **非加密**：不适用于安全用途\n- **良好分布**：适合哈希表与索引\n- **可加种子**：可选种子用于区分哈希输出\n\n**常见用途：**\n- 哈希表和数据结构\n- 文件完整性校验（非安全）\n- 数据去重与分块\n- 缓存键与数据库索引\n- 高吞吐数据流水线"
  },
  "zh-TW": {
    "what-is-xxhash": "什麼是 xxHash (XXH3 128)？",
    "what-is-xxhash-description-markdown": "XXH3 是現代的 xxHash 演算法，專為極高速度與優秀分佈性而設計。XXH3 128 輸出 128 位元（16 位元組）雜湊值，通常顯示為 32 個字元的十六進位字串。它是非加密雜湊，並支援可選種子以產生可重現的雜湊結果。\n\n**主要特徵：**\n- **極快速度**：針對大型輸入最佳化\n- **確定性**：相同輸入與種子產生相同雜湊\n- **非加密**：不適用於安全用途\n- **良好分佈**：適合雜湊表與索引\n- **可加種子**：可選種子用於區分雜湊輸出\n\n**常見用途：**\n- 雜湊表與資料結構\n- 檔案完整性檢查（非安全）\n- 資料去重與分塊\n- 快取鍵與資料庫索引\n- 高吞吐資料流程"
  },
  "zh-HK": {
    "what-is-xxhash": "什麼是 xxHash (XXH3 128)？",
    "what-is-xxhash-description-markdown": "XXH3 是現代的 xxHash 演算法，專為極高速度與優秀分佈性而設計。XXH3 128 輸出 128 位元（16 位元組）雜湊值，通常顯示為 32 個字元的十六進位字串。它是非加密雜湊，並支援可選種子以產生可重現的雜湊結果。\n\n**主要特徵：**\n- **極快速度**：針對大型輸入最佳化\n- **確定性**：相同輸入與種子產生相同雜湊\n- **非加密**：不適用於安全用途\n- **良好分佈**：適合雜湊表與索引\n- **可加種子**：可選種子用於區分雜湊輸出\n\n**常見用途：**\n- 雜湊表與資料結構\n- 檔案完整性檢查（非安全）\n- 資料去重與分塊\n- 快取鍵與資料庫索引\n- 高吞吐資料流程"
  },
  "es": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "fr": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "de": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "it": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "ja": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "ko": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "ru": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "pt": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "ar": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "hi": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "tr": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "nl": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "sv": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "pl": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "vi": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "th": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "id": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "he": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "ms": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  },
  "no": {
    "what-is-xxhash": "What is xxHash (XXH3 128)?",
    "what-is-xxhash-description-markdown": "XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.\n\n**Key characteristics:**\n- **Extremely fast**: Optimized for performance on large inputs\n- **Deterministic**: The same input and seed always produce the same hash\n- **Non-cryptographic**: Not suitable for security purposes\n- **Good distribution**: Great for hash tables and indexing\n- **Seeded**: Optional seed to diversify hash outputs\n\n**Common uses:**\n- Hash tables and data structures\n- File integrity checks (non-security)\n- Data deduplication and chunking\n- Cache keys and database indexing\n- High-throughput data pipelines"
  }
}
</i18n>
