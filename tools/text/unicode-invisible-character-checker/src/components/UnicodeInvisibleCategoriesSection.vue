<template>
  <ToolSectionHeader>{{ t('categories-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-form-item :label="t('categories-label')" :show-feedback="false">
      <n-checkbox-group v-model:value="value" class="category-group">
        <n-checkbox v-for="category in categories" :key="category.value" :value="category.value">
          {{ categoryLabels[category.value as InvisibleCategory] }}
        </n-checkbox>
      </n-checkbox-group>
    </n-form-item>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCheckbox, NCheckboxGroup, NFormItem } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { INVISIBLE_CATEGORIES, type InvisibleCategory } from '../utils'

const value = defineModel<InvisibleCategory[]>('value', { required: true })
const { t } = useI18n()

const categories = INVISIBLE_CATEGORIES
const categoryLabels = computed<Record<InvisibleCategory, string>>(() => ({
  'zero-width': t('category.zero-width'),
  'bidi-control': t('category.bidi-control'),
  'space-like': t('category.space-like'),
  format: t('category.format'),
}))
</script>

<style scoped>
.category-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>

<i18n lang="json">
{
  "en": {
    "categories-title": "Detection",
    "categories-label": "Include categories",
    "category.zero-width": "Zero-width",
    "category.bidi-control": "Bidi control",
    "category.space-like": "Special spaces",
    "category.format": "Format controls"
  },
  "zh": {
    "categories-title": "检测",
    "categories-label": "包含类别",
    "category.zero-width": "零宽",
    "category.bidi-control": "双向控制",
    "category.space-like": "特殊空格",
    "category.format": "格式控制"
  },
  "zh-CN": {
    "categories-title": "检测",
    "categories-label": "包含类别",
    "category.zero-width": "零宽",
    "category.bidi-control": "双向控制",
    "category.space-like": "特殊空格",
    "category.format": "格式控制"
  },
  "zh-TW": {
    "categories-title": "偵測",
    "categories-label": "包含類別",
    "category.zero-width": "零寬",
    "category.bidi-control": "雙向控制",
    "category.space-like": "特殊空白",
    "category.format": "格式控制"
  },
  "zh-HK": {
    "categories-title": "偵測",
    "categories-label": "包含類別",
    "category.zero-width": "零寬",
    "category.bidi-control": "雙向控制",
    "category.space-like": "特殊空白",
    "category.format": "格式控制"
  },
  "es": {
    "categories-title": "Detección",
    "categories-label": "Incluir categorías",
    "category.zero-width": "Cero ancho",
    "category.bidi-control": "Control bidi",
    "category.space-like": "Espacios especiales",
    "category.format": "Controles de formato"
  },
  "fr": {
    "categories-title": "Détection",
    "categories-label": "Inclure des catégories",
    "category.zero-width": "Zéro largeur",
    "category.bidi-control": "Contrôle bidi",
    "category.space-like": "Espaces spéciaux",
    "category.format": "Contrôles de format"
  },
  "de": {
    "categories-title": "Erkennung",
    "categories-label": "Kategorien einschließen",
    "category.zero-width": "Nullbreite",
    "category.bidi-control": "Bidi-Steuerung",
    "category.space-like": "Sonderabstände",
    "category.format": "Formatsteuerzeichen"
  },
  "it": {
    "categories-title": "Rilevamento",
    "categories-label": "Includi categorie",
    "category.zero-width": "Zero-width",
    "category.bidi-control": "Controllo bidi",
    "category.space-like": "Spazi speciali",
    "category.format": "Controlli di formato"
  },
  "ja": {
    "categories-title": "検出",
    "categories-label": "カテゴリを含める",
    "category.zero-width": "ゼロ幅",
    "category.bidi-control": "双方向制御",
    "category.space-like": "特殊スペース",
    "category.format": "書式制御"
  },
  "ko": {
    "categories-title": "감지",
    "categories-label": "카테고리 포함",
    "category.zero-width": "제로 폭",
    "category.bidi-control": "양방향 제어",
    "category.space-like": "특수 공백",
    "category.format": "서식 제어"
  },
  "ru": {
    "categories-title": "Обнаружение",
    "categories-label": "Включить категории",
    "category.zero-width": "Нулевой ширины",
    "category.bidi-control": "Bidi-контроль",
    "category.space-like": "Специальные пробелы",
    "category.format": "Форматирующие"
  },
  "pt": {
    "categories-title": "Detecção",
    "categories-label": "Incluir categorias",
    "category.zero-width": "Largura zero",
    "category.bidi-control": "Controle bidi",
    "category.space-like": "Espaços especiais",
    "category.format": "Controles de formato"
  },
  "ar": {
    "categories-title": "الكشف",
    "categories-label": "تضمين الفئات",
    "category.zero-width": "عديم العرض",
    "category.bidi-control": "تحكم ثنائي الاتجاه",
    "category.space-like": "مسافات خاصة",
    "category.format": "عناصر تحكم التنسيق"
  },
  "hi": {
    "categories-title": "पता लगाना",
    "categories-label": "श्रेणियां शामिल करें",
    "category.zero-width": "शून्य-चौड़ाई",
    "category.bidi-control": "बिडी नियंत्रण",
    "category.space-like": "विशेष स्पेस",
    "category.format": "फ़ॉर्मैट नियंत्रण"
  },
  "tr": {
    "categories-title": "Algılama",
    "categories-label": "Kategorileri dahil et",
    "category.zero-width": "Sıfır genişlik",
    "category.bidi-control": "Bidi kontrol",
    "category.space-like": "Özel boşluklar",
    "category.format": "Biçim denetimleri"
  },
  "nl": {
    "categories-title": "Detectie",
    "categories-label": "Categorieën opnemen",
    "category.zero-width": "Nulbreedte",
    "category.bidi-control": "Bidi-besturing",
    "category.space-like": "Speciale spaties",
    "category.format": "Opmaakbesturing"
  },
  "sv": {
    "categories-title": "Upptäckt",
    "categories-label": "Inkludera kategorier",
    "category.zero-width": "Nollbredd",
    "category.bidi-control": "Bidi-kontroll",
    "category.space-like": "Speciella blanksteg",
    "category.format": "Formatkontroller"
  },
  "pl": {
    "categories-title": "Wykrywanie",
    "categories-label": "Uwzględnij kategorie",
    "category.zero-width": "Zerowa szerokość",
    "category.bidi-control": "Kontrola bidi",
    "category.space-like": "Specjalne spacje",
    "category.format": "Kontrole formatu"
  },
  "vi": {
    "categories-title": "Phát hiện",
    "categories-label": "Bao gồm danh mục",
    "category.zero-width": "Không độ rộng",
    "category.bidi-control": "Điều khiển bidi",
    "category.space-like": "Khoảng trắng đặc biệt",
    "category.format": "Điều khiển định dạng"
  },
  "th": {
    "categories-title": "การตรวจจับ",
    "categories-label": "รวมหมวดหมู่",
    "category.zero-width": "กว้างศูนย์",
    "category.bidi-control": "การควบคุมไบดิ",
    "category.space-like": "ช่องว่างพิเศษ",
    "category.format": "การควบคุมรูปแบบ"
  },
  "id": {
    "categories-title": "Deteksi",
    "categories-label": "Sertakan kategori",
    "category.zero-width": "Lebar nol",
    "category.bidi-control": "Kontrol bidi",
    "category.space-like": "Spasi khusus",
    "category.format": "Kontrol format"
  },
  "he": {
    "categories-title": "זיהוי",
    "categories-label": "כלול קטגוריות",
    "category.zero-width": "רוחב אפס",
    "category.bidi-control": "בקרת bidi",
    "category.space-like": "רווחים מיוחדים",
    "category.format": "בקרות עיצוב"
  },
  "ms": {
    "categories-title": "Pengesanan",
    "categories-label": "Sertakan kategori",
    "category.zero-width": "Lebar sifar",
    "category.bidi-control": "Kawalan bidi",
    "category.space-like": "Ruang khas",
    "category.format": "Kawalan format"
  },
  "no": {
    "categories-title": "Deteksjon",
    "categories-label": "Inkluder kategorier",
    "category.zero-width": "Nullbredde",
    "category.bidi-control": "Bidi-kontroll",
    "category.space-like": "Spesielle mellomrom",
    "category.format": "Formateringskontroller"
  }
}
</i18n>
