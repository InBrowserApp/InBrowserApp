<template>
  <n-descriptions
    v-if="parsed !== undefined"
    label-placement="left"
    bordered
    :column="1"
    content-style="width: 100%"
    label-style="white-space: nowrap"
  >
    <n-descriptions-item :label="t('ipVersion')"> IPv{{ parsed.version }} </n-descriptions-item>
    <n-descriptions-item :label="t('startIP')">
      <CopyToClipboardTooltip v-if="startIP" :content="startIP" #="{ copy }">
        <span class="cursor-pointer" @click="copy">
          {{ startIP }}
        </span>
      </CopyToClipboardTooltip>
    </n-descriptions-item>
    <n-descriptions-item :label="t('startIPInteger')">
      <CopyToClipboardTooltip v-if="startIPInt" :content="startIPInt" #="{ copy }">
        <span class="cursor-pointer" @click="copy">
          {{ startIPInt }}
        </span>
      </CopyToClipboardTooltip>
    </n-descriptions-item>
    <n-descriptions-item :label="t('endIP')">
      <CopyToClipboardTooltip v-if="endIP" :content="endIP" #="{ copy }">
        <span class="cursor-pointer" @click="copy">
          {{ endIP }}
        </span>
      </CopyToClipboardTooltip>
    </n-descriptions-item>
    <n-descriptions-item :label="t('endIPInteger')">
      <CopyToClipboardTooltip v-if="endIPInt" :content="endIPInt" #="{ copy }">
        <span class="cursor-pointer" @click="copy">
          {{ endIPInt }}
        </span>
      </CopyToClipboardTooltip>
    </n-descriptions-item>
    <n-descriptions-item :label="t('numberOfIPs')">
      <CopyToClipboardTooltip v-if="IPSize" :content="IPSize" #="{ copy }">
        <span class="cursor-pointer" @click="copy">
          {{ IPSize }}
        </span>
      </CopyToClipboardTooltip>
    </n-descriptions-item>

    <n-descriptions-item v-if="netmask" :label="t('netmask')">
      <CopyToClipboardTooltip :content="netmask" #="{ copy }">
        <span class="cursor-pointer" @click="copy">
          {{ netmask }}
        </span>
      </CopyToClipboardTooltip>
    </n-descriptions-item>
  </n-descriptions>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { parseCidr } from 'cidr-tools'
import { NDescriptions, NDescriptionsItem } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardTooltip } from '@shared/ui/base'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { stringifyIp } from 'ip-bigint'

const props = defineProps<{
  cidr: string | undefined
}>()

const { t } = useI18n()

const parsed = computed(() => {
  if (props.cidr === undefined) {
    return undefined
  }

  try {
    return parseCidr(props.cidr)
  } catch (e: unknown) {
    console.error(e)
    return undefined
  }
})

const startIP = computed(() => {
  if (parsed.value === undefined) {
    return undefined
  }

  return stringifyIp({
    number: parsed.value.start,
    version: parsed.value.version,
    ipv4mapped: undefined,
    scopeid: undefined,
  })
})

const startIPInt = computed(() => {
  if (parsed.value === undefined) {
    return undefined
  }

  return parsed.value.start.toString()
})

const endIP = computed(() => {
  if (parsed.value === undefined) {
    return undefined
  }

  return stringifyIp({
    number: parsed.value.end,
    version: parsed.value.version,
    ipv4mapped: undefined,
    scopeid: undefined,
  })
})

const endIPInt = computed(() => {
  if (parsed.value === undefined) {
    return undefined
  }

  return parsed.value.end.toString()
})

const IPSize = computed(() => {
  if (parsed.value === undefined) {
    return undefined
  }

  const size = parsed.value.end - parsed.value.start + BigInt(1)
  const sizeString = size.toString()

  const fmt /*: BigIntToLocaleStringOptions */ = {
    notation: 'scientific',
    maximumFractionDigits: 0,
  } as const

  const sizeScientific = size.toLocaleString('en-US', fmt)

  return `${sizeString} (${sizeScientific})`
})

const netmask = computed(() => {
  if (parsed.value === undefined) {
    return undefined
  }

  const prefix = parsed.value.prefix
  if (parsed.value.version === 4) {
    const cidr = `255.255.255.255/${prefix}`
    const result = parseCidr(cidr)
    return stringifyIp({
      number: result.start,
      version: result.version,
      ipv4mapped: undefined,
      scopeid: undefined,
    })
  }

  return undefined
})
</script>

