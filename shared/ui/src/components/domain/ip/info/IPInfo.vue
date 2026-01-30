<template>
  <n-descriptions label-placement="left" bordered :column="1" content-style="width: 100%">
    <n-descriptions-item :label="t('ip-address')">
      <CopyToClipboardTooltip v-if="ip" :content="ip" #="{ copy }">
        <span class="cursor-pointer" @click="copy">
          {{ ip }}
        </span>
      </CopyToClipboardTooltip>
      <IPInfoDataLoadingUnknown :data="ip" />
    </n-descriptions-item>
    <n-descriptions-item :label="t('hostname')">
      <CopyToClipboardTooltip v-if="info.hostname" :content="info.hostname" #="{ copy }">
        <span class="cursor-pointer" @click="copy">
          {{ info.hostname }}
        </span>
      </CopyToClipboardTooltip>
      <IPInfoDataLoadingUnknown :data="info.hostname" />
    </n-descriptions-item>
    <n-descriptions-item label-style="white-space: nowrap" :label="t('isp')">
      <CopyToClipboardTooltip v-if="info.isp" :content="info.isp" #="{ copy }">
        <span class="cursor-pointer" @click="copy">
          {{ info.isp }}
        </span>
      </CopyToClipboardTooltip>
      <IPInfoDataLoadingUnknown :data="info.isp" />
    </n-descriptions-item>

    <n-descriptions-item label-style="white-space: nowrap" :label="t('ip-organization')">
      <CopyToClipboardTooltip v-if="info.organization" :content="info.organization" #="{ copy }">
        <span class="cursor-pointer" @click="copy">
          {{ info.organization }}
        </span>
      </CopyToClipboardTooltip>
      <IPInfoDataLoadingUnknown :data="info.organization" />
    </n-descriptions-item>

    <n-descriptions-item :label="t('asn')">
      <CopyToClipboardTooltip v-if="info.asn" :content="info.asn" #="{ copy }">
        <span class="cursor-pointer" @click="copy">
          {{ info.asn }}
        </span>
      </CopyToClipboardTooltip>
      <IPInfoDataLoadingUnknown :data="info.asn" />
    </n-descriptions-item>

    <n-descriptions-item label-style="white-space: nowrap" :label="t('asn-organization')">
      <CopyToClipboardTooltip
        v-if="info.asn_organization"
        :content="info.asn_organization"
        #="{ copy }"
      >
        <span class="cursor-pointer" @click="copy">
          {{ info.asn_organization }}
        </span>
      </CopyToClipboardTooltip>
      <IPInfoDataLoadingUnknown :data="info.asn_organization" />
    </n-descriptions-item>

    <n-descriptions-item :label="t('location')">
      <span v-if="location">
        <a :href="googleMapsLink" target="_blank" rel="noopener noreferrer" class="map-link">
          {{ location }}
        </a>
      </span>
      <IPInfoDataLoadingUnknown :data="location" />
    </n-descriptions-item>

    <n-descriptions-item :label="t('country')">
      <CopyToClipboardTooltip v-if="info.country" :content="info.country" #="{ copy }">
        <span class="cursor-pointer" @click="copy">
          {{ info.country }}
        </span>
      </CopyToClipboardTooltip>
      <IPInfoDataLoadingUnknown :data="info.country" />
    </n-descriptions-item>

    <n-descriptions-item :label="t('timezone')">
      <CopyToClipboardTooltip v-if="info.timezone" :content="info.timezone" #="{ copy }">
        <span class="cursor-pointer" @click="copy">
          {{ info.timezone }}
        </span>
      </CopyToClipboardTooltip>
      <IPInfoDataLoadingUnknown :data="info.timezone" />
    </n-descriptions-item>
  </n-descriptions>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem } from 'naive-ui'
import { IPInfoProviders, type IPInfo } from '@utils/ip'
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IPInfoDataLoadingUnknown from './IPInfoDataLoadingUnknown.vue'
import CopyToClipboardTooltip from '../../../base/tooltip/CopyToClipboardTooltip.vue'

const { t } = useI18n()

const props = defineProps<{
  ip?: string
}>()

const info = ref<IPInfo>({})

onMounted(async () => {
  const ip = props.ip

  if (!ip) {
    return
  }

  const promises = []

  for (const provider of IPInfoProviders) {
    promises.push(
      (async () => {
        const result = await provider.getIPInfo(ip)
        for (const [key, value] of Object.entries(result)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (info.value?.[key] === undefined) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            info.value[key] = value
          }
        }
      })(),
    )
  }

  await Promise.allSettled(promises)

  const fillNullKeys = [
    'timezone',
    'longitude',
    'latitude',
    'country',
    'continent',
    'city',
    'hostname',
    'asn',
    'asn_organization',
    'isp',
    'organization',
  ]

  for (const key of fillNullKeys) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (info.value?.[key] === undefined) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      info.value[key] = null
    }
  }
})

