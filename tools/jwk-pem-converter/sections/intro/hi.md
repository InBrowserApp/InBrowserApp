## JWK ↔ PEM रूपांतरण क्या है?

JWK (JSON Web Key) JSON आकार का key material है जिसका उपयोग JOSE/JWT, JWKS endpoints और serverless या browser configuration में होता है। Software इसे आसानी से पढ़ता है, लेकिन CLI और ऐसी infrastructure में यह कम स्वीकार्य होता है जो key files की अपेक्षा करती है।

PEM DER key data को BEGIN/END labels के साथ wrap करता है; OpenSSL, TLS tooling, API gateways और कई SDKs आम तौर पर यही format मांगते हैं।

यह converter इन formats को आपके browser में locally bridge करता है। यह RSA, EC (P-256/384/521) और OKP key containers संभालता है, JWK से शुरू करने पर public SPKI या private PKCS8 PEM चुनने देता है, और supported PEM blocks को pretty या compact JWK JSON में बदल सकता है।

जब आपको केवल verification या distribution चाहिए, public output का उपयोग करें। Private conversions screen और downloads में private key material दिखाते हैं, इसलिए result को secret की तरह संभालें और काम खत्म होने पर tab बंद करें।

- JWKS/JSON config और OpenSSL-style PEM files के बीच keys ले जाएँ।
- JWT verifiers, gateways या clients के साथ साझा करने से पहले public key निकालें।
- Key material को server पर upload किए बिना locally convert करें।
