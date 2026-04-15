वर्तमान बैच को किसी दूसरी सेवा पर भेजे बिना अपने ब्राउज़र में ही KSUID जनरेट करें। यह टूल तब उपयोगी है जब आपको ऐसे identifiers चाहिए जो distributed systems में unique रहें और साथ ही logs, feeds, imports, या ordered records के लिए creation time के अनुसार लगभग sort भी हो सकें.

## KSUID क्यों उपयोग करें

KSUID एक 32-बिट timestamp और 128 बिट random data को मिलाकर 27-अक्षरों की Base62 string के रूप में encode करता है। इससे हर ID compact, URL-friendly और store करने में आसान रहती है, जबकि embedded timestamp की वजह से नई values आमतौर पर पुरानी values के बाद sort होती हैं.

## Current Time या Custom Time चुनें

Production data, demos, या सामान्य batch generation के लिए नई IDs चाहिए हों तो current time इस्तेमाल करें। Reproducible fixtures, backfilled records, migration samples, या किसी खास समय पर बनी हुई दिखने वाली test cases के लिए custom timestamp चुनें.

## Export से पहले क्या जानना चाहिए

KSUID सिर्फ second-level precision रखता है, इसलिए millisecond वाली कोई भी input उस second की शुरुआत तक round down हो जाती है। एक ही second में बनी IDs फिर भी unique रहती हैं, लेकिन उनकी final ordering random payload से भी प्रभावित होती है। इसलिए KSUID को strictly sequential नहीं, बल्कि time-sortable ID के रूप में समझना बेहतर है.
