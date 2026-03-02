<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <NText tag="p">{{ t('description') }}</NText>

    <NH3>{{ t('checksTitle') }}</NH3>
    <NOl>
      <NLi>{{ t('check1') }}</NLi>
      <NLi>{{ t('check2') }}</NLi>
      <NLi>{{ t('check3') }}</NLi>
    </NOl>

    <NText tag="p">{{ t('note') }}</NText>
  </ToolSection>
</template>

<script setup lang="ts">
import { NText, NH3, NOl, NLi } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "zh": {
    "title": "什么是 IMEI？",
    "description": "IMEI（国际移动设备识别码）是分配给移动设备的 15 位标识符。",
    "checksTitle": "该验证器会检查",
    "check1": "长度：IMEI 必须正好为 15 位",
    "check2": "格式：移除空格和连字符后，只允许数字",
    "check3": "校验位：最后一位必须满足 Luhn 算法",
    "note": "该工具仅校验格式和校验位，不会验证黑名单状态、入网激活或设备归属。"
  },
  "zh-CN": {
    "title": "什么是 IMEI？",
    "description": "IMEI（国际移动设备识别码）是分配给移动设备的 15 位标识符。",
    "checksTitle": "该验证器会检查",
    "check1": "长度：IMEI 必须正好为 15 位",
    "check2": "格式：移除空格和连字符后，只允许数字",
    "check3": "校验位：最后一位必须满足 Luhn 算法",
    "note": "该工具仅校验格式和校验位，不会验证黑名单状态、入网激活或设备归属。"
  },
  "zh-TW": {
    "title": "什麼是 IMEI？",
    "description": "IMEI（國際行動設備識別碼）是分配給行動裝置的 15 位識別碼。",
    "checksTitle": "此驗證器會檢查",
    "check1": "長度：IMEI 必須剛好為 15 位",
    "check2": "格式：移除空白與連字號後，只允許數字",
    "check3": "校驗位：最後一位必須符合 Luhn 演算法",
    "note": "此工具僅驗證格式與校驗位，不會驗證黑名單狀態、啟用狀態或裝置歸屬。"
  },
  "zh-HK": {
    "title": "什麼是 IMEI？",
    "description": "IMEI（國際流動設備識別碼）是分配給流動裝置的 15 位識別碼。",
    "checksTitle": "此驗證器會檢查",
    "check1": "長度：IMEI 必須剛好為 15 位",
    "check2": "格式：移除空格和連字號後，只允許數字",
    "check3": "校驗位：最後一位必須符合 Luhn 演算法",
    "note": "此工具只會驗證格式與校驗位，不會驗證黑名單狀態、啟用狀態或裝置歸屬。"
  },
  "es": {
    "title": "¿Qué es el IMEI?",
    "description": "El IMEI (International Mobile Equipment Identity) es un identificador de 15 dígitos asignado a los dispositivos móviles.",
    "checksTitle": "Qué valida este verificador",
    "check1": "Longitud: el IMEI debe tener exactamente 15 dígitos",
    "check2": "Formato: solo se permiten dígitos tras eliminar espacios y guiones",
    "check3": "Checksum: el último dígito debe cumplir el algoritmo de Luhn",
    "note": "Esta herramienta solo valida formato y checksum. No verifica estado en listas negras, activación ni propiedad."
  },
  "fr": {
    "title": "Qu'est-ce que l'IMEI ?",
    "description": "L'IMEI (International Mobile Equipment Identity) est un identifiant à 15 chiffres attribué aux appareils mobiles.",
    "checksTitle": "Ce que ce validateur vérifie",
    "check1": "Longueur : l'IMEI doit contenir exactement 15 chiffres",
    "check2": "Format : seuls les chiffres sont autorisés après suppression des espaces et des tirets",
    "check3": "Checksum : le dernier chiffre doit respecter l'algorithme de Luhn",
    "note": "Cet outil valide uniquement le format et le checksum. Il ne vérifie pas le statut de liste noire, l'activation ni la propriété."
  },
  "de": {
    "title": "Was ist eine IMEI?",
    "description": "Die IMEI (International Mobile Equipment Identity) ist eine 15-stellige Kennung für mobile Geräte.",
    "checksTitle": "Was dieser Validator prüft",
    "check1": "Länge: Die IMEI muss genau 15 Ziffern haben",
    "check2": "Format: Nach dem Entfernen von Leerzeichen und Bindestrichen sind nur Ziffern erlaubt",
    "check3": "Prüfsumme: Die letzte Ziffer muss dem Luhn-Algorithmus entsprechen",
    "note": "Dieses Tool prüft nur Format und Prüfsumme. Es überprüft keinen Blacklist-Status, keine Aktivierung und keine Eigentümerschaft."
  },
  "it": {
    "title": "Che cos'è l'IMEI?",
    "description": "L'IMEI (International Mobile Equipment Identity) è un identificatore di 15 cifre assegnato ai dispositivi mobili.",
    "checksTitle": "Cosa verifica questo validatore",
    "check1": "Lunghezza: l'IMEI deve contenere esattamente 15 cifre",
    "check2": "Formato: sono consentite solo cifre dopo aver rimosso spazi e trattini",
    "check3": "Checksum: l'ultima cifra deve soddisfare l'algoritmo di Luhn",
    "note": "Questo strumento convalida solo formato e checksum. Non verifica blacklist, attivazione o proprietà."
  },
  "ja": {
    "title": "IMEI とは？",
    "description": "IMEI（International Mobile Equipment Identity）は、モバイル端末に割り当てられる15桁の識別子です。",
    "checksTitle": "このバリデーターで確認する内容",
    "check1": "長さ: IMEI はちょうど15桁である必要があります",
    "check2": "形式: 空白とハイフンを除去した後は数字のみ許可されます",
    "check3": "チェックサム: 最後の1桁は Luhn アルゴリズムを満たす必要があります",
    "note": "このツールは形式とチェックサムのみを検証します。ブラックリスト状態、アクティベーション、所有権は確認しません。"
  },
  "ko": {
    "title": "IMEI란 무엇인가요?",
    "description": "IMEI(International Mobile Equipment Identity)는 모바일 기기에 할당되는 15자리 식별자입니다.",
    "checksTitle": "이 검증기가 확인하는 항목",
    "check1": "길이: IMEI는 정확히 15자리여야 합니다",
    "check2": "형식: 공백과 하이픈을 제거한 뒤 숫자만 허용됩니다",
    "check3": "체크섬: 마지막 자리는 Luhn 알고리즘을 충족해야 합니다",
    "note": "이 도구는 형식과 체크섬만 검증합니다. 블랙리스트 상태, 개통 여부, 소유권은 확인하지 않습니다."
  },
  "ru": {
    "title": "Что такое IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) — это 15-значный идентификатор, назначаемый мобильным устройствам.",
    "checksTitle": "Что проверяет этот валидатор",
    "check1": "Длина: IMEI должен состоять ровно из 15 цифр",
    "check2": "Формат: после удаления пробелов и дефисов допускаются только цифры",
    "check3": "Контрольная сумма: последняя цифра должна соответствовать алгоритму Луна",
    "note": "Этот инструмент проверяет только формат и контрольную сумму. Он не проверяет статус в черном списке, активацию или право собственности."
  },
  "pt": {
    "title": "O que é IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) é um identificador de 15 dígitos atribuído a dispositivos móveis.",
    "checksTitle": "O que este validador verifica",
    "check1": "Comprimento: o IMEI deve ter exatamente 15 dígitos",
    "check2": "Formato: apenas dígitos são permitidos após remover espaços e hífens",
    "check3": "Checksum: o último dígito deve satisfazer o algoritmo de Luhn",
    "note": "Esta ferramenta valida apenas formato e checksum. Ela não verifica status de bloqueio, ativação ou propriedade."
  },
  "ar": {
    "title": "ما هو IMEI؟",
    "description": "IMEI ‏(هوية الجهاز المحمول الدولية) هو معرّف مكوّن من 15 رقمًا مخصّص للأجهزة المحمولة.",
    "checksTitle": "ما الذي يتحقق منه هذا المدقق",
    "check1": "الطول: يجب أن يتكون IMEI من 15 رقمًا بالضبط",
    "check2": "التنسيق: يُسمح بالأرقام فقط بعد إزالة المسافات والشرطات",
    "check3": "المجموع الاختباري: يجب أن يطابق الرقم الأخير خوارزمية Luhn",
    "note": "تتحقق هذه الأداة من التنسيق والمجموع الاختباري فقط. ولا تتحقق من حالة القائمة السوداء أو التفعيل أو الملكية."
  },
  "hi": {
    "title": "IMEI क्या है?",
    "description": "IMEI (International Mobile Equipment Identity) मोबाइल डिवाइस को दिया जाने वाला 15 अंकों का पहचानकर्ता है।",
    "checksTitle": "यह वैलिडेटर क्या जांचता है",
    "check1": "लंबाई: IMEI बिल्कुल 15 अंकों का होना चाहिए",
    "check2": "फ़ॉर्मेट: स्पेस और हाइफ़न हटाने के बाद केवल अंक मान्य हैं",
    "check3": "चेकसम: अंतिम अंक Luhn एल्गोरिदम के अनुसार होना चाहिए",
    "note": "यह टूल केवल फ़ॉर्मेट और चेकसम की जांच करता है। यह ब्लैकलिस्ट स्थिति, एक्टिवेशन या स्वामित्व की पुष्टि नहीं करता।"
  },
  "tr": {
    "title": "IMEI nedir?",
    "description": "IMEI (Uluslararası Mobil Cihaz Kimliği), mobil cihazlara atanan 15 haneli bir tanımlayıcıdır.",
    "checksTitle": "Bu doğrulayıcı neleri kontrol eder",
    "check1": "Uzunluk: IMEI tam olarak 15 haneli olmalıdır",
    "check2": "Biçim: boşluklar ve tireler kaldırıldıktan sonra yalnızca rakamlara izin verilir",
    "check3": "Sağlama: son hane Luhn algoritmasını sağlamalıdır",
    "note": "Bu araç yalnızca biçim ve sağlama hanesini doğrular. Kara liste durumu, aktivasyon veya sahiplik kontrolü yapmaz."
  },
  "nl": {
    "title": "Wat is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is een identificatiecode van 15 cijfers die aan mobiele apparaten wordt toegewezen.",
    "checksTitle": "Wat deze validator controleert",
    "check1": "Lengte: IMEI moet exact 15 cijfers bevatten",
    "check2": "Formaat: alleen cijfers zijn toegestaan nadat spaties en koppeltekens zijn verwijderd",
    "check3": "Controlesom: het laatste cijfer moet voldoen aan het Luhn-algoritme",
    "note": "Deze tool valideert alleen formaat en controlesom. Hij controleert geen blackliststatus, activatie of eigendom."
  },
  "sv": {
    "title": "Vad är IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) är en 15-siffrig identifierare som tilldelas mobila enheter.",
    "checksTitle": "Vad den här valideraren kontrollerar",
    "check1": "Längd: IMEI måste bestå av exakt 15 siffror",
    "check2": "Format: endast siffror tillåts efter att mellanslag och bindestreck tagits bort",
    "check3": "Kontrollsumma: den sista siffran måste uppfylla Luhn-algoritmen",
    "note": "Det här verktyget validerar endast format och kontrollsumma. Det verifierar inte svartlistestatus, aktivering eller ägarskap."
  },
  "pl": {
    "title": "Co to jest IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) to 15-cyfrowy identyfikator przypisywany urządzeniom mobilnym.",
    "checksTitle": "Co sprawdza ten walidator",
    "check1": "Długość: IMEI musi mieć dokładnie 15 cyfr",
    "check2": "Format: po usunięciu spacji i myślników dozwolone są tylko cyfry",
    "check3": "Suma kontrolna: ostatnia cyfra musi spełniać algorytm Luhna",
    "note": "To narzędzie sprawdza tylko format i sumę kontrolną. Nie weryfikuje statusu na czarnej liście, aktywacji ani własności."
  },
  "vi": {
    "title": "IMEI là gì?",
    "description": "IMEI (International Mobile Equipment Identity) là mã định danh 15 chữ số được gán cho thiết bị di động.",
    "checksTitle": "Trình xác thực này kiểm tra gì",
    "check1": "Độ dài: IMEI phải có đúng 15 chữ số",
    "check2": "Định dạng: chỉ cho phép chữ số sau khi loại bỏ khoảng trắng và dấu gạch nối",
    "check3": "Checksum: chữ số cuối phải thỏa mãn thuật toán Luhn",
    "note": "Công cụ này chỉ xác thực định dạng và checksum. Nó không kiểm tra trạng thái danh sách đen, kích hoạt hay quyền sở hữu."
  },
  "th": {
    "title": "IMEI คืออะไร?",
    "description": "IMEI (International Mobile Equipment Identity) คือรหัสระบุตัวตนอุปกรณ์มือถือ 15 หลัก",
    "checksTitle": "เครื่องมือนี้ตรวจสอบอะไร",
    "check1": "ความยาว: IMEI ต้องมี 15 หลักพอดี",
    "check2": "รูปแบบ: หลังลบช่องว่างและขีดกลางแล้ว ต้องเป็นตัวเลขเท่านั้น",
    "check3": "เช็กซัม: หลักสุดท้ายต้องสอดคล้องกับอัลกอริทึม Luhn",
    "note": "เครื่องมือนี้ตรวจสอบเฉพาะรูปแบบและเช็กซัมเท่านั้น ไม่ได้ตรวจสอบสถานะบัญชีดำ การเปิดใช้งาน หรือความเป็นเจ้าของ"
  },
  "id": {
    "title": "Apa itu IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) adalah pengenal 15 digit yang diberikan kepada perangkat seluler.",
    "checksTitle": "Apa yang diperiksa validator ini",
    "check1": "Panjang: IMEI harus tepat 15 digit",
    "check2": "Format: hanya digit yang diperbolehkan setelah spasi dan tanda hubung dihapus",
    "check3": "Checksum: digit terakhir harus memenuhi algoritma Luhn",
    "note": "Alat ini hanya memvalidasi format dan checksum. Alat ini tidak memverifikasi status daftar hitam, aktivasi, atau kepemilikan."
  },
  "he": {
    "title": "מהו IMEI?",
    "description": "IMEI ‏(International Mobile Equipment Identity) הוא מזהה בן 15 ספרות שמוקצה למכשירים ניידים.",
    "checksTitle": "מה המאמת הזה בודק",
    "check1": "אורך: IMEI חייב להכיל בדיוק 15 ספרות",
    "check2": "פורמט: לאחר הסרת רווחים ומקפים, מותרות ספרות בלבד",
    "check3": "סכום ביקורת: הספרה האחרונה חייבת לעמוד באלגוריתם לוהן",
    "note": "הכלי הזה מאמת רק פורמט וסכום ביקורת. הוא לא מאמת סטטוס ברשימה שחורה, הפעלה או בעלות."
  },
  "ms": {
    "title": "Apakah IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) ialah pengecam 15 digit yang diberikan kepada peranti mudah alih.",
    "checksTitle": "Apa yang disemak oleh pengesah ini",
    "check1": "Panjang: IMEI mesti tepat 15 digit",
    "check2": "Format: hanya digit dibenarkan selepas ruang dan sempang dibuang",
    "check3": "Checksum: digit terakhir mesti memenuhi algoritma Luhn",
    "note": "Alat ini hanya mengesahkan format dan checksum. Ia tidak menyemak status senarai hitam, pengaktifan atau pemilikan."
  },
  "no": {
    "title": "Hva er IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) er en 15-sifret identifikator som tildeles mobile enheter.",
    "checksTitle": "Hva denne validatoren sjekker",
    "check1": "Lengde: IMEI må være nøyaktig 15 sifre",
    "check2": "Format: bare sifre er tillatt etter at mellomrom og bindestreker er fjernet",
    "check3": "Kontrollsum: det siste sifferet må oppfylle Luhn-algoritmen",
    "note": "Dette verktøyet validerer kun format og kontrollsum. Det verifiserer ikke svartelistestatus, aktivering eller eierskap."
  }
}
</i18n>
