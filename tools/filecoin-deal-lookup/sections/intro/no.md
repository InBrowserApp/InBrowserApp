## Søk opp en Filecoin-lagringsavtale med Deal ID

Skriv inn numerisk **Deal ID** for en Storage Market-avtale på Filecoins hovednett, og velg **Søk opp avtale**. **Prøv et eksempel** laster inn en faktisk offentlig post slik at du kan se status, leverandør, kunde, datoer og Piece CID. Oppslaget dekker Storage Market-avtaler. Filecoin Onchain Cloud bruker en egen datasett-ID.

## Slik leser du statusen for en Filecoin-avtale

En aktiv avtale har en registrert aktivering og den planlagte slutten ligger fortsatt i fremtiden. Venter betyr at avtalen avventer aktivering før planlagt start. Oppslaget viser også tilfeller der starten er passert uten aktivering, avtalen er utløpt eller markedstilstanden registrerer at den er straffet. Start- og sluttepokene kommer fra avtaleforslaget. UTC-datoene beregnes ut fra kjedens epokeplan.

## Sammenlign avtalens Piece CID med filen din

Piece CID er commitmenten som er registrert for Filecoin-piece. Kopier den for å sammenligne med en commitment beregnet fra din lokale fil eller CAR med Filecoin Piece CID-kalkulatoren. Resultatet viser også utfylt piece-størrelse, målt etter Filecoins piece-utfylling. En verifisert avtale har verifiseringsflagget Filecoin Plus.

## Finn eldre Filecoin-avtaler

Nettleseren spør først gjeldende markedstilstand på Filecoins hovednett. Etter at en post forlater denne tilstanden, kan viseren vise de opprinnelige vilkårene Filfox har indeksert og merke dem som en historisk post. Vilkårene omfatter planlagte datoer og parter. **Vis på Filfox** åpner blokkutforskeren for samme Deal ID.

Se [Filecoin Storage Markets RPC-referanse](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal) for feltene kjeden returnerer.
