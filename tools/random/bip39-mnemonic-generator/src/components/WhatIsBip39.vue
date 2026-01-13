<template>
  <DescriptionMarkdown
    :title="t('what-is-bip39')"
    :description="t('what-is-bip39-description-markdown')"
  />
</template>

<script setup lang="ts">
import { DescriptionMarkdown } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "what-is-bip39": "What is BIP39?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) defines a standard for turning random entropy into a list of words called a mnemonic phrase. The mnemonic plus an optional passphrase is used to derive a seed for hierarchical deterministic (HD) wallets.\n\n**Key points:**\n- **12-24 words** represent 128-256 bits of entropy plus a checksum\n- **Language-specific wordlists** keep word order consistent\n- **Deterministic**: the same mnemonic and passphrase always produce the same seed\n\n**Security tips:**\n- Keep the phrase offline and private\n- Anyone with the mnemonic can control the funds\n- Verify the words and order before saving"
  },
  "zh": {
    "what-is-bip39": "什么是 BIP39？",
    "what-is-bip39-description-markdown": "BIP39（比特币改进提案 39）定义了一套标准，用于将随机熵转换为一组单词，称为助记词短语。助记词加上可选的密码短语用于派生分层确定性（HD）钱包的种子。\n\n**要点：**\n- **12-24 个单词** 表示 128-256 位熵加上校验和\n- **语言词表** 保持单词顺序一致\n- **确定性**：相同的助记词和密码短语始终生成相同的种子\n\n**安全提示：**\n- 将助记词离线保存并保密\n- 任何拥有助记词的人都能控制资产\n- 保存前核对单词和顺序"
  },
  "zh-CN": {
    "what-is-bip39": "什么是 BIP39？",
    "what-is-bip39-description-markdown": "BIP39（比特币改进提案 39）定义了一套标准，用于将随机熵转换为一组单词，称为助记词短语。助记词加上可选的密码短语用于派生分层确定性（HD）钱包的种子。\n\n**要点：**\n- **12-24 个单词** 表示 128-256 位熵加上校验和\n- **语言词表** 保持单词顺序一致\n- **确定性**：相同的助记词和密码短语始终生成相同的种子\n\n**安全提示：**\n- 将助记词离线保存并保密\n- 任何拥有助记词的人都能控制资产\n- 保存前核对单词和顺序"
  },
  "zh-TW": {
    "what-is-bip39": "什麼是 BIP39？",
    "what-is-bip39-description-markdown": "BIP39（比特幣改進提案 39）定義了一套標準，用於將隨機熵轉換為一組單詞，稱為助記詞短語。助記詞加上可選的密碼短語用於衍生分層確定性（HD）錢包的種子。\n\n**要點：**\n- **12-24 個單詞** 表示 128-256 位熵加上校驗和\n- **語言詞表** 保持單詞順序一致\n- **確定性**：相同的助記詞和密碼短語始終產生相同的種子\n\n**安全提示：**\n- 將助記詞離線保存並保密\n- 任何擁有助記詞的人都能控制資產\n- 保存前核對單詞和順序"
  },
  "zh-HK": {
    "what-is-bip39": "什麼是 BIP39？",
    "what-is-bip39-description-markdown": "BIP39（比特幣改進提案 39）定義了一套標準，用於將隨機熵轉換為一組單詞，稱為助記詞短語。助記詞加上可選的密碼短語用於衍生分層確定性（HD）錢包的種子。\n\n**要點：**\n- **12-24 個單詞** 表示 128-256 位熵加上校驗和\n- **語言詞表** 保持單詞順序一致\n- **確定性**：相同的助記詞和密碼短語始終產生相同的種子\n\n**安全提示：**\n- 將助記詞離線保存並保密\n- 任何擁有助記詞的人都能控制資產\n- 保存前核對單詞和順序"
  },
  "es": {
    "what-is-bip39": "¿Qué es BIP39?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) define un estándar para convertir entropía aleatoria en una lista de palabras llamada frase mnemónica. La mnemónica, junto con una frase de paso opcional, se usa para derivar la semilla de carteras determinísticas jerárquicas (HD).\n\n**Puntos clave:**\n- **12-24 palabras** representan 128-256 bits de entropía más una suma de comprobación\n- **Listas de palabras por idioma** mantienen el orden de palabras consistente\n- **Determinista**: la misma mnemónica y frase de paso siempre producen la misma semilla\n\n**Consejos de seguridad:**\n- Guarda la frase fuera de línea y en privado\n- Cualquiera con la mnemónica puede controlar los fondos\n- Verifica las palabras y el orden antes de guardar"
  },
  "fr": {
    "what-is-bip39": "Qu'est-ce que BIP39 ?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) définit une norme pour transformer de l'entropie aléatoire en une liste de mots appelée phrase mnémonique. La phrase mnémonique, avec une phrase secrète facultative, sert à dériver la graine des portefeuilles déterministes hiérarchiques (HD).\n\n**Points clés :**\n- **12-24 mots** représentent 128-256 bits d'entropie plus une somme de contrôle\n- **Listes de mots par langue** pour garder un ordre cohérent\n- **Déterministe** : la même phrase mnémonique et la même phrase secrète produisent toujours la même graine\n\n**Conseils de sécurité :**\n- Gardez la phrase hors ligne et privée\n- Toute personne possédant la phrase mnémonique peut contrôler les fonds\n- Vérifiez les mots et l'ordre avant d'enregistrer"
  },
  "de": {
    "what-is-bip39": "Was ist BIP39?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) definiert einen Standard, um zufällige Entropie in eine Wortliste, die sogenannte Mnemonik, umzuwandeln. Die Mnemonik plus eine optionale Passphrase wird verwendet, um den Seed für hierarchisch deterministische (HD) Wallets abzuleiten.\n\n**Kernpunkte:**\n- **12-24 Wörter** stehen für 128-256 Bit Entropie plus Prüfsumme\n- **Sprachspezifische Wortlisten** halten die Reihenfolge konsistent\n- **Deterministisch**: dieselbe Mnemonik und Passphrase erzeugen immer denselben Seed\n\n**Sicherheitstipps:**\n- Halte die Phrase offline und privat\n- Jeder mit der Mnemonik kann die Guthaben kontrollieren\n- Prüfe Wörter und Reihenfolge vor dem Speichern"
  },
  "it": {
    "what-is-bip39": "Cos'è BIP39?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) definisce uno standard per trasformare entropia casuale in un elenco di parole chiamato frase mnemonica. La mnemonica, insieme a una passphrase opzionale, serve per derivare il seed dei wallet deterministici gerarchici (HD).\n\n**Punti chiave:**\n- **12-24 parole** rappresentano 128-256 bit di entropia più una somma di controllo\n- **Liste di parole per lingua** mantengono coerente l'ordine delle parole\n- **Deterministico**: la stessa mnemonica e passphrase producono sempre lo stesso seed\n\n**Suggerimenti di sicurezza:**\n- Conserva la frase offline e privata\n- Chiunque abbia la mnemonica può controllare i fondi\n- Verifica le parole e l'ordine prima di salvare"
  },
  "ja": {
    "what-is-bip39": "BIP39とは？",
    "what-is-bip39-description-markdown": "BIP39（Bitcoin Improvement Proposal 39）は、ランダムなエントロピーを「ニーモニック」（助記語フレーズ）と呼ばれる単語の一覧に変換する標準を定義します。ニーモニックと任意のパスフレーズを使って、階層的決定性（HD）ウォレットのシードを導出します。\n\n**ポイント：**\n- **12-24語** が 128-256 ビットのエントロピーとチェックサムを表す\n- **言語別の単語リスト** が単語順を一致させる\n- **決定的**：同じニーモニックとパスフレーズは常に同じシードになる\n\n**セキュリティの注意：**\n- フレーズはオフラインで秘密に保つ\n- ニーモニックを持つ人は資産を管理できる\n- 保存前に単語と順序を確認する"
  },
  "ko": {
    "what-is-bip39": "BIP39란?",
    "what-is-bip39-description-markdown": "BIP39(Bitcoin Improvement Proposal 39)은 무작위 엔트로피를 단어 목록으로 변환해 니모닉 문구를 만드는 표준입니다. 니모닉과 선택적 패스프레이즈를 사용해 계층 결정성(HD) 지갑의 시드를 파생합니다.\n\n**핵심 포인트:**\n- **12-24개 단어**가 128-256비트 엔트로피와 체크섬을 나타냄\n- **언어별 단어 목록**이 단어 순서를 일관되게 유지\n- **결정적**: 동일한 니모닉과 패스프레이즈는 항상 동일한 시드를 생성\n\n**보안 팁:**\n- 문구를 오프라인으로 보관하고 비공개로 유지\n- 니모닉을 가진 사람은 자산을 제어할 수 있음\n- 저장 전에 단어와 순서를 확인"
  },
  "ru": {
    "what-is-bip39": "Что такое BIP39?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) определяет стандарт преобразования случайной энтропии в список слов, называемый мнемонической фразой. Мнемоника вместе с опциональной парольной фразой используется для вывода сида для иерархически детерминированных (HD) кошельков.\n\n**Ключевые пункты:**\n- **12-24 слова** представляют 128-256 бит энтропии плюс контрольную сумму\n- **Списки слов для языков** сохраняют единый порядок слов\n- **Детерминированно**: одна и та же мнемоника и парольная фраза всегда дают один и тот же сид\n\n**Советы по безопасности:**\n- Храните фразу офлайн и в тайне\n- Любой, у кого есть мнемоника, может управлять средствами\n- Проверяйте слова и порядок перед сохранением"
  },
  "pt": {
    "what-is-bip39": "O que é BIP39?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) define um padrão para transformar entropia aleatória em uma lista de palavras chamada frase mnemônica. A mnemônica, junto com uma passphrase opcional, é usada para derivar a semente de carteiras determinísticas hierárquicas (HD).\n\n**Pontos-chave:**\n- **12-24 palavras** representam 128-256 bits de entropia mais uma soma de verificação\n- **Listas de palavras por idioma** mantêm a ordem consistente\n- **Determinístico**: a mesma mnemônica e passphrase sempre produzem a mesma semente\n\n**Dicas de segurança:**\n- Mantenha a frase offline e privada\n- Qualquer pessoa com a mnemônica pode controlar os fundos\n- Verifique as palavras e a ordem antes de salvar"
  },
  "ar": {
    "what-is-bip39": "ما هو BIP39؟",
    "what-is-bip39-description-markdown": "BIP39 (مقترح تحسين بيتكوين 39) يعرّف معيارًا لتحويل الإنتروبيا العشوائية إلى قائمة من الكلمات تُسمى عبارة تذكّرية. تُستخدم العبارة التذكّرية مع عبارة مرور اختيارية لاشتقاق البذرة لمحافظ حتمية هرمية (HD).\n\n**نقاط أساسية:**\n- **12-24 كلمة** تمثل 128-256 بت من الإنتروبيا مع قيمة تحقق\n- **قوائم كلمات حسب اللغة** تحافظ على ترتيب الكلمات\n- **حتمي**: نفس العبارة التذكّرية وعبارة المرور تعطيان دائمًا نفس البذرة\n\n**نصائح أمان:**\n- احتفظ بالعبارة دون اتصال وبشكل سري\n- أي شخص يملك العبارة التذكّرية يمكنه التحكم في الأموال\n- تحقّق من الكلمات والترتيب قبل الحفظ"
  },
  "hi": {
    "what-is-bip39": "BIP39 क्या है?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) यादृच्छिक एंट्रॉपी को शब्दों की सूची में बदलने का एक मानक है जिसे निमोनिक वाक्यांश कहा जाता है। निमोनिक और वैकल्पिक पासफ्रेज़ का उपयोग पदानुक्रमित निर्धारक (HD) वॉलेट के लिए सीड निकालने में किया जाता है।\n\n**मुख्य बिंदु:**\n- **12-24 शब्द** 128-256 बिट एंट्रॉपी और चेकसम दर्शाते हैं\n- **भाषा-विशिष्ट शब्दसूचियाँ** शब्दों के क्रम को एक जैसा रखती हैं\n- **निर्धारक**: वही निमोनिक और पासफ्रेज़ हमेशा वही सीड बनाते हैं\n\n**सुरक्षा सुझाव:**\n- वाक्यांश को ऑफलाइन और निजी रखें\n- जिसे निमोनिक पता है वह फंड नियंत्रित कर सकता है\n- सहेजने से पहले शब्द और क्रम जांचें"
  },
  "tr": {
    "what-is-bip39": "BIP39 nedir?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39), rastgele entropiyi mnemonik olarak adlandırılan bir kelime listesine dönüştürmek için bir standart tanımlar. Mnemonik ve isteğe bağlı bir parola ifadesi, hiyerarşik deterministik (HD) cüzdanların seed'ini türetmek için kullanılır.\n\n**Önemli noktalar:**\n- **12-24 kelime** 128-256 bit entropi ve bir sağlama toplamını temsil eder\n- **Dil bazlı kelime listeleri** kelime sırasını tutarlı kılar\n- **Deterministik**: aynı mnemonik ve parola ifadesi her zaman aynı seed'i üretir\n\n**Güvenlik ipuçları:**\n- İfadeyi çevrimdışı ve gizli tutun\n- Mnemonik'e sahip olan herkes fonları kontrol edebilir\n- Kaydetmeden önce kelimeleri ve sırayı doğrulayın"
  },
  "nl": {
    "what-is-bip39": "Wat is BIP39?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) definieert een standaard om willekeurige entropie om te zetten in een woordenlijst, een zogeheten mnemonic-zin. De mnemonic plus een optionele passphrase wordt gebruikt om de seed voor hiërarchisch deterministische (HD) wallets af te leiden.\n\n**Belangrijkste punten:**\n- **12-24 woorden** vertegenwoordigen 128-256 bits entropie plus een checksum\n- **Taalspecifieke woordenlijsten** houden de woordvolgorde consistent\n- **Deterministisch**: dezelfde mnemonic en passphrase leveren altijd dezelfde seed op\n\n**Beveiligingstips:**\n- Bewaar de zin offline en privé\n- Iedereen met de mnemonic kan de tegoeden beheren\n- Controleer woorden en volgorde voordat je opslaat"
  },
  "sv": {
    "what-is-bip39": "Vad är BIP39?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) definierar en standard för att omvandla slumpmässig entropi till en lista med ord som kallas en mnemonic-fras. Mnemoniken tillsammans med en valfri passphrase används för att härleda seed för hierarkiska deterministiska (HD) plånböcker.\n\n**Nyckelpunkter:**\n- **12-24 ord** representerar 128-256 bit entropi plus en kontrollsumma\n- **Språkspecifika ordlistor** håller ordningen konsekvent\n- **Deterministiskt**: samma mnemonic och passphrase ger alltid samma seed\n\n**Säkerhetstips:**\n- Förvara frasen offline och privat\n- Vem som helst med mnemoniken kan kontrollera tillgångarna\n- Kontrollera orden och ordningen innan du sparar"
  },
  "pl": {
    "what-is-bip39": "Czym jest BIP39?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) definiuje standard zamiany losowej entropii na listę słów zwaną frazą mnemoniczną. Mnemonika wraz z opcjonalną passphrase służy do wyprowadzenia seeda dla hierarchicznych deterministycznych (HD) portfeli.\n\n**Kluczowe punkty:**\n- **12-24 słowa** reprezentują 128-256 bitów entropii oraz sumę kontrolną\n- **Listy słów dla języków** utrzymują spójny porządek słów\n- **Deterministyczne**: ta sama mnemonika i passphrase zawsze dają ten sam seed\n\n**Wskazówki bezpieczeństwa:**\n- Przechowuj frazę offline i prywatnie\n- Każdy posiadający mnemonikę może kontrolować środki\n- Sprawdź słowa i kolejność przed zapisaniem"
  },
  "vi": {
    "what-is-bip39": "BIP39 là gì?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) định nghĩa một chuẩn để chuyển đổi entropy ngẫu nhiên thành danh sách từ gọi là cụm từ ghi nhớ. Cụm từ ghi nhớ cùng với passphrase tùy chọn được dùng để tạo seed cho ví xác định phân cấp (HD).\n\n**Điểm chính:**\n- **12-24 từ** biểu thị 128-256 bit entropy cộng thêm checksum\n- **Danh sách từ theo ngôn ngữ** giữ thứ tự từ nhất quán\n- **Tất định**: cùng một mnemonic và passphrase luôn tạo ra cùng một seed\n\n**Mẹo bảo mật:**\n- Giữ cụm từ ngoại tuyến và riêng tư\n- Bất kỳ ai có mnemonic đều có thể kiểm soát tài sản\n- Kiểm tra từ và thứ tự trước khi lưu"
  },
  "th": {
    "what-is-bip39": "BIP39 คืออะไร?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) กำหนดมาตรฐานในการแปลงเอนโทรปีแบบสุ่มให้เป็นรายการคำที่เรียกว่า วลีช่วยจำ วลีช่วยจำพร้อมวลีรหัสผ่านแบบเลือกได้ใช้เพื่อสร้างซีดสำหรับกระเป๋าสตางค์แบบกำหนดแน่นอนตามลำดับชั้น (HD)\n\n**ประเด็นสำคัญ:**\n- **12-24 คำ** แทน 128-256 บิตของเอนโทรปีพร้อมเช็กซัม\n- **รายการคำตามภาษา** ทำให้ลำดับคำสม่ำเสมอ\n- **กำหนดแน่นอน**: วลีช่วยจำและวลีรหัสผ่านเดิมจะได้ซีดเดิมเสมอ\n\n**คำแนะนำด้านความปลอดภัย:**\n- เก็บวลีไว้แบบออฟไลน์และเป็นความลับ\n- ใครก็ตามที่มีวลีช่วยจำสามารถควบคุมสินทรัพย์ได้\n- ตรวจสอบคำและลำดับก่อนบันทึก"
  },
  "id": {
    "what-is-bip39": "Apa itu BIP39?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) mendefinisikan standar untuk mengubah entropi acak menjadi daftar kata yang disebut frasa mnemonik. Mnemonik dengan passphrase opsional digunakan untuk menurunkan seed bagi dompet deterministik hierarkis (HD).\n\n**Poin utama:**\n- **12-24 kata** mewakili 128-256 bit entropi plus checksum\n- **Daftar kata per bahasa** menjaga urutan kata tetap konsisten\n- **Deterministik**: mnemonik dan passphrase yang sama selalu menghasilkan seed yang sama\n\n**Tips keamanan:**\n- Simpan frasa secara offline dan privat\n- Siapa pun yang memiliki mnemonik dapat mengontrol aset\n- Periksa kata dan urutannya sebelum menyimpan"
  },
  "he": {
    "what-is-bip39": "מהו BIP39?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) מגדיר תקן להמרת אנטרופיה אקראית לרשימת מילים הנקראת ביטוי מנמוני. הביטוי המנמוני יחד עם ביטוי סיסמה אופציונלי משמשים לגזירת seed עבור ארנקים דטרמיניסטיים היררכיים (HD).\n\n**נקודות מפתח:**\n- **12-24 מילים** מייצגות 128-256 ביט של אנטרופיה יחד עם סכום ביקורת\n- **רשימות מילים לפי שפה** שומרות על סדר מילים עקבי\n- **דטרמיניסטי**: אותו ביטוי מנמוני וביטוי סיסמה תמיד יוצרים את אותו seed\n\n**טיפים לאבטחה:**\n- שמרו את הביטוי במצב לא מקוון ובפרטיות\n- כל מי שמחזיק בביטוי המנמוני יכול לשלוט בנכסים\n- בדקו את המילים והסדר לפני השמירה"
  },
  "ms": {
    "what-is-bip39": "Apakah BIP39?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) mentakrifkan piawaian untuk menukar entropi rawak kepada senarai perkataan yang dipanggil frasa mnemonik. Mnemonik bersama frasa kata laluan pilihan digunakan untuk menjana seed bagi dompet deterministik berhierarki (HD).\n\n**Perkara utama:**\n- **12-24 perkataan** mewakili 128-256 bit entropi serta jumlah semakan\n- **Senarai perkataan mengikut bahasa** mengekalkan susunan perkataan yang konsisten\n- **Deterministik**: mnemonik dan frasa kata laluan yang sama sentiasa menghasilkan seed yang sama\n\n**Petua keselamatan:**\n- Simpan frasa secara luar talian dan rahsia\n- Sesiapa yang mempunyai mnemonik boleh mengawal aset\n- Semak perkataan dan susunan sebelum menyimpan"
  },
  "no": {
    "what-is-bip39": "Hva er BIP39?",
    "what-is-bip39-description-markdown": "BIP39 (Bitcoin Improvement Proposal 39) definerer en standard for å gjøre tilfeldig entropi om til en ordliste kalt en mnemonic-frase. Mnemonikken sammen med en valgfri passfrase brukes til å utlede seed for hierarkiske deterministiske (HD) lommebøker.\n\n**Nøkkelpunkter:**\n- **12-24 ord** representerer 128-256 bit entropi pluss en kontrollsum\n- **Språkspesifikke ordlister** holder ordrekkefølgen konsistent\n- **Deterministisk**: samme mnemonic og passfrase gir alltid samme seed\n\n**Sikkerhetstips:**\n- Hold frasen offline og privat\n- Alle med mnemonikken kan kontrollere midlene\n- Sjekk ordene og rekkefølgen før du lagrer"
  }
}
</i18n>
