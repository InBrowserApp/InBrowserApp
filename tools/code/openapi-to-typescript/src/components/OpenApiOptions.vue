<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('optionsTitle') }}</ToolSectionHeader>
    <n-grid cols="1 s:2 m:3" responsive="screen" :x-gap="12" :y-gap="8">
      <n-form-item-gi :label="t('optionAdditionalProperties')" :show-feedback="false">
        <n-switch v-model:value="additionalProperties" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionDefaultNonNullable')" :show-feedback="false">
        <n-switch v-model:value="defaultNonNullable" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionPropertiesRequiredByDefault')" :show-feedback="false">
        <n-switch v-model:value="propertiesRequiredByDefault" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionExportType')" :show-feedback="false">
        <n-switch v-model:value="exportType" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionEnum')" :show-feedback="false">
        <n-switch v-model:value="enumOutput" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionPathParamsAsTypes')" :show-feedback="false">
        <n-switch v-model:value="pathParamsAsTypes" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionRootTypes')" :show-feedback="false">
        <n-switch v-model:value="rootTypes" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionMakePathsEnum')" :show-feedback="false">
        <n-switch v-model:value="makePathsEnum" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionGeneratePathParams')" :show-feedback="false">
        <n-switch v-model:value="generatePathParams" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionImmutable')" :show-feedback="false">
        <n-switch v-model:value="immutable" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionExcludeDeprecated')" :show-feedback="false">
        <n-switch v-model:value="excludeDeprecated" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('optionIncludeHeader')" :show-feedback="false">
        <n-switch v-model:value="includeHeader" />
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { NFormItemGi, NGrid, NSwitch } from 'naive-ui'

