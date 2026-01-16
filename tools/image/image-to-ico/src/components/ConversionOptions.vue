<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>

    <n-form label-placement="top">
      <n-grid cols="1 m:2" :x-gap="16" :y-gap="12" responsive="screen">
        <n-form-item-gi :label="t('sizes')" :show-feedback="false" :span="2">
          <n-checkbox-group v-model:value="sizes" :disabled="isConverting">
            <n-space wrap>
              <n-checkbox v-for="size in sizeOptions" :key="size" :value="size">
                {{ size }}x{{ size }}
              </n-checkbox>
            </n-space>
          </n-checkbox-group>
          <n-text v-if="sizes.length === 0" depth="3">
            {{ t('selectAtLeastOneSize') }}
          </n-text>
          <span v-else style="display: none"></span>
        </n-form-item-gi>

        <n-form-item-gi :label="t('background')" :show-feedback="false">
          <n-flex align="center" :size="12" wrap>
            <n-switch v-model:value="backgroundEnabled" :disabled="isConverting" />
            <n-text depth="3">{{ t('backgroundHint') }}</n-text>
            <n-color-picker
              v-if="backgroundEnabled"
              v-model:value="backgroundColor"
              :modes="['hex']"
              :show-alpha="true"
              size="small"
              :disabled="isConverting"
            />
          </n-flex>
        </n-form-item-gi>

        <n-form-item-gi :label="t('optimize')" :show-feedback="false">
          <n-flex align="center" :size="12">
            <n-switch v-model:value="optimize" :disabled="isConverting" />
            <n-text depth="3">{{ t('optimizeHint') }}</n-text>
          </n-flex>
        </n-form-item-gi>
      </n-grid>

      <n-button
        type="primary"
        :loading="isConverting"
        :disabled="!canConvert"
        @click="$emit('convert')"
        style="margin-top: 12px"
      >
        <template #icon>
          <n-icon><Wand16Regular /></n-icon>
        </template>
        {{ t('generate') }}
      </n-button>
    </n-form>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  NForm,
  NFormItemGi,
  NCheckboxGroup,
  NCheckbox,
  NSpace,
  NSwitch,
  NColorPicker,
  NButton,
  NGrid,
  NIcon,
  NText,
  NFlex,
} from 'naive-ui'
import { Wand16Regular } from '@shared/icons/fluent'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()

defineProps<{
  isConverting: boolean
  canConvert: boolean
}>()

defineEmits<{
  convert: []
}>()

const sizes = defineModel<number[]>('sizes', { required: true })
const backgroundEnabled = defineModel<boolean>('backgroundEnabled', { required: true })
const backgroundColor = defineModel<string>('backgroundColor', { required: true })
const optimize = defineModel<boolean>('optimize', { required: true })

const sizeOptions = [16, 24, 32, 48, 64, 128, 256]
</script>

