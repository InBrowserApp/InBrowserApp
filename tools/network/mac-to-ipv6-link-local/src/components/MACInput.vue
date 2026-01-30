<template>
  <MACAddressInputFormItem v-model:address="mac" />
  <n-form-item :label="t('networkInterface')">
    <n-input v-model:value="networkInterface" placeholder="eth0" />
  </n-form-item>
</template>

<script setup lang="ts">
import { NInput, NFormItem } from 'naive-ui'
import { ref, watch } from 'vue'
import { isValidMacAddress } from '@utils/mac-address'
import { MACAddressInputFormItem } from '@shared/ui/domain/mac-address'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  mac: string
  networkInterface: string
}>()

const emit = defineEmits<{
  'update:mac': [string]
  'update:networkInterface': [string]
}>()

const { t } = useI18n()

const mac = ref(props.mac)
const networkInterface = ref(props.networkInterface)
watch(mac, (value: string) => {
  if (isValidMacAddress(mac.value)) {
    emit('update:mac', value)
  } else {
    emit('update:mac', '')
  }
})

watch(networkInterface, (value: string) => {
  emit('update:networkInterface', value)
})
</script>

<i18n lang="json">
{
  "en": {
    "networkInterface": "Network Interface"
  },
  "zh": {
    "networkInterface": "网络接口"
  },
  "zh-CN": {
    "networkInterface": "网络接口"
  },
  "zh-TW": {
    "networkInterface": "網路介面"
  },
  "zh-HK": {
    "networkInterface": "網絡介面"
  },
  "es": {
    "networkInterface": "Interfaz de Red"
  },
  "fr": {
    "networkInterface": "Interface Réseau"
  },
  "de": {
    "networkInterface": "Netzwerkschnittstelle"
  },
  "it": {
    "networkInterface": "Interfaccia di Rete"
  },
  "ja": {
    "networkInterface": "ネットワークインターフェース"
  },
  "ko": {
    "networkInterface": "네트워크 인터페이스"
  },
  "ru": {
    "networkInterface": "Сетевой интерфейс"
  },
  "pt": {
    "networkInterface": "Interface de Rede"
  },
  "ar": {
    "networkInterface": "واجهة الشبكة"
  },
  "hi": {
    "networkInterface": "नेटवर्क इंटरफेस"
  },
  "tr": {
    "networkInterface": "Ağ Arayüzü"
  },
  "nl": {
    "networkInterface": "Netwerkinterface"
  },
  "sv": {
    "networkInterface": "Nätverksgränssnitt"
  },
  "pl": {
    "networkInterface": "Interfejs sieciowy"
  },
  "vi": {
    "networkInterface": "Giao diện mạng"
  },
  "th": {
    "networkInterface": "อินเทอร์เฟซเครือข่าย"
  },
  "id": {
    "networkInterface": "Antarmuka Jaringan"
  },
  "he": {
    "networkInterface": "ממשק רשת"
  },
  "ms": {
    "networkInterface": "Antara Muka Rangkaian"
  },
  "no": {
    "networkInterface": "Nettverksgrensesnitt"
  }
}
</i18n>
