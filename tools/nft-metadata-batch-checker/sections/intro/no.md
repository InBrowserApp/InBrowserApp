## Valider NFT-metadata i JSON før minting

Velg **Lokale filer** for å kontrollere enkeltstående JSON-filer eller en samlingsmappe på enheten din. Verktøyet rapporterer ugyldig JSON og vanlige metadataproblemer for hvert element, blant annet tomme navn, manglende bilder, ugyldige beskrivelser og feilformede attributter. Bruk **Må gjennomgås** for å finne elementer som må rettes, eller last ned hele rapporten som JSON.

## Kontroller token-URI-er samlet

Under **Token-URI-er** limer du inn én metadataadresse per linje. For nummererte samlinger bruker du **URI-mønster** med en plassholder som `https://example.com/metadata/{id}.json`. Angi første og siste ID for å kontrollere et intervall som inkluderer begge. Desimalformatet bruker ID-en slik den er skrevet. **ERC-1155 heks** skriver hver ID som 64 små heksadesimale tegn med innledende nuller, slik det er angitt for ERC-1155-erstatningen av `{id}`.

## Kontroller lenker til NFT-bilder og animasjoner

Slå på **Kontroller medietilgjengelighet** for å kontrollere `image`- og `animation_url`-lenker. Velg hele den lokale mappen for å ta med medier som er angitt med relative stier. Nettleseren kan også kontrollere HTTP-, IPFS- og Arweave-ressurser. En gatewayfeil, tidsavbrudd eller begrensning mellom opphav kan gjøre at en lenke ikke kan bekreftes. Kontroller disse lenkene i gatewayen eller markedsplassen du bruker. Kontroll av lokale filer skjer i nettleseren, mens URI-kontroller kontakter den aktuelle verten eller gatewayen.

Se [OpenSeas metadataveiledning](https://docs.opensea.io/docs/metadata-standards) og [ERC-1155-metadataspesifikasjonen](https://eips.ethereum.org/EIPS/eip-1155#metadata) for feltdefinisjoner og erstatning i token-URI-er.
