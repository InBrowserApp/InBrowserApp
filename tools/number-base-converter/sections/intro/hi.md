यह टूल ब्राउज़र में ही पूर्णांकों को बाइनरी, ऑक्टल, दशमलव, हेक्साडेसिमल, Base32, Base36, Base62, Base64 और 2 से 64 तक के कस्टम बेस के बीच बदलता है। सभी गणनाएँ BigInt के साथ लोकल होती हैं, इसलिए बड़े मानों को सर्वर पर भेजे बिना जाँचा जा सकता है।

## कब उपयोग करें

जब वही पूर्णांक logs, protocols, IDs या specs में अलग-अलग alphabets के साथ दिखाई देता है, तब यह टूल उपयोगी है। किसी भी field को बदलते ही बाकी सभी fields तुरंत दुबारा गणना हो जाती हैं, इसलिए debugging, documentation और manual verification में मदद मिलती है।

## बेस के अंतर

Base 36 तक अक्षरों को case-insensitive माना जाता है। इससे ऊपर के bases में uppercase और lowercase अलग digits माने जाते हैं, और Base64 वाली row यहाँ byte-oriented Base64 text encoding नहीं बल्कि numeric alphabet `A-Z a-z 0-9 + /` का उपयोग करती है।

## ध्यान रखने वाली बातें

सिर्फ non-negative integers समर्थित हैं। शुरू के शून्य केवल formatting माने जाते हैं, इसलिए converted output normalize हो जाता है और आपने जो padding लिखी थी वह हट सकती है।
