<template>
  <NDescriptions :column="1" bordered label-placement="left">
    <NDescriptionsItem :label="t('lengthCheck')">
      <NTag :type="lengthStatus.type" size="small">{{ lengthStatus.label }}</NTag>
    </NDescriptionsItem>
    <NDescriptionsItem :label="t('localCheck')">
      <NTag :type="localStatus.type" size="small">{{ localStatus.label }}</NTag>
    </NDescriptionsItem>
    <NDescriptionsItem :label="t('domainCheck')">
      <NTag :type="domainStatus.type" size="small">{{ domainStatus.label }}</NTag>
    </NDescriptionsItem>
    <NDescriptionsItem :label="t('tldCheck')">
      <NTag :type="tldStatus.type" size="small">{{ tldStatus.label }}</NTag>
    </NDescriptionsItem>
  </NDescriptions>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NTag } from 'naive-ui'
import { useI18n } from 'vue-i18n'

defineProps<{
  lengthStatus: TagStatus
  localStatus: TagStatus
  domainStatus: TagStatus
  tldStatus: TagStatus
}>()

const { t } = useI18n()

type TagType = 'success' | 'error' | 'default' | 'warning' | 'primary' | 'info'

type TagStatus = {
  label: string
  type: TagType
}
</script>

<i18n lang="json">
{
  "en": {
    "lengthCheck": "Length Check",
    "localCheck": "Local Part Check",
    "domainCheck": "Domain Check",
    "tldCheck": "TLD Check"
  },
  "zh": {
    "lengthCheck": "长度检查",
    "localCheck": "本地部分检查",
    "domainCheck": "域名检查",
    "tldCheck": "顶级域名检查"
  },
  "zh-CN": {
    "lengthCheck": "长度检查",
    "localCheck": "本地部分检查",
    "domainCheck": "域名检查",
    "tldCheck": "顶级域名检查"
  },
  "zh-TW": {
    "lengthCheck": "長度檢查",
    "localCheck": "本地部分檢查",
    "domainCheck": "網域檢查",
    "tldCheck": "頂級網域檢查"
  },
  "zh-HK": {
    "lengthCheck": "長度檢查",
    "localCheck": "本地部分檢查",
    "domainCheck": "網域檢查",
    "tldCheck": "頂級網域檢查"
  },
  "es": {
    "lengthCheck": "Comprobación de longitud",
    "localCheck": "Comprobación de parte local",
    "domainCheck": "Comprobación de dominio",
    "tldCheck": "Comprobación de TLD"
  },
  "fr": {
    "lengthCheck": "Contrôle de longueur",
    "localCheck": "Contrôle de la partie locale",
    "domainCheck": "Contrôle du domaine",
    "tldCheck": "Contrôle du TLD"
  },
  "de": {
    "lengthCheck": "Längenprüfung",
    "localCheck": "Prüfung des lokalen Teils",
    "domainCheck": "Domainprüfung",
    "tldCheck": "TLD-Prüfung"
  },
  "it": {
    "lengthCheck": "Controllo lunghezza",
    "localCheck": "Controllo parte locale",
    "domainCheck": "Controllo dominio",
    "tldCheck": "Controllo TLD"
  },
  "ja": {
    "lengthCheck": "長さチェック",
    "localCheck": "ローカル部チェック",
    "domainCheck": "ドメインチェック",
    "tldCheck": "TLD チェック"
  },
  "ko": {
    "lengthCheck": "길이 검사",
    "localCheck": "로컬 부분 검사",
    "domainCheck": "도메인 검사",
    "tldCheck": "TLD 검사"
  },
  "ru": {
    "lengthCheck": "Проверка длины",
    "localCheck": "Проверка локальной части",
    "domainCheck": "Проверка домена",
    "tldCheck": "Проверка TLD"
  },
  "pt": {
    "lengthCheck": "Verificação de comprimento",
    "localCheck": "Verificação da parte local",
    "domainCheck": "Verificação do domínio",
    "tldCheck": "Verificação de TLD"
  },
  "ar": {
    "lengthCheck": "فحص الطول",
    "localCheck": "فحص الجزء المحلي",
    "domainCheck": "فحص النطاق",
    "tldCheck": "فحص TLD"
  },
  "hi": {
    "lengthCheck": "लंबाई जांच",
    "localCheck": "लोकल भाग जांच",
    "domainCheck": "डोमेन जांच",
    "tldCheck": "TLD जांच"
  },
  "tr": {
    "lengthCheck": "Uzunluk kontrolü",
    "localCheck": "Yerel bölüm kontrolü",
    "domainCheck": "Alan adı kontrolü",
    "tldCheck": "TLD kontrolü"
  },
  "nl": {
    "lengthCheck": "Lengtecontrole",
    "localCheck": "Controle lokaal deel",
    "domainCheck": "Domeincontrole",
    "tldCheck": "TLD-controle"
  },
  "sv": {
    "lengthCheck": "Längdkontroll",
    "localCheck": "Kontroll av lokal del",
    "domainCheck": "Domänkontroll",
    "tldCheck": "TLD-kontroll"
  },
  "pl": {
    "lengthCheck": "Kontrola długości",
    "localCheck": "Kontrola części lokalnej",
    "domainCheck": "Kontrola domeny",
    "tldCheck": "Kontrola TLD"
  },
  "vi": {
    "lengthCheck": "Kiểm tra độ dài",
    "localCheck": "Kiểm tra phần cục bộ",
    "domainCheck": "Kiểm tra tên miền",
    "tldCheck": "Kiểm tra TLD"
  },
  "th": {
    "lengthCheck": "ตรวจความยาว",
    "localCheck": "ตรวจส่วนโลคัล",
    "domainCheck": "ตรวจโดเมน",
    "tldCheck": "ตรวจ TLD"
  },
  "id": {
    "lengthCheck": "Pemeriksaan panjang",
    "localCheck": "Pemeriksaan bagian lokal",
    "domainCheck": "Pemeriksaan domain",
    "tldCheck": "Pemeriksaan TLD"
  },
  "he": {
    "lengthCheck": "בדיקת אורך",
    "localCheck": "בדיקת החלק המקומי",
    "domainCheck": "בדיקת הדומיין",
    "tldCheck": "בדיקת TLD"
  },
  "ms": {
    "lengthCheck": "Semakan panjang",
    "localCheck": "Semakan bahagian lokal",
    "domainCheck": "Semakan domain",
    "tldCheck": "Semakan TLD"
  },
  "no": {
    "lengthCheck": "Lengdesjekk",
    "localCheck": "Sjekk av lokal del",
    "domainCheck": "Domenesjekk",
    "tldCheck": "TLD-sjekk"
  }
}
</i18n>
