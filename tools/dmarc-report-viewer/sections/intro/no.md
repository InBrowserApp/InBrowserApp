## Slik leser du en aggregert DMARC-rapport

Åpne vedlegget fra en aggregert rapport som er sendt til `rua`-adressen i DMARC-posten din. Viseren støtter XML, GZIP og ZIP-filer med én XML-rapport. Du kan også lime inn XML-innholdet eller laste inn eksempelet. Rapportoversikten viser hvem som sendte rapporten, perioden i UTC og domenets publiserte policy. Filer og innlimt tekst behandles i nettleseren.

## Slik tolker du meldingsantallene

Hver kildepost grupperer meldinger med samme kilde-IP og vurderingsresultat. En post kan representere flere meldinger, og samme IP-adresse kan vises i flere poster. Totaltallene bygger på antall meldinger i hver rad. En melding består DMARC hvis SPF eller DKIM består og domenet samsvarer med det synlige From-domenet etter DMARC-reglene. Viseren teller en melding som ikke bestått bare når domenesamsvaret feiler for både SPF og DKIM. Ufullstendige opplysninger om domenesamsvar vises som ukjent.

## Hvorfor domenesamsvar, autentisering og tiltak kan være forskjellige

Utvid Opprinnelige autentiseringsresultater for å se rapporterte domener, resultater og DKIM-selektorer. SPF eller DKIM kan bestå for et annet domene selv om DMARC-kontrollen av domenesamsvar feiler. Mottakerens tiltak viser hvordan mottakeren håndterte en gruppe meldinger. Tiltaket kan avvike fra den publiserte policyen når mottakeren gjør et unntak. Filtrer på kilde-IP eller From-domene for å undersøke en avsender. Totaltallene endres ikke.

## Hvilke DMARC XML-formater støttes

Viseren leser aggregerte rapporter i henhold til RFC 9990, inkludert standardens DMARC-navnerom, og eldre rapporter basert på RFC 7489. RFC 9990 beskriver XML-formatet som oppsummerer autentisering og mottakerens tiltak i aggregerte rapporter. Hvis e-postsystemet pakker flere rapporter i ett arkiv, pakker du ut rapporten du vil undersøke og åpner den separat.
