## Wat is SHA-1?

SHA-1 (Secure Hash Algorithm 1) is een cryptografische hashfunctie die een 160-bit (20-byte) hashwaarde produceert, doorgaans weergegeven als een 40-karakter hexadecimaal getal. Het is ontworpen door de NSA en gepubliceerd door NIST in 1995 als onderdeel van de Digital Signature Standard.

**Belangrijkste kenmerken:**

- **Deterministisch**: Dezelfde invoer produceert altijd dezelfde hash
- **Snelle berekening**: Snel te berekenen voor elke gegeven invoer
- **Lawine-effect**: Kleine veranderingen in invoer produceren drastisch verschillende uitvoer
- **Onomkeerbaar**: Computationeel onhaalbaar om de hash om te keren om de oorspronkelijke invoer te vinden
- **Botsingsgevoelig**: Bekende kwetsbaarheden maken het mogelijk om botsingen te vinden

**Beveiligingsstatus:**
⚠️ **SHA-1 is cryptografisch gebroken en mag niet worden gebruikt voor beveiligingskritische toepassingen**. Theoretische aanvallen werden gedemonstreerd in 2005, en praktische botsingsaanvallen werden bereikt in 2017.

**Veelvoorkomende toepassingen (historisch):**

- Digitale handtekeningen en certificaten (verouderd)
- Git versiebeheersysteem (voor compatibiliteit)
- Legacy systemen die SHA-1 vereisen
- Bestandsintegriteitsverificatie (niet beveiligingskritisch)
- Proof-of-work algoritmes (sommige oudere cryptocurrencies)

**Aanbevolen alternatieven:**

- SHA-256 of SHA-3 voor nieuwe toepassingen
- SHA-512 voor hoge beveiligingseisen
