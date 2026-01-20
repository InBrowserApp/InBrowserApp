export const toolID = 'ulid-generator'
export const path = '/tools/ulid-generator'
export const tags = ['ulid', 'uuid']
export const features = ['offline']
export { default as icon } from '@vicons/carbon/Id'
export const meta = {
  en: {
    name: 'ULID Generator',
    description:
      'Generate a ULID (Universally Unique Lexicographically Sortable Identifier) that combines timestamp-based ordering with randomness for unique, sortable identifiers',
  },
  zh: {
    name: 'ULID 生成器',
    description:
      '生成一个ULID（通用唯一词典序可排序标识符），结合基于时间戳的排序和随机性，创建唯一且可排序的标识符',
  },
  'zh-CN': {
    name: 'ULID 生成器',
    description:
      '生成一个ULID（通用唯一词典序可排序标识符），结合基于时间戳的排序和随机性，创建唯一且可排序的标识符',
  },
  'zh-TW': {
    name: 'ULID 生成器',
    description:
      '生成一個ULID（通用唯一詞典序可排序標識符），結合基於時間戳的排序和隨機性，創建唯一且可排序的標識符',
  },
  'zh-HK': {
    name: 'ULID 生成器',
    description:
      '生成一個ULID（通用唯一詞典序可排序標識符），結合基於時間戳的排序和隨機性，創建唯一且可排序的標識符',
  },
  es: {
    name: 'Generador de ULID',
    description:
      'Genera un ULID (Identificador Único Lexicográficamente Ordenable Universal) que combina ordenamiento basado en marca de tiempo con aleatoriedad para identificadores únicos y ordenables',
  },
  fr: {
    name: 'Générateur ULID',
    description:
      "Génère un ULID (Identifiant Unique Lexicographiquement Triable Universel) qui combine un tri basé sur horodatage avec de l'aléatoire pour des identifiants uniques et triables",
  },
  de: {
    name: 'ULID Generator',
    description:
      'Generiert eine ULID (Universell Eindeutige Lexikographisch Sortierbare Kennung), die zeitstempelbasierte Sortierung mit Zufälligkeit für eindeutige, sortierbare Kennungen kombiniert',
  },
  it: {
    name: 'Generatore ULID',
    description:
      'Genera un ULID (Identificatore Universale Unico Lessicograficamente Ordinabile) che combina ordinamento basato su timestamp con casualità per identificatori unici e ordinabili',
  },
  ja: {
    name: 'ULID ジェネレーター',
    description:
      'タイムスタンプベースの順序付けとランダム性を組み合わせて、一意でソート可能な識別子を作成するULID（汎用一意辞書順ソート可能識別子）を生成',
  },
  ko: {
    name: 'ULID 생성기',
    description:
      '타임스탬프 기반 정렬과 무작위성을 결합하여 고유하고 정렬 가능한 식별자를 만드는 ULID(범용 고유 사전순 정렬 가능 식별자) 생성',
  },
  ru: {
    name: 'Генератор ULID',
    description:
      'Сгенерировать ULID (Универсальный Уникальный Лексикографически Сортируемый Идентификатор), который сочетает сортировку на основе временной метки со случайностью для уникальных, сортируемых идентификаторов',
  },
  pt: {
    name: 'Gerador de ULID',
    description:
      'Gerar um ULID (Identificador Único Universal Lexicograficamente Ordenável) que combina ordenação baseada em timestamp com aleatoriedade para identificadores únicos e ordenáveis',
  },
  ar: {
    name: 'مولد ULID',
    description:
      'إنشاء ULID (معرف فريد عالمي قابل للترتيب معجميًا) يجمع بين الترتيب القائم على الطابع الزمني والعشوائية لمعرفات فريدة وقابلة للترتيب',
  },
  hi: {
    name: 'ULID जनरेटर',
    description:
      'एक ULID (सार्वभौमिक विशिष्ट शब्दकोश क्रम में क्रमबद्ध पहचानकर्ता) उत्पन्न करें जो विशिष्ट, क्रमबद्ध पहचानकर्ताओं के लिए टाइमस्टैम्प-आधारित क्रमबद्धता को यादृच्छिकता के साथ जोड़ता है',
  },
  tr: {
    name: 'ULID Oluşturucu',
    description:
      'Benzersiz, sıralanabilir tanımlayıcılar için zaman damgası tabanlı sıralamayı rastgelelikle birleştiren bir ULID (Evrensel Benzersiz Sözlüksel Sıralanabilir Tanımlayıcı) oluştur',
  },
  nl: {
    name: 'ULID Generator',
    description:
      'Genereer een ULID (Universeel Unieke Lexicografisch Sorteerbare Identificatiecode) die timestamp-gebaseerde sortering combineert met willekeurigheid voor unieke, sorteerbare identificatiecodes',
  },
  sv: {
    name: 'ULID Generator',
    description:
      'Generera en ULID (Universellt Unik Lexikografiskt Sorterbar Identifierare) som kombinerar tidsstämpelbaserad sortering med slumpmässighet för unika, sorterbara identifierare',
  },
  pl: {
    name: 'Generator ULID',
    description:
      'Wygeneruj ULID (Uniwersalny Unikalny Leksykograficznie Sortowalny Identyfikator) który łączy sortowanie oparte na znaczniku czasu z losowością dla unikalnych, sortowalnych identyfikatorów',
  },
  vi: {
    name: 'Trình tạo ULID',
    description:
      'Tạo ULID (Định danh Duy nhất Toàn cầu Có thể Sắp xếp Từ điển) kết hợp sắp xếp dựa trên dấu thời gian với tính ngẫu nhiên cho các định danh duy nhất, có thể sắp xếp',
  },
  th: {
    name: 'ตัวสร้าง ULID',
    description:
      'สร้าง ULID (ตัวระบุเฉพาะสากลที่เรียงลำดับตามพจนานุกรมได้) ที่รวมการเรียงลำดับตามการประทับเวลากับความสุ่มสำหรับตัวระบุที่ไม่ซ้ำและเรียงลำดับได้',
  },
  id: {
    name: 'Pembuat ULID',
    description:
      'Buat ULID (Pengidentifikasi Unik Universal yang Dapat Diurutkan Secara Leksikografis) yang menggabungkan pengurutan berbasis timestamp dengan keacakan untuk pengidentifikasi unik yang dapat diurutkan',
  },
  he: {
    name: 'מחולל ULID',
    description:
      'צור ULID (מזהה ייחודי אוניברסלי הניתן למיון לקסיקוגרפי) המשלב מיון מבוסס חותמת זמן עם אקראיות עבור מזהים ייחודיים הניתנים למיון',
  },
  ms: {
    name: 'Penjana ULID',
    description:
      'Jana ULID (Pengenalan Unik Universal yang Boleh Diisih secara Leksikografi) yang menggabungkan pengisihan berasaskan cap masa dengan rawak untuk pengenalan unik yang boleh diisih',
  },
  no: {
    name: 'ULID Generator',
    description:
      'Generer en ULID (Universelt Unik Leksikografisk Sorterbar Identifikator) som kombinerer tidsstempel-basert sortering med tilfeldighet for unike, sorterbare identifikatorer',
  },
}
