## Vad är Subresource Integrity (SRI)?

Subresource Integrity (SRI) är en säkerhetsfunktion som gör det möjligt för webbläsare att verifiera att filer de hämtar (t.ex. från en CDN) inte har ändrats oväntat. Det fungerar genom att jämföra den kryptografiska hashen av en resurs med en hash som tillhandahålls i HTML:en.

**Hur det fungerar:**

1. Generera en kryptografisk hash av din resursfil
2. Inkludera hashen i integrity-attributet för script- eller link-taggar
3. Webbläsaren hämtar resursen och beräknar dess hash
4. Webbläsaren jämför den beräknade hashen med den tillhandahållna hashen
5. Om hasharna matchar laddas resursen; annars blockeras laddningen

**Fördelar:**

- **Säkerhet**: Skyddar mot illvilliga ändringar av tredjepartsresurser
- **CDN-skydd**: Säkerställer att CDN-serverade filer inte har manipulerats
- **Leveranskedjesäkerhet**: Validerar integriteten hos externa beroenden
- **Webbläsarstöd**: Brett stöd i moderna webbläsare

**Stödda algoritmer:**

- SHA-256 (rekommenderat minimum)
- SHA-384 (rekommenderat)
- SHA-512 (högsta säkerhet)