<i18n lang="json">
{
  "en": {
    "options": "Conversion Options",
    "sizes": "Sizes (px)",
    "selectAtLeastOneSize": "Select at least one size",
    "background": "Background",
    "backgroundHint": "Fill transparent areas with a color",
    "optimize": "Optimize PNG",
    "optimizeHint": "Lossless compression for smaller ICO size",
    "generate": "Generate ICO"
  },
  "zh": {
    "options": "转换选项",
    "sizes": "尺寸 (px)",
    "selectAtLeastOneSize": "请至少选择一个尺寸",
    "background": "背景",
    "backgroundHint": "用颜色填充透明区域",
    "optimize": "PNG 优化",
    "optimizeHint": "无损压缩以减小 ICO 体积",
    "generate": "生成 ICO"
  },
  "zh-CN": {
    "options": "转换选项",
    "sizes": "尺寸 (px)",
    "selectAtLeastOneSize": "请至少选择一个尺寸",
    "background": "背景",
    "backgroundHint": "用颜色填充透明区域",
    "optimize": "PNG 优化",
    "optimizeHint": "无损压缩以减小 ICO 体积",
    "generate": "生成 ICO"
  },
  "zh-TW": {
    "options": "轉換選項",
    "sizes": "尺寸 (px)",
    "selectAtLeastOneSize": "請至少選擇一個尺寸",
    "background": "背景",
    "backgroundHint": "以顏色填滿透明區域",
    "optimize": "PNG 最佳化",
    "optimizeHint": "無損壓縮以減小 ICO 大小",
    "generate": "產生 ICO"
  },
  "zh-HK": {
    "options": "轉換選項",
    "sizes": "尺寸 (px)",
    "selectAtLeastOneSize": "請至少選擇一個尺寸",
    "background": "背景",
    "backgroundHint": "以顏色填滿透明區域",
    "optimize": "PNG 最佳化",
    "optimizeHint": "無損壓縮以減小 ICO 大小",
    "generate": "產生 ICO"
  },
  "es": {
    "options": "Opciones de conversión",
    "sizes": "Tamaños (px)",
    "selectAtLeastOneSize": "Selecciona al menos un tamaño",
    "background": "Fondo",
    "backgroundHint": "Rellena las áreas transparentes con un color",
    "optimize": "Optimizar PNG",
    "optimizeHint": "Compresión sin pérdida para un ICO más pequeño",
    "generate": "Generar ICO"
  },
  "fr": {
    "options": "Options de conversion",
    "sizes": "Tailles (px)",
    "selectAtLeastOneSize": "Sélectionnez au moins une taille",
    "background": "Fond",
    "backgroundHint": "Remplir les zones transparentes avec une couleur",
    "optimize": "Optimiser PNG",
    "optimizeHint": "Compression sans perte pour un ICO plus petit",
    "generate": "Générer ICO"
  },
  "de": {
    "options": "Konvertierungsoptionen",
    "sizes": "Größen (px)",
    "selectAtLeastOneSize": "Wählen Sie mindestens eine Größe",
    "background": "Hintergrund",
    "backgroundHint": "Transparente Bereiche mit einer Farbe füllen",
    "optimize": "PNG optimieren",
    "optimizeHint": "Verlustfreie Komprimierung für kleinere ICOs",
    "generate": "ICO erstellen"
  },
  "it": {
    "options": "Opzioni di conversione",
    "sizes": "Dimensioni (px)",
    "selectAtLeastOneSize": "Seleziona almeno una dimensione",
    "background": "Sfondo",
    "backgroundHint": "Riempi le aree trasparenti con un colore",
    "optimize": "Ottimizza PNG",
    "optimizeHint": "Compressione senza perdita per un ICO più piccolo",
    "generate": "Genera ICO"
  },
  "ja": {
    "options": "変換オプション",
    "sizes": "サイズ (px)",
    "selectAtLeastOneSize": "少なくとも1つのサイズを選択してください",
    "background": "背景",
    "backgroundHint": "透明部分を色で塗りつぶす",
    "optimize": "PNG を最適化",
    "optimizeHint": "可逆圧縮で ICO を小さくします",
    "generate": "ICO を生成"
  },
  "ko": {
    "options": "변환 옵션",
    "sizes": "크기 (px)",
    "selectAtLeastOneSize": "최소 하나의 크기를 선택하세요",
    "background": "배경",
    "backgroundHint": "투명 영역을 색으로 채우기",
    "optimize": "PNG 최적화",
    "optimizeHint": "손실 없는 압축으로 ICO 크기를 줄입니다",
    "generate": "ICO 생성"
  },
  "ru": {
    "options": "Параметры конвертации",
    "sizes": "Размеры (px)",
    "selectAtLeastOneSize": "Выберите хотя бы один размер",
    "background": "Фон",
    "backgroundHint": "Заполнить прозрачные области цветом",
    "optimize": "Оптимизировать PNG",
    "optimizeHint": "Без потерь сжатие для меньшего ICO",
    "generate": "Создать ICO"
  },
  "pt": {
    "options": "Opções de conversão",
    "sizes": "Tamanhos (px)",
    "selectAtLeastOneSize": "Selecione pelo menos um tamanho",
    "background": "Fundo",
    "backgroundHint": "Preencher áreas transparentes com uma cor",
    "optimize": "Otimizar PNG",
    "optimizeHint": "Compressão sem perdas para um ICO menor",
    "generate": "Gerar ICO"
  },
  "ar": {
    "options": "خيارات التحويل",
    "sizes": "الأحجام (px)",
    "selectAtLeastOneSize": "اختر حجمًا واحدًا على الأقل",
    "background": "الخلفية",
    "backgroundHint": "املأ المناطق الشفافة بلون",
    "optimize": "تحسين PNG",
    "optimizeHint": "ضغط بدون فقدان لحجم ICO أصغر",
    "generate": "إنشاء ICO"
  },
  "hi": {
    "options": "परिवर्तन विकल्प",
    "sizes": "आकार (px)",
    "selectAtLeastOneSize": "कम से कम एक आकार चुनें",
    "background": "पृष्ठभूमि",
    "backgroundHint": "पारदर्शी हिस्सों को रंग से भरें",
    "optimize": "PNG अनुकूलित करें",
    "optimizeHint": "छोटे ICO के लिए बिना नुकसान वाली संपीड़न",
    "generate": "ICO बनाएं"
  },
  "tr": {
    "options": "Dönüştürme seçenekleri",
    "sizes": "Boyutlar (px)",
    "selectAtLeastOneSize": "En az bir boyut seçin",
    "background": "Arka plan",
    "backgroundHint": "Şeffaf alanları bir renkle doldurun",
    "optimize": "PNG'yi optimize et",
    "optimizeHint": "Daha küçük ICO için kayıpsız sıkıştırma",
    "generate": "ICO oluştur"
  },
  "nl": {
    "options": "Conversieopties",
    "sizes": "Groottes (px)",
    "selectAtLeastOneSize": "Selecteer minstens één grootte",
    "background": "Achtergrond",
    "backgroundHint": "Vul transparante gebieden met een kleur",
    "optimize": "PNG optimaliseren",
    "optimizeHint": "Lossless compressie voor een kleinere ICO",
    "generate": "ICO genereren"
  },
  "sv": {
    "options": "Konverteringsalternativ",
    "sizes": "Storlekar (px)",
    "selectAtLeastOneSize": "Välj minst en storlek",
    "background": "Bakgrund",
    "backgroundHint": "Fyll transparenta områden med en färg",
    "optimize": "Optimera PNG",
    "optimizeHint": "Förlustfri komprimering för mindre ICO",
    "generate": "Skapa ICO"
  },
  "pl": {
    "options": "Opcje konwersji",
    "sizes": "Rozmiary (px)",
    "selectAtLeastOneSize": "Wybierz co najmniej jeden rozmiar",
    "background": "Tło",
    "backgroundHint": "Wypełnij przezroczyste obszary kolorem",
    "optimize": "Optymalizuj PNG",
    "optimizeHint": "Bezstratna kompresja dla mniejszego ICO",
    "generate": "Utwórz ICO"
  },
  "vi": {
    "options": "Tùy chọn chuyển đổi",
    "sizes": "Kích thước (px)",
    "selectAtLeastOneSize": "Chọn ít nhất một kích thước",
    "background": "Nền",
    "backgroundHint": "Tô màu các vùng trong suốt",
    "optimize": "Tối ưu PNG",
    "optimizeHint": "Nén không mất dữ liệu để ICO nhỏ hơn",
    "generate": "Tạo ICO"
  },
  "th": {
    "options": "ตัวเลือกการแปลง",
    "sizes": "ขนาด (px)",
    "selectAtLeastOneSize": "เลือกอย่างน้อยหนึ่งขนาด",
    "background": "พื้นหลัง",
    "backgroundHint": "เติมพื้นที่โปร่งใสด้วยสี",
    "optimize": "ปรับแต่ง PNG",
    "optimizeHint": "บีบอัดแบบไม่สูญเสียเพื่อให้ ICO เล็กลง",
    "generate": "สร้าง ICO"
  },
  "id": {
    "options": "Opsi konversi",
    "sizes": "Ukuran (px)",
    "selectAtLeastOneSize": "Pilih setidaknya satu ukuran",
    "background": "Latar belakang",
    "backgroundHint": "Isi area transparan dengan warna",
    "optimize": "Optimalkan PNG",
    "optimizeHint": "Kompresi tanpa kehilangan untuk ICO yang lebih kecil",
    "generate": "Buat ICO"
  },
  "he": {
    "options": "אפשרויות המרה",
    "sizes": "גדלים (px)",
    "selectAtLeastOneSize": "בחר לפחות גודל אחד",
    "background": "רקע",
    "backgroundHint": "מלא אזורים שקופים בצבע",
    "optimize": "אופטימיזציית PNG",
    "optimizeHint": "דחיסה ללא אובדן ל-ICO קטן יותר",
    "generate": "צור ICO"
  },
  "ms": {
    "options": "Pilihan penukaran",
    "sizes": "Saiz (px)",
    "selectAtLeastOneSize": "Pilih sekurang-kurangnya satu saiz",
    "background": "Latar belakang",
    "backgroundHint": "Isi kawasan lutsinar dengan warna",
    "optimize": "Optimumkan PNG",
    "optimizeHint": "Pemampatan tanpa kehilangan untuk ICO yang lebih kecil",
    "generate": "Hasilkan ICO"
  },
  "no": {
    "options": "Konverteringsvalg",
    "sizes": "Størrelser (px)",
    "selectAtLeastOneSize": "Velg minst én størrelse",
    "background": "Bakgrunn",
    "backgroundHint": "Fyll gjennomsiktige områder med en farge",
    "optimize": "Optimaliser PNG",
    "optimizeHint": "Tapsfri komprimering for en mindre ICO",
    "generate": "Lag ICO"
  }
}
</i18n>
