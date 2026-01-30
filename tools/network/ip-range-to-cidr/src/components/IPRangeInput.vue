<template>
  <n-form-item :label="t('ipRange')" :rule="rule" :show-label="false">
    <n-input v-model:value="ipRange" pair separator="-" :placeholder="placeholderText" clearable />
  </n-form-item>
</template>

<script setup lang="ts">
import { NInput, NFormItem, type FormItemRule } from 'naive-ui'
import { ref, watch, computed } from 'vue'
import { isIP } from 'is-ip'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { parseIp } from 'ip-bigint'

const { t } = useI18n()

const placeholderText = computed(() => [t('startIP'), t('endIP')] as [string, string])
const ipRange = ref<[string, string]>(['', ''])
const emit = defineEmits(['update:ipRange'])
const rule: FormItemRule = {
  trigger: ['input', 'change', 'blur'],
  validator() {
    if (!isIP(ipRange.value[0]) && !isIP(ipRange.value[1])) {
      return new Error(t('invalidIPRange'))
    }

    if (!isIP(ipRange.value[0])) {
      return new Error(t('invalidStartIP'))
    }
    if (!isIP(ipRange.value[1])) {
      return new Error(t('invalidEndIP'))
    }

    const ip1Obj = parseIp(ipRange.value[0])
    const ip2Obj = parseIp(ipRange.value[1])
    if (ip1Obj.version !== ip2Obj.version) {
      return new Error(t('ipVersionMismatch'))
    }
    if (ip1Obj.number > ip2Obj.number) {
      return new Error(t('startIPMustBeSmaller'))
    }
  },
}

watch(ipRange, (value: [string, string]) => {
  if (isIP(value[0]) && isIP(value[1])) {
    const ip1Obj = parseIp(value[0])
    const ip2Obj = parseIp(value[1])
    if (ip1Obj.version === ip2Obj.version && ip1Obj.number <= ip2Obj.number) {
      emit('update:ipRange', value)
      return
    }
  }
  emit('update:ipRange', ['', ''])
})
</script>

