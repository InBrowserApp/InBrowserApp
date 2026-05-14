AES डिक्रिप्शन उसी AES कुंजी सामग्री से एन्क्रिप्ट किए गए डेटा से plaintext वापस लाता है। यह टूल InBrowser.App AES Encryptor द्वारा बनाए गए JSON envelope के लिए बनाया गया है। Envelope algorithm, key derivation settings, salt, IV, ciphertext, और plaintext metadata को साथ रखता है, जबकि पासवर्ड या कच्ची कुंजी अलग रहती है।

सारा काम browser Web Crypto API के साथ स्थानीय रूप से होता है। एन्क्रिप्टेड JSON, पासवर्ड, कच्ची कुंजी, और डिक्रिप्ट किया गया परिणाम अपलोड नहीं किए जाते।

## इस टूल का उपयोग कब करें

इसका उपयोग तब करें जब कोई आपको `inbrowser-aes-v1` JSON envelope दे या जब आपको कोई note, token, configuration snippet, या फ़ाइल वापस चाहिए जिसे आपने पहले मेल खाते AES Encryptor page से एन्क्रिप्ट किया था।

अगर envelope पासवर्ड से बनाया गया था, तो वही पासवर्ड दर्ज करें और टूल संग्रहित PBKDF2 hash, iteration count, salt, AES mode, और key length का फिर से उपयोग करेगा। अगर envelope कच्ची कुंजी से बनाया गया था, तो envelope में दर्ज ठीक hexadecimal key length पेस्ट करें।

## व्यावहारिक नोट्स

AES-GCM एन्क्रिप्ट किए गए डेटा को authenticate करता है, इसलिए गलत keys या बदला हुआ JSON परिवर्तित plaintext लौटाने के बजाय विफल होना चाहिए। AES-CBC और AES-CTR संगत envelopes को डिक्रिप्ट कर सकते हैं, लेकिन वे अपने आप ciphertext को authenticate नहीं करते।

पासवर्ड या कच्ची कुंजी को JSON envelope से अलग रखें। जिसके पास envelope और key material दोनों हैं, वह plaintext वापस पा सकता है। फ़ाइल envelopes के लिए, वापस मिला download JSON में संग्रहित मूल फ़ाइल नाम और media type का उपयोग करता है।
