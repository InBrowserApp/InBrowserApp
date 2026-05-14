## Wat is MurmurHash3 (x86 128-bit)?

MurmurHash3 is een snel, niet-cryptografisch hash-algoritme dat is ontworpen
voor herhaalbare, goed verdeelde checksums. De x86 128-bit-variant geeft een
waarde van 16 bytes terug, meestal weergegeven als 32 hexadecimale tekens.
Daardoor past deze variant beter dan 32-bit-hashes wanneer je een bredere
identifier wilt voor grote verzamelingen records, bestanden of cachesleutels.

**Waar dit helpt:**

- **Hashtabellen en sharding**: Maak stabiele sleutels voor buckets, partities
  of opzoektabellen.
- **Deduplicatie**: Vergelijk grote verzamelingen tekst of bestanden met
  compacte 128-bit-vingerafdrukken voordat je diepere controles uitvoert.
- **Cachesleutels**: Maak deterministische identifiers voor build-artefacten,
  getransformeerde data of gegenereerde content.
- **Integriteitscontroles zonder beveiligingsdoel**: Detecteer onbedoelde
  wijzigingen tijdens opslag of overdracht wanneer cryptografische garanties
  niet nodig zijn.

**Seedgedrag:**

De optionele seed is een niet-ondertekende 32-bit-waarde. Gebruik dezelfde seed
wanneer resultaten moeten overeenkomen met een ander systeem, en laat deze op
`0` staan wanneer je geen specifieke compatibiliteitseis hebt. Decimale waarden
en hexadecimale waarden met `0x` worden geaccepteerd; grotere waarden worden
teruggebracht tot hetzelfde 32-bit-bereik dat het algoritme gebruikt.

**Veiligheidsnotities:**

MurmurHash3 is geen algoritme voor wachtwoordhashing, ondertekening of
manipulatiebestendige verificatie. Gebruik SHA-256, HMAC of een tool voor
wachtwoordhashing wanneer de uitvoer beveiligingseigenschappen nodig heeft.
Deze tool is het meest geschikt voor lokaal, offline, prestatiegericht hashen
waarbij snelheid en stabiele distributie belangrijker zijn dan weerstand tegen
aanvallen.
