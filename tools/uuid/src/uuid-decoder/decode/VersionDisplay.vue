<template>
  <span>
    {{ versionLabel }}
  </span>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const props = defineProps<{
  version: number
}>()

const versionLabel = computed(() => {
  switch (props.version) {
    case 0:
      return t('version-0')
    case 1:
      return t('version-1')
    case 2:
      return t('version-2')
    case 3:
      return t('version-3')
    case 4:
      return t('version-4')
    case 5:
      return t('version-5')
    case 6:
      return t('version-6')
    case 7:
      return t('version-7')
    case 15:
      return t('version-15')
    default:
      return ''
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "version-0": "0 (Nil UUID — all bits set to zero)",
    "version-1": "1 (Time-based with MAC address)",
    "version-2": "2 (DCE Security version, time-based with POSIX UID/GID)",
    "version-3": "3 (Name-based using MD5 hash)",
    "version-4": "4 (Randomly generated UUID)",
    "version-5": "5 (Name-based using SHA-1 hash)",
    "version-6": "6 (Reordered time-based for improved database sorting)",
    "version-7": "7 (Unix timestamp-based with optional randomness)",
    "version-15": "15 (Max UUID — all bits set to one)"
  },
  "zh": {
    "version-0": "0 (空 UUID — 所有位都设置为零)",
    "version-1": "1 (基于时间的 MAC 地址)",
    "version-2": "2 (DCE 安全版本，基于时间的 POSIX UID/GID)",
    "version-3": "3 (使用 MD5 哈希的基于名称)",
    "version-4": "4 (随机生成的 UUID)",
    "version-5": "5 (使用 SHA-1 哈希的基于名称)",
    "version-6": "6 (重新排序的基于时间，用于改进数据库排序)",
    "version-7": "7 (基于 Unix 时间戳，可选随机性)",
    "version-15": "15 (最大 UUID — 所有位都设置为一)"
  },
  "zh-CN": {
    "version-0": "0 (空 UUID — 所有位都设置为零)",
    "version-1": "1 (基于时间的 MAC 地址)",
    "version-2": "2 (DCE 安全版本，基于时间的 POSIX UID/GID)",
    "version-3": "3 (使用 MD5 哈希的基于名称)",
    "version-4": "4 (随机生成的 UUID)",
    "version-5": "5 (使用 SHA-1 哈希的基于名称)",
    "version-6": "6 (重新排序的基于时间，用于改进数据库排序)",
    "version-7": "7 (基于 Unix 时间戳，可选随机性)",
    "version-15": "15 (最大 UUID — 所有位都设置为一)"
  },
  "zh-TW": {
    "version-0": "0 (空 UUID — 所有位都設為零)",
    "version-1": "1 (基於時間的 MAC 地址)",
    "version-2": "2 (DCE 安全版本，基於時間的 POSIX UID/GID)",
    "version-3": "3 (使用 MD5 雜湊的基於名稱)",
    "version-4": "4 (隨機生成的 UUID)",
    "version-5": "5 (使用 SHA-1 雜湊的基於名稱)",
    "version-6": "6 (重新排序的基於時間，用於改進數據庫排序)",
    "version-7": "7 (基於 Unix 時間戳，可選隨機性)",
    "version-15": "15 (最大 UUID — 所有位都設為一)"
  },
  "zh-HK": {
    "version-0": "0 (空 UUID — 所有位都設為零)",
    "version-1": "1 (基於時間的 MAC 地址)",
    "version-2": "2 (DCE 安全版本，基於時間的 POSIX UID/GID)",
    "version-3": "3 (使用 MD5 雜湊的基於名稱)",
    "version-4": "4 (隨機生成的 UUID)",
    "version-5": "5 (使用 SHA-1 雜湊的基於名稱)",
    "version-6": "6 (重新排序的基於時間，用於改進數據庫排序)",
    "version-7": "7 (基於 Unix 時間戳，可選隨機性)",
    "version-15": "15 (最大 UUID — 所有位都設為一)"
  },
  "es": {
    "version-0": "0 (UUID Nulo — todos los bits establecidos en cero)",
    "version-1": "1 (Basado en tiempo con dirección MAC)",
    "version-2": "2 (Versión de seguridad DCE, basada en tiempo con UID/GID POSIX)",
    "version-3": "3 (Basado en nombre usando hash MD5)",
    "version-4": "4 (UUID generado aleatoriamente)",
    "version-5": "5 (Basado en nombre usando hash SHA-1)",
    "version-6": "6 (Basado en tiempo reordenado para mejorar el ordenamiento en base de datos)",
    "version-7": "7 (Basado en timestamp Unix con aleatoriedad opcional)",
    "version-15": "15 (UUID Máximo — todos los bits establecidos en uno)"
  },
  "fr": {
    "version-0": "0 (UUID Nul — tous les bits à zéro)",
    "version-1": "1 (Basé sur le temps avec adresse MAC)",
    "version-2": "2 (Version de sécurité DCE, basée sur le temps avec UID/GID POSIX)",
    "version-3": "3 (Basé sur le nom utilisant le hachage MD5)",
    "version-4": "4 (UUID généré aléatoirement)",
    "version-5": "5 (Basé sur le nom utilisant le hachage SHA-1)",
    "version-6": "6 (Basé sur le temps réordonné pour améliorer le tri en base de données)",
    "version-7": "7 (Basé sur le timestamp Unix avec aléatoire optionnel)",
    "version-15": "15 (UUID Max — tous les bits à un)"
  },
  "de": {
    "version-0": "0 (Null-UUID — alle Bits auf Null gesetzt)",
    "version-1": "1 (Zeitbasiert mit MAC-Adresse)",
    "version-2": "2 (DCE-Sicherheitsversion, zeitbasiert mit POSIX UID/GID)",
    "version-3": "3 (Namensbasiert mit MD5-Hash)",
    "version-4": "4 (Zufällig generierte UUID)",
    "version-5": "5 (Namensbasiert mit SHA-1-Hash)",
    "version-6": "6 (Neu geordnete zeitbasierte für verbesserte Datenbanksortierung)",
    "version-7": "7 (Unix-Zeitstempel-basiert mit optionaler Zufälligkeit)",
    "version-15": "15 (Max-UUID — alle Bits auf Eins gesetzt)"
  },
  "it": {
    "version-0": "0 (UUID Nullo — tutti i bit impostati a zero)",
    "version-1": "1 (Basato sul tempo con indirizzo MAC)",
    "version-2": "2 (Versione di sicurezza DCE, basata sul tempo con UID/GID POSIX)",
    "version-3": "3 (Basato sul nome usando hash MD5)",
    "version-4": "4 (UUID generato casualmente)",
    "version-5": "5 (Basato sul nome usando hash SHA-1)",
    "version-6": "6 (Basato sul tempo riordinato per migliorare l'ordinamento del database)",
    "version-7": "7 (Basato su timestamp Unix con casualità opzionale)",
    "version-15": "15 (UUID Massimo — tutti i bit impostati a uno)"
  },
  "ja": {
    "version-0": "0 (Nil UUID — すべてのビットがゼロ)",
    "version-1": "1 (MACアドレスを使用した時間ベース)",
    "version-2": "2 (DCEセキュリティバージョン、POSIX UID/GIDを使用した時間ベース)",
    "version-3": "3 (MD5ハッシュを使用した名前ベース)",
    "version-4": "4 (ランダム生成UUID)",
    "version-5": "5 (SHA-1ハッシュを使用した名前ベース)",
    "version-6": "6 (データベースの並べ替えを改善するための時間ベースの再順序付け)",
    "version-7": "7 (オプションのランダム性を持つUnixタイムスタンプベース)",
    "version-15": "15 (最大UUID — すべてのビットが1)"
  },
  "ko": {
    "version-0": "0 (Nil UUID — 모든 비트가 0으로 설정)",
    "version-1": "1 (MAC 주소를 사용한 시간 기반)",
    "version-2": "2 (DCE 보안 버전, POSIX UID/GID를 사용한 시간 기반)",
    "version-3": "3 (MD5 해시를 사용한 이름 기반)",
    "version-4": "4 (무작위 생성 UUID)",
    "version-5": "5 (SHA-1 해시를 사용한 이름 기반)",
    "version-6": "6 (데이터베이스 정렬 개선을 위한 시간 기반 재정렬)",
    "version-7": "7 (선택적 무작위성을 가진 Unix 타임스탬프 기반)",
    "version-15": "15 (최대 UUID — 모든 비트가 1로 설정)"
  },
  "ru": {
    "version-0": "0 (Пустой UUID — все биты установлены в ноль)",
    "version-1": "1 (На основе времени с MAC-адресом)",
    "version-2": "2 (Версия безопасности DCE, на основе времени с POSIX UID/GID)",
    "version-3": "3 (На основе имени с использованием MD5-хеша)",
    "version-4": "4 (Случайно сгенерированный UUID)",
    "version-5": "5 (На основе имени с использованием SHA-1-хеша)",
    "version-6": "6 (Переупорядоченный на основе времени для улучшения сортировки в базе данных)",
    "version-7": "7 (На основе Unix-временной метки с опциональной случайностью)",
    "version-15": "15 (Максимальный UUID — все биты установлены в единицу)"
  },
  "pt": {
    "version-0": "0 (UUID Nulo — todos os bits definidos como zero)",
    "version-1": "1 (Baseado em tempo com endereço MAC)",
    "version-2": "2 (Versão de segurança DCE, baseada em tempo com UID/GID POSIX)",
    "version-3": "3 (Baseado em nome usando hash MD5)",
    "version-4": "4 (UUID gerado aleatoriamente)",
    "version-5": "5 (Baseado em nome usando hash SHA-1)",
    "version-6": "6 (Baseado em tempo reordenado para melhorar a ordenação no banco de dados)",
    "version-7": "7 (Baseado em timestamp Unix com aleatoriedade opcional)",
    "version-15": "15 (UUID Máximo — todos os bits definidos como um)"
  },
  "ar": {
    "version-0": "0 (UUID فارغ — جميع البتات مضبوطة على صفر)",
    "version-1": "1 (مبني على الوقت مع عنوان MAC)",
    "version-2": "2 (إصدار أمان DCE، مبني على الوقت مع UID/GID POSIX)",
    "version-3": "3 (مبني على الاسم باستخدام تجزئة MD5)",
    "version-4": "4 (UUID مولّد عشوائياً)",
    "version-5": "5 (مبني على الاسم باستخدام تجزئة SHA-1)",
    "version-6": "6 (مبني على الوقت مع إعادة ترتيب لتحسين الفرز في قاعدة البيانات)",
    "version-7": "7 (مبني على طابع وقت Unix مع عشوائية اختيارية)",
    "version-15": "15 (UUID أقصى — جميع البتات مضبوطة على واحد)"
  },
  "hi": {
    "version-0": "0 (शून्य UUID — सभी बिट शून्य पर सेट)",
    "version-1": "1 (MAC पते के साथ समय-आधारित)",
    "version-2": "2 (DCE सुरक्षा संस्करण, POSIX UID/GID के साथ समय-आधारित)",
    "version-3": "3 (MD5 हैश का उपयोग करके नाम-आधारित)",
    "version-4": "4 (यादृच्छिक रूप से उत्पन्न UUID)",
    "version-5": "5 (SHA-1 हैश का उपयोग करके नाम-आधारित)",
    "version-6": "6 (डेटाबेस क्रमबद्धता में सुधार के लिए पुनः क्रमित समय-आधारित)",
    "version-7": "7 (वैकल्पिक यादृच्छिकता के साथ Unix टाइमस्टैम्प-आधारित)",
    "version-15": "15 (अधिकतम UUID — सभी बिट एक पर सेट)"
  },
  "tr": {
    "version-0": "0 (Boş UUID — tüm bitler sıfıra ayarlanmış)",
    "version-1": "1 (MAC adresi ile zaman tabanlı)",
    "version-2": "2 (DCE Güvenlik sürümü, POSIX UID/GID ile zaman tabanlı)",
    "version-3": "3 (MD5 hash kullanarak isim tabanlı)",
    "version-4": "4 (Rastgele oluşturulmuş UUID)",
    "version-5": "5 (SHA-1 hash kullanarak isim tabanlı)",
    "version-6": "6 (Veritabanı sıralamasını iyileştirmek için yeniden sıralanmış zaman tabanlı)",
    "version-7": "7 (İsteğe bağlı rastgelelik ile Unix zaman damgası tabanlı)",
    "version-15": "15 (Maksimum UUID — tüm bitler bire ayarlanmış)"
  },
  "nl": {
    "version-0": "0 (Nul UUID — alle bits op nul gezet)",
    "version-1": "1 (Tijdsgebaseerd met MAC-adres)",
    "version-2": "2 (DCE-beveiligingsversie, tijdsgebaseerd met POSIX UID/GID)",
    "version-3": "3 (Naamgebaseerd met MD5-hash)",
    "version-4": "4 (Willekeurig gegenereerde UUID)",
    "version-5": "5 (Naamgebaseerd met SHA-1-hash)",
    "version-6": "6 (Herordende tijdsgebaseerd voor verbeterde databasesortering)",
    "version-7": "7 (Unix-timestamp-gebaseerd met optionele willekeurigheid)",
    "version-15": "15 (Max UUID — alle bits op één gezet)"
  },
  "sv": {
    "version-0": "0 (Noll UUID — alla bitar satta till noll)",
    "version-1": "1 (Tidsbaserad med MAC-adress)",
    "version-2": "2 (DCE-säkerhetsversion, tidsbaserad med POSIX UID/GID)",
    "version-3": "3 (Namnbaserad med MD5-hash)",
    "version-4": "4 (Slumpmässigt genererad UUID)",
    "version-5": "5 (Namnbaserad med SHA-1-hash)",
    "version-6": "6 (Omordnad tidsbaserad för förbättrad databassortering)",
    "version-7": "7 (Unix-tidsstämpel-baserad med valfri slumpmässighet)",
    "version-15": "15 (Max UUID — alla bitar satta till ett)"
  },
  "pl": {
    "version-0": "0 (Pusty UUID — wszystkie bity ustawione na zero)",
    "version-1": "1 (Czasowy z adresem MAC)",
    "version-2": "2 (Wersja bezpieczeństwa DCE, czasowa z POSIX UID/GID)",
    "version-3": "3 (Nazwowy używający hasha MD5)",
    "version-4": "4 (Losowo wygenerowany UUID)",
    "version-5": "5 (Nazwowy używający hasha SHA-1)",
    "version-6": "6 (Przeorganizowany czasowy dla lepszego sortowania w bazie danych)",
    "version-7": "7 (Oparty na znaczniku czasu Unix z opcjonalną losowością)",
    "version-15": "15 (Maksymalny UUID — wszystkie bity ustawione na jeden)"
  },
  "vi": {
    "version-0": "0 (UUID Rỗng — tất cả các bit được đặt thành không)",
    "version-1": "1 (Dựa trên thời gian với địa chỉ MAC)",
    "version-2": "2 (Phiên bản bảo mật DCE, dựa trên thời gian với UID/GID POSIX)",
    "version-3": "3 (Dựa trên tên sử dụng băm MD5)",
    "version-4": "4 (UUID được tạo ngẫu nhiên)",
    "version-5": "5 (Dựa trên tên sử dụng băm SHA-1)",
    "version-6": "6 (Dựa trên thời gian được sắp xếp lại để cải thiện sắp xếp cơ sở dữ liệu)",
    "version-7": "7 (Dựa trên dấu thời gian Unix với tính ngẫu nhiên tùy chọn)",
    "version-15": "15 (UUID Tối đa — tất cả các bit được đặt thành một)"
  },
  "th": {
    "version-0": "0 (UUID ว่าง — บิตทั้งหมดถูกตั้งค่าเป็นศูนย์)",
    "version-1": "1 (อิงตามเวลาพร้อมที่อยู่ MAC)",
    "version-2": "2 (เวอร์ชันความปลอดภัย DCE อิงตามเวลาพร้อม UID/GID POSIX)",
    "version-3": "3 (อิงตามชื่อโดยใช้แฮช MD5)",
    "version-4": "4 (UUID สุ่ม)",
    "version-5": "5 (อิงตามชื่อโดยใช้แฮช SHA-1)",
    "version-6": "6 (อิงตามเวลาที่จัดเรียงใหม่เพื่อปรับปรุงการเรียงลำดับฐานข้อมูล)",
    "version-7": "7 (อิงตามไทม์สแตมป์ Unix พร้อมความสุ่มแบบเลือกได้)",
    "version-15": "15 (UUID สูงสุด — บิตทั้งหมดถูกตั้งค่าเป็นหนึ่ง)"
  },
  "id": {
    "version-0": "0 (UUID Kosong — semua bit diatur ke nol)",
    "version-1": "1 (Berdasarkan waktu dengan alamat MAC)",
    "version-2": "2 (Versi keamanan DCE, berbasis waktu dengan UID/GID POSIX)",
    "version-3": "3 (Berdasarkan nama menggunakan hash MD5)",
    "version-4": "4 (UUID yang dihasilkan secara acak)",
    "version-5": "5 (Berdasarkan nama menggunakan hash SHA-1)",
    "version-6": "6 (Berdasarkan waktu yang diurutkan ulang untuk meningkatkan pengurutan database)",
    "version-7": "7 (Berdasarkan timestamp Unix dengan keacakan opsional)",
    "version-15": "15 (UUID Maksimum — semua bit diatur ke satu)"
  },
  "he": {
    "version-0": "0 (UUID ריק — כל הביטים מוגדרים לאפס)",
    "version-1": "1 (מבוסס זמן עם כתובת MAC)",
    "version-2": "2 (גרסת אבטחת DCE, מבוססת זמן עם UID/GID POSIX)",
    "version-3": "3 (מבוסס שם באמצעות גיבוב MD5)",
    "version-4": "4 (UUID שנוצר באופן אקראי)",
    "version-5": "5 (מבוסס שם באמצעות גיבוב SHA-1)",
    "version-6": "6 (מבוסס זמן שסודר מחדש לשיפור מיון מסד הנתונים)",
    "version-7": "7 (מבוסס חותמת זמן Unix עם אקראיות אופציונלית)",
    "version-15": "15 (UUID מקסימלי — כל הביטים מוגדרים לאחד)"
  },
  "ms": {
    "version-0": "0 (UUID Kosong — semua bit ditetapkan kepada sifar)",
    "version-1": "1 (Berasaskan masa dengan alamat MAC)",
    "version-2": "2 (Versi keselamatan DCE, berasaskan masa dengan UID/GID POSIX)",
    "version-3": "3 (Berasaskan nama menggunakan hash MD5)",
    "version-4": "4 (UUID dijana secara rawak)",
    "version-5": "5 (Berasaskan nama menggunakan hash SHA-1)",
    "version-6": "6 (Berasaskan masa yang disusun semula untuk meningkatkan pengisihan pangkalan data)",
    "version-7": "7 (Berasaskan cap masa Unix dengan rawak pilihan)",
    "version-15": "15 (UUID Maksimum — semua bit ditetapkan kepada satu)"
  },
  "no": {
    "version-0": "0 (Null UUID — alle biter satt til null)",
    "version-1": "1 (Tidsbasert med MAC-adresse)",
    "version-2": "2 (DCE-sikkerhetsversjon, tidsbasert med POSIX UID/GID)",
    "version-3": "3 (Navnebasert med MD5-hash)",
    "version-4": "4 (Tilfeldig generert UUID)",
    "version-5": "5 (Navnebasert med SHA-1-hash)",
    "version-6": "6 (Omorganisert tidsbasert for forbedret databasesortering)",
    "version-7": "7 (Unix-tidsstempel-basert med valgfri tilfeldighet)",
    "version-15": "15 (Maks UUID — alle biter satt til én)"
  }
}
</i18n>
