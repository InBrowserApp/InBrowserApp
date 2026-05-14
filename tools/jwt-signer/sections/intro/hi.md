## JWT signer क्या है?

JWT signer header और payload को serialize करके, फिर उन्हें secret या private key से sign करके एक compact JSON Web Token बनाता है। परिणाम तीन भागों वाला `header.payload.signature` token होता है, जिसका उपयोग कई API, OAuth, और session systems करते हैं।

## इस tool का उपयोग कब करें

- API development, staging environments, और demos के लिए local test tokens बनाएं।
- तुलना करें कि अलग-अलग algorithms token header और signature को कैसे बदलते हैं।
- throwaway script लिखे बिना `sub`, `iss`, `aud`, `exp`, `iat`, `scope`, या custom application fields जैसे claims जोड़ें।
- HMAC shared secrets या PKCS#8 PEM या JWK form में RSA/ECDSA private keys के साथ tokens जनरेट करें।

## signed token का उपयोग करने से पहले क्या जांचें

- Algorithm को key type से मिलाएं: `HS*` shared secret का उपयोग करता है, `RS*` और `PS*` RSA private keys का उपयोग करते हैं, और `ES*` EC private keys का उपयोग करता है।
- जब receiving service उनकी अपेक्षा करे, तो expiry और audience claims जोड़ें।
- Production private keys को shared browsers और machines से दूर रखें। यह tool locally चलता है, लेकिन पहले से compromised device से keys की रक्षा नहीं कर सकता।
- याद रखें कि signing encryption नहीं है। जिसे भी token मिलता है, वह header और payload decode कर सकता है।
