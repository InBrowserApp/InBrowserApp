## Was ist Subresource Integrity (SRI)?

Subresource Integrity (SRI) ist eine Sicherheitsfunktion, die es Browsern ermöglicht zu überprüfen, dass Dateien, die sie abrufen (z.B. von einem CDN), nicht unerwartet verändert wurden. Es funktioniert durch Vergleich des kryptographischen Hashes einer Ressource mit einem im HTML bereitgestellten Hash.

**Wie es funktioniert:**

1. Erstellen Sie einen kryptographischen Hash Ihrer Ressourcendatei
2. Fügen Sie den Hash in das integrity-Attribut von script- oder link-Tags ein
3. Browser ruft die Ressource ab und berechnet ihren Hash
4. Browser vergleicht berechneten Hash mit bereitgestelltem Hash
5. Wenn Hashes übereinstimmen, wird Ressource geladen; sonst wird Laden blockiert

**Vorteile:**

- **Sicherheit**: Schützt vor bösartigen Änderungen an Drittanbieter-Ressourcen
- **CDN-Schutz**: Stellt sicher, dass CDN-bereitgestellte Dateien nicht manipuliert wurden
- **Supply-Chain-Sicherheit**: Validiert Integrität externer Abhängigkeiten
- **Browser-Unterstützung**: Weitgehend unterstützt in modernen Browsern

**Unterstützte Algorithmen:**

- SHA-256 (empfohlenes Minimum)
- SHA-384 (empfohlen)
- SHA-512 (höchste Sicherheit)
