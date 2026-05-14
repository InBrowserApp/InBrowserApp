## What is a JWT decoder and verifier?

JSON Web Token तीन base64url segments वाली एक compact string होती है: एक header, एक payload, और एक signature। यह tool आपके browser में header और payload को decode करता है ताकि आप token structure को server पर भेजे बिना inspect कर सकें।

Signature verification जांचता है कि token उस key और algorithm से signed है या नहीं जिसकी आप अपेक्षा करते हैं। HS256, HS384, या HS512 tokens के लिए shared secret उपयोग करें। RS, PS, और ES tokens के लिए PEM public key, JWK, या JWKS उपयोग करें।

## When to use it

Decoder का उपयोग authentication flows debug करते समय, OAuth या OpenID Connect claims check करते समय, environments compare करते समय, या यह confirm करते समय करें कि backend expected audience, issuer, subject, expiration, और key identifier values issue कर रहा है।

Verification का उपयोग तब करें जब आपके पास matching secret या public key हो और आपको confirm करना हो कि header, payload, और signature अब भी साथ belong करते हैं। Tool `exp`, `nbf`, और `iat` को भी highlight करता है ताकि common clock और expiry issues तुरंत visible हों।

## Security notes

JWT payloads केवल encoded होते हैं, encrypted नहीं। Token वाला कोई भी व्यक्ति इसके claims पढ़ सकता है, जब तक token एक अलग encrypted JWE न हो, जिसे यह tool process नहीं करता।

Shared machines पर production tokens या private secrets paste न करें। Tool आपके browser में locally चलता है और token या verification material store नहीं करता, लेकिन safest workflow फिर भी जहां संभव हो short-lived test tokens और public keys का उपयोग करना है।
