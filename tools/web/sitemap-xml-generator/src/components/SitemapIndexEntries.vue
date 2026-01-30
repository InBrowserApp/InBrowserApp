<template>
  <ToolSectionHeader>{{ t('sitemapEntries') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="16">
      <n-card
        v-for="(entry, index) in sitemaps"
        :key="entry.id"
        size="small"
        data-testid="sitemap-card"
      >
        <n-flex align="center" justify="space-between">
          <n-text strong>{{ t('sitemapEntryTitle', { index: index + 1 }) }}</n-text>
          <n-button
            text
            :disabled="sitemaps.length === 1"
            :data-testid="`remove-sitemap-${index}`"
            @click="removeSitemap(index)"
          >
            <template #icon>
              <n-icon :component="Delete16Regular" />
            </template>
            {{ t('removeSitemap') }}
          </n-button>
        </n-flex>

        <n-space vertical :size="12" style="margin-top: 12px">
          <n-text depth="3">{{ t('sitemapLoc') }}</n-text>
          <n-input
            v-model:value="entry.loc"
            placeholder="https://example.com/sitemap.xml"
            :data-testid="`sitemap-loc-${index}`"
          />

          <n-text depth="3">{{ t('sitemapLastmod') }}</n-text>
          <n-input v-model:value="entry.lastmod" placeholder="2024-01-15" />
        </n-space>
      </n-card>

      <n-button type="primary" dashed data-testid="add-sitemap" @click="addSitemap">
        <template #icon>
          <n-icon :component="Add16Regular" />
        </template>
        {{ t('addSitemap') }}
      </n-button>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NCard, NFlex, NIcon, NInput, NSpace, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import Add16Regular from '@vicons/fluent/Add16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import { createSitemapEntry } from '../sitemapState'
import type { SitemapEntry } from '../sitemapState'

const sitemaps = defineModel<SitemapEntry[]>('sitemaps', { required: true })

const { t } = useI18n()

const addSitemap = () => {
  sitemaps.value.push(createSitemapEntry())
}

const removeSitemap = (index: number) => {
  if (sitemaps.value.length <= 1) return
  sitemaps.value.splice(index, 1)
}
</script>

<i18n lang="json">
{
  "en": {
    "sitemapEntries": "Sitemap entries",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Remove sitemap",
    "addSitemap": "Add sitemap",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "Last modified"
  },
  "zh": {
    "sitemapEntries": "Sitemap 列表",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "移除 Sitemap",
    "addSitemap": "添加 Sitemap",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "最后修改"
  },
  "zh-CN": {
    "sitemapEntries": "Sitemap 列表",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "移除 Sitemap",
    "addSitemap": "添加 Sitemap",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "最后修改"
  },
  "zh-TW": {
    "sitemapEntries": "Sitemap 清單",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "移除 Sitemap",
    "addSitemap": "新增 Sitemap",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "最後修改"
  },
  "zh-HK": {
    "sitemapEntries": "Sitemap 清單",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "移除 Sitemap",
    "addSitemap": "新增 Sitemap",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "最後修改"
  },
  "es": {
    "sitemapEntries": "Entradas de sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Eliminar sitemap",
    "addSitemap": "Agregar sitemap",
    "sitemapLoc": "URL del sitemap",
    "sitemapLastmod": "Última modificación"
  },
  "fr": {
    "sitemapEntries": "Entrées de sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Supprimer le sitemap",
    "addSitemap": "Ajouter un sitemap",
    "sitemapLoc": "URL du sitemap",
    "sitemapLastmod": "Dernière modification"
  },
  "de": {
    "sitemapEntries": "Sitemap-Einträge",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Sitemap entfernen",
    "addSitemap": "Sitemap hinzufügen",
    "sitemapLoc": "Sitemap-URL",
    "sitemapLastmod": "Zuletzt geändert"
  },
  "it": {
    "sitemapEntries": "Voci sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Rimuovi sitemap",
    "addSitemap": "Aggiungi sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "Ultima modifica"
  },
  "ja": {
    "sitemapEntries": "Sitemap エントリ",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Sitemap を削除",
    "addSitemap": "Sitemap を追加",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "最終更新"
  },
  "ko": {
    "sitemapEntries": "Sitemap 항목",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Sitemap 제거",
    "addSitemap": "Sitemap 추가",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "마지막 수정"
  },
  "ru": {
    "sitemapEntries": "Записи sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Удалить sitemap",
    "addSitemap": "Добавить sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "Последнее изменение"
  },
  "pt": {
    "sitemapEntries": "Entradas de sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Remover sitemap",
    "addSitemap": "Adicionar sitemap",
    "sitemapLoc": "URL do sitemap",
    "sitemapLastmod": "Última modificação"
  },
  "ar": {
    "sitemapEntries": "إدخالات sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "إزالة sitemap",
    "addSitemap": "إضافة sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "آخر تعديل"
  },
  "hi": {
    "sitemapEntries": "Sitemap एंट्री",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Sitemap हटाएं",
    "addSitemap": "Sitemap जोड़ें",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "अंतिम संशोधन"
  },
  "tr": {
    "sitemapEntries": "Sitemap girişleri",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Sitemap kaldır",
    "addSitemap": "Sitemap ekle",
    "sitemapLoc": "Sitemap URL",
    "sitemapLastmod": "Son değişiklik"
  },
  "nl": {
    "sitemapEntries": "Sitemap-items",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Sitemap verwijderen",
    "addSitemap": "Sitemap toevoegen",
    "sitemapLoc": "Sitemap-URL",
    "sitemapLastmod": "Laatst gewijzigd"
  },
  "sv": {
    "sitemapEntries": "Sitemap-poster",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Ta bort sitemap",
    "addSitemap": "Lägg till sitemap",
    "sitemapLoc": "Sitemap-URL",
    "sitemapLastmod": "Senast ändrad"
  },
  "pl": {
    "sitemapEntries": "Wpisy sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Usuń sitemap",
    "addSitemap": "Dodaj sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "Ostatnia modyfikacja"
  },
  "vi": {
    "sitemapEntries": "Mục sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Xóa sitemap",
    "addSitemap": "Thêm sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "Cập nhật lần cuối"
  },
  "th": {
    "sitemapEntries": "รายการ sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "ลบ sitemap",
    "addSitemap": "เพิ่ม sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "แก้ไขล่าสุด"
  },
  "id": {
    "sitemapEntries": "Entri sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Hapus sitemap",
    "addSitemap": "Tambah sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "Terakhir diubah"
  },
  "he": {
    "sitemapEntries": "רשומות sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "הסר sitemap",
    "addSitemap": "הוסף sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "שינוי אחרון"
  },
  "ms": {
    "sitemapEntries": "Entri sitemap",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Buang sitemap",
    "addSitemap": "Tambah sitemap",
    "sitemapLoc": "URL sitemap",
    "sitemapLastmod": "Terakhir diubah"
  },
  "no": {
    "sitemapEntries": "Sitemap-oppføringer",
    "sitemapEntryTitle": "Sitemap {index}",
    "removeSitemap": "Fjern sitemap",
    "addSitemap": "Legg til sitemap",
    "sitemapLoc": "Sitemap-URL",
    "sitemapLastmod": "Sist endret"
  }
}
</i18n>
