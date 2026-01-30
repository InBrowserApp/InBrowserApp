<template>
  <ToolSectionHeader v-show="privateKeyOutput">{{ t('privateKeyTitle') }}</ToolSectionHeader>
  <ToolSection v-show="privateKeyOutput">
    <n-input
      class="monospace-field"
      :value="privateKeyOutput"
      type="textarea"
      :autosize="{ minRows: 6, maxRows: 14 }"
      readonly
    />
  </ToolSection>
  <ToolSection v-show="privateKeyOutput">
    <n-flex justify="space-between" align="center">
      <CopyToClipboardButton :content="privateKeyOutput" />
      <n-button tag="a" text :href="privateKeyDownloadUrl ?? undefined" download="private-key.pem">
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('downloadKey') }}
      </n-button>
    </n-flex>
    <n-text depth="3" class="input-hint">{{ t('privateKeyWarning') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NIcon, NInput, NText } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'

defineProps<{
  privateKeyOutput: string
  privateKeyDownloadUrl?: string | null
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "privateKeyTitle": "Private Key (PKCS#8)",
    "privateKeyWarning": "Keep this private key safe. Anyone with it can impersonate your certificate.",
    "downloadKey": "Download Private Key"
  },
  "zh": {
    "privateKeyTitle": "私钥（PKCS#8）",
    "privateKeyWarning": "请妥善保管私钥，任何持有者都可冒用该证书。",
    "downloadKey": "下载私钥"
  },
  "zh-CN": {
    "privateKeyTitle": "私钥（PKCS#8）",
    "privateKeyWarning": "请妥善保管私钥，任何持有者都可冒用该证书。",
    "downloadKey": "下载私钥"
  },
  "zh-TW": {
    "privateKeyTitle": "私鑰（PKCS#8）",
    "privateKeyWarning": "請妥善保管私鑰，任何持有者都可冒用該憑證。",
    "downloadKey": "下載私鑰"
  },
  "zh-HK": {
    "privateKeyTitle": "私鑰（PKCS#8）",
    "privateKeyWarning": "請妥善保管私鑰，任何持有者都可冒用該證書。",
    "downloadKey": "下載私鑰"
  },
  "es": {
    "privateKeyTitle": "Clave privada (PKCS#8)",
    "privateKeyWarning": "Guarda esta clave privada de forma segura. Cualquiera que la tenga puede suplantar el certificado.",
    "downloadKey": "Descargar clave privada"
  },
  "fr": {
    "privateKeyTitle": "Clé privée (PKCS#8)",
    "privateKeyWarning": "Conservez cette clé privée en sécurité. Toute personne l'ayant peut usurper le certificat.",
    "downloadKey": "Télécharger la clé privée"
  },
  "de": {
    "privateKeyTitle": "Privater Schlüssel (PKCS#8)",
    "privateKeyWarning": "Bewahren Sie diesen privaten Schlüssel sicher auf. Jeder, der ihn hat, kann das Zertifikat missbrauchen.",
    "downloadKey": "Privaten Schlüssel herunterladen"
  },
  "it": {
    "privateKeyTitle": "Chiave privata (PKCS#8)",
    "privateKeyWarning": "Conserva questa chiave privata al sicuro. Chiunque la possieda può impersonare il certificato.",
    "downloadKey": "Scarica chiave privata"
  },
  "ja": {
    "privateKeyTitle": "秘密鍵（PKCS#8）",
    "privateKeyWarning": "秘密鍵は厳重に保管してください。所持者は証明書を悪用できます。",
    "downloadKey": "秘密鍵をダウンロード"
  },
  "ko": {
    "privateKeyTitle": "개인 키(PKCS#8)",
    "privateKeyWarning": "개인 키를 안전하게 보관하세요. 소유자는 인증서를 가장할 수 있습니다.",
    "downloadKey": "개인 키 다운로드"
  },
  "ru": {
    "privateKeyTitle": "Приватный ключ (PKCS#8)",
    "privateKeyWarning": "Храните приватный ключ в безопасности. Любой, кто его получит, сможет подделать сертификат.",
    "downloadKey": "Скачать приватный ключ"
  },
  "pt": {
    "privateKeyTitle": "Chave privada (PKCS#8)",
    "privateKeyWarning": "Mantenha esta chave privada segura. Quem a tiver pode se passar pelo certificado.",
    "downloadKey": "Baixar chave privada"
  },
  "ar": {
    "privateKeyTitle": "المفتاح الخاص (PKCS#8)",
    "privateKeyWarning": "احتفظ بالمفتاح الخاص بأمان. من يمتلكه يمكنه انتحال الشهادة.",
    "downloadKey": "تنزيل المفتاح الخاص"
  },
  "hi": {
    "privateKeyTitle": "निजी कुंजी (PKCS#8)",
    "privateKeyWarning": "निजी कुंजी सुरक्षित रखें। इसके होने पर कोई भी प्रमाणपत्र का दुरुपयोग कर सकता है।",
    "downloadKey": "निजी कुंजी डाउनलोड करें"
  },
  "tr": {
    "privateKeyTitle": "Özel anahtar (PKCS#8)",
    "privateKeyWarning": "Özel anahtarınızı güvenli tutun. Elinde olan kişi sertifikayı taklit edebilir.",
    "downloadKey": "Özel anahtarı indir"
  },
  "nl": {
    "privateKeyTitle": "Privésleutel (PKCS#8)",
    "privateKeyWarning": "Bewaar deze privésleutel veilig. Iedereen met toegang kan het certificaat misbruiken.",
    "downloadKey": "Privésleutel downloaden"
  },
  "sv": {
    "privateKeyTitle": "Privat nyckel (PKCS#8)",
    "privateKeyWarning": "Förvara den privata nyckeln säkert. Den som har den kan missbruka certifikatet.",
    "downloadKey": "Ladda ner privat nyckel"
  },
  "pl": {
    "privateKeyTitle": "Klucz prywatny (PKCS#8)",
    "privateKeyWarning": "Chroń klucz prywatny. Każdy, kto go ma, może podszyć się pod certyfikat.",
    "downloadKey": "Pobierz klucz prywatny"
  },
  "vi": {
    "privateKeyTitle": "Khóa riêng (PKCS#8)",
    "privateKeyWarning": "Hãy giữ khóa riêng an toàn. Ai có khóa này có thể giả mạo chứng chỉ.",
    "downloadKey": "Tải khóa riêng"
  },
  "th": {
    "privateKeyTitle": "คีย์ส่วนตัว (PKCS#8)",
    "privateKeyWarning": "เก็บคีย์ส่วนตัวให้ปลอดภัย ผู้ที่มีคีย์สามารถปลอมแปลงใบรับรองได้.",
    "downloadKey": "ดาวน์โหลดคีย์ส่วนตัว"
  },
  "id": {
    "privateKeyTitle": "Kunci privat (PKCS#8)",
    "privateKeyWarning": "Simpan kunci privat dengan aman. Siapa pun yang memilikinya bisa menyamar sebagai sertifikat.",
    "downloadKey": "Unduh kunci privat"
  },
  "he": {
    "privateKeyTitle": "מפתח פרטי (PKCS#8)",
    "privateKeyWarning": "שמור את המפתח הפרטי בבטחה. מי שברשותו יכול להתחזות לתעודה.",
    "downloadKey": "הורד מפתח פרטי"
  },
  "ms": {
    "privateKeyTitle": "Kunci peribadi (PKCS#8)",
    "privateKeyWarning": "Simpan kunci peribadi dengan selamat. Sesiapa yang memilikinya boleh menyamar sebagai sijil.",
    "downloadKey": "Muat turun kunci peribadi"
  },
  "no": {
    "privateKeyTitle": "Privat nøkkel (PKCS#8)",
    "privateKeyWarning": "Oppbevar privatnøkkelen sikkert. Den som har den kan misbruke sertifikatet.",
    "downloadKey": "Last ned privat nøkkel"
  }
}
</i18n>
