<template>
  <n-space vertical :size="16">
    <n-alert type="warning" :show-icon="false" :title="t('securityNoticeTitle')">
      {{ t('securityNotice') }}
    </n-alert>

    <ToolSectionHeader>{{ t('presets') }}</ToolSectionHeader>
    <ToolSection>
      <n-flex :wrap="true" :size="8">
        <n-button size="small" @click="applyPreset('allowAll')" data-testid="preset-allow-all">
          {{ t('presetAllowAll') }}
        </n-button>
        <n-button
          size="small"
          @click="applyPreset('disallowAll')"
          data-testid="preset-disallow-all"
        >
          {{ t('presetDisallowAll') }}
        </n-button>
        <n-button size="small" @click="applyPreset('blockAdmin')" data-testid="preset-block-admin">
          {{ t('presetBlockAdmin') }}
        </n-button>
      </n-flex>
    </ToolSection>

    <ToolSectionHeader>{{ t('siteSettings') }}</ToolSectionHeader>
    <ToolSection>
      <n-space vertical :size="12">
        <n-text depth="3">{{ t('sitemaps') }}</n-text>
        <n-dynamic-input
          v-model:value="state.sitemaps"
          item-style="margin-bottom: 0;"
          :on-create="createSitemap"
        >
          <template #create-button-default>{{ t('addSitemap') }}</template>
          <template #default="{ index }">
            <n-input
              v-model:value="state.sitemaps[index]"
              :placeholder="t('sitemapPlaceholder')"
              :data-testid="`sitemap-input-${index}`"
            />
          </template>
        </n-dynamic-input>

        <n-flex align="center" justify="space-between">
          <n-text>{{ t('advancedSettings') }}</n-text>
          <n-switch v-model:value="state.advanced" data-testid="advanced-toggle" />
        </n-flex>

        <template v-if="state.advanced">
          <n-text depth="3">{{ t('host') }}</n-text>
          <n-input
            v-model:value="state.host"
            :placeholder="t('hostPlaceholder')"
            data-testid="host-input"
          />
        </template>
      </n-space>
    </ToolSection>

    <ToolSectionHeader>{{ t('groups') }}</ToolSectionHeader>
    <ToolSection>
      <n-space vertical :size="16">
        <n-card
          v-for="(group, index) in state.groups"
          :key="group.id"
          size="small"
          data-testid="group-card"
        >
          <n-flex align="center" justify="space-between">
            <n-text strong>{{ t('groupTitle', { index: index + 1 }) }}</n-text>
            <n-button text :disabled="state.groups.length === 1" @click="removeGroup(index)">
              <template #icon>
                <n-icon :component="Delete16Regular" />
              </template>
              {{ t('removeGroup') }}
            </n-button>
          </n-flex>

          <n-space vertical :size="12" style="margin-top: 12px">
            <n-text depth="3">{{ t('userAgents') }}</n-text>
            <n-dynamic-input
              v-model:value="group.userAgents"
              item-style="margin-bottom: 0;"
              :on-create="createUserAgent"
            >
              <template #create-button-default>{{ t('addUserAgent') }}</template>
              <template #default="{ index: agentIndex }">
                <n-input
                  v-model:value="group.userAgents[agentIndex]"
                  :placeholder="t('userAgentPlaceholder')"
                />
              </template>
            </n-dynamic-input>
            <n-text depth="3">{{ t('userAgentHint') }}</n-text>

            <n-text depth="3">{{ t('rules') }}</n-text>
            <n-dynamic-input
              v-model:value="group.rules"
              item-style="margin-bottom: 0;"
              :on-create="createRule"
            >
              <template #create-button-default>{{ t('addRule') }}</template>
              <template #default="{ index: ruleIndex }">
                <n-flex align="center" :size="8" :wrap="true">
                  <n-select
                    v-model:value="group.rules[ruleIndex]!.type"
                    :options="ruleOptions"
                    style="width: 140px"
                  />
                  <n-input
                    v-model:value="group.rules[ruleIndex]!.path"
                    :placeholder="t('pathPlaceholder')"
                    style="flex: 1; min-width: 200px"
                    :data-testid="`rule-path-${index}-${ruleIndex}`"
                  />
                </n-flex>
              </template>
            </n-dynamic-input>
            <n-text depth="3">{{ t('ruleHint') }}</n-text>

            <template v-if="state.advanced">
              <n-text depth="3">{{ t('crawlDelay') }}</n-text>
              <n-input-number
                v-model:value="group.crawlDelay"
                :min="0"
                :precision="1"
                :step="0.1"
                :placeholder="t('crawlDelayPlaceholder')"
              />
            </template>
          </n-space>
        </n-card>

        <n-button type="primary" dashed @click="addGroup" data-testid="add-group">
          <template #icon>
            <n-icon :component="Add16Regular" />
          </template>
          {{ t('addGroup') }}
        </n-button>
      </n-space>
    </ToolSection>

    <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>
    <ToolSection>
      <n-space vertical :size="12">
        <n-flex align="center" justify="space-between">
          <n-text depth="3">{{ t('output') }}</n-text>
          <n-flex align="center" :size="8">
            <CopyToClipboardButton v-if="hasOutput" :content="robotsContent" />
            <n-button
              text
              tag="a"
              :href="downloadHref"
              download="robots.txt"
              :disabled="!downloadHref"
              data-testid="download-robots"
            >
              <template #icon>
                <n-icon :component="ArrowDownload16Regular" />
              </template>
              {{ t('download') }}
            </n-button>
          </n-flex>
        </n-flex>

        <n-text v-if="!hasOutput" depth="3">{{ t('emptyOutput') }}</n-text>

        <n-input
          :value="robotsContent"
          type="textarea"
          readonly
          :autosize="{ minRows: 10, maxRows: 24 }"
          data-testid="robots-output"
        />
      </n-space>
    </ToolSection>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl, useStorage } from '@vueuse/core'
