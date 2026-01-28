<template>
  <CertificatePublicKeyInput
    v-model:value="inputValue"
    :status="inputStatus"
    :accept="acceptedFormats"
  />

  <CertificatePublicKeyAlerts :error-message="errorMessage" :warnings="warnings" />

  <CertificatePublicKeyResults :entries="entries" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { computedAsync, useDebounce, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import CertificatePublicKeyAlerts from './CertificatePublicKeyAlerts.vue'
import CertificatePublicKeyInput from './CertificatePublicKeyInput.vue'
import CertificatePublicKeyResults from './CertificatePublicKeyResults.vue'
import { parseCertificateInput } from '../utils/certificateParser'
import type { ParseState } from '../utils/types'

const { t } = useI18n()

const defaultInput = `-----BEGIN CERTIFICATE-----
MIIBgTCCASegAwIBAgIUftI0mqWgxqcX9lWIS/FSiGXdbekwCgYIKoZIzj0EAwIw
FjEUMBIGA1UEAwwLZXhhbXBsZS5jb20wHhcNMjYwMTEzMDkxMTQ5WhcNMjcwMTEz
MDkxMTQ5WjAWMRQwEgYDVQQDDAtleGFtcGxlLmNvbTBZMBMGByqGSM49AgEGCCqG
SM49AwEHA0IABLCYkUdrGAE8Kx15ZvhkqEvUPKLZyolQe9ySpKR/SdxsIk2GiLeb
V1YvmZpQ0ti51b7a8LE1sVbUA35GYnxdlZijUzBRMB0GA1UdDgQWBBQ36VA4D6ZE
UkQrQYbeEIF6deRE4TAfBgNVHSMEGDAWgBQ36VA4D6ZEUkQrQYbeEIF6deRE4TAP
BgNVHRMBAf8EBTADAQH/MAoGCCqGSM49BAMCA0gAMEUCIBYqVd8kI1xAIbgGDS8j
DGp+7YYIS154UJiV5nYAsNNeAiEAvKuZ5GUl+PwvetdfKjmrhGSuxUsNR/lxk8Fl
KyUxsKk=
-----END CERTIFICATE-----
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEsJiRR2sYATwrHXlm+GSoS9Q8otnK
iVB73JKkpH9J3GwiTYaIt5tXVi+ZmlDS2LnVvtrwsTWxVtQDfkZifF2VmA==
-----END PUBLIC KEY-----`

const storedInput = useStorage('tools:certificate-public-key-parser:input', defaultInput)
const inputValue = ref<string | File>(storedInput.value)
const acceptedFormats = '.pem,.crt,.cer,.der,.key,.pub,.txt'

watch(inputValue, (value) => {
  if (typeof value === 'string') {
    storedInput.value = value
  }
})

const debouncedInput = useDebounce(inputValue, 150)
const parsing = ref(false)

const parserMessages = computed(() => ({
  invalidInput: t('invalidInput'),
  invalidPem: t('invalidPem'),
  parseFailed: t('parseFailed'),
  notAvailable: t('notAvailable'),
  unsupportedPemBlock: (label: string) => t('unsupportedPemBlock', { label }),
  certificateTab: (index: number) => t('certificateTab', { index }),
  publicKeyTab: (index: number) => t('publicKeyTab', { index }),
}))

const parseState = computedAsync<ParseState>(
  async () => {
    const input = debouncedInput.value
    if (typeof input === 'string') {
      if (!input.trim()) {
        return { state: 'empty' }
      }
    }

    if (!input) {
      return { state: 'empty' }
    }

    try {
      return await parseCertificateInput(input, parserMessages.value)
    } catch (error) {
      return {
        state: 'error',
        message: error instanceof Error ? error.message : String(error),
      }
    }
  },
  { state: 'empty' },
  parsing,
)

const entries = computed(() =>
  parseState.value.state === 'parsed' ? parseState.value.entries : [],
)
const warnings = computed(() =>
  parseState.value.state === 'parsed' ? parseState.value.warnings : [],
)
const errorMessage = computed(() =>
  parseState.value.state === 'error' ? parseState.value.message : undefined,
)
const inputStatus = computed(() => {
  const hasInput = typeof inputValue.value === 'string' ? inputValue.value.trim().length > 0 : true
  if (!hasInput) return undefined
  if (parseState.value.state === 'error') return 'error'
  if (parseState.value.state === 'parsed') return 'success'
  return undefined
})
</script>

<i18n lang="json">
{
  "en": {
    "invalidInput": "Unrecognized input format. Provide PEM/DER data.",
    "invalidPem": "No valid PEM blocks found.",
    "parseFailed": "Unable to parse as a certificate or public key.",
    "unsupportedPemBlock": "Unsupported PEM block: {label}",
    "certificateTab": "Certificate {index}",
    "publicKeyTab": "Public Key {index}",
    "notAvailable": "Not available"
  },
  "zh": {
    "invalidInput": "无法识别的输入格式。请提供 PEM/DER 数据。",
    "invalidPem": "未找到有效的 PEM 块。",
    "parseFailed": "无法解析为证书或公钥。",
    "unsupportedPemBlock": "不支持的 PEM 块：{label}",
    "certificateTab": "证书 {index}",
    "publicKeyTab": "公钥 {index}",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "invalidInput": "无法识别的输入格式。请提供 PEM/DER 数据。",
    "invalidPem": "未找到有效的 PEM 块。",
    "parseFailed": "无法解析为证书或公钥。",
    "unsupportedPemBlock": "不支持的 PEM 块：{label}",
    "certificateTab": "证书 {index}",
    "publicKeyTab": "公钥 {index}",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "invalidInput": "無法辨識的輸入格式。請提供 PEM/DER 資料。",
    "invalidPem": "未找到有效的 PEM 區塊。",
    "parseFailed": "無法解析為憑證或公鑰。",
    "unsupportedPemBlock": "不支援的 PEM 區塊：{label}",
    "certificateTab": "憑證 {index}",
    "publicKeyTab": "公鑰 {index}",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "invalidInput": "無法辨識的輸入格式。請提供 PEM/DER 資料。",
    "invalidPem": "未找到有效的 PEM 區塊。",
    "parseFailed": "無法解析為證書或公鑰。",
    "unsupportedPemBlock": "不支援的 PEM 區塊：{label}",
    "certificateTab": "證書 {index}",
    "publicKeyTab": "公鑰 {index}",
    "notAvailable": "不可用"
  },
  "es": {
    "invalidInput": "Formato de entrada no reconocido. Proporciona datos PEM/DER.",
    "invalidPem": "No se encontraron bloques PEM válidos.",
    "parseFailed": "No se pudo analizar como certificado o clave pública.",
    "unsupportedPemBlock": "Bloque PEM no compatible: {label}",
    "certificateTab": "Certificado {index}",
    "publicKeyTab": "Clave Pública {index}",
    "notAvailable": "No disponible"
  },
  "fr": {
    "invalidInput": "Format d'entrée non reconnu. Fournissez des données PEM/DER.",
    "invalidPem": "Aucun bloc PEM valide trouvé.",
    "parseFailed": "Impossible d'analyser comme certificat ou clé publique.",
    "unsupportedPemBlock": "Bloc PEM non pris en charge : {label}",
    "certificateTab": "Certificat {index}",
    "publicKeyTab": "Clé Publique {index}",
    "notAvailable": "Indisponible"
  },
  "de": {
    "invalidInput": "Nicht erkanntes Eingabeformat. Bitte PEM/DER-Daten angeben.",
    "invalidPem": "Keine gültigen PEM-Blöcke gefunden.",
    "parseFailed": "Konnte nicht als Zertifikat oder öffentlicher Schlüssel analysiert werden.",
    "unsupportedPemBlock": "Nicht unterstützter PEM-Block: {label}",
    "certificateTab": "Zertifikat {index}",
    "publicKeyTab": "Öffentlicher Schlüssel {index}",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "invalidInput": "Formato di input non riconosciuto. Fornisci dati PEM/DER.",
    "invalidPem": "Nessun blocco PEM valido trovato.",
    "parseFailed": "Impossibile analizzare come certificato o chiave pubblica.",
    "unsupportedPemBlock": "Blocco PEM non supportato: {label}",
    "certificateTab": "Certificato {index}",
    "publicKeyTab": "Chiave Pubblica {index}",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "invalidInput": "入力形式を認識できません。PEM/DER データを指定してください。",
    "invalidPem": "有効な PEM ブロックが見つかりません。",
    "parseFailed": "証明書または公開鍵として解析できません。",
    "unsupportedPemBlock": "未対応の PEM ブロック：{label}",
    "certificateTab": "証明書 {index}",
    "publicKeyTab": "公開鍵 {index}",
    "notAvailable": "利用不可"
  },
  "ko": {
    "invalidInput": "인식할 수 없는 입력 형식입니다. PEM/DER 데이터를 제공하세요.",
    "invalidPem": "유효한 PEM 블록을 찾을 수 없습니다.",
    "parseFailed": "인증서 또는 공개 키로 분석할 수 없습니다.",
    "unsupportedPemBlock": "지원되지 않는 PEM 블록: {label}",
    "certificateTab": "인증서 {index}",
    "publicKeyTab": "공개 키 {index}",
    "notAvailable": "사용할 수 없음"
  },
  "ru": {
    "invalidInput": "Нераспознанный формат ввода. Предоставьте данные PEM/DER.",
    "invalidPem": "Не найдены действительные PEM-блоки.",
    "parseFailed": "Не удалось разобрать как сертификат или открытый ключ.",
    "unsupportedPemBlock": "Неподдерживаемый PEM-блок: {label}",
    "certificateTab": "Сертификат {index}",
    "publicKeyTab": "Открытый Ключ {index}",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "invalidInput": "Formato de entrada não reconhecido. Forneça dados PEM/DER.",
    "invalidPem": "Nenhum bloco PEM válido encontrado.",
    "parseFailed": "Não foi possível analisar como certificado ou chave pública.",
    "unsupportedPemBlock": "Bloco PEM não suportado: {label}",
    "certificateTab": "Certificado {index}",
    "publicKeyTab": "Chave Pública {index}",
    "notAvailable": "Indisponível"
  },
  "ar": {
    "invalidInput": "تنسيق إدخال غير معروف. يرجى توفير بيانات PEM/DER.",
    "invalidPem": "لم يتم العثور على كتل PEM صالحة.",
    "parseFailed": "تعذر التحليل كشهادة أو مفتاح عام.",
    "unsupportedPemBlock": "كتلة PEM غير مدعومة: {label}",
    "certificateTab": "شهادة {index}",
    "publicKeyTab": "المفتاح العام {index}",
    "notAvailable": "غير متاح"
  },
  "hi": {
    "invalidInput": "इनपुट प्रारूप पहचाना नहीं गया। PEM/DER डेटा प्रदान करें।",
    "invalidPem": "कोई वैध PEM ब्लॉक नहीं मिला।",
    "parseFailed": "प्रमाणपत्र या सार्वजनिक कुंजी के रूप में पार्स नहीं किया जा सका।",
    "unsupportedPemBlock": "असमर्थित PEM ब्लॉक: {label}",
    "certificateTab": "प्रमाणपत्र {index}",
    "publicKeyTab": "सार्वजनिक कुंजी {index}",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "invalidInput": "Tanınmayan giriş biçimi. PEM/DER verisi sağlayın.",
    "invalidPem": "Geçerli PEM blokları bulunamadı.",
    "parseFailed": "Sertifika veya genel anahtar olarak ayrıştırılamadı.",
    "unsupportedPemBlock": "Desteklenmeyen PEM bloğu: {label}",
    "certificateTab": "Sertifika {index}",
    "publicKeyTab": "Genel Anahtar {index}",
    "notAvailable": "Kullanılamaz"
  },
  "nl": {
    "invalidInput": "Onherkend invoerformaat. Geef PEM/DER-gegevens op.",
    "invalidPem": "Geen geldige PEM-blokken gevonden.",
    "parseFailed": "Kon niet als certificaat of publieke sleutel worden geparseerd.",
    "unsupportedPemBlock": "Niet-ondersteund PEM-blok: {label}",
    "certificateTab": "Certificaat {index}",
    "publicKeyTab": "Publieke Sleutel {index}",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "invalidInput": "Okänt inmatningsformat. Ange PEM/DER-data.",
    "invalidPem": "Inga giltiga PEM-block hittades.",
    "parseFailed": "Kunde inte tolka som certifikat eller publik nyckel.",
    "unsupportedPemBlock": "PEM-block som inte stöds: {label}",
    "certificateTab": "Certifikat {index}",
    "publicKeyTab": "Publik Nyckel {index}",
    "notAvailable": "Ej tillgänglig"
  },
  "pl": {
    "invalidInput": "Nierozpoznany format danych wejściowych. Podaj dane PEM/DER.",
    "invalidPem": "Nie znaleziono prawidłowych bloków PEM.",
    "parseFailed": "Nie można przeanalizować jako certyfikat lub klucz publiczny.",
    "unsupportedPemBlock": "Nieobsługiwany blok PEM: {label}",
    "certificateTab": "Certyfikat {index}",
    "publicKeyTab": "Klucz Publiczny {index}",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "invalidInput": "Định dạng đầu vào không được nhận dạng. Cung cấp dữ liệu PEM/DER.",
    "invalidPem": "Không tìm thấy khối PEM hợp lệ.",
    "parseFailed": "Không thể phân tích thành chứng chỉ hoặc khóa công khai.",
    "unsupportedPemBlock": "Khối PEM không được hỗ trợ: {label}",
    "certificateTab": "Chứng chỉ {index}",
    "publicKeyTab": "Khóa Công Khai {index}",
    "notAvailable": "Không khả dụng"
  },
  "th": {
    "invalidInput": "รูปแบบอินพุตไม่ถูกต้อง โปรดระบุข้อมูล PEM/DER",
    "invalidPem": "ไม่พบบล็อก PEM ที่ถูกต้อง",
    "parseFailed": "ไม่สามารถวิเคราะห์เป็นใบรับรองหรือกุญแจสาธารณะ",
    "unsupportedPemBlock": "บล็อก PEM ที่ไม่รองรับ: {label}",
    "certificateTab": "ใบรับรอง {index}",
    "publicKeyTab": "คีย์สาธารณะ {index}",
    "notAvailable": "ไม่พร้อมใช้งาน"
  },
  "id": {
    "invalidInput": "Format input tidak dikenali. Sediakan data PEM/DER.",
    "invalidPem": "Tidak ditemukan blok PEM yang valid.",
    "parseFailed": "Tidak dapat dianalisis sebagai sertifikat atau kunci publik.",
    "unsupportedPemBlock": "Blok PEM tidak didukung: {label}",
    "certificateTab": "Sertifikat {index}",
    "publicKeyTab": "Kunci Publik {index}",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "invalidInput": "פורמט קלט לא מזוהה. ספק נתוני PEM/DER.",
    "invalidPem": "לא נמצאו בלוקי PEM תקינים.",
    "parseFailed": "לא ניתן לנתח כתעודה או כמפתח ציבורי.",
    "unsupportedPemBlock": "בלוק PEM לא נתמך: {label}",
    "certificateTab": "תעודה {index}",
    "publicKeyTab": "מפתח ציבורי {index}",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "invalidInput": "Format input tidak dikenali. Sediakan data PEM/DER.",
    "invalidPem": "Tiada blok PEM yang sah ditemui.",
    "parseFailed": "Tidak dapat dianalisis sebagai sijil atau kunci awam.",
    "unsupportedPemBlock": "Blok PEM tidak disokong: {label}",
    "certificateTab": "Sijil {index}",
    "publicKeyTab": "Kunci Awam {index}",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "invalidInput": "Ukjent inndataformat. Oppgi PEM/DER-data.",
    "invalidPem": "Fant ingen gyldige PEM-blokker.",
    "parseFailed": "Kunne ikke analysere som sertifikat eller offentlig nøkkel.",
    "unsupportedPemBlock": "Ikke støttet PEM-blokk: {label}",
    "certificateTab": "Sertifikat {index}",
    "publicKeyTab": "Offentlig Nøkkel {index}",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
