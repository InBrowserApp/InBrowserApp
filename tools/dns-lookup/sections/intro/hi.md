DNS Lookup किसी डोमेन नाम के लिए लौटाए गए public DNS records की जाँच करता है। यह तब उपयोगी है जब आप नई साइट launch सत्यापित कर रहे हों, email delivery debug कर रहे हों, CDN या load balancer बदलाव जाँच रहे हों, या यह पुष्टि कर रहे हों कि DNSSEC-संबंधित responses अलग-अलग resolvers में अलग दिखते हैं या नहीं।

## कब उपयोग करें

इस tool का उपयोग तब करें जब आपको common DNS record types के लिए browser-side जवाब जल्दी चाहिए। A और AAAA records IPv4 और IPv6 destinations दिखाते हैं, CNAME records aliases दिखाते हैं, MX records mail exchangers पहचानते हैं, TXT records में अक्सर SPF या verification tokens होते हैं, और NS/SOA/CAA/SRV/HTTPS/SVCB records delegation, authority, certificate, service, और modern endpoint hints दिखाते हैं।

## यह कैसे काम करता है

Lookup आपके browser में DNS over HTTPS के साथ चलता है। Resolver चुनें, एक या अधिक record types चुनें, और domain या URL submit करें। Query भेजने से पहले URLs को उनके hostname में normalize किया जाता है, इसलिए `https://www.example.com/path` paste करने पर `www.example.com` query किया जाता है।

## परिणाम पढ़ना

हर record type को DNS response code, resolver flags, answer rows, और raw JSON के साथ अलग से दिखाया जाता है। `NoError` का मतलब है कि DNS server ने सफलतापूर्वक answer दिया, लेकिन किसी specific type के लिए वह फिर भी कोई answer row वापस नहीं कर सकता। `NXDomain`, `ServFail`, या `Refused` का आम तौर पर मतलब है कि name मौजूद नहीं है, resolver lookup पूरा नहीं कर सका, या resolver policy ने request block कर दी।

## गोपनीयता और सीमाएँ

Queries चुने गए DNS over HTTPS resolver को भेजी जाती हैं, किसी InBrowser.App server को नहीं। Resolver behavior, cache state, DNSSEC validation, और local network filtering सभी results को प्रभावित कर सकते हैं। यह tool multiple networks से authoritative `dig` checks की जगह नहीं लेता, लेकिन यह आपके current browser से public DoH resolvers क्या लौटाते हैं, उसे inspect करने का तेज तरीका है।