import {
  NAlert,
  NButton,
  NCard,
  NDynamicInput,
  NFlex,
  NIcon,
  NInput,
  NInputNumber,
  NSelect,
  NSpace,
  NSwitch,
  NText,
} from 'naive-ui'
import Add16Regular from '@vicons/fluent/Add16Regular'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

type RuleType = 'allow' | 'disallow'

type RobotsRule = {
  type: RuleType
  path: string
}

type RobotsGroup = {
  id: string
  userAgents: string[]
  rules: RobotsRule[]
  crawlDelay: number | null
}

type RobotsState = {
  groups: RobotsGroup[]
  sitemaps: string[]
  host: string
  advanced: boolean
}

const { t } = useI18n()

const createGroupId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

const createGroup = (overrides: Partial<RobotsGroup> = {}): RobotsGroup => ({
  id: createGroupId(),
  userAgents: ['*'],
  rules: [],
  crawlDelay: null,
  ...overrides,
})

const defaultState = (): RobotsState => ({
  groups: [createGroup({ rules: [{ type: 'disallow', path: '/admin/' }] })],
  sitemaps: ['https://example.com/sitemap.xml'],
  host: '',
  advanced: false,
})

const state = useStorage<RobotsState>('tools:robots-txt-generator:state', defaultState())

const ruleOptions = computed(() => [
  { label: t('ruleAllow'), value: 'allow' },
  { label: t('ruleDisallow'), value: 'disallow' },
])

const createRule = (): RobotsRule => ({ type: 'disallow', path: '' })
const createUserAgent = () => ''
const createSitemap = () => ''

const addGroup = () => {
  state.value.groups.push(createGroup())
}

const removeGroup = (index: number) => {
  if (state.value.groups.length <= 1) return
  state.value.groups.splice(index, 1)
}

const applyPreset = (preset: 'allowAll' | 'disallowAll' | 'blockAdmin') => {
  switch (preset) {
    case 'allowAll':
      state.value.groups = [createGroup({ rules: [] })]
      break
    case 'disallowAll':
      state.value.groups = [createGroup({ rules: [{ type: 'disallow', path: '/' }] })]
      break
    case 'blockAdmin':
      state.value.groups = [createGroup({ rules: [{ type: 'disallow', path: '/admin/' }] })]
      break
    default:
      break
  }
}

const buildRobotsTxt = (input: RobotsState) => {
  const sections: string[] = []

  if (input.advanced) {
    const host = input.host.trim()
    if (host) sections.push(`Host: ${host}`)
  }

  const groupSections = input.groups
    .map((group) => {
      const lines: string[] = []
      const userAgents = group.userAgents.map((agent) => agent.trim()).filter(Boolean)
      const normalizedAgents = userAgents.length > 0 ? userAgents : ['*']

      normalizedAgents.forEach((agent) => lines.push(`User-agent: ${agent}`))

      group.rules
        .map((rule) => ({ ...rule, path: rule.path.trim() }))
        .filter((rule) => rule.path.length > 0)
        .forEach((rule) => {
          const directive = rule.type === 'allow' ? 'Allow' : 'Disallow'
          lines.push(`${directive}: ${rule.path}`)
        })

      if (
        input.advanced &&
        typeof group.crawlDelay === 'number' &&
        !Number.isNaN(group.crawlDelay)
      ) {
        lines.push(`Crawl-delay: ${group.crawlDelay}`)
      }

      return lines.join('\n')
    })
    .filter((section) => section.trim().length > 0)

  if (groupSections.length > 0) {
    sections.push(groupSections.join('\n\n'))
  }

  const sitemapLines = input.sitemaps
    .map((sitemap) => sitemap.trim())
    .filter(Boolean)
    .map((sitemap) => `Sitemap: ${sitemap}`)

  if (sitemapLines.length > 0) {
    sections.push(sitemapLines.join('\n'))
  }

  return sections.join('\n\n')
}

const robotsContent = computed(() => buildRobotsTxt(state.value))
const hasOutput = computed(() => robotsContent.value.trim().length > 0)
const downloadBlob = computed(() => {
  if (!hasOutput.value) return null
  return new Blob([robotsContent.value], { type: 'text/plain' })
})
const downloadUrl = useObjectUrl(downloadBlob)
const downloadHref = computed(() =>
  hasOutput.value ? (downloadUrl.value ?? undefined) : undefined,
)
</script>

