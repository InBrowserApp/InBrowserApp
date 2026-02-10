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
    "what-is-argon2": "什么是 Argon2？",
    "what-is-argon2-description-markdown": "Argon2 是一种现代密码哈希算法，专门用于抵抗 GPU 和 ASIC 的暴力破解。它支持内存硬计算、可配置迭代次数和并行度，适合安全地存储密码。\\n\\n**要点：**\\n- 大多数场景默认使用 **Argon2id**\\n- 仅存储编码后的哈希字符串，不要存储明文密码\\n- 根据可接受的登录延迟调优内存和迭代参数\\n- 每个密码使用唯一且随机的盐值\\n- 可选使用服务端密钥（pepper）增强保护"
  },
  "zh-CN": {
    "what-is-argon2": "什么是 Argon2？",
    "what-is-argon2-description-markdown": "Argon2 是一种现代密码哈希算法，专门用于抵抗 GPU 和 ASIC 的暴力破解。它支持内存硬计算、可配置迭代次数和并行度，适合安全地存储密码。\\n\\n**要点：**\\n- 大多数场景默认使用 **Argon2id**\\n- 仅存储编码后的哈希字符串，不要存储明文密码\\n- 根据可接受的登录延迟调优内存和迭代参数\\n- 每个密码使用唯一且随机的盐值\\n- 可选使用服务端密钥（pepper）增强保护"
  },
  "zh-TW": {
    "what-is-argon2": "什麼是 Argon2？",
    "what-is-argon2-description-markdown": "Argon2 是一種現代密碼雜湊演算法，專門用於抵抗 GPU 與 ASIC 的暴力破解。它支援記憶體硬化計算、可設定的迭代次數與平行度，適合安全儲存密碼。\\n\\n**重點：**\\n- 多數情境預設使用 **Argon2id**\\n- 只儲存編碼後的雜湊字串，不要儲存明文密碼\\n- 依可接受的登入延遲調整記憶體與迭代參數\\n- 每組密碼都使用唯一且隨機的鹽值\\n- 可選擇使用伺服器端密鑰（pepper）提升保護"
  },
  "zh-HK": {
    "what-is-argon2": "什麼是 Argon2？",
    "what-is-argon2-description-markdown": "Argon2 是一種現代密碼雜湊演算法，專門用於抵抗 GPU 與 ASIC 的暴力破解。它支援記憶體硬化計算、可設定的迭代次數與平行度，適合安全儲存密碼。\\n\\n**重點：**\\n- 多數情境預設使用 **Argon2id**\\n- 只儲存編碼後的雜湊字串，不要儲存明文密碼\\n- 依可接受的登入延遲調整記憶體與迭代參數\\n- 每組密碼都使用唯一且隨機的鹽值\\n- 可選擇使用伺服器端密鑰（pepper）提升保護"
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
