हैश टूल्स संग्रह माइग्रेट की गई हैशिंग utilities को एक साथ लाता है, ताकि आप किसी विशिष्ट टूल को खोलने से पहले सही एल्गोरिदम चुन सकें। इसमें रोजमर्रा के फाइल digests, legacy compatibility checks, keyed message authentication, Subresource Integrity strings, password hashing, password verification और तेज non-cryptographic checksums शामिल हैं।

## इन टूल्स का उपयोग कब करें

जब आपको टेक्स्ट या फाइल के लिए दोहराया जा सकने वाला fingerprint चाहिए, जैसे किसी डाउनलोड किए गए archive को प्रकाशित SHA-256 checksum से मिलाना, तब cryptographic digest टूल्स का उपयोग करें। जब परिणाम से यह साबित होना चाहिए कि shared secret रखने वाले व्यक्ति ने message बनाया या स्वीकृत किया है, तब HMAC का उपयोग करें। Password और key-derivation workflows के लिए Argon2, bcrypt, PBKDF2 या scrypt का उपयोग करें, जहां configurable cost raw speed से अधिक मायने रखती है।

## सुरक्षित रूप से चुनना

हर हैश सुरक्षा के लिए उपयुक्त नहीं होता। MD4, MD5 और SHA-1 legacy systems और compatibility checks के लिए उपयोगी हैं, लेकिन इन्हें नए security-sensitive integrity designs के लिए उपयोग नहीं करना चाहिए। CRC, Adler-32, MurmurHash, CityHash और xxHash तेज checksums या bucketing hashes हैं, tamper-resistant signatures नहीं। जब आप सुनिश्चित न हों, public checksums के लिए SHA-256, keyed verification के लिए HMAC-SHA-256 और password storage के लिए Argon2id या bcrypt को प्राथमिकता दें।

## Privacy और workflow

इस संग्रह के अलग-अलग टूल्स ब्राउज़र में चलते हैं। Text और files को चुना गया टूल local रूप से process करता है, जब तक कि वह टूल स्पष्ट रूप से public lookup behavior document न करे, जिसकी hash tools को जरूरत नहीं होती। Sensitive material के लिए, उपयोग के बाद generated values साफ करें और shared या recorded browser sessions में secrets paste करने से बचें।
