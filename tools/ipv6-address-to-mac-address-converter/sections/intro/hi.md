## IPv6 को MAC पते में कैसे बदलें

आप किसी IPv6 पते से MAC पता तभी वापस निकाल सकते हैं जब IPv6 interface
identifier उसी MAC पते से EUI-64 तरीके से बनाया गया हो। यह सबसे ज़्यादा
`fe80::` से शुरू होने वाले पुराने link-local पतों और कुछ stateless
autoconfigured पतों में मिलता है।

### यह कब काम करता है

यह reverse conversion तब काम करता है जब IPv6 पते के अंतिम 64 बिट में अभी भी
EUI-64 interface identifier मौजूद हो।

- Interface identifier 48-bit MAC पते से बनाया गया हो।
- बीच के bytes अभी भी `ff:fe` हों।
- पता privacy extensions या किसी अन्य randomization scheme से न बना हो।

### रूपांतरण कैसे होता है

यह converter MAC पते को इन चरणों से फिर बनाता है:

1. IPv6 पते के अंतिम 64 बिट पढ़ता है।
2. Interface identifier के बीच में डाले गए `ff:fe` bytes हटाता है।
3. पहले byte का universal/local bit उलटता है।
4. बचे हुए 48 बिट को standard MAC address के रूप में format करता है।

### परिणाम क्यों नहीं मिलता

इन कारणों से परिणाम नहीं मिल सकता:

- IPv6 पते का syntax मान्य नहीं है।
- पता मान्य है, लेकिन EUI-64 के जरिए MAC पते से नहीं बनाया गया।
- पता privacy, stable-random, DHCPv6 या किसी अन्य non-MAC-based assignment
  method का उपयोग करता है।
