<template>
  <ToolSection>
    <n-alert type="warning" :title="t('encryptedNoticeTitle')">
      {{ t('encryptedNotice') }}
    </n-alert>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NAlert } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "encryptedNoticeTitle": "Password protected",
    "encryptedNotice": "This PDF is encrypted. Metadata may be unavailable without the password."
  },
  "zh": {
    "encryptedNoticeTitle": "需要密码",
    "encryptedNotice": "此 PDF 已加密。没有密码可能无法读取元数据。"
  },
  "zh-CN": {
    "encryptedNoticeTitle": "需要密码",
    "encryptedNotice": "此 PDF 已加密。没有密码可能无法读取元数据。"
  },
  "zh-TW": {
    "encryptedNoticeTitle": "需要密碼",
    "encryptedNotice": "此 PDF 已加密。沒有密碼可能無法讀取中繼資料。"
  },
  "zh-HK": {
    "encryptedNoticeTitle": "需要密碼",
    "encryptedNotice": "此 PDF 已加密。沒有密碼可能無法讀取中繼資料。"
  },
  "es": {
    "encryptedNoticeTitle": "Protegido con contraseña",
    "encryptedNotice": "Este PDF está cifrado. Los metadatos pueden no estar disponibles sin la contraseña."
  },
  "fr": {
    "encryptedNoticeTitle": "Protégé par mot de passe",
    "encryptedNotice": "Ce PDF est chiffré. Les métadonnées peuvent être indisponibles sans le mot de passe."
  },
  "de": {
    "encryptedNoticeTitle": "Passwortgeschützt",
    "encryptedNotice": "Dieses PDF ist verschlüsselt. Ohne Passwort sind Metadaten möglicherweise nicht verfügbar."
  },
  "it": {
    "encryptedNoticeTitle": "Protetto da password",
    "encryptedNotice": "Questo PDF è crittografato. I metadati potrebbero non essere disponibili senza la password."
  },
  "ja": {
    "encryptedNoticeTitle": "パスワード保護",
    "encryptedNotice": "この PDF は暗号化されています。パスワードがないとメタデータを取得できない場合があります。"
  },
  "ko": {
    "encryptedNoticeTitle": "비밀번호 보호",
    "encryptedNotice": "이 PDF는 암호화되어 있습니다. 비밀번호가 없으면 메타데이터를 읽을 수 없을 수 있습니다."
  },
  "ru": {
    "encryptedNoticeTitle": "Защищено паролем",
    "encryptedNotice": "Этот PDF зашифрован. Без пароля метаданные могут быть недоступны."
  },
  "pt": {
    "encryptedNoticeTitle": "Protegido por senha",
    "encryptedNotice": "Este PDF está criptografado. Os metadados podem não estar disponíveis sem a senha."
  },
  "ar": {
    "encryptedNoticeTitle": "محمي بكلمة مرور",
    "encryptedNotice": "هذا الملف مشفر. قد لا تكون البيانات الوصفية متاحة بدون كلمة المرور."
  },
  "hi": {
    "encryptedNoticeTitle": "पासवर्ड सुरक्षित",
    "encryptedNotice": "यह PDF एन्क्रिप्टेड है। पासवर्ड के बिना मेटाडेटा उपलब्ध नहीं हो सकता है।"
  },
  "tr": {
    "encryptedNoticeTitle": "Parola korumalı",
    "encryptedNotice": "Bu PDF şifreli. Parola olmadan meta verilere erişilemeyebilir."
  },
  "nl": {
    "encryptedNoticeTitle": "Wachtwoordbeveiligd",
    "encryptedNotice": "Deze PDF is versleuteld. Metadata is mogelijk niet beschikbaar zonder het wachtwoord."
  },
  "sv": {
    "encryptedNoticeTitle": "Lösenordsskyddad",
    "encryptedNotice": "Den här PDF-filen är krypterad. Metadata kan vara otillgänglig utan lösenord."
  },
  "pl": {
    "encryptedNoticeTitle": "Chronione hasłem",
    "encryptedNotice": "Ten PDF jest zaszyfrowany. Metadane mogą być niedostępne bez hasła."
  },
  "vi": {
    "encryptedNoticeTitle": "Được bảo vệ bằng mật khẩu",
    "encryptedNotice": "PDF này được mã hóa. Có thể không đọc được siêu dữ liệu nếu không có mật khẩu."
  },
  "th": {
    "encryptedNoticeTitle": "ป้องกันด้วยรหัสผ่าน",
    "encryptedNotice": "PDF นี้ถูกเข้ารหัส อาจไม่สามารถอ่านเมตาดาตาได้หากไม่มีรหัสผ่าน"
  },
  "id": {
    "encryptedNoticeTitle": "Dilindungi kata sandi",
    "encryptedNotice": "PDF ini terenkripsi. Metadata mungkin tidak tersedia tanpa kata sandi."
  },
  "he": {
    "encryptedNoticeTitle": "מוגן בסיסמה",
    "encryptedNotice": "קובץ ה-PDF הזה מוצפן. ייתכן שהמטא-דטה לא תהיה זמינה ללא הסיסמה."
  },
  "ms": {
    "encryptedNoticeTitle": "Dilindungi kata laluan",
    "encryptedNotice": "PDF ini disulitkan. Metadata mungkin tidak tersedia tanpa kata laluan."
  },
  "no": {
    "encryptedNoticeTitle": "Passordbeskyttet",
    "encryptedNotice": "Denne PDF-en er kryptert. Metadata kan være utilgjengelig uten passordet."
  }
}
</i18n>