const location = computed(() => {
  if (info.value.longitude && info.value.latitude) {
    return `${info.value.longitude} / ${info.value.latitude}`
  } else if (info.value.longitude === undefined || info.value.latitude === undefined) {
    return undefined
  } else {
    return null
  }
})

const googleMapsLink = computed(() => {
  if (info.value.longitude && info.value.latitude) {
    return `https://www.google.com/maps/search/?api=1&query=${info.value.latitude},${info.value.longitude}`
  } else {
    return undefined
  }
})
</script>

<style scoped>
.map-link {
  color: inherit;
  text-decoration: none;
}

.map-link:hover {
  text-decoration: underline;
}

.cursor-pointer {
  cursor: pointer;
}
</style>

<i18n lang="json">
{
  "en": {
    "ip-address": "IP Address",
    "hostname": "Hostname",
    "isp": "ISP",
    "ip-organization": "IP Organization",
    "asn": "ASN",
    "asn-organization": "ASN Organization",
    "location": "Location",
    "country": "Country",
    "timezone": "Timezone"
  },
  "zh": {
    "ip-address": "IP 地址",
    "hostname": "主机名",
    "isp": "网络服务商",
    "ip-organization": "IP 组织",
    "asn": "ASN",
    "asn-organization": "ASN 组织",
    "location": "位置",
    "country": "国家",
    "timezone": "时区"
  },
  "zh-CN": {
    "ip-address": "IP 地址",
    "hostname": "主机名",
    "isp": "网络服务商",
    "ip-organization": "IP 组织",
    "asn": "ASN",
    "asn-organization": "ASN 组织",
    "location": "位置",
    "country": "国家",
    "timezone": "时区"
  },
  "zh-TW": {
    "ip-address": "IP 位址",
    "hostname": "主機名",
    "isp": "網路服務商",
    "ip-organization": "IP 組織",
    "asn": "ASN",
    "asn-organization": "ASN 組織",
    "location": "位置",
    "country": "國家",
    "timezone": "時區"
  },
  "zh-HK": {
    "ip-address": "IP 位址",
    "hostname": "主機名",
    "isp": "網路服務商",
    "ip-organization": "IP 組織",
    "asn": "ASN",
    "asn-organization": "ASN 組織",
    "location": "位置",
    "country": "國家",
    "timezone": "時區"
  },
  "es": {
    "ip-address": "Dirección IP",
    "hostname": "Nombre del Host",
    "isp": "Proveedor de Internet",
    "ip-organization": "Organización IP",
    "asn": "ASN",
    "asn-organization": "Organización ASN",
    "location": "Ubicación",
    "country": "País",
    "timezone": "Zona Horaria"
  },
  "fr": {
    "ip-address": "Adresse IP",
    "hostname": "Nom d'hôte",
    "isp": "Fournisseur d'Internet",
    "ip-organization": "Organisation IP",
    "asn": "ASN",
    "asn-organization": "Organisation ASN",
    "location": "Emplacement",
    "country": "Pays",
    "timezone": "Fuseau Horaire"
  },
  "de": {
    "ip-address": "IP-Adresse",
    "hostname": "Hostname",
    "isp": "Internetanbieter",
    "ip-organization": "IP-Organisation",
    "asn": "ASN",
    "asn-organization": "ASN-Organisation",
    "location": "Standort",
    "country": "Land",
    "timezone": "Zeitzone"
  },
  "it": {
    "ip-address": "Indirizzo IP",
    "hostname": "Nome Host",
    "isp": "Provider Internet",
    "ip-organization": "Organizzazione IP",
    "asn": "ASN",
    "asn-organization": "Organizzazione ASN",
    "location": "Posizione",
    "country": "Paese",
    "timezone": "Fuso Orario"
  },
  "ja": {
    "ip-address": "IP アドレス",
    "hostname": "ホスト名",
    "isp": "インターネットサービスプロバイダ",
    "ip-organization": "IP 組織",
    "asn": "ASN",
    "asn-organization": "ASN 組織",
    "location": "場所",
    "country": "国",
    "timezone": "タイムゾーン"
  },
  "ko": {
    "ip-address": "IP 주소",
    "hostname": "호스트명",
    "isp": "인터넷 서비스 제공업체",
    "ip-organization": "IP 조직",
    "asn": "ASN",
    "asn-organization": "ASN 조직",
    "location": "위치",
    "country": "국가",
    "timezone": "시간대"
  },
  "ru": {
    "ip-address": "IP-адрес",
    "hostname": "Имя хоста",
    "isp": "Интернет-провайдер",
    "ip-organization": "IP-организация",
    "asn": "ASN",
    "asn-organization": "ASN-организация",
    "location": "Местоположение",
    "country": "Страна",
    "timezone": "Часовой пояс"
  },
  "pt": {
    "ip-address": "Endereço IP",
    "hostname": "Nome do Host",
    "isp": "Provedor de Internet",
    "ip-organization": "Organização IP",
    "asn": "ASN",
    "asn-organization": "Organização ASN",
    "location": "Localização",
    "country": "País",
    "timezone": "Fuso Horário"
  },
  "ar": {
    "ip-address": "عنوان IP",
    "hostname": "اسم المضيف",
    "isp": "مزود خدمة الإنترنت",
    "ip-organization": "منظمة IP",
    "asn": "ASN",
    "asn-organization": "منظمة ASN",
    "location": "الموقع",
    "country": "البلد",
    "timezone": "المنطقة الزمنية"
  },
  "hi": {
    "ip-address": "IP पता",
    "hostname": "होस्टनाम",
    "isp": "इंटरनेट सेवा प्रदाता",
    "ip-organization": "IP संगठन",
    "asn": "ASN",
    "asn-organization": "ASN संगठन",
    "location": "स्थान",
    "country": "देश",
    "timezone": "समय क्षेत्र"
  },
  "tr": {
    "ip-address": "IP Adresi",
    "hostname": "Ana Bilgisayar Adı",
    "isp": "İnternet Servis Sağlayıcısı",
    "ip-organization": "IP Organizasyonu",
    "asn": "ASN",
    "asn-organization": "ASN Organizasyonu",
    "location": "Konum",
    "country": "Ülke",
    "timezone": "Saat Dilimi"
  },
  "nl": {
    "ip-address": "IP-adres",
    "hostname": "Hostnaam",
    "isp": "Internetprovider",
    "ip-organization": "IP-organisatie",
    "asn": "ASN",
    "asn-organization": "ASN-organisatie",
    "location": "Locatie",
    "country": "Land",
    "timezone": "Tijdzone"
  },
  "sv": {
    "ip-address": "IP-adress",
    "hostname": "Värdnamn",
    "isp": "Internetleverantör",
    "ip-organization": "IP-organisation",
    "asn": "ASN",
    "asn-organization": "ASN-organisation",
    "location": "Plats",
    "country": "Land",
    "timezone": "Tidszon"
  },
  "pl": {
    "ip-address": "Adres IP",
    "hostname": "Nazwa hosta",
    "isp": "Dostawca internetu",
    "ip-organization": "Organizacja IP",
    "asn": "ASN",
    "asn-organization": "Organizacja ASN",
    "location": "Lokalizacja",
    "country": "Kraj",
    "timezone": "Strefa czasowa"
  },
  "vi": {
    "ip-address": "Địa chỉ IP",
    "hostname": "Tên máy chủ",
    "isp": "Nhà cung cấp dịch vụ Internet",
    "ip-organization": "Tổ chức IP",
    "asn": "ASN",
    "asn-organization": "Tổ chức ASN",
    "location": "Vị trí",
    "country": "Quốc gia",
    "timezone": "Múi giờ"
  },
  "th": {
    "ip-address": "ที่อยู่ IP",
    "hostname": "ชื่อโฮสต์",
    "isp": "ผู้ให้บริการอินเทอร์เน็ต",
    "ip-organization": "องค์กร IP",
    "asn": "ASN",
    "asn-organization": "องค์กร ASN",
    "location": "ตำแหน่ง",
    "country": "ประเทศ",
    "timezone": "เขตเวลา"
  },
  "id": {
    "ip-address": "Alamat IP",
    "hostname": "Nama Host",
    "isp": "Penyedia Layanan Internet",
    "ip-organization": "Organisasi IP",
    "asn": "ASN",
    "asn-organization": "Organisasi ASN",
    "location": "Lokasi",
    "country": "Negara",
    "timezone": "Zona Waktu"
  },
  "he": {
    "ip-address": "כתובת IP",
    "hostname": "שם מארח",
    "isp": "ספק שירותי אינטרנט",
    "ip-organization": "ארגון IP",
    "asn": "ASN",
    "asn-organization": "ארגון ASN",
    "location": "מיקום",
    "country": "מדינה",
    "timezone": "אזור זמן"
  },
  "ms": {
    "ip-address": "Alamat IP",
    "hostname": "Nama Hos",
    "isp": "Penyedia Perkhidmatan Internet",
    "ip-organization": "Organisasi IP",
    "asn": "ASN",
    "asn-organization": "Organisasi ASN",
    "location": "Lokasi",
    "country": "Negara",
    "timezone": "Zon Masa"
  },
  "no": {
    "ip-address": "IP-adresse",
    "hostname": "Vertsnavn",
    "isp": "Internettleverandør",
    "ip-organization": "IP-organisasjon",
    "asn": "ASN",
    "asn-organization": "ASN-organisasjon",
    "location": "Plassering",
    "country": "Land",
    "timezone": "Tidssone"
  }
}
</i18n>