const additionalProperties = defineModel<boolean>('additionalProperties', { required: true })
const defaultNonNullable = defineModel<boolean>('defaultNonNullable', { required: true })
const propertiesRequiredByDefault = defineModel<boolean>('propertiesRequiredByDefault', {
  required: true,
})
const exportType = defineModel<boolean>('exportType', { required: true })
const enumOutput = defineModel<boolean>('enumOutput', { required: true })
const pathParamsAsTypes = defineModel<boolean>('pathParamsAsTypes', { required: true })
const rootTypes = defineModel<boolean>('rootTypes', { required: true })
const makePathsEnum = defineModel<boolean>('makePathsEnum', { required: true })
const generatePathParams = defineModel<boolean>('generatePathParams', { required: true })
const immutable = defineModel<boolean>('immutable', { required: true })
const excludeDeprecated = defineModel<boolean>('excludeDeprecated', { required: true })
const includeHeader = defineModel<boolean>('includeHeader', { required: true })

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "optionsTitle": "Generation Options",
    "optionAdditionalProperties": "Allow additional properties",
    "optionDefaultNonNullable": "Default non-nullable",
    "optionPropertiesRequiredByDefault": "Properties required by default",
    "optionExportType": "Use type aliases for root types",
    "optionEnum": "Generate enums",
    "optionPathParamsAsTypes": "Path params as types",
    "optionRootTypes": "Generate root types",
    "optionMakePathsEnum": "Create paths enum",
    "optionGeneratePathParams": "Generate path params helpers",
    "optionImmutable": "Readonly output",
    "optionExcludeDeprecated": "Exclude deprecated fields",
    "optionIncludeHeader": "Include header comment"
  },
  "zh": {
    "optionsTitle": "生成选项",
    "optionAdditionalProperties": "允许额外属性",
    "optionDefaultNonNullable": "默认非空",
    "optionPropertiesRequiredByDefault": "属性默认必填",
    "optionExportType": "根类型使用 type 别名",
    "optionEnum": "生成枚举",
    "optionPathParamsAsTypes": "路径参数作为类型",
    "optionRootTypes": "生成根类型",
    "optionMakePathsEnum": "生成路径枚举",
    "optionGeneratePathParams": "生成路径参数辅助类型",
    "optionImmutable": "只读输出",
    "optionExcludeDeprecated": "排除已弃用字段",
    "optionIncludeHeader": "包含头部注释"
  },
  "zh-CN": {
    "optionsTitle": "生成选项",
    "optionAdditionalProperties": "允许额外属性",
    "optionDefaultNonNullable": "默认非空",
    "optionPropertiesRequiredByDefault": "属性默认必填",
    "optionExportType": "根类型使用 type 别名",
    "optionEnum": "生成枚举",
    "optionPathParamsAsTypes": "路径参数作为类型",
    "optionRootTypes": "生成根类型",
    "optionMakePathsEnum": "生成路径枚举",
    "optionGeneratePathParams": "生成路径参数辅助类型",
    "optionImmutable": "只读输出",
    "optionExcludeDeprecated": "排除已弃用字段",
    "optionIncludeHeader": "包含头部注释"
  },
  "zh-TW": {
    "optionsTitle": "生成選項",
    "optionAdditionalProperties": "允許額外屬性",
    "optionDefaultNonNullable": "預設非空",
    "optionPropertiesRequiredByDefault": "屬性預設必填",
    "optionExportType": "根型別使用 type 別名",
    "optionEnum": "生成列舉",
    "optionPathParamsAsTypes": "路徑參數作為型別",
    "optionRootTypes": "生成根型別",
    "optionMakePathsEnum": "生成路徑列舉",
    "optionGeneratePathParams": "生成路徑參數輔助型別",
    "optionImmutable": "唯讀輸出",
    "optionExcludeDeprecated": "排除已棄用欄位",
    "optionIncludeHeader": "包含標頭註解"
  },
  "zh-HK": {
    "optionsTitle": "生成選項",
    "optionAdditionalProperties": "允許額外屬性",
    "optionDefaultNonNullable": "預設非空",
    "optionPropertiesRequiredByDefault": "屬性預設必填",
    "optionExportType": "根型別使用 type 別名",
    "optionEnum": "生成列舉",
    "optionPathParamsAsTypes": "路徑參數作為型別",
    "optionRootTypes": "生成根型別",
    "optionMakePathsEnum": "生成路徑列舉",
    "optionGeneratePathParams": "生成路徑參數輔助型別",
    "optionImmutable": "唯讀輸出",
    "optionExcludeDeprecated": "排除已棄用欄位",
    "optionIncludeHeader": "包含標頭註解"
  },
  "es": {
    "optionsTitle": "Opciones de generación",
    "optionAdditionalProperties": "Permitir propiedades adicionales",
    "optionDefaultNonNullable": "No anulable por defecto",
    "optionPropertiesRequiredByDefault": "Propiedades obligatorias por defecto",
    "optionExportType": "Usar alias type para tipos raíz",
    "optionEnum": "Generar enums",
    "optionPathParamsAsTypes": "Parámetros de ruta como tipos",
    "optionRootTypes": "Generar tipos raíz",
    "optionMakePathsEnum": "Crear enum de rutas",
    "optionGeneratePathParams": "Generar ayudas de parámetros de ruta",
    "optionImmutable": "Salida de solo lectura",
    "optionExcludeDeprecated": "Excluir campos obsoletos",
    "optionIncludeHeader": "Incluir comentario de cabecera"
  },
  "fr": {
    "optionsTitle": "Options de génération",
    "optionAdditionalProperties": "Autoriser des propriétés supplémentaires",
    "optionDefaultNonNullable": "Non-nullable par défaut",
    "optionPropertiesRequiredByDefault": "Propriétés requises par défaut",
    "optionExportType": "Utiliser des alias type pour les types racine",
    "optionEnum": "Générer des enums",
    "optionPathParamsAsTypes": "Paramètres de chemin en types",
    "optionRootTypes": "Générer les types racine",
    "optionMakePathsEnum": "Créer un enum des chemins",
    "optionGeneratePathParams": "Générer des helpers de paramètres de chemin",
    "optionImmutable": "Sortie en lecture seule",
    "optionExcludeDeprecated": "Exclure les champs obsolètes",
    "optionIncludeHeader": "Inclure le commentaire d'en-tête"
  },
  "de": {
    "optionsTitle": "Generierungsoptionen",
    "optionAdditionalProperties": "Zusätzliche Eigenschaften zulassen",
    "optionDefaultNonNullable": "Standardmäßig nicht-null",
    "optionPropertiesRequiredByDefault": "Eigenschaften standardmäßig erforderlich",
    "optionExportType": "Type-Aliase für Root-Typen verwenden",
    "optionEnum": "Enums erzeugen",
    "optionPathParamsAsTypes": "Pfadparameter als Typen",
    "optionRootTypes": "Root-Typen erzeugen",
    "optionMakePathsEnum": "Pfad-Enum erstellen",
    "optionGeneratePathParams": "Hilfstypen für Pfadparameter erzeugen",
    "optionImmutable": "Nur-Lese-Ausgabe",
    "optionExcludeDeprecated": "Veraltete Felder ausschließen",
    "optionIncludeHeader": "Header-Kommentar einfügen"
  },
  "it": {
    "optionsTitle": "Opzioni di generazione",
    "optionAdditionalProperties": "Consenti proprietà aggiuntive",
    "optionDefaultNonNullable": "Non nullabile per default",
    "optionPropertiesRequiredByDefault": "Proprietà richieste per default",
    "optionExportType": "Usa alias type per i tipi radice",
    "optionEnum": "Genera enum",
    "optionPathParamsAsTypes": "Parametri di percorso come tipi",
    "optionRootTypes": "Genera tipi radice",
    "optionMakePathsEnum": "Crea enum dei percorsi",
    "optionGeneratePathParams": "Genera helper per parametri di percorso",
    "optionImmutable": "Output di sola lettura",
    "optionExcludeDeprecated": "Escludi campi deprecati",
    "optionIncludeHeader": "Includi commento di intestazione"
  },
  "ja": {
    "optionsTitle": "生成オプション",
    "optionAdditionalProperties": "追加プロパティを許可",
    "optionDefaultNonNullable": "既定で非 null",
    "optionPropertiesRequiredByDefault": "既定で必須プロパティ",
    "optionExportType": "ルート型を type エイリアスで出力",
    "optionEnum": "enum を生成",
    "optionPathParamsAsTypes": "パスパラメータを型として生成",
    "optionRootTypes": "ルート型を生成",
    "optionMakePathsEnum": "パス enum を生成",
    "optionGeneratePathParams": "パスパラメータのヘルパーを生成",
    "optionImmutable": "読み取り専用出力",
    "optionExcludeDeprecated": "非推奨フィールドを除外",
    "optionIncludeHeader": "ヘッダーコメントを含める"
  },
  "ko": {
    "optionsTitle": "생성 옵션",
    "optionAdditionalProperties": "추가 속성 허용",
    "optionDefaultNonNullable": "기본 non-null",
    "optionPropertiesRequiredByDefault": "기본 필수 속성",
    "optionExportType": "루트 타입을 type 별칭으로",
    "optionEnum": "enum 생성",
    "optionPathParamsAsTypes": "경로 파라미터를 타입으로",
    "optionRootTypes": "루트 타입 생성",
    "optionMakePathsEnum": "경로 enum 생성",
    "optionGeneratePathParams": "경로 파라미터 헬퍼 생성",
    "optionImmutable": "읽기 전용 출력",
    "optionExcludeDeprecated": "사용 중단 필드 제외",
    "optionIncludeHeader": "헤더 주석 포함"
  },
  "ru": {
    "optionsTitle": "Параметры генерации",
    "optionAdditionalProperties": "Разрешить дополнительные свойства",
    "optionDefaultNonNullable": "По умолчанию non-null",
    "optionPropertiesRequiredByDefault": "Свойства обязательны по умолчанию",
    "optionExportType": "Использовать type-алиасы для корневых типов",
    "optionEnum": "Генерировать enum",
    "optionPathParamsAsTypes": "Параметры пути как типы",
    "optionRootTypes": "Генерировать корневые типы",
    "optionMakePathsEnum": "Создать enum путей",
    "optionGeneratePathParams": "Генерировать helper-и параметров пути",
    "optionImmutable": "Вывод только для чтения",
    "optionExcludeDeprecated": "Исключить устаревшие поля",
    "optionIncludeHeader": "Включить заголовочный комментарий"
  },
  "pt": {
    "optionsTitle": "Opções de geração",
    "optionAdditionalProperties": "Permitir propriedades adicionais",
    "optionDefaultNonNullable": "Não anulável por padrão",
    "optionPropertiesRequiredByDefault": "Propriedades obrigatórias por padrão",
    "optionExportType": "Usar aliases type para tipos raiz",
    "optionEnum": "Gerar enums",
    "optionPathParamsAsTypes": "Parâmetros de rota como tipos",
    "optionRootTypes": "Gerar tipos raiz",
    "optionMakePathsEnum": "Criar enum de rotas",
    "optionGeneratePathParams": "Gerar helpers de parâmetros de rota",
    "optionImmutable": "Saída somente leitura",
    "optionExcludeDeprecated": "Excluir campos obsoletos",
    "optionIncludeHeader": "Incluir comentário de cabeçalho"
  },
  "ar": {
    "optionsTitle": "خيارات التوليد",
    "optionAdditionalProperties": "السماح بخصائص إضافية",
    "optionDefaultNonNullable": "غير قابل لـ null افتراضيًا",
    "optionPropertiesRequiredByDefault": "الخصائص مطلوبة افتراضيًا",
    "optionExportType": "استخدام type للأصناف الجذرية",
    "optionEnum": "توليد enums",
    "optionPathParamsAsTypes": "معلمات المسار كأنواع",
    "optionRootTypes": "توليد الأنواع الجذرية",
    "optionMakePathsEnum": "إنشاء enum للمسارات",
    "optionGeneratePathParams": "توليد مساعدات معلمات المسار",
    "optionImmutable": "مخرجات للقراءة فقط",
    "optionExcludeDeprecated": "استبعاد الحقول المهجورة",
    "optionIncludeHeader": "تضمين تعليق الرأس"
  },
  "hi": {
    "optionsTitle": "जेनरेशन विकल्प",
    "optionAdditionalProperties": "अतिरिक्त प्रॉपर्टी अनुमति दें",
    "optionDefaultNonNullable": "डिफ़ॉल्ट रूप से non-null",
    "optionPropertiesRequiredByDefault": "डिफ़ॉल्ट रूप से आवश्यक प्रॉपर्टी",
    "optionExportType": "रूट टाइप के लिए type alias उपयोग करें",
    "optionEnum": "enum बनाएँ",
    "optionPathParamsAsTypes": "पाथ पैरामीटर को टाइप के रूप में",
    "optionRootTypes": "रूट टाइप बनाएँ",
    "optionMakePathsEnum": "पाथ enum बनाएँ",
    "optionGeneratePathParams": "पाथ पैरामीटर हेल्पर बनाएँ",
    "optionImmutable": "रीड-ओनली आउटपुट",
    "optionExcludeDeprecated": "डिप्रिकेटेड फ़ील्ड हटाएँ",
    "optionIncludeHeader": "हेडर कमेंट शामिल करें"
  },
  "tr": {
    "optionsTitle": "Üretim Seçenekleri",
    "optionAdditionalProperties": "Ek özelliklere izin ver",
    "optionDefaultNonNullable": "Varsayılan non-null",
    "optionPropertiesRequiredByDefault": "Varsayılan gerekli özellikler",
    "optionExportType": "Kök türler için type alias kullan",
    "optionEnum": "Enum üret",
    "optionPathParamsAsTypes": "Yol parametreleri tür olarak",
    "optionRootTypes": "Kök türler üret",
    "optionMakePathsEnum": "Yol enum'u oluştur",
    "optionGeneratePathParams": "Yol parametre yardımcılarını üret",
    "optionImmutable": "Salt okunur çıktı",
    "optionExcludeDeprecated": "Kullanımdan kaldırılan alanları hariç tut",
    "optionIncludeHeader": "Üstbilgi yorumunu ekle"
  },
  "nl": {
    "optionsTitle": "Generatieopties",
    "optionAdditionalProperties": "Extra eigenschappen toestaan",
    "optionDefaultNonNullable": "Standaard non-null",
    "optionPropertiesRequiredByDefault": "Eigenschappen standaard verplicht",
    "optionExportType": "Gebruik type-aliases voor root-typen",
    "optionEnum": "Enums genereren",
    "optionPathParamsAsTypes": "Padparameters als typen",
    "optionRootTypes": "Root-typen genereren",
    "optionMakePathsEnum": "Pad-enum maken",
    "optionGeneratePathParams": "Helpers voor padparameters genereren",
    "optionImmutable": "Alleen-lezen uitvoer",
    "optionExcludeDeprecated": "Verouderde velden uitsluiten",
    "optionIncludeHeader": "Headercommentaar opnemen"
  },
  "sv": {
    "optionsTitle": "Genereringsalternativ",
    "optionAdditionalProperties": "Tillåt extra egenskaper",
    "optionDefaultNonNullable": "Icke-null som standard",
    "optionPropertiesRequiredByDefault": "Egenskaper krävs som standard",
    "optionExportType": "Använd type-alias för rot-typer",
    "optionEnum": "Generera enums",
    "optionPathParamsAsTypes": "Sökvägsparametrar som typer",
    "optionRootTypes": "Generera rot-typer",
    "optionMakePathsEnum": "Skapa sökvägs-enum",
    "optionGeneratePathParams": "Generera hjälpertyper för sökvägsparametrar",
    "optionImmutable": "Skrivskyddad utdata",
    "optionExcludeDeprecated": "Uteslut föråldrade fält",
    "optionIncludeHeader": "Inkludera header-kommentar"
  },
  "pl": {
    "optionsTitle": "Opcje generowania",
    "optionAdditionalProperties": "Zezwalaj na dodatkowe właściwości",
    "optionDefaultNonNullable": "Domyślnie non-null",
    "optionPropertiesRequiredByDefault": "Właściwości wymagane domyślnie",
    "optionExportType": "Użyj aliasów type dla typów głównych",
    "optionEnum": "Generuj enumy",
    "optionPathParamsAsTypes": "Parametry ścieżki jako typy",
    "optionRootTypes": "Generuj typy główne",
    "optionMakePathsEnum": "Utwórz enum ścieżek",
    "optionGeneratePathParams": "Generuj helpery parametrów ścieżki",
    "optionImmutable": "Wyjście tylko do odczytu",
    "optionExcludeDeprecated": "Wyklucz przestarzałe pola",
    "optionIncludeHeader": "Dołącz komentarz nagłówka"
  },
  "vi": {
    "optionsTitle": "Tùy chọn tạo",
    "optionAdditionalProperties": "Cho phép thuộc tính bổ sung",
    "optionDefaultNonNullable": "Mặc định non-null",
    "optionPropertiesRequiredByDefault": "Thuộc tính bắt buộc mặc định",
    "optionExportType": "Dùng alias type cho loại gốc",
    "optionEnum": "Tạo enum",
    "optionPathParamsAsTypes": "Tham số đường dẫn dưới dạng kiểu",
    "optionRootTypes": "Tạo kiểu gốc",
    "optionMakePathsEnum": "Tạo enum đường dẫn",
    "optionGeneratePathParams": "Tạo helper tham số đường dẫn",
    "optionImmutable": "Đầu ra chỉ đọc",
    "optionExcludeDeprecated": "Loại bỏ trường đã lỗi thời",
    "optionIncludeHeader": "Bao gồm chú thích tiêu đề"
  },
  "th": {
    "optionsTitle": "ตัวเลือกการสร้าง",
    "optionAdditionalProperties": "อนุญาตพร็อพเพอร์ตีเพิ่มเติม",
    "optionDefaultNonNullable": "ค่าเริ่มต้นไม่เป็น null",
    "optionPropertiesRequiredByDefault": "พร็อพเพอร์ตีจำเป็นตามค่าเริ่มต้น",
    "optionExportType": "ใช้ type alias สำหรับชนิดหลัก",
    "optionEnum": "สร้าง enum",
    "optionPathParamsAsTypes": "พารามิเตอร์เส้นทางเป็นชนิด",
    "optionRootTypes": "สร้างชนิดหลัก",
    "optionMakePathsEnum": "สร้าง enum ของเส้นทาง",
    "optionGeneratePathParams": "สร้างตัวช่วยพารามิเตอร์เส้นทาง",
    "optionImmutable": "ผลลัพธ์แบบอ่านอย่างเดียว",
    "optionExcludeDeprecated": "ตัดฟิลด์ที่เลิกใช้",
    "optionIncludeHeader": "รวมคอมเมนต์ส่วนหัว"
  },
  "id": {
    "optionsTitle": "Opsi pembuatan",
    "optionAdditionalProperties": "Izinkan properti tambahan",
    "optionDefaultNonNullable": "Non-null secara default",
    "optionPropertiesRequiredByDefault": "Properti wajib secara default",
    "optionExportType": "Gunakan alias type untuk tipe root",
    "optionEnum": "Buat enum",
    "optionPathParamsAsTypes": "Parameter path sebagai tipe",
    "optionRootTypes": "Buat tipe root",
    "optionMakePathsEnum": "Buat enum path",
    "optionGeneratePathParams": "Buat helper parameter path",
    "optionImmutable": "Output hanya-baca",
    "optionExcludeDeprecated": "Kecualikan field usang",
    "optionIncludeHeader": "Sertakan komentar header"
  },
  "he": {
    "optionsTitle": "אפשרויות יצירה",
    "optionAdditionalProperties": "אפשר מאפיינים נוספים",
    "optionDefaultNonNullable": "ברירת מחדל non-null",
    "optionPropertiesRequiredByDefault": "מאפיינים נדרשים כברירת מחדל",
    "optionExportType": "השתמש ב-type alias לטיפוסי שורש",
    "optionEnum": "צור enum",
    "optionPathParamsAsTypes": "פרמטרי נתיב כטיפוסים",
    "optionRootTypes": "צור טיפוסי שורש",
    "optionMakePathsEnum": "צור enum לנתיבים",
    "optionGeneratePathParams": "צור עוזרי פרמטרי נתיב",
    "optionImmutable": "פלט לקריאה בלבד",
    "optionExcludeDeprecated": "הסר שדות מיושנים",
    "optionIncludeHeader": "כלול הערת כותרת"
  },
  "ms": {
    "optionsTitle": "Pilihan penjanaan",
    "optionAdditionalProperties": "Benarkan sifat tambahan",
    "optionDefaultNonNullable": "Non-null secara lalai",
    "optionPropertiesRequiredByDefault": "Sifat diperlukan secara lalai",
    "optionExportType": "Guna alias type untuk jenis root",
    "optionEnum": "Jana enum",
    "optionPathParamsAsTypes": "Parameter laluan sebagai jenis",
    "optionRootTypes": "Jana jenis root",
    "optionMakePathsEnum": "Cipta enum laluan",
    "optionGeneratePathParams": "Jana pembantu parameter laluan",
    "optionImmutable": "Output baca sahaja",
    "optionExcludeDeprecated": "Kecualikan medan usang",
    "optionIncludeHeader": "Sertakan komen pengepala"
  },
  "no": {
    "optionsTitle": "Genereringsvalg",
    "optionAdditionalProperties": "Tillat ekstra egenskaper",
    "optionDefaultNonNullable": "Standard non-null",
    "optionPropertiesRequiredByDefault": "Egenskaper kreves som standard",
    "optionExportType": "Bruk type-alias for rot-typer",
    "optionEnum": "Generer enums",
    "optionPathParamsAsTypes": "Sti-parametere som typer",
    "optionRootTypes": "Generer rot-typer",
    "optionMakePathsEnum": "Lag sti-enum",
    "optionGeneratePathParams": "Generer hjelpe-typer for sti-parametere",
    "optionImmutable": "Skrivebeskyttet utdata",
    "optionExcludeDeprecated": "Ekskluder utdaterte felt",
    "optionIncludeHeader": "Inkluder toppkommentar"
  }
}
</i18n>
