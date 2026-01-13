<template>
  <n-space vertical :size="16">
    <n-tag size="small" type="info">
      {{ certificateEntry ? labels.certificate : labels.publicKey }}
    </n-tag>

    <section>
      <n-text strong class="section-title">{{ labels.overview }}</n-text>
      <n-descriptions label-placement="left" bordered :column="1">
        <n-descriptions-item v-if="certificateEntry" :label="labels.serialNumber">
          <FieldValue :value="certificateEntry.serialNumber" :empty-value="labels.notAvailable" />
        </n-descriptions-item>
        <n-descriptions-item v-if="certificateEntry" :label="labels.signatureAlgorithm">
          <FieldValue
            :value="certificateEntry.signatureAlgorithm"
            :empty-value="labels.notAvailable"
          />
        </n-descriptions-item>
        <n-descriptions-item :label="labels.keyAlgorithm">
          <FieldValue :value="keyAlgorithm" :empty-value="labels.notAvailable" />
        </n-descriptions-item>
        <n-descriptions-item :label="labels.keySize">
          <FieldValue :value="keySize" :empty-value="labels.notAvailable" :suffix="labels.bits" />
        </n-descriptions-item>
        <n-descriptions-item :label="labels.curve">
          <FieldValue :value="curve" :empty-value="labels.notAvailable" />
        </n-descriptions-item>
      </n-descriptions>
    </section>

    <section v-if="certificateEntry">
      <n-text strong class="section-title">{{ labels.subjectIssuer }}</n-text>
      <n-descriptions label-placement="left" bordered :column="1">
        <n-descriptions-item :label="labels.subject">
          <FieldValue :value="certificateEntry.subject" :empty-value="labels.notAvailable" />
        </n-descriptions-item>
        <n-descriptions-item :label="labels.issuer">
          <FieldValue :value="certificateEntry.issuer" :empty-value="labels.notAvailable" />
        </n-descriptions-item>
      </n-descriptions>
    </section>

    <section v-if="certificateEntry">
      <n-text strong class="section-title">{{ labels.validity }}</n-text>
      <n-descriptions label-placement="left" bordered :column="1">
        <n-descriptions-item :label="labels.notBefore">
          <FieldValue :value="certificateEntry.notBefore" :empty-value="labels.notAvailable" />
        </n-descriptions-item>
        <n-descriptions-item :label="labels.notAfter">
          <FieldValue :value="certificateEntry.notAfter" :empty-value="labels.notAvailable" />
        </n-descriptions-item>
      </n-descriptions>
    </section>

    <section>
      <n-text strong class="section-title">{{ labels.fingerprints }}</n-text>
      <n-descriptions label-placement="left" bordered :column="1">
        <n-descriptions-item :label="labels.fingerprintSha1">
          <FieldValue :value="entry.fingerprints.sha1" :empty-value="labels.notAvailable" />
        </n-descriptions-item>
        <n-descriptions-item :label="labels.fingerprintSha256">
          <FieldValue :value="entry.fingerprints.sha256" :empty-value="labels.notAvailable" />
        </n-descriptions-item>
      </n-descriptions>
    </section>

    <section v-if="showExtensions">
      <n-text strong class="section-title">{{ labels.extensions }}</n-text>
      <n-descriptions label-placement="left" bordered :column="1">
        <n-descriptions-item
          v-if="extensions.subjectAlternativeNames"
          :label="labels.subjectAltName"
        >
          <FieldValue
            :value="extensions.subjectAlternativeNames"
            :empty-value="labels.notAvailable"
          />
        </n-descriptions-item>
        <n-descriptions-item v-if="extensions.keyUsage" :label="labels.keyUsage">
          <FieldValue :value="extensions.keyUsage" :empty-value="labels.notAvailable" />
        </n-descriptions-item>
        <n-descriptions-item v-if="extensions.extendedKeyUsage" :label="labels.extendedKeyUsage">
          <FieldValue :value="extensions.extendedKeyUsage" :empty-value="labels.notAvailable" />
        </n-descriptions-item>
        <n-descriptions-item v-if="extensions.basicConstraints" :label="labels.basicConstraints">
          <FieldValue :value="extensions.basicConstraints" :empty-value="labels.notAvailable" />
        </n-descriptions-item>
        <n-descriptions-item
          v-if="extensions.subjectKeyIdentifier"
          :label="labels.subjectKeyIdentifier"
        >
          <FieldValue :value="extensions.subjectKeyIdentifier" :empty-value="labels.notAvailable" />
        </n-descriptions-item>
        <n-descriptions-item
          v-if="extensions.authorityKeyIdentifier"
          :label="labels.authorityKeyIdentifier"
        >
          <FieldValue
            :value="extensions.authorityKeyIdentifier"
            :empty-value="labels.notAvailable"
          />
        </n-descriptions-item>
      </n-descriptions>
    </section>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDescriptions, NDescriptionsItem, NTag, NText, NSpace } from 'naive-ui'
