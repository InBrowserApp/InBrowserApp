## Wat is Subresource Integrity (SRI)?

Subresource Integrity (SRI) is een beveiligingsfunctie die browsers in staat stelt te verifiëren dat bestanden die ze ophalen (bijv. van een CDN) niet onverwacht zijn gewijzigd. Het werkt door de cryptografische hash van een bron te vergelijken met een hash die in de HTML wordt verstrekt.

**Hoe het werkt:**

1. Genereer een cryptografische hash van uw bronbestand
2. Voeg de hash toe aan het integrity-attribuut van script- of link-tags
3. Browser haalt de bron op en berekent de hash
4. Browser vergelijkt berekende hash met verstrekte hash
5. Als hashes overeenkomen, wordt bron geladen; zo niet, wordt laden geblokkeerd

**Voordelen:**

- **Beveiliging**: Beschermt tegen kwaadwillende wijzigingen van externe bronnen
- **CDN-bescherming**: Zorgt ervoor dat CDN-geserveerde bestanden niet zijn geknoeid
- **Supply chain beveiliging**: Valideert integriteit van externe afhankelijkheden
- **Browserondersteuning**: Breed ondersteund in moderne browsers

**Ondersteunde algoritmen:**

- SHA-256 (aanbevolen minimum)
- SHA-384 (aanbevolen)
- SHA-512 (hoogste beveiliging)
