## Wat is HMAC?

HMAC (Hash-based Message Authentication Code) is een cryptografisch mechanisme dat een geheime sleutel combineert met een hash-functie om zowel de data-integriteit als de authenticiteit van een bericht te verifiëren.

**Hoe het werkt:**

1. De geheime sleutel wordt gecombineerd met het bericht
2. Een hash-functie (zoals SHA-256) verwerkt de gecombineerde gegevens
3. Het resultaat is een authenticatiecode van vaste grootte

**Veelvoorkomende gebruikssituaties:**

- **API-authenticatie**: Ondertekening van API-verzoeken om de afzender te verifiëren
- **JWT-tokens**: Gebruikt in HS256/HS384/HS512-algoritmen
- **Berichtverificatie**: Zorgen dat gegevens niet zijn gemanipuleerd
- **Webhook-handtekeningen**: Validatie van webhook-payloads

**Beveiligingsnotities:**

- Gebruik altijd een sterke, willekeurige geheime sleutel
- Houd uw geheime sleutel vertrouwelijk
- SHA-256 of hoger wordt aanbevolen voor nieuwe applicaties
- SHA-1 wordt als zwak beschouwd en moet worden vermeden voor beveiligingskritische toepassingen
