<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <NText tag="p">{{ t('description') }}</NText>

    <NH3>{{ t('luhnTitle') }}</NH3>
    <NText tag="p">{{ t('luhnDescription') }}</NText>
    <NOl>
      <NLi>{{ t('luhnStep1') }}</NLi>
      <NLi>{{ t('luhnStep2') }}</NLi>
      <NLi>{{ t('luhnStep3') }}</NLi>
    </NOl>

    <NH3>{{ t('brandsTitle') }}</NH3>
    <NText tag="p">{{ t('brandsDescription') }}</NText>
    <NDataTable :columns="brandColumns" :data="cardBrands" :bordered="false" size="small" />
  </ToolSection>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { NDataTable, NText, NH3, NOl, NLi, NFlex, NIcon } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { cardBrands, type CardBrand } from '../data/cardBrands'

const { t } = useI18n()

const brandColumns: DataTableColumns<CardBrand> = [
  {
    title: () => t('brandColumn'),
    key: 'name',
    render(row) {
      return h(NFlex, { align: 'center', size: 8 }, () => [
        h(NIcon, { component: row.icon, size: 20 }),
        h('span', row.name),
      ])
    },
  },
  {
    title: () => t('prefixColumn'),
    key: 'patterns',
    render(row) {
      const patterns = row.patterns.map((p) => {
        if (typeof p === 'string') return p
        return `${p[0]}-${p[1]}`
      })
      return patterns.join(', ')
    },
  },
  {
    title: () => t('lengthColumn'),
    key: 'lengths',
    render(row) {
      return row.lengths.join(', ')
    },
  },
  {
    title: () => t('cvcColumn'),
    key: 'cvcLength',
  },
]
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is Credit Card Validation?",
    "description": "Credit card validation is a process to check if a card number is potentially valid before processing a transaction. It uses the Luhn algorithm and card brand identification to verify the format.",
    "luhnTitle": "Luhn Algorithm",
    "luhnDescription": "The Luhn algorithm (also known as Mod 10) is a checksum formula used to validate identification numbers. Here's how it works:",
    "luhnStep1": "Starting from the rightmost digit, double every second digit",
    "luhnStep2": "If doubling results in a number greater than 9, subtract 9 from the result",
    "luhnStep3": "Sum all digits. If the total is divisible by 10, the number is valid",
    "brandsTitle": "Supported Card Brands",
    "brandsDescription": "Card brands are identified by their BIN (Bank Identification Number) or IIN (Issuer Identification Number), which are the first few digits of the card number.",
    "brandColumn": "Brand",
    "prefixColumn": "Prefix",
    "lengthColumn": "Length",
    "cvcColumn": "CVC"
  },
  "zh": {
    "title": "什么是信用卡号验证?",
    "description": "信用卡号验证是在处理交易前检查卡号是否可能有效的过程。它使用 Luhn 算法和卡品牌识别来验证格式。",
    "luhnTitle": "Luhn 算法",
    "luhnDescription": "Luhn 算法(也称为 Mod 10)是一种用于验证识别号码的校验和公式。以下是它的工作原理:",
    "luhnStep1": "从最右边的数字开始，每隔一位数字乘以 2",
    "luhnStep2": "如果乘以 2 后的结果大于 9，则减去 9",
    "luhnStep3": "将所有数字相加。如果总和能被 10 整除，则号码有效",
    "brandsTitle": "支持的卡品牌",
    "brandsDescription": "卡品牌通过 BIN(银行识别号)或 IIN(发卡机构识别号)来识别，即卡号的前几位数字。",
    "brandColumn": "品牌",
    "prefixColumn": "前缀",
    "lengthColumn": "长度",
    "cvcColumn": "CVC"
  },
  "zh-CN": {
    "title": "什么是信用卡号验证?",
    "description": "信用卡号验证是在处理交易前检查卡号是否可能有效的过程。它使用 Luhn 算法和卡品牌识别来验证格式。",
    "luhnTitle": "Luhn 算法",
    "luhnDescription": "Luhn 算法(也称为 Mod 10)是一种用于验证识别号码的校验和公式。以下是它的工作原理:",
    "luhnStep1": "从最右边的数字开始，每隔一位数字乘以 2",
    "luhnStep2": "如果乘以 2 后的结果大于 9，则减去 9",
    "luhnStep3": "将所有数字相加。如果总和能被 10 整除，则号码有效",
    "brandsTitle": "支持的卡品牌",
    "brandsDescription": "卡品牌通过 BIN(银行识别号)或 IIN(发卡机构识别号)来识别，即卡号的前几位数字。",
    "brandColumn": "品牌",
    "prefixColumn": "前缀",
    "lengthColumn": "长度",
    "cvcColumn": "CVC"
  },
  "zh-TW": {
    "title": "什麼是信用卡號驗證?",
    "description": "信用卡號驗證是在處理交易前檢查卡號是否可能有效的過程。它使用 Luhn 演算法和卡品牌識別來驗證格式。",
    "luhnTitle": "Luhn 演算法",
    "luhnDescription": "Luhn 演算法(也稱為 Mod 10)是一種用於驗證識別號碼的校驗和公式。以下是它的工作原理:",
    "luhnStep1": "從最右邊的數字開始，每隔一位數字乘以 2",
    "luhnStep2": "如果乘以 2 後的結果大於 9，則減去 9",
    "luhnStep3": "將所有數字相加。如果總和能被 10 整除，則號碼有效",
    "brandsTitle": "支援的卡品牌",
    "brandsDescription": "卡品牌透過 BIN(銀行識別號)或 IIN(發卡機構識別號)來識別，即卡號的前幾位數字。",
    "brandColumn": "品牌",
    "prefixColumn": "前綴",
    "lengthColumn": "長度",
    "cvcColumn": "CVC"
  },
  "zh-HK": {
    "title": "什麼是信用卡號驗證?",
    "description": "信用卡號驗證是在處理交易前檢查卡號是否可能有效的過程。它使用 Luhn 演算法和卡品牌識別來驗證格式。",
    "luhnTitle": "Luhn 演算法",
    "luhnDescription": "Luhn 演算法(也稱為 Mod 10)是一種用於驗證識別號碼的校驗和公式。以下是它的工作原理:",
    "luhnStep1": "從最右邊的數字開始，每隔一位數字乘以 2",
    "luhnStep2": "如果乘以 2 後的結果大於 9，則減去 9",
    "luhnStep3": "將所有數字相加。如果總和能被 10 整除，則號碼有效",
    "brandsTitle": "支援的卡品牌",
    "brandsDescription": "卡品牌透過 BIN(銀行識別號)或 IIN(發卡機構識別號)來識別，即卡號的前幾位數字。",
    "brandColumn": "品牌",
    "prefixColumn": "前綴",
    "lengthColumn": "長度",
    "cvcColumn": "CVC"
  },
  "es": {
    "title": "¿Qué es la Validación de Tarjeta de Crédito?",
    "description": "La validación de tarjeta de crédito es un proceso para verificar si un número de tarjeta es potencialmente válido antes de procesar una transacción. Utiliza el algoritmo de Luhn y la identificación de marca de tarjeta para verificar el formato.",
    "luhnTitle": "Algoritmo de Luhn",
    "luhnDescription": "El algoritmo de Luhn (también conocido como Mod 10) es una fórmula de suma de verificación utilizada para validar números de identificación. Así es como funciona:",
    "luhnStep1": "Comenzando desde el dígito más a la derecha, duplica cada segundo dígito",
    "luhnStep2": "Si duplicar resulta en un número mayor que 9, resta 9 del resultado",
    "luhnStep3": "Suma todos los dígitos. Si el total es divisible por 10, el número es válido",
    "brandsTitle": "Marcas de Tarjetas Soportadas",
    "brandsDescription": "Las marcas de tarjetas se identifican por su BIN (Número de Identificación Bancaria) o IIN (Número de Identificación del Emisor), que son los primeros dígitos del número de tarjeta.",
    "brandColumn": "Marca",
    "prefixColumn": "Prefijo",
    "lengthColumn": "Longitud",
    "cvcColumn": "CVC"
  },
  "fr": {
    "title": "Qu'est-ce que la Validation de Carte de Crédit?",
    "description": "La validation de carte de crédit est un processus pour vérifier si un numéro de carte est potentiellement valide avant de traiter une transaction. Elle utilise l'algorithme de Luhn et l'identification de la marque de carte pour vérifier le format.",
    "luhnTitle": "Algorithme de Luhn",
    "luhnDescription": "L'algorithme de Luhn (aussi connu comme Mod 10) est une formule de somme de contrôle utilisée pour valider les numéros d'identification. Voici comment cela fonctionne:",
    "luhnStep1": "En commençant par le chiffre le plus à droite, doublez chaque deuxième chiffre",
    "luhnStep2": "Si le doublement donne un nombre supérieur à 9, soustrayez 9 du résultat",
    "luhnStep3": "Additionnez tous les chiffres. Si le total est divisible par 10, le numéro est valide",
    "brandsTitle": "Marques de Cartes Supportées",
    "brandsDescription": "Les marques de cartes sont identifiées par leur BIN (Numéro d'Identification Bancaire) ou IIN (Numéro d'Identification de l'Émetteur), qui sont les premiers chiffres du numéro de carte.",
    "brandColumn": "Marque",
    "prefixColumn": "Préfixe",
    "lengthColumn": "Longueur",
    "cvcColumn": "CVC"
  },
  "de": {
    "title": "Was ist Kreditkartenvalidierung?",
    "description": "Die Kreditkartenvalidierung ist ein Prozess, um zu überprüfen, ob eine Kartennummer potenziell gültig ist, bevor eine Transaktion verarbeitet wird. Sie verwendet den Luhn-Algorithmus und die Kartenmarkenidentifikation zur Formatüberprüfung.",
    "luhnTitle": "Luhn-Algorithmus",
    "luhnDescription": "Der Luhn-Algorithmus (auch bekannt als Mod 10) ist eine Prüfsummenformel zur Validierung von Identifikationsnummern. So funktioniert es:",
    "luhnStep1": "Beginnend mit der rechtesten Ziffer, verdoppeln Sie jede zweite Ziffer",
    "luhnStep2": "Wenn das Verdoppeln eine Zahl größer als 9 ergibt, ziehen Sie 9 vom Ergebnis ab",
    "luhnStep3": "Summieren Sie alle Ziffern. Wenn die Summe durch 10 teilbar ist, ist die Nummer gültig",
    "brandsTitle": "Unterstützte Kartenmarken",
    "brandsDescription": "Kartenmarken werden durch ihre BIN (Bankidentifikationsnummer) oder IIN (Emittentenidentifikationsnummer) identifiziert, die die ersten Ziffern der Kartennummer sind.",
    "brandColumn": "Marke",
    "prefixColumn": "Präfix",
    "lengthColumn": "Länge",
    "cvcColumn": "CVC"
  },
  "it": {
    "title": "Cos'è la Validazione della Carta di Credito?",
    "description": "La validazione della carta di credito è un processo per verificare se un numero di carta è potenzialmente valido prima di elaborare una transazione. Utilizza l'algoritmo di Luhn e l'identificazione del brand della carta per verificare il formato.",
    "luhnTitle": "Algoritmo di Luhn",
    "luhnDescription": "L'algoritmo di Luhn (noto anche come Mod 10) è una formula di checksum utilizzata per validare i numeri di identificazione. Ecco come funziona:",
    "luhnStep1": "Partendo dalla cifra più a destra, raddoppia ogni seconda cifra",
    "luhnStep2": "Se il raddoppio risulta in un numero maggiore di 9, sottrai 9 dal risultato",
    "luhnStep3": "Somma tutte le cifre. Se il totale è divisibile per 10, il numero è valido",
    "brandsTitle": "Brand di Carte Supportati",
    "brandsDescription": "I brand delle carte sono identificati dal loro BIN (Bank Identification Number) o IIN (Issuer Identification Number), che sono le prime cifre del numero della carta.",
    "brandColumn": "Brand",
    "prefixColumn": "Prefisso",
    "lengthColumn": "Lunghezza",
    "cvcColumn": "CVC"
  },
  "ja": {
    "title": "クレジットカード検証とは?",
    "description": "クレジットカード検証は、取引を処理する前にカード番号が有効である可能性があるかどうかを確認するプロセスです。Luhnアルゴリズムとカードブランドの識別を使用して形式を検証します。",
    "luhnTitle": "Luhnアルゴリズム",
    "luhnDescription": "Luhnアルゴリズム（Mod 10としても知られています）は、識別番号を検証するために使用されるチェックサム式です。以下はその仕組みです：",
    "luhnStep1": "最も右の桁から始めて、2番目ごとの桁を2倍にします",
    "luhnStep2": "2倍にした結果が9より大きい場合、結果から9を引きます",
    "luhnStep3": "すべての桁を合計します。合計が10で割り切れる場合、番号は有効です",
    "brandsTitle": "サポートされているカードブランド",
    "brandsDescription": "カードブランドは、カード番号の最初の数桁であるBIN（銀行識別番号）またはIIN（発行者識別番号）によって識別されます。",
    "brandColumn": "ブランド",
    "prefixColumn": "プレフィックス",
    "lengthColumn": "長さ",
    "cvcColumn": "CVC"
  },
  "ko": {
    "title": "신용카드 검증이란?",
    "description": "신용카드 검증은 거래를 처리하기 전에 카드 번호가 잠재적으로 유효한지 확인하는 프로세스입니다. Luhn 알고리즘과 카드 브랜드 식별을 사용하여 형식을 확인합니다.",
    "luhnTitle": "Luhn 알고리즘",
    "luhnDescription": "Luhn 알고리즘(Mod 10이라고도 함)은 식별 번호를 검증하는 데 사용되는 체크섬 공식입니다. 작동 방식은 다음과 같습니다:",
    "luhnStep1": "가장 오른쪽 숫자부터 시작하여 두 번째 숫자마다 2배로 만듭니다",
    "luhnStep2": "2배로 한 결과가 9보다 크면 결과에서 9를 뺍니다",
    "luhnStep3": "모든 숫자를 더합니다. 합계가 10으로 나누어 떨어지면 번호가 유효합니다",
    "brandsTitle": "지원되는 카드 브랜드",
    "brandsDescription": "카드 브랜드는 카드 번호의 처음 몇 자리인 BIN(은행 식별 번호) 또는 IIN(발급자 식별 번호)으로 식별됩니다.",
    "brandColumn": "브랜드",
    "prefixColumn": "접두사",
    "lengthColumn": "길이",
    "cvcColumn": "CVC"
  },
  "ru": {
    "title": "Что такое валидация кредитной карты?",
    "description": "Валидация кредитной карты — это процесс проверки потенциальной действительности номера карты перед обработкой транзакции. Он использует алгоритм Луна и идентификацию бренда карты для проверки формата.",
    "luhnTitle": "Алгоритм Луна",
    "luhnDescription": "Алгоритм Луна (также известный как Mod 10) — это формула контрольной суммы для проверки идентификационных номеров. Вот как это работает:",
    "luhnStep1": "Начиная с самой правой цифры, удваивайте каждую вторую цифру",
    "luhnStep2": "Если удвоение дает число больше 9, вычтите 9 из результата",
    "luhnStep3": "Сложите все цифры. Если сумма делится на 10, номер действителен",
    "brandsTitle": "Поддерживаемые бренды карт",
    "brandsDescription": "Бренды карт идентифицируются по их BIN (номер идентификации банка) или IIN (номер идентификации эмитента), которые являются первыми цифрами номера карты.",
    "brandColumn": "Бренд",
    "prefixColumn": "Префикс",
    "lengthColumn": "Длина",
    "cvcColumn": "CVC"
  },
  "pt": {
    "title": "O que é Validação de Cartão de Crédito?",
    "description": "A validação de cartão de crédito é um processo para verificar se um número de cartão é potencialmente válido antes de processar uma transação. Usa o algoritmo de Luhn e identificação da bandeira para verificar o formato.",
    "luhnTitle": "Algoritmo de Luhn",
    "luhnDescription": "O algoritmo de Luhn (também conhecido como Mod 10) é uma fórmula de soma de verificação usada para validar números de identificação. Veja como funciona:",
    "luhnStep1": "Começando pelo dígito mais à direita, duplique cada segundo dígito",
    "luhnStep2": "Se a duplicação resultar em um número maior que 9, subtraia 9 do resultado",
    "luhnStep3": "Some todos os dígitos. Se o total for divisível por 10, o número é válido",
    "brandsTitle": "Bandeiras de Cartões Suportadas",
    "brandsDescription": "As bandeiras são identificadas pelo BIN (Número de Identificação Bancária) ou IIN (Número de Identificação do Emissor), que são os primeiros dígitos do número do cartão.",
    "brandColumn": "Bandeira",
    "prefixColumn": "Prefixo",
    "lengthColumn": "Comprimento",
    "cvcColumn": "CVC"
  },
  "ar": {
    "title": "ما هو التحقق من بطاقة الائتمان؟",
    "description": "التحقق من بطاقة الائتمان هو عملية للتحقق مما إذا كان رقم البطاقة صالحًا محتملاً قبل معالجة المعاملة. يستخدم خوارزمية Luhn وتحديد العلامة التجارية للبطاقة للتحقق من التنسيق.",
    "luhnTitle": "خوارزمية Luhn",
    "luhnDescription": "خوارزمية Luhn (المعروفة أيضًا باسم Mod 10) هي صيغة مجموع اختباري تستخدم للتحقق من أرقام التعريف. إليك كيف تعمل:",
    "luhnStep1": "بدءًا من الرقم الأيمن، ضاعف كل رقم ثانٍ",
    "luhnStep2": "إذا كانت نتيجة المضاعفة أكبر من 9، اطرح 9 من النتيجة",
    "luhnStep3": "اجمع جميع الأرقام. إذا كان المجموع قابلاً للقسمة على 10، فالرقم صالح",
    "brandsTitle": "العلامات التجارية للبطاقات المدعومة",
    "brandsDescription": "يتم تحديد العلامات التجارية للبطاقات من خلال BIN (رقم تعريف البنك) أو IIN (رقم تعريف المُصدر)، وهي الأرقام الأولى من رقم البطاقة.",
    "brandColumn": "العلامة التجارية",
    "prefixColumn": "البادئة",
    "lengthColumn": "الطول",
    "cvcColumn": "CVC"
  },
  "hi": {
    "title": "क्रेडिट कार्ड सत्यापन क्या है?",
    "description": "क्रेडिट कार्ड सत्यापन एक प्रक्रिया है जो लेनदेन संसाधित करने से पहले जांचती है कि कार्ड नंबर संभावित रूप से मान्य है या नहीं। यह प्रारूप को सत्यापित करने के लिए Luhn एल्गोरिथम और कार्ड ब्रांड पहचान का उपयोग करता है।",
    "luhnTitle": "Luhn एल्गोरिथम",
    "luhnDescription": "Luhn एल्गोरिथम (Mod 10 के रूप में भी जाना जाता है) एक चेकसम फॉर्मूला है जो पहचान संख्याओं को मान्य करने के लिए उपयोग किया जाता है। यहां बताया गया है कि यह कैसे काम करता है:",
    "luhnStep1": "सबसे दाहिने अंक से शुरू करते हुए, हर दूसरे अंक को दोगुना करें",
    "luhnStep2": "यदि दोगुना करने पर 9 से बड़ी संख्या मिलती है, तो परिणाम से 9 घटाएं",
    "luhnStep3": "सभी अंकों को जोड़ें। यदि कुल 10 से विभाज्य है, तो नंबर मान्य है",
    "brandsTitle": "समर्थित कार्ड ब्रांड",
    "brandsDescription": "कार्ड ब्रांड की पहचान उनके BIN (बैंक पहचान संख्या) या IIN (जारीकर्ता पहचान संख्या) द्वारा की जाती है, जो कार्ड नंबर के पहले कुछ अंक होते हैं।",
    "brandColumn": "ब्रांड",
    "prefixColumn": "उपसर्ग",
    "lengthColumn": "लंबाई",
    "cvcColumn": "CVC"
  },
  "tr": {
    "title": "Kredi Kartı Doğrulaması Nedir?",
    "description": "Kredi kartı doğrulaması, bir işlem gerçekleştirmeden önce kart numarasının potansiyel olarak geçerli olup olmadığını kontrol eden bir süreçtir. Formatı doğrulamak için Luhn algoritması ve kart markası tanımlaması kullanır.",
    "luhnTitle": "Luhn Algoritması",
    "luhnDescription": "Luhn algoritması (Mod 10 olarak da bilinir), kimlik numaralarını doğrulamak için kullanılan bir sağlama toplamı formülüdür. İşte nasıl çalışır:",
    "luhnStep1": "En sağdaki rakamdan başlayarak, her ikinci rakamı ikiye katlayın",
    "luhnStep2": "İkiye katlamanın sonucu 9'dan büyükse, sonuçtan 9 çıkarın",
    "luhnStep3": "Tüm rakamları toplayın. Toplam 10'a bölünebiliyorsa, numara geçerlidir",
    "brandsTitle": "Desteklenen Kart Markaları",
    "brandsDescription": "Kart markaları, kart numarasının ilk birkaç rakamı olan BIN (Banka Kimlik Numarası) veya IIN (Veren Kimlik Numarası) ile tanımlanır.",
    "brandColumn": "Marka",
    "prefixColumn": "Önek",
    "lengthColumn": "Uzunluk",
    "cvcColumn": "CVC"
  },
  "nl": {
    "title": "Wat is Creditcardvalidatie?",
    "description": "Creditcardvalidatie is een proces om te controleren of een kaartnummer potentieel geldig is voordat een transactie wordt verwerkt. Het gebruikt het Luhn-algoritme en kaartmerkidentificatie om het formaat te verifiëren.",
    "luhnTitle": "Luhn-algoritme",
    "luhnDescription": "Het Luhn-algoritme (ook bekend als Mod 10) is een checksum-formule die wordt gebruikt om identificatienummers te valideren. Zo werkt het:",
    "luhnStep1": "Beginnend bij het meest rechtse cijfer, verdubbel elk tweede cijfer",
    "luhnStep2": "Als verdubbeling resulteert in een getal groter dan 9, trek 9 af van het resultaat",
    "luhnStep3": "Tel alle cijfers op. Als het totaal deelbaar is door 10, is het nummer geldig",
    "brandsTitle": "Ondersteunde Kaartmerken",
    "brandsDescription": "Kaartmerken worden geïdentificeerd door hun BIN (Bankidentificatienummer) of IIN (Uitgeveridentificatienummer), de eerste cijfers van het kaartnummer.",
    "brandColumn": "Merk",
    "prefixColumn": "Prefix",
    "lengthColumn": "Lengte",
    "cvcColumn": "CVC"
  },
  "sv": {
    "title": "Vad är Kreditkortsvalidering?",
    "description": "Kreditkortsvalidering är en process för att kontrollera om ett kortnummer är potentiellt giltigt innan en transaktion behandlas. Den använder Luhn-algoritmen och kortmärkesidentifikation för att verifiera formatet.",
    "luhnTitle": "Luhn-algoritmen",
    "luhnDescription": "Luhn-algoritmen (även känd som Mod 10) är en kontrollsummeformel som används för att validera identifikationsnummer. Så här fungerar det:",
    "luhnStep1": "Börja från den högra siffran, dubbla varannan siffra",
    "luhnStep2": "Om dubbleringen resulterar i ett tal större än 9, subtrahera 9 från resultatet",
    "luhnStep3": "Summera alla siffror. Om summan är delbar med 10 är numret giltigt",
    "brandsTitle": "Stödda Kortmärken",
    "brandsDescription": "Kortmärken identifieras av deras BIN (bankidentifikationsnummer) eller IIN (utfärdaridentifikationsnummer), som är de första siffrorna i kortnumret.",
    "brandColumn": "Märke",
    "prefixColumn": "Prefix",
    "lengthColumn": "Längd",
    "cvcColumn": "CVC"
  },
  "pl": {
    "title": "Czym jest Walidacja Karty Kredytowej?",
    "description": "Walidacja karty kredytowej to proces sprawdzania, czy numer karty jest potencjalnie prawidłowy przed przetworzeniem transakcji. Wykorzystuje algorytm Luhna i identyfikację marki karty do weryfikacji formatu.",
    "luhnTitle": "Algorytm Luhna",
    "luhnDescription": "Algorytm Luhna (znany również jako Mod 10) to formuła sumy kontrolnej używana do walidacji numerów identyfikacyjnych. Oto jak działa:",
    "luhnStep1": "Zaczynając od najbardziej prawej cyfry, podwój co drugą cyfrę",
    "luhnStep2": "Jeśli podwojenie daje liczbę większą niż 9, odejmij 9 od wyniku",
    "luhnStep3": "Zsumuj wszystkie cyfry. Jeśli suma jest podzielna przez 10, numer jest prawidłowy",
    "brandsTitle": "Obsługiwane Marki Kart",
    "brandsDescription": "Marki kart są identyfikowane przez ich BIN (Numer Identyfikacji Banku) lub IIN (Numer Identyfikacji Wydawcy), które są pierwszymi cyframi numeru karty.",
    "brandColumn": "Marka",
    "prefixColumn": "Prefiks",
    "lengthColumn": "Długość",
    "cvcColumn": "CVC"
  },
  "vi": {
    "title": "Xác Thực Thẻ Tín Dụng là gì?",
    "description": "Xác thực thẻ tín dụng là quy trình kiểm tra xem số thẻ có khả năng hợp lệ trước khi xử lý giao dịch. Nó sử dụng thuật toán Luhn và nhận dạng thương hiệu thẻ để xác minh định dạng.",
    "luhnTitle": "Thuật toán Luhn",
    "luhnDescription": "Thuật toán Luhn (còn được gọi là Mod 10) là công thức checksum được sử dụng để xác thực số nhận dạng. Đây là cách nó hoạt động:",
    "luhnStep1": "Bắt đầu từ chữ số ngoài cùng bên phải, nhân đôi mỗi chữ số thứ hai",
    "luhnStep2": "Nếu nhân đôi ra số lớn hơn 9, trừ 9 khỏi kết quả",
    "luhnStep3": "Cộng tất cả các chữ số. Nếu tổng chia hết cho 10, số hợp lệ",
    "brandsTitle": "Thương Hiệu Thẻ Được Hỗ Trợ",
    "brandsDescription": "Thương hiệu thẻ được xác định bởi BIN (Số Nhận Dạng Ngân Hàng) hoặc IIN (Số Nhận Dạng Tổ Chức Phát Hành), là các chữ số đầu tiên của số thẻ.",
    "brandColumn": "Thương hiệu",
    "prefixColumn": "Tiền tố",
    "lengthColumn": "Độ dài",
    "cvcColumn": "CVC"
  },
  "th": {
    "title": "การตรวจสอบบัตรเครดิตคืออะไร?",
    "description": "การตรวจสอบบัตรเครดิตเป็นกระบวนการตรวจสอบว่าหมายเลขบัตรอาจถูกต้องหรือไม่ก่อนประมวลผลธุรกรรม ใช้อัลกอริทึม Luhn และการระบุแบรนด์บัตรเพื่อตรวจสอบรูปแบบ",
    "luhnTitle": "อัลกอริทึม Luhn",
    "luhnDescription": "อัลกอริทึม Luhn (หรือที่รู้จักกันในชื่อ Mod 10) เป็นสูตร checksum ที่ใช้ตรวจสอบหมายเลขประจำตัว นี่คือวิธีการทำงาน:",
    "luhnStep1": "เริ่มจากหลักขวาสุด เพิ่มเป็นสองเท่าทุกหลักที่สอง",
    "luhnStep2": "ถ้าผลคูณมากกว่า 9 ให้ลบ 9 ออกจากผลลัพธ์",
    "luhnStep3": "รวมตัวเลขทั้งหมด ถ้าผลรวมหารด้วย 10 ลงตัว หมายเลขถูกต้อง",
    "brandsTitle": "แบรนด์บัตรที่รองรับ",
    "brandsDescription": "แบรนด์บัตรถูกระบุโดย BIN (หมายเลขประจำตัวธนาคาร) หรือ IIN (หมายเลขประจำตัวผู้ออก) ซึ่งเป็นตัวเลขแรกของหมายเลขบัตร",
    "brandColumn": "แบรนด์",
    "prefixColumn": "คำนำหน้า",
    "lengthColumn": "ความยาว",
    "cvcColumn": "CVC"
  },
  "id": {
    "title": "Apa itu Validasi Kartu Kredit?",
    "description": "Validasi kartu kredit adalah proses untuk memeriksa apakah nomor kartu berpotensi valid sebelum memproses transaksi. Menggunakan algoritma Luhn dan identifikasi merek kartu untuk memverifikasi format.",
    "luhnTitle": "Algoritma Luhn",
    "luhnDescription": "Algoritma Luhn (juga dikenal sebagai Mod 10) adalah formula checksum yang digunakan untuk memvalidasi nomor identifikasi. Begini cara kerjanya:",
    "luhnStep1": "Mulai dari digit paling kanan, gandakan setiap digit kedua",
    "luhnStep2": "Jika penggandaan menghasilkan angka lebih dari 9, kurangi 9 dari hasil",
    "luhnStep3": "Jumlahkan semua digit. Jika total habis dibagi 10, nomor valid",
    "brandsTitle": "Merek Kartu yang Didukung",
    "brandsDescription": "Merek kartu diidentifikasi oleh BIN (Nomor Identifikasi Bank) atau IIN (Nomor Identifikasi Penerbit), yang merupakan digit pertama dari nomor kartu.",
    "brandColumn": "Merek",
    "prefixColumn": "Awalan",
    "lengthColumn": "Panjang",
    "cvcColumn": "CVC"
  },
  "he": {
    "title": "מהו אימות כרטיס אשראי?",
    "description": "אימות כרטיס אשראי הוא תהליך לבדיקה האם מספר כרטיס עשוי להיות תקין לפני עיבוד עסקה. הוא משתמש באלגוריתם Luhn ובזיהוי מותג הכרטיס לאימות הפורמט.",
    "luhnTitle": "אלגוריתם Luhn",
    "luhnDescription": "אלגוריתם Luhn (הידוע גם כ-Mod 10) הוא נוסחת סכום ביקורת המשמשת לאימות מספרי זיהוי. כך זה עובד:",
    "luhnStep1": "החל מהספרה הימנית ביותר, הכפל כל ספרה שנייה",
    "luhnStep2": "אם ההכפלה מניבה מספר גדול מ-9, הפחת 9 מהתוצאה",
    "luhnStep3": "סכם את כל הספרות. אם הסכום מתחלק ב-10, המספר תקין",
    "brandsTitle": "מותגי כרטיסים נתמכים",
    "brandsDescription": "מותגי כרטיסים מזוהים לפי ה-BIN (מספר זיהוי בנק) או IIN (מספר זיהוי מנפיק), שהם הספרות הראשונות של מספר הכרטיס.",
    "brandColumn": "מותג",
    "prefixColumn": "קידומת",
    "lengthColumn": "אורך",
    "cvcColumn": "CVC"
  },
  "ms": {
    "title": "Apakah Pengesahan Kad Kredit?",
    "description": "Pengesahan kad kredit adalah proses untuk memeriksa sama ada nombor kad berpotensi sah sebelum memproses transaksi. Ia menggunakan algoritma Luhn dan pengenalan jenama kad untuk mengesahkan format.",
    "luhnTitle": "Algoritma Luhn",
    "luhnDescription": "Algoritma Luhn (juga dikenali sebagai Mod 10) ialah formula checksum yang digunakan untuk mengesahkan nombor pengenalan. Begini cara ia berfungsi:",
    "luhnStep1": "Bermula dari digit paling kanan, gandakan setiap digit kedua",
    "luhnStep2": "Jika penggandaan menghasilkan nombor lebih daripada 9, tolak 9 daripada hasil",
    "luhnStep3": "Jumlahkan semua digit. Jika jumlah boleh dibahagi dengan 10, nombor itu sah",
    "brandsTitle": "Jenama Kad yang Disokong",
    "brandsDescription": "Jenama kad dikenal pasti melalui BIN (Nombor Pengenalan Bank) atau IIN (Nombor Pengenalan Pengeluar), iaitu digit pertama nombor kad.",
    "brandColumn": "Jenama",
    "prefixColumn": "Awalan",
    "lengthColumn": "Panjang",
    "cvcColumn": "CVC"
  },
  "no": {
    "title": "Hva er Kredittkortvalidering?",
    "description": "Kredittkortvalidering er en prosess for å sjekke om et kortnummer er potensielt gyldig før en transaksjon behandles. Den bruker Luhn-algoritmen og kortmerkeidentifikasjon for å verifisere formatet.",
    "luhnTitle": "Luhn-algoritmen",
    "luhnDescription": "Luhn-algoritmen (også kjent som Mod 10) er en kontrollsumformel som brukes til å validere identifikasjonsnumre. Slik fungerer det:",
    "luhnStep1": "Start fra det høyre sifferet, doble annethvert siffer",
    "luhnStep2": "Hvis dobling gir et tall større enn 9, trekk fra 9 fra resultatet",
    "luhnStep3": "Summer alle sifrene. Hvis totalen er delelig med 10, er nummeret gyldig",
    "brandsTitle": "Støttede Kortmerker",
    "brandsDescription": "Kortmerker identifiseres av deres BIN (bankidentifikasjonsnummer) eller IIN (utstederidentifikasjonsnummer), som er de første sifrene i kortnummeret.",
    "brandColumn": "Merke",
    "prefixColumn": "Prefiks",
    "lengthColumn": "Lengde",
    "cvcColumn": "CVC"
  }
}
</i18n>
