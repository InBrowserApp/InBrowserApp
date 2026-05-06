# CRC-kontrollsumkalkulator

CRC-kontrollsummer (Cyclic Redundancy Check) er kompakte verdier som brukes til
å oppdage utilsiktede dataendringer. De er vanlige i nettverksrammer,
arkivformater, innebygde protokoller, fastvareoppdateringer og arbeidsflyter for
filintegritet der en rask feildeteksjonsverdi er mer nyttig enn en kryptografisk
signatur.

## Når du bør bruke den

Bruk denne kalkulatoren når du må sammenligne CRC-verdier fra dokumentasjon,
maskinvareprotokoller, filformater eller et annet system. Lim inn tekst for
raske kontroller, eller importer en fil når kontrollsummen må beregnes fra den
nøyaktige byte-strømmen.

## Støttede varianter

Verktøyet beregner de vanlige variantene fra det eldre CRC-verktøyet i
InBrowser.App: CRC-1, CRC-8, CRC-8 1-Wire, CRC-8 DVB-S2, CRC-16,
CRC-16 CCITT, CRC-16 Modbus, CRC-16 Kermit, CRC-16 XModem, CRC-24, CRC-32,
CRC-32 MPEG-2, CRCJAM og flere CRC-64-modeller, inkludert ECMA-182, GO-ISO, MS,
NVME, REDIS, WE og XZ.

## Ting å passe på

Navn på CRC-varianter er viktige. De samme inndataene kan gi ulike verdier
avhengig av polynom, startverdi, refleksjonsinnstillinger og endelig XOR. Hvis
du skal matche en protokoll eller leverandørspesifikasjon, velger du resultatet
der variantnavnet samsvarer med spesifikasjonen, i stedet for å behandle alle
CRC-bredder som utskiftbare.

CRC er laget for å oppdage utilsiktede feil, ikke for passordlagring, signaturer
eller manipulasjonssikkerhet. For sikkerhetssensitiv verifisering bør du bruke
en kryptografisk hash eller signaturarbeidsflyt i stedet.
