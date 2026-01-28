<template>
  <CsrKeySourceSection
    v-model:key-source="keySource"
    v-model:algorithm="algorithm"
    v-model:rsa-key-size="rsaKeySize"
    v-model:rsa-hash="rsaHash"
    v-model:ec-curve="ecCurve"
    v-model:key-input="keyInput"
    :key-accept="keyAccept"
    :key-input-status="keyInputStatus"
    :rsa-key-size-options="rsaKeySizeOptions"
    :rsa-hash-options="rsaHashOptions"
    :ec-curve-options="ecCurveOptions"
  />

  <CsrSubjectSection v-model:subject="subject" />

  <CsrSanSection
    v-model:san-dns="sanDns"
    v-model:san-ip="sanIp"
    v-model:san-email="sanEmail"
    v-model:san-uri="sanUri"
  />

  <CsrActionsSection :generating="generating" :error-message="errorMessage" @generate="generate" />

  <CsrOutputSection
    :csr-output="csrOutput"
    :csr-download-url="csrDownloadUrl"
    :key-algorithm-label="keyAlgorithmLabel"
  />

  <CsrPrivateKeySection
    :private-key-output="privateKeyOutput"
    :private-key-download-url="privateKeyDownloadUrl"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl, useStorage } from '@vueuse/core'
import CsrActionsSection from './CsrActionsSection.vue'
import CsrKeySourceSection from './CsrKeySourceSection.vue'
import CsrOutputSection from './CsrOutputSection.vue'
import CsrPrivateKeySection from './CsrPrivateKeySection.vue'
import CsrSanSection from './CsrSanSection.vue'
import CsrSubjectSection from './CsrSubjectSection.vue'
import {
  CsrGeneratorError,
  createCsr,
  type CsrCreateInput,
  type EcCurve,
  type HashAlgorithm,
  type KeyAlgorithm,
  type KeySource,
  type RsaKeySize,
  type SubjectInput,
} from '../utils/csr'

const { t } = useI18n({ useScope: 'local' })

const keyAccept = '.pem,.key,.txt'

const rsaKeySizeOptions: Array<{ label: string; value: RsaKeySize }> = [
  { label: '2048', value: 2048 },
  { label: '3072', value: 3072 },
  { label: '4096', value: 4096 },
]

const rsaHashOptions: Array<{ label: string; value: HashAlgorithm }> = [
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' },
]

const ecCurveOptions: Array<{ label: string; value: EcCurve }> = [
  { label: 'P-256', value: 'P-256' },
  { label: 'P-384', value: 'P-384' },
  { label: 'P-521', value: 'P-521' },
]

const keySource = useStorage<KeySource>('tools:csr-generator:key-source', 'generate')
const algorithm = useStorage<KeyAlgorithm>('tools:csr-generator:algorithm', 'rsa')
const rsaKeySize = useStorage<RsaKeySize>('tools:csr-generator:rsa-key-size', 2048)
const rsaHash = useStorage<HashAlgorithm>('tools:csr-generator:rsa-hash', 'SHA-256')
const ecCurve = useStorage<EcCurve>('tools:csr-generator:ec-curve', 'P-256')

const defaultSubject: SubjectInput = {
  commonName: 'example.com',
  organization: '',
  organizationalUnit: '',
  country: '',
  state: '',
  locality: '',
  emailAddress: '',
}

const subject = useStorage<SubjectInput>('tools:csr-generator:subject', defaultSubject)

const sanDns = useStorage('tools:csr-generator:san-dns', '')
const sanIp = useStorage('tools:csr-generator:san-ip', '')
const sanEmail = useStorage('tools:csr-generator:san-email', '')
const sanUri = useStorage('tools:csr-generator:san-uri', '')

const storedKeyInput = useStorage('tools:csr-generator:private-key', '')
const keyInput = ref<string | File>(storedKeyInput.value)

watch(keyInput, (value) => {
  if (typeof value === 'string') {
    storedKeyInput.value = value
  }
})

const csrOutput = ref('')
const privateKeyOutput = ref('')
const keyAlgorithmLabel = ref('')
const errorMessage = ref('')
const generating = ref(false)

