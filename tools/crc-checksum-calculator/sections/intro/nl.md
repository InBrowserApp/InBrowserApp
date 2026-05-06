# CRC-checksumcalculator

CRC-checksums (Cyclic Redundancy Check) zijn compacte waarden waarmee
toevallige gegevenswijzigingen kunnen worden gedetecteerd. Ze komen veel voor
in netwerkframes, archiefformaten, embedded protocollen, firmware-updates en
workflows voor bestandsintegriteit waarbij een snelle foutdetectiewaarde
nuttiger is dan een cryptografische handtekening.

## Wanneer je het gebruikt

Gebruik deze calculator wanneer je CRC-waarden moet vergelijken uit
documentatie, hardwareprotocollen, bestandsindelingen of een ander systeem.
Plak tekst voor snelle controles, of importeer een bestand wanneer de checksum
moet worden berekend uit de exacte bytestream.

## Ondersteunde varianten

De tool berekent de gangbare varianten uit de legacy CRC-tool van
InBrowser.App: CRC-1, CRC-8, CRC-8 1-Wire, CRC-8 DVB-S2, CRC-16, CRC-16 CCITT,
CRC-16 Modbus, CRC-16 Kermit, CRC-16 XModem, CRC-24, CRC-32, CRC-32 MPEG-2,
CRCJAM, en verschillende CRC-64-modellen, waaronder ECMA-182, GO-ISO, MS, NVME,
REDIS, WE en XZ.

## Aandachtspunten

Namen van CRC-varianten doen ertoe. Dezelfde invoer kan verschillende waarden
opleveren afhankelijk van polynoom, beginwaarde, reflectie-instellingen en
uiteindelijke XOR. Als je een protocol of leveranciersspecificatie wilt
matchen, kies dan het resultaat waarvan de variantnaam overeenkomt met die
specificatie, in plaats van elke CRC-breedte als onderling uitwisselbaar te
behandelen.

CRC is ontworpen voor detectie van toevallige fouten, niet voor
wachtwoordopslag, handtekeningen of manipulatiebestendige beveiliging. Gebruik
voor beveiligingsgevoelige verificatie in plaats daarvan een cryptografische
hash of een workflow met cryptografische handtekeningen.
