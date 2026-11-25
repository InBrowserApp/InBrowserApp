## Anslå lagringskostnader for Filecoin Onchain Cloud

Skriv inn datastørrelse, **Lagringstid (dager)** og antall **Kopier**. Kalkulatoren anslår kostnaden for å lagre et nytt datasett per kopi med Filecoin Warm Storage Service. Den viser månedlig pris for lagring og bevistjeneste, utgifter for den valgte perioden og gebyrer for å opprette datasettene og legge til pieces. Beløpene oppgis i USDFC. En prismåned hos Filecoin er 30 dager.

## Slik beregnes lagringsanslaget

Hvert aktive datasett betaler en størrelsesbasert lagringspris pluss et fast gebyr for Proof of Data Possession (PDP). Med en lagringspris på for eksempel 2,50 USDFC per TiB og et bevisgebyr på 0,12 USDFC per kopi koster én TiB med to kopier omtrent 5,24 USDFC per 30 dager. Anslaget bruker datastørrelsen du oppgir. Filecoin beregner den nøyaktige fakturerte størrelsen fra databærende blader, som kan legge til opptil 31 byte per piece.

## Planlegg opplastingsgebyrer og refunderbar reserve

Åpne **Opplastingsdetaljer** for å angi hvor mange pieces og opplastingspartier hver kopi skal inneholde. Anslaget starter med ett parti per kopi. La antallet pieces stå tomt for å anslå minimum ut fra opplastingsgrensen på 63,5 GiB i Synapse SDK, eller skriv inn de faktiske antallene. Hver kopi har sitt eget gebyr for opprettelse av datasett, og det å legge til pieces har et grunngebyr per parti pluss et gebyr per piece. Livssyklusreserven er en saldo tjenesten holder for å dekke operasjoner. Reserven som vises, er atskilt fra de anslåtte utgiftene, og ubrukte midler frigis etter sluttavregning. Anslaget dekker en ny opplasting og lagringsperioden. Henting og senere operasjoner har egne gebyrer. Se [størrelsesbegrensningene i Synapse SDK](https://docs.filecoin.cloud/developer-guides/synapse/#size-constraints).

## Hvor Filecoin-prisene kommer fra

Siden beregner med de daterte referanseprisene som vises ved resultatet. Velg **Oppdater hovednettpriser** for å lese Warm Storage-priskontrakten via en offentlig Filecoin RPC. Nettleseren bruker prisene som returneres og viser blokken de kommer fra. Du kan beregne med referanseprisene også når forespørselen ikke er tilgjengelig.

Les [Filecoins veiledning om lagringskostnader](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/) for nøyaktige fakturerte størrelser, kontospesifikk finansiering og den fullstendige gebyrlisten.
