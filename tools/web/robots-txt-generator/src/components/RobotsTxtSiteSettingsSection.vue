<template>
  <ToolSectionHeader>{{ t('siteSettings') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="12">
      <n-text depth="3">{{ t('sitemaps') }}</n-text>
      <n-dynamic-input v-model:value="sitemaps" :on-create="createSitemap">
        <template #create-button-default>{{ t('addSitemap') }}</template>
        <template #default="{ index }">
          <n-input
            v-model:value="sitemaps[index]"
            :placeholder="t('sitemapPlaceholder')"
            :data-testid="'sitemap-input-' + index"
          />
        </template>
      </n-dynamic-input>

      <n-flex align="center" justify="space-between">
        <n-text>{{ t('advancedSettings') }}</n-text>
        <n-switch v-model:value="advanced" data-testid="advanced-toggle" />
      </n-flex>

      <template v-if="advanced">
        <n-text depth="3">{{ t('host') }}</n-text>
        <n-input
          v-model:value="host"
          :placeholder="t('hostPlaceholder')"
          data-testid="host-input"
        />
      </template>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NDynamicInput, NFlex, NInput, NSpace, NSwitch, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const sitemaps = defineModel<string[]>('sitemaps', { required: true })
const advanced = defineModel<boolean>('advanced', { required: true })
const host = defineModel<string>('host', { required: true })

const { t } = useI18n()
const createSitemap = () => ''
</script>

<i18n lang="json">
{
  "en": {
    "siteSettings": "Site settings",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Add sitemap",
    "advancedSettings": "Advanced settings",
    "host": "Host (non-standard)",
    "hostPlaceholder": "example.com"
  },
  "zh": {
    "siteSettings": "站点设置",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "添加 Sitemap",
    "advancedSettings": "高级设置",
    "host": "Host（非标准）",
    "hostPlaceholder": "example.com"
  },
  "zh-CN": {
    "siteSettings": "站点设置",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "添加 Sitemap",
    "advancedSettings": "高级设置",
    "host": "Host（非标准）",
    "hostPlaceholder": "example.com"
  },
  "zh-TW": {
    "siteSettings": "站點設定",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "新增 Sitemap",
    "advancedSettings": "進階設定",
    "host": "Host（非標準）",
    "hostPlaceholder": "example.com"
  },
  "zh-HK": {
    "siteSettings": "站點設定",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "新增 Sitemap",
    "advancedSettings": "進階設定",
    "host": "Host（非標準）",
    "hostPlaceholder": "example.com"
  },
  "es": {
    "siteSettings": "Configuración del sitio",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Agregar sitemap",
    "advancedSettings": "Configuración avanzada",
    "host": "Host (no estándar)",
    "hostPlaceholder": "example.com"
  },
  "fr": {
    "siteSettings": "Paramètres du site",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Ajouter un sitemap",
    "advancedSettings": "Paramètres avancés",
    "host": "Host (non standard)",
    "hostPlaceholder": "example.com"
  },
  "de": {
    "siteSettings": "Website-Einstellungen",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Sitemap hinzufügen",
    "advancedSettings": "Erweiterte Einstellungen",
    "host": "Host (nicht standardisiert)",
    "hostPlaceholder": "example.com"
  },
  "it": {
    "siteSettings": "Impostazioni del sito",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Aggiungi sitemap",
    "advancedSettings": "Impostazioni avanzate",
    "host": "Host (non standard)",
    "hostPlaceholder": "example.com"
  },
  "ja": {
    "siteSettings": "サイト設定",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Sitemap を追加",
    "advancedSettings": "詳細設定",
    "host": "Host（非標準）",
    "hostPlaceholder": "example.com"
  },
  "ko": {
    "siteSettings": "사이트 설정",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Sitemap 추가",
    "advancedSettings": "고급 설정",
    "host": "Host(비표준)",
    "hostPlaceholder": "example.com"
  },
  "ru": {
    "siteSettings": "Настройки сайта",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Добавить sitemap",
    "advancedSettings": "Расширенные настройки",
    "host": "Host (нестандартный)",
    "hostPlaceholder": "example.com"
  },
  "pt": {
    "siteSettings": "Configurações do site",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Adicionar sitemap",
    "advancedSettings": "Configurações avançadas",
    "host": "Host (não padrão)",
    "hostPlaceholder": "example.com"
  },
  "ar": {
    "siteSettings": "إعدادات الموقع",
    "sitemaps": "خرائط الموقع",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "إضافة خريطة موقع",
    "advancedSettings": "إعدادات متقدمة",
    "host": "Host (غير قياسي)",
    "hostPlaceholder": "example.com"
  },
  "hi": {
    "siteSettings": "साइट सेटिंग्स",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Sitemap जोड़ें",
    "advancedSettings": "उन्नत सेटिंग्स",
    "host": "Host (गैर-मानक)",
    "hostPlaceholder": "example.com"
  },
  "tr": {
    "siteSettings": "Site ayarları",
    "sitemaps": "Sitemap'ler",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Sitemap ekle",
    "advancedSettings": "Gelişmiş ayarlar",
    "host": "Host (standart dışı)",
    "hostPlaceholder": "example.com"
  },
  "nl": {
    "siteSettings": "Site-instellingen",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Sitemap toevoegen",
    "advancedSettings": "Geavanceerde instellingen",
    "host": "Host (niet-standaard)",
    "hostPlaceholder": "example.com"
  },
  "sv": {
    "siteSettings": "Webbplatsinställningar",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Lägg till sitemap",
    "advancedSettings": "Avancerade inställningar",
    "host": "Host (icke-standard)",
    "hostPlaceholder": "example.com"
  },
  "pl": {
    "siteSettings": "Ustawienia witryny",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Dodaj sitemap",
    "advancedSettings": "Ustawienia zaawansowane",
    "host": "Host (niestandardowy)",
    "hostPlaceholder": "example.com"
  },
  "vi": {
    "siteSettings": "Cài đặt trang",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Thêm sitemap",
    "advancedSettings": "Cài đặt nâng cao",
    "host": "Host (không chuẩn)",
    "hostPlaceholder": "example.com"
  },
  "th": {
    "siteSettings": "การตั้งค่าเว็บไซต์",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "เพิ่ม sitemap",
    "advancedSettings": "การตั้งค่าขั้นสูง",
    "host": "Host (ไม่เป็นมาตรฐาน)",
    "hostPlaceholder": "example.com"
  },
  "id": {
    "siteSettings": "Pengaturan situs",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Tambahkan sitemap",
    "advancedSettings": "Pengaturan lanjutan",
    "host": "Host (non-standar)",
    "hostPlaceholder": "example.com"
  },
  "he": {
    "siteSettings": "הגדרות אתר",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "הוסף sitemap",
    "advancedSettings": "הגדרות מתקדמות",
    "host": "Host (לא תקני)",
    "hostPlaceholder": "example.com"
  },
  "ms": {
    "siteSettings": "Tetapan laman",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Tambah sitemap",
    "advancedSettings": "Tetapan lanjutan",
    "host": "Host (tidak standard)",
    "hostPlaceholder": "example.com"
  },
  "no": {
    "siteSettings": "Nettstedsinnstillinger",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Legg til sitemap",
    "advancedSettings": "Avanserte innstillinger",
    "host": "Host (ikke-standard)",
    "hostPlaceholder": "example.com"
  }
}
</i18n>
