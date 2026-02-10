<template>
  <DescriptionMarkdown
    :title="t('what-is-argon2')"
    :description="t('what-is-argon2-description-markdown')"
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
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "zh": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "zh-CN": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "zh-TW": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "zh-HK": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "es": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "fr": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "de": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "it": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "ja": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "ko": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "ru": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "pt": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "ar": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "hi": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "tr": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "nl": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "sv": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "pl": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "vi": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "th": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "id": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "he": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "ms": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  },
  "no": {
    "what-is-argon2": "What is Argon2?",
    "what-is-argon2-description-markdown": "Argon2 is a modern password hashing algorithm designed to resist GPU and ASIC attacks. It supports memory-hard computation, configurable iterations, and parallelism, making it suitable for secure password storage.\\n\\n**Key points:**\\n- Use **Argon2id** by default for most applications\\n- Store only the encoded hash string and never plain passwords\\n- Tune memory and iterations based on acceptable login latency\\n- Use a unique random salt per password\\n- Optionally use a server-side secret (pepper) for extra protection"
  }
}
</i18n>
