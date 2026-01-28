<template>
  <n-space vertical :size="16">
    <ParsedEntryOverviewSection
      :is-certificate="Boolean(certificateEntry)"
      :serial-number="certificateEntry?.serialNumber"
      :signature-algorithm="certificateEntry?.signatureAlgorithm"
      :key-algorithm="keyAlgorithm"
      :key-size="keySize"
      :curve="curve"
    />

    <ParsedEntrySubjectIssuerSection
      v-if="certificateEntry"
      :subject="certificateEntry.subject"
      :issuer="certificateEntry.issuer"
    />

    <ParsedEntryValiditySection
      v-if="certificateEntry"
      :not-before="certificateEntry.notBefore"
      :not-after="certificateEntry.notAfter"
    />

    <ParsedEntryFingerprintsSection
      :sha1="entry.fingerprints.sha1"
      :sha256="entry.fingerprints.sha256"
    />

    <ParsedEntryExtensionsSection v-if="showExtensions" :extensions="extensions" />
  </n-space>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NSpace } from 'naive-ui'
import ParsedEntryExtensionsSection from './ParsedEntryExtensionsSection.vue'
import ParsedEntryFingerprintsSection from './ParsedEntryFingerprintsSection.vue'
import ParsedEntryOverviewSection from './ParsedEntryOverviewSection.vue'
import ParsedEntrySubjectIssuerSection from './ParsedEntrySubjectIssuerSection.vue'
import ParsedEntryValiditySection from './ParsedEntryValiditySection.vue'
import type { CertificateEntry, CertificateExtensions, ParsedEntry } from '../utils/types'

const props = defineProps<{
  entry: ParsedEntry
}>()

const certificateEntry = computed<CertificateEntry | null>(() =>
  props.entry.type === 'certificate' ? props.entry : null,
)

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

const extensions = computed<CertificateExtensions>(() => certificateEntry.value?.extensions ?? {})

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
