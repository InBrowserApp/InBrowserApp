## Uppskatta lagringskostnader för Filecoin Onchain Cloud

Ange datastorlek, **Lagringstid (dagar)** och antal **Kopior**. Kalkylatorn uppskattar kostnaden för att lagra en ny datamängd per kopia med Filecoin Warm Storage Service. Den visar månadstariffen för lagring och bevistjänst, utgiften för den valda perioden samt avgifter för att skapa datamängderna och lägga till pieces. Beloppen anges i USDFC. Filecoins prismånad är 30 dagar.

## Så beräknas lagringsuppskattningen

Varje aktiv datamängd betalar en storleksbaserad lagringstariff plus en fast avgift för Proof of Data Possession (PDP). Med exempelvis en lagringstariff på 2,50 USDFC per TiB och en bevisavgift på 0,12 USDFC per kopia kostar en TiB med två kopior cirka 5,24 USDFC per 30 dagar. Uppskattningen använder den angivna datastorleken. Filecoin härleder den exakta debiterade storleken från databärande löv, vilket kan lägga till upp till 31 byte per piece.

## Planera uppladdningsavgifter och återbetalningsbar reserv

Öppna **Uppladdningsdetaljer** för att ange hur många pieces och uppladdningsbatcher varje kopia innehåller. Uppskattningen börjar med en batch per kopia. Lämna antalet pieces tomt för att uppskatta minimum utifrån Synapse SDK:s uppladdningsgräns på 63,5 GiB, eller ange de faktiska antalen. Varje kopia har en egen avgift för att skapa datamängden, och tillägg av pieces har en grundavgift per batch plus en avgift per piece. Livscykelreserven är ett saldo som tjänsten håller för att täcka operationer. Den visade reserven är separat från de beräknade utgifterna och oanvända medel frigörs efter slutavräkning. Uppskattningen omfattar en ny uppladdning och dess lagringsperiod. Hämtning och senare operationer har egna avgifter. Se [storleksbegränsningarna i Synapse SDK](https://docs.filecoin.cloud/developer-guides/synapse/#size-constraints).

## Var Filecoin-tarifferna kommer ifrån

Sidan räknar med de daterade referenstarifferna som visas intill resultatet. Välj **Uppdatera huvudnätstariffer** för att läsa Warm Storages priskontrakt via en offentlig Filecoin RPC. Webbläsaren använder de returnerade tarifferna och visar blocket de kommer från. Du kan beräkna med referenstarifferna även när förfrågan inte är tillgänglig.

Läs [Filecoins guide till lagringskostnader](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/) för exakta debiterade storlekar, kontospecifik finansiering och hela avgiftslistan.