const csrDownloadBlob = computed(() =>
  csrOutput.value ? new Blob([csrOutput.value], { type: 'application/pkcs10' }) : null,
)
const csrDownloadUrl = useObjectUrl(csrDownloadBlob)

const privateKeyDownloadBlob = computed(() =>
  privateKeyOutput.value
    ? new Blob([privateKeyOutput.value], { type: 'application/x-pem-file' })
    : null,
)
const privateKeyDownloadUrl = useObjectUrl(privateKeyDownloadBlob)

const keyInputStatus = computed(() => {
  if (keySource.value !== 'import') return undefined
  if (!errorMessage.value) return undefined
  return 'error'
})

watch([keySource, algorithm, rsaKeySize, rsaHash, ecCurve], () => {
  resetOutputs()
})

function resetOutputs() {
  csrOutput.value = ''
  privateKeyOutput.value = ''
  keyAlgorithmLabel.value = ''
  errorMessage.value = ''
}

function splitLines(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

async function readInputText(value: string | File): Promise<string> {
  if (typeof value === 'string') {
    return value
  }
  return await value.text()
}

async function generate() {
  generating.value = true
  errorMessage.value = ''

  try {
    const keyPem = keySource.value === 'import' ? await readInputText(keyInput.value) : ''
    const input: CsrCreateInput = {
      keySource: keySource.value,
      algorithm: algorithm.value,
      rsaKeySize: rsaKeySize.value,
      rsaHash: rsaHash.value,
      ecCurve: ecCurve.value,
      keyPem,
      subject: subject.value,
      san: {
        dns: splitLines(sanDns.value),
        ip: splitLines(sanIp.value),
        email: splitLines(sanEmail.value),
        uri: splitLines(sanUri.value),
      },
    }

    const result = await createCsr(input)
    csrOutput.value = result.csrPem
    privateKeyOutput.value = result.privateKeyPem ?? ''
    keyAlgorithmLabel.value = result.keyAlgorithmLabel
  } catch (error) {
    csrOutput.value = ''
    privateKeyOutput.value = ''
    keyAlgorithmLabel.value = ''
    errorMessage.value = formatError(error)
  } finally {
    generating.value = false
  }
}

function formatError(error: unknown): string {
  if (error instanceof CsrGeneratorError) {
    // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
    return t(error.key, error.params ?? {})
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
</script>

<style scoped>
:deep(.monospace-field textarea),
:deep(.monospace-field input) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}

:deep(.input-hint) {
  display: block;
  margin-top: 8px;
}

:deep(.wide-form-item .n-form-item-blank) {
  width: 100%;
}
</style>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys -->
<i18n lang="json">
{
  "en": {
    "errorMissingSubjectOrSan": "Provide at least one Subject field or SAN entry.",
    "errorInvalidPem": "Invalid PEM input.",
    "errorUnsupportedPem": "Unsupported PEM block. Provide a private key.",
    "errorEncryptedKey": "Encrypted private keys are not supported.",
    "errorUnsupportedCurve": "Unsupported elliptic curve.",
    "errorUnsupportedKeyType": "Unsupported key type for CSR signing.",
    "errorMissingPrivateKey": "Private key input is required.",
    "errorInvalidSanIp": "Invalid IP address in SAN: {message}"
  },
  "zh": {
    "errorMissingSubjectOrSan": "请至少填写一项主体或 SAN。",
    "errorInvalidPem": "无效的 PEM 输入。",
    "errorUnsupportedPem": "不支持的 PEM 块，请提供私钥。",
    "errorEncryptedKey": "不支持加密私钥。",
    "errorUnsupportedCurve": "不支持的椭圆曲线。",
    "errorUnsupportedKeyType": "该密钥类型不支持 CSR 签名。",
    "errorMissingPrivateKey": "需要提供私钥。",
    "errorInvalidSanIp": "SAN 中的 IP 地址无效：{message}"
  },
  "zh-CN": {
    "errorMissingSubjectOrSan": "请至少填写一项主体或 SAN。",
    "errorInvalidPem": "无效的 PEM 输入。",
    "errorUnsupportedPem": "不支持的 PEM 块，请提供私钥。",
    "errorEncryptedKey": "不支持加密私钥。",
    "errorUnsupportedCurve": "不支持的椭圆曲线。",
    "errorUnsupportedKeyType": "该密钥类型不支持 CSR 签名。",
    "errorMissingPrivateKey": "需要提供私钥。",
    "errorInvalidSanIp": "SAN 中的 IP 地址无效：{message}"
  },
  "zh-TW": {
    "errorMissingSubjectOrSan": "請至少填寫一項主體或 SAN。",
    "errorInvalidPem": "無效的 PEM 輸入。",
    "errorUnsupportedPem": "不支援的 PEM 區塊，請提供私鑰。",
    "errorEncryptedKey": "不支援加密私鑰。",
    "errorUnsupportedCurve": "不支援的橢圓曲線。",
    "errorUnsupportedKeyType": "此金鑰類型不支援 CSR 簽章。",
    "errorMissingPrivateKey": "需要提供私鑰。",
    "errorInvalidSanIp": "SAN 中的 IP 位址無效：{message}"
  },
  "zh-HK": {
    "errorMissingSubjectOrSan": "請至少填寫一項主體或 SAN。",
    "errorInvalidPem": "無效的 PEM 輸入。",
    "errorUnsupportedPem": "不支援的 PEM 區塊，請提供私鑰。",
    "errorEncryptedKey": "不支援加密私鑰。",
    "errorUnsupportedCurve": "不支援的橢圓曲線。",
    "errorUnsupportedKeyType": "此金鑰類型不支援 CSR 簽章。",
    "errorMissingPrivateKey": "需要提供私鑰。",
    "errorInvalidSanIp": "SAN 中的 IP 位址無效：{message}"
  },
  "es": {
    "errorMissingSubjectOrSan": "Introduce al menos un campo de Subject o un SAN.",
    "errorInvalidPem": "Entrada PEM no válida.",
    "errorUnsupportedPem": "Bloque PEM no compatible. Proporciona una clave privada.",
    "errorEncryptedKey": "Las claves privadas cifradas no están soportadas.",
    "errorUnsupportedCurve": "Curva elíptica no compatible.",
    "errorUnsupportedKeyType": "Tipo de clave no compatible para firmar CSR.",
    "errorMissingPrivateKey": "Se requiere la clave privada.",
    "errorInvalidSanIp": "Dirección IP no válida en SAN: {message}"
  },
  "fr": {
    "errorMissingSubjectOrSan": "Fournissez au moins un champ Subject ou un SAN.",
    "errorInvalidPem": "Entrée PEM invalide.",
    "errorUnsupportedPem": "Bloc PEM non pris en charge. Fournissez une clé privée.",
    "errorEncryptedKey": "Les clés privées chiffrées ne sont pas prises en charge.",
    "errorUnsupportedCurve": "Courbe elliptique non prise en charge.",
    "errorUnsupportedKeyType": "Type de clé non pris en charge pour signer un CSR.",
    "errorMissingPrivateKey": "La clé privée est requise.",
    "errorInvalidSanIp": "Adresse IP SAN invalide : {message}"
  },
  "de": {
    "errorMissingSubjectOrSan": "Geben Sie mindestens ein Subject-Feld oder SAN an.",
    "errorInvalidPem": "Ungültige PEM-Eingabe.",
    "errorUnsupportedPem": "Nicht unterstützter PEM-Block. Geben Sie einen privaten Schlüssel an.",
    "errorEncryptedKey": "Verschlüsselte private Schlüssel werden nicht unterstützt.",
    "errorUnsupportedCurve": "Nicht unterstützte Elliptische Kurve.",
    "errorUnsupportedKeyType": "Nicht unterstützter Schlüsseltyp für CSR-Signatur.",
    "errorMissingPrivateKey": "Privater Schlüssel ist erforderlich.",
    "errorInvalidSanIp": "Ungültige IP-Adresse im SAN: {message}"
  },
  "it": {
    "errorMissingSubjectOrSan": "Inserisci almeno un campo Subject o un SAN.",
    "errorInvalidPem": "Input PEM non valido.",
    "errorUnsupportedPem": "Blocco PEM non supportato. Fornisci una chiave privata.",
    "errorEncryptedKey": "Le chiavi private cifrate non sono supportate.",
    "errorUnsupportedCurve": "Curva ellittica non supportata.",
    "errorUnsupportedKeyType": "Tipo di chiave non supportato per firmare CSR.",
    "errorMissingPrivateKey": "La chiave privata è obbligatoria.",
    "errorInvalidSanIp": "Indirizzo IP SAN non valido: {message}"
  },
  "ja": {
    "errorMissingSubjectOrSan": "Subject または SAN を最低 1 つ入力してください。",
    "errorInvalidPem": "PEM 入力が無効です。",
    "errorUnsupportedPem": "未対応の PEM ブロックです。秘密鍵を指定してください。",
    "errorEncryptedKey": "暗号化された秘密鍵は未対応です。",
    "errorUnsupportedCurve": "未対応の楕円曲線です。",
    "errorUnsupportedKeyType": "この鍵タイプでは CSR 署名をサポートしていません。",
    "errorMissingPrivateKey": "秘密鍵が必要です。",
    "errorInvalidSanIp": "SAN の IP アドレスが無効です: {message}"
  },
  "ko": {
    "errorMissingSubjectOrSan": "Subject 또는 SAN을 하나 이상 입력하세요.",
    "errorInvalidPem": "유효하지 않은 PEM 입력입니다.",
    "errorUnsupportedPem": "지원되지 않는 PEM 블록입니다. 개인 키를 제공하세요.",
    "errorEncryptedKey": "암호화된 개인 키는 지원되지 않습니다.",
    "errorUnsupportedCurve": "지원되지 않는 타원 곡선입니다.",
    "errorUnsupportedKeyType": "이 키 유형은 CSR 서명을 지원하지 않습니다.",
    "errorMissingPrivateKey": "개인 키가 필요합니다.",
    "errorInvalidSanIp": "SAN의 IP 주소가 올바르지 않습니다: {message}"
  },
  "ru": {
    "errorMissingSubjectOrSan": "Укажите хотя бы одно поле Subject или SAN.",
    "errorInvalidPem": "Некорректный PEM-ввод.",
    "errorUnsupportedPem": "Неподдерживаемый PEM-блок. Укажите приватный ключ.",
    "errorEncryptedKey": "Зашифрованные приватные ключи не поддерживаются.",
    "errorUnsupportedCurve": "Неподдерживаемая эллиптическая кривая.",
    "errorUnsupportedKeyType": "Этот тип ключа не поддерживается для подписи CSR.",
    "errorMissingPrivateKey": "Нужен приватный ключ.",
    "errorInvalidSanIp": "Неверный IP-адрес в SAN: {message}"
  },
  "pt": {
    "errorMissingSubjectOrSan": "Informe pelo menos um campo Subject ou SAN.",
    "errorInvalidPem": "Entrada PEM inválida.",
    "errorUnsupportedPem": "Bloco PEM não suportado. Forneça uma chave privada.",
    "errorEncryptedKey": "Chaves privadas criptografadas não são suportadas.",
    "errorUnsupportedCurve": "Curva elíptica não suportada.",
    "errorUnsupportedKeyType": "Tipo de chave não suportado para assinar CSR.",
    "errorMissingPrivateKey": "A chave privada é obrigatória.",
    "errorInvalidSanIp": "Endereço IP inválido no SAN: {message}"
  },
  "ar": {
    "errorMissingSubjectOrSan": "أدخل حقلًا واحدًا على الأقل في Subject أو SAN.",
    "errorInvalidPem": "إدخال PEM غير صالح.",
    "errorUnsupportedPem": "كتلة PEM غير مدعومة. قدّم مفتاحًا خاصًا.",
    "errorEncryptedKey": "المفاتيح الخاصة المشفّرة غير مدعومة.",
    "errorUnsupportedCurve": "منحنى بيضاوي غير مدعوم.",
    "errorUnsupportedKeyType": "نوع المفتاح غير مدعوم لتوقيع CSR.",
    "errorMissingPrivateKey": "المفتاح الخاص مطلوب.",
    "errorInvalidSanIp": "عنوان IP غير صالح في SAN: {message}"
  },
  "hi": {
    "errorMissingSubjectOrSan": "कम से कम एक Subject या SAN दें।",
    "errorInvalidPem": "अमान्य PEM इनपुट।",
    "errorUnsupportedPem": "असमर्थित PEM ब्लॉक। निजी कुंजी प्रदान करें।",
    "errorEncryptedKey": "एन्क्रिप्टेड निजी कुंजियाँ समर्थित नहीं हैं।",
    "errorUnsupportedCurve": "असमर्थित एलिप्टिक कर्व।",
    "errorUnsupportedKeyType": "इस कुंजी प्रकार से CSR साइन समर्थित नहीं है।",
    "errorMissingPrivateKey": "निजी कुंजी आवश्यक है।",
    "errorInvalidSanIp": "SAN में IP पता अमान्य है: {message}"
  },
  "tr": {
    "errorMissingSubjectOrSan": "En az bir Subject alanı veya SAN girin.",
    "errorInvalidPem": "Geçersiz PEM girdisi.",
    "errorUnsupportedPem": "Desteklenmeyen PEM bloğu. Özel anahtar sağlayın.",
    "errorEncryptedKey": "Şifreli özel anahtarlar desteklenmez.",
    "errorUnsupportedCurve": "Desteklenmeyen eliptik eğri.",
    "errorUnsupportedKeyType": "Bu anahtar türü CSR imzasını desteklemez.",
    "errorMissingPrivateKey": "Özel anahtar gerekli.",
    "errorInvalidSanIp": "SAN içinde geçersiz IP adresi: {message}"
  },
  "nl": {
    "errorMissingSubjectOrSan": "Vul minstens één Subject-veld of SAN in.",
    "errorInvalidPem": "Ongeldige PEM-invoer.",
    "errorUnsupportedPem": "Niet-ondersteunde PEM-blok. Geef een privésleutel op.",
    "errorEncryptedKey": "Versleutelde privésleutels worden niet ondersteund.",
    "errorUnsupportedCurve": "Niet-ondersteunde elliptische curve.",
    "errorUnsupportedKeyType": "Niet-ondersteund sleuteltype voor CSR-ondertekening.",
    "errorMissingPrivateKey": "Privésleutel is vereist.",
    "errorInvalidSanIp": "Ongeldig IP-adres in SAN: {message}"
  },
  "sv": {
    "errorMissingSubjectOrSan": "Ange minst ett Subject-fält eller SAN.",
    "errorInvalidPem": "Ogiltig PEM-inmatning.",
    "errorUnsupportedPem": "Ej stödd PEM-block. Ange en privat nyckel.",
    "errorEncryptedKey": "Krypterade privata nycklar stöds inte.",
    "errorUnsupportedCurve": "Ej stödd elliptisk kurva.",
    "errorUnsupportedKeyType": "Nyckeltypen stöds inte för CSR-signering.",
    "errorMissingPrivateKey": "Privat nyckel krävs.",
    "errorInvalidSanIp": "Ogiltig IP-adress i SAN: {message}"
  },
  "pl": {
    "errorMissingSubjectOrSan": "Podaj co najmniej jedno pole Subject lub SAN.",
    "errorInvalidPem": "Nieprawidłowe dane PEM.",
    "errorUnsupportedPem": "Nieobsługiwany blok PEM. Podaj klucz prywatny.",
    "errorEncryptedKey": "Zaszyfrowane klucze prywatne nie są obsługiwane.",
    "errorUnsupportedCurve": "Nieobsługiwana krzywa eliptyczna.",
    "errorUnsupportedKeyType": "Ten typ klucza nie obsługuje podpisu CSR.",
    "errorMissingPrivateKey": "Klucz prywatny jest wymagany.",
    "errorInvalidSanIp": "Nieprawidłowy adres IP w SAN: {message}"
  },
  "vi": {
    "errorMissingSubjectOrSan": "Vui lòng nhập ít nhất một trường Subject hoặc SAN.",
    "errorInvalidPem": "PEM không hợp lệ.",
    "errorUnsupportedPem": "Khối PEM không được hỗ trợ. Hãy cung cấp khóa riêng.",
    "errorEncryptedKey": "Không hỗ trợ khóa riêng đã mã hóa.",
    "errorUnsupportedCurve": "Đường cong elip không được hỗ trợ.",
    "errorUnsupportedKeyType": "Loại khóa không hỗ trợ ký CSR.",
    "errorMissingPrivateKey": "Cần có khóa riêng.",
    "errorInvalidSanIp": "Địa chỉ IP SAN không hợp lệ: {message}"
  },
  "th": {
    "errorMissingSubjectOrSan": "กรอกอย่างน้อยหนึ่งฟิลด์ Subject หรือ SAN.",
    "errorInvalidPem": "ข้อมูล PEM ไม่ถูกต้อง.",
    "errorUnsupportedPem": "บล็อก PEM ไม่รองรับ โปรดระบุคีย์ส่วนตัว.",
    "errorEncryptedKey": "ไม่รองรับคีย์ส่วนตัวที่เข้ารหัส.",
    "errorUnsupportedCurve": "เส้นโค้งวงรีไม่รองรับ.",
    "errorUnsupportedKeyType": "ประเภทคีย์นี้ไม่รองรับการลงนาม CSR.",
    "errorMissingPrivateKey": "จำเป็นต้องมีคีย์ส่วนตัว.",
    "errorInvalidSanIp": "ที่อยู่ IP ใน SAN ไม่ถูกต้อง: {message}"
  },
  "id": {
    "errorMissingSubjectOrSan": "Masukkan minimal satu field Subject atau SAN.",
    "errorInvalidPem": "Input PEM tidak valid.",
    "errorUnsupportedPem": "Blok PEM tidak didukung. Berikan kunci privat.",
    "errorEncryptedKey": "Kunci privat terenkripsi tidak didukung.",
    "errorUnsupportedCurve": "Kurva eliptik tidak didukung.",
    "errorUnsupportedKeyType": "Jenis kunci ini tidak mendukung penandatanganan CSR.",
    "errorMissingPrivateKey": "Kunci privat diperlukan.",
    "errorInvalidSanIp": "Alamat IP di SAN tidak valid: {message}"
  },
  "he": {
    "errorMissingSubjectOrSan": "הזן לפחות שדה Subject אחד או SAN.",
    "errorInvalidPem": "קלט PEM לא תקין.",
    "errorUnsupportedPem": "בלוק PEM לא נתמך. ספק מפתח פרטי.",
    "errorEncryptedKey": "מפתחות פרטיים מוצפנים אינם נתמכים.",
    "errorUnsupportedCurve": "עקומה אליפטית לא נתמכת.",
    "errorUnsupportedKeyType": "סוג מפתח זה לא תומך בחתימת CSR.",
    "errorMissingPrivateKey": "נדרש מפתח פרטי.",
    "errorInvalidSanIp": "כתובת IP לא תקינה ב-SAN: {message}"
  },
  "ms": {
    "errorMissingSubjectOrSan": "Masukkan sekurang-kurangnya satu medan Subject atau SAN.",
    "errorInvalidPem": "Input PEM tidak sah.",
    "errorUnsupportedPem": "Blok PEM tidak disokong. Sila berikan kunci peribadi.",
    "errorEncryptedKey": "Kunci peribadi yang disulitkan tidak disokong.",
    "errorUnsupportedCurve": "Lengkung eliptik tidak disokong.",
    "errorUnsupportedKeyType": "Jenis kunci ini tidak menyokong penandatanganan CSR.",
    "errorMissingPrivateKey": "Kunci peribadi diperlukan.",
    "errorInvalidSanIp": "Alamat IP dalam SAN tidak sah: {message}"
  },
  "no": {
    "errorMissingSubjectOrSan": "Oppgi minst ett Subject-felt eller SAN.",
    "errorInvalidPem": "Ugyldig PEM-inndata.",
    "errorUnsupportedPem": "Ikke støttet PEM-blokk. Oppgi en privat nøkkel.",
    "errorEncryptedKey": "Krypterte private nøkler støttes ikke.",
    "errorUnsupportedCurve": "Ikke støttet elliptisk kurve.",
    "errorUnsupportedKeyType": "Denne nøkkeltypen støtter ikke CSR-signering.",
    "errorMissingPrivateKey": "Privat nøkkel er påkrevd.",
    "errorInvalidSanIp": "Ugyldig IP-adresse i SAN: {message}"
  }
}
</i18n>
