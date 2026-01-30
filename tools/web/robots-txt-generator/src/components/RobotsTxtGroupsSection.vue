<template>
  <ToolSectionHeader>{{ t('groups') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="16">
      <n-card
        v-for="(group, index) in groups"
        :key="group.id"
        size="small"
        data-testid="group-card"
      >
        <n-flex align="center" justify="space-between">
          <n-text strong>{{ t('groupTitle', { index: index + 1 }) }}</n-text>
          <n-button text :disabled="groups.length === 1" @click="removeGroup(index)">
            <template #icon>
              <n-icon :component="Delete16Regular" />
            </template>
            {{ t('removeGroup') }}
          </n-button>
        </n-flex>

        <n-space vertical :size="12" style="margin-top: 12px">
          <RobotsTxtUserAgentsSection v-model:user-agents="group.userAgents" />
          <RobotsTxtRulesSection
            v-model:rules="group.rules"
            v-model:crawl-delay="group.crawlDelay"
            :advanced="advanced"
            :group-index="index"
          />
        </n-space>
      </n-card>

      <n-button type="primary" dashed data-testid="add-group" @click="addGroup">
        <template #icon>
          <n-icon :component="Add16Regular" />
        </template>
        {{ t('addGroup') }}
      </n-button>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NCard, NFlex, NIcon, NSpace, NText } from 'naive-ui'
import Add16Regular from '@vicons/fluent/Add16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { createGroup, type RobotsGroup } from '../robotsState'
import RobotsTxtRulesSection from './RobotsTxtRulesSection.vue'
import RobotsTxtUserAgentsSection from './RobotsTxtUserAgentsSection.vue'

const groups = defineModel<RobotsGroup[]>('groups', { required: true })

defineProps<{
  advanced: boolean
}>()

const { t } = useI18n()

const addGroup = () => {
  groups.value.push(createGroup())
}

const removeGroup = (index: number) => {
  if (groups.value.length <= 1) return
  groups.value.splice(index, 1)
}
</script>

<i18n lang="json">
{
  "en": {
    "groups": "User-agent groups",
    "groupTitle": "Group {index}",
    "removeGroup": "Remove group",
    "addGroup": "Add group"
  },
  "zh": {
    "groups": "User-agent 分组",
    "groupTitle": "分组 {index}",
    "removeGroup": "移除分组",
    "addGroup": "添加分组"
  },
  "zh-CN": {
    "groups": "User-agent 分组",
    "groupTitle": "分组 {index}",
    "removeGroup": "移除分组",
    "addGroup": "添加分组"
  },
  "zh-TW": {
    "groups": "User-agent 分組",
    "groupTitle": "分組 {index}",
    "removeGroup": "移除分組",
    "addGroup": "新增分組"
  },
  "zh-HK": {
    "groups": "User-agent 分組",
    "groupTitle": "分組 {index}",
    "removeGroup": "移除分組",
    "addGroup": "新增分組"
  },
  "es": {
    "groups": "Grupos de user-agent",
    "groupTitle": "Grupo {index}",
    "removeGroup": "Eliminar grupo",
    "addGroup": "Agregar grupo"
  },
  "fr": {
    "groups": "Groupes user-agent",
    "groupTitle": "Groupe {index}",
    "removeGroup": "Supprimer le groupe",
    "addGroup": "Ajouter un groupe"
  },
  "de": {
    "groups": "User-Agent-Gruppen",
    "groupTitle": "Gruppe {index}",
    "removeGroup": "Gruppe entfernen",
    "addGroup": "Gruppe hinzufügen"
  },
  "it": {
    "groups": "Gruppi user-agent",
    "groupTitle": "Gruppo {index}",
    "removeGroup": "Rimuovi gruppo",
    "addGroup": "Aggiungi gruppo"
  },
  "ja": {
    "groups": "User-agent グループ",
    "groupTitle": "グループ {index}",
    "removeGroup": "グループを削除",
    "addGroup": "グループを追加"
  },
  "ko": {
    "groups": "User-agent 그룹",
    "groupTitle": "그룹 {index}",
    "removeGroup": "그룹 삭제",
    "addGroup": "그룹 추가"
  },
  "ru": {
    "groups": "Группы User-agent",
    "groupTitle": "Группа {index}",
    "removeGroup": "Удалить группу",
    "addGroup": "Добавить группу"
  },
  "pt": {
    "groups": "Grupos de user-agent",
    "groupTitle": "Grupo {index}",
    "removeGroup": "Remover grupo",
    "addGroup": "Adicionar grupo"
  },
  "ar": {
    "groups": "مجموعات User-agent",
    "groupTitle": "المجموعة {index}",
    "removeGroup": "إزالة المجموعة",
    "addGroup": "إضافة مجموعة"
  },
  "hi": {
    "groups": "User-agent समूह",
    "groupTitle": "समूह {index}",
    "removeGroup": "समूह हटाएं",
    "addGroup": "समूह जोड़ें"
  },
  "tr": {
    "groups": "User-agent grupları",
    "groupTitle": "Grup {index}",
    "removeGroup": "Grubu kaldır",
    "addGroup": "Grup ekle"
  },
  "nl": {
    "groups": "User-agentgroepen",
    "groupTitle": "Groep {index}",
    "removeGroup": "Groep verwijderen",
    "addGroup": "Groep toevoegen"
  },
  "sv": {
    "groups": "User-agent-grupper",
    "groupTitle": "Grupp {index}",
    "removeGroup": "Ta bort grupp",
    "addGroup": "Lägg till grupp"
  },
  "pl": {
    "groups": "Grupy User-agent",
    "groupTitle": "Grupa {index}",
    "removeGroup": "Usuń grupę",
    "addGroup": "Dodaj grupę"
  },
  "vi": {
    "groups": "Nhóm user-agent",
    "groupTitle": "Nhóm {index}",
    "removeGroup": "Xóa nhóm",
    "addGroup": "Thêm nhóm"
  },
  "th": {
    "groups": "กลุ่ม User-agent",
    "groupTitle": "กลุ่ม {index}",
    "removeGroup": "ลบกลุ่ม",
    "addGroup": "เพิ่มกลุ่ม"
  },
  "id": {
    "groups": "Grup user-agent",
    "groupTitle": "Grup {index}",
    "removeGroup": "Hapus grup",
    "addGroup": "Tambahkan grup"
  },
  "he": {
    "groups": "קבוצות User-agent",
    "groupTitle": "קבוצה {index}",
    "removeGroup": "הסר קבוצה",
    "addGroup": "הוסף קבוצה"
  },
  "ms": {
    "groups": "Kumpulan user-agent",
    "groupTitle": "Kumpulan {index}",
    "removeGroup": "Buang kumpulan",
    "addGroup": "Tambah kumpulan"
  },
  "no": {
    "groups": "User-agent-grupper",
    "groupTitle": "Gruppe {index}",
    "removeGroup": "Fjern gruppe",
    "addGroup": "Legg til gruppe"
  }
}
</i18n>
