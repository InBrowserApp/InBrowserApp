<template>
  <ToolSectionHeader>{{ t('sanTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('sanDnsLabel')" :show-feedback="false">
        <n-input
          v-model:value="sanDns"
          class="monospace-field"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          :placeholder="t('sanDnsPlaceholder')"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('sanIpLabel')" :show-feedback="false">
        <n-input
          v-model:value="sanIp"
          class="monospace-field"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          :placeholder="t('sanIpPlaceholder')"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('sanEmailLabel')" :show-feedback="false">
        <n-input
          v-model:value="sanEmail"
          class="monospace-field"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          :placeholder="t('sanEmailPlaceholder')"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('sanUriLabel')" :show-feedback="false">
        <n-input
          v-model:value="sanUri"
          class="monospace-field"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          :placeholder="t('sanUriPlaceholder')"
        />
      </n-form-item-gi>
    </n-grid>
    <n-text depth="3" class="input-hint">{{ t('sanHint') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NGrid, NInput, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const sanDns = defineModel<string>('sanDns', { required: true })
const sanIp = defineModel<string>('sanIp', { required: true })
const sanEmail = defineModel<string>('sanEmail', { required: true })
const sanUri = defineModel<string>('sanUri', { required: true })

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS Names",
    "sanIpLabel": "IP Addresses",
    "sanEmailLabel": "Email Addresses",
    "sanUriLabel": "URIs",
    "sanDnsPlaceholder": "one per line, e.g. example.com",
    "sanIpPlaceholder": "one per line, e.g. 192.0.2.1",
    "sanEmailPlaceholder": "one per line, e.g. admin{'@'}example.com",
    "sanUriPlaceholder": "one per line, e.g. https://example.com",
    "sanHint": "SAN is recommended for modern TLS certificates."
  },
  "zh": {
    "sanTitle": "主题备用名称（SAN）",
    "sanDnsLabel": "DNS 名称",
    "sanIpLabel": "IP 地址",
    "sanEmailLabel": "邮箱地址",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "每行一个，例如 example.com",
    "sanIpPlaceholder": "每行一个，例如 192.0.2.1",
    "sanEmailPlaceholder": "每行一个，例如 admin{'@'}example.com",
    "sanUriPlaceholder": "每行一个，例如 https://example.com",
    "sanHint": "现代 TLS 证书推荐使用 SAN。"
  },
  "zh-CN": {
    "sanTitle": "主题备用名称（SAN）",
    "sanDnsLabel": "DNS 名称",
    "sanIpLabel": "IP 地址",
    "sanEmailLabel": "邮箱地址",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "每行一个，例如 example.com",
    "sanIpPlaceholder": "每行一个，例如 192.0.2.1",
    "sanEmailPlaceholder": "每行一个，例如 admin{'@'}example.com",
    "sanUriPlaceholder": "每行一个，例如 https://example.com",
    "sanHint": "现代 TLS 证书推荐使用 SAN。"
  },
  "zh-TW": {
    "sanTitle": "主體替代名稱（SAN）",
    "sanDnsLabel": "DNS 名稱",
    "sanIpLabel": "IP 位址",
    "sanEmailLabel": "電子郵件",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "每行一個，例如 example.com",
    "sanIpPlaceholder": "每行一個，例如 192.0.2.1",
    "sanEmailPlaceholder": "每行一個，例如 admin{'@'}example.com",
    "sanUriPlaceholder": "每行一個，例如 https://example.com",
    "sanHint": "現代 TLS 憑證建議使用 SAN。"
  },
  "zh-HK": {
    "sanTitle": "主體替代名稱（SAN）",
    "sanDnsLabel": "DNS 名稱",
    "sanIpLabel": "IP 位址",
    "sanEmailLabel": "電子郵件",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "每行一個，例如 example.com",
    "sanIpPlaceholder": "每行一個，例如 192.0.2.1",
    "sanEmailPlaceholder": "每行一個，例如 admin{'@'}example.com",
    "sanUriPlaceholder": "每行一個，例如 https://example.com",
    "sanHint": "現代 TLS 證書建議使用 SAN。"
  },
  "es": {
    "sanTitle": "Nombres alternativos del sujeto (SAN)",
    "sanDnsLabel": "Nombres DNS",
    "sanIpLabel": "Direcciones IP",
    "sanEmailLabel": "Correos electrónicos",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "uno por línea, p. ej. example.com",
    "sanIpPlaceholder": "uno por línea, p. ej. 192.0.2.1",
    "sanEmailPlaceholder": "uno por línea, p. ej. admin{'@'}example.com",
    "sanUriPlaceholder": "uno por línea, p. ej. https://example.com",
    "sanHint": "SAN se recomienda para certificados TLS modernos."
  },
  "fr": {
    "sanTitle": "Noms alternatifs du sujet (SAN)",
    "sanDnsLabel": "Noms DNS",
    "sanIpLabel": "Adresses IP",
    "sanEmailLabel": "Adresses e-mail",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "un par ligne, ex. example.com",
    "sanIpPlaceholder": "un par ligne, ex. 192.0.2.1",
    "sanEmailPlaceholder": "un par ligne, ex. admin{'@'}example.com",
    "sanUriPlaceholder": "un par ligne, ex. https://example.com",
    "sanHint": "SAN est recommandé pour les certificats TLS modernes."
  },
  "de": {
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS-Namen",
    "sanIpLabel": "IP-Adressen",
    "sanEmailLabel": "E-Mail-Adressen",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "eine pro Zeile, z. B. example.com",
    "sanIpPlaceholder": "eine pro Zeile, z. B. 192.0.2.1",
    "sanEmailPlaceholder": "eine pro Zeile, z. B. admin{'@'}example.com",
    "sanUriPlaceholder": "eine pro Zeile, z. B. https://example.com",
    "sanHint": "SAN wird für moderne TLS-Zertifikate empfohlen."
  },
  "it": {
    "sanTitle": "Nomi alternativi del soggetto (SAN)",
    "sanDnsLabel": "Nomi DNS",
    "sanIpLabel": "Indirizzi IP",
    "sanEmailLabel": "Email",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "uno per riga, es. example.com",
    "sanIpPlaceholder": "uno per riga, es. 192.0.2.1",
    "sanEmailPlaceholder": "uno per riga, es. admin{'@'}example.com",
    "sanUriPlaceholder": "uno per riga, es. https://example.com",
    "sanHint": "SAN è consigliato per i certificati TLS moderni."
  },
  "ja": {
    "sanTitle": "Subject Alternative Names（SAN）",
    "sanDnsLabel": "DNS 名",
    "sanIpLabel": "IP アドレス",
    "sanEmailLabel": "メールアドレス",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "1 行に 1 つ（例: example.com）",
    "sanIpPlaceholder": "1 行に 1 つ（例: 192.0.2.1）",
    "sanEmailPlaceholder": "1 行に 1 つ（例: admin{'@'}example.com）",
    "sanUriPlaceholder": "1 行に 1 つ（例: https://example.com）",
    "sanHint": "最新の TLS 証明書では SAN の使用が推奨されます。"
  },
  "ko": {
    "sanTitle": "주체 대체 이름(SAN)",
    "sanDnsLabel": "DNS 이름",
    "sanIpLabel": "IP 주소",
    "sanEmailLabel": "이메일 주소",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "한 줄에 하나씩, 예: example.com",
    "sanIpPlaceholder": "한 줄에 하나씩, 예: 192.0.2.1",
    "sanEmailPlaceholder": "한 줄에 하나씩, 예: admin{'@'}example.com",
    "sanUriPlaceholder": "한 줄에 하나씩, 예: https://example.com",
    "sanHint": "현대 TLS 인증서에는 SAN 사용이 권장됩니다."
  },
  "ru": {
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS-имена",
    "sanIpLabel": "IP-адреса",
    "sanEmailLabel": "Email-адреса",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "по одному в строке, напр. example.com",
    "sanIpPlaceholder": "по одному в строке, напр. 192.0.2.1",
    "sanEmailPlaceholder": "по одному в строке, напр. admin{'@'}example.com",
    "sanUriPlaceholder": "по одному в строке, напр. https://example.com",
    "sanHint": "SAN рекомендуется для современных TLS сертификатов."
  },
  "pt": {
    "sanTitle": "Nomes alternativos do assunto (SAN)",
    "sanDnsLabel": "Nomes DNS",
    "sanIpLabel": "Endereços IP",
    "sanEmailLabel": "E-mails",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "um por linha, ex. example.com",
    "sanIpPlaceholder": "um por linha, ex. 192.0.2.1",
    "sanEmailPlaceholder": "um por linha, ex. admin{'@'}example.com",
    "sanUriPlaceholder": "um por linha, ex. https://example.com",
    "sanHint": "SAN é recomendado para certificados TLS modernos."
  },
  "ar": {
    "sanTitle": "الأسماء البديلة للموضوع (SAN)",
    "sanDnsLabel": "أسماء DNS",
    "sanIpLabel": "عناوين IP",
    "sanEmailLabel": "عناوين البريد",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "واحد في كل سطر، مثل example.com",
    "sanIpPlaceholder": "واحد في كل سطر، مثل 192.0.2.1",
    "sanEmailPlaceholder": "واحد في كل سطر، مثل admin{'@'}example.com",
    "sanUriPlaceholder": "واحد في كل سطر، مثل https://example.com",
    "sanHint": "يوصى باستخدام SAN لشهادات TLS الحديثة."
  },
  "hi": {
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS नाम",
    "sanIpLabel": "IP पते",
    "sanEmailLabel": "ईमेल पते",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "प्रत्येक लाइन में एक, जैसे example.com",
    "sanIpPlaceholder": "प्रत्येक लाइन में एक, जैसे 192.0.2.1",
    "sanEmailPlaceholder": "प्रत्येक लाइन में एक, जैसे admin{'@'}example.com",
    "sanUriPlaceholder": "प्रत्येक लाइन में एक, जैसे https://example.com",
    "sanHint": "आधुनिक TLS प्रमाणपत्रों के लिए SAN की सिफारिश की जाती है।"
  },
  "tr": {
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS adları",
    "sanIpLabel": "IP adresleri",
    "sanEmailLabel": "E-posta adresleri",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "satır başına bir, örn. example.com",
    "sanIpPlaceholder": "satır başına bir, örn. 192.0.2.1",
    "sanEmailPlaceholder": "satır başına bir, örn. admin{'@'}example.com",
    "sanUriPlaceholder": "satır başına bir, örn. https://example.com",
    "sanHint": "Modern TLS sertifikaları için SAN önerilir."
  },
  "nl": {
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS-namen",
    "sanIpLabel": "IP-adressen",
    "sanEmailLabel": "E-mailadressen",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "één per regel, bv. example.com",
    "sanIpPlaceholder": "één per regel, bv. 192.0.2.1",
    "sanEmailPlaceholder": "één per regel, bv. admin{'@'}example.com",
    "sanUriPlaceholder": "één per regel, bv. https://example.com",
    "sanHint": "SAN wordt aanbevolen voor moderne TLS-certificaten."
  },
  "sv": {
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS-namn",
    "sanIpLabel": "IP-adresser",
    "sanEmailLabel": "E-postadresser",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "en per rad, t.ex. example.com",
    "sanIpPlaceholder": "en per rad, t.ex. 192.0.2.1",
    "sanEmailPlaceholder": "en per rad, t.ex. admin{'@'}example.com",
    "sanUriPlaceholder": "en per rad, t.ex. https://example.com",
    "sanHint": "SAN rekommenderas för moderna TLS-certifikat."
  },
  "pl": {
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "Nazwy DNS",
    "sanIpLabel": "Adresy IP",
    "sanEmailLabel": "Adresy e-mail",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "jeden na linię, np. example.com",
    "sanIpPlaceholder": "jeden na linię, np. 192.0.2.1",
    "sanEmailPlaceholder": "jeden na linię, np. admin{'@'}example.com",
    "sanUriPlaceholder": "jeden na linię, np. https://example.com",
    "sanHint": "SAN jest zalecany dla nowoczesnych certyfikatów TLS."
  },
  "vi": {
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "Tên DNS",
    "sanIpLabel": "Địa chỉ IP",
    "sanEmailLabel": "Địa chỉ email",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "mỗi dòng một, ví dụ example.com",
    "sanIpPlaceholder": "mỗi dòng một, ví dụ 192.0.2.1",
    "sanEmailPlaceholder": "mỗi dòng một, ví dụ admin{'@'}example.com",
    "sanUriPlaceholder": "mỗi dòng một, ví dụ https://example.com",
    "sanHint": "SAN được khuyến nghị cho chứng chỉ TLS hiện đại."
  },
  "th": {
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "ชื่อ DNS",
    "sanIpLabel": "ที่อยู่ IP",
    "sanEmailLabel": "อีเมล",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "หนึ่งต่อบรรทัด เช่น example.com",
    "sanIpPlaceholder": "หนึ่งต่อบรรทัด เช่น 192.0.2.1",
    "sanEmailPlaceholder": "หนึ่งต่อบรรทัด เช่น admin{'@'}example.com",
    "sanUriPlaceholder": "หนึ่งต่อบรรทัด เช่น https://example.com",
    "sanHint": "แนะนำให้ใช้ SAN สำหรับใบรับรอง TLS สมัยใหม่."
  },
  "id": {
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "Nama DNS",
    "sanIpLabel": "Alamat IP",
    "sanEmailLabel": "Alamat email",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "satu per baris, mis. example.com",
    "sanIpPlaceholder": "satu per baris, mis. 192.0.2.1",
    "sanEmailPlaceholder": "satu per baris, mis. admin{'@'}example.com",
    "sanUriPlaceholder": "satu per baris, mis. https://example.com",
    "sanHint": "SAN direkomendasikan untuk sertifikat TLS modern."
  },
  "he": {
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "שמות DNS",
    "sanIpLabel": "כתובות IP",
    "sanEmailLabel": "כתובות דוא\"ל",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "אחד בכל שורה, לדוגמה example.com",
    "sanIpPlaceholder": "אחד בכל שורה, לדוגמה 192.0.2.1",
    "sanEmailPlaceholder": "אחד בכל שורה, לדוגמה admin{'@'}example.com",
    "sanUriPlaceholder": "אחד בכל שורה, לדוגמה https://example.com",
    "sanHint": "SAN מומלץ לתעודות TLS מודרניות."
  },
  "ms": {
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "Nama DNS",
    "sanIpLabel": "Alamat IP",
    "sanEmailLabel": "Alamat e-mel",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "satu per baris, contohnya example.com",
    "sanIpPlaceholder": "satu per baris, contohnya 192.0.2.1",
    "sanEmailPlaceholder": "satu per baris, contohnya admin{'@'}example.com",
    "sanUriPlaceholder": "satu per baris, contohnya https://example.com",
    "sanHint": "SAN disyorkan untuk sijil TLS moden."
  },
  "no": {
    "sanTitle": "Subject Alternative Names (SAN)",
    "sanDnsLabel": "DNS-navn",
    "sanIpLabel": "IP-adresser",
    "sanEmailLabel": "E-postadresser",
    "sanUriLabel": "URI",
    "sanDnsPlaceholder": "én per linje, f.eks. example.com",
    "sanIpPlaceholder": "én per linje, f.eks. 192.0.2.1",
    "sanEmailPlaceholder": "én per linje, f.eks. admin{'@'}example.com",
    "sanUriPlaceholder": "én per linje, f.eks. https://example.com",
    "sanHint": "SAN anbefales for moderne TLS-sertifikater."
  }
}
</i18n>
