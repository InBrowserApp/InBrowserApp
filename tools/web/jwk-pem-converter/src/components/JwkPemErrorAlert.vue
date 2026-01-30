<template>
  <n-alert v-if="message" type="error" :title="t('conversionErrorTitle')">
    {{ message }}
  </n-alert>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NAlert } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { JwkPemError } from '../utils/jwkPem'

const props = defineProps<{
  error?: unknown
}>()

const { t } = useI18n()

const message = computed(() => {
  if (!props.error) return ''
  if (props.error instanceof JwkPemError) {
    // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
    return t(props.error.key, props.error.params ?? {})
  }
  if (props.error instanceof Error) {
    return props.error.message
  }
  return String(props.error)
})
</script>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys -->
<i18n lang="json">
{
  "en": {
    "conversionErrorTitle": "Conversion Error",
    "errorInvalidJson": "Invalid JSON input.",
    "errorInvalidJwk": "Invalid JWK input.",
    "errorMissingField": "Missing required field: {field}.",
    "errorUnsupportedKty": "Unsupported key type: {kty}.",
    "errorUnsupportedCurve": "Unsupported curve: {crv}.",
    "errorMissingPrivateKey": "Private key data is missing.",
    "errorMissingPublicKey": "Public key data is missing.",
    "errorInvalidPem": "No valid PEM blocks found.",
    "errorUnsupportedPemLabel": "Unsupported PEM block.",
    "errorUnsupportedAlgorithm": "Unsupported algorithm: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto is not available in this environment.",
    "errorWebCryptoFailed": "WebCrypto import/export failed.",
    "errorOkpPublicKeyMissing": "OKP private key is missing a public key and cannot be derived."
  },
  "zh": {
    "conversionErrorTitle": "转换错误",
    "errorInvalidJson": "无效的 JSON 输入。",
    "errorInvalidJwk": "无效的 JWK 输入。",
    "errorMissingField": "缺少必要字段：{field}。",
    "errorUnsupportedKty": "不支持的密钥类型：{kty}。",
    "errorUnsupportedCurve": "不支持的曲线：{crv}。",
    "errorMissingPrivateKey": "缺少私钥数据。",
    "errorMissingPublicKey": "缺少公钥数据。",
    "errorInvalidPem": "未找到有效的 PEM 块。",
    "errorUnsupportedPemLabel": "不支持的 PEM 块。",
    "errorUnsupportedAlgorithm": "不支持的算法：{algorithm}。",
    "errorWebCryptoUnavailable": "当前环境不支持 WebCrypto。",
    "errorWebCryptoFailed": "WebCrypto 导入/导出失败。",
    "errorOkpPublicKeyMissing": "OKP 私钥缺少公钥且无法推导。"
  },
  "zh-CN": {
    "conversionErrorTitle": "转换错误",
    "errorInvalidJson": "无效的 JSON 输入。",
    "errorInvalidJwk": "无效的 JWK 输入。",
    "errorMissingField": "缺少必要字段：{field}。",
    "errorUnsupportedKty": "不支持的密钥类型：{kty}。",
    "errorUnsupportedCurve": "不支持的曲线：{crv}。",
    "errorMissingPrivateKey": "缺少私钥数据。",
    "errorMissingPublicKey": "缺少公钥数据。",
    "errorInvalidPem": "未找到有效的 PEM 块。",
    "errorUnsupportedPemLabel": "不支持的 PEM 块。",
    "errorUnsupportedAlgorithm": "不支持的算法：{algorithm}。",
    "errorWebCryptoUnavailable": "当前环境不支持 WebCrypto。",
    "errorWebCryptoFailed": "WebCrypto 导入/导出失败。",
    "errorOkpPublicKeyMissing": "OKP 私钥缺少公钥且无法推导。"
  },
  "zh-TW": {
    "conversionErrorTitle": "轉換錯誤",
    "errorInvalidJson": "無效的 JSON 輸入。",
    "errorInvalidJwk": "無效的 JWK 輸入。",
    "errorMissingField": "缺少必要欄位：{field}。",
    "errorUnsupportedKty": "不支援的金鑰類型：{kty}。",
    "errorUnsupportedCurve": "不支援的曲線：{crv}。",
    "errorMissingPrivateKey": "缺少私鑰資料。",
    "errorMissingPublicKey": "缺少公鑰資料。",
    "errorInvalidPem": "未找到有效的 PEM 區塊。",
    "errorUnsupportedPemLabel": "不支援的 PEM 區塊。",
    "errorUnsupportedAlgorithm": "不支援的演算法：{algorithm}。",
    "errorWebCryptoUnavailable": "目前環境不支援 WebCrypto。",
    "errorWebCryptoFailed": "WebCrypto 匯入/匯出失敗。",
    "errorOkpPublicKeyMissing": "OKP 私鑰缺少公鑰且無法推導。"
  },
  "zh-HK": {
    "conversionErrorTitle": "轉換錯誤",
    "errorInvalidJson": "無效的 JSON 輸入。",
    "errorInvalidJwk": "無效的 JWK 輸入。",
    "errorMissingField": "缺少必要欄位：{field}。",
    "errorUnsupportedKty": "不支援的金鑰類型：{kty}。",
    "errorUnsupportedCurve": "不支援的曲線：{crv}。",
    "errorMissingPrivateKey": "缺少私鑰資料。",
    "errorMissingPublicKey": "缺少公鑰資料。",
    "errorInvalidPem": "未找到有效的 PEM 區塊。",
    "errorUnsupportedPemLabel": "不支援的 PEM 區塊。",
    "errorUnsupportedAlgorithm": "不支援的演算法：{algorithm}。",
    "errorWebCryptoUnavailable": "目前環境不支援 WebCrypto。",
    "errorWebCryptoFailed": "WebCrypto 匯入/匯出失敗。",
    "errorOkpPublicKeyMissing": "OKP 私鑰缺少公鑰且無法推導。"
  },
  "es": {
    "conversionErrorTitle": "Error de conversión",
    "errorInvalidJson": "Entrada JSON no válida.",
    "errorInvalidJwk": "Entrada JWK no válida.",
    "errorMissingField": "Falta el campo requerido: {field}.",
    "errorUnsupportedKty": "Tipo de clave no compatible: {kty}.",
    "errorUnsupportedCurve": "Curva no compatible: {crv}.",
    "errorMissingPrivateKey": "Faltan datos de clave privada.",
    "errorMissingPublicKey": "Faltan datos de clave pública.",
    "errorInvalidPem": "No se encontraron bloques PEM válidos.",
    "errorUnsupportedPemLabel": "Bloque PEM no compatible.",
    "errorUnsupportedAlgorithm": "Algoritmo no compatible: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto no está disponible en este entorno.",
    "errorWebCryptoFailed": "Error al importar/exportar con WebCrypto.",
    "errorOkpPublicKeyMissing": "La clave privada OKP no tiene clave pública y no puede derivarse."
  },
  "fr": {
    "conversionErrorTitle": "Erreur de conversion",
    "errorInvalidJson": "Entrée JSON invalide.",
    "errorInvalidJwk": "Entrée JWK invalide.",
    "errorMissingField": "Champ requis manquant : {field}.",
    "errorUnsupportedKty": "Type de clé non pris en charge : {kty}.",
    "errorUnsupportedCurve": "Courbe non prise en charge : {crv}.",
    "errorMissingPrivateKey": "Données de clé privée manquantes.",
    "errorMissingPublicKey": "Données de clé publique manquantes.",
    "errorInvalidPem": "Aucun bloc PEM valide trouvé.",
    "errorUnsupportedPemLabel": "Bloc PEM non pris en charge.",
    "errorUnsupportedAlgorithm": "Algorithme non pris en charge : {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto n'est pas disponible dans cet environnement.",
    "errorWebCryptoFailed": "Échec de l'import/export WebCrypto.",
    "errorOkpPublicKeyMissing": "La clé privée OKP n'a pas de clé publique et ne peut pas être dérivée."
  },
  "de": {
    "conversionErrorTitle": "Konvertierungsfehler",
    "errorInvalidJson": "Ungültige JSON-Eingabe.",
    "errorInvalidJwk": "Ungültige JWK-Eingabe.",
    "errorMissingField": "Erforderliches Feld fehlt: {field}.",
    "errorUnsupportedKty": "Nicht unterstützter Schlüsseltyp: {kty}.",
    "errorUnsupportedCurve": "Nicht unterstützte Kurve: {crv}.",
    "errorMissingPrivateKey": "Private Schlüsseldaten fehlen.",
    "errorMissingPublicKey": "Öffentliche Schlüsseldaten fehlen.",
    "errorInvalidPem": "Keine gültigen PEM-Blöcke gefunden.",
    "errorUnsupportedPemLabel": "Nicht unterstützter PEM-Block.",
    "errorUnsupportedAlgorithm": "Nicht unterstützter Algorithmus: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto ist in dieser Umgebung nicht verfügbar.",
    "errorWebCryptoFailed": "WebCrypto-Import/Export fehlgeschlagen.",
    "errorOkpPublicKeyMissing": "OKP-Privatschlüssel hat keinen öffentlichen Schlüssel und kann nicht abgeleitet werden."
  },
  "it": {
    "conversionErrorTitle": "Errore di conversione",
    "errorInvalidJson": "Input JSON non valido.",
    "errorInvalidJwk": "Input JWK non valido.",
    "errorMissingField": "Campo obbligatorio mancante: {field}.",
    "errorUnsupportedKty": "Tipo di chiave non supportato: {kty}.",
    "errorUnsupportedCurve": "Curva non supportata: {crv}.",
    "errorMissingPrivateKey": "Dati della chiave privata mancanti.",
    "errorMissingPublicKey": "Dati della chiave pubblica mancanti.",
    "errorInvalidPem": "Nessun blocco PEM valido trovato.",
    "errorUnsupportedPemLabel": "Blocco PEM non supportato.",
    "errorUnsupportedAlgorithm": "Algoritmo non supportato: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto non disponibile in questo ambiente.",
    "errorWebCryptoFailed": "Importazione/esportazione WebCrypto non riuscita.",
    "errorOkpPublicKeyMissing": "La chiave privata OKP non ha una chiave pubblica e non può essere derivata."
  },
  "ja": {
    "conversionErrorTitle": "変換エラー",
    "errorInvalidJson": "無効な JSON 入力です。",
    "errorInvalidJwk": "無効な JWK 入力です。",
    "errorMissingField": "必須フィールドがありません: {field}。",
    "errorUnsupportedKty": "未対応のキータイプ: {kty}。",
    "errorUnsupportedCurve": "未対応の曲線: {crv}。",
    "errorMissingPrivateKey": "秘密鍵データがありません。",
    "errorMissingPublicKey": "公開鍵データがありません。",
    "errorInvalidPem": "有効な PEM ブロックが見つかりません。",
    "errorUnsupportedPemLabel": "未対応の PEM ブロックです。",
    "errorUnsupportedAlgorithm": "未対応のアルゴリズム: {algorithm}。",
    "errorWebCryptoUnavailable": "この環境では WebCrypto が利用できません。",
    "errorWebCryptoFailed": "WebCrypto のインポート/エクスポートに失敗しました。",
    "errorOkpPublicKeyMissing": "OKP の秘密鍵に公開鍵がなく、導出できません。"
  },
  "ko": {
    "conversionErrorTitle": "변환 오류",
    "errorInvalidJson": "잘못된 JSON 입력입니다.",
    "errorInvalidJwk": "잘못된 JWK 입력입니다.",
    "errorMissingField": "필수 필드 누락: {field}.",
    "errorUnsupportedKty": "지원하지 않는 키 유형: {kty}.",
    "errorUnsupportedCurve": "지원하지 않는 곡선: {crv}.",
    "errorMissingPrivateKey": "개인 키 데이터가 없습니다.",
    "errorMissingPublicKey": "공개 키 데이터가 없습니다.",
    "errorInvalidPem": "유효한 PEM 블록을 찾을 수 없습니다.",
    "errorUnsupportedPemLabel": "지원하지 않는 PEM 블록입니다.",
    "errorUnsupportedAlgorithm": "지원하지 않는 알고리즘: {algorithm}.",
    "errorWebCryptoUnavailable": "이 환경에서 WebCrypto를 사용할 수 없습니다.",
    "errorWebCryptoFailed": "WebCrypto 가져오기/내보내기에 실패했습니다.",
    "errorOkpPublicKeyMissing": "OKP 개인 키에 공개 키가 없어 파생할 수 없습니다."
  },
  "ru": {
    "conversionErrorTitle": "Ошибка преобразования",
    "errorInvalidJson": "Неверный ввод JSON.",
    "errorInvalidJwk": "Неверный ввод JWK.",
    "errorMissingField": "Отсутствует обязательное поле: {field}.",
    "errorUnsupportedKty": "Неподдерживаемый тип ключа: {kty}.",
    "errorUnsupportedCurve": "Неподдерживаемая кривая: {crv}.",
    "errorMissingPrivateKey": "Отсутствуют данные приватного ключа.",
    "errorMissingPublicKey": "Отсутствуют данные публичного ключа.",
    "errorInvalidPem": "Допустимые PEM-блоки не найдены.",
    "errorUnsupportedPemLabel": "Неподдерживаемый PEM-блок.",
    "errorUnsupportedAlgorithm": "Неподдерживаемый алгоритм: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto недоступен в этой среде.",
    "errorWebCryptoFailed": "Не удалось импортировать/экспортировать через WebCrypto.",
    "errorOkpPublicKeyMissing": "Приватный ключ OKP не содержит публичный ключ и не может быть выведен."
  },
  "pt": {
    "conversionErrorTitle": "Erro de conversão",
    "errorInvalidJson": "Entrada JSON inválida.",
    "errorInvalidJwk": "Entrada JWK inválida.",
    "errorMissingField": "Campo obrigatório ausente: {field}.",
    "errorUnsupportedKty": "Tipo de chave não suportado: {kty}.",
    "errorUnsupportedCurve": "Curva não suportada: {crv}.",
    "errorMissingPrivateKey": "Dados de chave privada ausentes.",
    "errorMissingPublicKey": "Dados de chave pública ausentes.",
    "errorInvalidPem": "Nenhum bloco PEM válido encontrado.",
    "errorUnsupportedPemLabel": "Bloco PEM não suportado.",
    "errorUnsupportedAlgorithm": "Algoritmo não suportado: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto não está disponível neste ambiente.",
    "errorWebCryptoFailed": "Falha ao importar/exportar com WebCrypto.",
    "errorOkpPublicKeyMissing": "A chave privada OKP não possui chave pública e não pode ser derivada."
  },
  "ar": {
    "conversionErrorTitle": "خطأ في التحويل",
    "errorInvalidJson": "إدخال JSON غير صالح.",
    "errorInvalidJwk": "إدخال JWK غير صالح.",
    "errorMissingField": "الحقل المطلوب مفقود: {field}.",
    "errorUnsupportedKty": "نوع المفتاح غير مدعوم: {kty}.",
    "errorUnsupportedCurve": "منحنى غير مدعوم: {crv}.",
    "errorMissingPrivateKey": "بيانات المفتاح الخاص مفقودة.",
    "errorMissingPublicKey": "بيانات المفتاح العام مفقودة.",
    "errorInvalidPem": "لم يتم العثور على كتل PEM صالحة.",
    "errorUnsupportedPemLabel": "كتلة PEM غير مدعومة.",
    "errorUnsupportedAlgorithm": "خوارزمية غير مدعومة: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto غير متوفر في هذه البيئة.",
    "errorWebCryptoFailed": "فشل استيراد/تصدير WebCrypto.",
    "errorOkpPublicKeyMissing": "المفتاح الخاص OKP يفتقد مفتاحًا عامًا ولا يمكن اشتقاقه."
  },
  "hi": {
    "conversionErrorTitle": "कन्वर्ज़न त्रुटि",
    "errorInvalidJson": "अमान्य JSON इनपुट।",
    "errorInvalidJwk": "अमान्य JWK इनपुट।",
    "errorMissingField": "आवश्यक फ़ील्ड गायब है: {field}।",
    "errorUnsupportedKty": "समर्थित नहीं कुंजी प्रकार: {kty}।",
    "errorUnsupportedCurve": "समर्थित नहीं कर्व: {crv}।",
    "errorMissingPrivateKey": "प्राइवेट की डेटा नहीं मिला।",
    "errorMissingPublicKey": "पब्लिक की डेटा नहीं मिला।",
    "errorInvalidPem": "कोई मान्य PEM ब्लॉक नहीं मिला।",
    "errorUnsupportedPemLabel": "असमर्थित PEM ब्लॉक।",
    "errorUnsupportedAlgorithm": "असमर्थित एल्गोरिथ्म: {algorithm}।",
    "errorWebCryptoUnavailable": "इस वातावरण में WebCrypto उपलब्ध नहीं है।",
    "errorWebCryptoFailed": "WebCrypto आयात/निर्यात असफल।",
    "errorOkpPublicKeyMissing": "OKP प्राइवेट की में पब्लिक की नहीं है और डेरिव नहीं की जा सकती।"
  },
  "tr": {
    "conversionErrorTitle": "Dönüştürme Hatası",
    "errorInvalidJson": "Geçersiz JSON girişi.",
    "errorInvalidJwk": "Geçersiz JWK girişi.",
    "errorMissingField": "Gerekli alan eksik: {field}.",
    "errorUnsupportedKty": "Desteklenmeyen anahtar türü: {kty}.",
    "errorUnsupportedCurve": "Desteklenmeyen eğri: {crv}.",
    "errorMissingPrivateKey": "Özel anahtar verisi eksik.",
    "errorMissingPublicKey": "Açık anahtar verisi eksik.",
    "errorInvalidPem": "Geçerli PEM blokları bulunamadı.",
    "errorUnsupportedPemLabel": "Desteklenmeyen PEM bloğu.",
    "errorUnsupportedAlgorithm": "Desteklenmeyen algoritma: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto bu ortamda kullanılamıyor.",
    "errorWebCryptoFailed": "WebCrypto içe/dışa aktarma başarısız.",
    "errorOkpPublicKeyMissing": "OKP özel anahtarında açık anahtar yok ve türetilemiyor."
  },
  "nl": {
    "conversionErrorTitle": "Conversiefout",
    "errorInvalidJson": "Ongeldige JSON-invoer.",
    "errorInvalidJwk": "Ongeldige JWK-invoer.",
    "errorMissingField": "Verplicht veld ontbreekt: {field}.",
    "errorUnsupportedKty": "Niet-ondersteund sleuteltype: {kty}.",
    "errorUnsupportedCurve": "Niet-ondersteunde curve: {crv}.",
    "errorMissingPrivateKey": "Privésleutelgegevens ontbreken.",
    "errorMissingPublicKey": "Publieke sleutelgegevens ontbreken.",
    "errorInvalidPem": "Geen geldige PEM-blokken gevonden.",
    "errorUnsupportedPemLabel": "Niet-ondersteund PEM-blok.",
    "errorUnsupportedAlgorithm": "Niet-ondersteund algoritme: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto is niet beschikbaar in deze omgeving.",
    "errorWebCryptoFailed": "WebCrypto importeren/exporteren mislukt.",
    "errorOkpPublicKeyMissing": "OKP-privésleutel mist een publieke sleutel en kan niet worden afgeleid."
  },
  "sv": {
    "conversionErrorTitle": "Konverteringsfel",
    "errorInvalidJson": "Ogiltig JSON-inmatning.",
    "errorInvalidJwk": "Ogiltig JWK-inmatning.",
    "errorMissingField": "Saknar obligatoriskt fält: {field}.",
    "errorUnsupportedKty": "Nyckeltyp stöds inte: {kty}.",
    "errorUnsupportedCurve": "Kurvan stöds inte: {crv}.",
    "errorMissingPrivateKey": "Privat nyckeldata saknas.",
    "errorMissingPublicKey": "Publik nyckeldata saknas.",
    "errorInvalidPem": "Inga giltiga PEM-block hittades.",
    "errorUnsupportedPemLabel": "PEM-block stöds inte.",
    "errorUnsupportedAlgorithm": "Algoritm stöds inte: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto är inte tillgängligt i denna miljö.",
    "errorWebCryptoFailed": "WebCrypto-import/export misslyckades.",
    "errorOkpPublicKeyMissing": "OKP-privat nyckel saknar publik nyckel och kan inte härledas."
  },
  "pl": {
    "conversionErrorTitle": "Błąd konwersji",
    "errorInvalidJson": "Nieprawidłowe wejście JSON.",
    "errorInvalidJwk": "Nieprawidłowe wejście JWK.",
    "errorMissingField": "Brak wymaganego pola: {field}.",
    "errorUnsupportedKty": "Nieobsługiwany typ klucza: {kty}.",
    "errorUnsupportedCurve": "Nieobsługiwana krzywa: {crv}.",
    "errorMissingPrivateKey": "Brak danych klucza prywatnego.",
    "errorMissingPublicKey": "Brak danych klucza publicznego.",
    "errorInvalidPem": "Nie znaleziono poprawnych bloków PEM.",
    "errorUnsupportedPemLabel": "Nieobsługiwany blok PEM.",
    "errorUnsupportedAlgorithm": "Nieobsługiwany algorytm: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto nie jest dostępne w tym środowisku.",
    "errorWebCryptoFailed": "Nieudany import/eksport WebCrypto.",
    "errorOkpPublicKeyMissing": "Klucz prywatny OKP nie ma klucza publicznego i nie można go wyprowadzić."
  },
  "vi": {
    "conversionErrorTitle": "Lỗi chuyển đổi",
    "errorInvalidJson": "JSON đầu vào không hợp lệ.",
    "errorInvalidJwk": "JWK đầu vào không hợp lệ.",
    "errorMissingField": "Thiếu trường bắt buộc: {field}.",
    "errorUnsupportedKty": "Loại khóa không hỗ trợ: {kty}.",
    "errorUnsupportedCurve": "Đường cong không hỗ trợ: {crv}.",
    "errorMissingPrivateKey": "Thiếu dữ liệu khóa riêng.",
    "errorMissingPublicKey": "Thiếu dữ liệu khóa công khai.",
    "errorInvalidPem": "Không tìm thấy khối PEM hợp lệ.",
    "errorUnsupportedPemLabel": "Khối PEM không hỗ trợ.",
    "errorUnsupportedAlgorithm": "Thuật toán không hỗ trợ: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto không khả dụng trong môi trường này.",
    "errorWebCryptoFailed": "Nhập/xuất WebCrypto thất bại.",
    "errorOkpPublicKeyMissing": "Khóa riêng OKP thiếu khóa công khai và không thể suy ra."
  },
  "th": {
    "conversionErrorTitle": "ข้อผิดพลาดการแปลง",
    "errorInvalidJson": "อินพุต JSON ไม่ถูกต้อง.",
    "errorInvalidJwk": "อินพุต JWK ไม่ถูกต้อง.",
    "errorMissingField": "ขาดฟิลด์ที่จำเป็น: {field}.",
    "errorUnsupportedKty": "ชนิดกุญแจที่ไม่รองรับ: {kty}.",
    "errorUnsupportedCurve": "เส้นโค้งที่ไม่รองรับ: {crv}.",
    "errorMissingPrivateKey": "ไม่มีข้อมูลกุญแจส่วนตัว.",
    "errorMissingPublicKey": "ไม่มีข้อมูลกุญแจสาธารณะ.",
    "errorInvalidPem": "ไม่พบบล็อก PEM ที่ถูกต้อง.",
    "errorUnsupportedPemLabel": "บล็อก PEM ที่ไม่รองรับ.",
    "errorUnsupportedAlgorithm": "อัลกอริทึมที่ไม่รองรับ: {algorithm}.",
    "errorWebCryptoUnavailable": "ไม่รองรับ WebCrypto ในสภาพแวดล้อมนี้.",
    "errorWebCryptoFailed": "นำเข้า/ส่งออก WebCrypto ล้มเหลว.",
    "errorOkpPublicKeyMissing": "กุญแจส่วนตัว OKP ไม่มีคีย์สาธารณะและไม่สามารถอนุมานได้."
  },
  "id": {
    "conversionErrorTitle": "Galat konversi",
    "errorInvalidJson": "Input JSON tidak valid.",
    "errorInvalidJwk": "Input JWK tidak valid.",
    "errorMissingField": "Bidang wajib hilang: {field}.",
    "errorUnsupportedKty": "Jenis kunci tidak didukung: {kty}.",
    "errorUnsupportedCurve": "Kurva tidak didukung: {crv}.",
    "errorMissingPrivateKey": "Data kunci privat hilang.",
    "errorMissingPublicKey": "Data kunci publik hilang.",
    "errorInvalidPem": "Blok PEM valid tidak ditemukan.",
    "errorUnsupportedPemLabel": "Blok PEM tidak didukung.",
    "errorUnsupportedAlgorithm": "Algoritme tidak didukung: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto tidak tersedia di lingkungan ini.",
    "errorWebCryptoFailed": "Impor/ekspor WebCrypto gagal.",
    "errorOkpPublicKeyMissing": "Kunci privat OKP tidak memiliki kunci publik dan tidak dapat diturunkan."
  },
  "he": {
    "conversionErrorTitle": "שגיאת המרה",
    "errorInvalidJson": "קלט JSON לא תקין.",
    "errorInvalidJwk": "קלט JWK לא תקין.",
    "errorMissingField": "חסר שדה נדרש: {field}.",
    "errorUnsupportedKty": "סוג מפתח לא נתמך: {kty}.",
    "errorUnsupportedCurve": "עקומה לא נתמכת: {crv}.",
    "errorMissingPrivateKey": "חסרים נתוני מפתח פרטי.",
    "errorMissingPublicKey": "חסרים נתוני מפתח ציבורי.",
    "errorInvalidPem": "לא נמצאו בלוקי PEM תקינים.",
    "errorUnsupportedPemLabel": "בלוק PEM לא נתמך.",
    "errorUnsupportedAlgorithm": "אלגוריתם לא נתמך: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto אינו זמין בסביבה זו.",
    "errorWebCryptoFailed": "ייבוא/ייצוא WebCrypto נכשל.",
    "errorOkpPublicKeyMissing": "למפתח פרטי OKP חסר מפתח ציבורי ולא ניתן לגזור אותו."
  },
  "ms": {
    "conversionErrorTitle": "Ralat penukaran",
    "errorInvalidJson": "Input JSON tidak sah.",
    "errorInvalidJwk": "Input JWK tidak sah.",
    "errorMissingField": "Medan wajib tiada: {field}.",
    "errorUnsupportedKty": "Jenis kunci tidak disokong: {kty}.",
    "errorUnsupportedCurve": "Lengkung tidak disokong: {crv}.",
    "errorMissingPrivateKey": "Data kunci peribadi tiada.",
    "errorMissingPublicKey": "Data kunci awam tiada.",
    "errorInvalidPem": "Tiada blok PEM sah ditemui.",
    "errorUnsupportedPemLabel": "Blok PEM tidak disokong.",
    "errorUnsupportedAlgorithm": "Algoritma tidak disokong: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto tidak tersedia dalam persekitaran ini.",
    "errorWebCryptoFailed": "Import/eksport WebCrypto gagal.",
    "errorOkpPublicKeyMissing": "Kunci peribadi OKP tiada kunci awam dan tidak boleh diterbitkan."
  },
  "no": {
    "conversionErrorTitle": "Konverteringsfeil",
    "errorInvalidJson": "Ugyldig JSON-inndata.",
    "errorInvalidJwk": "Ugyldig JWK-inndata.",
    "errorMissingField": "Mangler obligatorisk felt: {field}.",
    "errorUnsupportedKty": "Ikke støttet nøkkeltype: {kty}.",
    "errorUnsupportedCurve": "Ikke støttet kurve: {crv}.",
    "errorMissingPrivateKey": "Mangler privat nøkkeldata.",
    "errorMissingPublicKey": "Mangler offentlig nøkkeldata.",
    "errorInvalidPem": "Fant ingen gyldige PEM-blokker.",
    "errorUnsupportedPemLabel": "Ikke støttet PEM-blokk.",
    "errorUnsupportedAlgorithm": "Ikke støttet algoritme: {algorithm}.",
    "errorWebCryptoUnavailable": "WebCrypto er ikke tilgjengelig i dette miljøet.",
    "errorWebCryptoFailed": "WebCrypto-import/eksport mislyktes.",
    "errorOkpPublicKeyMissing": "OKP-privat nøkkel mangler offentlig nøkkel og kan ikke avledes."
  }
}
</i18n>
