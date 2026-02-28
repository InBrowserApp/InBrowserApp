<template>
  <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:5" responsive="screen">
    <n-gi span="1 s:2 m:3 l:5">
      <URLAuthorityInputs
        v-model:protocol="protocol"
        v-model:username="username"
        v-model:password="password"
        v-model:hostname="hostname"
        v-model:port-number="portNumber"
      />
    </n-gi>
    <n-gi span="1 s:2 m:3 l:5">
      <URLPathInputs v-model:path="path" v-model:query-string="queryString" v-model:hash="hash" />
    </n-gi>
  </n-grid>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { NGrid, NGi } from 'naive-ui'
import { syncRef } from '@vueuse/core'
import URLAuthorityInputs from './URLAuthorityInputs.vue'
import URLPathInputs from './URLPathInputs.vue'

const url = defineModel<string>('url', { required: true })
const urlObject = computed<URL>(() => {
  try {
    return new URL(url.value)
  } catch {
    return new URL('')
  }
})

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
  url.value = newURL.toString()
})
watch(username, (newUsername) => {
  const newURL = new URL(url.value)
  newURL.username = newUsername
  url.value = newURL.toString()
})
watch(password, (newPassword) => {
  const newURL = new URL(url.value)
  newURL.password = newPassword
  url.value = newURL.toString()
})
watch(hostname, (newHostname) => {
  const newURL = new URL(url.value)
  newURL.hostname = newHostname
  url.value = newURL.toString()
})
watch(port, (newPort) => {
  const newURL = new URL(url.value)
  newURL.port = newPort
  url.value = newURL.toString()
})
watch(path, (newPath) => {
  const newURL = new URL(url.value)
  newURL.pathname = newPath
  url.value = newURL.toString()
})
watch(hash, (newHash) => {
  const newURL = new URL(url.value)
  newURL.hash = newHash
  url.value = newURL.toString()
})
watch(queryString, (newQueryString) => {
  const newURL = new URL(url.value)
  newURL.search = newQueryString
  url.value = newURL.toString()
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
