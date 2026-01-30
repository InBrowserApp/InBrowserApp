<template>
  <ToolSectionHeader>{{ t('keySourceTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-radio-group v-model:value="keySource">
      <n-radio-button value="generate">{{ t('keySourceGenerate') }}</n-radio-button>
      <n-radio-button value="import">{{ t('keySourceImport') }}</n-radio-button>
    </n-radio-group>
    <n-text depth="3" class="input-hint">
      {{ keySource === 'generate' ? t('keySourceGenerateHint') : t('keySourceImportHint') }}
    </n-text>
  </ToolSection>

  <ToolSection v-if="keySource === 'generate'">
    <n-form-item :label="t('algorithmLabel')" class="wide-form-item">
      <n-radio-group v-model:value="algorithm">
        <n-radio-button value="rsa">RSA</n-radio-button>
        <n-radio-button value="ecdsa">ECDSA</n-radio-button>
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <n-radio-button value="ed25519">Ed25519</n-radio-button>
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <n-radio-button value="ed448">Ed448</n-radio-button>
      </n-radio-group>
    </n-form-item>

    <n-form-item v-show="algorithm === 'rsa'" :label="t('rsaKeySizeLabel')" class="wide-form-item">
      <n-select v-model:value="rsaKeySize" :options="rsaKeySizeOptions" />
    </n-form-item>

    <n-form-item v-show="algorithm === 'rsa'" :label="t('rsaHashLabel')" class="wide-form-item">
      <n-select v-model:value="rsaHash" :options="rsaHashOptions" />
    </n-form-item>

    <n-form-item v-show="algorithm === 'ecdsa'" :label="t('ecCurveLabel')" class="wide-form-item">
      <n-select v-model:value="ecCurve" :options="ecCurveOptions" />
    </n-form-item>
  </ToolSection>

  <ToolSection v-else>
    <TextOrFileInput
      v-model:value="keyInput"
      class="monospace-field"
      :placeholder="t('privateKeyPlaceholder')"
      :accept="keyAccept"
      :status="keyInputStatus"
      :wrap-with-form-item="false"
    />
    <n-text depth="3" class="input-hint">{{ t('privateKeyHint') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFormItem, NRadioButton, NRadioGroup, NSelect, NText } from 'naive-ui'
import { TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { EcCurve, HashAlgorithm, KeyAlgorithm, KeySource, RsaKeySize } from '../utils/csr'

const keySource = defineModel<KeySource>('keySource', { required: true })
const algorithm = defineModel<KeyAlgorithm>('algorithm', { required: true })
const rsaKeySize = defineModel<RsaKeySize>('rsaKeySize', { required: true })
const rsaHash = defineModel<HashAlgorithm>('rsaHash', { required: true })
const ecCurve = defineModel<EcCurve>('ecCurve', { required: true })
const keyInput = defineModel<string | File>('keyInput', { required: true })

defineProps<{
  keyAccept: string
  keyInputStatus?: 'error' | 'success'
  rsaKeySizeOptions: Array<{ label: string; value: RsaKeySize }>
  rsaHashOptions: Array<{ label: string; value: HashAlgorithm }>
  ecCurveOptions: Array<{ label: string; value: EcCurve }>
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "keySourceTitle": "Key Source",
    "keySourceGenerate": "Generate New Key",
    "keySourceImport": "Import Private Key",
    "keySourceGenerateHint": "Each generation creates a new key pair in your browser.",
    "keySourceImportHint": "Paste a PEM private key (PKCS#8, RSA, EC). Encrypted keys are not supported.",
    "algorithmLabel": "Key Algorithm",
    "rsaKeySizeLabel": "RSA Key Size",
    "rsaHashLabel": "RSA Hash",
    "ecCurveLabel": "EC Curve",
    "privateKeyPlaceholder": "Paste a PEM private key...",
    "privateKeyHint": "Supported: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "zh": {
    "keySourceTitle": "密钥来源",
    "keySourceGenerate": "生成新密钥",
    "keySourceImport": "导入私钥",
    "keySourceGenerateHint": "每次生成都会在浏览器中创建新的密钥对。",
    "keySourceImportHint": "粘贴 PEM 私钥（PKCS#8、RSA、EC）。不支持加密私钥。",
    "algorithmLabel": "密钥算法",
    "rsaKeySizeLabel": "RSA 密钥长度",
    "rsaHashLabel": "RSA 哈希",
    "ecCurveLabel": "EC 曲线",
    "privateKeyPlaceholder": "粘贴 PEM 私钥...",
    "privateKeyHint": "支持：PRIVATE KEY（PKCS#8）、RSA PRIVATE KEY、EC PRIVATE KEY。"
  },
  "zh-CN": {
    "keySourceTitle": "密钥来源",
    "keySourceGenerate": "生成新密钥",
    "keySourceImport": "导入私钥",
    "keySourceGenerateHint": "每次生成都会在浏览器中创建新的密钥对。",
    "keySourceImportHint": "粘贴 PEM 私钥（PKCS#8、RSA、EC）。不支持加密私钥。",
    "algorithmLabel": "密钥算法",
    "rsaKeySizeLabel": "RSA 密钥长度",
    "rsaHashLabel": "RSA 哈希",
    "ecCurveLabel": "EC 曲线",
    "privateKeyPlaceholder": "粘贴 PEM 私钥...",
    "privateKeyHint": "支持：PRIVATE KEY（PKCS#8）、RSA PRIVATE KEY、EC PRIVATE KEY。"
  },
  "zh-TW": {
    "keySourceTitle": "金鑰來源",
    "keySourceGenerate": "產生新金鑰",
    "keySourceImport": "匯入私鑰",
    "keySourceGenerateHint": "每次產生都會在瀏覽器中建立新的金鑰對。",
    "keySourceImportHint": "貼上 PEM 私鑰（PKCS#8、RSA、EC）。不支援加密私鑰。",
    "algorithmLabel": "金鑰演算法",
    "rsaKeySizeLabel": "RSA 金鑰長度",
    "rsaHashLabel": "RSA 雜湊",
    "ecCurveLabel": "EC 曲線",
    "privateKeyPlaceholder": "貼上 PEM 私鑰...",
    "privateKeyHint": "支援：PRIVATE KEY（PKCS#8）、RSA PRIVATE KEY、EC PRIVATE KEY。"
  },
  "zh-HK": {
    "keySourceTitle": "金鑰來源",
    "keySourceGenerate": "產生新金鑰",
    "keySourceImport": "匯入私鑰",
    "keySourceGenerateHint": "每次產生都會在瀏覽器中建立新的金鑰對。",
    "keySourceImportHint": "貼上 PEM 私鑰（PKCS#8、RSA、EC）。不支援加密私鑰。",
    "algorithmLabel": "金鑰演算法",
    "rsaKeySizeLabel": "RSA 金鑰長度",
    "rsaHashLabel": "RSA 雜湊",
    "ecCurveLabel": "EC 曲線",
    "privateKeyPlaceholder": "貼上 PEM 私鑰...",
    "privateKeyHint": "支援：PRIVATE KEY（PKCS#8）、RSA PRIVATE KEY、EC PRIVATE KEY。"
  },
  "es": {
    "keySourceTitle": "Origen de clave",
    "keySourceGenerate": "Generar nueva clave",
    "keySourceImport": "Importar clave privada",
    "keySourceGenerateHint": "Cada generación crea un nuevo par de claves en tu navegador.",
    "keySourceImportHint": "Pega una clave privada PEM (PKCS#8, RSA, EC). Las claves cifradas no están soportadas.",
    "algorithmLabel": "Algoritmo de clave",
    "rsaKeySizeLabel": "Tamaño de clave RSA",
    "rsaHashLabel": "Hash RSA",
    "ecCurveLabel": "Curva EC",
    "privateKeyPlaceholder": "Pega una clave privada PEM...",
    "privateKeyHint": "Compatible: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "fr": {
    "keySourceTitle": "Source de clé",
    "keySourceGenerate": "Générer une nouvelle clé",
    "keySourceImport": "Importer une clé privée",
    "keySourceGenerateHint": "Chaque génération crée une nouvelle paire de clés dans votre navigateur.",
    "keySourceImportHint": "Collez une clé privée PEM (PKCS#8, RSA, EC). Les clés chiffrées ne sont pas prises en charge.",
    "algorithmLabel": "Algorithme de clé",
    "rsaKeySizeLabel": "Taille de clé RSA",
    "rsaHashLabel": "Hash RSA",
    "ecCurveLabel": "Courbe EC",
    "privateKeyPlaceholder": "Collez une clé privée PEM...",
    "privateKeyHint": "Pris en charge : PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "de": {
    "keySourceTitle": "Schlüsselquelle",
    "keySourceGenerate": "Neuen Schlüssel erzeugen",
    "keySourceImport": "Privaten Schlüssel importieren",
    "keySourceGenerateHint": "Jede Generierung erstellt ein neues Schlüsselpaar im Browser.",
    "keySourceImportHint": "Fügen Sie einen PEM-Privatschlüssel ein (PKCS#8, RSA, EC). Verschlüsselte Schlüssel werden nicht unterstützt.",
    "algorithmLabel": "Schlüsselalgorithmus",
    "rsaKeySizeLabel": "RSA-Schlüssellänge",
    "rsaHashLabel": "RSA-Hash",
    "ecCurveLabel": "EC-Kurve",
    "privateKeyPlaceholder": "PEM-Privatschlüssel einfügen...",
    "privateKeyHint": "Unterstützt: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "it": {
    "keySourceTitle": "Origine chiave",
    "keySourceGenerate": "Genera nuova chiave",
    "keySourceImport": "Importa chiave privata",
    "keySourceGenerateHint": "Ogni generazione crea una nuova coppia di chiavi nel browser.",
    "keySourceImportHint": "Incolla una chiave privata PEM (PKCS#8, RSA, EC). Le chiavi cifrate non sono supportate.",
    "algorithmLabel": "Algoritmo chiave",
    "rsaKeySizeLabel": "Dimensione chiave RSA",
    "rsaHashLabel": "Hash RSA",
    "ecCurveLabel": "Curva EC",
    "privateKeyPlaceholder": "Incolla una chiave privata PEM...",
    "privateKeyHint": "Supportato: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "ja": {
    "keySourceTitle": "鍵の種類",
    "keySourceGenerate": "新しい鍵を生成",
    "keySourceImport": "既存の秘密鍵をインポート",
    "keySourceGenerateHint": "生成するたびにブラウザ内で新しい鍵ペアを作成します。",
    "keySourceImportHint": "PEM 形式の秘密鍵（PKCS#8 / RSA / EC）を貼り付けてください。暗号化された鍵は未対応です。",
    "algorithmLabel": "鍵アルゴリズム",
    "rsaKeySizeLabel": "RSA 鍵長",
    "rsaHashLabel": "RSA ハッシュ",
    "ecCurveLabel": "EC 曲線",
    "privateKeyPlaceholder": "PEM 秘密鍵を貼り付け...",
    "privateKeyHint": "対応形式: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY。"
  },
  "ko": {
    "keySourceTitle": "키 소스",
    "keySourceGenerate": "새 키 생성",
    "keySourceImport": "개인 키 가져오기",
    "keySourceGenerateHint": "생성할 때마다 브라우저에서 새 키 쌍이 만들어집니다.",
    "keySourceImportHint": "PEM 개인 키(PKCS#8, RSA, EC)를 붙여넣으세요. 암호화된 키는 지원되지 않습니다.",
    "algorithmLabel": "키 알고리즘",
    "rsaKeySizeLabel": "RSA 키 길이",
    "rsaHashLabel": "RSA 해시",
    "ecCurveLabel": "EC 곡선",
    "privateKeyPlaceholder": "PEM 개인 키를 붙여넣기...",
    "privateKeyHint": "지원: PRIVATE KEY(PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "ru": {
    "keySourceTitle": "Источник ключа",
    "keySourceGenerate": "Создать новый ключ",
    "keySourceImport": "Импортировать приватный ключ",
    "keySourceGenerateHint": "Каждая генерация создаёт новую пару ключей в браузере.",
    "keySourceImportHint": "Вставьте приватный ключ PEM (PKCS#8, RSA, EC). Зашифрованные ключи не поддерживаются.",
    "algorithmLabel": "Алгоритм ключа",
    "rsaKeySizeLabel": "Размер ключа RSA",
    "rsaHashLabel": "Хэш RSA",
    "ecCurveLabel": "Кривая EC",
    "privateKeyPlaceholder": "Вставьте приватный ключ PEM...",
    "privateKeyHint": "Поддерживается: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "pt": {
    "keySourceTitle": "Fonte da chave",
    "keySourceGenerate": "Gerar nova chave",
    "keySourceImport": "Importar chave privada",
    "keySourceGenerateHint": "Cada geração cria um novo par de chaves no navegador.",
    "keySourceImportHint": "Cole uma chave privada PEM (PKCS#8, RSA, EC). Chaves criptografadas não são suportadas.",
    "algorithmLabel": "Algoritmo da chave",
    "rsaKeySizeLabel": "Tamanho da chave RSA",
    "rsaHashLabel": "Hash RSA",
    "ecCurveLabel": "Curva EC",
    "privateKeyPlaceholder": "Cole uma chave privada PEM...",
    "privateKeyHint": "Compatível: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "ar": {
    "keySourceTitle": "مصدر المفتاح",
    "keySourceGenerate": "إنشاء مفتاح جديد",
    "keySourceImport": "استيراد مفتاح خاص",
    "keySourceGenerateHint": "كل عملية إنشاء تُنتج زوج مفاتيح جديد داخل المتصفح.",
    "keySourceImportHint": "الصق مفتاحًا خاصًا بصيغة PEM (PKCS#8 أو RSA أو EC). المفاتيح المشفّرة غير مدعومة.",
    "algorithmLabel": "خوارزمية المفتاح",
    "rsaKeySizeLabel": "طول مفتاح RSA",
    "rsaHashLabel": "تجزئة RSA",
    "ecCurveLabel": "منحنى EC",
    "privateKeyPlaceholder": "الصق مفتاح PEM الخاص...",
    "privateKeyHint": "مدعوم: PRIVATE KEY (PKCS#8) و RSA PRIVATE KEY و EC PRIVATE KEY."
  },
  "hi": {
    "keySourceTitle": "कुंजी स्रोत",
    "keySourceGenerate": "नई कुंजी बनाएँ",
    "keySourceImport": "निजी कुंजी आयात करें",
    "keySourceGenerateHint": "हर बार जनरेट करने पर ब्राउज़र में नया कुंजी युग्म बनता है।",
    "keySourceImportHint": "PEM निजी कुंजी (PKCS#8, RSA, EC) पेस्ट करें। एन्क्रिप्टेड कुंजियाँ समर्थित नहीं हैं।",
    "algorithmLabel": "कुंजी एल्गोरिथ्म",
    "rsaKeySizeLabel": "RSA कुंजी आकार",
    "rsaHashLabel": "RSA हैश",
    "ecCurveLabel": "EC कर्व",
    "privateKeyPlaceholder": "PEM निजी कुंजी पेस्ट करें...",
    "privateKeyHint": "समर्थित: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY।"
  },
  "tr": {
    "keySourceTitle": "Anahtar kaynağı",
    "keySourceGenerate": "Yeni anahtar oluştur",
    "keySourceImport": "Özel anahtar içe aktar",
    "keySourceGenerateHint": "Her oluşturma tarayıcıda yeni bir anahtar çifti üretir.",
    "keySourceImportHint": "PEM özel anahtarını yapıştırın (PKCS#8, RSA, EC). Şifreli anahtarlar desteklenmez.",
    "algorithmLabel": "Anahtar algoritması",
    "rsaKeySizeLabel": "RSA anahtar uzunluğu",
    "rsaHashLabel": "RSA özeti",
    "ecCurveLabel": "EC eğrisi",
    "privateKeyPlaceholder": "PEM özel anahtarını yapıştır...",
    "privateKeyHint": "Desteklenenler: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "nl": {
    "keySourceTitle": "Sleutelbron",
    "keySourceGenerate": "Nieuwe sleutel genereren",
    "keySourceImport": "Privésleutel importeren",
    "keySourceGenerateHint": "Elke generatie maakt een nieuw sleutelpaar in je browser.",
    "keySourceImportHint": "Plak een PEM-privésleutel (PKCS#8, RSA, EC). Versleutelde sleutels worden niet ondersteund.",
    "algorithmLabel": "Sleutelalgoritme",
    "rsaKeySizeLabel": "RSA-sleutellengte",
    "rsaHashLabel": "RSA-hash",
    "ecCurveLabel": "EC-curve",
    "privateKeyPlaceholder": "Plak een PEM-privésleutel...",
    "privateKeyHint": "Ondersteund: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "sv": {
    "keySourceTitle": "Nyckelkälla",
    "keySourceGenerate": "Generera ny nyckel",
    "keySourceImport": "Importera privat nyckel",
    "keySourceGenerateHint": "Varje generering skapar ett nytt nyckelpar i webbläsaren.",
    "keySourceImportHint": "Klistra in en PEM-privatnyckel (PKCS#8, RSA, EC). Krypterade nycklar stöds inte.",
    "algorithmLabel": "Nyckelalgoritm",
    "rsaKeySizeLabel": "RSA-nyckelstorlek",
    "rsaHashLabel": "RSA-hash",
    "ecCurveLabel": "EC-kurva",
    "privateKeyPlaceholder": "Klistra in en PEM-privatnyckel...",
    "privateKeyHint": "Stöd: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "pl": {
    "keySourceTitle": "Źródło klucza",
    "keySourceGenerate": "Wygeneruj nowy klucz",
    "keySourceImport": "Importuj klucz prywatny",
    "keySourceGenerateHint": "Każde generowanie tworzy nową parę kluczy w przeglądarce.",
    "keySourceImportHint": "Wklej klucz prywatny PEM (PKCS#8, RSA, EC). Klucze zaszyfrowane nie są obsługiwane.",
    "algorithmLabel": "Algorytm klucza",
    "rsaKeySizeLabel": "Rozmiar klucza RSA",
    "rsaHashLabel": "Hash RSA",
    "ecCurveLabel": "Krzywa EC",
    "privateKeyPlaceholder": "Wklej klucz prywatny PEM...",
    "privateKeyHint": "Obsługiwane: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "vi": {
    "keySourceTitle": "Nguồn khóa",
    "keySourceGenerate": "Tạo khóa mới",
    "keySourceImport": "Nhập khóa riêng",
    "keySourceGenerateHint": "Mỗi lần tạo sẽ sinh một cặp khóa mới ngay trong trình duyệt.",
    "keySourceImportHint": "Dán khóa riêng PEM (PKCS#8, RSA, EC). Không hỗ trợ khóa đã mã hóa.",
    "algorithmLabel": "Thuật toán khóa",
    "rsaKeySizeLabel": "Kích thước khóa RSA",
    "rsaHashLabel": "Băm RSA",
    "ecCurveLabel": "Đường cong EC",
    "privateKeyPlaceholder": "Dán khóa riêng PEM...",
    "privateKeyHint": "Hỗ trợ: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "th": {
    "keySourceTitle": "แหล่งที่มาของคีย์",
    "keySourceGenerate": "สร้างคีย์ใหม่",
    "keySourceImport": "นำเข้าคีย์ส่วนตัว",
    "keySourceGenerateHint": "ทุกครั้งที่สร้างจะได้คู่คีย์ใหม่ในเบราว์เซอร์ของคุณ.",
    "keySourceImportHint": "วางคีย์ส่วนตัว PEM (PKCS#8, RSA, EC) ไม่รองรับคีย์ที่เข้ารหัส.",
    "algorithmLabel": "อัลกอริทึมคีย์",
    "rsaKeySizeLabel": "ขนาดคีย์ RSA",
    "rsaHashLabel": "แฮช RSA",
    "ecCurveLabel": "เส้นโค้ง EC",
    "privateKeyPlaceholder": "วางคีย์ส่วนตัว PEM...",
    "privateKeyHint": "รองรับ: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "id": {
    "keySourceTitle": "Sumber kunci",
    "keySourceGenerate": "Buat kunci baru",
    "keySourceImport": "Impor kunci privat",
    "keySourceGenerateHint": "Setiap pembuatan menghasilkan pasangan kunci baru di browser.",
    "keySourceImportHint": "Tempel kunci privat PEM (PKCS#8, RSA, EC). Kunci terenkripsi tidak didukung.",
    "algorithmLabel": "Algoritma kunci",
    "rsaKeySizeLabel": "Ukuran kunci RSA",
    "rsaHashLabel": "Hash RSA",
    "ecCurveLabel": "Kurva EC",
    "privateKeyPlaceholder": "Tempel kunci privat PEM...",
    "privateKeyHint": "Didukung: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "he": {
    "keySourceTitle": "מקור מפתח",
    "keySourceGenerate": "צור מפתח חדש",
    "keySourceImport": "ייבא מפתח פרטי",
    "keySourceGenerateHint": "כל יצירה יוצרת זוג מפתחות חדש בדפדפן.",
    "keySourceImportHint": "הדבק מפתח פרטי PEM (PKCS#8, RSA, EC). מפתחות מוצפנים אינם נתמכים.",
    "algorithmLabel": "אלגוריתם מפתח",
    "rsaKeySizeLabel": "גודל מפתח RSA",
    "rsaHashLabel": "האש RSA",
    "ecCurveLabel": "עקומת EC",
    "privateKeyPlaceholder": "הדבק מפתח פרטי PEM...",
    "privateKeyHint": "נתמך: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "ms": {
    "keySourceTitle": "Sumber kunci",
    "keySourceGenerate": "Jana kunci baharu",
    "keySourceImport": "Import kunci peribadi",
    "keySourceGenerateHint": "Setiap penjanaan akan menghasilkan pasangan kunci baharu dalam pelayar.",
    "keySourceImportHint": "Tampal kunci peribadi PEM (PKCS#8, RSA, EC). Kunci yang disulitkan tidak disokong.",
    "algorithmLabel": "Algoritma kunci",
    "rsaKeySizeLabel": "Saiz kunci RSA",
    "rsaHashLabel": "Hash RSA",
    "ecCurveLabel": "Lengkung EC",
    "privateKeyPlaceholder": "Tampal kunci peribadi PEM...",
    "privateKeyHint": "Disokong: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "no": {
    "keySourceTitle": "Nøkkelkilde",
    "keySourceGenerate": "Generer ny nøkkel",
    "keySourceImport": "Importer privat nøkkel",
    "keySourceGenerateHint": "Hver generering lager et nytt nøkkelpar i nettleseren.",
    "keySourceImportHint": "Lim inn en PEM-privatnøkkel (PKCS#8, RSA, EC). Krypterte nøkler støttes ikke.",
    "algorithmLabel": "Nøkkelalgoritme",
    "rsaKeySizeLabel": "RSA-nøkkelstørrelse",
    "rsaHashLabel": "RSA-hash",
    "ecCurveLabel": "EC-kurve",
    "privateKeyPlaceholder": "Lim inn PEM-privatnøkkel...",
    "privateKeyHint": "Støttet: PRIVATE KEY (PKCS#8), RSA PRIVATE KEY, EC PRIVATE KEY."
  }
}
</i18n>
