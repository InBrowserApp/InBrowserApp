<template>
  <ToolSectionHeader>{{ t('urlEntries') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="16">
      <n-card v-for="(entry, index) in urls" :key="entry.id" size="small" data-testid="url-card">
        <n-flex align="center" justify="space-between">
          <n-text strong>{{ t('urlEntryTitle', { index: index + 1 }) }}</n-text>
          <n-button
            text
            :disabled="urls.length === 1"
            @click="removeUrl(index)"
            :data-testid="`remove-url-${index}`"
          >
            <template #icon>
              <n-icon :component="Delete16Regular" />
            </template>
            {{ t('removeUrl') }}
          </n-button>
        </n-flex>

        <n-space vertical :size="12" style="margin-top: 12px">
          <n-text depth="3">{{ t('loc') }}</n-text>
          <n-input
            v-model:value="entry.loc"
            placeholder="https://example.com/page"
            :data-testid="`url-loc-${index}`"
          />

          <n-text depth="3">{{ t('lastmod') }}</n-text>
          <n-input v-model:value="entry.lastmod" placeholder="2024-01-15" />

          <n-text depth="3">{{ t('changefreq') }}</n-text>
          <n-select v-model:value="entry.changefreq" :options="changefreqOptions" clearable />

          <n-text depth="3">{{ t('priority') }}</n-text>
          <n-input-number
            v-model:value="entry.priority"
            :min="0"
            :max="1"
            :step="0.1"
            :precision="1"
            placeholder="0.5"
          />

          <SitemapUrlEntryImages v-model:images="entry.images" />
          <SitemapUrlEntryVideos v-model:videos="entry.videos" />
          <SitemapUrlEntryNews v-model:news="entry.news" />
        </n-space>
      </n-card>

      <n-button type="primary" dashed @click="addUrl" data-testid="add-url">
        <template #icon>
          <n-icon :component="Add16Regular" />
        </template>
        {{ t('addUrl') }}
      </n-button>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import {
  NButton,
  NCard,
  NFlex,
  NIcon,
  NInput,
  NInputNumber,
  NSelect,
  NSpace,
  NText,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import Add16Regular from '@vicons/fluent/Add16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import { changefreqOptions, createUrlEntry } from '../sitemapState'
import type { UrlEntry } from '../sitemapState'
import SitemapUrlEntryImages from './SitemapUrlEntryImages.vue'
import SitemapUrlEntryNews from './SitemapUrlEntryNews.vue'
import SitemapUrlEntryVideos from './SitemapUrlEntryVideos.vue'

const urls = defineModel<UrlEntry[]>('urls', { required: true })

const { t } = useI18n()

const addUrl = () => {
  urls.value.push(createUrlEntry())
}

const removeUrl = (index: number) => {
  if (urls.value.length <= 1) return
  urls.value.splice(index, 1)
}
</script>

<i18n lang="json">
{
  "en": {
    "urlEntries": "URL entries",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Remove URL",
    "addUrl": "Add URL",
    "loc": "URL",
    "lastmod": "Last modified",
    "changefreq": "Change frequency",
    "priority": "Priority"
  },
  "zh": {
    "urlEntries": "URL 列表",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "移除 URL",
    "addUrl": "添加 URL",
    "loc": "URL",
    "lastmod": "最后修改",
    "changefreq": "更新频率",
    "priority": "优先级"
  },
  "zh-CN": {
    "urlEntries": "URL 列表",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "移除 URL",
    "addUrl": "添加 URL",
    "loc": "URL",
    "lastmod": "最后修改",
    "changefreq": "更新频率",
    "priority": "优先级"
  },
  "zh-TW": {
    "urlEntries": "URL 清單",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "移除 URL",
    "addUrl": "新增 URL",
    "loc": "URL",
    "lastmod": "最後修改",
    "changefreq": "更新頻率",
    "priority": "優先順序"
  },
  "zh-HK": {
    "urlEntries": "URL 清單",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "移除 URL",
    "addUrl": "新增 URL",
    "loc": "URL",
    "lastmod": "最後修改",
    "changefreq": "更新頻率",
    "priority": "優先順序"
  },
  "es": {
    "urlEntries": "Entradas de URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Eliminar URL",
    "addUrl": "Agregar URL",
    "loc": "URL",
    "lastmod": "Última modificación",
    "changefreq": "Frecuencia de cambio",
    "priority": "Prioridad"
  },
  "fr": {
    "urlEntries": "Entrées d'URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Supprimer l'URL",
    "addUrl": "Ajouter une URL",
    "loc": "URL",
    "lastmod": "Dernière modification",
    "changefreq": "Fréquence de changement",
    "priority": "Priorité"
  },
  "de": {
    "urlEntries": "URL-Einträge",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "URL entfernen",
    "addUrl": "URL hinzufügen",
    "loc": "URL",
    "lastmod": "Zuletzt geändert",
    "changefreq": "Änderungshäufigkeit",
    "priority": "Priorität"
  },
  "it": {
    "urlEntries": "Voci URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Rimuovi URL",
    "addUrl": "Aggiungi URL",
    "loc": "URL",
    "lastmod": "Ultima modifica",
    "changefreq": "Frequenza di modifica",
    "priority": "Priorità"
  },
  "ja": {
    "urlEntries": "URL エントリ",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "URL を削除",
    "addUrl": "URL を追加",
    "loc": "URL",
    "lastmod": "最終更新",
    "changefreq": "更新頻度",
    "priority": "優先度"
  },
  "ko": {
    "urlEntries": "URL 항목",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "URL 제거",
    "addUrl": "URL 추가",
    "loc": "URL",
    "lastmod": "마지막 수정",
    "changefreq": "변경 빈도",
    "priority": "우선순위"
  },
  "ru": {
    "urlEntries": "Записи URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Удалить URL",
    "addUrl": "Добавить URL",
    "loc": "URL",
    "lastmod": "Последнее изменение",
    "changefreq": "Частота изменений",
    "priority": "Приоритет"
  },
  "pt": {
    "urlEntries": "Entradas de URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Remover URL",
    "addUrl": "Adicionar URL",
    "loc": "URL",
    "lastmod": "Última modificação",
    "changefreq": "Frequência de mudança",
    "priority": "Prioridade"
  },
  "ar": {
    "urlEntries": "إدخالات URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "إزالة URL",
    "addUrl": "إضافة URL",
    "loc": "URL",
    "lastmod": "آخر تعديل",
    "changefreq": "تكرار التغيير",
    "priority": "الأولوية"
  },
  "hi": {
    "urlEntries": "URL एंट्री",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "URL हटाएं",
    "addUrl": "URL जोड़ें",
    "loc": "URL",
    "lastmod": "अंतिम संशोधन",
    "changefreq": "परिवर्तन आवृत्ति",
    "priority": "प्राथमिकता"
  },
  "tr": {
    "urlEntries": "URL girişleri",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "URL kaldır",
    "addUrl": "URL ekle",
    "loc": "URL",
    "lastmod": "Son değişiklik",
    "changefreq": "Değişim sıklığı",
    "priority": "Öncelik"
  },
  "nl": {
    "urlEntries": "URL-items",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "URL verwijderen",
    "addUrl": "URL toevoegen",
    "loc": "URL",
    "lastmod": "Laatst gewijzigd",
    "changefreq": "Wijzigingsfrequentie",
    "priority": "Prioriteit"
  },
  "sv": {
    "urlEntries": "URL-poster",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Ta bort URL",
    "addUrl": "Lägg till URL",
    "loc": "URL",
    "lastmod": "Senast ändrad",
    "changefreq": "Ändringsfrekvens",
    "priority": "Prioritet"
  },
  "pl": {
    "urlEntries": "Wpisy URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Usuń URL",
    "addUrl": "Dodaj URL",
    "loc": "URL",
    "lastmod": "Ostatnia modyfikacja",
    "changefreq": "Częstotliwość zmian",
    "priority": "Priorytet"
  },
  "vi": {
    "urlEntries": "Mục URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Xóa URL",
    "addUrl": "Thêm URL",
    "loc": "URL",
    "lastmod": "Cập nhật lần cuối",
    "changefreq": "Tần suất thay đổi",
    "priority": "Độ ưu tiên"
  },
  "th": {
    "urlEntries": "รายการ URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "ลบ URL",
    "addUrl": "เพิ่ม URL",
    "loc": "URL",
    "lastmod": "แก้ไขล่าสุด",
    "changefreq": "ความถี่การเปลี่ยนแปลง",
    "priority": "ลำดับความสำคัญ"
  },
  "id": {
    "urlEntries": "Entri URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Hapus URL",
    "addUrl": "Tambah URL",
    "loc": "URL",
    "lastmod": "Terakhir diubah",
    "changefreq": "Frekuensi perubahan",
    "priority": "Prioritas"
  },
  "he": {
    "urlEntries": "רשומות URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "הסר URL",
    "addUrl": "הוסף URL",
    "loc": "URL",
    "lastmod": "שינוי אחרון",
    "changefreq": "תדירות שינוי",
    "priority": "עדיפות"
  },
  "ms": {
    "urlEntries": "Entri URL",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Buang URL",
    "addUrl": "Tambah URL",
    "loc": "URL",
    "lastmod": "Terakhir diubah",
    "changefreq": "Kekerapan perubahan",
    "priority": "Keutamaan"
  },
  "no": {
    "urlEntries": "URL-oppføringer",
    "urlEntryTitle": "URL {index}",
    "removeUrl": "Fjern URL",
    "addUrl": "Legg til URL",
    "loc": "URL",
    "lastmod": "Sist endret",
    "changefreq": "Endringsfrekvens",
    "priority": "Prioritet"
  }
}
</i18n>