<style scoped>
.link {
  color: inherit;
  text-decoration: inherit;
}

.link:hover {
  text-decoration: underline;
}

.cursor-pointer {
  cursor: pointer;
}
</style>

<i18n lang="json">
{
  "en": {
    "ipVersion": "IP Version",
    "startIP": "Start IP",
    "startIPInteger": "Start IP Integer",
    "endIP": "End IP",
    "endIPInteger": "End IP Integer",
    "numberOfIPs": "Number of IPs",
    "netmask": "Netmask"
  },
  "zh": {
    "ipVersion": "IP 版本",
    "startIP": "起始 IP",
    "startIPInteger": "起始 IP 整数",
    "endIP": "结束 IP",
    "endIPInteger": "结束 IP 整数",
    "numberOfIPs": "IP 数量",
    "netmask": "子网掩码"
  },
  "zh-CN": {
    "ipVersion": "IP 版本",
    "startIP": "起始 IP",
    "startIPInteger": "起始 IP 整数",
    "endIP": "结束 IP",
    "endIPInteger": "结束 IP 整数",
    "numberOfIPs": "IP 数量",
    "netmask": "子网掩码"
  },
  "zh-TW": {
    "ipVersion": "IP 版本",
    "startIP": "起始 IP",
    "startIPInteger": "起始 IP 整數",
    "endIP": "結束 IP",
    "endIPInteger": "結束 IP 整數",
    "numberOfIPs": "IP 數量",
    "netmask": "子網路遮罩"
  },
  "zh-HK": {
    "ipVersion": "IP 版本",
    "startIP": "起始 IP",
    "startIPInteger": "起始 IP 整數",
    "endIP": "結束 IP",
    "endIPInteger": "結束 IP 整數",
    "numberOfIPs": "IP 數量",
    "netmask": "子網路遮罩"
  },
  "es": {
    "ipVersion": "Versión IP",
    "startIP": "IP inicial",
    "startIPInteger": "Entero IP inicial",
    "endIP": "IP final",
    "endIPInteger": "Entero IP final",
    "numberOfIPs": "Número de IPs",
    "netmask": "Máscara de red"
  },
  "fr": {
    "ipVersion": "Version IP",
    "startIP": "IP de début",
    "startIPInteger": "Entier IP de début",
    "endIP": "IP de fin",
    "endIPInteger": "Entier IP de fin",
    "numberOfIPs": "Nombre d'IPs",
    "netmask": "Masque de réseau"
  },
  "de": {
    "ipVersion": "IP-Version",
    "startIP": "Start-IP",
    "startIPInteger": "Start-IP-Ganzzahl",
    "endIP": "End-IP",
    "endIPInteger": "End-IP-Ganzzahl",
    "numberOfIPs": "Anzahl der IPs",
    "netmask": "Netzmaske"
  },
  "it": {
    "ipVersion": "Versione IP",
    "startIP": "IP iniziale",
    "startIPInteger": "Intero IP iniziale",
    "endIP": "IP finale",
    "endIPInteger": "Intero IP finale",
    "numberOfIPs": "Numero di IP",
    "netmask": "Maschera di rete"
  },
  "ja": {
    "ipVersion": "IP バージョン",
    "startIP": "開始 IP",
    "startIPInteger": "開始 IP 整数",
    "endIP": "終了 IP",
    "endIPInteger": "終了 IP 整数",
    "numberOfIPs": "IP 数",
    "netmask": "ネットマスク"
  },
  "ko": {
    "ipVersion": "IP 버전",
    "startIP": "시작 IP",
    "startIPInteger": "시작 IP 정수",
    "endIP": "끝 IP",
    "endIPInteger": "끝 IP 정수",
    "numberOfIPs": "IP 개수",
    "netmask": "넷마스크"
  },
  "ru": {
    "ipVersion": "Версия IP",
    "startIP": "Начальный IP",
    "startIPInteger": "Целое число начального IP",
    "endIP": "Конечный IP",
    "endIPInteger": "Целое число конечного IP",
    "numberOfIPs": "Количество IP",
    "netmask": "Маска сети"
  },
  "pt": {
    "ipVersion": "Versão IP",
    "startIP": "IP inicial",
    "startIPInteger": "Inteiro IP inicial",
    "endIP": "IP final",
    "endIPInteger": "Inteiro IP final",
    "numberOfIPs": "Número de IPs",
    "netmask": "Máscara de rede"
  },
  "ar": {
    "ipVersion": "إصدار IP",
    "startIP": "IP البداية",
    "startIPInteger": "عدد صحيح IP البداية",
    "endIP": "IP النهاية",
    "endIPInteger": "عدد صحيح IP النهاية",
    "numberOfIPs": "عدد عناوين IP",
    "netmask": "قناع الشبكة"
  },
  "hi": {
    "ipVersion": "IP संस्करण",
    "startIP": "प्रारंभिक IP",
    "startIPInteger": "प्रारंभिक IP पूर्णांक",
    "endIP": "अंतिम IP",
    "endIPInteger": "अंतिम IP पूर्णांक",
    "numberOfIPs": "IP की संख्या",
    "netmask": "नेटमास्क"
  },
  "tr": {
    "ipVersion": "IP Sürümü",
    "startIP": "Başlangıç IP",
    "startIPInteger": "Başlangıç IP Tamsayısı",
    "endIP": "Bitiş IP",
    "endIPInteger": "Bitiş IP Tamsayısı",
    "numberOfIPs": "IP Sayısı",
    "netmask": "Ağ Maskesi"
  },
  "nl": {
    "ipVersion": "IP-versie",
    "startIP": "Start-IP",
    "startIPInteger": "Start-IP geheel getal",
    "endIP": "Eind-IP",
    "endIPInteger": "Eind-IP geheel getal",
    "numberOfIPs": "Aantal IP's",
    "netmask": "Netmasker"
  },
  "sv": {
    "ipVersion": "IP-version",
    "startIP": "Start-IP",
    "startIPInteger": "Start-IP heltal",
    "endIP": "Slut-IP",
    "endIPInteger": "Slut-IP heltal",
    "numberOfIPs": "Antal IP:er",
    "netmask": "Nätmask"
  },
  "pl": {
    "ipVersion": "Wersja IP",
    "startIP": "Początkowy IP",
    "startIPInteger": "Liczba całkowita początkowego IP",
    "endIP": "Końcowy IP",
    "endIPInteger": "Liczba całkowita końcowego IP",
    "numberOfIPs": "Liczba IP",
    "netmask": "Maska sieci"
  },
  "vi": {
    "ipVersion": "Phiên bản IP",
    "startIP": "IP bắt đầu",
    "startIPInteger": "Số nguyên IP bắt đầu",
    "endIP": "IP kết thúc",
    "endIPInteger": "Số nguyên IP kết thúc",
    "numberOfIPs": "Số lượng IP",
    "netmask": "Mặt nạ mạng"
  },
  "th": {
    "ipVersion": "เวอร์ชัน IP",
    "startIP": "IP เริ่มต้น",
    "startIPInteger": "จำนวนเต็ม IP เริ่มต้น",
    "endIP": "IP สิ้นสุด",
    "endIPInteger": "จำนวนเต็ม IP สิ้นสุด",
    "numberOfIPs": "จำนวน IP",
    "netmask": "เน็ตมาสก์"
  },
  "id": {
    "ipVersion": "Versi IP",
    "startIP": "IP awal",
    "startIPInteger": "Integer IP awal",
    "endIP": "IP akhir",
    "endIPInteger": "Integer IP akhir",
    "numberOfIPs": "Jumlah IP",
    "netmask": "Netmask"
  },
  "he": {
    "ipVersion": "גרסת IP",
    "startIP": "IP התחלה",
    "startIPInteger": "מספר שלם IP התחלה",
    "endIP": "IP סיום",
    "endIPInteger": "מספר שלם IP סיום",
    "numberOfIPs": "מספר כתובות IP",
    "netmask": "מסכת רשת"
  },
  "ms": {
    "ipVersion": "Versi IP",
    "startIP": "IP mula",
    "startIPInteger": "Integer IP mula",
    "endIP": "IP akhir",
    "endIPInteger": "Integer IP akhir",
    "numberOfIPs": "Bilangan IP",
    "netmask": "Netmask"
  },
  "no": {
    "ipVersion": "IP-versjon",
    "startIP": "Start-IP",
    "startIPInteger": "Start-IP heltall",
    "endIP": "Slutt-IP",
    "endIPInteger": "Slutt-IP heltall",
    "numberOfIPs": "Antall IP-er",
    "netmask": "Nettmaske"
  }
}
</i18n>
