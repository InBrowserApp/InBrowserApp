## Wat is Keccak?

Keccak is een familie van cryptografische hashfuncties die dient als basis voor de SHA-3 (Secure Hash Algorithm 3) standaard. Ontwikkeld door Guido Bertoni, Joan Daemen, Michaël Peeters en Gilles Van Assche, won het de NIST hashfunctie competitie in 2012.

**Belangrijkste kenmerken:**

- **Spons constructie**: Gebruikt een innovatief spons functie ontwerp met absorbeer- en uitkneep-fasen
- **Variabele uitvoerlengte**: Kan hash-uitvoer van elke gewenste lengte produceren
- **Hoge veiligheidsmarge**: Ontworpen met aanzienlijke veiligheidsreserves
- **Verschilt van SHA-1/SHA-2**: Gebaseerd op volledig verschillende wiskundige principes
- **Keccak[c=2d] variant**: Deze implementatie gebruikt de originele Keccak specificatie met capaciteit c = 2d (waarbij d de uitvoerlengte is)

**Keccak vs SHA-3 (FIPS 202) verschillen:**
🔍 **Belangrijke onderscheiding**: De originele Keccak en de gestandaardiseerde SHA-3 zijn **niet identiek**:

- **Originele Keccak**: Gebruikt capaciteit c = 2d en andere padding (Keccak padding: 0x01)
- **FIPS 202 SHA-3**: Gebruikt capaciteit c = 2d maar andere padding (SHA-3 padding: 0x06)
- **Domeinscheiding**: Het padding verschil zorgt ervoor dat Keccak en SHA-3 verschillende uitvoer produceren voor dezelfde invoer
- **Deze tool implementeert**: De **originele Keccak specificatie** met Keccak[c=2d] parametrisatie

**Veiligheidsstatus:**
✅ **Keccak wordt beschouwd als zeer veilig** zonder bekende praktische aanvallen. Het biedt uitstekende veiligheidsmarges en weerstand tegen verschillende cryptoanalytische technieken.

**Veelvoorkomende toepassingen:**

- Ethereum blockchain (gebruikt originele Keccak-256)
- Academisch onderzoek en cryptografische protocollen
- Applicaties die hash-uitvoer van variabele lengte vereisen
- Systemen die alternatieven voor de SHA-2 familie nodig hebben
- Blockchain en cryptocurrency implementaties

**Voordelen ten opzichte van traditionele hashes:**

- Fundamenteel ander ontwerp vermindert risico van gerelateerde aanvallen
- Flexibele uitvoerlengte (niet beperkt tot vaste groottes)
- Sterke theoretische veiligheidsbasis
- Weerstand tegen lengte-uitbreidingsaanvallen
- Uitstekende prestaties op verschillende platforms

**Technische opmerking:**

- **Keccak-256**: Produceert 256-bit uitvoer (meest voorkomende variant)
- **Capaciteitsformule**: c = 2d zorgt voor geschikt veiligheidsniveau
- **Ethereum gebruik**: Ethereum gebruikt specifiek originele Keccak-256, niet SHA3-256
