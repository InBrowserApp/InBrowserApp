<template>
  <n-p>
    <span>{{ t('cidrsCount', { count: cidrs.length }) }}</span>
    <n-ul>
      <n-li v-for="cidr in cidrs" :key="cidr">{{ cidr }}</n-li>
    </n-ul>
  </n-p>
</template>

<script setup lang="ts">
import { Cidr, IpAddress, IpRange } from 'cidr-calc'
import { computed } from 'vue'
import { NUl, NLi, NP } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  ipRange: [string, string]
}>()

const { t } = useI18n()

const cidrs = computed(() => {
  const ipRange = props.ipRange
  const ipRange_ = new IpRange(IpAddress.of(ipRange[0]), IpAddress.of(ipRange[1]))

  const cidrs = ipRange_.toCidrs()
  const cidrsString = cidrs.map((cidr: Cidr) => cidr.toString())

  return cidrsString
})
</script>

<i18n lang="json">
{
  "en": {
    "cidrsCount": "{count} CIDRs:"
  },
  "zh": {
    "cidrsCount": "{count} 个 CIDR："
  },
  "zh-CN": {
    "cidrsCount": "{count} 个 CIDR："
  },
  "zh-TW": {
    "cidrsCount": "{count} 個 CIDR："
  },
  "zh-HK": {
    "cidrsCount": "{count} 個 CIDR："
  },
  "es": {
    "cidrsCount": "{count} CIDRs:"
  },
  "fr": {
    "cidrsCount": "{count} CIDRs :"
  },
  "de": {
    "cidrsCount": "{count} CIDRs:"
  },
  "it": {
    "cidrsCount": "{count} CIDR:"
  },
  "ja": {
    "cidrsCount": "{count} 個の CIDR："
  },
  "ko": {
    "cidrsCount": "{count}개의 CIDR:"
  },
  "ru": {
    "cidrsCount": "{count} CIDR:"
  },
  "pt": {
    "cidrsCount": "{count} CIDRs:"
  },
  "ar": {
    "cidrsCount": "{count} CIDR:"
  },
  "hi": {
    "cidrsCount": "{count} CIDR:"
  },
  "tr": {
    "cidrsCount": "{count} CIDR:"
  },
  "nl": {
    "cidrsCount": "{count} CIDR's:"
  },
  "sv": {
    "cidrsCount": "{count} CIDR:"
  },
  "pl": {
    "cidrsCount": "{count} CIDR:"
  },
  "vi": {
    "cidrsCount": "{count} CIDR:"
  },
  "th": {
    "cidrsCount": "{count} CIDR:"
  },
  "id": {
    "cidrsCount": "{count} CIDR:"
  },
  "he": {
    "cidrsCount": "{count} CIDR:"
  },
  "ms": {
    "cidrsCount": "{count} CIDR:"
  },
  "no": {
    "cidrsCount": "{count} CIDR:"
  }
}
</i18n>
