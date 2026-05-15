# CSR-Generator

Eine Certificate Signing Request (CSR) ist eine PKCS#10-Nachricht, die deinen oeffentlichen Schluessel, identifizierende Subject-Felder, optionale Erweiterungen wie Subject Alternative Names und eine Signatur mit dem passenden privaten Schluessel enthaelt. Zertifizierungsstellen verwenden die CSR, um ein X.509-Zertifikat auszustellen, ohne jemals deinen privaten Schluessel zu erhalten.

Dieser Generator erstellt CSRs direkt in deinem Browser. Du kannst ein neues RSA- oder ECDSA-Schluesselpaar erzeugen oder einen vorhandenen unverschluesselten privaten PEM-Schluessel importieren, wenn du ein Zertifikat fuer einen bereits bereitgestellten Schluessel erneuern musst.

## Wann du ihn verwendest

Verwende eine CSR, wenn eine Zertifizierungsstelle ein TLS-, S/MIME-, Clientauthentifizierungs- oder internes Dienstzertifikat ausstellen oder erneuern soll. Die CSR weist den Besitz des privaten Schluessels nach und enthaelt die oeffentlichen Identitaetsinformationen, die im Zertifikat erscheinen sollen.

Bei oeffentlichen TLS-Zertifikaten gehoeren Hostnamen in Subject Alternative Names. Der Common Name ist weiterhin nuetzlich fuer Lesbarkeit und Altsysteme, aber moderne Clients validieren DNS-Namen und IP-Adressen aus SAN.

## So erzeugst du eine CSR

Waehle, ob du einen neuen Schluessel erzeugen oder einen vorhandenen privaten Schluessel importieren moechtest. Fuelle die Subject-Felder aus, die fuer deine Zertifikatsanforderung wichtig sind, und fuege dann SAN-Eintraege fuer DNS-Namen, IP-Adressen, E-Mail-Adressen oder URIs hinzu. Erzeuge die CSR und sende nur die CSR im PEM-Format an deine Zertifizierungsstelle.

Wenn dieses Tool einen neuen Schluessel erzeugt, lade den privaten Schluessel herunter und speichere ihn, bevor du die Seite verlaesst. Wenn du einen Schluessel importierst, erzeugt das Tool nur die CSR und exportiert den importierten privaten Schluessel nicht erneut.

## Hinweise zu Schluesseln und Formaten

RSA mit 2048 Bit ist breit kompatibel; 3072 oder 4096 Bit koennen fuer laenger gueltige interne Zertifikate bevorzugt werden. ECDSA P-256 ist kompakt und breit unterstuetzt, waehrend P-384 oder P-521 durch strengere Richtlinien erforderlich sein koennen. Der Importpfad fuer Schluessel unterstuetzt unverschluesselte PKCS#8-, RSA PRIVATE KEY- und EC PRIVATE KEY-PEM-Bloecke.

Private Schluessel sind sensibel. Fuege sie nicht in nicht vertrauenswuerdige Websites ein, sende sie nicht an Zertifizierungsstellen und committe sie nicht in die Versionsverwaltung. Dieses Tool laeuft lokal im Browser, aber dein betrieblicher Prozess braucht weiterhin sichere Schluesselspeicherung und Rotation.
