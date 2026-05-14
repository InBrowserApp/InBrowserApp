## Wat is Argon2?

Argon2 is een algoritme voor wachtwoordhashing dat is ontworpen om offline wachtwoordkraken duur te maken. Het combineert herhaalde berekening met configureerbare geheugenkosten, zodat aanvallers voor elke wachtwoordpoging zowel tijd als geheugen nodig hebben.

**Waarom Argon2id meestal de standaardkeuze is:**

- Het biedt voor de meeste systemen voor wachtwoordopslag een betere balans tussen weerstand tegen side-channel-aanvallen en GPU-kraken dan Argon2i of Argon2d
- De gecodeerde uitvoer bewaart het algoritme, de versie, het geheugen, de iteratie, de paralleliteit, de salt en de hash in een draagbare string
- Een unieke willekeurige salt voorkomt dat identieke wachtwoorden identieke opgeslagen hashes opleveren
- Geheugen- en iteratie-instellingen kunnen worden verhoogd naarmate je verificatieomgeving sneller wordt

**Zo gebruik je deze tool:**

1. Voer het wachtwoord in dat je wilt hashen.
2. Behoud de gegenereerde salt of maak een nieuwe willekeurige salt.
3. Kies de Argon2-variant en stem geheugen, iteraties, paralleliteit en hashlengte af op het systeem dat de hash zal controleren.
4. Genereer de gecodeerde hash en sla die volledige string op in de database van je applicatie.

**Beveiligingsnotities:**

- Sla het platte wachtwoord niet op en log het niet.
- Gebruik voor elk wachtwoord een nieuwe willekeurige salt.
- Gebruik het optionele geheim alleen als je verificatiesysteem ook hetzelfde geheim heeft; anders kan de hash later niet worden gecontroleerd.
- Kies bij voorkeur de hoogste geheugen- en iteratie-instellingen waarbij de aanmeldvertraging voor echte gebruikers acceptabel blijft.
