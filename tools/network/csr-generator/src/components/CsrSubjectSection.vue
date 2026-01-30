<template>
  <ToolSectionHeader>{{ t('subjectTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('commonName')" :show-feedback="false">
        <n-input v-model:value="subject.commonName" class="monospace-field" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('organization')" :show-feedback="false">
        <n-input v-model:value="subject.organization" class="monospace-field" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('organizationalUnit')" :show-feedback="false">
        <n-input v-model:value="subject.organizationalUnit" class="monospace-field" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('country')" :show-feedback="false">
        <n-input v-model:value="subject.country" class="monospace-field" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('state')" :show-feedback="false">
        <n-input v-model:value="subject.state" class="monospace-field" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('locality')" :show-feedback="false">
        <n-input v-model:value="subject.locality" class="monospace-field" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('emailAddress')" :show-feedback="false">
        <n-input v-model:value="subject.emailAddress" class="monospace-field" />
      </n-form-item-gi>
    </n-grid>
    <n-text depth="3" class="input-hint">{{ t('subjectHint') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NGrid, NInput, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { SubjectInput } from '../utils/csr'

const subject = defineModel<SubjectInput>('subject', { required: true })

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organization (O)",
    "organizationalUnit": "Organizational Unit (OU)",
    "country": "Country (C)",
    "state": "State / Province (ST)",
    "locality": "Locality / City (L)",
    "emailAddress": "Email Address",
    "subjectHint": "At least one Subject field or SAN entry is required."
  },
  "zh": {
    "subjectTitle": "主体（DN）",
    "commonName": "通用名称（CN）",
    "organization": "组织（O）",
    "organizationalUnit": "组织单位（OU）",
    "country": "国家/地区（C）",
    "state": "省/州（ST）",
    "locality": "城市（L）",
    "emailAddress": "邮箱地址",
    "subjectHint": "主体或 SAN 至少填写一项。"
  },
  "zh-CN": {
    "subjectTitle": "主体（DN）",
    "commonName": "通用名称（CN）",
    "organization": "组织（O）",
    "organizationalUnit": "组织单位（OU）",
    "country": "国家/地区（C）",
    "state": "省/州（ST）",
    "locality": "城市（L）",
    "emailAddress": "邮箱地址",
    "subjectHint": "主体或 SAN 至少填写一项。"
  },
  "zh-TW": {
    "subjectTitle": "主體（DN）",
    "commonName": "一般名稱（CN）",
    "organization": "組織（O）",
    "organizationalUnit": "組織單位（OU）",
    "country": "國家/地區（C）",
    "state": "州/省（ST）",
    "locality": "城市（L）",
    "emailAddress": "電子郵件",
    "subjectHint": "主體或 SAN 至少填寫一項。"
  },
  "zh-HK": {
    "subjectTitle": "主體（DN）",
    "commonName": "一般名稱（CN）",
    "organization": "組織（O）",
    "organizationalUnit": "組織單位（OU）",
    "country": "國家/地區（C）",
    "state": "州/省（ST）",
    "locality": "城市（L）",
    "emailAddress": "電子郵件",
    "subjectHint": "主體或 SAN 至少填寫一項。"
  },
  "es": {
    "subjectTitle": "Sujeto (DN)",
    "commonName": "Nombre común (CN)",
    "organization": "Organización (O)",
    "organizationalUnit": "Unidad organizativa (OU)",
    "country": "País (C)",
    "state": "Estado / Provincia (ST)",
    "locality": "Localidad / Ciudad (L)",
    "emailAddress": "Correo electrónico",
    "subjectHint": "Se requiere al menos un campo de Subject o una entrada SAN."
  },
  "fr": {
    "subjectTitle": "Sujet (DN)",
    "commonName": "Nom commun (CN)",
    "organization": "Organisation (O)",
    "organizationalUnit": "Unité organisationnelle (OU)",
    "country": "Pays (C)",
    "state": "État / Province (ST)",
    "locality": "Ville / Localité (L)",
    "emailAddress": "Adresse e-mail",
    "subjectHint": "Au moins un champ Subject ou une entrée SAN est requis."
  },
  "de": {
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organisation (O)",
    "organizationalUnit": "Organisationseinheit (OU)",
    "country": "Land (C)",
    "state": "Bundesland / Region (ST)",
    "locality": "Ort / Stadt (L)",
    "emailAddress": "E-Mail-Adresse",
    "subjectHint": "Mindestens ein Subject-Feld oder ein SAN-Eintrag ist erforderlich."
  },
  "it": {
    "subjectTitle": "Soggetto (DN)",
    "commonName": "Nome comune (CN)",
    "organization": "Organizzazione (O)",
    "organizationalUnit": "Unità organizzativa (OU)",
    "country": "Paese (C)",
    "state": "Stato / Provincia (ST)",
    "locality": "Località / Città (L)",
    "emailAddress": "Email",
    "subjectHint": "È richiesto almeno un campo Subject o un SAN."
  },
  "ja": {
    "subjectTitle": "Subject（DN）",
    "commonName": "コモンネーム（CN）",
    "organization": "組織（O）",
    "organizationalUnit": "組織単位（OU）",
    "country": "国（C）",
    "state": "都道府県（ST）",
    "locality": "市区町村（L）",
    "emailAddress": "メールアドレス",
    "subjectHint": "Subject または SAN のいずれかを最低 1 つ入力してください。"
  },
  "ko": {
    "subjectTitle": "주체(DN)",
    "commonName": "일반 이름(CN)",
    "organization": "조직(O)",
    "organizationalUnit": "조직 단위(OU)",
    "country": "국가(C)",
    "state": "주/도(ST)",
    "locality": "도시(L)",
    "emailAddress": "이메일 주소",
    "subjectHint": "Subject 또는 SAN 중 하나 이상이 필요합니다."
  },
  "ru": {
    "subjectTitle": "Subject (DN)",
    "commonName": "Общее имя (CN)",
    "organization": "Организация (O)",
    "organizationalUnit": "Подразделение (OU)",
    "country": "Страна (C)",
    "state": "Регион / область (ST)",
    "locality": "Город (L)",
    "emailAddress": "Email",
    "subjectHint": "Нужно указать хотя бы одно поле Subject или SAN."
  },
  "pt": {
    "subjectTitle": "Assunto (DN)",
    "commonName": "Nome comum (CN)",
    "organization": "Organização (O)",
    "organizationalUnit": "Unidade organizacional (OU)",
    "country": "País (C)",
    "state": "Estado / Província (ST)",
    "locality": "Localidade / Cidade (L)",
    "emailAddress": "E-mail",
    "subjectHint": "É necessário pelo menos um campo Subject ou SAN."
  },
  "ar": {
    "subjectTitle": "الموضوع (DN)",
    "commonName": "الاسم الشائع (CN)",
    "organization": "المؤسسة (O)",
    "organizationalUnit": "الوحدة التنظيمية (OU)",
    "country": "الدولة (C)",
    "state": "الولاية / المنطقة (ST)",
    "locality": "المدينة (L)",
    "emailAddress": "البريد الإلكتروني",
    "subjectHint": "يلزم إدخال حقل واحد على الأقل في Subject أو SAN."
  },
  "hi": {
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organization (O)",
    "organizationalUnit": "Organizational Unit (OU)",
    "country": "Country (C)",
    "state": "State / Province (ST)",
    "locality": "Locality / City (L)",
    "emailAddress": "ईमेल पता",
    "subjectHint": "कम से कम एक Subject फ़ील्ड या SAN एंट्री आवश्यक है।"
  },
  "tr": {
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Kuruluş (O)",
    "organizationalUnit": "Organizasyon Birimi (OU)",
    "country": "Ülke (C)",
    "state": "Eyalet / Bölge (ST)",
    "locality": "Şehir (L)",
    "emailAddress": "E-posta",
    "subjectHint": "En az bir Subject alanı veya SAN girdisi gereklidir."
  },
  "nl": {
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organisatie (O)",
    "organizationalUnit": "Organisatie-eenheid (OU)",
    "country": "Land (C)",
    "state": "Staat / Provincie (ST)",
    "locality": "Plaats / Stad (L)",
    "emailAddress": "E-mailadres",
    "subjectHint": "Minstens één Subject-veld of SAN is vereist."
  },
  "sv": {
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organisation (O)",
    "organizationalUnit": "Organisationsenhet (OU)",
    "country": "Land (C)",
    "state": "Region / Län (ST)",
    "locality": "Ort / Stad (L)",
    "emailAddress": "E-postadress",
    "subjectHint": "Minst ett Subject-fält eller SAN krävs."
  },
  "pl": {
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organizacja (O)",
    "organizationalUnit": "Jednostka organizacyjna (OU)",
    "country": "Kraj (C)",
    "state": "Województwo / Region (ST)",
    "locality": "Miejscowość (L)",
    "emailAddress": "Adres e-mail",
    "subjectHint": "Wymagane jest co najmniej jedno pole Subject lub SAN."
  },
  "vi": {
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Tổ chức (O)",
    "organizationalUnit": "Đơn vị (OU)",
    "country": "Quốc gia (C)",
    "state": "Tỉnh/Bang (ST)",
    "locality": "Thành phố (L)",
    "emailAddress": "Email",
    "subjectHint": "Cần ít nhất một trường Subject hoặc SAN."
  },
  "th": {
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "องค์กร (O)",
    "organizationalUnit": "หน่วยงาน (OU)",
    "country": "ประเทศ (C)",
    "state": "รัฐ/จังหวัด (ST)",
    "locality": "เมือง (L)",
    "emailAddress": "อีเมล",
    "subjectHint": "ต้องมีอย่างน้อยหนึ่งฟิลด์ Subject หรือ SAN."
  },
  "id": {
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organisasi (O)",
    "organizationalUnit": "Unit organisasi (OU)",
    "country": "Negara (C)",
    "state": "Provinsi / Negara bagian (ST)",
    "locality": "Kota (L)",
    "emailAddress": "Email",
    "subjectHint": "Minimal satu field Subject atau SAN diperlukan."
  },
  "he": {
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "ארגון (O)",
    "organizationalUnit": "יחידה ארגונית (OU)",
    "country": "מדינה (C)",
    "state": "מחוז / מדינה (ST)",
    "locality": "עיר (L)",
    "emailAddress": "דוא\"ל",
    "subjectHint": "נדרש לפחות שדה Subject אחד או SAN."
  },
  "ms": {
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organisasi (O)",
    "organizationalUnit": "Unit organisasi (OU)",
    "country": "Negara (C)",
    "state": "Negeri / Wilayah (ST)",
    "locality": "Bandar (L)",
    "emailAddress": "E-mel",
    "subjectHint": "Sekurang-kurangnya satu medan Subject atau SAN diperlukan."
  },
  "no": {
    "subjectTitle": "Subject (DN)",
    "commonName": "Common Name (CN)",
    "organization": "Organisasjon (O)",
    "organizationalUnit": "Organisasjonsenhet (OU)",
    "country": "Land (C)",
    "state": "Fylke / Region (ST)",
    "locality": "Sted / By (L)",
    "emailAddress": "E-post",
    "subjectHint": "Minst ett Subject-felt eller SAN er påkrevd."
  }
}
</i18n>
