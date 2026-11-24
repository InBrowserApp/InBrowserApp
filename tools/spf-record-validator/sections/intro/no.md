## Slik kontrollerer du en SPF-post

Lim inn verdien fra én DNS-post av typen TXT, med `v=spf1` først, og velg Kontroller syntaksen. Hvis DNS viser TXT-verdien som flere strenger i anførselstegn, setter du dem sammen i riktig rekkefølge og beholder mellomrommene i strengene. Verktøyet viser hver mekanisme og modifikator og markerer syntaksfeil ved teksten det gjelder. Inndataene blir i nettleseren.

## Slik fungerer SPF-mekanismer og kvalifikatorer

Med SPF (Sender Policy Framework) kan et domene angi hvilke servere som får sende e-post på vegne av det. Mottakerserveren kontrollerer mekanismene i rekkefølge. Eksempelet `v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all` kontrollerer først en IPv4-blokk og en leverandørs SPF-policy før avsluttende `-all`. Kvalifikatoren angir resultatet for en mekanisme som samsvarer: pass (`+`), fail (`-`), softfail (`~`) eller neutral (`?`). Standardkvalifikatoren er `+`. Modifikatorer som `redirect=` bruker likhetstegn og har ingen kvalifikator.

## Hva antallet ledd med DNS-oppslag betyr

RFC 7208 tillater opptil 10 ledd som utløser DNS-oppslag under en SPF-evaluering. Tallet her viser antallet mulige ledd i posten du limte inn, inkludert `a`, `mx`, `include`, `exists`, `ptr` og en aktiv `redirect`. En `include` eller `redirect` kan føre til flere ledd, og en mekanisme som samsvarer, kan avslutte evalueringen tidlig. Undersøk den publiserte TXT-posten og domenene den viser til for å bekrefte aktiv SPF-policy og det totale antallet ledd med DNS-oppslag.
