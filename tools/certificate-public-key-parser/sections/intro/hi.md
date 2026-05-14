## What is an X.509 certificate parser?

X.509 certificate एक signed document है जो public key को domain, service, organization, या person जैसी identity से जोड़ता है। TLS certificates, certificate-chain files, और कई S/MIME या signing workflows इस format का उपयोग करते हैं।

यह parser certificate और public-key material को सीधे आपके browser में पढ़ता है। यह PEM blocks, binary DER files, और base64 DER text inspect कर सकता है, फिर subject, issuer, serial number, validity window, signature algorithm, public-key algorithm, fingerprints, और common extensions दिखाता है।

जब आपको certificate fingerprint compare करना हो, यह check करना हो कि certificate expected host के लिए है या नहीं, Subject Alternative Names inspect करने हों, key usage confirm करना हो, या TLS और deployment issues debug करते समय public-key details extract करनी हों, तब इसका उपयोग करें।

यह tool trust chains validate नहीं करता या certificate authorities से संपर्क नहीं करता। यह आपके दिए गए certificate या public key में encoded content दिखाता है, इसलिए जब आपको revocation, chain, hostname, या live endpoint validation चाहिए हो, तो dedicated TLS scanner इस्तेमाल करें।

- Certificates install या rotate करने से पहले SHA-256 या SHA-1 fingerprints compare करें।
- Certificate material upload किए बिना SAN, key usage, extended key usage, और basic constraints review करें।
- जब कोई service आपको केवल public-key PEM या DER file देती है, तब standalone SPKI public keys inspect करें।
