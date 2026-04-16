## Base32 क्या है?

Base32 तब उपयोगी है जब केवल टेक्स्ट वाला या case-insensitive चैनल बाइनरी डेटा ले जाना चाहता है, जैसे OTP secrets, DNS-safe tokens या exported configuration values. यह encoding layer है, security layer नहीं है.

## इसका उपयोग कब करें

- Base32 secrets या tokens को उनके original bytes में decode करने के लिए.
- TOTP setup, integration exports या config files से कॉपी किए गए values को inspect करने के लिए.
- यह जांचने के लिए कि pasted Base32 data उपयोग से पहले valid characters और सही padding रखता है या नहीं.

## किन बातों का ध्यान रखें

- Base32, Base64 की तुलना में data size को ज्यादा बढ़ाता है.
- यह original value को encrypt या hide नहीं करता.
- कुछ systems `=` padding छोड़ देते हैं, लेकिन invalid characters फिर भी decode error पैदा करते हैं.
