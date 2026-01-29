<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <NDescriptions :column="1" bordered label-placement="left">
      <NDescriptionsItem :label="t('status')">
        <NTag :type="validationResult.isValid ? 'success' : 'error'" size="small">
          {{ validationResult.isValid ? t('valid') : t('invalid') }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('region')">
        <NText depth="3">{{ regionDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('regionCode')">
        <NFlex align="center" :size="8">
          <NText code>{{ regionCodeDisplay }}</NText>
          <CopyToClipboardButton
            v-if="validationResult.regionCode"
            :content="validationResult.regionCode"
            size="small"
          />
        </NFlex>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('regionStatus')">
        <NTag :type="validationResult.isRegionValid ? 'success' : 'warning'" size="small">
          {{ validationResult.isRegionValid ? t('known') : t('unknown') }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('province')">
        <NText depth="3">{{ provinceDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('city')">
        <NText depth="3">{{ cityDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('district')">
        <NText depth="3">{{ districtDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('birthdate')">
        <NText depth="3">{{ birthDateDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('age')">
        <NText depth="3">{{ ageDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('gender')">
        <NText depth="3">{{ genderDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('sequenceCode')">
        <NText depth="3">{{ sequenceDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('checksum')">
        <NTag :type="validationResult.isChecksumValid ? 'success' : 'error'" size="small">
          {{ validationResult.isChecksumValid ? t('pass') : t('fail') }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('checkDigit')">
        <NFlex align="center" :size="8">
          <NText depth="3">{{ t('expected') }}: {{ expectedCheckDigit }}</NText>
          <NText depth="3">{{ t('actual') }}: {{ actualCheckDigit }}</NText>
        </NFlex>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('normalized')">
        <NFlex align="center" :size="8">
          <NText code>{{ normalizedDisplay }}</NText>
          <CopyToClipboardButton
            v-if="validationResult.normalized"
            :content="validationResult.normalized"
            size="small"
          />
        </NFlex>
      </NDescriptionsItem>
    </NDescriptions>
  </ToolSection>
</template>

<script setup lang="ts">
/* eslint-disable max-lines */
import { computed } from 'vue'
import { NDescriptions, NDescriptionsItem, NFlex, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { ResidentIdValidationResult } from '../data/residentId'

const { t } = useI18n()

const props = defineProps<{
  validationResult: ResidentIdValidationResult
}>()

const regionDisplay = computed(() => {
  const parts = [
    props.validationResult.provinceName,
    props.validationResult.cityName,
    props.validationResult.areaName,
  ].filter(Boolean) as string[]

  return parts.length > 0 ? parts.join(' / ') : t('notAvailable')
})

const regionCodeDisplay = computed(() => props.validationResult.regionCode ?? t('notAvailable'))

const provinceDisplay = computed(() => props.validationResult.provinceName ?? t('notAvailable'))

const cityDisplay = computed(() => props.validationResult.cityName ?? t('notAvailable'))

const districtDisplay = computed(() => props.validationResult.areaName ?? t('notAvailable'))

const birthDateDisplay = computed(() => props.validationResult.birthDateText ?? t('notAvailable'))

const ageDisplay = computed(() =>
  props.validationResult.age !== null ? `${props.validationResult.age}` : t('notAvailable'),
)

const genderDisplay = computed(() => {
  switch (props.validationResult.gender) {
    case 'male':
      return t('male')
    case 'female':
      return t('female')
    default:
      return t('unknown')
  }
})

const sequenceDisplay = computed(() => props.validationResult.sequenceCode ?? t('notAvailable'))

const expectedCheckDigit = computed(
  () => props.validationResult.expectedCheckDigit ?? t('notAvailable'),
)

const actualCheckDigit = computed(
  () => props.validationResult.actualCheckDigit ?? t('notAvailable'),
)

const normalizedDisplay = computed(() => props.validationResult.normalized || t('notAvailable'))
</script>

<i18n lang="json">
{
  "en": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "region": "Region",
    "regionCode": "Region Code",
    "regionStatus": "Region Status",
    "known": "Known",
    "unknown": "Unknown",
    "province": "Province",
    "city": "City",
    "district": "District/County",
    "birthdate": "Birthdate",
    "age": "Age",
    "gender": "Gender",
    "male": "Male",
    "female": "Female",
    "sequenceCode": "Sequence Code",
    "checksum": "Checksum",
    "checkDigit": "Check Digit",
    "expected": "Expected",
    "actual": "Actual",
    "pass": "Pass",
    "fail": "Fail",
    "normalized": "Normalized ID",
    "notAvailable": "Not available"
  },
  "zh": {
    "result": "验证结果",
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "region": "地区",
    "regionCode": "地区代码",
    "regionStatus": "地区状态",
    "known": "已知",
    "unknown": "未知",
    "province": "省份",
    "city": "城市",
    "district": "区县",
    "birthdate": "出生日期",
    "age": "年龄",
    "gender": "性别",
    "male": "男",
    "female": "女",
    "sequenceCode": "顺序码",
    "checksum": "校验和",
    "checkDigit": "校验位",
    "expected": "期望",
    "actual": "实际",
    "pass": "通过",
    "fail": "失败",
    "normalized": "标准化身份证号",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "result": "验证结果",
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "region": "地区",
    "regionCode": "地区代码",
    "regionStatus": "地区状态",
    "known": "已知",
    "unknown": "未知",
    "province": "省份",
    "city": "城市",
    "district": "区县",
    "birthdate": "出生日期",
    "age": "年龄",
    "gender": "性别",
    "male": "男",
    "female": "女",
    "sequenceCode": "顺序码",
    "checksum": "校验和",
    "checkDigit": "校验位",
    "expected": "期望",
    "actual": "实际",
    "pass": "通过",
    "fail": "失败",
    "normalized": "标准化身份证号",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "result": "驗證結果",
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "region": "地區",
    "regionCode": "地區代碼",
    "regionStatus": "地區狀態",
    "known": "已知",
    "unknown": "未知",
    "province": "省份",
    "city": "城市",
    "district": "區縣",
    "birthdate": "出生日期",
    "age": "年齡",
    "gender": "性別",
    "male": "男",
    "female": "女",
    "sequenceCode": "順序碼",
    "checksum": "校驗和",
    "checkDigit": "校驗位",
    "expected": "期望",
    "actual": "實際",
    "pass": "通過",
    "fail": "失敗",
    "normalized": "標準化身分證號",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "result": "驗證結果",
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "region": "地區",
    "regionCode": "地區代碼",
    "regionStatus": "地區狀態",
    "known": "已知",
    "unknown": "未知",
    "province": "省份",
    "city": "城市",
    "district": "區縣",
    "birthdate": "出生日期",
    "age": "年齡",
    "gender": "性別",
    "male": "男",
    "female": "女",
    "sequenceCode": "順序碼",
    "checksum": "校驗和",
    "checkDigit": "校驗位",
    "expected": "期望",
    "actual": "實際",
    "pass": "通過",
    "fail": "失敗",
    "normalized": "標準化身份證號",
    "notAvailable": "不可用"
  },
  "es": {
    "result": "Resultado de validación",
    "status": "Estado",
    "valid": "Válido",
    "invalid": "Inválido",
    "region": "Región",
    "regionCode": "Código de región",
    "regionStatus": "Estado de la región",
    "known": "Conocido",
    "unknown": "Desconocido",
    "province": "Provincia",
    "city": "Ciudad",
    "district": "Distrito/Condado",
    "birthdate": "Fecha de nacimiento",
    "age": "Edad",
    "gender": "Género",
    "male": "Masculino",
    "female": "Femenino",
    "sequenceCode": "Código de secuencia",
    "checksum": "Checksum",
    "checkDigit": "Dígito de control",
    "expected": "Esperado",
    "actual": "Actual",
    "pass": "Correcto",
    "fail": "Falló",
    "normalized": "ID normalizado",
    "notAvailable": "No disponible"
  },
  "fr": {
    "result": "Résultat de validation",
    "status": "Statut",
    "valid": "Valide",
    "invalid": "Invalide",
    "region": "Région",
    "regionCode": "Code de région",
    "regionStatus": "Statut de la région",
    "known": "Connu",
    "unknown": "Inconnu",
    "province": "Province",
    "city": "Ville",
    "district": "District/Comté",
    "birthdate": "Date de naissance",
    "age": "Âge",
    "gender": "Genre",
    "male": "Homme",
    "female": "Femme",
    "sequenceCode": "Code de séquence",
    "checksum": "Somme de contrôle",
    "checkDigit": "Chiffre de contrôle",
    "expected": "Attendu",
    "actual": "Réel",
    "pass": "Réussi",
    "fail": "Échec",
    "normalized": "ID normalisé",
    "notAvailable": "Non disponible"
  },
  "de": {
    "result": "Validierungsergebnis",
    "status": "Status",
    "valid": "Gültig",
    "invalid": "Ungültig",
    "region": "Region",
    "regionCode": "Regionscode",
    "regionStatus": "Regionsstatus",
    "known": "Bekannt",
    "unknown": "Unbekannt",
    "province": "Provinz",
    "city": "Stadt",
    "district": "Bezirk/Landkreis",
    "birthdate": "Geburtsdatum",
    "age": "Alter",
    "gender": "Geschlecht",
    "male": "Männlich",
    "female": "Weiblich",
    "sequenceCode": "Sequenzcode",
    "checksum": "Prüfsumme",
    "checkDigit": "Prüfziffer",
    "expected": "Erwartet",
    "actual": "Tatsächlich",
    "pass": "Bestanden",
    "fail": "Fehlgeschlagen",
    "normalized": "Normalisierte ID",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "result": "Risultato di validazione",
    "status": "Stato",
    "valid": "Valido",
    "invalid": "Non valido",
    "region": "Regione",
    "regionCode": "Codice regione",
    "regionStatus": "Stato della regione",
    "known": "Conosciuto",
    "unknown": "Sconosciuto",
    "province": "Provincia",
    "city": "Città",
    "district": "Distretto/Contea",
    "birthdate": "Data di nascita",
    "age": "Età",
    "gender": "Genere",
    "male": "Maschio",
    "female": "Femmina",
    "sequenceCode": "Codice di sequenza",
    "checksum": "Checksum",
    "checkDigit": "Cifra di controllo",
    "expected": "Atteso",
    "actual": "Reale",
    "pass": "Superato",
    "fail": "Fallito",
    "normalized": "ID normalizzato",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "result": "検証結果",
    "status": "状態",
    "valid": "有効",
    "invalid": "無効",
    "region": "地域",
    "regionCode": "地域コード",
    "regionStatus": "地域の状態",
    "known": "既知",
    "unknown": "不明",
    "province": "省",
    "city": "市",
    "district": "区/県",
    "birthdate": "生年月日",
    "age": "年齢",
    "gender": "性別",
    "male": "男性",
    "female": "女性",
    "sequenceCode": "順序コード",
    "checksum": "チェックサム",
    "checkDigit": "チェックディジット",
    "expected": "期待値",
    "actual": "実際",
    "pass": "合格",
    "fail": "失敗",
    "normalized": "正規化ID",
    "notAvailable": "利用不可"
  },
  "ko": {
    "result": "검증 결과",
    "status": "상태",
    "valid": "유효",
    "invalid": "유효하지 않음",
    "region": "지역",
    "regionCode": "지역 코드",
    "regionStatus": "지역 상태",
    "known": "알려짐",
    "unknown": "알 수 없음",
    "province": "성/주",
    "city": "도시",
    "district": "구/군",
    "birthdate": "생년월일",
    "age": "나이",
    "gender": "성별",
    "male": "남성",
    "female": "여성",
    "sequenceCode": "순번 코드",
    "checksum": "체크섬",
    "checkDigit": "검증 자리",
    "expected": "예상",
    "actual": "실제",
    "pass": "통과",
    "fail": "실패",
    "normalized": "정규화된 ID",
    "notAvailable": "사용할 수 없음"
  },
  "ru": {
    "result": "Результат проверки",
    "status": "Статус",
    "valid": "Действителен",
    "invalid": "Недействителен",
    "region": "Регион",
    "regionCode": "Код региона",
    "regionStatus": "Статус региона",
    "known": "Известен",
    "unknown": "Неизвестен",
    "province": "Провинция",
    "city": "Город",
    "district": "Район/округ",
    "birthdate": "Дата рождения",
    "age": "Возраст",
    "gender": "Пол",
    "male": "Мужской",
    "female": "Женский",
    "sequenceCode": "Код последовательности",
    "checksum": "Контрольная сумма",
    "checkDigit": "Контрольный знак",
    "expected": "Ожидается",
    "actual": "Фактически",
    "pass": "Пройдено",
    "fail": "Не пройдено",
    "normalized": "Нормализованный ID",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "result": "Resultado da validação",
    "status": "Status",
    "valid": "Válido",
    "invalid": "Inválido",
    "region": "Região",
    "regionCode": "Código da região",
    "regionStatus": "Status da região",
    "known": "Conhecido",
    "unknown": "Desconhecido",
    "province": "Província",
    "city": "Cidade",
    "district": "Distrito/Condado",
    "birthdate": "Data de nascimento",
    "age": "Idade",
    "gender": "Gênero",
    "male": "Masculino",
    "female": "Feminino",
    "sequenceCode": "Código de sequência",
    "checksum": "Checksum",
    "checkDigit": "Dígito verificador",
    "expected": "Esperado",
    "actual": "Atual",
    "pass": "Aprovado",
    "fail": "Reprovado",
    "normalized": "ID normalizado",
    "notAvailable": "Não disponível"
  },
  "ar": {
    "result": "نتيجة التحقق",
    "status": "الحالة",
    "valid": "صالح",
    "invalid": "غير صالح",
    "region": "المنطقة",
    "regionCode": "رمز المنطقة",
    "regionStatus": "حالة المنطقة",
    "known": "معروف",
    "unknown": "غير معروف",
    "province": "المقاطعة",
    "city": "المدينة",
    "district": "الحي/المقاطعة",
    "birthdate": "تاريخ الميلاد",
    "age": "العمر",
    "gender": "الجنس",
    "male": "ذكر",
    "female": "أنثى",
    "sequenceCode": "رمز التسلسل",
    "checksum": "المجموع الاختباري",
    "checkDigit": "رقم التحقق",
    "expected": "المتوقع",
    "actual": "الفعلي",
    "pass": "نجاح",
    "fail": "فشل",
    "normalized": "الرقم الموحّد",
    "notAvailable": "غير متاح"
  },
  "hi": {
    "result": "सत्यापन परिणाम",
    "status": "स्थिति",
    "valid": "मान्य",
    "invalid": "अमान्य",
    "region": "क्षेत्र",
    "regionCode": "क्षेत्र कोड",
    "regionStatus": "क्षेत्र की स्थिति",
    "known": "ज्ञात",
    "unknown": "अज्ञात",
    "province": "प्रांत",
    "city": "शहर",
    "district": "जिला",
    "birthdate": "जन्म तिथि",
    "age": "आयु",
    "gender": "लिंग",
    "male": "पुरुष",
    "female": "महिला",
    "sequenceCode": "अनुक्रम कोड",
    "checksum": "चेकसम",
    "checkDigit": "जाँच अंक",
    "expected": "अपेक्षित",
    "actual": "वास्तविक",
    "pass": "पास",
    "fail": "फेल",
    "normalized": "मानकीकृत आईडी",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "result": "Doğrulama Sonucu",
    "status": "Durum",
    "valid": "Geçerli",
    "invalid": "Geçersiz",
    "region": "Bölge",
    "regionCode": "Bölge Kodu",
    "regionStatus": "Bölge Durumu",
    "known": "Bilinen",
    "unknown": "Bilinmeyen",
    "province": "Eyalet",
    "city": "Şehir",
    "district": "İlçe",
    "birthdate": "Doğum tarihi",
    "age": "Yaş",
    "gender": "Cinsiyet",
    "male": "Erkek",
    "female": "Kadın",
    "sequenceCode": "Sıra kodu",
    "checksum": "Sağlama toplamı",
    "checkDigit": "Kontrol basamağı",
    "expected": "Beklenen",
    "actual": "Gerçek",
    "pass": "Geçti",
    "fail": "Başarısız",
    "normalized": "Normalize edilmiş ID",
    "notAvailable": "Mevcut değil"
  },
  "nl": {
    "result": "Validatieresultaat",
    "status": "Status",
    "valid": "Geldig",
    "invalid": "Ongeldig",
    "region": "Regio",
    "regionCode": "Regiocode",
    "regionStatus": "Regiostatus",
    "known": "Bekend",
    "unknown": "Onbekend",
    "province": "Provincie",
    "city": "Stad",
    "district": "District/County",
    "birthdate": "Geboortedatum",
    "age": "Leeftijd",
    "gender": "Geslacht",
    "male": "Man",
    "female": "Vrouw",
    "sequenceCode": "Volgnummercode",
    "checksum": "Controlegetal",
    "checkDigit": "Controlecijfer",
    "expected": "Verwacht",
    "actual": "Werkelijk",
    "pass": "Geslaagd",
    "fail": "Mislukt",
    "normalized": "Genormaliseerde ID",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "result": "Valideringsresultat",
    "status": "Status",
    "valid": "Giltig",
    "invalid": "Ogiltig",
    "region": "Region",
    "regionCode": "Regionskod",
    "regionStatus": "Regionsstatus",
    "known": "Känd",
    "unknown": "Okänd",
    "province": "Provins",
    "city": "Stad",
    "district": "Distrikt/Kommun",
    "birthdate": "Födelsedatum",
    "age": "Ålder",
    "gender": "Kön",
    "male": "Man",
    "female": "Kvinna",
    "sequenceCode": "Sekvenskod",
    "checksum": "Kontrollsumma",
    "checkDigit": "Kontrollsiffra",
    "expected": "Förväntad",
    "actual": "Faktisk",
    "pass": "Godkänd",
    "fail": "Misslyckades",
    "normalized": "Normaliserat ID",
    "notAvailable": "Inte tillgängligt"
  },
  "pl": {
    "result": "Wynik walidacji",
    "status": "Status",
    "valid": "Prawidłowy",
    "invalid": "Nieprawidłowy",
    "region": "Region",
    "regionCode": "Kod regionu",
    "regionStatus": "Status regionu",
    "known": "Znany",
    "unknown": "Nieznany",
    "province": "Województwo",
    "city": "Miasto",
    "district": "Powiat",
    "birthdate": "Data urodzenia",
    "age": "Wiek",
    "gender": "Płeć",
    "male": "Mężczyzna",
    "female": "Kobieta",
    "sequenceCode": "Kod sekwencji",
    "checksum": "Suma kontrolna",
    "checkDigit": "Cyfra kontrolna",
    "expected": "Oczekiwane",
    "actual": "Rzeczywiste",
    "pass": "Zaliczone",
    "fail": "Nieudane",
    "normalized": "Znormalizowane ID",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "result": "Kết quả xác thực",
    "status": "Trạng thái",
    "valid": "Hợp lệ",
    "invalid": "Không hợp lệ",
    "region": "Khu vực",
    "regionCode": "Mã khu vực",
    "regionStatus": "Trạng thái khu vực",
    "known": "Đã biết",
    "unknown": "Không xác định",
    "province": "Tỉnh",
    "city": "Thành phố",
    "district": "Quận/Huyện",
    "birthdate": "Ngày sinh",
    "age": "Tuổi",
    "gender": "Giới tính",
    "male": "Nam",
    "female": "Nữ",
    "sequenceCode": "Mã thứ tự",
    "checksum": "Checksum",
    "checkDigit": "Chữ số kiểm tra",
    "expected": "Kỳ vọng",
    "actual": "Thực tế",
    "pass": "Đạt",
    "fail": "Không đạt",
    "normalized": "ID chuẩn hóa",
    "notAvailable": "Không có"
  },
  "th": {
    "result": "ผลการตรวจสอบ",
    "status": "สถานะ",
    "valid": "ถูกต้อง",
    "invalid": "ไม่ถูกต้อง",
    "region": "ภูมิภาค",
    "regionCode": "รหัสภูมิภาค",
    "regionStatus": "สถานะภูมิภาค",
    "known": "รู้จัก",
    "unknown": "ไม่ทราบ",
    "province": "จังหวัด",
    "city": "เมือง",
    "district": "อำเภอ/เขต",
    "birthdate": "วันเกิด",
    "age": "อายุ",
    "gender": "เพศ",
    "male": "ชาย",
    "female": "หญิง",
    "sequenceCode": "รหัสลำดับ",
    "checksum": "เช็คซัม",
    "checkDigit": "เลขตรวจสอบ",
    "expected": "ที่คาดไว้",
    "actual": "จริง",
    "pass": "ผ่าน",
    "fail": "ไม่ผ่าน",
    "normalized": "ID ที่ปรับมาตรฐาน",
    "notAvailable": "ไม่พร้อมใช้งาน"
  },
  "id": {
    "result": "Hasil validasi",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Tidak valid",
    "region": "Wilayah",
    "regionCode": "Kode wilayah",
    "regionStatus": "Status wilayah",
    "known": "Dikenal",
    "unknown": "Tidak dikenal",
    "province": "Provinsi",
    "city": "Kota",
    "district": "Distrik/Kabupaten",
    "birthdate": "Tanggal lahir",
    "age": "Usia",
    "gender": "Jenis kelamin",
    "male": "Laki-laki",
    "female": "Perempuan",
    "sequenceCode": "Kode urutan",
    "checksum": "Checksum",
    "checkDigit": "Digit pemeriksa",
    "expected": "Diharapkan",
    "actual": "Aktual",
    "pass": "Lulus",
    "fail": "Gagal",
    "normalized": "ID ternormalisasi",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "result": "תוצאת אימות",
    "status": "סטטוס",
    "valid": "תקין",
    "invalid": "לא תקין",
    "region": "אזור",
    "regionCode": "קוד אזור",
    "regionStatus": "סטטוס אזור",
    "known": "ידוע",
    "unknown": "לא ידוע",
    "province": "מחוז",
    "city": "עיר",
    "district": "נפה/מחוז",
    "birthdate": "תאריך לידה",
    "age": "גיל",
    "gender": "מגדר",
    "male": "זכר",
    "female": "נקבה",
    "sequenceCode": "קוד רצף",
    "checksum": "סכום ביקורת",
    "checkDigit": "ספרת ביקורת",
    "expected": "צפוי",
    "actual": "בפועל",
    "pass": "עבר",
    "fail": "נכשל",
    "normalized": "מזהה מנורמל",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "result": "Hasil pengesahan",
    "status": "Status",
    "valid": "Sah",
    "invalid": "Tidak sah",
    "region": "Wilayah",
    "regionCode": "Kod wilayah",
    "regionStatus": "Status wilayah",
    "known": "Diketahui",
    "unknown": "Tidak diketahui",
    "province": "Wilayah/Negeri",
    "city": "Bandar",
    "district": "Daerah",
    "birthdate": "Tarikh lahir",
    "age": "Umur",
    "gender": "Jantina",
    "male": "Lelaki",
    "female": "Perempuan",
    "sequenceCode": "Kod urutan",
    "checksum": "Checksum",
    "checkDigit": "Digit semakan",
    "expected": "Dijangka",
    "actual": "Sebenar",
    "pass": "Lulus",
    "fail": "Gagal",
    "normalized": "ID dinormalkan",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "result": "Valideringsresultat",
    "status": "Status",
    "valid": "Gyldig",
    "invalid": "Ugyldig",
    "region": "Region",
    "regionCode": "Regionskode",
    "regionStatus": "Regionsstatus",
    "known": "Kjent",
    "unknown": "Ukjent",
    "province": "Provins",
    "city": "By",
    "district": "Distrikt/Kommune",
    "birthdate": "Fødselsdato",
    "age": "Alder",
    "gender": "Kjønn",
    "male": "Mann",
    "female": "Kvinne",
    "sequenceCode": "Sekvenskode",
    "checksum": "Kontrollsum",
    "checkDigit": "Kontrollsiffer",
    "expected": "Forventet",
    "actual": "Faktisk",
    "pass": "Bestått",
    "fail": "Feilet",
    "normalized": "Normalisert ID",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