<i18n lang="json">
{
  "en": {
    "presets": "Presets",
    "presetAllowAll": "Allow all",
    "presetDisallowAll": "Disallow all",
    "presetBlockAdmin": "Block /admin/",
    "siteSettings": "Site settings",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Add sitemap",
    "advancedSettings": "Advanced settings",
    "host": "Host (non-standard)",
    "hostPlaceholder": "example.com",
    "groups": "User-agent groups",
    "groupTitle": "Group {index}",
    "removeGroup": "Remove group",
    "userAgents": "User agents",
    "userAgentPlaceholder": "* or Googlebot",
    "userAgentHint": "Empty user-agent defaults to *.",
    "addUserAgent": "Add user-agent",
    "rules": "Rules",
    "ruleHint": "No rules means allow all.",
    "ruleAllow": "Allow",
    "ruleDisallow": "Disallow",
    "pathPlaceholder": "/path/",
    "addRule": "Add rule",
    "crawlDelay": "Crawl-delay (seconds)",
    "crawlDelayPlaceholder": "e.g. 10",
    "addGroup": "Add group",
    "output": "Output",
    "download": "Download robots.txt",
    "emptyOutput": "No content to export yet.",
    "securityNoticeTitle": "Robots.txt is not security",
    "securityNotice": "Robots.txt is public and does not block access. Use server-side access control for sensitive content."
  },
  "zh": {
    "presets": "预设",
    "presetAllowAll": "允许全部",
    "presetDisallowAll": "禁止全部",
    "presetBlockAdmin": "屏蔽 /admin/",
    "siteSettings": "站点设置",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "添加 Sitemap",
    "advancedSettings": "高级设置",
    "host": "Host（非标准）",
    "hostPlaceholder": "example.com",
    "groups": "User-agent 分组",
    "groupTitle": "分组 {index}",
    "removeGroup": "移除分组",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* 或 Googlebot",
    "userAgentHint": "留空将默认使用 *。",
    "addUserAgent": "添加 User-agent",
    "rules": "规则",
    "ruleHint": "没有规则表示允许全部。",
    "ruleAllow": "允许",
    "ruleDisallow": "禁止",
    "pathPlaceholder": "/path/",
    "addRule": "添加规则",
    "crawlDelay": "Crawl-delay（秒）",
    "crawlDelayPlaceholder": "例如 10",
    "addGroup": "添加分组",
    "output": "输出",
    "download": "下载 robots.txt",
    "emptyOutput": "暂无可导出的内容。",
    "securityNoticeTitle": "Robots.txt 不是安全机制",
    "securityNotice": "Robots.txt 是公开的，并不会阻止访问。敏感内容请使用服务端访问控制。"
  },
  "zh-CN": {
    "presets": "预设",
    "presetAllowAll": "允许全部",
    "presetDisallowAll": "禁止全部",
    "presetBlockAdmin": "屏蔽 /admin/",
    "siteSettings": "站点设置",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "添加 Sitemap",
    "advancedSettings": "高级设置",
    "host": "Host（非标准）",
    "hostPlaceholder": "example.com",
    "groups": "User-agent 分组",
    "groupTitle": "分组 {index}",
    "removeGroup": "移除分组",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* 或 Googlebot",
    "userAgentHint": "留空将默认使用 *。",
    "addUserAgent": "添加 User-agent",
    "rules": "规则",
    "ruleHint": "没有规则表示允许全部。",
    "ruleAllow": "允许",
    "ruleDisallow": "禁止",
    "pathPlaceholder": "/path/",
    "addRule": "添加规则",
    "crawlDelay": "Crawl-delay（秒）",
    "crawlDelayPlaceholder": "例如 10",
    "addGroup": "添加分组",
    "output": "输出",
    "download": "下载 robots.txt",
    "emptyOutput": "暂无可导出的内容。",
    "securityNoticeTitle": "Robots.txt 不是安全机制",
    "securityNotice": "Robots.txt 是公开的，并不会阻止访问。敏感内容请使用服务端访问控制。"
  },
  "zh-TW": {
    "presets": "預設",
    "presetAllowAll": "允許全部",
    "presetDisallowAll": "禁止全部",
    "presetBlockAdmin": "封鎖 /admin/",
    "siteSettings": "站點設定",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "新增 Sitemap",
    "advancedSettings": "進階設定",
    "host": "Host（非標準）",
    "hostPlaceholder": "example.com",
    "groups": "User-agent 分組",
    "groupTitle": "分組 {index}",
    "removeGroup": "移除分組",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* 或 Googlebot",
    "userAgentHint": "留空將預設為 *。",
    "addUserAgent": "新增 User-agent",
    "rules": "規則",
    "ruleHint": "沒有規則表示允許全部。",
    "ruleAllow": "允許",
    "ruleDisallow": "禁止",
    "pathPlaceholder": "/path/",
    "addRule": "新增規則",
    "crawlDelay": "Crawl-delay（秒）",
    "crawlDelayPlaceholder": "例如 10",
    "addGroup": "新增分組",
    "output": "輸出",
    "download": "下載 robots.txt",
    "emptyOutput": "目前沒有可匯出的內容。",
    "securityNoticeTitle": "Robots.txt 不是安全機制",
    "securityNotice": "Robots.txt 為公開檔案，無法阻擋存取。敏感內容請使用伺服器端存取控制。"
  },
  "zh-HK": {
    "presets": "預設",
    "presetAllowAll": "允許全部",
    "presetDisallowAll": "禁止全部",
    "presetBlockAdmin": "封鎖 /admin/",
    "siteSettings": "站點設定",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "新增 Sitemap",
    "advancedSettings": "進階設定",
    "host": "Host（非標準）",
    "hostPlaceholder": "example.com",
    "groups": "User-agent 分組",
    "groupTitle": "分組 {index}",
    "removeGroup": "移除分組",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* 或 Googlebot",
    "userAgentHint": "留空將預設為 *。",
    "addUserAgent": "新增 User-agent",
    "rules": "規則",
    "ruleHint": "沒有規則表示允許全部。",
    "ruleAllow": "允許",
    "ruleDisallow": "禁止",
    "pathPlaceholder": "/path/",
    "addRule": "新增規則",
    "crawlDelay": "Crawl-delay（秒）",
    "crawlDelayPlaceholder": "例如 10",
    "addGroup": "新增分組",
    "output": "輸出",
    "download": "下載 robots.txt",
    "emptyOutput": "目前沒有可匯出的內容。",
    "securityNoticeTitle": "Robots.txt 不是安全機制",
    "securityNotice": "Robots.txt 為公開檔案，無法阻擋存取。敏感內容請使用伺服器端存取控制。"
  },
  "es": {
    "presets": "Preajustes",
    "presetAllowAll": "Permitir todo",
    "presetDisallowAll": "Bloquear todo",
    "presetBlockAdmin": "Bloquear /admin/",
    "siteSettings": "Configuración del sitio",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Agregar sitemap",
    "advancedSettings": "Configuración avanzada",
    "host": "Host (no estándar)",
    "hostPlaceholder": "example.com",
    "groups": "Grupos de user-agent",
    "groupTitle": "Grupo {index}",
    "removeGroup": "Eliminar grupo",
    "userAgents": "User-agents",
    "userAgentPlaceholder": "* o Googlebot",
    "userAgentHint": "Si está vacío, se usa *.",
    "addUserAgent": "Agregar user-agent",
    "rules": "Reglas",
    "ruleHint": "Sin reglas significa permitir todo.",
    "ruleAllow": "Permitir",
    "ruleDisallow": "Bloquear",
    "pathPlaceholder": "/path/",
    "addRule": "Agregar regla",
    "crawlDelay": "Crawl-delay (segundos)",
    "crawlDelayPlaceholder": "p. ej., 10",
    "addGroup": "Agregar grupo",
    "output": "Salida",
    "download": "Descargar robots.txt",
    "emptyOutput": "Aún no hay contenido para exportar.",
    "securityNoticeTitle": "Robots.txt no es seguridad",
    "securityNotice": "Robots.txt es público y no bloquea el acceso. Usa control de acceso del servidor para contenido sensible."
  },
  "fr": {
    "presets": "Préréglages",
    "presetAllowAll": "Tout autoriser",
    "presetDisallowAll": "Tout interdire",
    "presetBlockAdmin": "Bloquer /admin/",
    "siteSettings": "Paramètres du site",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Ajouter un sitemap",
    "advancedSettings": "Paramètres avancés",
    "host": "Host (non standard)",
    "hostPlaceholder": "example.com",
    "groups": "Groupes user-agent",
    "groupTitle": "Groupe {index}",
    "removeGroup": "Supprimer le groupe",
    "userAgents": "User-agents",
    "userAgentPlaceholder": "* ou Googlebot",
    "userAgentHint": "Vide = * par défaut.",
    "addUserAgent": "Ajouter un user-agent",
    "rules": "Règles",
    "ruleHint": "Aucune règle signifie tout autoriser.",
    "ruleAllow": "Autoriser",
    "ruleDisallow": "Interdire",
    "pathPlaceholder": "/path/",
    "addRule": "Ajouter une règle",
    "crawlDelay": "Crawl-delay (secondes)",
    "crawlDelayPlaceholder": "ex. 10",
    "addGroup": "Ajouter un groupe",
    "output": "Sortie",
    "download": "Télécharger robots.txt",
    "emptyOutput": "Aucun contenu à exporter pour l'instant.",
    "securityNoticeTitle": "Robots.txt n'est pas une sécurité",
    "securityNotice": "Robots.txt est public et ne bloque pas l'accès. Utilisez un contrôle d'accès côté serveur pour les contenus sensibles."
  },
  "de": {
    "presets": "Voreinstellungen",
    "presetAllowAll": "Alles erlauben",
    "presetDisallowAll": "Alles sperren",
    "presetBlockAdmin": "/admin/ sperren",
    "siteSettings": "Website-Einstellungen",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Sitemap hinzufügen",
    "advancedSettings": "Erweiterte Einstellungen",
    "host": "Host (nicht standardisiert)",
    "hostPlaceholder": "example.com",
    "groups": "User-Agent-Gruppen",
    "groupTitle": "Gruppe {index}",
    "removeGroup": "Gruppe entfernen",
    "userAgents": "User-Agents",
    "userAgentPlaceholder": "* oder Googlebot",
    "userAgentHint": "Leer bedeutet standardmäßig *.",
    "addUserAgent": "User-Agent hinzufügen",
    "rules": "Regeln",
    "ruleHint": "Keine Regeln bedeutet alles erlauben.",
    "ruleAllow": "Erlauben",
    "ruleDisallow": "Sperren",
    "pathPlaceholder": "/path/",
    "addRule": "Regel hinzufügen",
    "crawlDelay": "Crawl-delay (Sekunden)",
    "crawlDelayPlaceholder": "z. B. 10",
    "addGroup": "Gruppe hinzufügen",
    "output": "Ausgabe",
    "download": "robots.txt herunterladen",
    "emptyOutput": "Noch kein Inhalt zum Exportieren.",
    "securityNoticeTitle": "Robots.txt ist keine Sicherheit",
    "securityNotice": "Robots.txt ist öffentlich und blockiert keinen Zugriff. Verwenden Sie serverseitige Zugriffskontrolle für sensible Inhalte."
  },
  "it": {
    "presets": "Preimpostazioni",
    "presetAllowAll": "Consenti tutto",
    "presetDisallowAll": "Blocca tutto",
    "presetBlockAdmin": "Blocca /admin/",
    "siteSettings": "Impostazioni del sito",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Aggiungi sitemap",
    "advancedSettings": "Impostazioni avanzate",
    "host": "Host (non standard)",
    "hostPlaceholder": "example.com",
    "groups": "Gruppi user-agent",
    "groupTitle": "Gruppo {index}",
    "removeGroup": "Rimuovi gruppo",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* o Googlebot",
    "userAgentHint": "Vuoto = * di default.",
    "addUserAgent": "Aggiungi user-agent",
    "rules": "Regole",
    "ruleHint": "Nessuna regola significa consentire tutto.",
    "ruleAllow": "Consenti",
    "ruleDisallow": "Blocca",
    "pathPlaceholder": "/path/",
    "addRule": "Aggiungi regola",
    "crawlDelay": "Crawl-delay (secondi)",
    "crawlDelayPlaceholder": "es. 10",
    "addGroup": "Aggiungi gruppo",
    "output": "Output",
    "download": "Scarica robots.txt",
    "emptyOutput": "Nessun contenuto da esportare.",
    "securityNoticeTitle": "Robots.txt non è sicurezza",
    "securityNotice": "Robots.txt è pubblico e non blocca l'accesso. Usa un controllo di accesso lato server per contenuti sensibili."
  },
  "ja": {
    "presets": "プリセット",
    "presetAllowAll": "全て許可",
    "presetDisallowAll": "全て禁止",
    "presetBlockAdmin": "/admin/ をブロック",
    "siteSettings": "サイト設定",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Sitemap を追加",
    "advancedSettings": "詳細設定",
    "host": "Host（非標準）",
    "hostPlaceholder": "example.com",
    "groups": "User-agent グループ",
    "groupTitle": "グループ {index}",
    "removeGroup": "グループを削除",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* または Googlebot",
    "userAgentHint": "空の場合は * が使われます。",
    "addUserAgent": "User-agent を追加",
    "rules": "ルール",
    "ruleHint": "ルールなしは全て許可です。",
    "ruleAllow": "許可",
    "ruleDisallow": "禁止",
    "pathPlaceholder": "/path/",
    "addRule": "ルールを追加",
    "crawlDelay": "Crawl-delay（秒）",
    "crawlDelayPlaceholder": "例: 10",
    "addGroup": "グループを追加",
    "output": "出力",
    "download": "robots.txt をダウンロード",
    "emptyOutput": "エクスポートする内容がありません。",
    "securityNoticeTitle": "Robots.txt はセキュリティではありません",
    "securityNotice": "Robots.txt は公開情報であり、アクセスを遮断しません。機密コンテンツはサーバー側のアクセス制御を使用してください。"
  },
  "ko": {
    "presets": "프리셋",
    "presetAllowAll": "모두 허용",
    "presetDisallowAll": "모두 차단",
    "presetBlockAdmin": "/admin/ 차단",
    "siteSettings": "사이트 설정",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Sitemap 추가",
    "advancedSettings": "고급 설정",
    "host": "Host(비표준)",
    "hostPlaceholder": "example.com",
    "groups": "User-agent 그룹",
    "groupTitle": "그룹 {index}",
    "removeGroup": "그룹 삭제",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* 또는 Googlebot",
    "userAgentHint": "비어 있으면 기본값은 * 입니다.",
    "addUserAgent": "User-agent 추가",
    "rules": "규칙",
    "ruleHint": "규칙이 없으면 모두 허용됩니다.",
    "ruleAllow": "허용",
    "ruleDisallow": "차단",
    "pathPlaceholder": "/path/",
    "addRule": "규칙 추가",
    "crawlDelay": "Crawl-delay(초)",
    "crawlDelayPlaceholder": "예: 10",
    "addGroup": "그룹 추가",
    "output": "출력",
    "download": "robots.txt 다운로드",
    "emptyOutput": "내보낼 내용이 없습니다.",
    "securityNoticeTitle": "Robots.txt는 보안이 아닙니다",
    "securityNotice": "Robots.txt는 공개되어 있으며 접근을 차단하지 않습니다. 민감한 콘텐츠는 서버 측 접근 제어를 사용하세요."
  },
  "ru": {
    "presets": "Предустановки",
    "presetAllowAll": "Разрешить всё",
    "presetDisallowAll": "Запретить всё",
    "presetBlockAdmin": "Блокировать /admin/",
    "siteSettings": "Настройки сайта",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Добавить sitemap",
    "advancedSettings": "Расширенные настройки",
    "host": "Host (нестандартный)",
    "hostPlaceholder": "example.com",
    "groups": "Группы User-agent",
    "groupTitle": "Группа {index}",
    "removeGroup": "Удалить группу",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* или Googlebot",
    "userAgentHint": "Пусто = по умолчанию *.",
    "addUserAgent": "Добавить user-agent",
    "rules": "Правила",
    "ruleHint": "Нет правил — значит разрешить всё.",
    "ruleAllow": "Разрешить",
    "ruleDisallow": "Запретить",
    "pathPlaceholder": "/path/",
    "addRule": "Добавить правило",
    "crawlDelay": "Crawl-delay (секунды)",
    "crawlDelayPlaceholder": "например, 10",
    "addGroup": "Добавить группу",
    "output": "Вывод",
    "download": "Скачать robots.txt",
    "emptyOutput": "Нет содержимого для экспорта.",
    "securityNoticeTitle": "Robots.txt не является защитой",
    "securityNotice": "Robots.txt публичен и не блокирует доступ. Для чувствительного контента используйте серверный контроль доступа."
  },
  "pt": {
    "presets": "Predefinições",
    "presetAllowAll": "Permitir tudo",
    "presetDisallowAll": "Bloquear tudo",
    "presetBlockAdmin": "Bloquear /admin/",
    "siteSettings": "Configurações do site",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Adicionar sitemap",
    "advancedSettings": "Configurações avançadas",
    "host": "Host (não padrão)",
    "hostPlaceholder": "example.com",
    "groups": "Grupos de user-agent",
    "groupTitle": "Grupo {index}",
    "removeGroup": "Remover grupo",
    "userAgents": "User-agents",
    "userAgentPlaceholder": "* ou Googlebot",
    "userAgentHint": "Vazio significa * por padrão.",
    "addUserAgent": "Adicionar user-agent",
    "rules": "Regras",
    "ruleHint": "Sem regras significa permitir tudo.",
    "ruleAllow": "Permitir",
    "ruleDisallow": "Bloquear",
    "pathPlaceholder": "/path/",
    "addRule": "Adicionar regra",
    "crawlDelay": "Crawl-delay (segundos)",
    "crawlDelayPlaceholder": "ex.: 10",
    "addGroup": "Adicionar grupo",
    "output": "Saída",
    "download": "Baixar robots.txt",
    "emptyOutput": "Ainda não há conteúdo para exportar.",
    "securityNoticeTitle": "Robots.txt não é segurança",
    "securityNotice": "Robots.txt é público e não bloqueia o acesso. Use controle de acesso no servidor para conteúdo sensível."
  },
  "ar": {
    "presets": "الإعدادات المسبقة",
    "presetAllowAll": "السماح للجميع",
    "presetDisallowAll": "الحظر للجميع",
    "presetBlockAdmin": "حظر /admin/",
    "siteSettings": "إعدادات الموقع",
    "sitemaps": "خرائط الموقع",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "إضافة خريطة موقع",
    "advancedSettings": "إعدادات متقدمة",
    "host": "Host (غير قياسي)",
    "hostPlaceholder": "example.com",
    "groups": "مجموعات User-agent",
    "groupTitle": "المجموعة {index}",
    "removeGroup": "إزالة المجموعة",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* أو Googlebot",
    "userAgentHint": "عند تركه فارغًا يكون الافتراضي *.",
    "addUserAgent": "إضافة User-agent",
    "rules": "القواعد",
    "ruleHint": "عدم وجود قواعد يعني السماح للجميع.",
    "ruleAllow": "سماح",
    "ruleDisallow": "حظر",
    "pathPlaceholder": "/path/",
    "addRule": "إضافة قاعدة",
    "crawlDelay": "Crawl-delay (ثوانٍ)",
    "crawlDelayPlaceholder": "مثال: 10",
    "addGroup": "إضافة مجموعة",
    "output": "الإخراج",
    "download": "تنزيل robots.txt",
    "emptyOutput": "لا يوجد محتوى للتصدير بعد.",
    "securityNoticeTitle": "Robots.txt ليس أمانًا",
    "securityNotice": "Robots.txt ملف عام ولا يمنع الوصول. استخدم التحكم في الوصول من جهة الخادم للمحتوى الحساس."
  },
  "hi": {
    "presets": "प्रीसेट",
    "presetAllowAll": "सबको अनुमति दें",
    "presetDisallowAll": "सबको रोकें",
    "presetBlockAdmin": "/admin/ ब्लॉक करें",
    "siteSettings": "साइट सेटिंग्स",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Sitemap जोड़ें",
    "advancedSettings": "उन्नत सेटिंग्स",
    "host": "Host (गैर-मानक)",
    "hostPlaceholder": "example.com",
    "groups": "User-agent समूह",
    "groupTitle": "समूह {index}",
    "removeGroup": "समूह हटाएं",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* या Googlebot",
    "userAgentHint": "खाली होने पर डिफ़ॉल्ट * होगा।",
    "addUserAgent": "User-agent जोड़ें",
    "rules": "नियम",
    "ruleHint": "नियम न होने का मतलब सबको अनुमति है।",
    "ruleAllow": "अनुमति दें",
    "ruleDisallow": "रोकें",
    "pathPlaceholder": "/path/",
    "addRule": "नियम जोड़ें",
    "crawlDelay": "Crawl-delay (सेकंड)",
    "crawlDelayPlaceholder": "जैसे 10",
    "addGroup": "समूह जोड़ें",
    "output": "आउटपुट",
    "download": "robots.txt डाउनलोड करें",
    "emptyOutput": "अभी निर्यात करने के लिए कोई सामग्री नहीं है।",
    "securityNoticeTitle": "Robots.txt सुरक्षा नहीं है",
    "securityNotice": "Robots.txt सार्वजनिक है और एक्सेस नहीं रोकता। संवेदनशील सामग्री के लिए सर्वर-साइड एक्सेस नियंत्रण उपयोग करें।"
  },
  "tr": {
    "presets": "Ön ayarlar",
    "presetAllowAll": "Hepsine izin ver",
    "presetDisallowAll": "Hepsini engelle",
    "presetBlockAdmin": "/admin/ engelle",
    "siteSettings": "Site ayarları",
    "sitemaps": "Sitemap'ler",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Sitemap ekle",
    "advancedSettings": "Gelişmiş ayarlar",
    "host": "Host (standart dışı)",
    "hostPlaceholder": "example.com",
    "groups": "User-agent grupları",
    "groupTitle": "Grup {index}",
    "removeGroup": "Grubu kaldır",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* veya Googlebot",
    "userAgentHint": "Boşsa varsayılan * olur.",
    "addUserAgent": "User-agent ekle",
    "rules": "Kurallar",
    "ruleHint": "Kural yoksa hepsi izinlidir.",
    "ruleAllow": "İzin ver",
    "ruleDisallow": "Engelle",
    "pathPlaceholder": "/path/",
    "addRule": "Kural ekle",
    "crawlDelay": "Crawl-delay (saniye)",
    "crawlDelayPlaceholder": "örn. 10",
    "addGroup": "Grup ekle",
    "output": "Çıktı",
    "download": "robots.txt indir",
    "emptyOutput": "Henüz dışa aktarılacak içerik yok.",
    "securityNoticeTitle": "Robots.txt güvenlik değildir",
    "securityNotice": "Robots.txt herkese açıktır ve erişimi engellemez. Hassas içerik için sunucu tarafı erişim kontrolü kullanın."
  },
  "nl": {
    "presets": "Voorinstellingen",
    "presetAllowAll": "Alles toestaan",
    "presetDisallowAll": "Alles blokkeren",
    "presetBlockAdmin": "/admin/ blokkeren",
    "siteSettings": "Site-instellingen",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Sitemap toevoegen",
    "advancedSettings": "Geavanceerde instellingen",
    "host": "Host (niet-standaard)",
    "hostPlaceholder": "example.com",
    "groups": "User-agentgroepen",
    "groupTitle": "Groep {index}",
    "removeGroup": "Groep verwijderen",
    "userAgents": "User-agents",
    "userAgentPlaceholder": "* of Googlebot",
    "userAgentHint": "Leeg betekent standaard *.",
    "addUserAgent": "User-agent toevoegen",
    "rules": "Regels",
    "ruleHint": "Geen regels betekent alles toestaan.",
    "ruleAllow": "Toestaan",
    "ruleDisallow": "Blokkeren",
    "pathPlaceholder": "/path/",
    "addRule": "Regel toevoegen",
    "crawlDelay": "Crawl-delay (seconden)",
    "crawlDelayPlaceholder": "bijv. 10",
    "addGroup": "Groep toevoegen",
    "output": "Uitvoer",
    "download": "robots.txt downloaden",
    "emptyOutput": "Nog geen inhoud om te exporteren.",
    "securityNoticeTitle": "Robots.txt is geen beveiliging",
    "securityNotice": "Robots.txt is openbaar en blokkeert geen toegang. Gebruik server-side toegangscontrole voor gevoelige inhoud."
  },
  "sv": {
    "presets": "Förinställningar",
    "presetAllowAll": "Tillåt allt",
    "presetDisallowAll": "Blockera allt",
    "presetBlockAdmin": "Blockera /admin/",
    "siteSettings": "Webbplatsinställningar",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Lägg till sitemap",
    "advancedSettings": "Avancerade inställningar",
    "host": "Host (icke-standard)",
    "hostPlaceholder": "example.com",
    "groups": "User-agent-grupper",
    "groupTitle": "Grupp {index}",
    "removeGroup": "Ta bort grupp",
    "userAgents": "User-agents",
    "userAgentPlaceholder": "* eller Googlebot",
    "userAgentHint": "Tomt betyder * som standard.",
    "addUserAgent": "Lägg till user-agent",
    "rules": "Regler",
    "ruleHint": "Inga regler betyder tillåt allt.",
    "ruleAllow": "Tillåt",
    "ruleDisallow": "Blockera",
    "pathPlaceholder": "/path/",
    "addRule": "Lägg till regel",
    "crawlDelay": "Crawl-delay (sekunder)",
    "crawlDelayPlaceholder": "t.ex. 10",
    "addGroup": "Lägg till grupp",
    "output": "Utdata",
    "download": "Ladda ner robots.txt",
    "emptyOutput": "Inget att exportera ännu.",
    "securityNoticeTitle": "Robots.txt är inte säkerhet",
    "securityNotice": "Robots.txt är offentligt och blockerar inte åtkomst. Använd serverbaserad åtkomstkontroll för känsligt innehåll."
  },
  "pl": {
    "presets": "Ustawienia wstępne",
    "presetAllowAll": "Zezwól na wszystko",
    "presetDisallowAll": "Zablokuj wszystko",
    "presetBlockAdmin": "Zablokuj /admin/",
    "siteSettings": "Ustawienia witryny",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Dodaj sitemap",
    "advancedSettings": "Ustawienia zaawansowane",
    "host": "Host (niestandardowy)",
    "hostPlaceholder": "example.com",
    "groups": "Grupy User-agent",
    "groupTitle": "Grupa {index}",
    "removeGroup": "Usuń grupę",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* lub Googlebot",
    "userAgentHint": "Puste oznacza domyślnie *.",
    "addUserAgent": "Dodaj user-agent",
    "rules": "Reguły",
    "ruleHint": "Brak reguł oznacza zezwolenie na wszystko.",
    "ruleAllow": "Zezwól",
    "ruleDisallow": "Zablokuj",
    "pathPlaceholder": "/path/",
    "addRule": "Dodaj regułę",
    "crawlDelay": "Crawl-delay (sekundy)",
    "crawlDelayPlaceholder": "np. 10",
    "addGroup": "Dodaj grupę",
    "output": "Wyjście",
    "download": "Pobierz robots.txt",
    "emptyOutput": "Brak treści do eksportu.",
    "securityNoticeTitle": "Robots.txt to nie zabezpieczenie",
    "securityNotice": "Robots.txt jest publiczny i nie blokuje dostępu. Użyj kontroli dostępu po stronie serwera dla wrażliwych treści."
  },
  "vi": {
    "presets": "Mẫu nhanh",
    "presetAllowAll": "Cho phép tất cả",
    "presetDisallowAll": "Chặn tất cả",
    "presetBlockAdmin": "Chặn /admin/",
    "siteSettings": "Cài đặt trang",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Thêm sitemap",
    "advancedSettings": "Cài đặt nâng cao",
    "host": "Host (không chuẩn)",
    "hostPlaceholder": "example.com",
    "groups": "Nhóm user-agent",
    "groupTitle": "Nhóm {index}",
    "removeGroup": "Xóa nhóm",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* hoặc Googlebot",
    "userAgentHint": "Để trống sẽ mặc định là *.",
    "addUserAgent": "Thêm user-agent",
    "rules": "Quy tắc",
    "ruleHint": "Không có quy tắc nghĩa là cho phép tất cả.",
    "ruleAllow": "Cho phép",
    "ruleDisallow": "Chặn",
    "pathPlaceholder": "/path/",
    "addRule": "Thêm quy tắc",
    "crawlDelay": "Crawl-delay (giây)",
    "crawlDelayPlaceholder": "ví dụ 10",
    "addGroup": "Thêm nhóm",
    "output": "Kết quả",
    "download": "Tải robots.txt",
    "emptyOutput": "Chưa có nội dung để xuất.",
    "securityNoticeTitle": "Robots.txt không phải bảo mật",
    "securityNotice": "Robots.txt là công khai và không chặn truy cập. Hãy dùng kiểm soát truy cập phía máy chủ cho nội dung nhạy cảm."
  },
  "th": {
    "presets": "ค่าที่ตั้งล่วงหน้า",
    "presetAllowAll": "อนุญาตทั้งหมด",
    "presetDisallowAll": "บล็อกทั้งหมด",
    "presetBlockAdmin": "บล็อก /admin/",
    "siteSettings": "การตั้งค่าเว็บไซต์",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "เพิ่ม sitemap",
    "advancedSettings": "การตั้งค่าขั้นสูง",
    "host": "Host (ไม่เป็นมาตรฐาน)",
    "hostPlaceholder": "example.com",
    "groups": "กลุ่ม User-agent",
    "groupTitle": "กลุ่ม {index}",
    "removeGroup": "ลบกลุ่ม",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* หรือ Googlebot",
    "userAgentHint": "เว้นว่างจะใช้ค่าเริ่มต้นเป็น *",
    "addUserAgent": "เพิ่ม User-agent",
    "rules": "กฎ",
    "ruleHint": "ไม่มีรายการหมายถึงอนุญาตทั้งหมด",
    "ruleAllow": "อนุญาต",
    "ruleDisallow": "บล็อก",
    "pathPlaceholder": "/path/",
    "addRule": "เพิ่มกฎ",
    "crawlDelay": "Crawl-delay (วินาที)",
    "crawlDelayPlaceholder": "เช่น 10",
    "addGroup": "เพิ่มกลุ่ม",
    "output": "ผลลัพธ์",
    "download": "ดาวน์โหลด robots.txt",
    "emptyOutput": "ยังไม่มีเนื้อหาสำหรับส่งออก",
    "securityNoticeTitle": "Robots.txt ไม่ใช่ความปลอดภัย",
    "securityNotice": "Robots.txt เป็นไฟล์สาธารณะและไม่สามารถป้องกันการเข้าถึงได้ ใช้การควบคุมการเข้าถึงฝั่งเซิร์ฟเวอร์สำหรับเนื้อหาที่ละเอียดอ่อน"
  },
  "id": {
    "presets": "Preset",
    "presetAllowAll": "Izinkan semua",
    "presetDisallowAll": "Blokir semua",
    "presetBlockAdmin": "Blokir /admin/",
    "siteSettings": "Pengaturan situs",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Tambahkan sitemap",
    "advancedSettings": "Pengaturan lanjutan",
    "host": "Host (non-standar)",
    "hostPlaceholder": "example.com",
    "groups": "Grup user-agent",
    "groupTitle": "Grup {index}",
    "removeGroup": "Hapus grup",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* atau Googlebot",
    "userAgentHint": "Kosong berarti * secara default.",
    "addUserAgent": "Tambahkan user-agent",
    "rules": "Aturan",
    "ruleHint": "Tanpa aturan berarti izinkan semua.",
    "ruleAllow": "Izinkan",
    "ruleDisallow": "Blokir",
    "pathPlaceholder": "/path/",
    "addRule": "Tambahkan aturan",
    "crawlDelay": "Crawl-delay (detik)",
    "crawlDelayPlaceholder": "mis. 10",
    "addGroup": "Tambahkan grup",
    "output": "Keluaran",
    "download": "Unduh robots.txt",
    "emptyOutput": "Belum ada konten untuk diekspor.",
    "securityNoticeTitle": "Robots.txt bukan keamanan",
    "securityNotice": "Robots.txt bersifat publik dan tidak memblokir akses. Gunakan kontrol akses sisi server untuk konten sensitif."
  },
  "he": {
    "presets": "הגדרות קבועות",
    "presetAllowAll": "לאפשר הכול",
    "presetDisallowAll": "לחסום הכול",
    "presetBlockAdmin": "לחסום /admin/",
    "siteSettings": "הגדרות אתר",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "הוסף sitemap",
    "advancedSettings": "הגדרות מתקדמות",
    "host": "Host (לא תקני)",
    "hostPlaceholder": "example.com",
    "groups": "קבוצות User-agent",
    "groupTitle": "קבוצה {index}",
    "removeGroup": "הסר קבוצה",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* או Googlebot",
    "userAgentHint": "ריק הוא ברירת המחדל *.",
    "addUserAgent": "הוסף User-agent",
    "rules": "כללים",
    "ruleHint": "אין כללים משמעותו לאפשר הכול.",
    "ruleAllow": "אפשר",
    "ruleDisallow": "חסום",
    "pathPlaceholder": "/path/",
    "addRule": "הוסף כלל",
    "crawlDelay": "Crawl-delay (שניות)",
    "crawlDelayPlaceholder": "לדוגמה 10",
    "addGroup": "הוסף קבוצה",
    "output": "פלט",
    "download": "הורד robots.txt",
    "emptyOutput": "אין תוכן לייצוא עדיין.",
    "securityNoticeTitle": "Robots.txt אינו אבטחה",
    "securityNotice": "Robots.txt הוא קובץ ציבורי ואינו חוסם גישה. השתמש בבקרת גישה בצד השרת לתוכן רגיש."
  },
  "ms": {
    "presets": "Pratetap",
    "presetAllowAll": "Benarkan semua",
    "presetDisallowAll": "Sekat semua",
    "presetBlockAdmin": "Sekat /admin/",
    "siteSettings": "Tetapan laman",
    "sitemaps": "Sitemap",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Tambah sitemap",
    "advancedSettings": "Tetapan lanjutan",
    "host": "Host (tidak standard)",
    "hostPlaceholder": "example.com",
    "groups": "Kumpulan user-agent",
    "groupTitle": "Kumpulan {index}",
    "removeGroup": "Buang kumpulan",
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* atau Googlebot",
    "userAgentHint": "Kosong akan guna * secara lalai.",
    "addUserAgent": "Tambah user-agent",
    "rules": "Peraturan",
    "ruleHint": "Tiada peraturan bermaksud benarkan semua.",
    "ruleAllow": "Benarkan",
    "ruleDisallow": "Sekat",
    "pathPlaceholder": "/path/",
    "addRule": "Tambah peraturan",
    "crawlDelay": "Crawl-delay (saat)",
    "crawlDelayPlaceholder": "cth. 10",
    "addGroup": "Tambah kumpulan",
    "output": "Output",
    "download": "Muat turun robots.txt",
    "emptyOutput": "Belum ada kandungan untuk dieksport.",
    "securityNoticeTitle": "Robots.txt bukan keselamatan",
    "securityNotice": "Robots.txt adalah awam dan tidak menyekat akses. Gunakan kawalan akses pelayan untuk kandungan sensitif."
  },
  "no": {
    "presets": "Forhåndsinnstillinger",
    "presetAllowAll": "Tillat alt",
    "presetDisallowAll": "Blokker alt",
    "presetBlockAdmin": "Blokker /admin/",
    "siteSettings": "Nettstedsinnstillinger",
    "sitemaps": "Sitemaps",
    "sitemapPlaceholder": "https://example.com/sitemap.xml",
    "addSitemap": "Legg til sitemap",
    "advancedSettings": "Avanserte innstillinger",
    "host": "Host (ikke-standard)",
    "hostPlaceholder": "example.com",
    "groups": "User-agent-grupper",
    "groupTitle": "Gruppe {index}",
    "removeGroup": "Fjern gruppe",
    "userAgents": "User-agents",
    "userAgentPlaceholder": "* eller Googlebot",
    "userAgentHint": "Tomt betyr * som standard.",
    "addUserAgent": "Legg til user-agent",
    "rules": "Regler",
    "ruleHint": "Ingen regler betyr tillat alt.",
    "ruleAllow": "Tillat",
    "ruleDisallow": "Blokker",
    "pathPlaceholder": "/path/",
    "addRule": "Legg til regel",
    "crawlDelay": "Crawl-delay (sekunder)",
    "crawlDelayPlaceholder": "f.eks. 10",
    "addGroup": "Legg til gruppe",
    "output": "Utdata",
    "download": "Last ned robots.txt",
    "emptyOutput": "Ingen innhold å eksportere ennå.",
    "securityNoticeTitle": "Robots.txt er ikke sikkerhet",
    "securityNotice": "Robots.txt er offentlig og blokkerer ikke tilgang. Bruk tilgangskontroll på serversiden for sensitivt innhold."
  }
}
</i18n>