import FieldValue from './FieldValue.vue'

type Fingerprints = {
  sha1: string
  sha256: string
}

type CertificateExtensions = {
  subjectAlternativeNames?: string[]
  keyUsage?: string[]
  extendedKeyUsage?: string[]
  basicConstraints?: string
  subjectKeyIdentifier?: string
  authorityKeyIdentifier?: string
}

type CertificateEntry = {
  type: 'certificate'
  label: string
  subject: string
  issuer: string
  serialNumber: string
  notBefore: string
  notAfter: string
  signatureAlgorithm: string
  publicKeyAlgorithm: string
  publicKeySize?: number
  publicKeyCurve?: string
  fingerprints: Fingerprints
  extensions: CertificateExtensions
}

type PublicKeyEntry = {
  type: 'publicKey'
  label: string
  algorithm: string
  keySize?: number
  curve?: string
  fingerprints: Fingerprints
}

type ParsedEntry = CertificateEntry | PublicKeyEntry

type Labels = {
  certificate: string
  publicKey: string
  overview: string
  subjectIssuer: string
  validity: string
  keyAlgorithm: string
  keySize: string
  curve: string
  serialNumber: string
  signatureAlgorithm: string
  subject: string
  issuer: string
  notBefore: string
  notAfter: string
  fingerprints: string
  fingerprintSha1: string
  fingerprintSha256: string
  extensions: string
  subjectAltName: string
  keyUsage: string
  extendedKeyUsage: string
  basicConstraints: string
  subjectKeyIdentifier: string
  authorityKeyIdentifier: string
  notAvailable: string
  bits: string
}

const props = defineProps<{
  entry: ParsedEntry
  labels: Labels
}>()

const certificateEntry = computed(() => (props.entry.type === 'certificate' ? props.entry : null))

const keyAlgorithm = computed(() =>
  certificateEntry.value
    ? certificateEntry.value.publicKeyAlgorithm
    : props.entry.type === 'publicKey'
      ? props.entry.algorithm
      : '',
)

const keySize = computed(() =>
  certificateEntry.value
    ? certificateEntry.value.publicKeySize
    : props.entry.type === 'publicKey'
      ? props.entry.keySize
      : undefined,
)

const curve = computed(() =>
  certificateEntry.value
    ? certificateEntry.value.publicKeyCurve
    : props.entry.type === 'publicKey'
      ? props.entry.curve
      : undefined,
)

const extensions = computed(() => certificateEntry.value?.extensions ?? {})

const showExtensions = computed(() => {
  const ext = certificateEntry.value?.extensions
  if (!ext) return false
  return Boolean(
    ext.subjectAlternativeNames?.length ||
    ext.keyUsage?.length ||
    ext.extendedKeyUsage?.length ||
    ext.basicConstraints ||
    ext.subjectKeyIdentifier ||
    ext.authorityKeyIdentifier,
  )
})
</script>

<style scoped>
.section-title {
  display: block;
  margin-bottom: 8px;
}
</style>
