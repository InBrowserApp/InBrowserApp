## Wat is een legacy Motorola-systeemsleutel?

Een softwarematige systeemsleutel is een `.KEY`-bestand waarmee compatibele Motorola-programmeersoftware beveiligde instellingen van trunkingsystemen kan bewerken. Deze generator reproduceert het op BatLabs gebaseerde legacyformaat voor een systeem-ID. Een systeemsleutel verschilt van een sleutel voor de versleuteling van radioverkeer en verleent op zichzelf geen toegang tot een radionetwerk.

## Zo gebruik je deze generator

1. Voer een systeem-ID in met 1–4 hexadecimale cijfers (`0–9`, `A–F`), zonder het voorvoegsel `0x`. Kleine letters worden geaccepteerd en korte ID's worden aangevuld met voorloopnullen: `ab` wordt `00AB`.
2. Controleer de genormaliseerde ID, bestandsnaam en hexadecimale voorvertoning.
3. Download het binaire `.KEY`-bestand en laad het in compatibele oudere programmeersoftware. Het bestand is 27 bytes groot; systeem-ID `1234` levert `SYS01234.KEY` op.

## Compatibiliteitsbeperkingen

Deze tool volgt een gepubliceerd legacyformaat; de compatibiliteit hangt af van de programmeersoftware. De tool ondersteunt geen ASTRO 25 Portable CPS (inclusief XTS5000), APX CPS of Advanced System Keys (ASK). Overeenstemming met het referentieformaat op byteniveau bevestigt geen compatibiliteit met een bepaalde radio of CPS-versie.

## Privacy

Het genereren, valideren en bekijken van bestanden gebeurt lokaal in je browser. Je systeem-ID en de gegenereerde sleutel worden niet naar een server verzonden.
