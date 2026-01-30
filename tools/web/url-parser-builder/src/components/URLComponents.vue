<template>
  <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:5" responsive="screen">
    <URLAuthorityInputs
      v-model:protocol="protocol"
      v-model:username="username"
      v-model:password="password"
      v-model:hostname="hostname"
      v-model:port-number="portNumber"
    />
    <URLPathInputs v-model:path="path" v-model:query-string="queryString" v-model:hash="hash" />
  </n-grid>
</template>

<script lang="ts" setup>
import { computed, ref, toRef, watch } from 'vue'
import { NGrid } from 'naive-ui'
import { syncRef } from '@vueuse/core'
import URLAuthorityInputs from './URLAuthorityInputs.vue'
import URLPathInputs from './URLPathInputs.vue'

const props = defineProps<{
  url: string
}>()
const url = toRef(props, 'url')
const urlObject = computed<URL>(() => {
  try {
    return new URL(url.value)
  } catch {
    return new URL('')
  }
})

const emit = defineEmits<{
  (e: 'update:url', value: string): void
}>()

const protocol = ref(urlObject.value.protocol.replace(':', ''))
const username = ref(urlObject.value.username)
const password = ref(urlObject.value.password)
const hostname = ref(urlObject.value.hostname)
const port = ref(urlObject.value.port)
const portNumber = ref(port.value ? parseInt(port.value) : null)

syncRef(port, portNumber, {
  transform: {
    ltr: (left) => (left ? parseInt(left) : null),
    rtl: (right) => (right ? right.toString() : ''),
  },
})

const path = ref(decodeURIComponent(urlObject.value.pathname))
const hash = ref(decodeURIComponent(urlObject.value.hash))
const queryString = ref(decodeURIComponent(urlObject.value.search))

watch(urlObject, (newURL) => {
  protocol.value = newURL.protocol
  username.value = newURL.username
  password.value = newURL.password
  hostname.value = newURL.hostname
  port.value = newURL.port
  path.value = decodeURIComponent(newURL.pathname)
  hash.value = decodeURIComponent(newURL.hash)
  queryString.value = decodeURIComponent(newURL.search)
})

watch(protocol, (newProtocol) => {
  const newURL = new URL(url.value)
  newURL.protocol = newProtocol
  emit('update:url', newURL.toString())
})
watch(username, (newUsername) => {
  const newURL = new URL(url.value)
  newURL.username = newUsername
  emit('update:url', newURL.toString())
})
watch(password, (newPassword) => {
  const newURL = new URL(url.value)
  newURL.password = newPassword
  emit('update:url', newURL.toString())
})
watch(hostname, (newHostname) => {
  const newURL = new URL(url.value)
  newURL.hostname = newHostname
  emit('update:url', newURL.toString())
})
watch(port, (newPort) => {
  const newURL = new URL(url.value)
  newURL.port = newPort
  emit('update:url', newURL.toString())
})
watch(path, (newPath) => {
  const newURL = new URL(url.value)
  newURL.pathname = newPath
  emit('update:url', newURL.toString())
})
watch(hash, (newHash) => {
  const newURL = new URL(url.value)
  newURL.hash = newHash
  emit('update:url', newURL.toString())
})
watch(queryString, (newQueryString) => {
  const newURL = new URL(url.value)
  newURL.search = newQueryString
  emit('update:url', newURL.toString())
})
</script>

<i18n lang="json">
{
  "en": {},
  "zh": {},
  "zh-CN": {},
  "zh-TW": {},
  "zh-HK": {},
  "es": {},
  "fr": {},
  "de": {},
  "it": {},
  "ja": {},
  "ko": {},
  "ru": {},
  "pt": {},
  "ar": {},
  "hi": {},
  "tr": {},
  "nl": {},
  "sv": {},
  "pl": {},
  "vi": {},
  "th": {},
  "id": {},
  "he": {},
  "ms": {},
  "no": {}
}
</i18n>
