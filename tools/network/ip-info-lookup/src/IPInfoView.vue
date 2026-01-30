<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <template #title="{ t: titleT }">
      <ToolTitle>{{ titleT('name') }} - {{ ipdomain }}</ToolTitle>
    </template>
    <ToolSection>
      <template v-if="ips === undefined">
        <IPInfo :ip="undefined" />
      </template>
      <template v-else-if="ips?.length === 0">
        <n-result
          style="margin-top: 100px; margin-bottom: 100px"
          status="500"
          :title="t('failed-to-get-ip', { domain: ipdomain })"
        />
      </template>

      <template v-else>
        <n-collapse v-model:expanded-names="expandedNames" display-directive="show">
          <n-collapse-item v-for="ip in ips" :key="ip" :title="ip" :name="ip">
            <template #header-extra>
              <IPVersionTag :ip="ip" />
            </template>

            <IPInfo :ip="ip" />
          </n-collapse-item>
        </n-collapse>
      </template>
    </ToolSection>

    <ToolSectionHeader>{{ t('look-up-another-ip-or-domain') }}</ToolSectionHeader>
    <ToolSection>
      <IPAddressSearchInput />
    </ToolSection>
    <HowDoWeGetIPInfo />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { NResult, NCollapse, NCollapseItem } from 'naive-ui'
import { IPInfo, IPVersionTag } from '@shared/ui/domain/ip'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { isIP as isIPFunction } from 'is-ip'
import { getDomainIPs } from '@utils/ip'
import { computedAsync } from '@vueuse/core'
import { ref, watch } from 'vue'
import * as toolInfo from './info'
import { ToolDefaultPageLayout, ToolTitle, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { IPAddressSearchInput } from '@shared/ui/domain/ip'
import HowDoWeGetIPInfo from './HowDoWeGetIPInfo.vue'

const { t } = useI18n()
const route = useRoute()
const ipdomain = computed(() => route.params.ipdomain as string)
const isIP = computed(() => isIPFunction(ipdomain.value))
const expandedNames = ref<string[]>([])
const ips = computedAsync<string[] | undefined>(async () => {
  if (isIP.value) {
    return [ipdomain.value]
  } else {
    try {
      return await getDomainIPs(ipdomain.value)
    } catch (e) {
      console.error(e)
      return []
    }
  }
}, undefined)

watch(ips, () => {
  expandedNames.value = ips.value ?? []
})
</script>

<i18n lang="json">
{
  "en": {
    "failed-to-get-ip": "Failed to get {domain}'s IP",
    "look-up-another-ip-or-domain": "Look up another IP or domain"
  },
  "zh": {
    "failed-to-get-ip": "无法获取 {domain} 的 IP",
    "look-up-another-ip-or-domain": "查询另一个 IP 或域名"
  },
  "zh-CN": {
    "failed-to-get-ip": "无法获取 {domain} 的 IP",
    "look-up-another-ip-or-domain": "查询另一个 IP 或域名"
  },
  "zh-TW": {
    "failed-to-get-ip": "無法獲取 {domain} 的 IP",
    "look-up-another-ip-or-domain": "查詢另一個 IP 或域名"
  },
  "zh-HK": {
    "failed-to-get-ip": "無法獲取 {domain} 的 IP",
    "look-up-another-ip-or-domain": "查詢另一個 IP 或域名"
  },
  "es": {
    "failed-to-get-ip": "No se pudo obtener la IP de {domain}",
    "look-up-another-ip-or-domain": "Buscar otra IP o dominio"
  },
  "fr": {
    "failed-to-get-ip": "Impossible d'obtenir l'IP de {domain}",
    "look-up-another-ip-or-domain": "Rechercher une autre IP ou domaine"
  },
  "de": {
    "failed-to-get-ip": "IP von {domain} konnte nicht ermittelt werden",
    "look-up-another-ip-or-domain": "Andere IP oder Domain nachschlagen"
  },
  "it": {
    "failed-to-get-ip": "Impossibile ottenere l'IP di {domain}",
    "look-up-another-ip-or-domain": "Cerca un'altra IP o dominio"
  },
  "ja": {
    "failed-to-get-ip": "{domain} の IP を取得できませんでした",
    "look-up-another-ip-or-domain": "別の IP またはドメインを検索"
  },
  "ko": {
    "failed-to-get-ip": "{domain}의 IP를 가져오지 못했습니다",
    "look-up-another-ip-or-domain": "다른 IP 또는 도메인 조회"
  },
  "ru": {
    "failed-to-get-ip": "Не удалось получить IP для {domain}",
    "look-up-another-ip-or-domain": "Найти другой IP или домен"
  },
  "pt": {
    "failed-to-get-ip": "Falha ao obter o IP de {domain}",
    "look-up-another-ip-or-domain": "Pesquisar outro IP ou domínio"
  },
  "ar": {
    "failed-to-get-ip": "فشل في الحصول على عنوان IP لـ {domain}",
    "look-up-another-ip-or-domain": "البحث عن عنوان IP أو نطاق آخر"
  },
  "hi": {
    "failed-to-get-ip": "{domain} का IP प्राप्त करने में विफल",
    "look-up-another-ip-or-domain": "दूसरा IP या डोमेन खोजें"
  },
  "tr": {
    "failed-to-get-ip": "{domain} IP'si alınamadı",
    "look-up-another-ip-or-domain": "Başka bir IP veya alan adı ara"
  },
  "nl": {
    "failed-to-get-ip": "Kan IP van {domain} niet ophalen",
    "look-up-another-ip-or-domain": "Een ander IP of domein opzoeken"
  },
  "sv": {
    "failed-to-get-ip": "Det gick inte att hämta IP för {domain}",
    "look-up-another-ip-or-domain": "Slå upp en annan IP eller domän"
  },
  "pl": {
    "failed-to-get-ip": "Nie udało się uzyskać IP dla {domain}",
    "look-up-another-ip-or-domain": "Wyszukaj inny IP lub domenę"
  },
  "vi": {
    "failed-to-get-ip": "Không thể lấy IP của {domain}",
    "look-up-another-ip-or-domain": "Tra cứu IP hoặc tên miền khác"
  },
  "th": {
    "failed-to-get-ip": "ไม่สามารถรับ IP ของ {domain}",
    "look-up-another-ip-or-domain": "ค้นหา IP หรือโดเมนอื่น"
  },
  "id": {
    "failed-to-get-ip": "Gagal mendapatkan IP {domain}",
    "look-up-another-ip-or-domain": "Cari IP atau domain lain"
  },
  "he": {
    "failed-to-get-ip": "נכשל בקבלת IP של {domain}",
    "look-up-another-ip-or-domain": "חפש IP או דומיין אחר"
  },
  "ms": {
    "failed-to-get-ip": "Gagal mendapatkan IP {domain}",
    "look-up-another-ip-or-domain": "Cari IP atau domain lain"
  },
  "no": {
    "failed-to-get-ip": "Kunne ikke hente IP for {domain}",
    "look-up-another-ip-or-domain": "Slå opp en annen IP eller domene"
  }
}
</i18n>
