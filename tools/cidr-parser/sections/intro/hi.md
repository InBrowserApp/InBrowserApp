CIDR Parser `10.24.8.19/21` या `2001:db8:abcd::123/64` जैसे ब्लॉक को उस नेटवर्क में बदलता है जिसका आप वास्तव में मतलब रखते हैं। यह host-address input को normalize करता है, canonical subnet दिखाता है, और वे boundaries उजागर करता है जिनकी जरूरत firewall rules लिखते, ranges document करते या allocation के आकार की जांच करते समय होती है।

## यह क्या दिखाता है

Result पहले quick overview देता है, फिर ब्लॉक को practical details में तोड़ता है: canonical CIDR, total और usable address counts, range start/end, और ब्लॉक के integer values। IPv4 के लिए netmask, wildcard mask और broadcast address भी मिलता है। IPv6 में workflow वही रहता है लेकिन लागू न होने वाले fields छिप जाते हैं।

## Canonicalization क्यों जरूरी है

कई pasted CIDR values में host bits होते हैं। मनुष्यों के लिए यह ठीक है, लेकिन routers, ACLs और documentation को आम तौर पर canonical network address चाहिए। Copy करने से पहले ब्लॉक rewrite होने से off-by-one assumptions config में पहुंचने से पहले पकड़े जा सकते हैं।

## व्यावहारिक नोट्स

- `/31` और `/32` IPv4 blocks को पूरी तरह usable माना जाता है, जो modern point-to-point और host-route usage से मेल खाता है।
- IPv6 blocks broadcast concept बनाए बिना पूरा address space और usable range बताते हैं।
- सब कुछ browser में locally चलता है, इसलिए internal subnets जांचते समय page से बाहर नहीं जाते।