<i18n lang="json">
{
  "en": {
    "ipRange": "IP Range",
    "startIP": "Start IP",
    "endIP": "End IP",
    "invalidIPRange": "Invalid IP Range",
    "invalidStartIP": "Invalid Start IP Address",
    "invalidEndIP": "Invalid End IP Address",
    "ipVersionMismatch": "IP version mismatch",
    "startIPMustBeSmaller": "Start IP must be smaller than End IP"
  },
  "zh": {
    "ipRange": "IP 地址范围",
    "startIP": "起始 IP",
    "endIP": "结束 IP",
    "invalidIPRange": "无效的 IP 地址范围",
    "invalidStartIP": "无效的起始 IP 地址",
    "invalidEndIP": "无效的结束 IP 地址",
    "ipVersionMismatch": "IP 版本不匹配",
    "startIPMustBeSmaller": "起始 IP 必须小于结束 IP"
  },
  "zh-CN": {
    "ipRange": "IP 地址范围",
    "startIP": "起始 IP",
    "endIP": "结束 IP",
    "invalidIPRange": "无效的 IP 地址范围",
    "invalidStartIP": "无效的起始 IP 地址",
    "invalidEndIP": "无效的结束 IP 地址",
    "ipVersionMismatch": "IP 版本不匹配",
    "startIPMustBeSmaller": "起始 IP 必须小于结束 IP"
  },
  "zh-TW": {
    "ipRange": "IP 位址範圍",
    "startIP": "起始 IP",
    "endIP": "結束 IP",
    "invalidIPRange": "無效的 IP 位址範圍",
    "invalidStartIP": "無效的起始 IP 位址",
    "invalidEndIP": "無效的結束 IP 位址",
    "ipVersionMismatch": "IP 版本不匹配",
    "startIPMustBeSmaller": "起始 IP 必須小於結束 IP"
  },
  "zh-HK": {
    "ipRange": "IP 位址範圍",
    "startIP": "起始 IP",
    "endIP": "結束 IP",
    "invalidIPRange": "無效的 IP 位址範圍",
    "invalidStartIP": "無效的起始 IP 位址",
    "invalidEndIP": "無效的結束 IP 位址",
    "ipVersionMismatch": "IP 版本不匹配",
    "startIPMustBeSmaller": "起始 IP 必須小於結束 IP"
  },
  "es": {
    "ipRange": "Rango de IP",
    "startIP": "IP de inicio",
    "endIP": "IP de fin",
    "invalidIPRange": "Rango de IP inválido",
    "invalidStartIP": "Dirección IP de inicio inválida",
    "invalidEndIP": "Dirección IP de fin inválida",
    "ipVersionMismatch": "Las versiones de IP no coinciden",
    "startIPMustBeSmaller": "La IP de inicio debe ser menor que la IP de fin"
  },
  "fr": {
    "ipRange": "Plage d'IP",
    "startIP": "IP de début",
    "endIP": "IP de fin",
    "invalidIPRange": "Plage d'IP invalide",
    "invalidStartIP": "Adresse IP de début invalide",
    "invalidEndIP": "Adresse IP de fin invalide",
    "ipVersionMismatch": "Les versions IP ne correspondent pas",
    "startIPMustBeSmaller": "L'IP de début doit être inférieure à l'IP de fin"
  },
  "de": {
    "ipRange": "IP-Bereich",
    "startIP": "Start-IP",
    "endIP": "End-IP",
    "invalidIPRange": "Ungültiger IP-Bereich",
    "invalidStartIP": "Ungültige Start-IP-Adresse",
    "invalidEndIP": "Ungültige End-IP-Adresse",
    "ipVersionMismatch": "IP-Versionen stimmen nicht überein",
    "startIPMustBeSmaller": "Start-IP muss kleiner als End-IP sein"
  },
  "it": {
    "ipRange": "Intervallo IP",
    "startIP": "IP di inizio",
    "endIP": "IP di fine",
    "invalidIPRange": "Intervallo IP non valido",
    "invalidStartIP": "Indirizzo IP di inizio non valido",
    "invalidEndIP": "Indirizzo IP di fine non valido",
    "ipVersionMismatch": "Le versioni IP non corrispondono",
    "startIPMustBeSmaller": "L'IP di inizio deve essere minore dell'IP di fine"
  },
  "ja": {
    "ipRange": "IP レンジ",
    "startIP": "開始 IP",
    "endIP": "終了 IP",
    "invalidIPRange": "無効な IP レンジ",
    "invalidStartIP": "無効な開始 IP アドレス",
    "invalidEndIP": "無効な終了 IP アドレス",
    "ipVersionMismatch": "IP バージョンが一致しません",
    "startIPMustBeSmaller": "開始 IP は終了 IP より小さくなければなりません"
  },
  "ko": {
    "ipRange": "IP 범위",
    "startIP": "시작 IP",
    "endIP": "종료 IP",
    "invalidIPRange": "잘못된 IP 범위",
    "invalidStartIP": "잘못된 시작 IP 주소",
    "invalidEndIP": "잘못된 종료 IP 주소",
    "ipVersionMismatch": "IP 버전이 일치하지 않음",
    "startIPMustBeSmaller": "시작 IP는 종료 IP보다 작아야 합니다"
  },
  "ru": {
    "ipRange": "Диапазон IP",
    "startIP": "Начальный IP",
    "endIP": "Конечный IP",
    "invalidIPRange": "Недействительный диапазон IP",
    "invalidStartIP": "Недействительный начальный IP-адрес",
    "invalidEndIP": "Недействительный конечный IP-адрес",
    "ipVersionMismatch": "Версии IP не совпадают",
    "startIPMustBeSmaller": "Начальный IP должен быть меньше конечного IP"
  },
  "pt": {
    "ipRange": "Faixa de IP",
    "startIP": "IP inicial",
    "endIP": "IP final",
    "invalidIPRange": "Faixa de IP inválida",
    "invalidStartIP": "Endereço IP inicial inválido",
    "invalidEndIP": "Endereço IP final inválido",
    "ipVersionMismatch": "Versões de IP não coincidem",
    "startIPMustBeSmaller": "IP inicial deve ser menor que o IP final"
  },
  "ar": {
    "ipRange": "نطاق IP",
    "startIP": "IP البداية",
    "endIP": "IP النهاية",
    "invalidIPRange": "نطاق IP غير صالح",
    "invalidStartIP": "عنوان IP البداية غير صالح",
    "invalidEndIP": "عنوان IP النهاية غير صالح",
    "ipVersionMismatch": "إصدارات IP غير متطابقة",
    "startIPMustBeSmaller": "يجب أن يكون IP البداية أصغر من IP النهاية"
  },
  "hi": {
    "ipRange": "IP रेंज",
    "startIP": "प्रारंभिक IP",
    "endIP": "अंतिम IP",
    "invalidIPRange": "अमान्य IP रेंज",
    "invalidStartIP": "अमान्य प्रारंभिक IP पता",
    "invalidEndIP": "अमान्य अंतिम IP पता",
    "ipVersionMismatch": "IP संस्करण मेल नहीं खाते",
    "startIPMustBeSmaller": "प्रारंभिक IP अंतिम IP से छोटा होना चाहिए"
  },
  "tr": {
    "ipRange": "IP Aralığı",
    "startIP": "Başlangıç IP",
    "endIP": "Bitiş IP",
    "invalidIPRange": "Geçersiz IP Aralığı",
    "invalidStartIP": "Geçersiz Başlangıç IP Adresi",
    "invalidEndIP": "Geçersiz Bitiş IP Adresi",
    "ipVersionMismatch": "IP sürümleri eşleşmiyor",
    "startIPMustBeSmaller": "Başlangıç IP, Bitiş IP'den küçük olmalıdır"
  },
  "nl": {
    "ipRange": "IP-bereik",
    "startIP": "Begin IP",
    "endIP": "Eind IP",
    "invalidIPRange": "Ongeldig IP-bereik",
    "invalidStartIP": "Ongeldig begin IP-adres",
    "invalidEndIP": "Ongeldig eind IP-adres",
    "ipVersionMismatch": "IP-versies komen niet overeen",
    "startIPMustBeSmaller": "Begin IP moet kleiner zijn dan eind IP"
  },
  "sv": {
    "ipRange": "IP-intervall",
    "startIP": "Start-IP",
    "endIP": "Slut-IP",
    "invalidIPRange": "Ogiltigt IP-intervall",
    "invalidStartIP": "Ogiltig start-IP-adress",
    "invalidEndIP": "Ogiltig slut-IP-adress",
    "ipVersionMismatch": "IP-versioner matchar inte",
    "startIPMustBeSmaller": "Start-IP måste vara mindre än slut-IP"
  },
  "pl": {
    "ipRange": "Zakres IP",
    "startIP": "Początkowy IP",
    "endIP": "Końcowy IP",
    "invalidIPRange": "Nieprawidłowy zakres IP",
    "invalidStartIP": "Nieprawidłowy początkowy adres IP",
    "invalidEndIP": "Nieprawidłowy końcowy adres IP",
    "ipVersionMismatch": "Wersje IP nie pasują",
    "startIPMustBeSmaller": "Początkowy IP musi być mniejszy niż końcowy IP"
  },
  "vi": {
    "ipRange": "Dải IP",
    "startIP": "IP bắt đầu",
    "endIP": "IP kết thúc",
    "invalidIPRange": "Dải IP không hợp lệ",
    "invalidStartIP": "Địa chỉ IP bắt đầu không hợp lệ",
    "invalidEndIP": "Địa chỉ IP kết thúc không hợp lệ",
    "ipVersionMismatch": "Phiên bản IP không khớp",
    "startIPMustBeSmaller": "IP bắt đầu phải nhỏ hơn IP kết thúc"
  },
  "th": {
    "ipRange": "ช่วง IP",
    "startIP": "IP เริ่มต้น",
    "endIP": "IP สิ้นสุด",
    "invalidIPRange": "ช่วง IP ไม่ถูกต้อง",
    "invalidStartIP": "ที่อยู่ IP เริ่มต้นไม่ถูกต้อง",
    "invalidEndIP": "ที่อยู่ IP สิ้นสุดไม่ถูกต้อง",
    "ipVersionMismatch": "เวอร์ชัน IP ไม่ตรงกัน",
    "startIPMustBeSmaller": "IP เริ่มต้นต้องน้อยกว่า IP สิ้นสุด"
  },
  "id": {
    "ipRange": "Rentang IP",
    "startIP": "IP Awal",
    "endIP": "IP Akhir",
    "invalidIPRange": "Rentang IP tidak valid",
    "invalidStartIP": "Alamat IP awal tidak valid",
    "invalidEndIP": "Alamat IP akhir tidak valid",
    "ipVersionMismatch": "Versi IP tidak cocok",
    "startIPMustBeSmaller": "IP awal harus lebih kecil dari IP akhir"
  },
  "he": {
    "ipRange": "טווח IP",
    "startIP": "IP התחלה",
    "endIP": "IP סיום",
    "invalidIPRange": "טווח IP לא תקין",
    "invalidStartIP": "כתובת IP התחלה לא תקינה",
    "invalidEndIP": "כתובת IP סיום לא תקינה",
    "ipVersionMismatch": "גירסאות IP לא תואמות",
    "startIPMustBeSmaller": "IP התחלה חייב להיות קטן מ-IP סיום"
  },
  "ms": {
    "ipRange": "Julat IP",
    "startIP": "IP Mula",
    "endIP": "IP Akhir",
    "invalidIPRange": "Julat IP tidak sah",
    "invalidStartIP": "Alamat IP mula tidak sah",
    "invalidEndIP": "Alamat IP akhir tidak sah",
    "ipVersionMismatch": "Versi IP tidak sepadan",
    "startIPMustBeSmaller": "IP mula mesti lebih kecil daripada IP akhir"
  },
  "no": {
    "ipRange": "IP-område",
    "startIP": "Start-IP",
    "endIP": "Slutt-IP",
    "invalidIPRange": "Ugyldig IP-område",
    "invalidStartIP": "Ugyldig start-IP-adresse",
    "invalidEndIP": "Ugyldig slutt-IP-adresse",
    "ipVersionMismatch": "IP-versjoner stemmer ikke overens",
    "startIPMustBeSmaller": "Start-IP må være mindre enn slutt-IP"
  }
}
</i18n>
