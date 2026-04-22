## Base32 क्या है?

Base32 तब उपयोगी है जब केवल टेक्स्ट वाला या case-insensitive चैनल बाइनरी डेटा ले जाना चाहता है, जैसे OTP secrets, DNS-safe tokens या exported configuration values. यह encoding layer है, security layer नहीं है.

## इसका उपयोग कब करें

- केवल टेक्स्ट स्वीकार करने वाले चैनलों में भेजने से पहले bytes, text या files को Base32 में एन्कोड करना।
- उन सिस्टमों के लिए OTP secrets, exported settings या binary blobs तैयार करना जो Base32 input की अपेक्षा करते हैं।
- raw file bytes को transport, logs या manual entry के लिए आसानी से copy होने वाली string में बदलना।

## किन बातों का ध्यान रखें

- Base32, Base64 की तुलना में data size को ज्यादा बढ़ाता है.
- यह original value को encrypt या hide नहीं करता.
- कुछ सिस्टम `=` padding मांगते हैं, जबकि कुछ बिना padding वाला output स्वीकार करते हैं, इसलिए receiver की अपेक्षा के मुताबिक रखें।
