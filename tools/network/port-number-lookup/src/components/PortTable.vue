<template>
  <NDataTable
    :columns="columns"
    :data="filteredPorts"
    :bordered="false"
    size="small"
    :pagination="pagination"
    :row-key="(row: PortInfo) => row.port"
  />
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDataTable, NTag } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { CopyToClipboardTooltip } from '@shared/ui/base'
import { ports, type PortInfo } from '../data/ports'

const props = defineProps<{
  search: string
  category: string
}>()

const { t } = useI18n()

const filteredPorts = computed(() => {
  let result = ports

  // Filter by category
  if (props.category === 'common') {
    result = result.filter((p) => p.common)
  } else if (props.category === 'system') {
    result = result.filter((p) => p.category === 'system')
  } else if (props.category === 'registered') {
    result = result.filter((p) => p.category === 'registered')
  }

  // Filter by search
  if (props.search) {
    const query = props.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.port.toString().includes(query) ||
        p.service.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query),
    )
  }

  return result
})

const pagination = {
  pageSize: 20,
}

const columns = computed<DataTableColumns<PortInfo>>(() => [
  {
    title: t('port'),
    key: 'port',
    width: 100,
    render(row) {
      return h(
        CopyToClipboardTooltip,
        { content: String(row.port) },
        {
          default: ({ copy }: { copy: () => void }) =>
            h(
              'span',
              {
                style: { fontFamily: 'monospace', fontWeight: 'bold', cursor: 'pointer' },
                onClick: copy,
              },
              row.port,
            ),
        },
      )
    },
  },
  {
    title: t('service'),
    key: 'service',
    width: 150,
    render(row) {
      return h('span', { style: { fontFamily: 'monospace' } }, row.service)
    },
  },
  {
    title: t('protocol'),
    key: 'protocol',
    width: 100,
    render(row) {
      const type = row.protocol === 'TCP' ? 'success' : row.protocol === 'UDP' ? 'warning' : 'info'
      return h(NTag, { size: 'small', type, bordered: false }, () => row.protocol)
    },
  },
  {
    title: t('description'),
    key: 'description',
  },
])
</script>

<i18n lang="json">
{
  "en": {
    "port": "Port",
    "service": "Service",
    "protocol": "Protocol",
    "description": "Description"
  },
  "zh": {
    "port": "端口",
    "service": "服务",
    "protocol": "协议",
    "description": "描述"
  },
  "zh-CN": {
    "port": "端口",
    "service": "服务",
    "protocol": "协议",
    "description": "描述"
  },
  "zh-TW": {
    "port": "連接埠",
    "service": "服務",
    "protocol": "協定",
    "description": "描述"
  },
  "zh-HK": {
    "port": "連接埠",
    "service": "服務",
    "protocol": "協定",
    "description": "描述"
  },
  "es": {
    "port": "Puerto",
    "service": "Servicio",
    "protocol": "Protocolo",
    "description": "Descripcion"
  },
  "fr": {
    "port": "Port",
    "service": "Service",
    "protocol": "Protocole",
    "description": "Description"
  },
  "de": {
    "port": "Port",
    "service": "Dienst",
    "protocol": "Protokoll",
    "description": "Beschreibung"
  },
  "it": {
    "port": "Porta",
    "service": "Servizio",
    "protocol": "Protocollo",
    "description": "Descrizione"
  },
  "ja": {
    "port": "ポート",
    "service": "サービス",
    "protocol": "プロトコル",
    "description": "説明"
  },
  "ko": {
    "port": "포트",
    "service": "서비스",
    "protocol": "프로토콜",
    "description": "설명"
  },
  "ru": {
    "port": "Порт",
    "service": "Сервис",
    "protocol": "Протокол",
    "description": "Описание"
  },
  "pt": {
    "port": "Porta",
    "service": "Servico",
    "protocol": "Protocolo",
    "description": "Descricao"
  },
  "ar": {
    "port": "المنفذ",
    "service": "الخدمة",
    "protocol": "البروتوكول",
    "description": "الوصف"
  },
  "hi": {
    "port": "पोर्ट",
    "service": "सेवा",
    "protocol": "प्रोटोकॉल",
    "description": "विवरण"
  },
  "tr": {
    "port": "Port",
    "service": "Servis",
    "protocol": "Protokol",
    "description": "Aciklama"
  },
  "nl": {
    "port": "Poort",
    "service": "Service",
    "protocol": "Protocol",
    "description": "Beschrijving"
  },
  "sv": {
    "port": "Port",
    "service": "Tjanst",
    "protocol": "Protokoll",
    "description": "Beskrivning"
  },
  "pl": {
    "port": "Port",
    "service": "Usluga",
    "protocol": "Protokol",
    "description": "Opis"
  },
  "vi": {
    "port": "Cong",
    "service": "Dich vu",
    "protocol": "Giao thuc",
    "description": "Mo ta"
  },
  "th": {
    "port": "พอร์ต",
    "service": "บริการ",
    "protocol": "โปรโตคอล",
    "description": "คำอธิบาย"
  },
  "id": {
    "port": "Port",
    "service": "Layanan",
    "protocol": "Protokol",
    "description": "Deskripsi"
  },
  "he": {
    "port": "פורט",
    "service": "שירות",
    "protocol": "פרוטוקול",
    "description": "תיאור"
  },
  "ms": {
    "port": "Port",
    "service": "Perkhidmatan",
    "protocol": "Protokol",
    "description": "Penerangan"
  },
  "no": {
    "port": "Port",
    "service": "Tjeneste",
    "protocol": "Protokoll",
    "description": "Beskrivelse"
  }
}
</i18n>
