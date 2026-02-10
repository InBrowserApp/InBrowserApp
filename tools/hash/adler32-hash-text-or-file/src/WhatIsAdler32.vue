<template>
  <DescriptionMarkdown
    :title="t('what-is-adler32')"
    :description="t('what-is-adler32-description-markdown')"
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
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "zh": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "zh-CN": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "zh-TW": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "zh-HK": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "es": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "fr": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "de": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "it": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "ja": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "ko": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "ru": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "pt": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "ar": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "hi": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "tr": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "nl": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "sv": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "pl": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "vi": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "th": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "id": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "he": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "ms": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  },
  "no": {
    "what-is-adler32": "What is Adler-32?",
    "what-is-adler32-description-markdown": "Adler-32 is a fast checksum algorithm that produces a 32-bit (4-byte) value, typically shown as 8 hexadecimal characters. It was designed for quick error detection and is often used where speed matters.\n\n**Key characteristics:**\n- **Very fast**: Optimized for performance on text and binary data\n- **Deterministic**: The same input always returns the same checksum\n- **Fixed output size**: Always 32-bit output\n- **Error detection focused**: Useful for accidental corruption checks\n- **Not cryptographic**: Not suitable for security, password hashing, or signatures\n\n**Common uses:**\n- File transfer integrity checks\n- Lightweight data corruption detection\n- Compression and archival workflows\n- Internal data consistency checks"
  }
}
</i18n>
