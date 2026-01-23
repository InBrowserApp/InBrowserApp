<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSectionHeader>
      {{ t('blake3-config') }}
    </ToolSectionHeader>
    <ToolSection>
      <n-form-item :label="t('output-length')">
        <n-slider v-model:value="length" :min="8" :max="256" :step="8" :marks="marks" />
      </n-form-item>
      <n-form-item :label="t('blake3-key-base64')">
        <n-input v-model:value="key" :placeholder="t('blake3-key-placeholder')" />
      </n-form-item>
    </ToolSection>

    <HashTextOrFileTemplate :hash="hashFunction" />
    <WhatIsBlake3 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { HashTextOrFileTemplate } from '@tools/hash-text-or-file-template'
import WhatIsBlake3 from './WhatIsBlake3.vue'
import loadBlake3 from 'blake3-wasm/browser-async'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NSlider, NInput, NFormItem } from 'naive-ui'

const { t } = useI18n()
const length = ref<number>(256)
const key = ref<string>('')
const marks = {
  8: '8',
  16: '16',
  32: '32',
  64: '64',
  128: '128',
  256: '256',
}

// Let blake3-wasm resolve its default wasm URL; typings require an explicit argument.
const blake3ModulePromise = loadBlake3(undefined as unknown as string)

const hashFunction = computed(() => {
  return async (blob: Blob): Promise<ArrayBuffer> => {
    const outputLength = Math.max(1, Math.floor(length.value / 8))
    const inputKey = key.value.trim()
    const { createHash, createKeyed } = await blake3ModulePromise

    const keyBytes =
      inputKey === '' ? undefined : Uint8Array.from(atob(inputKey), (c) => c.charCodeAt(0))

    const stream = blob.stream()
    const reader = stream.getReader()
    const hasher = keyBytes && keyBytes.length === 32 ? createKeyed(keyBytes) : createHash()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        hasher.update(value)
      }
    } finally {
      reader.releaseLock()
    }

    const hashBytes = hasher.digest({ length: outputLength })
    return hashBytes.buffer.slice(hashBytes.byteOffset, hashBytes.byteOffset + hashBytes.byteLength)
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "blake3-config": "BLAKE3 Configuration",
    "output-length": "Output Length",
    "blake3-key-base64": "BLAKE3 Key (Base64)",
    "blake3-key-placeholder": "Optional 32-byte key for keyed hashing (Base64 encoded)"
  },
  "zh": {
    "blake3-config": "BLAKE3 配置",
    "output-length": "输出长度",
    "blake3-key-base64": "BLAKE3 密钥（Base64）",
    "blake3-key-placeholder": "用于带密钥哈希的可选 32 字节密钥（Base64 编码）"
  },
  "zh-CN": {
    "blake3-config": "BLAKE3 配置",
    "output-length": "输出长度",
    "blake3-key-base64": "BLAKE3 密钥（Base64）",
    "blake3-key-placeholder": "用于带密钥哈希的可选 32 字节密钥（Base64 编码）"
  },
  "zh-TW": {
    "blake3-config": "BLAKE3 設定",
    "output-length": "輸出長度",
    "blake3-key-base64": "BLAKE3 金鑰（Base64）",
    "blake3-key-placeholder": "用於帶金鑰雜湊的可選 32 位元組金鑰（Base64 編碼）"
  },
  "zh-HK": {
    "blake3-config": "BLAKE3 設定",
    "output-length": "輸出長度",
    "blake3-key-base64": "BLAKE3 金鑰（Base64）",
    "blake3-key-placeholder": "用於帶金鑰雜湊的可選 32 位元組金鑰（Base64 編碼）"
  },
  "es": {
    "blake3-config": "Configuración BLAKE3",
    "output-length": "Longitud de Salida",
    "blake3-key-base64": "Clave BLAKE3 (Base64)",
    "blake3-key-placeholder": "Clave opcional de 32 bytes para hash con clave (codificada en Base64)"
  },
  "fr": {
    "blake3-config": "Configuration BLAKE3",
    "output-length": "Longueur de Sortie",
    "blake3-key-base64": "Clé BLAKE3 (Base64)",
    "blake3-key-placeholder": "Clé optionnelle de 32 octets pour le hachage avec clé (encodée en Base64)"
  },
  "de": {
    "blake3-config": "BLAKE3-Konfiguration",
    "output-length": "Ausgabelänge",
    "blake3-key-base64": "BLAKE3-Schlüssel (Base64)",
    "blake3-key-placeholder": "Optionaler 32-Byte-Schlüssel für Schlüssel-Hashing (Base64-kodiert)"
  },
  "it": {
    "blake3-config": "Configurazione BLAKE3",
    "output-length": "Lunghezza di Output",
    "blake3-key-base64": "Chiave BLAKE3 (Base64)",
    "blake3-key-placeholder": "Chiave opzionale di 32 byte per hash con chiave (codificata in Base64)"
  },
  "ja": {
    "blake3-config": "BLAKE3 設定",
    "output-length": "出力長",
    "blake3-key-base64": "BLAKE3キー（Base64）",
    "blake3-key-placeholder": "キー付きハッシュ用のオプションの32バイトキー（Base64エンコード）"
  },
  "ko": {
    "blake3-config": "BLAKE3 구성",
    "output-length": "출력 길이",
    "blake3-key-base64": "BLAKE3 키 (Base64)",
    "blake3-key-placeholder": "키 해싱을 위한 선택적 32바이트 키 (Base64 인코딩)"
  },
  "ru": {
    "blake3-config": "Конфигурация BLAKE3",
    "output-length": "Длина Вывода",
    "blake3-key-base64": "Ключ BLAKE3 (Base64)",
    "blake3-key-placeholder": "Дополнительный ключ длиной 32 байта для хеширования с ключом (кодировка Base64)"
  },
  "pt": {
    "blake3-config": "Configuração BLAKE3",
    "output-length": "Comprimento de Saída",
    "blake3-key-base64": "Chave BLAKE3 (Base64)",
    "blake3-key-placeholder": "Chave opcional de 32 bytes para hash com chave (codificada em Base64)"
  },
  "ar": {
    "blake3-config": "تكوين BLAKE3",
    "output-length": "طول الإخراج",
    "blake3-key-base64": "مفتاح BLAKE3 (Base64)",
    "blake3-key-placeholder": "مفتاح اختياري بطول 32 بايت للهاش بالمفتاح (مُرمز بـ Base64)"
  },
  "hi": {
    "blake3-config": "BLAKE3 कॉन्फ़िगरेशन",
    "output-length": "आउटपुट लंबाई",
    "blake3-key-base64": "BLAKE3 की (Base64)",
    "blake3-key-placeholder": "की हैशिंग के लिए वैकल्पिक 32-बाइट की (Base64 एन्कोडेड)"
  },
  "tr": {
    "blake3-config": "BLAKE3 Yapılandırması",
    "output-length": "Çıktı Uzunluğu",
    "blake3-key-base64": "BLAKE3 Anahtarı (Base64)",
    "blake3-key-placeholder": "Anahtarlı hash için isteğe bağlı 32 bayt anahtar (Base64 kodlu)"
  },
  "nl": {
    "blake3-config": "BLAKE3 Configuratie",
    "output-length": "Uitvoerlengte",
    "blake3-key-base64": "BLAKE3 Sleutel (Base64)",
    "blake3-key-placeholder": "Optionele sleutel van 32 bytes voor sleutel-hashing (Base64 gecodeerd)"
  },
  "sv": {
    "blake3-config": "BLAKE3 Konfiguration",
    "output-length": "Utdatalängd",
    "blake3-key-base64": "BLAKE3 Nyckel (Base64)",
    "blake3-key-placeholder": "Valfri 32-byte-nyckel för nyckel-hashing (Base64-kodad)"
  },
  "pl": {
    "blake3-config": "Konfiguracja BLAKE3",
    "output-length": "Długość Wyjścia",
    "blake3-key-base64": "Klucz BLAKE3 (Base64)",
    "blake3-key-placeholder": "Opcjonalny 32-bajtowy klucz do hashowania z kluczem (zakodowany w Base64)"
  },
  "vi": {
    "blake3-config": "Cấu hình BLAKE3",
    "output-length": "Độ Dài Đầu Ra",
    "blake3-key-base64": "Khóa BLAKE3 (Base64)",
    "blake3-key-placeholder": "Khóa tùy chọn 32 byte cho băm có khóa (mã hóa Base64)"
  },
  "th": {
    "blake3-config": "การกำหนดค่า BLAKE3",
    "output-length": "ความยาวเอาต์พุต",
    "blake3-key-base64": "กุญแจ BLAKE3 (Base64)",
    "blake3-key-placeholder": "กุญแจเสริมขนาด 32 ไบต์สำหรับการแฮชด้วยกุญแจ (เข้ารหัส Base64)"
  },
  "id": {
    "blake3-config": "Konfigurasi BLAKE3",
    "output-length": "Panjang Output",
    "blake3-key-base64": "Kunci BLAKE3 (Base64)",
    "blake3-key-placeholder": "Kunci opsional 32 byte untuk hashing berkey (dikodekan Base64)"
  },
  "he": {
    "blake3-config": "תצורת BLAKE3",
    "output-length": "אורך פלט",
    "blake3-key-base64": "מפתח BLAKE3 (Base64)",
    "blake3-key-placeholder": "מפתח אופציונלי של 32 בתים עבור גיבוב עם מפתח (מקודד Base64)"
  },
  "ms": {
    "blake3-config": "Konfigurasi BLAKE3",
    "output-length": "Panjang Output",
    "blake3-key-base64": "Kunci BLAKE3 (Base64)",
    "blake3-key-placeholder": "Kunci pilihan 32 bait untuk hashing berkunci (dikodkan Base64)"
  },
  "no": {
    "blake3-config": "BLAKE3 Konfigurasjon",
    "output-length": "Utdatalengde",
    "blake3-key-base64": "BLAKE3 Nøkkel (Base64)",
    "blake3-key-placeholder": "Valgfri 32-byte-nøkkel for nøkkel-hashing (Base64-kodet)"
  }
}
</i18n>
